export type UserData = {
  id?: string;
  fullname: string;
  email: string;
  whatsapp: string;
  gender: GenderOptions;
  sessionCode?: string;
};

export type GenderOptions =
  | "Masculino"
  | "Feminino"
  | "Trans"
  | "Outros"
  | "Prefiro não dizer";

export type QuizData = {
  id: number;
  question: string;
  answers: string[];
  hasMultiSelection?: boolean;
  selected?: number[];
};

/**
 * @file ../prisma/schema.prisma
 */
export type QuizFromDatabase = {
  id?: string;
  question: string;
  answer: string;
  date: Date;
  sessionCode: string;
  userId: string;
};

export type SpecialNeedData = {
  name: string;
  showName: string;
  priority: number;
};

export type Callback<T = undefined> = (param: T) => void;

export type ResultData = {
  name: string;
  methodology: string;
  level: number;
  stage: number;
  date: Date;
  needs: SpecialNeedData[];
};
