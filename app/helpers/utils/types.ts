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
  memberId: Nullable<number>;
};

// Gender Options of database
export type GenderOptions =
  | "MASCULINO"
  | "FEMININO"
  | "TRANS"
  | "OUTROS"
  | "DESCONHECIDO";

// ======================= Prospect structure data from EVO API ======================= //

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

// ======================= Member structure data from EVO API ======================= //

type Contact = {
  idPhone: number;
  idMember: number;
  idEmployee: Nullable<number>;
  idProspect: Nullable<number>;
  idProvider: Nullable<number>;
  idContactType: number;
  contactType: string;
  description: string;
};

type Membership = {
  limitless: boolean;
  weeklyLimit: number;
  concludedSessions: number;
  pendingSessions: number;
  scheduledSessions: number;
  pendingRepositions: number;
  repositionsTotal: number;
  bonusSessions: Nullable<number>;
  sessions: Nullable<number>;
  idMember: Nullable<number>;
  idMembership: number;
  idMemberMembership: number;
  idMemberMembershipRenewed: Nullable<number>;
  numMembers: number;
  startDate: string;
  endDate: string;
  name: string;
  cancelDate: Nullable<string>;
  membershipStatus: string;
  valueNextMonth: Nullable<number>;
  nextCharge: Nullable<string>;
  idSale: Nullable<number>;
  saleDate: Nullable<string>;
  contractPrinting: Nullable<string>;
  freezes: Nullable<string>;
  idCategoryMembership: Nullable<number>;
  numberSuspensionTimes: Nullable<number>;
  maxSuspensionDays: Nullable<number>;
  minimumSuspensionDays: Nullable<number>;
  disponibleSuspensionDays: Nullable<number>;
  disponibleSuspensionTimes: Nullable<number>;
  daysLeftToFreeze: Nullable<number>;
  loyaltyEndDate: Nullable<string>;
  assessmentEndDate: Nullable<string>;
  flAllowLocker: boolean;
  flAdditionalMembership: boolean;
  bioimpedanceAmount: Nullable<number>;
  signedTerms: Nullable<string>;
  originalValue: Nullable<number>;
};

export type Member = {
  idMember: number;
  firstName: string;
  lastName: string;
  registerDate: string;
  idBranch: number;
  branchName: string;
  accessBlocked: boolean;
  blockedReason: string;
  gender: string;
  birthDate: string;
  accessCardNumber: Nullable<string>;
  membershipStatus: string;
  penalized: boolean;
  status: string;
  contacts: Contact[];
  memberships: Membership[];
};
