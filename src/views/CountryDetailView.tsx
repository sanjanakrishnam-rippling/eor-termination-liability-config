import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { COUNTRIES } from '../data/countries';

const TABS = [
  'General Information',
  'Screenout Criteria',
  'EOR Entity Details',
  'EOR Cost of Employment',
  'Visualizer',
  'Unified Fields',
];

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

export default function CountryDetailView() {
  const { code } = useParams<{ code: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(0);

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
              className={`px-4 py-2.5 text-[13px] font-medium border-b-2 transition-colors ${
                activeTab === i
                  ? 'border-[#1a1a1a] text-[#1a1a1a]'
                  : 'border-transparent text-[#6b7280] hover:text-[#1a1a1a]'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === 0 && (
        <div className="grid grid-cols-2 gap-6">
          {/* Country Info */}
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

          {/* Compensation & Employee Specific */}
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

      {activeTab !== 0 && (
        <div className="bg-white border border-[#e5e7eb] rounded-lg p-8 text-center">
          <div className="text-[40px] mb-3">🚧</div>
          <h3 className="text-[16px] font-semibold text-[#1a1a1a] mb-1">{TABS[activeTab]}</h3>
          <p className="text-[14px] text-[#6b7280]">This section is under development.</p>
        </div>
      )}
    </div>
  );
}
