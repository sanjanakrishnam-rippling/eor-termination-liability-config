import { useLocation, useNavigate } from 'react-router-dom';

const NAV_ITEMS = [
  { id: 'countries', label: 'Countries', path: '/countries' },
  { id: 'termination', label: 'Termination Liability Policies', path: '/termination' },
  { id: 'underwriting', label: 'Underwriting', path: '/apply' },
];

export default function TopNav() {
  const location = useLocation();
  const navigate = useNavigate();

  const getActiveTab = () => {
    if (location.pathname.startsWith('/termination')) return 'termination';
    if (location.pathname.startsWith('/apply')) return 'underwriting';
    return 'countries';
  };

  const activeTab = getActiveTab();

  return (
    <nav className="border-b border-[#e5e7eb] bg-white px-8">
      <div className="flex gap-0">
        {NAV_ITEMS.map((item) => (
          <button
            key={item.id}
            onClick={() => navigate(item.path)}
            className={`px-5 py-3 text-[14px] font-medium border-b-2 transition-colors ${
              activeTab === item.id
                ? 'border-[#1a1a1a] text-[#1a1a1a]'
                : 'border-transparent text-[#6b7280] hover:text-[#1a1a1a]'
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>
    </nav>
  );
}
