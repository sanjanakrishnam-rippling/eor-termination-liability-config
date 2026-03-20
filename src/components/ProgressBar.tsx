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
        <p className="text-[13px] font-medium text-[#595555] tracking-[0.25px]">
          Progress
        </p>
        <p className="text-[13px] text-[#8f8f8f] tracking-[0.25px]">
          {completedSections} of {totalSections} sections complete
        </p>
      </div>
      <div className="w-full h-2 bg-[#e3e3e3] rounded-full overflow-hidden">
        <div
          className="h-full bg-[#502d3c] rounded-full transition-all duration-500 ease-out"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
