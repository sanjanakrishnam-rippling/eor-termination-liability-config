export type AccountType = 'existing_customer' | 'prospect';

export type RequestType = 'zero-deposit' | 'partial-role' | 'partial-company';

export type SubmissionRequestType = 'eor' | 'cor' | 'both';

export interface CompanyInfo {
  companyLegalName: string;
  workEmail: string;
  countryOfIncorporation: string;
  companyTaxId: string;
  companyAddress: string;
}

export interface EmployeeInfo {
  numberOfEmployees: string;
  avgMonthlySalaryUsd: string;
  avgEoyBonusUsd: string;
}

export interface ContractorInfo {
  numberOfMonthlyHourlyContractors: string;
  numberOfMilestoneContractors: string;
  avgMonthlyPayUsd: string;
  avgMilestoneAmountUsd: string;
}

export interface CountryRequest {
  id: string;
  country: string;
  employeeInfo: EmployeeInfo;
  contractorInfo: ContractorInfo;
}

export interface FinancialDetails {
  bankStatements: File[];
  otherFinancialDocs: File[];
  censusFile: File[];
}

export interface UnderwritingFormData {
  accountType: AccountType | '';
  companyInfo: CompanyInfo;
  avgMonthlyPayroll: string;
  submissionRequestType: SubmissionRequestType | '';
  countryRequests: CountryRequest[];
  financialDetails: FinancialDetails;
  additionalConsiderations: string;
}

export interface FormValidationErrors {
  accountType?: string;
  companyLegalName?: string;
  workEmail?: string;
  countryOfIncorporation?: string;
  companyTaxId?: string;
  companyAddress?: string;
  avgMonthlyPayroll?: string;
  submissionRequestType?: string;
  countryRequests?: string;
  bankStatements?: string;
  [key: string]: string | undefined;
}

export interface SubmissionResponse {
  caseId: string;
  status: 'pending';
}

export function createEmptyCountryRequest(id: string): CountryRequest {
  return {
    id,
    country: '',
    employeeInfo: {
      numberOfEmployees: '',
      avgMonthlySalaryUsd: '',
      avgEoyBonusUsd: '',
    },
    contractorInfo: {
      numberOfMonthlyHourlyContractors: '',
      numberOfMilestoneContractors: '',
      avgMonthlyPayUsd: '',
      avgMilestoneAmountUsd: '',
    },
  };
}

export function createEmptyFormData(): UnderwritingFormData {
  return {
    accountType: '',
    companyInfo: {
      companyLegalName: '',
      workEmail: '',
      countryOfIncorporation: '',
      companyTaxId: '',
      companyAddress: '',
    },
    avgMonthlyPayroll: '',
    submissionRequestType: '',
    countryRequests: [],
    financialDetails: {
      bankStatements: [],
      otherFinancialDocs: [],
      censusFile: [],
    },
    additionalConsiderations: '',
  };
}
