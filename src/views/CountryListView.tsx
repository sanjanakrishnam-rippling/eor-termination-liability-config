import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { COUNTRIES } from '../data/countries';

export default function CountryListView() {
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  const filtered = COUNTRIES.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.code.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-[1200px] mx-auto px-8 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-[22px] font-bold text-[#1a1a1a]">Countries</h1>
          <p className="text-[14px] text-[#6b7280] mt-1">
            {COUNTRIES.length} countries configured
          </p>
        </div>
      </div>

      <div className="mb-6">
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
            placeholder="Search countries..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-9 pl-9 pr-3 rounded-lg border border-[#d5d5d5] text-[14px] text-[#1a1a1a] outline-none focus:border-[#4a6ba6] transition-colors"
          />
        </div>
      </div>

      <div className="border border-[#e5e7eb] rounded-lg overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-[#f9fafb] border-b border-[#e5e7eb]">
              <th className="text-left px-4 py-3 text-[12px] font-semibold text-[#6b7280] uppercase tracking-wider">
                Country
              </th>
              <th className="text-left px-4 py-3 text-[12px] font-semibold text-[#6b7280] uppercase tracking-wider">
                EOR Type
              </th>
              <th className="text-left px-4 py-3 text-[12px] font-semibold text-[#6b7280] uppercase tracking-wider">
                Status
              </th>
              <th className="text-left px-4 py-3 text-[12px] font-semibold text-[#6b7280] uppercase tracking-wider">
                Launch Date
              </th>
              <th className="text-left px-4 py-3 text-[12px] font-semibold text-[#6b7280] uppercase tracking-wider">
                Start Date Blocker
              </th>
              <th className="text-left px-4 py-3 text-[12px] font-semibold text-[#6b7280] uppercase tracking-wider">
                Onboarding Blocker
              </th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((country) => (
              <tr
                key={country.code}
                onClick={() => navigate(`/countries/${country.code}`)}
                className="border-b border-[#e5e7eb] last:border-b-0 hover:bg-[#f9fafb] cursor-pointer transition-colors"
              >
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <span className="text-[20px]">{country.flag}</span>
                    <div>
                      <p className="text-[14px] font-medium text-[#1a1a1a]">
                        {country.name}
                      </p>
                      <p className="text-[12px] text-[#9d9d9d]">{country.code}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span className={`inline-flex items-center px-2 py-0.5 rounded text-[12px] font-medium ${
                    country.eorType === 'BLE'
                      ? 'bg-[#f2f0f7] text-[#4a284b]'
                      : 'bg-[#f1f1f1] text-[#1a1a1a]'
                  }`}>
                    {country.eorType}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span className="inline-flex items-center gap-1.5">
                    <span className={`w-1.5 h-1.5 rounded-full ${
                      country.launchStatus === 'Launched'
                        ? 'bg-[#079f8f]'
                        : country.launchStatus === 'Beta'
                          ? 'bg-[#ffc707]'
                          : 'bg-[#b9b9b9]'
                    }`} />
                    <span className="text-[13px] text-[#1a1a1a]">
                      {country.launchStatus}
                    </span>
                  </span>
                </td>
                <td className="px-4 py-3 text-[13px] text-[#6b7280]">
                  {country.launchDate}
                </td>
                <td className="px-4 py-3 text-[13px] text-[#6b7280]">
                  {country.startDateBlocker}
                </td>
                <td className="px-4 py-3 text-[13px] text-[#6b7280]">
                  {country.onboardingDateBlocker}
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-[14px] text-[#9d9d9d]">
                  No countries match your search.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
