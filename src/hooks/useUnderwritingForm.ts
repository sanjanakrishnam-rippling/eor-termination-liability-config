import { useState, useCallback } from 'react';
import {
  type UnderwritingFormData,
  type FormValidationErrors,
  type EorCountryEntry,
  type CorCountryEntry,
  type CompanyInfo,
  type Address,
  createEmptyFormData,
} from '../types/underwriting';

function validateForm(data: UnderwritingFormData): FormValidationErrors {
  const errors: FormValidationErrors = {};

  const addr = data.companyInfo.companyAddress;
  if (!addr.street.trim()) errors.companyStreet = 'Street is required';
  if (!addr.city.trim()) errors.companyCity = 'City is required';
  if (!addr.state.trim()) errors.companyState = 'State is required';
  if (!addr.zipCode.trim()) errors.companyZip = 'Zip code is required';

  if (!data.companyInfo.companyPhoneNumber.trim()) {
    errors.companyPhone = 'Company phone number is required';
  }

  if (!data.companyInfo.companyEntityType) {
    errors.companyEntityType = 'Company entity type is required';
  }

  if (!data.companyInfo.industry) {
    errors.industry = 'Industry is required';
  }

  if (!data.companyInfo.companyDbaName.trim()) {
    errors.companyDbaName = 'Company DBA name is required';
  }

  if (!data.companyInfo.companyTaxId.trim()) {
    errors.companyTaxId = 'Company tax ID is required';
  }

  if (!data.avgMonthlyPayroll.trim()) {
    errors.avgMonthlyPayroll = 'Average monthly payroll is required';
  }

  if (!data.productType) {
    errors.productType = 'Product type is required';
  }

  const showEor = data.productType === 'eor' || data.productType === 'both';
  const showCor = data.productType === 'cor' || data.productType === 'both';

  if (showEor && data.eorCountryRequests.length === 0) {
    errors.eorCountryRequests = 'Please add at least one EOR country';
  }
  if (showEor) {
    data.eorCountryRequests.forEach((entry, idx) => {
      if (!entry.country) {
        errors[`eor_country_${idx}`] = 'Country is required';
      }
      if (!entry.numberOfEmployees.trim()) {
        errors[`eor_employees_${idx}`] = 'Number of employees is required';
      }
      if (!entry.avgMonthlySalaryUsd.trim()) {
        errors[`eor_salary_${idx}`] = 'Average monthly salary is required';
      }
    });
  }

  if (showCor && data.corCountryRequests.length === 0) {
    errors.corCountryRequests = 'Please add at least one COR country';
  }
  if (showCor) {
    data.corCountryRequests.forEach((entry, idx) => {
      if (!entry.country) {
        errors[`cor_country_${idx}`] = 'Country is required';
      }
      if (!entry.numberOfMonthlyHourlyContractors.trim()) {
        errors[`cor_monthlyContractors_${idx}`] = 'Number of monthly/hourly contractors is required';
      }
      if (!entry.numberOfMilestoneContractors.trim()) {
        errors[`cor_milestoneContractors_${idx}`] = 'Number of milestone contractors is required';
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
  setCompanyField: <K extends keyof CompanyInfo>(field: K, value: CompanyInfo[K]) => void;
  setCompanyAddress: (field: keyof Address, value: string) => void;
  setIncorporatedAddress: (field: keyof Address, value: string) => void;
  setAvgMonthlyPayroll: (value: string) => void;
  setProductType: (value: UnderwritingFormData['productType']) => void;
  addEorEntry: (entry: EorCountryEntry) => void;
  removeEorEntry: (id: string) => void;
  addCorEntry: (entry: CorCountryEntry) => void;
  removeCorEntry: (id: string) => void;
  setBankStatements: (files: File[]) => void;
  setOtherFinancialDocs: (files: File[]) => void;
  setCensusFile: (files: File[]) => void;
  setAdditionalConsiderations: (value: string) => void;
  validate: () => boolean;
  setIsSubmitting: (value: boolean) => void;
  clearErrors: () => void;
}

export function useUnderwritingForm(): UseUnderwritingFormReturn {
  const [formData, setFormData] = useState<UnderwritingFormData>(createEmptyFormData);
  const [errors, setErrors] = useState<FormValidationErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const setCompanyField = useCallback(
    <K extends keyof CompanyInfo>(field: K, value: CompanyInfo[K]) => {
      setFormData((prev) => ({
        ...prev,
        companyInfo: { ...prev.companyInfo, [field]: value },
      }));
    },
    [],
  );

  const setCompanyAddress = useCallback((field: keyof Address, value: string) => {
    setFormData((prev) => ({
      ...prev,
      companyInfo: {
        ...prev.companyInfo,
        companyAddress: { ...prev.companyInfo.companyAddress, [field]: value },
      },
    }));
  }, []);

  const setIncorporatedAddress = useCallback((field: keyof Address, value: string) => {
    setFormData((prev) => ({
      ...prev,
      companyInfo: {
        ...prev.companyInfo,
        incorporatedAddress: { ...prev.companyInfo.incorporatedAddress, [field]: value },
      },
    }));
  }, []);

  const setAvgMonthlyPayroll = useCallback((value: string) => {
    setFormData((prev) => ({ ...prev, avgMonthlyPayroll: value }));
  }, []);

  const setProductType = useCallback(
    (value: UnderwritingFormData['productType']) => {
      setFormData((prev) => ({ ...prev, productType: value }));
    },
    [],
  );

  const addEorEntry = useCallback((entry: EorCountryEntry) => {
    setFormData((prev) => ({
      ...prev,
      eorCountryRequests: [...prev.eorCountryRequests, entry],
    }));
  }, []);

  const removeEorEntry = useCallback((id: string) => {
    setFormData((prev) => ({
      ...prev,
      eorCountryRequests: prev.eorCountryRequests.filter((e) => e.id !== id),
    }));
  }, []);

  const addCorEntry = useCallback((entry: CorCountryEntry) => {
    setFormData((prev) => ({
      ...prev,
      corCountryRequests: [...prev.corCountryRequests, entry],
    }));
  }, []);

  const removeCorEntry = useCallback((id: string) => {
    setFormData((prev) => ({
      ...prev,
      corCountryRequests: prev.corCountryRequests.filter((e) => e.id !== id),
    }));
  }, []);

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

  return {
    formData,
    errors,
    isSubmitting,
    setCompanyField,
    setCompanyAddress,
    setIncorporatedAddress,
    setAvgMonthlyPayroll,
    setProductType,
    addEorEntry,
    removeEorEntry,
    addCorEntry,
    removeCorEntry,
    setBankStatements,
    setOtherFinancialDocs,
    setCensusFile,
    setAdditionalConsiderations,
    validate,
    setIsSubmitting,
    clearErrors,
  };
}
