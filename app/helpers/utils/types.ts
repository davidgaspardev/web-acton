import { Nullable } from "@/helpers/types";

export type UserCreateData = {
  id: string;
  fullname: string;
  cpf: string;
  email: string;
  whatsapp: string;
  gender: GenderOptions;
  branchId: number;
  prospectId: Nullable<number>;
};

// Gender Options of database
export type GenderOptions =
  | "MASCULINO"
  | "FEMININO"
  | "TRANS"
  | "OUTROS"
  | "DESCONHECIDO";

// Define the type for the main data structure
export type Prospect = {
  idProspect: number;
  idBranch: number;
  branchName: string;
  firstName: string;
  lastName: Nullable<string>;
  document: Nullable<string>;
  cellphone: string;
  email: string;
  gympassId: Nullable<string>;
  registerDate: string; // Assuming date as string, otherwise use Date type
  gender: string; // Could be more specific, like 'M' | 'F' | 'Other', if applicable
  birthDate: Nullable<string>; // Assuming date as string, otherwise use Date type
  signupType: string;
  mktChannel: Nullable<string>;
  conversionDate: Nullable<string>; // Assuming date as string, otherwise use Date type
  idMember: Nullable<number>;
  currentStep: Nullable<string>;
  address: Nullable<string>;
  city: Nullable<string>;
  complement: Nullable<string>;
  neighborhood: Nullable<string>;
  state: Nullable<string>;
  country: Nullable<string>;
  zipCode: Nullable<string>;
  number: Nullable<string>;
  responsible: Responsible;
};

// Define the type for Responsible information
type Responsible = {
  name: Nullable<string>;
  document: Nullable<string>;
  financialResponsible: boolean;
};
