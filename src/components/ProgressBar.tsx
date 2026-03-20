interface ProgressBarProps {
  totalSections: number;
  completedSections: number;
  className?: string;
}

export default function ProgressBar({
  totalSections,
  completedSections,
  className = '',
}: ProgressBarProps) {
  const percentage = totalSections > 0
    ? Math.round((completedSections / totalSections) * 100)
    : 0;

  return (
    <div className={`flex flex-col gap-2 w-full ${className}`}>
      <div className="flex items-center justify-between">
        <p className="text-[13px] font-medium text-[#1a1a1a] tracking-[0.1px]">
          Progress
        </p>
        <p className="text-[13px] text-[#6b7280] tracking-[0.1px]">
          {completedSections} of {totalSections} sections complete
        </p>
      </div>
      <div className="w-full h-2 bg-[#e5e7eb] rounded-full overflow-hidden">
        <div
          className="h-full bg-[#1a1a1a] rounded-full transition-all duration-500 ease-out"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
