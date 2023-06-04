import { QuizData, SpecialNeedData } from "./types";

export const quizList: QuizData[] = [
  {
    id: 1,
    question: "Dores físicas: possuí alguma que incomoda?",
    answers: ["Sim", "Não"],
  },
  {
    id: 2,
    question: "Qual a dor que lhe icomoda atualmente?",
    hasMultiSelection: true,
    answers: [
      "Pescoço",
      "Nas Costas ou Lombar",
      "No Ombro",
      "No Cotovelo",
      "No Joelho",
      "No Tornozelo",
      "No Quadril",
      "Outros",
    ],
  },
  {
    id: 3,
    question: "Você sentiu dor fisíca em repouso nos últimos 30 dias?",
    answers: ["Sim", "Não"],
  },
  {
    id: 4,
    question: "Você tem problemas cardíacos ou pressão alta?",
    answers: ["Sim", "Não"],
  },
  {
    id: 5,
    question: "Você tem diabetes?",
    answers: ["Sim", "Não"],
  },
  {
    id: 6,
    question: "Você possui alguma lesão?",
    answers: ["Sim", "Não"],
  },
  {
    id: 7,
    question: "Você faz uso de medicamentos controlados?",
    answers: ["Sim", "Não"],
  },
  {
    id: 8,
    question: "Como você avalia sua qualidade de vida hoje?",
    answers: ["Boa", "Ruim", "Pode melhorar"],
  },
  {
    id: 9,
    question: "Como você passa a maior parte do seu dia?",
    answers: ["Em pé", "Sentado"],
  },
  {
    id: 10,
    question: "Você se sente cansado ao longo das tarefas do dia?",
    answers: ["Sim", "Não"],
  },
  {
    id: 11,
    question: "Durante o dia você se sente sem energia?",
    answers: ["Sim", "Não"],
  },
  {
    id: 12,
    question: "Você sofre de ansiedade?",
    answers: ["Sim", "Não"],
  },
  {
    id: 13,
    question: "O Stress tem atrapalhado o seu dia-a-dia?",
    answers: ["Sim", "Não"],
  },
  {
    id: 14,
    question: "Você sofre com insônia?",
    answers: ["Sim", "Não"],
  },
  {
    id: 15,
    question: "Você sofre com sonolência diurna?",
    answers: ["Sim", "Não"],
  },
  {
    id: 16,
    question: "Você deseja emagrecer?",
    answers: ["Sim", "Não"],
  },
  {
    id: 17,
    question: "Você pratica esportes?",
    answers: ["Sim", "Não", "Sou atleta"],
  },
  {
    id: 18,
    question: "O que você deseja?",
    answers: ["Ganhar Massa Muscular", "Qualidade de Vida", "Perder peso"],
  },
  {
    id: 19,
    question:
      "Por quanto tempo você já praticou exercicio fisico regular em academias na sua vida?",
    answers: ["Nunca Treinei", "6 meses", "1 ano", "2 anos", "3 anos"],
  },
];

export const specialNeeds: SpecialNeedData[] = [
  {
    name: "Dor Física",
    priority: 1,
  },
  {
    name: "Problemas Cardíacos ou Pressão Alta",
    priority: 1,
  },
  {
    name: "Diabetes",
    priority: 1,
  },
  {
    name: "Qualidade de Vida",
    priority: 1,
  },
  {
    name: "Disposição",
    priority: 1,
  },
  {
    name: "Ansiedade",
    priority: 1,
  },
  {
    name: "Qualidade do Sono",
    priority: 1,
  },
];
