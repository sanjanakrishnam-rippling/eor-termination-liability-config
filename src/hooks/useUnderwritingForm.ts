import { useState, useCallback } from 'react';
import {
  type UnderwritingFormData,
  type FormValidationErrors,
  type CompanyInfo,
  type Address,
  type WorkforceReason,
  createEmptyFormData,
} from '../types/underwriting';

function validateForm(data: UnderwritingFormData): FormValidationErrors {
  const errors: FormValidationErrors = {};

  const addr = data.companyInfo.companyAddress;
  if (!addr.country) errors.companyCountry = 'Country is required';
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

  if (data.companyInfo.companyEntityType === 'sole_proprietorship') {
    errors.companyEntityType = 'Rippling does not currently support sole proprietorships for EOR services.';
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

  if (!data.workforceReason) {
    errors.workforceReason = 'Please select your workforce situation';
  }

  if (!data.avgMonthlyPayroll.trim()) {
    errors.avgMonthlyPayroll = 'Average monthly payroll is required';
  }

  if (!data.productType) {
    errors.productType = 'Product type is required';
  }

  const showEor = data.productType === 'eor' || data.productType === 'both';
  const showCor = data.productType === 'cor' || data.productType === 'both';

  if (showEor && data.eorCensusCsv.length === 0) {
    errors.eorCensusCsv = 'Please upload your completed EOR census CSV';
  }
  if (showCor && data.corCensusCsv.length === 0) {
    errors.corCensusCsv = 'Please upload your completed COR census CSV';
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
  setWorkforceReason: (value: WorkforceReason | '') => void;
  setWorkforceCensusFile: (files: File[]) => void;
  setProductType: (value: UnderwritingFormData['productType']) => void;
  setEorCensusCsv: (files: File[]) => void;
  setCorCensusCsv: (files: File[]) => void;
  setWaiveDepositForFee: (value: boolean) => void;
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

  const setWorkforceReason = useCallback((value: WorkforceReason | '') => {
    setFormData((prev) => ({
      ...prev,
      workforceReason: value,
      workforceCensusFile: value === 'moving_existing' ? prev.workforceCensusFile : [],
    }));
  }, []);

  const setWorkforceCensusFile = useCallback((files: File[]) => {
    setFormData((prev) => ({ ...prev, workforceCensusFile: files }));
  }, []);

  const setProductType = useCallback(
    (value: UnderwritingFormData['productType']) => {
      setFormData((prev) => ({ ...prev, productType: value }));
    },
    [],
  );

  const setEorCensusCsv = useCallback((files: File[]) => {
    setFormData((prev) => ({ ...prev, eorCensusCsv: files }));
  }, []);

  const setCorCensusCsv = useCallback((files: File[]) => {
    setFormData((prev) => ({ ...prev, corCensusCsv: files }));
  }, []);

  const setWaiveDepositForFee = useCallback((value: boolean) => {
    setFormData((prev) => ({ ...prev, waiveDepositForFee: value }));
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
    setWorkforceReason,
    setWorkforceCensusFile,
    setProductType,
    setEorCensusCsv,
    setCorCensusCsv,
    setWaiveDepositForFee,
    setBankStatements,
    setOtherFinancialDocs,
    setCensusFile,
    setAdditionalConsiderations,
    validate,
    setIsSubmitting,
    clearErrors,
  };
}
