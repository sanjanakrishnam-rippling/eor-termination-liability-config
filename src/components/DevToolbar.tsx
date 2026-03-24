import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

interface NavLink {
  label: string;
  path: string;
}

const FLOW_LINKS: NavLink[] = [
  { label: 'Step 1 - Start', path: '/apply' },
  { label: 'Step 2 - Filling Form', path: '/apply/form' },
];

const OUTCOME_LINKS: NavLink[] = [
  { label: 'Pending', path: '/apply/confirmation?status=pending' },
  { label: 'Approved', path: '/apply/confirmation?status=approved' },
  { label: 'Declined', path: '/apply/confirmation?status=declined' },
  { label: 'More Info Needed', path: '/apply/confirmation?status=more_info' },
  { label: 'Manual Review', path: '/apply/confirmation?status=manual_review' },
];

export default function DevToolbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isExpanded, setIsExpanded] = useState(true);

  const currentPath = location.pathname + location.search;

  return (
    <nav className="sticky top-0 z-[60] bg-[#b9dbf3] border-b border-[#8bc4eb]">
      <div className="flex items-center gap-2 px-3 h-[30px]">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center gap-1 shrink-0"
        >
          <p className="font-semibold leading-[16px] text-[12px] text-[#1e4aa9] tracking-[0px]">
            Dev Toolbar
          </p>
          <svg
            className={`w-3 h-3 text-[#1e4aa9] transition-transform ${isExpanded ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {!isExpanded && (
          <p className="text-[11px] text-[#1e4aa9]/60 ml-2 truncate">
            {currentPath}
          </p>
        )}
      </div>

      {isExpanded && (
        <div className="flex flex-wrap items-center gap-x-1 gap-y-1 px-3 pb-2">
          <span className="text-[11px] font-semibold text-[#1e4aa9]/70 uppercase tracking-wider mr-1">
            Flow
          </span>
          {FLOW_LINKS.map((link) => (
            <ToolbarButton
              key={link.path}
              label={link.label}
              onClick={() => navigate(link.path)}
              isActive={currentPath === link.path}
            />
          ))}
          <span className="text-[11px] text-[#1e4aa9]/30 mx-1">|</span>
          <span className="text-[11px] font-semibold text-[#1e4aa9]/70 uppercase tracking-wider mr-1">
            Outcomes
          </span>
          {OUTCOME_LINKS.map((link) => (
            <ToolbarButton
              key={link.path}
              label={link.label}
              onClick={() => navigate(link.path)}
              isActive={currentPath === link.path}
            />
          ))}
        </div>
      )}
    </nav>
  );
}

function ToolbarButton({
  label,
  onClick,
  isActive,
}: {
  label: string;
  onClick: () => void;
  isActive: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors ${
        isActive
          ? 'bg-[#1e4aa9] text-white'
          : 'bg-white/60 text-[#202022] hover:bg-white hover:shadow-sm'
      }`}
    >
      {label}
    </button>
  );
}
