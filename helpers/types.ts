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
  hasMultiSelection?: boolean;
  selected?: number[];
};

export type SpecialNeedData = {
  name: string;
  priority: number;
};

export type Callback<T = undefined> = (param: T) => void;
