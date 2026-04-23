import { useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { COUNTRIES } from '../data/countries';
import { TerminationPolicy, MemberCondition, POLICY_TYPE_LABELS } from '../data/terminationPolicies';
import { usePolicyStore } from '../store/policyStore';
import Button from '../components/Button';

const TABS = [
  'General Information',
  'Screenout Criteria',
  'EOR Entity Details',
  'EOR Cost of Employment',
  'Visualizer',
  'Unified Fields',
  'Termination Liability Policies',
];

const TERMINATION_TAB_INDEX = 6;

function BoolBadge({ value }: { value: boolean }) {
  return value ? (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-[#e0f3f1] text-[#0c4739] text-[12px] font-medium">
      Yes
    </span>
  ) : (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-[#f7e1e1] text-[#6d2828] text-[12px] font-medium">
      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
      </svg>
      No
    </span>
  );
}

function InfoRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-start py-3 border-b border-[#f1f1f1] last:border-b-0">
      <span className="text-[13px] text-[#6b7280] w-[260px] shrink-0">{label}</span>
      <span className="text-[13px] text-[#1a1a1a]">{value}</span>
    </div>
  );
}

function ConditionPill({ condition }: { condition: MemberCondition }) {
  return (
    <span className="inline-flex items-center gap-0 px-2.5 py-1 rounded-md bg-[#f5f5f5] border border-[#e5e7eb] text-[12px] leading-tight">
      <span className="text-[#6b7280]">{condition.entity}</span>
      <span className="text-[#6b7280] mx-0.5">{' -> '}</span>
      <span className="text-[#1a1a1a] font-medium">{condition.field}</span>
      <span className="text-[#9d9d9d] mx-1">{condition.operator}</span>
      <span className="text-[#1a1a1a] font-medium">{condition.value}</span>
    </span>
  );
}

const POLICY_TYPE_COLORS: Record<string, { bg: string; text: string }> = {
  severance: { bg: '#fef3c7', text: '#92400e' },
  vacation_pay: { bg: '#dbeafe', text: '#1e40af' },
  notice_period_pay: { bg: '#ede9fe', text: '#5b21b6' },
};

function PolicyCard({ policy, onDelete }: { policy: TerminationPolicy; onDelete: (id: string) => void }) {
  const typeLabel = policy.policyType ? POLICY_TYPE_LABELS[policy.policyType] : null;
  const typeColor = policy.policyType ? POLICY_TYPE_COLORS[policy.policyType] : null;

  return (
    <div className="bg-white border border-[#e5e7eb] rounded-lg p-6">
      <div className="flex items-start justify-between gap-6">
        {/* Left side */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2.5 mb-4">
            <h3 className="text-[15px] font-semibold text-[#1a1a1a] leading-snug">
              {policy.name}
            </h3>
            {typeLabel && typeColor && (
              <span
                className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold whitespace-nowrap"
                style={{ backgroundColor: typeColor.bg, color: typeColor.text }}
              >
                {typeLabel}
              </span>
            )}
          </div>

          {/* Members */}
          <div>
            <p className="text-[12px] font-semibold text-[#1a1a1a] mb-2">Members</p>
            <div className="flex flex-wrap gap-1.5 items-center">
              {policy.members.map((cond, i) => (
                <span key={i} className="contents">
                  <ConditionPill condition={cond} />
                  {i < policy.members.length - 1 && (
                    <span className="text-[11px] font-semibold text-[#9d9d9d] px-0.5">and</span>
                  )}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Action icons */}
        <div className="flex items-center gap-1 shrink-0 pt-0.5">
          <button
            title="Edit policy"
            className="p-2 rounded-lg hover:bg-[#f3f4f6] transition-colors text-[#6b7280] hover:text-[#1a1a1a]"
          >
            <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
            </svg>
          </button>
          <button
            title="Delete policy"
            onClick={() => onDelete(policy.id)}
            className="p-2 rounded-lg hover:bg-[#fef2f2] transition-colors text-[#6b7280] hover:text-[#bf0f0f]"
          >
            <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

export default function CountryDetailView() {
  const { code } = useParams<{ code: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const initialTab = (location.state as { tab?: number } | null)?.tab ?? 0;
  const [activeTab, setActiveTab] = useState(initialTab);
  const store = usePolicyStore();

  const country = COUNTRIES.find((c) => c.code === code);

  if (!country) {
    return (
      <div className="max-w-[1200px] mx-auto px-8 py-8">
        <p className="text-[14px] text-[#6b7280]">Country not found.</p>
        <button
          onClick={() => navigate('/countries')}
          className="mt-4 text-[14px] text-[#2563eb] hover:underline"
        >
          Back to countries
        </button>
      </div>
    );
  }

  const policies = code ? store.getPolicies(code) : [];

  const handleDeletePolicy = (policyId: string) => {
    if (code && window.confirm('Are you sure you want to delete this policy? This action cannot be undone.')) {
      store.deletePolicy(code, policyId);
    }
  };

  return (
    <div className="max-w-[1200px] mx-auto px-8 py-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 mb-6 text-[13px]">
        <button
          onClick={() => navigate('/countries')}
          className="text-[#6b7280] hover:text-[#1a1a1a] transition-colors"
        >
          Countries
        </button>
        <svg className="w-3.5 h-3.5 text-[#c7c7c7]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
        <span className="text-[#1a1a1a] font-medium">{country.name}</span>
      </div>

      {/* Country Header */}
      <div className="bg-white border border-[#e5e7eb] rounded-lg p-6 mb-6">
        <div className="flex items-center gap-4 mb-4">
          <span className="text-[32px]">{country.flag}</span>
          <div className="flex items-center gap-3">
            <h1 className="text-[22px] font-bold text-[#1a1a1a]">{country.name}</h1>
            <span className="inline-flex items-center px-2 py-0.5 rounded bg-[#f1f1f1] text-[#1a1a1a] text-[12px] font-medium">
              {country.code}
            </span>
          </div>
        </div>
        <div className="flex gap-8 text-[13px]">
          <div>
            <span className="text-[#6b7280]">EOR Type</span>
            <p className="font-medium text-[#1a1a1a] flex items-center gap-1.5 mt-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#1a1a1a]" />
              {country.eorType}
            </p>
          </div>
          <div>
            <span className="text-[#6b7280]">Country Launch Status</span>
            <p className="font-medium text-[#1a1a1a] flex items-center gap-1.5 mt-0.5">
              <span className={`w-1.5 h-1.5 rounded-full ${
                country.launchStatus === 'Launched' ? 'bg-[#079f8f]' : 'bg-[#ffc707]'
              }`} />
              {country.launchStatus}
            </p>
          </div>
          <div>
            <span className="text-[#6b7280]">Launch date</span>
            <p className="font-medium text-[#1a1a1a] mt-0.5">{country.launchDate}</p>
          </div>
          <div>
            <span className="text-[#6b7280]">Start date blocker</span>
            <p className="font-medium text-[#1a1a1a] mt-0.5">{country.startDateBlocker}</p>
          </div>
          <div>
            <span className="text-[#6b7280]">Onboarding date blocker</span>
            <p className="font-medium text-[#1a1a1a] mt-0.5">{country.onboardingDateBlocker}</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-[#e5e7eb] mb-6">
        <div className="flex gap-0">
          {TABS.map((tab, i) => (
            <button
              key={tab}
              onClick={() => setActiveTab(i)}
              className={`px-4 py-2.5 text-[13px] font-medium border-b-2 transition-colors whitespace-nowrap ${
                activeTab === i
                  ? 'border-[#1a1a1a] text-[#1a1a1a]'
                  : 'border-transparent text-[#6b7280] hover:text-[#1a1a1a]'
              }`}
            >
              {tab}
              {i === TERMINATION_TAB_INDEX && policies && (
                <span className="ml-1.5 inline-flex items-center justify-center px-1.5 py-0 rounded-full bg-[#f1f1f1] text-[#6b7280] text-[11px] font-medium min-w-[18px]">
                  {policies.length}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* General Information Tab */}
      {activeTab === 0 && (
        <div className="grid grid-cols-2 gap-6">
          <div className="bg-white border border-[#e5e7eb] rounded-lg p-6">
            <h3 className="text-[15px] font-bold text-[#1a1a1a] mb-4">Country Info</h3>
            <InfoRow label="Country Name" value={country.name} />
            <InfoRow label="Country Launch Status" value={country.launchStatus} />
            <InfoRow label="EOR Type" value={country.eorType} />
            <InfoRow label="Launch date" value={country.launchDate} />
            <InfoRow label="Start date blocker" value={String(country.startDateBlocker)} />
            <InfoRow
              label="Can auto approve profile transition request?"
              value={<BoolBadge value={country.autoApproveProfileTransition} />}
            />
            <InfoRow
              label="Can auto approve termination request?"
              value={<BoolBadge value={country.autoApproveTermination} />}
            />
            <InfoRow
              label="Days to accept termination agreement"
              value={String(country.daysToAcceptTerminationAgreement)}
            />
            <InfoRow
              label="Direct hire employment types"
              value={
                <div className="flex flex-wrap gap-1">
                  {country.directHireEmploymentTypes.map((t) => (
                    <span
                      key={t}
                      className="inline-flex items-center px-2 py-0.5 rounded bg-[#f1f1f1] text-[#1a1a1a] text-[11px] font-medium"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              }
            />
          </div>

          <div className="flex flex-col gap-6">
            <div className="bg-white border border-[#e5e7eb] rounded-lg p-6">
              <h3 className="text-[15px] font-bold text-[#1a1a1a] mb-4">Compensation</h3>
              <InfoRow label="Target Bonus Payment Frequency" value={country.targetBonusFrequency} />
              <InfoRow
                label="Is this country supported for Variable Comp Plan"
                value={country.variableCompSupported ? 'Click to view more' : 'No'}
              />
              <InfoRow
                label="Is this a country Where Currency Precede"
                value={<BoolBadge value={country.currencyPrecedeCountry} />}
              />
            </div>

            <div className="bg-white border border-[#e5e7eb] rounded-lg p-6">
              <h3 className="text-[15px] font-bold text-[#1a1a1a] mb-4">Employee Specific</h3>
              <InfoRow
                label="Is having an entity in that country a disqualification for EOR?"
                value={country.entityDisqualification ? 'Yes' : 'No'}
              />
              <InfoRow
                label="Is EE medical check a requirement for onboarding?"
                value={country.medicalCheckRequired ? 'Yes' : 'No'}
              />
            </div>
          </div>
        </div>
      )}

      {/* Termination Liability Policies Tab */}
      {activeTab === TERMINATION_TAB_INDEX && (
        <div>
          <div className="flex items-center justify-between mb-6">
            <p className="text-[14px] text-[#6b7280]">
              {policies.length > 0
                ? `${policies.length} ${policies.length === 1 ? 'policy' : 'policies'} configured`
                : 'No termination liability policies configured for this country yet.'}
            </p>
            <Button
              appearance="primary"
              size="md"
              onClick={() => navigate(`/countries/${code}/termination/new`)}
            >
              <span className="flex items-center gap-1.5">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Add Policy
              </span>
            </Button>
          </div>

          {policies && policies.length > 0 ? (
            <div className="flex flex-col gap-4">
              {policies.map((policy) => (
                <PolicyCard key={policy.id} policy={policy} onDelete={handleDeletePolicy} />
              ))}
            </div>
          ) : (
            <div className="bg-white border border-[#e5e7eb] rounded-lg p-8 text-center">
              <div className="w-16 h-16 rounded-full bg-[#f1f1f1] flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-[#9d9d9d]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-[15px] font-semibold text-[#1a1a1a] mb-1">No policies configured</h3>
              <p className="text-[13px] text-[#6b7280] max-w-[360px] mx-auto mb-5">
                Add a termination liability policy to define how severance, notice period, and other components are calculated for {country.name}.
              </p>
              <Button
                appearance="primary"
                size="md"
                onClick={() => navigate(`/countries/${code}/termination/new`)}
              >
                Add First Policy
              </Button>
            </div>
          )}
        </div>
      )}

      {/* Other placeholder tabs (1-5) */}
      {activeTab > 0 && activeTab < TERMINATION_TAB_INDEX && (
        <div className="bg-white border border-[#e5e7eb] rounded-lg p-8 text-center">
          <div className="text-[40px] mb-3">🚧</div>
          <h3 className="text-[16px] font-semibold text-[#1a1a1a] mb-1">{TABS[activeTab]}</h3>
          <p className="text-[14px] text-[#6b7280]">This section is under development.</p>
        </div>
      )}
    </div>
  );
}
