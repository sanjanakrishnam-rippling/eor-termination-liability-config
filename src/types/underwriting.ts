export type AccountType = 'existing_customer' | 'prospect';

export type RequestType = 'zero-deposit' | 'partial-role' | 'partial-company';

export type ProductType = 'eor' | 'cor' | 'both';

export interface Address {
  street: string;
  city: string;
  state: string;
  zipCode: string;
}

export interface IntakeInfo {
  firstName: string;
  lastName: string;
  companyLegalName: string;
  workEmail: string;
  phoneCountryCode: string;
  phoneNumber: string;
}

export interface IntakeData {
  accountType: AccountType | '';
  info: IntakeInfo;
}

export interface CompanyInfo {
  companyAddress: Address;
  incorporatedAddress: Address;
  companyPhoneCountryCode: string;
  companyPhoneNumber: string;
  companyEntityType: string;
  industry: string;
  companyDbaName: string;
  companyTaxId: string;
  companyWebsite: string;
}

export interface EorCountryEntry {
  id: string;
  country: string;
  numberOfEmployees: string;
  avgMonthlySalaryUsd: string;
  avgEoyBonusUsd: string;
}

export interface CorCountryEntry {
  id: string;
  country: string;
  numberOfMonthlyHourlyContractors: string;
  numberOfMilestoneContractors: string;
  avgMonthlyPayUsd: string;
  avgMilestoneAmountUsd: string;
}

export interface FinancialDetails {
  bankStatements: File[];
  otherFinancialDocs: File[];
  censusFile: File[];
}

export interface UnderwritingFormData {
  companyInfo: CompanyInfo;
  avgMonthlyPayroll: string;
  productType: ProductType | '';
  eorCountryRequests: EorCountryEntry[];
  corCountryRequests: CorCountryEntry[];
  financialDetails: FinancialDetails;
  additionalConsiderations: string;
}

export interface FormValidationErrors {
  [key: string]: string | undefined;
}

export interface SubmissionResponse {
  status: 'pending';
}

export function createEmptyAddress(): Address {
  return { street: '', city: '', state: '', zipCode: '' };
}

export function createEmptyCompanyInfo(): CompanyInfo {
  return {
    companyAddress: createEmptyAddress(),
    incorporatedAddress: createEmptyAddress(),
    companyPhoneCountryCode: '+1',
    companyPhoneNumber: '',
    companyEntityType: '',
    industry: '',
    companyDbaName: '',
    companyTaxId: '',
    companyWebsite: '',
  };
}

export function createEmptyEorEntry(id: string): EorCountryEntry {
  return {
    id,
    country: '',
    numberOfEmployees: '',
    avgMonthlySalaryUsd: '',
    avgEoyBonusUsd: '',
  };
}

export function createEmptyCorEntry(id: string): CorCountryEntry {
  return {
    id,
    country: '',
    numberOfMonthlyHourlyContractors: '',
    numberOfMilestoneContractors: '',
    avgMonthlyPayUsd: '',
    avgMilestoneAmountUsd: '',
  };
}

export function createEmptyFormData(): UnderwritingFormData {
  return {
    companyInfo: createEmptyCompanyInfo(),
    avgMonthlyPayroll: '',
    productType: '',
    eorCountryRequests: [],
    corCountryRequests: [],
    financialDetails: {
      bankStatements: [],
      otherFinancialDocs: [],
      censusFile: [],
    },
    additionalConsiderations: '',
  };
}
