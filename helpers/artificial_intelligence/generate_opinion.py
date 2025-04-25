import os
from typing import List, Dict
from PyPDF2 import PdfReader
import openai  # pip install openai
from dotenv import load_dotenv
from langchain_openai import ChatOpenAI
from langchain.prompts import ChatPromptTemplate
from langchain.output_parsers.openai_functions import JsonOutputFunctionsParser
from langchain_core.utils.function_calling import convert_to_openai_function
from pydantic import BaseModel, Field

# Carregar as variáveis de ambiente do arquivo .env
load_dotenv()

# Inicializa a chave da API do OpenAI
chat = ChatOpenAI(model="o4-mini")

# Mapeamento das perguntas para os nomes dos arquivos PDF
QUESTION_TO_DOC = {
    'diabetes': 'Diabetes.pdf',
    'hipertensão': 'Hipertensão.pdf',
    'obesidade': 'Obesidade.pdf',
    'ansiedade': 'Ansiedade.pdf',
    'idoso': 'Idoso.pdf',
    'medicamentos': 'Medicamentos.pdf',
}

# Perguntas esperadas (em português, como no app)
EXPECTED_QUESTIONS = [
    'Possui diabetes?',
    'Possui hipertensão?',
    'Possui Obesidade?',
    'Possui ansiedade?',
    'É idoso (considerando idoso a partir de 60 anos)',
    'Utiliza medicamentos frequentes?',
    'Qual a rotina de treino prévia desse aluno (é sedentário ou já possui uma atividade física regular)?',
]

# Função utilitária para ler o texto de um PDF
def read_pdf_text(pdf_path: str) -> str:
    if not os.path.exists(pdf_path):
        return ''
    reader = PdfReader(pdf_path)
    text = ''
    for page in reader.pages:
        text += page.extract_text() or ''
    return text.strip()

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


tool_condicoes = convert_to_openai_function(CondicoesQuiz)

def inferir_condicoes_com_ia(quizzes: List[Dict]) -> Dict[str, bool]:
    """
    Usa Langchain + OpenAI para inferir as condições do usuário a partir do quiz.
    """
    prompt = ChatPromptTemplate.from_messages([
        ('system', 'Você é um educador físico profissional com muitos anos de experiência. \
         Analise o seguinte questionário (perguntas e respostas) e responda apenas com as condições de saúde do usuário.'),
        ('user', '{input}')
    ])
    
    chain = (
        prompt
        | chat.bind(functions=[tool_condicoes], function_call={'name': 'CondicoesQuiz'})
        | JsonOutputFunctionsParser()
    )
    # Monta texto do questionário
    texto = '\n'.join([f"Pergunta: {q.get('question')}\nResposta: {q.get('answer')}" for q in quizzes])
    return chain.invoke({'input': texto})

# Função principal
def gerar_opiniao_ai(quizzes: List[Dict], client_name: str, base_dir: str = None) -> str:
    """
    Gera a opinião de um educador físico sobre o treino do aluno com base em um questionário.
    quizzes: lista de dicionários com as chaves 'question' e 'answer' (e.g., QuizModel)
    base_dir: caminho para a pasta base_documents
    """
    if base_dir is None:
        base_dir = os.path.join(os.path.dirname(__file__), 'base_documents')

    # Nova análise baseada em IA
    condicoes = inferir_condicoes_com_ia(quizzes)

    # Geração dos cuidados usando IA
    
    prompt_final = ChatPromptTemplate.from_messages([
        ('system', """Você é um educador físico com muitos anos de experiência. \
          Com base nas condições do usuário abaixo, gere uma análise do treino ideal para aquele aluno da minha academia. \
          Importante: O treino deve ser baseado em evidências científicas e não em achismos. \
          
          A saída deve ser em Markdown, com os seguintes tópicos:
          ## Resumo do Treino do aluno {client_name}
            - Tipos de exercícios recomendados:
            - Quantidade de exercícios por treino:
            - Séries e repetições recomendadas:
            - Intensidade: (Baseada em % de 1 RM)
            - Percepção de Esforço (ex: leve a moderada)
            - Intervalor entre repetições e entre exercícios:
            - Frequência semanal indicada:
            - Progressão indicada de treinos:
         
          ## CUIDADOS
          Neste campo você deve usar sua habilidade para listar os pontos mais importantes a serem considerados para o aluno, \
          principalmente no que diz respeito aos cuidados a serem tomados nas execuções dos exercícios. \
          se baseie nessas condições previamente geradas: {condicoes}
          
         ## Explicação sobre o treino
          Neste campo você deve usar sua habilidade para explicar o porquê do treino que você indicou. \
          O texto deve ser claro e objetivo, com uma linguagem simples, como se você tivesse explicando a um educador físico recém-formado o porquê desse treino \
          
          ## Observações
          Neste campo você deve usar sua habilidade para listar os pontos mais importantes a serem considerados para um educador físico recém-formado o porquê desse treino, \

         """),
        ('user', '{input}')
    ])

    chain_final = prompt_final | chat

    resultado_ia = chain_final.invoke({'input': "Gere uma análise para este aluno da minha academia.", 
                                       'client_name': client_name, 
                                       'condicoes': condicoes})
  
    return resultado_ia.content

# Exemplo de uso:
if __name__ == "__main__":
    import sys
    import json
    try:
        input_data = json.load(sys.stdin)
        quizzes = input_data["quizzes"]
        client_name = input_data["client_name"]
        result = gerar_opiniao_ai(quizzes, client_name)
        print(result)
    except Exception as e:
        print(f"Erro ao gerar opinião da IA: {e}", file=sys.stderr)
        sys.exit(1)
