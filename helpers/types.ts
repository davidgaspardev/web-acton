// Define a generic Nullable type for properties that can be null
export type Nullable<T> = T | null;
export type Optional<T> = T | undefined;

export type UserData = {
  id?: string;
  fullname: string;
  email: string;
  whatsapp: string;
  gender: GenderOptions;
  sessionCode?: string;
  inputs?: string[];
  prospectId?: number;
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
  methodology: string;
  level: number;
  stage: number;
  date: Date;
  needs: SpecialNeedData[];
};

export type ResultToPrint = {
  name: string;
  methodology: string;
  level: number;
  stage: number;
  specialNeeds: SpecialNeedData[];
};

/**
 * @file ../prisma/schema.prisma
 */
export type ResultFromDatabase = {
  id?: string;
  methodology: string;
  level: number;
  stage: number;
  needs: string;
  date: Date;
  sessionCode: string;
  userId: string;
};

/*
{
    "total": 1,
    "data": [
        {
            "id": "7bf8113f-dda2-4940-923a-d46309506d0c",
            "fullname": "David Gaspar",
            "email": "",
            "whatsapp": "87348738947",
            "gender": "TRANS",
            "createdAt": "2023-08-26T02:22:18.666Z",
            "results": [
                {
                    "id": "71369872-28d2-4c39-b013-c1da9fca1d62",
                    "methodology": "VIVER BEM",
                    "level": 2,
                    "stage": 6,
                    "needs": "Cuidar da Diabetes, Amenizar dores físicas, Melhorar a Ansiedade",
                    "date": "2023-08-26T02:22:41.088Z",
                    "sessionCode": "ir9yb5ft:1693016542051",
                    "userId": "7bf8113f-dda2-4940-923a-d46309506d0c"
                }
            ]
        }
    ]
}
*/
export type UserModel = {
  id: string;
  fullname: string;
  email: string;
  whatsapp: string;
  gender: string;
  results: ResultModel[];
  prospectId: number | null;
};

export type ResultModel = {
  id: string;
  methodology: string;
  level: number;
  stage: number;
  needs: string;
  date: Date;
  sessionCode: string;
};

export type QuizModel = {
  id: string;
  question: string;
  answer: string;
  date: Date;
  sessionCode: string;
};

export type MetricsInfo<T = number> = MetricInfo<T>[];

export type MetricInfo<T = number> = {
  methodology: string;
  quantity: T;
};

export type BrancheInfo = {
  name: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  neighborhood: string;
  slug: string;
  imageUrl: string;
  plans: BranchePlan[];
};

export type PlanType =
  | "INFINITY START – FIDELIDADE"
  | "INFINITY START"
  | "INFINITY MAX"
  | "ENGENHO DO MEIO CONTRATO DE ADESÃO – FIDELIDADE";

export type BranchePlan = {
  name: PlanType;
  link: string;
  value: number;
  benefits: string[];
};
