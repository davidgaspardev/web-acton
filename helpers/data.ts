import { QuizData, SpecialNeedData } from "./types";

export const quizList: QuizData[] = [
  {
    id: 1,
    question: "Dores físicas: possui alguma que incomoda?",
    answers: ["Sim", "Não"],
  },
  {
    id: 2,
    question: "Qual a dor que lhe incomoda atualmente?",
    hasMultiSelection: true,
    answers: [
      "No quadril",
      "No tornozelo",
      "No pescoço",
      "Nas costas ou lombar",
      "No ombro",
      "No cotovelo",
      "No joelho",
      "Outros",
    ],
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
    question: "O Stress tem atrapalhado o seu dia a dia?",
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
    id: 18,
    question: "O que você deseja?",
    answers: ["Ganhar Massa Muscular", "Qualidade de Vida", "Perder peso"],
  },
  {
    id: 19,
    question: "Você está treinando atualmente ?",
    answers: [
      "Nunca Treinei",
      "Treino à 6 meses",
      "Treino à 1 ano",
      "Treino à 2 anos",
      "Treino à 3 anos",
    ],
  },
];

/**
 * problemas cardiacos ou pressão alta > diabetes > ansiedade > qualidade do sono > qualidade de vida > disposição
 */
export const specialNeeds: SpecialNeedData[] = [
  {
    name: "Problemas Cardíacos ou Pressão Alta",
    priority: 100,
    showName: "Cuidar da Saúde do coração",
  },
  {
    name: "Diabetes",
    priority: 90,
    showName: "Cuidar da Diabetes",
  },
  {
    name: "Qualidade de Vida",
    priority: 60,
    showName: "Melhorar a qualidade de vida",
  },
  {
    name: "Disposição",
    priority: 50,
    showName: "Melhorar a disposição",
  },
  {
    name: "Ansiedade",
    priority: 80,
    showName: "Melhorar a Ansiedade",
  },
  {
    name: "Qualidade do Sono",
    priority: 70,
    showName: "Dormir melhor",
  },
];
