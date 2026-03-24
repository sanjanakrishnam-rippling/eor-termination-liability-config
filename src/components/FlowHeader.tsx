import { useState, useRef, useEffect } from 'react';

export interface FlowStep {
  id: string;
  label: string;
}

interface FlowHeaderProps {
  steps: FlowStep[];
  currentStep: number;
  onStepClick?: (stepIndex: number) => void;
}

export default function FlowHeader({
  steps,
  currentStep,
  onStepClick,
}: FlowHeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    if (menuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [menuOpen]);

  const progress = steps.length > 0 ? ((currentStep + 1) / steps.length) * 100 : 0;
  const currentLabel = steps[currentStep]?.label ?? '';

  return (
    <div className="sticky top-0 z-40 bg-white border-t border-b border-[#e5e7eb]">
      <div className="flex items-center h-12 px-4 gap-3" ref={menuRef}>
        <button
          type="button"
          onClick={() => setMenuOpen((v) => !v)}
          className="p-1.5 -ml-1.5 hover:bg-[#f3f4f6] rounded-lg transition-colors shrink-0"
          aria-label="Show all steps"
        >
          <svg className="w-5 h-5 text-[#1a1a1a]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        <span className="text-[14px] font-medium text-[#1a1a1a] truncate">
          {currentLabel}
        </span>

        {menuOpen && (
          <div className="absolute top-full left-0 mt-px w-72 bg-white border border-[#e5e7eb] rounded-lg shadow-lg overflow-hidden">
            {steps.map((step, idx) => {
              const isActive = idx === currentStep;
              const isCompleted = idx < currentStep;
              return (
                <button
                  key={step.id}
                  type="button"
                  onClick={() => {
                    onStepClick?.(idx);
                    setMenuOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors ${
                    isActive
                      ? 'bg-[#f0f4ff]'
                      : 'hover:bg-[#f9fafb]'
                  }`}
                >
                  <span
                    className={`flex items-center justify-center w-6 h-6 rounded-full text-[12px] font-semibold shrink-0 ${
                      isCompleted
                        ? 'bg-[#1a1a1a] text-white'
                        : isActive
                          ? 'bg-[#2563eb] text-white'
                          : 'bg-[#e5e7eb] text-[#6b7280]'
                    }`}
                  >
                    {isCompleted ? (
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      idx + 1
                    )}
                  </span>
                  <span
                    className={`text-[14px] ${
                      isActive
                        ? 'font-semibold text-[#1a1a1a]'
                        : isCompleted
                          ? 'font-medium text-[#1a1a1a]'
                          : 'text-[#6b7280]'
                    }`}
                  >
                    {step.label}
                  </span>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Progress bar */}
      <div className="h-[3px] bg-[#e5e7eb]">
        <div
          className="h-full bg-[#2563eb] transition-all duration-500 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}
