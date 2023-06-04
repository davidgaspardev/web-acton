export type UserData = {
  fullname: string;
  email: string;
  whatsapp: string;
  sex: string;
};

export type QuizData = {
  id: number;
  question: string;
  answers: string[];
  selected?: number;
};
