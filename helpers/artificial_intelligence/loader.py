from time import sleep
from typing import List
import warnings
import sys
import os
from contextlib import contextmanager
from langchain_core.documents import Document
from langchain_community.document_loaders import PyPDFLoader, TextLoader
import traceback

@contextmanager
def suppress_pdf_warnings():
    """Contexto que suprime warnings específicos do PDF."""
    # Redireciona stderr para null temporariamente
    stderr = sys.stderr
    devnull = open(os.devnull, 'w')
    sys.stderr = devnull
    try:
        yield
    finally:
        sys.stderr = stderr
        devnull.close()

def carrega_pdf(caminho: str, strict: bool = False) -> List[Document]:
    """
    Carrega um arquivo PDF e retorna uma lista de Documents do Langchain.
    
    Args:
        caminho: Caminho do arquivo PDF
        strict: Se True, levanta exceções para erros de PDF. Se False, tenta continuar mesmo com erros.
    """
    try:
        # print(f'Iniciando carregamento do arquivo {caminho}...')
        with suppress_pdf_warnings():
            loader = PyPDFLoader(
                file_path=caminho,
                extract_images=False  # Desabilita extração de imagens para reduzir erros
            )
            # print(f'Loader criado para {caminho}, tentando carregar...')
            docs = loader.load()
        
        if docs:
            # print(f'Arquivo {caminho} carregado com sucesso')
            return docs
        else:
            # print(f'Arquivo {caminho} foi carregado mas não contém documentos')
            return []
                
    except Exception as e:
        print(f'Erro detalhado ao carregar o arquivo {caminho}:')
        print(f'Tipo do erro: {type(e).__name__}')
        print(f'Mensagem de erro: {str(e)}')
        print('Stack trace:')
        print(traceback.format_exc())
        if strict:
            raise
        return []

def carrega_txt(caminho: str) -> List[Document]:
    """
    Carrega um arquivo de texto e retorna uma lista de Documents do Langchain.
    """
    try:
        loader = TextLoader(caminho)
        return loader.load()
    except Exception as e:
        print(f'Erro ao carregar o arquivo {caminho}: {e}')
        return []
