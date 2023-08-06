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
  | "Outro"
  | "Prefiro não dizer";

export type QuizData = {
  id: number;
  question: string;
  answers: string[];
  hasMultiSelection?: boolean;
  selected?: number[];
};

export type SpecialNeedData = {
  name: string;
  showName: string;
  priority: number;
};

export type Callback<T = undefined> = (param: T) => void;

export type ResultInfoData = {
  name: string;
  methodology: string;
  level: number;
  stage: number;
  createdAt: Date;
  specialNeeds: SpecialNeedData[];
};
