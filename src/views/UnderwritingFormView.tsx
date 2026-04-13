import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUnderwritingForm } from '../hooks/useUnderwritingForm';
import { submitUnderwritingApplication } from '../utils/api';
import { countries } from '../utils/countries';
import InputText from '../components/InputText';
import Select from '../components/Select';
import FileUpload from '../components/FileUpload';
import TextArea from '../components/TextArea';
import Button from '../components/Button';
import AlertBanner from '../components/AlertBanner';
import CensusCsvUploadSection from '../components/CensusCsvUploadSection';

import type { WorkforceReason } from '../types/underwriting';

const WORKFORCE_REASON_OPTIONS = [
  { id: 'first_time', label: 'Setting up workforce for the first time' },
  { id: 'moving_existing', label: 'Moving existing workforce from another provider' },
];

const PRODUCT_TYPE_OPTIONS = [
  { id: 'eor', label: 'Employer of Record Request' },
  { id: 'cor', label: 'Contractor of Record' },
  { id: 'both', label: 'Both' },
];

const ENTITY_TYPE_OPTIONS = [
  { id: 'llc', label: 'LLC' },
  { id: 'corporation', label: 'Corporation' },
  { id: 'partnership', label: 'Partnership' },
  { id: 's_corp', label: 'S Corporation' },
  { id: 'c_corp', label: 'C Corporation' },
  { id: 'sole_proprietorship', label: 'Sole Proprietorship' },
  { id: 'nonprofit', label: 'Non-profit' },
  { id: 'other', label: 'Other' },
];

const INDUSTRY_OPTIONS = [
  { id: 'technology', label: 'Technology' },
  { id: 'healthcare', label: 'Healthcare' },
  { id: 'finance', label: 'Finance & Banking' },
  { id: 'manufacturing', label: 'Manufacturing' },
  { id: 'retail', label: 'Retail & E-commerce' },
  { id: 'education', label: 'Education' },
  { id: 'consulting', label: 'Consulting & Professional Services' },
  { id: 'media', label: 'Media & Entertainment' },
  { id: 'real_estate', label: 'Real Estate' },
  { id: 'energy', label: 'Energy & Utilities' },
  { id: 'transportation', label: 'Transportation & Logistics' },
  { id: 'hospitality', label: 'Hospitality & Tourism' },
  { id: 'agriculture', label: 'Agriculture' },
  { id: 'construction', label: 'Construction' },
  { id: 'legal', label: 'Legal' },
  { id: 'telecom', label: 'Telecommunications' },
  { id: 'other', label: 'Other' },
];

const US_STATES = [
  { id: 'AL', label: 'Alabama' }, { id: 'AK', label: 'Alaska' }, { id: 'AZ', label: 'Arizona' },
  { id: 'AR', label: 'Arkansas' }, { id: 'CA', label: 'California' }, { id: 'CO', label: 'Colorado' },
  { id: 'CT', label: 'Connecticut' }, { id: 'DE', label: 'Delaware' }, { id: 'FL', label: 'Florida' },
  { id: 'GA', label: 'Georgia' }, { id: 'HI', label: 'Hawaii' }, { id: 'ID', label: 'Idaho' },
  { id: 'IL', label: 'Illinois' }, { id: 'IN', label: 'Indiana' }, { id: 'IA', label: 'Iowa' },
  { id: 'KS', label: 'Kansas' }, { id: 'KY', label: 'Kentucky' }, { id: 'LA', label: 'Louisiana' },
  { id: 'ME', label: 'Maine' }, { id: 'MD', label: 'Maryland' }, { id: 'MA', label: 'Massachusetts' },
  { id: 'MI', label: 'Michigan' }, { id: 'MN', label: 'Minnesota' }, { id: 'MS', label: 'Mississippi' },
  { id: 'MO', label: 'Missouri' }, { id: 'MT', label: 'Montana' }, { id: 'NE', label: 'Nebraska' },
  { id: 'NV', label: 'Nevada' }, { id: 'NH', label: 'New Hampshire' }, { id: 'NJ', label: 'New Jersey' },
  { id: 'NM', label: 'New Mexico' }, { id: 'NY', label: 'New York' }, { id: 'NC', label: 'North Carolina' },
  { id: 'ND', label: 'North Dakota' }, { id: 'OH', label: 'Ohio' }, { id: 'OK', label: 'Oklahoma' },
  { id: 'OR', label: 'Oregon' }, { id: 'PA', label: 'Pennsylvania' }, { id: 'RI', label: 'Rhode Island' },
  { id: 'SC', label: 'South Carolina' }, { id: 'SD', label: 'South Dakota' }, { id: 'TN', label: 'Tennessee' },
  { id: 'TX', label: 'Texas' }, { id: 'UT', label: 'Utah' }, { id: 'VT', label: 'Vermont' },
  { id: 'VA', label: 'Virginia' }, { id: 'WA', label: 'Washington' }, { id: 'WV', label: 'West Virginia' },
  { id: 'WI', label: 'Wisconsin' }, { id: 'WY', label: 'Wyoming' }, { id: 'DC', label: 'District of Columbia' },
];

const PHONE_CODES = [
  { id: '+1', label: '+1 US' },
  { id: '+44', label: '+44 UK' },
  { id: '+91', label: '+91 IN' },
  { id: '+49', label: '+49 DE' },
  { id: '+33', label: '+33 FR' },
  { id: '+61', label: '+61 AU' },
  { id: '+81', label: '+81 JP' },
  { id: '+86', label: '+86 CN' },
  { id: '+55', label: '+55 BR' },
  { id: '+52', label: '+52 MX' },
];

export default function UnderwritingFormView() {
  const navigate = useNavigate();

  const {
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
    setWaiveDepositForFee,
    setEorCensusCsv,
    setCorCensusCsv,
    setBankStatements,
    setOtherFinancialDocs,
    setAdditionalConsiderations,
    validate,
    validateStep,
    setIsSubmitting,
  } = useUnderwritingForm();

  const [currentStep, setCurrentStep] = useState(0);
  const [noCensusFile, setNoCensusFile] = useState(false);

  const handleSubmit = async () => {
    if (!validate(noCensusFile)) {
      const errorKeys = Object.keys(errors);
      if (errorKeys.length > 0) {
        const el = document.getElementById(`field-${errorKeys[0]}`);
        el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }

    setIsSubmitting(true);
    try {
      await submitUnderwritingApplication(formData);
      navigate('/apply/confirmation');
    } catch (err) {
      console.error('Submission failed:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const goNext = () => {
    if (!validateStep(currentStep, noCensusFile)) {
      const firstErrorEl = document.querySelector('[id^="field-"]');
      if (firstErrorEl) {
        firstErrorEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setCurrentStep((s) => Math.min(s + 1, 2));
  };

  const goBack = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setCurrentStep((s) => Math.max(s - 1, 0));
  };


  const showEor = formData.productType === 'eor' || formData.productType === 'both';
  const showCor = formData.productType === 'cor' || formData.productType === 'both';

  const payrollNum = parseFloat(formData.avgMonthlyPayroll.replace(/[^0-9.]/g, '')) || 0;
  const isOtherFinancialRequired = payrollNum > 500000;

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <div className="flex-1">
        <div className="max-w-[720px] mx-auto px-6 py-10">
          <div className="mb-6">
            <h1 className="text-[26px] font-bold leading-[34px] text-[#1a1a1a] tracking-[-0.2px]">
              EOR Underwriting Application
            </h1>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSubmit();
            }}
            className="flex flex-col gap-6"
          >
            {/* ─── Step 1: Company Information ─── */}
            {currentStep === 0 && (
              <div className="flex flex-col gap-5">
                <div className="flex flex-col gap-1 mb-2">
                  <h2 className="text-[18px] font-bold leading-[26px] text-[#1a1a1a] tracking-[0.1px]">
                    Step 1/3: Company Information
                  </h2>
                </div>

                <div className="flex flex-col gap-4">
                  <p className="font-semibold text-[14px] text-[#1a1a1a] tracking-[0.1px]">
                    Company address
                  </p>
                  <div id="field-companyCountry">
                    <Select
                      label="Country"
                      value={formData.companyInfo.companyAddress.country}
                      options={countries}
                      onChange={(v) => setCompanyAddress('country', v)}
                      required
                      searchable
                      error={!!errors.companyCountry}
                      errorMessage={errors.companyCountry}
                    />
                  </div>
                  <div id="field-companyStreet">
                    <InputText
                      label="Street"
                      value={formData.companyInfo.companyAddress.street}
                      onChange={(v) => setCompanyAddress('street', v)}
                      required
                      error={!!errors.companyStreet}
                      errorMessage={errors.companyStreet}
                    />
                  </div>
                  <div id="field-companyCity">
                    <InputText
                      label="City"
                      value={formData.companyInfo.companyAddress.city}
                      onChange={(v) => setCompanyAddress('city', v)}
                      required
                      error={!!errors.companyCity}
                      errorMessage={errors.companyCity}
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div id="field-companyState">
                      <Select
                        label="State"
                        value={formData.companyInfo.companyAddress.state}
                        options={US_STATES}
                        onChange={(v) => setCompanyAddress('state', v)}
                        required
                        searchable
                        error={!!errors.companyState}
                        errorMessage={errors.companyState}
                      />
                    </div>
                    <div id="field-companyZip">
                      <InputText
                        label="Zip code"
                        value={formData.companyInfo.companyAddress.zipCode}
                        onChange={(v) => setCompanyAddress('zipCode', v)}
                        required
                        error={!!errors.companyZip}
                        errorMessage={errors.companyZip}
                      />
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-4">
                  <div className="flex items-center gap-1.5">
                    <p className="font-semibold text-[14px] text-[#1a1a1a] tracking-[0.1px]">
                      Company incorporated address
                    </p>
                    <div className="relative group">
                      <svg className="w-4 h-4 text-[#9ca3af] cursor-help" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                      </svg>
                      <div className="absolute z-10 hidden group-hover:block bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-[#1a1a1a] text-white text-[12px] rounded-lg whitespace-nowrap shadow-lg">
                        Leave blank if same as company address
                      </div>
                    </div>
                  </div>
                  <Select
                    label="Country"
                    value={formData.companyInfo.incorporatedAddress.country}
                    options={countries}
                    onChange={(v) => setIncorporatedAddress('country', v)}
                    searchable
                  />
                  <InputText
                    label="Street"
                    value={formData.companyInfo.incorporatedAddress.street}
                    onChange={(v) => setIncorporatedAddress('street', v)}
                  />
                  <InputText
                    label="City"
                    value={formData.companyInfo.incorporatedAddress.city}
                    onChange={(v) => setIncorporatedAddress('city', v)}
                  />
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <Select
                      label="State"
                      value={formData.companyInfo.incorporatedAddress.state}
                      options={US_STATES}
                      onChange={(v) => setIncorporatedAddress('state', v)}
                      searchable
                    />
                    <InputText
                      label="Zip code"
                      value={formData.companyInfo.incorporatedAddress.zipCode}
                      onChange={(v) => setIncorporatedAddress('zipCode', v)}
                    />
                  </div>
                </div>

                <div id="field-companyPhone">
                  <div className="flex flex-col gap-1">
                    <div className="flex gap-1 items-center">
                      <p className="font-semibold leading-[22px] text-[#1a1a1a] text-[14px] tracking-[0.1px]">
                        Company phone number
                      </p>
                      <div className="flex flex-col justify-center leading-[0] text-[#c3402c] whitespace-nowrap">
                        <p className="leading-[22px]">*</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <select
                        value={formData.companyInfo.companyPhoneCountryCode}
                        onChange={(e) => setCompanyField('companyPhoneCountryCode', e.target.value)}
                        className="h-10 px-3 py-[9px] rounded-lg border border-[#d5d5d5] bg-white text-[14px] text-[#1a1a1a] outline-none focus:border-[#4a6ba6] transition-all duration-200 w-[110px] shrink-0"
                      >
                        {PHONE_CODES.map((code) => (
                          <option key={code.id} value={code.id}>
                            {code.label}
                          </option>
                        ))}
                      </select>
                      <input
                        type="tel"
                        value={formData.companyInfo.companyPhoneNumber}
                        onChange={(e) => setCompanyField('companyPhoneNumber', e.target.value)}
                        placeholder="Company phone number"
                        className={`flex-1 h-10 px-4 py-[9px] rounded-lg border bg-white text-[15px] leading-[22px] text-black tracking-[0.5px] outline-none transition-all duration-200 ${
                          errors.companyPhone ? 'border-[#c3402c]' : 'border-[#d5d5d5] focus:border-[#4a6ba6]'
                        }`}
                      />
                    </div>
                    {errors.companyPhone && (
                      <p className="text-[#c3402c] text-[12px] leading-[16px]">{errors.companyPhone}</p>
                    )}
                  </div>
                </div>

                <div id="field-companyEntityType">
                  <Select
                    label="Company entity type"
                    value={formData.companyInfo.companyEntityType}
                    options={ENTITY_TYPE_OPTIONS}
                    onChange={(v) => setCompanyField('companyEntityType', v)}
                    required
                    searchable
                    error={!!errors.companyEntityType}
                    errorMessage={errors.companyEntityType}
                  />
                </div>

                {formData.companyInfo.companyEntityType === 'sole_proprietorship' && (
                  <AlertBanner
                    variant="error"
                    message="Rippling does not currently support sole proprietorships for EOR services."
                  />
                )}

                <div id="field-industry">
                  <Select
                    label="What industry does your company operate in?"
                    value={formData.companyInfo.industry}
                    options={INDUSTRY_OPTIONS}
                    onChange={(v) => setCompanyField('industry', v)}
                    required
                    searchable
                    error={!!errors.industry}
                    errorMessage={errors.industry}
                  />
                </div>

                <div id="field-companyDbaName">
                  <InputText
                    label="Company DBA name"
                    value={formData.companyInfo.companyDbaName}
                    onChange={(v) => setCompanyField('companyDbaName', v)}
                    required
                    error={!!errors.companyDbaName}
                    errorMessage={errors.companyDbaName}
                  />
                </div>

                <div id="field-companyTaxId">
                  <InputText
                    label="Company tax ID"
                    value={formData.companyInfo.companyTaxId}
                    onChange={(v) => setCompanyField('companyTaxId', v)}
                    required
                    error={!!errors.companyTaxId}
                    errorMessage={errors.companyTaxId}
                  />
                </div>

                <InputText
                  label="Company website (optional)"
                  value={formData.companyInfo.companyWebsite}
                  onChange={(v) => setCompanyField('companyWebsite', v)}
                  type="url"
                  placeholder="Company website (optional)"
                />

                {/* Step 1 Footer */}
                <StepFooter
                  onNext={goNext}
                />
              </div>
            )}

            {/* ─── Step 2: Request Details ─── */}
            {currentStep === 1 && (
              <div className="flex flex-col gap-5">
                <div className="flex flex-col gap-1 mb-2">
                  <h2 className="text-[18px] font-bold leading-[26px] text-[#1a1a1a] tracking-[0.1px]">
                    Step 2/3: Request Details
                  </h2>
                </div>

                <div id="field-workforceReason">
                  <Select
                    label="How can we help you?"
                    value={formData.workforceReason}
                    options={WORKFORCE_REASON_OPTIONS}
                    onChange={(v) => setWorkforceReason(v as WorkforceReason)}
                    required
                    error={!!errors.workforceReason}
                    errorMessage={errors.workforceReason}
                  />
                </div>

                <div id="field-productType">
                  <Select
                    label="Product Type"
                    value={formData.productType}
                    options={PRODUCT_TYPE_OPTIONS}
                    onChange={(v) => setProductType(v as typeof formData.productType)}
                    required
                    error={!!errors.productType}
                    errorMessage={errors.productType}
                  />
                </div>

                {formData.productType && formData.workforceReason === 'moving_existing' && (
                  <>
                    <div id="field-workforceCensusFile">
                      <FileUpload
                        label="Workforce Census File"
                        files={formData.workforceCensusFile}
                        onFilesChange={setWorkforceCensusFile}
                        helpText="Upload a census file (CSV/XLSX) of the workforce you are moving from another provider."
                        accept=".csv,.xlsx,.xls"
                        disabled={noCensusFile}
                        error={!!errors.workforceCensusFile}
                        errorMessage={errors.workforceCensusFile}
                      />
                    </div>

                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={noCensusFile}
                        onChange={(e) => {
                          setNoCensusFile(e.target.checked);
                          if (e.target.checked) setWorkforceCensusFile([]);
                        }}
                        className="h-4 w-4 rounded border-[#d5d5d5] accent-[#4a6ba6] cursor-pointer"
                      />
                      <span className="text-[14px] leading-[20px] text-[#1a1a1a]">
                        I don't have a census file
                      </span>
                    </label>
                  </>
                )}

                {formData.productType && (formData.workforceReason === 'first_time' || (formData.workforceReason === 'moving_existing' && noCensusFile)) && (
                  <>
                    {showEor && showCor ? (
                      <CensusCsvUploadSection
                        title="Employer of Record & Contractor of Record Details"
                        slots={[
                          {
                            label: 'EOR Template.csv',
                            templatePath: '/EOR Template.csv',
                            fieldId: 'field-eorCensusCsv',
                            files: formData.eorCensusCsv,
                            onFilesChange: setEorCensusCsv,
                            error: !!errors.eorCensusCsv,
                            errorMessage: errors.eorCensusCsv,
                          },
                          {
                            label: 'COR Template.csv',
                            templatePath: '/COR Template.csv',
                            fieldId: 'field-corCensusCsv',
                            files: formData.corCensusCsv,
                            onFilesChange: setCorCensusCsv,
                            error: !!errors.corCensusCsv,
                            errorMessage: errors.corCensusCsv,
                          },
                        ]}
                      />
                    ) : showEor ? (
                      <CensusCsvUploadSection
                        title="Employer of Record Details"
                        slots={[{
                          label: 'EOR Template.csv',
                          templatePath: '/EOR Template.csv',
                          fieldId: 'field-eorCensusCsv',
                          files: formData.eorCensusCsv,
                          onFilesChange: setEorCensusCsv,
                          error: !!errors.eorCensusCsv,
                          errorMessage: errors.eorCensusCsv,
                        }]}
                      />
                    ) : showCor ? (
                      <CensusCsvUploadSection
                        title="Contractor of Record Details"
                        slots={[{
                          label: 'COR Template.csv',
                          templatePath: '/COR Template.csv',
                          fieldId: 'field-corCensusCsv',
                          files: formData.corCensusCsv,
                          onFilesChange: setCorCensusCsv,
                          error: !!errors.corCensusCsv,
                          errorMessage: errors.corCensusCsv,
                        }]}
                      />
                    ) : null}
                  </>
                )}

                <div
                  onClick={() => setWaiveDepositForFee(!formData.waiveDepositForFee)}
                  className={`rounded-lg p-5 cursor-pointer transition-all duration-200 border ${
                    formData.waiveDepositForFee
                      ? 'border-[#4a6ba6] bg-[#f0f4fa]'
                      : 'border-[#e5e7eb] bg-white hover:border-[#c0cde0]'
                  }`}
                >
                  <label className="flex items-center gap-4 cursor-pointer">
                    <div className={`w-10 h-[22px] rounded-full p-[2px] transition-all duration-200 shrink-0 ${
                      formData.waiveDepositForFee ? 'bg-[#4a6ba6]' : 'bg-[#d5d5d5]'
                    }`}>
                      <div className={`w-[18px] h-[18px] rounded-full bg-white shadow-sm transition-transform duration-200 ${
                        formData.waiveDepositForFee ? 'translate-x-[18px]' : 'translate-x-0'
                      }`} />
                    </div>
                    <div className="flex flex-col gap-1">
                      <span className="text-[14px] leading-[20px] font-semibold text-[#1a1a1a]">
                        Request a Deposit Waiver
                      </span>
                      <span className="text-[13px] leading-[18px] text-[#6b7280]">
                        Rippling EOR requires a refundable collateral deposit per employee. Eligible companies can request to waive this deposit and instead pay a fixed fee of up to $150 per employee per month, subject to credit risk review during underwriting.
                      </span>
                    </div>
                  </label>
                </div>

                {/* Step 2 Footer */}
                <StepFooter
                  onBack={goBack}
                  onNext={goNext}
                />
              </div>
            )}

            {/* ─── Step 3: Financial & Other Details ─── */}
            {currentStep === 2 && (
              <div className="flex flex-col gap-5">
                <div className="flex flex-col gap-1 mb-2">
                  <h2 className="text-[18px] font-bold leading-[26px] text-[#1a1a1a] tracking-[0.1px]">
                    Step 3/3: Financial & Other Details
                  </h2>
                  <p className="text-[14px] leading-[20px] text-[#6b7280] tracking-[0.1px]">
                    Upload the required financial documents and add any additional notes.
                  </p>
                </div>

                <div id="field-bankStatements">
                  <FileUpload
                    label="Bank Statements"
                    files={formData.financialDetails.bankStatements}
                    onFilesChange={setBankStatements}
                    required
                    helpText="Submit the last 3 months of bank statements (as PDFs). We review total cash balance relative to payroll, so if the company has multiple cash accounts, please upload 3 months for each."
                    error={!!errors.bankStatements}
                    errorMessage={errors.bankStatements}
                  />
                </div>
                <div id="field-otherFinancialDocs">
                  <FileUpload
                    label="Financial Statements"
                    files={formData.financialDetails.otherFinancialDocs}
                    onFilesChange={setOtherFinancialDocs}
                    required={isOtherFinancialRequired}
                    helpText="Past 2 years of financial statements: audited or CPA-prepared income statement, balance sheet, & statement of cash-flows. Required if adding > 5 workers or total annual worker cost expected > $500K."
                    error={!!errors.otherFinancialDocs}
                    errorMessage={errors.otherFinancialDocs}
                  />
                </div>

                <div className="border-t border-[#e5e7eb] pt-5 mt-2">
                  <div className="flex flex-col gap-1 mb-4">
                    <h3 className="text-[16px] font-bold text-[#1a1a1a]">Additional Considerations</h3>
                    <p className="text-[14px] leading-[20px] text-[#6b7280]">
                      Any other information you'd like the underwriting team to review.
                    </p>
                  </div>
                  <TextArea
                    label="Additional Notes"
                    value={formData.additionalConsiderations}
                    onChange={setAdditionalConsiderations}
                    placeholder="Enter any additional details..."
                    rows={5}
                  />
                </div>

                {/* Step 3 Footer */}
                <StepFooter
                  onBack={goBack}
                  submitLabel={isSubmitting ? 'Submitting...' : 'Submit'}
                  submitDisabled={isSubmitting}
                  isLastStep
                />
              </div>
            )}
          </form>

        </div>
      </div>
    </div>
  );
}

/* ─── Step Footer ─── */

function StepFooter({
  onBack,
  onNext,
  submitLabel,
  submitDisabled,
  isLastStep,
}: {
  onBack?: () => void;
  onNext?: () => void;
  submitLabel?: string;
  submitDisabled?: boolean;
  isLastStep?: boolean;
}) {
  return (
    <div className="flex items-center justify-between pt-6 pb-4 border-t border-[#e5e7eb] mt-4">
      <div className="flex items-center gap-3">
        {onBack && (
          <Button type="button" appearance="secondary" size="lg" onClick={onBack} className="min-w-[100px]">
            Back
          </Button>
        )}
      </div>
      <div>
        {isLastStep ? (
          <Button
            type="submit"
            appearance="primary"
            size="lg"
            disabled={submitDisabled}
            className="min-w-[200px]"
          >
            {submitLabel}
          </Button>
        ) : onNext ? (
          <Button type="button" appearance="primary" size="lg" onClick={onNext} className="min-w-[120px]">
            Next
          </Button>
        ) : null}
      </div>
    </div>
  );
}
