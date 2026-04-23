import { useParams, useNavigate } from 'react-router-dom';

const POLICY_DETAILS: Record<string, {
  country: string;
  flag: string;
  contractType: string;
  province: string;
  status: string;
  lastUpdated: string;
  components: {
    name: string;
    calculationMethod: string;
    conditions: string;
  }[];
}> = {
  'pol-nl-indef': {
    country: 'Netherlands',
    flag: '🇳🇱',
    contractType: 'Indefinite',
    province: 'All',
    status: 'Active',
    lastUpdated: '2026-03-15',
    components: [
      { name: 'Statutory Severance (Transitievergoeding)', calculationMethod: 'Per year of service: 1/3 month per year', conditions: 'All termination reasons' },
      { name: 'Notice Period', calculationMethod: 'Per year of service with tiers', conditions: 'All except gross misconduct' },
      { name: 'Vacation Payout', calculationMethod: 'All accrued days', conditions: 'Always' },
      { name: 'MTA Payment', calculationMethod: 'Fixed: 2 months salary', conditions: 'When MTA is applicable; 30 days to secure' },
    ],
  },
  'pol-in-indef': {
    country: 'India',
    flag: '🇮🇳',
    contractType: 'Indefinite',
    province: 'All',
    status: 'Active',
    lastUpdated: '2026-03-10',
    components: [
      { name: 'Gratuity', calculationMethod: 'Per year of service: 15 days per year (26-day divisor)', conditions: 'Tenure >= 5 years' },
      { name: 'Severance / Ex-Gratia', calculationMethod: 'Per year of service: 15 days per year', conditions: 'All termination reasons' },
      { name: 'Vacation Payout', calculationMethod: 'All accrued days', conditions: 'Always' },
    ],
  },
  'pol-gb-indef': {
    country: 'United Kingdom',
    flag: '🇬🇧',
    contractType: 'Indefinite',
    province: 'All',
    status: 'Active',
    lastUpdated: '2026-02-28',
    components: [
      { name: 'Statutory Redundancy Pay', calculationMethod: 'Tenure-based tiers with age multiplier; salary cap £643/week', conditions: 'Reason = Redundancy, Tenure >= 2 years' },
      { name: 'Notice Period', calculationMethod: '1 week per year of service, min 1 week, max 12 weeks', conditions: 'All except gross misconduct' },
      { name: 'Vacation Payout', calculationMethod: 'All accrued days (statutory 5.6 weeks/year)', conditions: 'Always' },
    ],
  },
  'pol-de-indef': {
    country: 'Germany',
    flag: '🇩🇪',
    contractType: 'Indefinite',
    province: 'All',
    status: 'Draft',
    lastUpdated: '2026-04-01',
    components: [
      { name: 'Severance (Abfindung)', calculationMethod: 'Per year of service: 0.5 months per year', conditions: 'All termination reasons' },
      { name: 'Notice Period', calculationMethod: 'Tenure-based tiers (1-7 months)', conditions: 'All except gross misconduct' },
    ],
  },
  'pol-fr-indef': {
    country: 'France',
    flag: '🇫🇷',
    contractType: 'Indefinite',
    province: 'All',
    status: 'Active',
    lastUpdated: '2026-03-20',
    components: [
      { name: 'Severance (Indemnite de licenciement)', calculationMethod: 'Tenure-based: 1/4 month per year (first 10), 1/3 month thereafter', conditions: 'Tenure >= 8 months' },
      { name: 'Notice Period', calculationMethod: 'Tenure-based tiers (1-2 months)', conditions: 'All except gross misconduct' },
      { name: 'Vacation Payout', calculationMethod: 'All accrued days', conditions: 'Always' },
      { name: '13th Month Proration', calculationMethod: 'Fraction of salary: prorated to months worked', conditions: 'Always' },
      { name: 'MTA Payment', calculationMethod: 'Fixed: 1 month salary', conditions: 'When MTA is applicable; 15 days to secure' },
    ],
  },
  'pol-br-indef': {
    country: 'Brazil',
    flag: '🇧🇷',
    contractType: 'Indefinite',
    province: 'All',
    status: 'Active',
    lastUpdated: '2026-01-15',
    components: [
      { name: 'FGTS Fine (40%)', calculationMethod: 'Fraction of salary: 40% of FGTS balance', conditions: 'Termination without cause' },
      { name: 'Notice Period', calculationMethod: '30 days + 3 days per year of service', conditions: 'All except just cause' },
      { name: 'Vacation Payout', calculationMethod: 'All accrued + 1/3 constitutional bonus', conditions: 'Always' },
      { name: '13th Salary Proration', calculationMethod: 'Fraction of salary: 1/12 per month worked', conditions: 'Always' },
    ],
  },
};

export default function TerminationPolicyDetailView() {
  const { policyId } = useParams<{ policyId: string }>();
  const navigate = useNavigate();

  const policy = policyId ? POLICY_DETAILS[policyId] : undefined;

  if (!policy) {
    return (
      <div className="max-w-[1200px] mx-auto px-8 py-8">
        <p className="text-[14px] text-[#6b7280]">Policy not found.</p>
        <button
          onClick={() => navigate('/termination')}
          className="mt-4 text-[14px] text-[#2563eb] hover:underline"
        >
          Back to policies
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-[1200px] mx-auto px-8 py-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 mb-6 text-[13px]">
        <button
          onClick={() => navigate('/termination')}
          className="text-[#6b7280] hover:text-[#1a1a1a] transition-colors"
        >
          Termination Liability Policies
        </button>
        <svg className="w-3.5 h-3.5 text-[#c7c7c7]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
        <span className="text-[#1a1a1a] font-medium">{policy.country}</span>
      </div>

      {/* Header */}
      <div className="bg-white border border-[#e5e7eb] rounded-lg p-6 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="text-[32px]">{policy.flag}</span>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-[22px] font-bold text-[#1a1a1a]">{policy.country}</h1>
                <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[12px] font-medium ${
                  policy.status === 'Active'
                    ? 'bg-[#e0f3f1] text-[#0c4739]'
                    : 'bg-[#fff8e0] text-[#774f10]'
                }`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${
                    policy.status === 'Active' ? 'bg-[#079f8f]' : 'bg-[#ffc707]'
                  }`} />
                  {policy.status}
                </span>
              </div>
              <p className="text-[13px] text-[#6b7280] mt-1">
                {policy.contractType} contract &middot; Province: {policy.province} &middot; Last updated {policy.lastUpdated}
              </p>
            </div>
          </div>
          <button className="px-4 py-2 text-[13px] font-medium text-[#1a1a1a] border border-[#d5d5d5] rounded-lg hover:bg-[#f9fafb] transition-colors">
            Edit Policy
          </button>
        </div>
      </div>

      {/* Components */}
      <h2 className="text-[16px] font-bold text-[#1a1a1a] mb-4">
        Components ({policy.components.length})
      </h2>
      <div className="flex flex-col gap-4">
        {policy.components.map((comp, i) => (
          <div
            key={i}
            className="bg-white border border-[#e5e7eb] rounded-lg p-5"
          >
            <div className="flex items-start justify-between mb-3">
              <h3 className="text-[14px] font-semibold text-[#1a1a1a]">{comp.name}</h3>
              <span className="inline-flex items-center px-2 py-0.5 rounded bg-[#f1f1f1] text-[#6b7280] text-[11px] font-medium">
                Component {i + 1}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-[12px] text-[#9d9d9d] mb-1">Calculation Method</p>
                <p className="text-[13px] text-[#1a1a1a]">{comp.calculationMethod}</p>
              </div>
              <div>
                <p className="text-[12px] text-[#9d9d9d] mb-1">Conditions</p>
                <p className="text-[13px] text-[#1a1a1a]">{comp.conditions}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
