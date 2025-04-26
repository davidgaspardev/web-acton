import os
import sys
import warnings
import json
from typing import List, Dict
from dotenv import load_dotenv
from langchain_openai import ChatOpenAI, OpenAIEmbeddings
from langchain.prompts import ChatPromptTemplate
from langchain.output_parsers.openai_functions import JsonOutputFunctionsParser
from langchain_core.utils.function_calling import convert_to_openai_function
from langchain_core.documents import Document
from langchain_community.document_loaders import PyPDFLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_community.vectorstores import FAISS
from pydantic import BaseModel, Field
from loader import *

# Load environment variables
load_dotenv()

# Initialize OpenAI chat
chat = ChatOpenAI(model="o4-mini")

# Question to document mapping
QUESTION_TO_DOC = {
    'diabetes': 'Diabetes.pdf',
    'hipertensao': 'Hipertensão.pdf',
    'obesidade': 'Obesidade.pdf',
    'ansiedade': 'Ansiedade.pdf',
    'idoso': 'Idoso.pdf',
    'medicamentos': 'Medicamentos.pdf',
}

class CondicoesQuiz(BaseModel):
    """Indica se o usuário possui cada condição de saúde relevante para o treino"""
    diabetes: bool = Field(description="Possui diabetes?")
    hipertensao: bool = Field(description="Possui hipertensão?")
    obesidade: bool = Field(description="Possui obesidade?")
    ansiedade: bool = Field(description="Possui ansiedade?")
    idoso: bool = Field(description="É idoso (acima de 60 anos)?")
    medicamentos: bool = Field(description="Utiliza medicamentos frequentes?")
    sedentario: bool = Field(description="É sedentário?")
    atividade_fisica: str = Field(description="Qual o nível de atividade física que o aluno já pratica regularmente?")
    possui_dores_ou_limitações: str = Field(description="Possui dores ou limitações físicas que possam modificar a estrutura dos treinos? Se sim, quais?")

def create_vectorstore(pdf_paths: List[str]) -> FAISS:
    """Creates a vectorstore from the loaded documents."""
    all_docs = []
    text_splitter = RecursiveCharacterTextSplitter(
        chunk_size=1000,
        chunk_overlap=100,
        length_function=len,
        add_start_index=True,
        is_separator_regex=False
    )
    
    for pdf_path in pdf_paths:
        try:
            documents = carrega_pdf(pdf_path)
            if documents:
                docs = text_splitter.split_documents(documents)
                all_docs.extend(docs)
        except Exception as e:
            print(f"Error processing {pdf_path}: {e}", file=sys.stderr)
            continue

    if not all_docs:
        empty_doc = Document(
            page_content="Documento base para prescrição de exercícios físicos.",
            metadata={'source': 'base_document'}
        )
        all_docs.append(empty_doc)

    try:
        return FAISS.from_documents(all_docs, OpenAIEmbeddings())
    except Exception as e:
        print(f"Error creating vectorstore: {e}", file=sys.stderr)
        return FAISS.from_documents([empty_doc], OpenAIEmbeddings())

def load_relevant_docs(condicoes: Dict[str, bool], base_dir: str) -> List[str]:
    """Loads only the relevant documents based on user conditions."""
    pdfs_relevantes = []
    
    if not any(condicoes.values()):
        return pdfs_relevantes
        
    for cond, has_cond in condicoes.items():
        if has_cond and cond.lower() in QUESTION_TO_DOC:
            pdf_path = os.path.join(base_dir, QUESTION_TO_DOC[cond.lower()])
            if os.path.exists(pdf_path):
                pdfs_relevantes.append(pdf_path)
    
    return pdfs_relevantes

def inferir_condicoes_com_ia(quizzes: List[Dict]) -> Dict[str, bool]:
    """Analyzes the quiz and infers user conditions using AI."""
    prompt = ChatPromptTemplate.from_messages([
        ('system', 'Você é um educador físico profissional experiente. Analise o questionário e identifique as condições de saúde do usuário.'),
        ('user', '{input}')
    ])
    
    chain = prompt | chat.bind(
        functions=[convert_to_openai_function(CondicoesQuiz)],
        function_call={'name': 'CondicoesQuiz'}
    ) | JsonOutputFunctionsParser()
    
    texto = '\n'.join([f"Pergunta: {q.get('question')}\nResposta: {q.get('answer')}" for q in quizzes])
    return chain.invoke({'input': texto})

def generate_ai_opinion(quizzes: List[Dict], client_name: str, base_dir: str = None) -> str:
    """Generates a personalized opinion based on quiz and user conditions."""
    if base_dir is None:
        base_dir = os.path.join(os.path.dirname(__file__), 'base_documents')
    
    # 1. Infer conditions from quiz
    condicoes = inferir_condicoes_com_ia(quizzes)
    print(f"[DEBUG] Condições inferidas: {condicoes}")
    
    # 2. Load relevant documents
    pdf_paths = load_relevant_docs(condicoes, base_dir)
    print(f"[DEBUG] PDFs relevantes: {pdf_paths}")
    
    # Create context from documents or use generic context
    context = "Documentos base para prescrição de exercícios físicos."
    if pdf_paths:
        try:
            vectorstore = create_vectorstore(pdf_paths)
            retriever = vectorstore.as_retriever()
            docs = retriever.invoke("Recomendações de exercícios e cuidados")
            context = "\n\n".join(doc.page_content for doc in docs)
        except Exception as e:
            print(f"Erro ao processar documentos: {e}", file=sys.stderr)
    
    # 3. Prepare data for prompt
    quiz_text = "\n".join([f"Pergunta: {q['question']}\nResposta: {q['answer']}" for q in quizzes])
    condicoes_str = ", ".join([k for k, v in condicoes.items() if v]) or "Nenhuma condição especial identificada"
    
    # 4. Generate response with exact format
    prompt = ChatPromptTemplate.from_template(
        """Você é um educador físico profissional com experiência em prescrição de treinos personalizados.
        Utilize o contexto técnico e científico abaixo para embasar sua resposta.
        
        Contexto técnico:
        {context}
        
        Questionário do aluno:
        {quiz}
        
        Condições identificadas:
        {condicoes}
        
        Gere um programa de treino completo em Markdown com EXATAMENTE este formato:
        
        ## Resumo do Treino do aluno {name}
        - Tipos de exercícios recomendados:
        - Quantidade de exercícios por treino:
        - Séries e repetições recomendadas:
        - Intensidade: (Baseada em % de 1 RM)
        - Percepção de Esforço (ex: leve a moderada)
        - Intervalo entre repetições e entre exercícios:
        - Frequência semanal indicada:
        - Progressão indicada de treinos:
        
        ## CUIDADOS
        Neste campo você deve usar sua habilidade para listar os pontos mais importantes a serem considerados para o aluno, principalmente no que diz respeito aos cuidados a serem tomados nas execuções dos exercícios. Se baseie nessas condições previamente geradas.
        
        ## Explicação sobre o treino
        Neste campo você deve usar sua habilidade para explicar o porquê do treino que você indicou. O texto deve ser claro e objetivo, com uma linguagem simples, como se você tivesse explicando a um educador físico recém-formado o porquê desse treino.
        
        ## Observações
        Neste campo você deve usar sua habilidade para listar os pontos mais importantes a serem considerados para um educador físico recém-formado o porquê desse treino.
        """
    )
    
    chain = prompt | chat
    response = chain.invoke({
        "context": context,
        "quiz": quiz_text,
        "condicoes": condicoes_str,
        "name": client_name
    })
    
    return response.content

if __name__ == "__main__":
    try:
        input_data = json.load(sys.stdin)
        quizzes = input_data["quizzes"]
        client_name = input_data["client_name"]
        
        response = generate_ai_opinion(quizzes, client_name)
        print(response)
        
    except Exception as e:
        # Filter out 'Ignoring wrong pointing object' from stderr output
        err_msg = str(e)
        if hasattr(e, 'args') and e.args:
            err_msg = str(e.args[0])
        # Remove known noisy lines
        filtered = []
        for line in err_msg.splitlines():
            if "Ignoring wrong pointing object" not in line:
                filtered.append(line)
        clean_err = "\n".join(filtered)
        if not clean_err.strip():
            clean_err = "Erro desconhecido ao gerar opinião da IA."
        print(f"Erro ao gerar opinião da IA: {clean_err}", file=sys.stderr)
        sys.exit(1)
