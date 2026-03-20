import { useSearchParams, useNavigate } from 'react-router-dom';
import { useUnderwritingForm } from '../hooks/useUnderwritingForm';
import { submitUnderwritingApplication } from '../utils/api';
import { countries } from '../utils/countries';
import type { RequestType } from '../types/underwriting';

import FormSection from '../components/FormSection';
import InputText from '../components/InputText';
import Select from '../components/Select';
import RadioButton, { useRadioGroup } from '../components/RadioButton';
import FileUpload from '../components/FileUpload';
import TextArea from '../components/TextArea';
import Button from '../components/Button';

const REQUEST_TYPE_LABELS: Record<RequestType, string> = {
  'zero-deposit': 'Zero Deposit',
  'partial-role': 'Partial Deposit Waiver for Role',
  'partial-company': 'Partial Deposit Waiver for Company',
};

const SUBMISSION_TYPE_OPTIONS = [
  { id: 'eor', label: 'Employer of Record' },
  { id: 'cor', label: 'Contractor of Record' },
  { id: 'both', label: 'Both' },
];

export default function UnderwritingFormView() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const rawType = searchParams.get('type') as RequestType | null;
  const requestType =
    rawType && Object.keys(REQUEST_TYPE_LABELS).includes(rawType) ? rawType : null;

  const {
    formData,
    errors,
    isSubmitting,
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
  } = useUnderwritingForm(requestType);

  const accountRadio = useRadioGroup(formData.accountType);

  const handleAccountSelect = (value: string) => {
    accountRadio.handleSelect(value);
    setAccountType(value as 'existing_customer' | 'prospect');
  };

  const handleSubmit = async () => {
    if (!validate()) {
      const firstErrorKey = Object.keys(errors)[0];
      if (firstErrorKey) {
        const el = document.getElementById(`field-${firstErrorKey}`);
        el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await submitUnderwritingApplication(formData);
      navigate(`/apply/confirmation?caseId=${result.caseId}`);
    } catch (err) {
      console.error('Submission failed:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const usedCountryIds = formData.countryRequests.map((cr) => cr.country).filter(Boolean);
  const availableCountries = countries.filter((c) => !usedCountryIds.includes(c.id));

  const payrollNum = parseFloat(formData.avgMonthlyPayroll.replace(/[^0-9.]/g, '')) || 0;
  const isOtherFinancialRequired = payrollNum > 500000;

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-[720px] mx-auto px-6 py-10">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-[26px] font-bold leading-[34px] text-[#1a1a1a] tracking-[-0.2px]">
            EOR Underwriting Application
          </h1>
          <p className="mt-3 text-[16px] leading-[24px] text-[#6b7280]">
            Enter your info and verify your email to start your underwriting application.
            If you have already filled out this form, you can{' '}
            <a
              href="/apply/continue"
              className="font-semibold text-[#1e4aa9] no-underline hover:text-[#152d4a] transition-colors"
            >
              continue with your application
            </a>
            .
          </p>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit();
          }}
          className="flex flex-col gap-10"
        >
          {/* ── Section 1: Your Rippling Account ── */}
          <FormSection
            title="Your Rippling Account"
            description="Are you an existing Rippling customer or a prospect?"
          >
            <div id="field-accountType" className="flex flex-col gap-2">
              <RadioButton
                id="account-existing"
                value="existing_customer"
                label="Existing Rippling Customer"
                isSelected={formData.accountType === 'existing_customer'}
                isFocused={accountRadio.focusedId === 'account-existing'}
                onSelect={handleAccountSelect}
                onFocus={accountRadio.handleFocus}
                onBlur={accountRadio.handleBlur}
                onMouseEnter={accountRadio.handleMouseEnter}
                onMouseLeave={accountRadio.handleMouseLeave}
              />
              <RadioButton
                id="account-prospect"
                value="prospect"
                label="Prospect"
                isSelected={formData.accountType === 'prospect'}
                isFocused={accountRadio.focusedId === 'account-prospect'}
                onSelect={handleAccountSelect}
                onFocus={accountRadio.handleFocus}
                onBlur={accountRadio.handleBlur}
                onMouseEnter={accountRadio.handleMouseEnter}
                onMouseLeave={accountRadio.handleMouseLeave}
              />
              {errors.accountType && (
                <p className="text-[#c3402c] text-[12px] leading-[16px]">
                  {errors.accountType}
                </p>
              )}
            </div>
          </FormSection>

          {/* ── Section 2: Company Information ── */}
          <FormSection title="Company Information">
            <div id="field-companyLegalName">
              <InputText
                label="Company Legal Name"
                value={formData.companyInfo.companyLegalName}
                onChange={(v) => setCompanyField('companyLegalName', v)}
                required
                error={!!errors.companyLegalName}
                errorMessage={errors.companyLegalName}
              />
            </div>
            <div id="field-workEmail">
              <InputText
                label="Work Email Address"
                type="email"
                value={formData.companyInfo.workEmail}
                onChange={(v) => setCompanyField('workEmail', v)}
                required
                error={!!errors.workEmail}
                errorMessage={errors.workEmail}
              />
            </div>
            <div id="field-countryOfIncorporation">
              <Select
                label="Country of Incorporation"
                value={formData.companyInfo.countryOfIncorporation}
                options={countries}
                onChange={(v) => setCompanyField('countryOfIncorporation', v)}
                required
                searchable
                error={!!errors.countryOfIncorporation}
                errorMessage={errors.countryOfIncorporation}
              />
            </div>
            <div id="field-companyTaxId">
              <InputText
                label="Company Tax ID (EIN/VAT)"
                value={formData.companyInfo.companyTaxId}
                onChange={(v) => setCompanyField('companyTaxId', v)}
                required
                error={!!errors.companyTaxId}
                errorMessage={errors.companyTaxId}
              />
            </div>
            <div id="field-companyAddress">
              <InputText
                label="Company Address"
                value={formData.companyInfo.companyAddress}
                onChange={(v) => setCompanyField('companyAddress', v)}
                required
                error={!!errors.companyAddress}
                errorMessage={errors.companyAddress}
              />
            </div>
          </FormSection>

          {/* ── Section 3: Request Information ── */}
          <FormSection
            title="Request Information"
            description="Provide details about your EOR/COR request and employee/contractor information for each country."
          >
            <div id="field-avgMonthlyPayroll">
              <InputText
                label="Average Monthly Payroll (USD)"
                value={formData.avgMonthlyPayroll}
                onChange={setAvgMonthlyPayroll}
                placeholder="e.g. 250000"
                required
                error={!!errors.avgMonthlyPayroll}
                errorMessage={errors.avgMonthlyPayroll}
              />
            </div>
            <div id="field-submissionRequestType">
              <Select
                label="Submission Request Type"
                value={formData.submissionRequestType}
                options={SUBMISSION_TYPE_OPTIONS}
                onChange={(v) => setSubmissionRequestType(v as typeof formData.submissionRequestType)}
                required
                error={!!errors.submissionRequestType}
                errorMessage={errors.submissionRequestType}
              />
            </div>

            {/* Per-country requests */}
            <div id="field-countryRequests" className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <p className="font-semibold text-[14px] text-[#1a1a1a] tracking-[0.1px]">
                  Countries
                </p>
                <Button
                  appearance="secondary"
                  size="sm"
                  onClick={addCountryRequest}
                >
                  + Add Country
                </Button>
              </div>
              {errors.countryRequests && formData.countryRequests.length === 0 && (
                <p className="text-[#c3402c] text-[12px] leading-[16px]">
                  {errors.countryRequests}
                </p>
              )}

              {formData.countryRequests.map((cr, idx) => (
                <CountryRequestCard
                  key={cr.id}
                  index={idx}
                  countryRequest={cr}
                  availableCountries={availableCountries}
                  errors={errors}
                  onCountryChange={(v) => updateCountryRequest(cr.id, { country: v })}
                  onEmployeeChange={(field, value) => updateEmployeeInfo(cr.id, field, value)}
                  onContractorChange={(field, value) => updateContractorInfo(cr.id, field, value)}
                  onRemove={() => removeCountryRequest(cr.id)}
                />
              ))}
            </div>
          </FormSection>

          {/* ── Section 4: Financial and Other Details ── */}
          <FormSection
            title="Financial and Other Details"
            description="Upload the required financial documents."
          >
            <div id="field-bankStatements">
              <FileUpload
                label="Bank Statements"
                files={formData.financialDetails.bankStatements}
                onFilesChange={setBankStatements}
                required
                helpText="Most recent 3 months of bank statements from all bank accounts with cash/cash-equivalent balances."
                error={!!errors.bankStatements}
                errorMessage={errors.bankStatements}
              />
            </div>
            <div id="field-otherFinancialDocs">
              <FileUpload
                label="Other Financial Information"
                files={formData.financialDetails.otherFinancialDocs}
                onFilesChange={setOtherFinancialDocs}
                required={isOtherFinancialRequired}
                helpText={
                  isOtherFinancialRequired
                    ? 'Required: Past 2 years of financial statements (audited or CPA-prepared income statement, balance sheet, & statement of cash-flows) and documentation showing terms for bank line of credit & current balance.'
                    : 'Past 2 years of financial statements, credit line documentation. Required if monthly EOR is > $500k.'
                }
                error={!!errors.otherFinancialDocs}
                errorMessage={errors.otherFinancialDocs}
              />
            </div>
            <FileUpload
              label="Census File"
              files={formData.financialDetails.censusFile}
              onFilesChange={setCensusFile}
              helpText="If moving workers from another provider, attach an export (CSV/XLSX) of their census."
              accept=".csv,.xlsx,.xls"
            />
          </FormSection>

          {/* ── Section 5: Additional Considerations ── */}
          <FormSection
            title="Additional Considerations"
            description="Any other information you'd like the underwriting team to review."
          >
            <TextArea
              label="Additional Notes"
              value={formData.additionalConsiderations}
              onChange={setAdditionalConsiderations}
              placeholder="Enter any additional details..."
              rows={5}
            />
          </FormSection>

          {/* ── Submit ── */}
          <div className="flex justify-end pt-4 pb-10">
            <Button
              type="submit"
              appearance="primary"
              size="lg"
              disabled={isSubmitting}
              className="min-w-[200px]"
            >
              {isSubmitting ? 'Submitting...' : 'Submit Application'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* ── Country Request Sub-Form ── */

import type { CountryRequest, FormValidationErrors } from '../types/underwriting';
import type { SelectOption } from '../components/Select';

interface CountryRequestCardProps {
  index: number;
  countryRequest: CountryRequest;
  availableCountries: SelectOption[];
  errors: FormValidationErrors;
  onCountryChange: (value: string) => void;
  onEmployeeChange: (field: keyof CountryRequest['employeeInfo'], value: string) => void;
  onContractorChange: (field: keyof CountryRequest['contractorInfo'], value: string) => void;
  onRemove: () => void;
}

function CountryRequestCard({
  index,
  countryRequest,
  availableCountries,
  errors,
  onCountryChange,
  onEmployeeChange,
  onContractorChange,
  onRemove,
}: CountryRequestCardProps) {
  const currentCountryOption = countries.find((c) => c.id === countryRequest.country);
  const selectableCountries = currentCountryOption
    ? [currentCountryOption, ...availableCountries]
    : availableCountries;

  return (
    <div className="border border-[#e5e7eb] rounded-lg bg-white p-5 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <p className="font-semibold text-[14px] text-[#1a1a1a]">Country {index + 1}</p>
        <button
          type="button"
          onClick={onRemove}
          className="text-[13px] text-[#c3402c] hover:underline"
        >
          Remove
        </button>
      </div>

      <Select
        label="Country"
        value={countryRequest.country}
        options={selectableCountries}
        onChange={onCountryChange}
        required
        searchable
        error={!!errors[`country_${index}`]}
        errorMessage={errors[`country_${index}`]}
      />

      {/* Employee Information */}
      <div className="flex flex-col gap-3">
        <p className="font-semibold text-[13px] text-[#6b7280] tracking-[0.1px]">
          Employee Information
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <InputText
            label="Number of Employees"
            value={countryRequest.employeeInfo.numberOfEmployees}
            onChange={(v) => onEmployeeChange('numberOfEmployees', v)}
            required
            error={!!errors[`employees_${index}`]}
            errorMessage={errors[`employees_${index}`]}
          />
          <InputText
            label="Avg Monthly Salary (USD)"
            value={countryRequest.employeeInfo.avgMonthlySalaryUsd}
            onChange={(v) => onEmployeeChange('avgMonthlySalaryUsd', v)}
            required
            error={!!errors[`salary_${index}`]}
            errorMessage={errors[`salary_${index}`]}
          />
          <InputText
            label="Avg EOY Bonus (USD)"
            value={countryRequest.employeeInfo.avgEoyBonusUsd}
            onChange={(v) => onEmployeeChange('avgEoyBonusUsd', v)}
            placeholder="Optional"
          />
        </div>
      </div>

      {/* Contractor Information */}
      <div className="flex flex-col gap-3">
        <p className="font-semibold text-[13px] text-[#6b7280] tracking-[0.1px]">
          Contractor Information
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <InputText
            label="Monthly/Hourly Contractors"
            value={countryRequest.contractorInfo.numberOfMonthlyHourlyContractors}
            onChange={(v) => onContractorChange('numberOfMonthlyHourlyContractors', v)}
          />
          <InputText
            label="Milestone Contractors"
            value={countryRequest.contractorInfo.numberOfMilestoneContractors}
            onChange={(v) => onContractorChange('numberOfMilestoneContractors', v)}
          />
          <InputText
            label="Avg Monthly Pay (USD)"
            value={countryRequest.contractorInfo.avgMonthlyPayUsd}
            onChange={(v) => onContractorChange('avgMonthlyPayUsd', v)}
            placeholder="Optional"
          />
          <InputText
            label="Avg Milestone Amount (USD)"
            value={countryRequest.contractorInfo.avgMilestoneAmountUsd}
            onChange={(v) => onContractorChange('avgMilestoneAmountUsd', v)}
            placeholder="Optional"
          />
        </div>
      </div>
    </div>
  );
}
