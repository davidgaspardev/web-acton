import { BrancheInfo, QuizData, SpecialNeedData } from "./types";

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
      "Treino há 6 meses",
      "Treino há 1 ano",
      "Treino há 2 anos",
      "Treino há 3 anos",
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

export const branches: BrancheInfo[] = [
  {
    // name: "Acto Academia Várzea",
    name: "Várzea",
    address: "Av. Afonso Olindense, nº 1090",
    neighborhood: "Varzea",
    city: "Recife",
    state: "PE",
    zipCode: "50810-000",
    signUpLink:
      "https://evo-totem.w12app.com.br/actoacademia/1/site/i681zQSE0wGa4tBjj0CKyQ%5BEQUAL%5D%5BEQUAL%5D",
    imageUrl:
      "https://firebasestorage.googleapis.com/v0/b/acto-dev.appspot.com/o/branches%2Fbranche_varzea.jpg?alt=media&token=0da6a261-dd21-46ac-a176-b3e3aeb2cb4d",
  },
  {
    name: "Massangana",
    address: "Av. Zequinha Barreto, nº 150",
    neighborhood: "Massangana",
    city: "Jaboatão dos Guararapes",
    state: "PE",
    zipCode: "54400-090",
    signUpLink:
      "https://evo-totem.w12app.com.br/actoacademia/2/site/W4xbhycdyDd%5BBAR%5DxV8tdYABmQ%5BEQUAL%5D%5BEQUAL%5D",
    imageUrl:
      "https://firebasestorage.googleapis.com/v0/b/acto-dev.appspot.com/o/branches%2Fbranche_massangana.jpg?alt=media&token=5c0df52e-07d5-4f6d-9bdf-920a35f1c093",
  },
  {
    name: "Cordeiro",
    address: "R. Cláudio Brotherhood, nº 96",
    neighborhood: "Cordeiro",
    city: "Recife",
    state: "PE",
    zipCode: "50721-260",
    signUpLink:
      "https://evo-totem.w12app.com.br/actoacademia/5/site/ixNnMrON8x6zInt2N0%5BPLUS%5Dwiw%5BEQUAL%5D%5BEQUAL%5D",
    imageUrl:
      "https://firebasestorage.googleapis.com/v0/b/acto-dev.appspot.com/o/branches%2Fbranche_cordeiro.jpg?alt=media&token=0b1ffee0-3491-4017-a31b-7e0a64b56e9a",
  },
  {
    name: "Iputinga",
    address: "R. São Mateus, nº 653",
    neighborhood: "Iputinga",
    city: "Recife",
    state: "PE",
    zipCode: "50680-000",
    signUpLink:
      "https://evo-totem.w12app.com.br/actoacademia/3/site/qay%5BPLUS%5D%5BBAR%5DQQGYuqK0fqpvx50Ug%5BEQUAL%5D%5BEQUAL%5D",
    imageUrl:
      "https://firebasestorage.googleapis.com/v0/b/acto-dev.appspot.com/o/branches%2Fbranche_iputinga.jpg?alt=media&token=2390fdbc-cd32-4db3-acc5-278a9c8a3133",
  },
  {
    name: "Engenho do Meio",
    address: "R. Manoel Estevão da Costa, nº 119",
    neighborhood: "Iputinga",
    city: "Recife",
    state: "PE",
    zipCode: "50670-590",
    signUpLink:
      "https://evo-totem.w12app.com.br/actoacademia/4/site/qCFaY5fieAgqlB%5BPLUS%5D7k5mcAw%5BEQUAL%5D%5BEQUAL%5D",
    imageUrl:
      "https://firebasestorage.googleapis.com/v0/b/acto-dev.appspot.com/o/branches%2Fbranche_engenho.jpg?alt=media&token=a1167580-8e95-4130-85de-22380cd53cfb",
  },
];
