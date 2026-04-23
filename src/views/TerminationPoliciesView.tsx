import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/Button';

interface PolicySummary {
  id: string;
  country: string;
  countryCode: string;
  flag: string;
  contractType: string;
  province: string;
  components: number;
  lastUpdated: string;
  status: 'Active' | 'Draft';
}

const SAMPLE_POLICIES: PolicySummary[] = [
  {
    id: 'pol-nl-indef',
    country: 'Netherlands',
    countryCode: 'NL',
    flag: '🇳🇱',
    contractType: 'Indefinite',
    province: 'All',
    components: 4,
    lastUpdated: '2026-03-15',
    status: 'Active',
  },
  {
    id: 'pol-in-indef',
    country: 'India',
    countryCode: 'IN',
    flag: '🇮🇳',
    contractType: 'Indefinite',
    province: 'All',
    components: 3,
    lastUpdated: '2026-03-10',
    status: 'Active',
  },
  {
    id: 'pol-gb-indef',
    country: 'United Kingdom',
    countryCode: 'GB',
    flag: '🇬🇧',
    contractType: 'Indefinite',
    province: 'All',
    components: 3,
    lastUpdated: '2026-02-28',
    status: 'Active',
  },
  {
    id: 'pol-de-indef',
    country: 'Germany',
    countryCode: 'DE',
    flag: '🇩🇪',
    contractType: 'Indefinite',
    province: 'All',
    components: 2,
    lastUpdated: '2026-04-01',
    status: 'Draft',
  },
  {
    id: 'pol-fr-indef',
    country: 'France',
    countryCode: 'FR',
    flag: '🇫🇷',
    contractType: 'Indefinite',
    province: 'All',
    components: 5,
    lastUpdated: '2026-03-20',
    status: 'Active',
  },
  {
    id: 'pol-br-indef',
    country: 'Brazil',
    countryCode: 'BR',
    flag: '🇧🇷',
    contractType: 'Indefinite',
    province: 'All',
    components: 4,
    lastUpdated: '2026-01-15',
    status: 'Active',
  },
];

export default function TerminationPoliciesView() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Active' | 'Draft'>('All');
  const navigate = useNavigate();

  const filtered = SAMPLE_POLICIES.filter((p) => {
    const matchesSearch =
      p.country.toLowerCase().includes(search.toLowerCase()) ||
      p.countryCode.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'All' || p.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="max-w-[1200px] mx-auto px-8 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-[22px] font-bold text-[#1a1a1a]">Termination Liability Policies</h1>
          <p className="text-[14px] text-[#6b7280] mt-1">
            Configure country-specific termination liability rules and components
          </p>
        </div>
        <Button
          appearance="primary"
          size="md"
          onClick={() => navigate('/termination/new')}
        >
          <span className="flex items-center gap-1.5">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Create Policy
          </span>
        </Button>
      </div>

      {/* Filters */}
      <div className="flex gap-3 mb-6">
        <div className="relative w-[320px]">
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9d9d9d]"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <input
            type="text"
            placeholder="Search by country..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-9 pl-9 pr-3 rounded-lg border border-[#d5d5d5] text-[14px] text-[#1a1a1a] outline-none focus:border-[#4a6ba6] transition-colors"
          />
        </div>
        <div className="flex rounded-lg border border-[#d5d5d5] overflow-hidden">
          {(['All', 'Active', 'Draft'] as const).map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-3 py-1.5 text-[13px] font-medium transition-colors ${
                statusFilter === s
                  ? 'bg-[#1a1a1a] text-white'
                  : 'bg-white text-[#6b7280] hover:bg-[#f9fafb]'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Policy Table */}
      <div className="border border-[#e5e7eb] rounded-lg overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-[#f9fafb] border-b border-[#e5e7eb]">
              <th className="text-left px-4 py-3 text-[12px] font-semibold text-[#6b7280] uppercase tracking-wider">
                Country
              </th>
              <th className="text-left px-4 py-3 text-[12px] font-semibold text-[#6b7280] uppercase tracking-wider">
                Contract Type
              </th>
              <th className="text-left px-4 py-3 text-[12px] font-semibold text-[#6b7280] uppercase tracking-wider">
                Province / State
              </th>
              <th className="text-left px-4 py-3 text-[12px] font-semibold text-[#6b7280] uppercase tracking-wider">
                Components
              </th>
              <th className="text-left px-4 py-3 text-[12px] font-semibold text-[#6b7280] uppercase tracking-wider">
                Status
              </th>
              <th className="text-left px-4 py-3 text-[12px] font-semibold text-[#6b7280] uppercase tracking-wider">
                Last Updated
              </th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((policy) => (
              <tr
                key={policy.id}
                onClick={() => navigate(`/termination/${policy.id}`)}
                className="border-b border-[#e5e7eb] last:border-b-0 hover:bg-[#f9fafb] cursor-pointer transition-colors"
              >
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <span className="text-[20px]">{policy.flag}</span>
                    <div>
                      <p className="text-[14px] font-medium text-[#1a1a1a]">
                        {policy.country}
                      </p>
                      <p className="text-[12px] text-[#9d9d9d]">{policy.countryCode}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 text-[13px] text-[#1a1a1a]">
                  {policy.contractType}
                </td>
                <td className="px-4 py-3 text-[13px] text-[#6b7280]">
                  {policy.province}
                </td>
                <td className="px-4 py-3">
                  <span className="inline-flex items-center px-2 py-0.5 rounded bg-[#f1f1f1] text-[#1a1a1a] text-[12px] font-medium">
                    {policy.components} components
                  </span>
                </td>
                <td className="px-4 py-3">
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
                </td>
                <td className="px-4 py-3 text-[13px] text-[#6b7280]">
                  {policy.lastUpdated}
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-[14px] text-[#9d9d9d]">
                  No policies match your filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
