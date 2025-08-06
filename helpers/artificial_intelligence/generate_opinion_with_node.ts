import { NextRequest } from "next/server";
import { ChatOpenAI } from "@langchain/openai";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { MemoryVectorStore } from "langchain/vectorstores/memory";
import { OpenAIEmbeddings } from "@langchain/openai";
import { JsonOutputFunctionsParser } from "langchain/output_parsers";
import { Document } from "@langchain/core/documents";
import * as fs from "fs/promises";
import * as path from "path";
import * as csvParse from "csv-parse/sync";
import { z } from "zod";

// Map conditions to PDF filenames
const QUESTION_TO_DOC: Record<string, string> = {
    diabetes: "Diabetes.pdf",
    hipertensao: "Hipertensão.pdf",
    obesidade: "Obesidade.pdf",
    ansiedade: "Ansiedade.pdf",
    idoso: "Idoso.pdf",
    medicamentos: "Medicamentos.pdf",
};

// Enum definitions matching Python
enum Objetivos {
    emagrecimento = "Perder Peso",
    ganho_massa_muscular = "Ganho de massa muscular",
    condicionamento_fisico = "Qualidade de vida"
}

enum TiposTreino {
    viva_leve = "Para quem quer perder peso (emagrecimento)",
    vida_ativa = "Para os que possuem objetivo de Ganho de massa muscular",
    viver_bem = "Para os que buscam Qualidade de vida"
}

// Schema for conditions matching Python CondicoesQuiz class
const CondicoesQuizSchema = z.object({
    diabetes: z.boolean().describe("Possui diabetes?"),
    hipertensao: z.boolean().describe("Possui hipertensão?"),
    obesidade: z.boolean().describe("Possui obesidade?"),
    ansiedade: z.boolean().describe("Possui ansiedade?"),
    idoso: z.boolean().describe("É idoso (acima de 60 anos)?"),
    medicamentos: z.boolean().describe("Utiliza medicamentos frequentes?"),
    sedentario: z.boolean().describe("É sedentário?"),
    possui_dores_ou_limitações: z.string().describe("Possui dores ou limitações físicas que possam modificar a estrutura dos treinos? Se sim, quais?"),
    atividade_fisica: z.string().describe("De acordo com a pergunta 'Você está treinando atualmente ?', deve trazer a resposta informada no quiz."),
    objetivo: z.nativeEnum(Objetivos).describe("Qual o objetivo principal do aluno com os treinos?"),
    observacoes_extras: z.boolean().describe("Possui alguma nova condição de saúde relevante?")
});

type CondicoesQuiz = z.infer<typeof CondicoesQuizSchema>;

async function loadRelevantDocs(condicoes: CondicoesQuiz, baseDir: string): Promise<string[]> {
    const pdfs: string[] = [];
    // Only check boolean conditions for document loading
    const booleanConditions = {
        diabetes: condicoes.diabetes,
        hipertensao: condicoes.hipertensao,
        obesidade: condicoes.obesidade,
        ansiedade: condicoes.ansiedade,
        idoso: condicoes.idoso,
        medicamentos: condicoes.medicamentos
    };
    
    for (const [cond, hasCond] of Object.entries(booleanConditions)) {
        if (hasCond && QUESTION_TO_DOC[cond.toLowerCase()]) {
            const pdfPath = path.join(baseDir, QUESTION_TO_DOC[cond.toLowerCase()]);
            try {
                await fs.access(pdfPath);
                pdfs.push(pdfPath);
            } catch { }
        }
    }
    return pdfs;
}

async function extractTextFromPDF(pdfPath: string): Promise<string> {
    // Placeholder: In production, use a PDF parser like pdf-parse or langchain's PDF loader
    // For now, just return the filename as dummy content
    return `Conteúdo extraído de ${path.basename(pdfPath)}`;
}

// Substituir função createVectorStore para usar MemoryVectorStore
async function createVectorStore(pdfPaths: string[]): Promise<MemoryVectorStore> {
    const docs: Document[] = [];
    for (const pdfPath of pdfPaths) {
        const text = await extractTextFromPDF(pdfPath);
        docs.push(new Document({ pageContent: text, metadata: { source: pdfPath } }));
    }
    
    const textSplitter = new RecursiveCharacterTextSplitter({
        chunkSize: 1000,
        chunkOverlap: 100,
    });
    
    const splitDocs = await textSplitter.splitDocuments(docs);
    return MemoryVectorStore.fromDocuments(splitDocs, new OpenAIEmbeddings());
}

async function inferirCondicoesComIA(quizzes: { question: string; answer: string }[]): Promise<CondicoesQuiz> {
    
    const prompt = ChatPromptTemplate.fromMessages([
        ["system", "Você é um educador físico profissional experiente. Analise o questionário e identifique as condições de saúde do usuário."],
        ["user", "{input}"]
    ]);
    
    const chat = new ChatOpenAI({ model: "gpt-4o-mini" });
    
    // Create a function definition for the schema
    const functionDef = {
        name: "CondicoesQuiz",
        description: "Identifica as condições de saúde do usuário com base no questionário",
        parameters: {
            type: "object" as const,
            properties: {
                diabetes: { type: "boolean" as const, description: "Possui diabetes?" },
                hipertensao: { type: "boolean" as const, description: "Possui hipertensão?" },
                obesidade: { type: "boolean" as const, description: "Possui obesidade?" },
                ansiedade: { type: "boolean" as const, description: "Possui ansiedade?" },
                idoso: { type: "boolean" as const, description: "É idoso (acima de 60 anos)?" },
                medicamentos: { type: "boolean" as const, description: "Utiliza medicamentos frequentes?" },
                sedentario: { type: "boolean" as const, description: "É sedentário?" },
                possui_dores_ou_limitações: { type: "string" as const, description: "Possui dores ou limitações físicas que possam modificar a estrutura dos treinos? Se sim, quais?" },
                atividade_fisica: { type: "string" as const, description: "De acordo com a pergunta 'Você está treinando atualmente ?', deve trazer a resposta informada no quiz." },
                objetivo: { 
                    type: "string" as const, 
                    enum: ["Perder Peso", "Ganho de massa muscular", "Qualidade de vida"],
                    description: "Qual o objetivo principal do aluno com os treinos?" 
                },
                observacoes_extras: { type: "boolean" as const, description: "Possui alguma nova condição de saúde relevante?" }
            },
            required: ["diabetes", "hipertensao", "obesidade", "ansiedade", "idoso", "medicamentos", "sedentario", "possui_dores_ou_limitações", "atividade_fisica", "objetivo", "observacoes_extras"]
        }
    };
    
    const chain = prompt.pipe(
        chat.bind({
            functions: [functionDef],
            function_call: { name: "CondicoesQuiz" }
        })
    ).pipe(new JsonOutputFunctionsParser());
    
    const texto = quizzes.map(q => `Pergunta: ${q.question}\nResposta: ${q.answer}`).join('\n');
    
    try {
        const result = await chain.invoke({ input: texto });
        return result as CondicoesQuiz;
    } catch (error) {
        console.error("Erro ao inferir condições com IA:", error);
        // Fallback to default values
        return {
            diabetes: false,
            hipertensao: false,
            obesidade: false,
            ansiedade: false,
            idoso: false,
            medicamentos: false,
            sedentario: false,
            possui_dores_ou_limitações: "Não informado",
            atividade_fisica: "Não informado",
            objetivo: Objetivos.condicionamento_fisico,
            observacoes_extras: false
        };
    }
}

// Função para carregar o treino baseado nas condições do quiz
async function carregaTreinos(baseDir: string, condicoes: Record<string, any>) {
    const objetivo = (condicoes.objetivo || "").toString().toLowerCase();
    const atividade_fisica = (condicoes.atividade_fisica || "").toString().toLowerCase();
    const objetivoTipo: Record<string, string> = {
        "perder peso": "viva_leve",
        "ganho de massa muscular": "vida_ativa",
        "qualidade de vida": "viva_bem",
    };
    const tipo = objetivoTipo[objetivo] || "viva_leve";
    const nivelMap: Record<string, number> = {
        "nunca treinei": 1,
        "iniciante": 1,
        "treino há 6 meses": 2,
        "treino há 1 ano": 3,
        "treino há 1,5 anos": 4,
        "treino há 2 anos": 5,
        "treino há 3 anos": 6,
    };
    let nivel = 1;
    for (const chave in nivelMap) {
        if (atividade_fisica.includes(chave)) {
            nivel = nivelMap[chave];
            break;
        }
    }
    const treinosPath = path.join(baseDir, "treinos.csv");
    let treinos: any[] = [];
    try {
        const csvContent = await fs.readFile(treinosPath, "utf-8");
        treinos = csvParse.parse(csvContent, { columns: true, skip_empty_lines: true });
    } catch (e) {
        return { tipo, nivel, fase: "01", descricao: "Treino padrão para adaptação." };
    }
    const treino = treinos.find(
        (row) => row.Tipo === tipo && parseInt(row["Nível"], 10) === nivel
    );
    if (treino) {
        return {
            tipo,
            nivel,
            fase: treino.Fase,
            descricao: treino.Descrição,
        };
    } else {
        return { tipo, nivel, fase: "01", descricao: "Treino padrão para adaptação." };
    }
}

export async function generateAiOpinionWithNode(quizzes: { question: string; answer: string }[], clientName: string, baseDir: string): Promise<any> {
    
    // 1. Infer conditions using AI (matching Python behavior)
    const condicoes = await inferirCondicoesComIA(quizzes);
    
    // 2. Load relevant docs
    const pdfPaths = await loadRelevantDocs(condicoes, baseDir);
    let context = "Documentos base para prescrição de exercícios físicos.";
    if (pdfPaths.length > 0) {
        const vectorStore = await createVectorStore(pdfPaths);
        const docs = await vectorStore.similaritySearch("Recomendações de exercícios e cuidados", 2);
        context = docs.map((d) => d.pageContent).join("\n\n");
    }
    
    // 3. Prepare data for prompt
    const quizText = quizzes.map((q) => `Pergunta: ${q.question}\nResposta: ${q.answer}`).join("\n");
    const condicoesStr = Object.keys(condicoes).filter((k) => (condicoes as any)[k] === true).join(", ") || "Nenhuma condição especial identificada";

    // 4. Carregar treino baseado nas condições
    const treino = await carregaTreinos(baseDir, condicoes);
    
    const { tipo, nivel, fase } = treino;
    
    // 5. Transform tipo to final format (matching Python)
    let treino_final = { ...treino };
    if (treino.tipo === "vida_ativa") {
        treino_final.tipo = "VIDA ATIVA";
    } else if (treino.tipo === "viva_leve") {
        treino_final.tipo = "VIVA LEVE";
    } else if (treino.tipo === "viver_bem" || treino.tipo === "viva_bem") {
        treino_final.tipo = "VIVER BEM";
    }

    // 6. Generate AI response (matching Python prompt exactly)
    const prompt = ChatPromptTemplate.fromTemplate(`
        Você é um educador físico profissional com experiência em prescrição de treinos personalizados.\n
        Utilize o contexto técnico e científico abaixo para embasar sua resposta.\n\n
        
        Contexto técnico:\n{context}\n\n
            
        Questionário do aluno:\n{quiz}\n\n
        
        Condições identificadas:\n{condicoes}\n\n

        Treino: 
        Tipo: {tipo}\n
        Nível: {nivel}\n
        Fase: {fase}\n\n

        
        #### OUTPUT FORMAT ####   
        
        ##EXPLICAÇÃO
        Explique o porquê do tipo, nível e fase escolhidos, considerando as condições de saúde do aluno e suas condições inferidas pelas respostas do quiz.
        O tipo de treino deve ser explicado com base no objetivo do aluno, que pode ser emagrecimento, ganho de massa muscular ou condicionamento físico.\n
        O nível deve ser justificado com base no tempo de atividade física do aluno, baseando-se nessas informações:
        "nunca treinei": 1,
        "iniciante": 1,
        "treino há 6 meses": 2,
        "treino há 1 ano": 3,
        "treino há 1,5 anos": 4,
        "treino há 2 anos": 5,
        "treino há 3 anos": 6,
        A fase fique mais livre para explicar, levando em consideração as condições do aluno e o que é mais adequado para ele.\n
        Importante: Nunca defina um treino, com repetições, cargas, etc. APENAS defina o tipo, nível e fase do treino.\n
        
        ## CUIDADOS
        Liste os cuidados que o aluno deve ter com base nas condições de saúde identificadas. Lembre-se sempre de embasar suas respostas nas condicoes do aluno e práticas recomendadas.
        Para cada cuidado que você listar, informe também o porquê desse cuidado ser importante para este aluno, baseado em suas condições.\n

        ## OBSERVAÇÕES DA IA
        Informe novas observações que você encontrar e que não foram ainda analisadas.
    `);

    const chat = new ChatOpenAI({ model: "gpt-4o-mini" });
    const chain = prompt.pipe(chat);
    
    const response = await chain.invoke({ 
        context,
        quiz: quizText, 
        condicoes: condicoesStr, 
        name: clientName, 
        treino: treino_final, 
        tipo: treino_final.tipo, 
        nivel: treino_final.nivel, 
        fase: treino_final.fase 
    });

    return {
        treino: treino_final,
        condicoes,
        ai_opinion: response.content,
    };
}
