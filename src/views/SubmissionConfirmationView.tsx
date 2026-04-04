import { useSearchParams } from 'react-router-dom';

type OutcomeStatus = 'pending';

interface StatusConfig {
  icon: React.ReactNode;
  iconBg: string;
  title: string;
  badgeLabel: string;
  badgeBg: string;
  badgeText: string;
  dotColor: string;
  message: string;
}

const STATUS_CONFIGS: Record<OutcomeStatus, StatusConfig> = {
  pending: {
    icon: (
      <svg className="w-8 h-8 text-[#FFC707]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    iconBg: 'bg-[#FFF8E0]',
    title: 'Application Submitted',
    badgeLabel: 'Pending',
    badgeBg: 'bg-[#FFF1C1]',
    badgeText: 'text-[#774F10]',
    dotColor: 'bg-[#FFC707]',
    message: 'Your application is currently under review. Rippling will contact you on the email provided with the final decision.',
  },
};

export default function SubmissionConfirmationView() {
  const [searchParams] = useSearchParams();
  const rawStatus = searchParams.get('status') ?? 'pending';
  const status: OutcomeStatus = (rawStatus in STATUS_CONFIGS)
    ? (rawStatus as OutcomeStatus)
    : 'pending';

  const config = STATUS_CONFIGS[status];

  return (
    <div className="bg-white flex justify-center px-6 pt-[2em]">
      <div className="max-w-[520px] w-full bg-white border border-[#e5e7eb] rounded-xl shadow-sm p-10 flex flex-col items-center gap-6">
        <div className={`w-16 h-16 rounded-full ${config.iconBg} flex items-center justify-center`}>
          {config.icon}
        </div>

        <h1 className="text-[24px] font-bold leading-[32px] text-[#1a1a1a] text-center tracking-[-0.2px]">
          {config.title}
        </h1>

        <p className="text-[14px] leading-[20px] text-[#6b7280] text-center">
          {config.message}
        </p>
      </div>
    </div>
  );
}
