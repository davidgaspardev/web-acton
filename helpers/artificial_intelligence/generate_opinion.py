import os
import sys
import warnings
import json
from typing import List, Dict
from enum import Enum
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

class Objetivos(Enum):
    """Enum for different training objectives."""
    emagrecimento = "Perder Peso"
    ganho_massa_muscular = "Ganho de massa muscular"
    condicionamento_fisico = "Qualidade de vida"

class Tipos_treino(Enum):
    """Indica qual o tipo de treino recomendado, baseando no objetivo do cliente."""
    viva_leve = "Para quem quer perder peso (emagrecimento)"
    vida_ativa = "Para os que possuem objetivo de Ganho de massa muscular"
    viver_bem = "Para os que buscam Qualidade de vida"


class CondicoesQuiz(BaseModel):
    """Indica se o usuário possui cada condição de saúde relevante para o treino"""
    diabetes: bool = Field(description="Possui diabetes?")
    hipertensao: bool = Field(description="Possui hipertensão?")
    obesidade: bool = Field(description="Possui obesidade?")
    ansiedade: bool = Field(description="Possui ansiedade?")
    idoso: bool = Field(description="É idoso (acima de 60 anos)?")
    medicamentos: bool = Field(description="Utiliza medicamentos frequentes?")
    sedentario: bool = Field(description="É sedentário?")
    possui_dores_ou_limitações: str = Field(description="Possui dores ou limitações físicas que possam modificar a estrutura dos treinos? Se sim, quais?")
    atividade_fisica: str = Field(description="De acordo com a pergunta 'Você está treinando atualmente ?', deve trazer a resposta informada no quiz.")
    objetivo: Objetivos = Field(description="Qual o objetivo principal do aluno com os treinos?")
    observacoes_extras: bool = Field(description="Possui alguma nova condição de saúde relevante?")

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

def carrega_treinos(base_dir: str, condicoes: Dict) -> Dict:
    """
    Carrega o arquivo treinos.csv e define tipo, nível e fase do aluno com base nas condições do quiz.
    condicoes: dicionário com pelo menos os campos 'objetivo' e 'atividade_fisica'.
    Retorna um dicionário com tipo, nível, fase e descrição.
    """
    import csv
    # Mapear objetivo para tipo
    objetivo = condicoes.get('objetivo', '').lower()
    atividade_fisica = condicoes.get('atividade_fisica', '').lower()

    # Mapeamento de objetivo para tipo
    objetivo_tipo = {
        'perder peso': 'viver_bem',
        'ganho de massa muscular': 'vida_ativa',
        'qualidade de vida': 'viva_leve',
    }
    tipo = objetivo_tipo.get(objetivo, 'viva_leve')

    # Mapeamento de atividade física para nível
    nivel_map = {
        'nunca treinei': 1,
        'iniciante': 1,
        'treino há 6 meses': 2,
        'treino há 1 ano': 3,
        'treino há 1,5 anos': 4,
        'treino há 2 anos': 5,
        'treino há 3 anos': 6,
    }
    nivel = 1
    for chave, val in nivel_map.items():
        if chave in atividade_fisica:
            nivel = val
            break

    # Carregar treinos.csv
    treinos_path = os.path.join(base_dir, 'treinos.csv')
    treinos = []
    with open(treinos_path, newline='', encoding='utf-8') as csvfile:
        reader = csv.DictReader(csvfile)
        for row in reader:
            if row['Tipo'] == tipo and int(row['Nível']) == nivel:
                treinos.append(row)

    # Selecionar a fase mais adequada (por padrão, a primeira disponível)
    if treinos:
        fase = treinos[0]['Fase']
        descricao = treinos[0]['Descrição']
    else:
        fase = '01'
        descricao = 'Treino padrão para adaptação.'

    return {
        'tipo': tipo,
        'nivel': nivel,
        'fase': fase,
        'descricao': descricao
    }

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

    treino = carrega_treinos(base_dir, condicoes)

    tipo = treino['tipo']
    nivel = treino['nivel']
    fase = treino['fase']
    
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

        ## TIPO
        {tipo}
        
        ## NÍVEL
        {nivel}
        
        ## FASE
        {fase}

        ## EXPLICAÇÃO
        Explique o porquê do tipo, nível e fase escolhidos, considerando as condições de saúde do aluno e suas condições inferidas pelas respostas do quiz.

        ## CUIDADOS
        - Realizar todos os exercícios com atenção à postura e execução correta.
        - Respeitar os limites do corpo, evitando sobrecarga.
        - Manter hidratação e alimentação adequadas.
        - Caso sinta dores fora do normal, interromper o treino e buscar orientação.


        ## Observações
        - Acompanhar a evolução do aluno e ajustar o treino conforme adaptação.
        - Reforçar a importância do aquecimento e alongamento.
        - Monitorar sinais de fadiga excessiva ou desconforto.
        """
    )
    
    chain = prompt | chat
    response = chain.invoke({
        "context": context,
        "quiz": quiz_text,
        "condicoes": condicoes_str,
        "name": client_name,
        "treino": treino,
        "tipo": tipo,
        "nivel": nivel,
        "fase": fase
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
