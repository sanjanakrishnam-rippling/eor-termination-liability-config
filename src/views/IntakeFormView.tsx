import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { IntakeInfo } from '../types/underwriting';

import FormSection from '../components/FormSection';
import InputText from '../components/InputText';
import Select from '../components/Select';
import Button from '../components/Button';

const ROLE_OPTIONS = [
  { id: 'ceo_owner', label: 'CEO/Owner' },
  { id: 'finance_leader', label: 'Finance Leader' },
  { id: 'hr_leader', label: 'HR Leader' },
  { id: 'other', label: 'Other' },
];

interface IntakeErrors {
  firstName?: string;
  lastName?: string;
  role?: string;
  companyLegalName?: string;
  workEmail?: string;
  phoneNumber?: string;
}

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
  { id: '+34', label: '+34 ES' },
  { id: '+39', label: '+39 IT' },
  { id: '+82', label: '+82 KR' },
  { id: '+65', label: '+65 SG' },
  { id: '+971', label: '+971 AE' },
  { id: '+31', label: '+31 NL' },
  { id: '+46', label: '+46 SE' },
  { id: '+41', label: '+41 CH' },
  { id: '+353', label: '+353 IE' },
  { id: '+972', label: '+972 IL' },
];

function isEmailValid(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export default function IntakeFormView() {
  const [info, setInfo] = useState<IntakeInfo>({
    firstName: '',
    lastName: '',
    role: '',
    companyLegalName: '',
    workEmail: '',
    phoneCountryCode: '+1',
    phoneNumber: '',
  });
  const [errors, setErrors] = useState<IntakeErrors>({});
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const updateField = <K extends keyof IntakeInfo>(field: K, value: IntakeInfo[K]) => {
    setInfo((prev) => ({ ...prev, [field]: value }));
  };

  const validate = (): boolean => {
    const errs: IntakeErrors = {};

    if (!info.firstName.trim()) errs.firstName = 'First name is required';
    if (!info.lastName.trim()) errs.lastName = 'Last name is required';
    if (!info.role) errs.role = 'Please select your role';
    if (!info.companyLegalName.trim()) errs.companyLegalName = 'Company legal name is required';
    if (!info.workEmail.trim()) {
      errs.workEmail = 'Work email is required';
    } else if (!isEmailValid(info.workEmail)) {
      errs.workEmail = 'Please enter a valid email address';
    }
    if (!info.phoneNumber.trim()) errs.phoneNumber = 'Phone number is required';

    setErrors(errs);
    return Object.keys(errs).length === 0;
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

    const intakeData = { info };
    localStorage.setItem('underwriting_intake', JSON.stringify(intakeData));

    await new Promise((r) => setTimeout(r, 800));
    setIsSubmitting(false);
    navigate('/apply/email-sent');
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-[720px] mx-auto px-6 py-10">
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
          <FormSection title="Basic Information">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div id="field-firstName">
                <InputText
                  label="First name"
                  value={info.firstName}
                  onChange={(v) => updateField('firstName', v)}
                  required
                  error={!!errors.firstName}
                  errorMessage={errors.firstName}
                />
              </div>
              <div id="field-lastName">
                <InputText
                  label="Last name"
                  value={info.lastName}
                  onChange={(v) => updateField('lastName', v)}
                  required
                  error={!!errors.lastName}
                  errorMessage={errors.lastName}
                />
              </div>
            </div>
            <div id="field-companyLegalName">
              <InputText
                label="Company legal name"
                value={info.companyLegalName}
                onChange={(v) => updateField('companyLegalName', v)}
                required
                error={!!errors.companyLegalName}
                errorMessage={errors.companyLegalName}
              />
            </div>
            <div id="field-role">
              <Select
                label="Your role"
                value={info.role}
                options={ROLE_OPTIONS}
                onChange={(v) => updateField('role', v)}
                required
                error={!!errors.role}
                errorMessage={errors.role}
              />
            </div>
            <div id="field-workEmail">
              <InputText
                label="Work email address"
                type="email"
                value={info.workEmail}
                onChange={(v) => updateField('workEmail', v)}
                required
                error={!!errors.workEmail}
                errorMessage={errors.workEmail}
              />
            </div>
            <div id="field-phoneNumber">
              <div className="flex flex-col gap-1">
                <div className="flex gap-1 items-center">
                  <p className="font-semibold leading-[22px] text-[#1a1a1a] text-[14px] tracking-[0.1px]">
                    Applicant phone number
                  </p>
                  <div className="flex flex-col justify-center leading-[0] text-[#c3402c] whitespace-nowrap">
                    <p className="leading-[22px]">*</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <select
                    value={info.phoneCountryCode}
                    onChange={(e) => updateField('phoneCountryCode', e.target.value)}
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
                    value={info.phoneNumber}
                    onChange={(e) => updateField('phoneNumber', e.target.value)}
                    placeholder="Applicant phone number"
                    className={`flex-1 h-10 px-4 py-[9px] rounded-lg border bg-white text-[15px] leading-[22px] text-black tracking-[0.5px] outline-none transition-all duration-200 ${
                      errors.phoneNumber ? 'border-[#c3402c]' : 'border-[#d5d5d5] focus:border-[#4a6ba6]'
                    }`}
                  />
                </div>
                {errors.phoneNumber && (
                  <p className="text-[#c3402c] text-[12px] leading-[16px]">{errors.phoneNumber}</p>
                )}
              </div>
            </div>
          </FormSection>

          <div className="flex justify-end pt-4 pb-10">
            <Button
              type="submit"
              appearance="primary"
              size="lg"
              disabled={isSubmitting}
              className="min-w-[200px]"
            >
              {isSubmitting ? 'Submitting...' : 'Submit'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
