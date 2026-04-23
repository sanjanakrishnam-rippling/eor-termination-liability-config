import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { COUNTRIES } from '../data/countries';
import { MemberCondition, PolicyComponent } from '../data/terminationPolicies';
import { usePolicyStore } from '../store/policyStore';
import Button from '../components/Button';
import Select from '../components/Select';
import InputText from '../components/InputText';

interface ConditionPill {
  id: string;
  field: string;
  fieldLabel: string;
  operator: string;
  value: string;
}

type ConditionGroup = ConditionPill[];

interface SeveranceSubComponent {
  enabled: boolean;
  salaryBasis: string[];
  method?: string;
  valueDays?: string;
  maxCapDays?: string;
  maxCapMonthlySalary?: string;
}

interface SeveranceConfig {
  type: 'severance';
  salaryBasis: string[];
  subComponents: {
    mta_severance: SeveranceSubComponent;
    redundancy_pay: SeveranceSubComponent;
    gratuity: SeveranceSubComponent;
  };
}

interface VacationPayConfig {
  type: 'vacation_pay';
  salaryBasis: string[];
  vacationMinimum?: string;
  vacationFixedDays?: string;
  maxCapDays?: string;
}

interface NoticePeriodConfig {
  type: 'notice_period_pay';
  salaryBasis: string[];
}

type PolicyType = 'severance' | 'vacation_pay' | 'notice_period_pay';
type ComponentConfig = SeveranceConfig | VacationPayConfig | NoticePeriodConfig;

const SEVERANCE_SUB_COMPONENTS = [
  { id: 'mta_severance' as const, label: 'MTA Severance' },
  { id: 'redundancy_pay' as const, label: 'Redundancy Pay' },
  { id: 'gratuity' as const, label: 'Gratuity' },
];

function createEmptySeverance(): SeveranceConfig {
  return {
    type: 'severance',
    salaryBasis: [],
    subComponents: {
      mta_severance: { enabled: false, salaryBasis: [] },
      redundancy_pay: { enabled: false, salaryBasis: [] },
      gratuity: { enabled: false, salaryBasis: [] },
    },
  };
}

const CONDITION_FIELD_OPTIONS = [
  { id: 'is_eor_employee', label: 'Is EOR Employee' },
  { id: 'country', label: 'Country' },
  { id: 'before_probationary_period', label: 'Before Probationary Period' },
  { id: 'contract_type', label: 'Contract Type' },
  { id: 'province', label: 'Province' },
  { id: 'tenure', label: 'Tenure' },
];

const TENURE_OPERATOR_OPTIONS = [
  { id: 'equals', label: '=' },
  { id: 'greater_than', label: '>' },
  { id: 'greater_than_or_equal', label: '>=' },
  { id: 'less_than', label: '<' },
  { id: 'less_than_or_equal', label: '<=' },
];

const PROVINCE_OPTIONS: Record<string, { id: string; label: string }[]> = {
  AR: [
    { id: 'Buenos Aires', label: 'Buenos Aires' },
    { id: 'CABA', label: 'Ciudad Autónoma de Buenos Aires' },
    { id: 'Córdoba', label: 'Córdoba' },
    { id: 'Santa Fe', label: 'Santa Fe' },
    { id: 'Mendoza', label: 'Mendoza' },
    { id: 'Tucumán', label: 'Tucumán' },
    { id: 'Salta', label: 'Salta' },
    { id: 'Misiones', label: 'Misiones' },
    { id: 'Chaco', label: 'Chaco' },
    { id: 'Entre Ríos', label: 'Entre Ríos' },
  ],
  CA: [
    { id: 'Ontario', label: 'Ontario' },
    { id: 'Quebec', label: 'Quebec' },
    { id: 'British Columbia', label: 'British Columbia' },
    { id: 'Alberta', label: 'Alberta' },
    { id: 'Manitoba', label: 'Manitoba' },
    { id: 'Saskatchewan', label: 'Saskatchewan' },
    { id: 'Nova Scotia', label: 'Nova Scotia' },
    { id: 'New Brunswick', label: 'New Brunswick' },
  ],
  IN: [
    { id: 'Maharashtra', label: 'Maharashtra' },
    { id: 'Karnataka', label: 'Karnataka' },
    { id: 'Tamil Nadu', label: 'Tamil Nadu' },
    { id: 'Delhi', label: 'Delhi' },
    { id: 'Telangana', label: 'Telangana' },
    { id: 'West Bengal', label: 'West Bengal' },
    { id: 'Gujarat', label: 'Gujarat' },
    { id: 'Rajasthan', label: 'Rajasthan' },
  ],
  BR: [
    { id: 'São Paulo', label: 'São Paulo' },
    { id: 'Rio de Janeiro', label: 'Rio de Janeiro' },
    { id: 'Minas Gerais', label: 'Minas Gerais' },
    { id: 'Bahia', label: 'Bahia' },
    { id: 'Paraná', label: 'Paraná' },
  ],
};

const FIELD_VALUE_OPTIONS: Record<string, { id: string; label: string }[]> = {
  is_eor_employee: [
    { id: 'True', label: 'True' },
  ],
  before_probationary_period: [
    { id: 'True', label: 'True' },
    { id: 'False', label: 'False' },
  ],
  contract_type: [
    { id: 'Fixed', label: 'Fixed' },
    { id: 'Indefinite', label: 'Indefinite' },
  ],
};


const SALARY_BASIS_OPTIONS = [
  { id: 'gross_base_salary', label: 'Gross base salary' },
  { id: 'target_bonus', label: 'Target bonus' },
  { id: 'signing_bonus', label: 'Signing bonus' },
  { id: 'on_target_commission', label: 'On-target commission' },
  { id: 'rice_allowances', label: 'Rice Allowances' },
  { id: 'uniform_clothing_allowance', label: 'Uniform and clothing allowance' },
  { id: 'laundry_allowance', label: 'Laundry allowance' },
  { id: 'medical_cash_allowance', label: 'Medical cash allowance' },
  { id: 'internet_allowance', label: 'Internet allowance' },
  { id: 'medical_assistance_allowance', label: 'Medical assistance allowance' },
  { id: 'productivity_incentive_allowance', label: 'Productivity incentive allowance' },
  { id: 'christmas_anniversary_gift', label: 'Christmas or anniversary gift' },
  { id: '13th_month_salary', label: '13th month salary' },
];

const METHOD_OPTIONS = [
  { id: 'fixed', label: 'Fixed' },
  { id: 'per_years_of_service', label: 'Per Years of Service' },
];

const VACATION_MINIMUM_OPTIONS = [
  { id: 'all_accrued', label: 'All Accrued' },
  { id: 'less_than_all', label: 'Less than all accrued' },
];

let pillIdCounter = 0;

function SectionLabel({ children }: { children: React.ReactNode }) {
  return <h3 className="text-[16px] font-bold text-[#1a1a1a] mb-1">{children}</h3>;
}

function SectionDescription({ children }: { children: React.ReactNode }) {
  return <p className="text-[13px] text-[#6b7280] mb-4">{children}</p>;
}

/* ─── Pill rendering helper ─── */
function PillIcon() {
  return (
    <svg className="w-3.5 h-3.5 text-[#9d9d9d] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  );
}

function AndSeparator() {
  return <span className="text-[12px] font-semibold text-[#9d9d9d] uppercase px-1">and</span>;
}

/* ─── Field Picker Popover (step 1: field, step 2: value) ─── */
function FieldPickerPopover({
  onAdd,
  onClose,
  countryCode,
}: {
  onAdd: (field: string, fieldLabel: string, operator: string, value: string) => void;
  onClose: () => void;
  countryCode: string;
}) {
  const [step, setStep] = useState<'field' | 'value'>('field');
  const [selectedField, setSelectedField] = useState('');
  const [selectedFieldLabel, setSelectedFieldLabel] = useState('');
  const [tenureOperator, setTenureOperator] = useState('greater_than_or_equal');
  const [tenureValue, setTenureValue] = useState('');
  const popoverRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleOutside = (e: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    document.addEventListener('mousedown', handleOutside);
    return () => document.removeEventListener('mousedown', handleOutside);
  }, [onClose]);

  const handleFieldClick = (id: string, label: string) => {
    setSelectedField(id);
    setSelectedFieldLabel(label);
    setStep('value');
  };

  const handleValueClick = (value: string) => {
    onAdd(selectedField, selectedFieldLabel, 'equals', value);
  };

  const handleTenureSubmit = () => {
    if (tenureValue.trim()) {
      const opLabel = TENURE_OPERATOR_OPTIONS.find((o) => o.id === tenureOperator)?.label ?? '>=';
      onAdd(selectedField, selectedFieldLabel, tenureOperator, `${opLabel} ${tenureValue.trim()} years`);
    }
  };

  const goBack = () => {
    setStep('field');
    setSelectedField('');
    setTenureValue('');
  };

  const provinces = PROVINCE_OPTIONS[countryCode] ?? [];
  const fixedValues = FIELD_VALUE_OPTIONS[selectedField];
  const isTenure = selectedField === 'tenure';
  const isProvince = selectedField === 'province';

  return (
    <div
      ref={popoverRef}
      className="absolute left-0 top-full mt-1 z-50 w-[260px] bg-white border border-[#e5e7eb] rounded-lg shadow-lg overflow-hidden"
    >
      {step === 'field' ? (
        <>
          <div className="px-3 py-2 border-b border-[#f1f1f1]">
            <p className="text-[11px] font-semibold text-[#9d9d9d] uppercase tracking-wide">Select field</p>
          </div>
          {CONDITION_FIELD_OPTIONS.map((f) => (
            <button
              key={f.id}
              onClick={() => handleFieldClick(f.id, f.label)}
              className="w-full text-left px-3 py-2.5 text-[13px] text-[#1a1a1a] hover:bg-[#f9fafb] transition-colors border-b border-[#f7f7f7] last:border-b-0"
            >
              {f.label}
            </button>
          ))}
        </>
      ) : (
        <>
          <div className="px-3 py-2 border-b border-[#f1f1f1] flex items-center gap-2">
            <button onClick={goBack} className="text-[#6b7280] hover:text-[#1a1a1a] transition-colors">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <p className="text-[11px] font-semibold text-[#9d9d9d] uppercase tracking-wide">{selectedFieldLabel}</p>
          </div>

          {isTenure ? (
            <div className="p-3 flex flex-col gap-2">
              <select
                value={tenureOperator}
                onChange={(e) => setTenureOperator(e.target.value)}
                className="h-9 px-2 text-[13px] rounded-lg border border-[#d5d5d5] outline-none focus:border-[#7A005D]"
              >
                {TENURE_OPERATOR_OPTIONS.map((o) => (
                  <option key={o.id} value={o.id}>{o.label}</option>
                ))}
              </select>
              <div className="flex gap-2">
                <input
                  autoFocus
                  type="number"
                  value={tenureValue}
                  onChange={(e) => setTenureValue(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') handleTenureSubmit(); }}
                  placeholder="Years"
                  className="flex-1 h-9 px-3 text-[13px] rounded-lg border border-[#d5d5d5] outline-none focus:border-[#7A005D] focus:ring-1 focus:ring-[#7A005D]/20"
                />
                <button
                  onClick={handleTenureSubmit}
                  disabled={!tenureValue.trim()}
                  className="h-9 px-3 rounded-lg bg-[#7A005D] text-white text-[12px] font-medium disabled:opacity-40 hover:bg-[#65004d] transition-colors"
                >
                  Add
                </button>
              </div>
            </div>
          ) : isProvince && provinces.length > 0 ? (
            <div className="max-h-[220px] overflow-y-auto">
              {provinces.map((p) => (
                <button
                  key={p.id}
                  onClick={() => handleValueClick(p.label)}
                  className="w-full text-left px-3 py-2.5 text-[13px] text-[#1a1a1a] hover:bg-[#f9fafb] transition-colors border-b border-[#f7f7f7] last:border-b-0"
                >
                  {p.label}
                </button>
              ))}
            </div>
          ) : fixedValues ? (
            fixedValues.map((v) => (
              <button
                key={v.id}
                onClick={() => handleValueClick(v.label)}
                className="w-full text-left px-3 py-2.5 text-[13px] text-[#1a1a1a] hover:bg-[#f9fafb] transition-colors border-b border-[#f7f7f7] last:border-b-0"
              >
                {v.label}
              </button>
            ))
          ) : (
            <div className="p-3 text-[13px] text-[#6b7280]">No options available</div>
          )}
        </>
      )}
    </div>
  );
}

/* ─── Pill with floating toolbar (DELETE / CHANGE / + AND / + OR) ─── */
function ConditionPillWithToolbar({
  pill,
  onDelete,
  onAndClick,
  onOrClick,
  countryCode,
  onReplace,
}: {
  pill: ConditionPill;
  onDelete: () => void;
  onAndClick: () => void;
  onOrClick: () => void;
  countryCode: string;
  onReplace: (field: string, fieldLabel: string, operator: string, value: string) => void;
}) {
  const [showToolbar, setShowToolbar] = useState(false);
  const [showChangePicker, setShowChangePicker] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleOutside = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setShowToolbar(false);
        setShowChangePicker(false);
      }
    };
    document.addEventListener('mousedown', handleOutside);
    return () => document.removeEventListener('mousedown', handleOutside);
  }, []);

  return (
    <div ref={wrapperRef} className="relative inline-flex">
      <button
        type="button"
        onClick={() => { setShowToolbar(!showToolbar); setShowChangePicker(false); }}
        className={`inline-flex items-center gap-1.5 pl-2.5 pr-2.5 py-1.5 rounded-lg border text-[13px] transition-all cursor-pointer ${
          showToolbar
            ? 'bg-white border-[#7A005D] shadow-sm ring-1 ring-[#7A005D]/20'
            : 'bg-[#f5f5f5] border-[#e5e7eb] hover:border-[#c7c7c7]'
        }`}
      >
        <PillIcon />
        <span className="text-[#1a1a1a]">{pill.fieldLabel} → {pill.value}</span>
      </button>

      {showToolbar && (
        <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 z-50 flex items-center bg-[#1a1a1a] rounded-lg shadow-xl overflow-hidden">
          <button
            onClick={() => { onDelete(); setShowToolbar(false); }}
            className="flex items-center gap-1.5 px-3.5 py-2 text-white text-[12px] font-semibold uppercase tracking-wide hover:bg-[#333] transition-colors border-r border-[#444]"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            Delete
          </button>
          <button
            onClick={() => setShowChangePicker(!showChangePicker)}
            className="flex items-center gap-1.5 px-3.5 py-2 text-white text-[12px] font-semibold uppercase tracking-wide hover:bg-[#333] transition-colors border-r border-[#444]"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
            </svg>
            Change
          </button>
          <button
            onClick={() => { onAndClick(); setShowToolbar(false); }}
            className="flex items-center gap-1.5 px-3.5 py-2 text-white text-[12px] font-semibold uppercase tracking-wide hover:bg-[#333] transition-colors border-r border-[#444]"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            And
          </button>
          <button
            onClick={() => { onOrClick(); setShowToolbar(false); }}
            className="flex items-center gap-1.5 px-3.5 py-2 text-white text-[12px] font-semibold uppercase tracking-wide hover:bg-[#333] transition-colors"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Or
          </button>
        </div>
      )}

      {showChangePicker && (
        <div className="absolute left-0 top-full mt-1 z-[60]">
          <FieldPickerPopover
            onAdd={(f, fl, op, v) => {
              onReplace(f, fl, op, v);
              setShowToolbar(false);
              setShowChangePicker(false);
            }}
            onClose={() => setShowChangePicker(false)}
            countryCode={countryCode}
          />
        </div>
      )}
    </div>
  );
}

function OrSeparator() {
  return (
    <div className="flex items-center gap-3 my-2">
      <div className="flex-1 h-px bg-[#e5e7eb]" />
      <span className="text-[12px] font-semibold text-[#7A005D] uppercase tracking-wide">or</span>
      <div className="flex-1 h-px bg-[#e5e7eb]" />
    </div>
  );
}

/* ─── Add Condition Modal ─── */
function AddConditionModal({
  onSave,
  onClose,
  existingGroups,
  countryCode,
  countryName,
}: {
  onSave: (groups: ConditionGroup[]) => void;
  onClose: () => void;
  existingGroups: ConditionGroup[];
  countryCode: string;
  countryName: string;
}) {
  const [groups, setGroups] = useState<ConditionGroup[]>(() => {
    if (existingGroups.length > 0) return existingGroups;
    return [[
      { id: `pill-${pillIdCounter++}`, field: 'is_eor_employee', fieldLabel: 'Is EOR Employee', operator: 'equals', value: 'True' },
      { id: `pill-${pillIdCounter++}`, field: 'country', fieldLabel: 'Country', operator: 'equals', value: countryName },
    ]];
  });
  const [addPickerTarget, setAddPickerTarget] = useState<{ type: 'and'; groupIdx: number } | { type: 'or' } | null>(null);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (addPickerTarget) setAddPickerTarget(null);
        else onClose();
      }
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [onClose, addPickerTarget]);

  const addPillToGroup = (groupIdx: number, field: string, fieldLabel: string, operator: string, value: string) => {
    setGroups((prev) =>
      prev.map((g, i) => (i === groupIdx ? [...g, { id: `pill-${pillIdCounter++}`, field, fieldLabel, operator, value }] : g))
    );
    setAddPickerTarget(null);
  };

  const addNewOrGroup = (field: string, fieldLabel: string, operator: string, value: string) => {
    setGroups((prev) => [...prev, [{ id: `pill-${pillIdCounter++}`, field, fieldLabel, operator, value }]]);
    setAddPickerTarget(null);
  };

  const removePill = (groupIdx: number, pillId: string) => {
    setGroups((prev) => {
      const updated = prev.map((g, i) => (i === groupIdx ? g.filter((p) => p.id !== pillId) : g));
      return updated.filter((g) => g.length > 0);
    });
  };

  const replacePill = (groupIdx: number, pillId: string, field: string, fieldLabel: string, operator: string, value: string) => {
    setGroups((prev) =>
      prev.map((g, i) => (i === groupIdx ? g.map((p) => (p.id === pillId ? { ...p, field, fieldLabel, operator, value } : p)) : g))
    );
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />
      <div className="relative bg-white rounded-xl shadow-2xl w-[560px] max-h-[80vh] flex flex-col">
        <div className="flex items-center justify-between px-6 pt-6 pb-2">
          <h2 className="text-[18px] font-bold text-[#1a1a1a]">Conditions</h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-[#f3f4f6] transition-colors text-[#6b7280] hover:text-[#1a1a1a]"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <p className="px-6 pb-4 text-[13px] text-[#6b7280]">Click a condition to delete, change, or add with AND / OR.</p>

        <div className="flex-1 overflow-y-auto px-6 pb-4">
          <div className="border border-[#e5e7eb] rounded-lg p-4">
            <p className="text-[14px] font-semibold text-[#1a1a1a] mb-3">Include people who are</p>

            {groups.map((group, gIdx) => (
              <div key={gIdx}>
                {gIdx > 0 && <OrSeparator />}
                <div className="relative">
                  <div className="flex flex-wrap items-center gap-2">
                    {group.map((pill, pIdx) => (
                      <span key={pill.id} className="contents">
                        {pIdx > 0 && <AndSeparator />}
                        <ConditionPillWithToolbar
                          pill={pill}
                          onDelete={() => removePill(gIdx, pill.id)}
                          onAndClick={() => setAddPickerTarget({ type: 'and', groupIdx: gIdx })}
                          onOrClick={() => setAddPickerTarget({ type: 'or' })}
                          countryCode={countryCode}
                          onReplace={(f, fl, op, v) => replacePill(gIdx, pill.id, f, fl, op, v)}
                        />
                      </span>
                    ))}
                  </div>

                  {addPickerTarget?.type === 'and' && addPickerTarget.groupIdx === gIdx && (
                    <div className="relative mt-2">
                      <FieldPickerPopover
                        onAdd={(f, fl, op, v) => addPillToGroup(gIdx, f, fl, op, v)}
                        onClose={() => setAddPickerTarget(null)}
                        countryCode={countryCode}
                      />
                    </div>
                  )}
                </div>
              </div>
            ))}

            {addPickerTarget?.type === 'or' && (
              <div className="relative mt-2">
                <OrSeparator />
                <FieldPickerPopover
                  onAdd={(f, fl, op, v) => addNewOrGroup(f, fl, op, v)}
                  onClose={() => setAddPickerTarget(null)}
                  countryCode={countryCode}
                />
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-[#e5e7eb]">
          <Button appearance="secondary" size="md" onClick={onClose}>
            Cancel
          </Button>
          <Button appearance="primary" size="md" onClick={() => onSave(groups)}>
            Save
          </Button>
        </div>
      </div>
    </div>
  );
}

/* ─── Multi-select Salary Basis ─── */
function SalaryBasisMultiSelect({
  selected,
  onChange,
}: {
  selected: string[];
  onChange: (ids: string[]) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setIsOpen(false);
    };
    document.addEventListener('mousedown', handleOutside);
    return () => document.removeEventListener('mousedown', handleOutside);
  }, []);

  const toggle = (id: string) => {
    onChange(selected.includes(id) ? selected.filter((s) => s !== id) : [...selected, id]);
  };

  const selectedLabels = SALARY_BASIS_OPTIONS.filter((o) => selected.includes(o.id)).map((o) => o.label);

  return (
    <div ref={ref} className="relative">
      <label className="block text-[13px] font-medium text-[#374151] mb-1">Salary Basis</label>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full min-h-[40px] px-3 py-2 text-left bg-white border border-[#d5d5d5] rounded-lg text-[13px] hover:border-[#9d9d9d] focus:border-[#7A005D] focus:ring-1 focus:ring-[#7A005D]/20 outline-none transition-colors"
      >
        {selectedLabels.length > 0 ? (
          <div className="flex flex-wrap gap-1.5">
            {selectedLabels.map((label) => (
              <span key={label} className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-[#f2f0f7] text-[#4a284b] text-[12px] font-medium">
                {label}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    const opt = SALARY_BASIS_OPTIONS.find((o) => o.label === label);
                    if (opt) toggle(opt.id);
                  }}
                  className="text-[#9d9d9d] hover:text-[#4a284b] transition-colors"
                >
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </span>
            ))}
          </div>
        ) : (
          <span className="text-[#9d9d9d]">Select compensation variables...</span>
        )}
      </button>

      {isOpen && (
        <div className="absolute left-0 right-0 top-full mt-1 z-50 bg-white border border-[#e5e7eb] rounded-lg shadow-lg max-h-[260px] overflow-y-auto">
          {SALARY_BASIS_OPTIONS.map((opt) => {
            const checked = selected.includes(opt.id);
            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => toggle(opt.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 text-left text-[13px] hover:bg-[#f9fafb] transition-colors border-b border-[#f7f7f7] last:border-b-0 ${checked ? 'bg-[#faf8fc]' : ''}`}
              >
                <span className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 transition-colors ${checked ? 'bg-[#7A005D] border-[#7A005D]' : 'border-[#d5d5d5]'}`}>
                  {checked && (
                    <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </span>
                <span className="text-[#1a1a1a]">{opt.label}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

/* ─── Sub-component toggle inside Severance card ─── */
function SeveranceSubSection({
  label,
  sub,
  onUpdate,
}: {
  label: string;
  sub: SeveranceSubComponent;
  onUpdate: (updates: Partial<SeveranceSubComponent>) => void;
}) {
  return (
    <div className={`border rounded-lg transition-colors ${sub.enabled ? 'border-[#7A005D]/20 bg-[#faf8fc]' : 'border-[#e5e7eb] bg-white'}`}>
      <button
        type="button"
        onClick={() => onUpdate({ enabled: !sub.enabled })}
        className="w-full flex items-center gap-3 px-4 py-3 text-left"
      >
        <span className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 transition-colors ${sub.enabled ? 'bg-[#7A005D] border-[#7A005D]' : 'border-[#d5d5d5]'}`}>
          {sub.enabled && (
            <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          )}
        </span>
        <p className="text-[13px] font-semibold text-[#1a1a1a]">{label}</p>
      </button>

      {sub.enabled && (
        <div className="px-4 pb-4 pt-1 flex flex-col gap-3">
          <SalaryBasisMultiSelect
            selected={sub.salaryBasis}
            onChange={(ids) => onUpdate({ salaryBasis: ids })}
          />
          <div className="grid grid-cols-2 gap-3">
            <Select
              label="Method"
              value={sub.method ?? ''}
              options={METHOD_OPTIONS}
              onChange={(v) => onUpdate({ method: v })}
              placeholder="Select method..."
            />
            <InputText
              label="Value (calculated in days)"
              value={sub.valueDays ?? ''}
              onChange={(v) => onUpdate({ valueDays: v })}
              placeholder="e.g. 15"
            />
            <InputText
              label="Maximum cap on days offered"
              value={sub.maxCapDays ?? ''}
              onChange={(v) => onUpdate({ maxCapDays: v })}
              placeholder="N/A"
            />
            <InputText
              label="Maximum cap on monthly salary"
              value={sub.maxCapMonthlySalary ?? ''}
              onChange={(v) => onUpdate({ maxCapMonthlySalary: v })}
              placeholder="N/A"
            />
          </div>
        </div>
      )}
    </div>
  );
}

/* ─── Severance Pay Card ─── */
function SeveranceCard({
  config,
  onChange,
}: {
  config: SeveranceConfig;
  onChange: (updated: SeveranceConfig) => void;
}) {
  const updateSub = (key: keyof SeveranceConfig['subComponents'], updates: Partial<SeveranceSubComponent>) => {
    onChange({
      ...config,
      subComponents: {
        ...config.subComponents,
        [key]: { ...config.subComponents[key], ...updates },
      },
    });
  };

  return (
    <section className="bg-white border border-[#e5e7eb] rounded-lg p-6">
      <SectionLabel>Severance Components</SectionLabel>
      <SectionDescription>Select the severance sub-components and configure each one, including their salary basis.</SectionDescription>

      <p className="text-[13px] font-medium text-[#374151] mb-3">Sub-components</p>
      <div className="flex flex-col gap-3">
        {SEVERANCE_SUB_COMPONENTS.map((sc) => (
          <SeveranceSubSection
            key={sc.id}
            label={sc.label}
            sub={config.subComponents[sc.id]}
            onUpdate={(updates) => updateSub(sc.id, updates)}
          />
        ))}
      </div>
    </section>
  );
}

/* ─── Vacation Pay Card ─── */
function VacationPayCard({
  config,
  onChange,
}: {
  config: VacationPayConfig;
  onChange: (updated: VacationPayConfig) => void;
}) {
  return (
    <section className="bg-white border border-[#e5e7eb] rounded-lg p-6">
      <SectionLabel>Vacation Pay</SectionLabel>
      <SectionDescription>Configure the vacation payout entitlement and salary basis.</SectionDescription>

      <div className="mb-4">
        <SalaryBasisMultiSelect
          selected={config.salaryBasis}
          onChange={(ids) => onChange({ ...config, salaryBasis: ids })}
        />
      </div>

      <div className="mb-4">
        <Select
          label="Statutory minimum on vacation days to pay out"
          value={config.vacationMinimum ?? ''}
          options={VACATION_MINIMUM_OPTIONS}
          onChange={(v) => onChange({ ...config, vacationMinimum: v, vacationFixedDays: '' })}
          placeholder="Select..."
        />
      </div>
      {config.vacationMinimum === 'less_than_all' && (
        <div className="mb-4">
          <InputText
            label="Days"
            value={config.vacationFixedDays ?? ''}
            onChange={(v) => onChange({ ...config, vacationFixedDays: v })}
            placeholder="e.g. 5"
          />
        </div>
      )}

      <InputText
        label="Maximum cap on days offered"
        value={config.maxCapDays ?? ''}
        onChange={(v) => onChange({ ...config, maxCapDays: v })}
        placeholder="N/A"
      />
    </section>
  );
}

/* ─── Notice Period Pay Card ─── */
function NoticePeriodCard({
  config,
  onChange,
}: {
  config: NoticePeriodConfig;
  onChange: (updated: NoticePeriodConfig) => void;
}) {
  return (
    <section className="bg-white border border-[#e5e7eb] rounded-lg p-6">
      <SectionLabel>Notice Period Pay</SectionLabel>
      <SectionDescription>Select the salary basis used to calculate notice period pay.</SectionDescription>

      <SalaryBasisMultiSelect
        selected={config.salaryBasis}
        onChange={(ids) => onChange({ ...config, salaryBasis: ids })}
      />
    </section>
  );
}

/* ─── Main View ─── */
export default function CreateTerminationPolicyView() {
  const { code } = useParams<{ code: string }>();
  const navigate = useNavigate();

  const country = COUNTRIES.find((c) => c.code === code);
  const countryName = country?.name ?? code ?? 'Unknown';

  const [policyType, setPolicyType] = useState<PolicyType | null>(null);
  const [policyName, setPolicyName] = useState('');
  const [conditionGroups, setConditionGroups] = useState<ConditionGroup[]>([]);
  const [showConditionModal, setShowConditionModal] = useState(false);

  const [severanceConfig, setSeveranceConfig] = useState<SeveranceConfig>(createEmptySeverance());
  const [vacationPayConfig, setVacationPayConfig] = useState<VacationPayConfig>({ type: 'vacation_pay', salaryBasis: [] });
  const [noticePeriodConfig, setNoticePeriodConfig] = useState<NoticePeriodConfig>({ type: 'notice_period_pay', salaryBasis: [] });

  const handleSaveConditions = (newGroups: ConditionGroup[]) => {
    setConditionGroups(newGroups);
    setShowConditionModal(false);
  };

  const store = usePolicyStore();

  const handleSave = () => {
    if (!code || !policyType || !policyName.trim()) return;

    const pillToCondition = (pill: ConditionPill): MemberCondition => ({
      entity: 'Employee',
      field: `${pill.fieldLabel}?`,
      operator: pill.operator,
      value: pill.value,
    });

    const isFixedScope = policyType === 'notice_period_pay' || policyType === 'vacation_pay';
    const members: MemberCondition[] = isFixedScope
      ? [
          { entity: 'Employee', field: 'Is an EOR Employee?', operator: 'equals', value: 'True' },
          { entity: 'Employee', field: 'Country?', operator: 'equals', value: countryName },
        ]
      : conditionGroups.flat().map(pillToCondition);
    const exceptFor: MemberCondition[] = [];

    const components: PolicyComponent[] = [];
    const salaryLabel = (ids: string[]) =>
      ids.map((id) => SALARY_BASIS_OPTIONS.find((o) => o.id === id)?.label ?? id).join(', ');

    if (policyType === 'notice_period_pay') {
      components.push({ name: 'Notice Period Pay', calculationMethod: `Salary basis: ${salaryLabel(noticePeriodConfig.salaryBasis) || 'Not set'}` });
    } else if (policyType === 'vacation_pay') {
      const min = vacationPayConfig.vacationMinimum === 'all_accrued' ? 'All Accrued' :
        vacationPayConfig.vacationMinimum === 'less_than_all' ? `Less than all accrued (${vacationPayConfig.vacationFixedDays ?? '?'} days)` : 'Not set';
      const capSuffix = vacationPayConfig.maxCapDays ? `; Max cap: ${vacationPayConfig.maxCapDays} days` : '';
      components.push({ name: 'Vacation Pay', calculationMethod: `${min}${capSuffix}; Salary basis: ${salaryLabel(vacationPayConfig.salaryBasis) || 'Not set'}` });
    } else {
      for (const sc of SEVERANCE_SUB_COMPONENTS) {
        const sub = severanceConfig.subComponents[sc.id];
        if (sub.enabled) {
          const method = sub.method === 'per_years_of_service' ? 'Per years of service' : 'Fixed';
          components.push({
            name: sc.label,
            calculationMethod: `${method}: ${sub.valueDays ?? '?'} days${sub.maxCapDays ? `, max ${sub.maxCapDays} days` : ''}`,
          });
        }
      }
      if (components.length === 0) {
        components.push({ name: 'Severance', calculationMethod: `Salary basis: ${salaryLabel(severanceConfig.salaryBasis) || 'Not set'}` });
      }
    }

    store.addPolicy(code, {
      id: `${code.toLowerCase()}-custom-${Date.now()}`,
      name: policyName.trim(),
      members,
      exceptFor,
      components,
    });

    navigate(`/countries/${code}`, { state: { tab: 6 } });
  };

  /* ─── Breadcrumb ─── */
  const breadcrumb = (
    <div className="flex items-center gap-2 mb-6 text-[13px]">
      <button onClick={() => navigate('/countries')} className="text-[#6b7280] hover:text-[#1a1a1a] transition-colors">
        Countries
      </button>
      <svg className="w-3.5 h-3.5 text-[#c7c7c7]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
      </svg>
      <button onClick={() => navigate(`/countries/${code}`)} className="text-[#6b7280] hover:text-[#1a1a1a] transition-colors">
        {countryName}
      </button>
      <svg className="w-3.5 h-3.5 text-[#c7c7c7]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
      </svg>
      <span className="text-[#1a1a1a] font-medium">Add Policy</span>
    </div>
  );

  /* ─── Step 1: Choose policy type ─── */
  if (!policyType) {
    return (
      <div className="max-w-[600px] mx-auto px-8 py-8">
        {breadcrumb}
        <h1 className="text-[22px] font-bold text-[#1a1a1a] mb-2">Add Termination Liability Policy</h1>
        <p className="text-[14px] text-[#6b7280] mb-8">
          What type of policy do you want to create for {countryName}?
        </p>

        <div className="flex flex-col gap-4">
          <button
            onClick={() => setPolicyType('notice_period_pay')}
            className="group w-full text-left bg-white border border-[#e5e7eb] rounded-xl p-6 hover:border-[#7A005D] hover:shadow-md transition-all"
          >
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-lg bg-[#f2f0f7] flex items-center justify-center shrink-0 group-hover:bg-[#7A005D] transition-colors">
                <svg className="w-5 h-5 text-[#7A005D] group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h3 className="text-[16px] font-semibold text-[#1a1a1a] mb-1">Notice Period Pay</h3>
                <p className="text-[13px] text-[#6b7280] leading-relaxed">
                  Define the salary basis used to calculate notice period pay.
                </p>
              </div>
            </div>
          </button>

          <button
            onClick={() => setPolicyType('vacation_pay')}
            className="group w-full text-left bg-white border border-[#e5e7eb] rounded-xl p-6 hover:border-[#7A005D] hover:shadow-md transition-all"
          >
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-lg bg-[#f2f0f7] flex items-center justify-center shrink-0 group-hover:bg-[#7A005D] transition-colors">
                <svg className="w-5 h-5 text-[#7A005D] group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h3 className="text-[16px] font-semibold text-[#1a1a1a] mb-1">Vacation Pay</h3>
                <p className="text-[13px] text-[#6b7280] leading-relaxed">
                  Define the number of vacation days an employee is entitled to as a payout, along with the salary basis used.
                </p>
              </div>
            </div>
          </button>

          <button
            onClick={() => setPolicyType('severance')}
            className="group w-full text-left bg-white border border-[#e5e7eb] rounded-xl p-6 hover:border-[#7A005D] hover:shadow-md transition-all"
          >
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-lg bg-[#f2f0f7] flex items-center justify-center shrink-0 group-hover:bg-[#7A005D] transition-colors">
                <svg className="w-5 h-5 text-[#7A005D] group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <h3 className="text-[16px] font-semibold text-[#1a1a1a] mb-1">Severance Pay</h3>
                <p className="text-[13px] text-[#6b7280] leading-relaxed">
                  Define the severance components an employee is entitled to, along with the salary basis used. These components include gratuity, redundancy pay, and severance offered during MTA.
                </p>
              </div>
            </div>
          </button>
        </div>

        <div className="mt-8">
          <Button appearance="secondary" size="md" onClick={() => navigate(`/countries/${code}`)}>
            Cancel
          </Button>
        </div>
      </div>
    );
  }

  /* ─── Step 2: Configure the policy ─── */
  const typeLabel = policyType === 'severance' ? 'Severance Pay' :
    policyType === 'vacation_pay' ? 'Vacation Pay' : 'Notice Period Pay';

  return (
    <div className="max-w-[800px] mx-auto px-8 py-8">
      {breadcrumb}

      <div className="flex items-center gap-3 mb-2">
        <button
          onClick={() => setPolicyType(null)}
          className="p-1.5 rounded-lg hover:bg-[#f3f4f6] text-[#6b7280] hover:text-[#1a1a1a] transition-colors"
          title="Back to type selection"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h1 className="text-[22px] font-bold text-[#1a1a1a]">Add {typeLabel} Policy</h1>
        <span className="text-[11px] px-2 py-0.5 rounded-full bg-[#f2f0f7] text-[#4a284b] font-medium">{typeLabel}</span>
      </div>
      <p className="text-[14px] text-[#6b7280] mb-8 ml-10">
        Configure the {typeLabel.toLowerCase()} policy for {countryName}.
      </p>

      <div className="flex flex-col gap-8">
        {/* Policy Name */}
        <section className="bg-white border border-[#e5e7eb] rounded-lg p-6">
          <SectionLabel>Policy Name</SectionLabel>
          <SectionDescription>Give this policy a descriptive name.</SectionDescription>
          <InputText
            label=""
            value={policyName}
            onChange={setPolicyName}
            placeholder={
              policyType === 'severance' ? 'e.g. Severance Pay: Fixed Term' :
              policyType === 'vacation_pay' ? 'e.g. Vacation Pay: Standard' :
              'e.g. Notice Period Pay: Standard'
            }
          />
        </section>

        {/* Who does this apply to? — read-only for notice_period_pay & vacation_pay, editable for severance */}
        {(policyType === 'notice_period_pay' || policyType === 'vacation_pay') ? (
          <section className="bg-white border border-[#e5e7eb] rounded-lg p-6">
            <SectionLabel>Who does this apply to?</SectionLabel>
            <SectionDescription>This policy applies to all EOR employees in {countryName}.</SectionDescription>

            <div className="border border-[#e5e7eb] rounded-lg bg-[#fafafa]">
              <div className="p-4">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#f5f5f5] border border-[#e5e7eb] text-[13px]">
                    <PillIcon />
                    <span className="text-[#1a1a1a]">Is an EOR Employee? → True</span>
                  </span>
                  <AndSeparator />
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#f5f5f5] border border-[#e5e7eb] text-[13px]">
                    <PillIcon />
                    <span className="text-[#1a1a1a]">Country → {countryName}</span>
                  </span>
                </div>
              </div>
            </div>
          </section>
        ) : (
          <section className="bg-white border border-[#e5e7eb] rounded-lg p-6">
            <SectionLabel>Who does this apply to?</SectionLabel>
            <SectionDescription>Define the conditions that determine which employees this policy covers.</SectionDescription>

            {conditionGroups.length > 0 ? (
              <div className="border border-[#e5e7eb] rounded-lg mb-4 p-4">
                {conditionGroups.map((group, gIdx) => (
                  <div key={gIdx}>
                    {gIdx > 0 && <OrSeparator />}
                    <div className="flex flex-wrap items-center gap-2">
                      {group.map((pill, pIdx) => (
                        <span key={pill.id} className="contents">
                          {pIdx > 0 && <AndSeparator />}
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#f5f5f5] border border-[#e5e7eb] text-[13px]">
                            <PillIcon />
                            <span className="text-[#1a1a1a]">{pill.fieldLabel} → {pill.value}</span>
                          </span>
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : null}

            <button
              onClick={() => setShowConditionModal(true)}
              className="flex items-center gap-1.5 text-[13px] font-medium text-[#7A005D] hover:text-[#5c0046] transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              {conditionGroups.length > 0 ? 'Edit conditions' : 'Add Condition'}
            </button>
          </section>
        )}

        {/* Component configuration */}
        {policyType === 'severance' && (
          <SeveranceCard config={severanceConfig} onChange={setSeveranceConfig} />
        )}
        {policyType === 'vacation_pay' && (
          <VacationPayCard config={vacationPayConfig} onChange={setVacationPayConfig} />
        )}
        {policyType === 'notice_period_pay' && (
          <NoticePeriodCard config={noticePeriodConfig} onChange={setNoticePeriodConfig} />
        )}

        {/* Actions */}
        <div className="flex items-center justify-between pt-2 pb-8">
          <Button appearance="secondary" size="md" onClick={() => navigate(`/countries/${code}`)}>
            Cancel
          </Button>
          <Button appearance="primary" size="lg" onClick={handleSave} disabled={!policyName.trim()}>
            Save Policy
          </Button>
        </div>
      </div>

      {showConditionModal && (
        <AddConditionModal
          onSave={handleSaveConditions}
          onClose={() => setShowConditionModal(false)}
          existingGroups={conditionGroups}
          countryCode={code ?? ''}
          countryName={countryName}
        />
      )}
    </div>
  );
}
