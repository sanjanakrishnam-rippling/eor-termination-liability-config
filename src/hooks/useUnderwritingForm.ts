import { useState, useCallback, useMemo } from 'react';
import {
  type UnderwritingFormData,
  type FormValidationErrors,
  type CountryRequest,
  type RequestType,
  createEmptyFormData,
  createEmptyCountryRequest,
} from '../types/underwriting';
import { v4 as uuidv4 } from 'uuid';

function isEmailValid(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function validateForm(data: UnderwritingFormData): FormValidationErrors {
  const errors: FormValidationErrors = {};

  if (!data.accountType) {
    errors.accountType = 'Please select your account type';
  }

  if (!data.companyInfo.companyLegalName.trim()) {
    errors.companyLegalName = 'Company legal name is required';
  }

  if (!data.companyInfo.workEmail.trim()) {
    errors.workEmail = 'Work email is required';
  } else if (!isEmailValid(data.companyInfo.workEmail)) {
    errors.workEmail = 'Please enter a valid email address';
  }

  if (!data.companyInfo.countryOfIncorporation) {
    errors.countryOfIncorporation = 'Country of incorporation is required';
  }

  if (!data.companyInfo.companyTaxId.trim()) {
    errors.companyTaxId = 'Company Tax ID is required';
  }

  if (!data.companyInfo.companyAddress.trim()) {
    errors.companyAddress = 'Company address is required';
  }

  if (!data.avgMonthlyPayroll.trim()) {
    errors.avgMonthlyPayroll = 'Average monthly payroll is required';
  }

  if (!data.submissionRequestType) {
    errors.submissionRequestType = 'Submission request type is required';
  }

  if (data.countryRequests.length === 0) {
    errors.countryRequests = 'Please add at least one country';
  } else {
    data.countryRequests.forEach((cr, idx) => {
      if (!cr.country) {
        errors[`country_${idx}`] = 'Country is required';
      }
      if (!cr.employeeInfo.numberOfEmployees.trim()) {
        errors[`employees_${idx}`] = 'Number of employees is required';
      }
      if (!cr.employeeInfo.avgMonthlySalaryUsd.trim()) {
        errors[`salary_${idx}`] = 'Average monthly salary is required';
      }
    });
  }

  if (data.financialDetails.bankStatements.length === 0) {
    errors.bankStatements = 'Bank statements are required';
  }

  const payroll = parseFloat(data.avgMonthlyPayroll.replace(/[^0-9.]/g, '')) || 0;
  if (payroll > 500000 && data.financialDetails.otherFinancialDocs.length === 0) {
    errors.otherFinancialDocs =
      'Financial statements and credit documentation are required when monthly EOR exceeds $500k';
  }

  return errors;
}

export interface UseUnderwritingFormReturn {
  formData: UnderwritingFormData;
  errors: FormValidationErrors;
  isSubmitting: boolean;
  requestType: RequestType | null;
  completedSections: number;
  setAccountType: (value: UnderwritingFormData['accountType']) => void;
  setCompanyField: <K extends keyof UnderwritingFormData['companyInfo']>(
    field: K,
    value: UnderwritingFormData['companyInfo'][K],
  ) => void;
  setAvgMonthlyPayroll: (value: string) => void;
  setSubmissionRequestType: (value: UnderwritingFormData['submissionRequestType']) => void;
  addCountryRequest: () => void;
  removeCountryRequest: (id: string) => void;
  updateCountryRequest: (id: string, updated: Partial<CountryRequest>) => void;
  updateEmployeeInfo: (
    countryId: string,
    field: keyof CountryRequest['employeeInfo'],
    value: string,
  ) => void;
  updateContractorInfo: (
    countryId: string,
    field: keyof CountryRequest['contractorInfo'],
    value: string,
  ) => void;
  setBankStatements: (files: File[]) => void;
  setOtherFinancialDocs: (files: File[]) => void;
  setCensusFile: (files: File[]) => void;
  setAdditionalConsiderations: (value: string) => void;
  validate: () => boolean;
  setIsSubmitting: (value: boolean) => void;
  clearErrors: () => void;
}

export function useUnderwritingForm(requestType: RequestType | null): UseUnderwritingFormReturn {
  const [formData, setFormData] = useState<UnderwritingFormData>(createEmptyFormData);
  const [errors, setErrors] = useState<FormValidationErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const setAccountType = useCallback((value: UnderwritingFormData['accountType']) => {
    setFormData((prev) => ({ ...prev, accountType: value }));
  }, []);

  const setCompanyField = useCallback(
    <K extends keyof UnderwritingFormData['companyInfo']>(
      field: K,
      value: UnderwritingFormData['companyInfo'][K],
    ) => {
      setFormData((prev) => ({
        ...prev,
        companyInfo: { ...prev.companyInfo, [field]: value },
      }));
    },
    [],
  );

  const setAvgMonthlyPayroll = useCallback((value: string) => {
    setFormData((prev) => ({ ...prev, avgMonthlyPayroll: value }));
  }, []);

  const setSubmissionRequestType = useCallback(
    (value: UnderwritingFormData['submissionRequestType']) => {
      setFormData((prev) => ({ ...prev, submissionRequestType: value }));
    },
    [],
  );

  const addCountryRequest = useCallback(() => {
    setFormData((prev) => ({
      ...prev,
      countryRequests: [...prev.countryRequests, createEmptyCountryRequest(uuidv4())],
    }));
  }, []);

  const removeCountryRequest = useCallback((id: string) => {
    setFormData((prev) => ({
      ...prev,
      countryRequests: prev.countryRequests.filter((cr) => cr.id !== id),
    }));
  }, []);

  const updateCountryRequest = useCallback((id: string, updated: Partial<CountryRequest>) => {
    setFormData((prev) => ({
      ...prev,
      countryRequests: prev.countryRequests.map((cr) =>
        cr.id === id ? { ...cr, ...updated } : cr,
      ),
    }));
  }, []);

  const updateEmployeeInfo = useCallback(
    (countryId: string, field: keyof CountryRequest['employeeInfo'], value: string) => {
      setFormData((prev) => ({
        ...prev,
        countryRequests: prev.countryRequests.map((cr) =>
          cr.id === countryId
            ? { ...cr, employeeInfo: { ...cr.employeeInfo, [field]: value } }
            : cr,
        ),
      }));
    },
    [],
  );

  const updateContractorInfo = useCallback(
    (countryId: string, field: keyof CountryRequest['contractorInfo'], value: string) => {
      setFormData((prev) => ({
        ...prev,
        countryRequests: prev.countryRequests.map((cr) =>
          cr.id === countryId
            ? { ...cr, contractorInfo: { ...cr.contractorInfo, [field]: value } }
            : cr,
        ),
      }));
    },
    [],
  );

  const setBankStatements = useCallback((files: File[]) => {
    setFormData((prev) => ({
      ...prev,
      financialDetails: { ...prev.financialDetails, bankStatements: files },
    }));
  }, []);

  const setOtherFinancialDocs = useCallback((files: File[]) => {
    setFormData((prev) => ({
      ...prev,
      financialDetails: { ...prev.financialDetails, otherFinancialDocs: files },
    }));
  }, []);

  const setCensusFile = useCallback((files: File[]) => {
    setFormData((prev) => ({
      ...prev,
      financialDetails: { ...prev.financialDetails, censusFile: files },
    }));
  }, []);

  const setAdditionalConsiderations = useCallback((value: string) => {
    setFormData((prev) => ({ ...prev, additionalConsiderations: value }));
  }, []);

  const validate = useCallback((): boolean => {
    const validationErrors = validateForm(formData);
    setErrors(validationErrors);
    return Object.keys(validationErrors).length === 0;
  }, [formData]);

  const clearErrors = useCallback(() => {
    setErrors({});
  }, []);

  const completedSections = useMemo(() => {
    let count = 0;

    if (formData.accountType) count++;

    const ci = formData.companyInfo;
    if (
      ci.companyLegalName.trim() &&
      ci.workEmail.trim() &&
      ci.countryOfIncorporation &&
      ci.companyTaxId.trim() &&
      ci.companyAddress.trim()
    ) {
      count++;
    }

    if (
      formData.avgMonthlyPayroll.trim() &&
      formData.submissionRequestType &&
      formData.countryRequests.length > 0
    ) {
      count++;
    }

    if (formData.financialDetails.bankStatements.length > 0) {
      count++;
    }

    // Section 5 (additional considerations) is always optional, count it as complete
    count++;

    return count;
  }, [formData]);

  return {
    formData,
    errors,
    isSubmitting,
    requestType,
    completedSections,
    setAccountType,
    setCompanyField,
    setAvgMonthlyPayroll,
    setSubmissionRequestType,
    addCountryRequest,
    removeCountryRequest,
    updateCountryRequest,
    updateEmployeeInfo,
    updateContractorInfo,
    setBankStatements,
    setOtherFinancialDocs,
    setCensusFile,
    setAdditionalConsiderations,
    validate,
    setIsSubmitting,
    clearErrors,
  };
}
