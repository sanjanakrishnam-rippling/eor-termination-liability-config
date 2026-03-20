import { useSearchParams } from 'react-router-dom';

type OutcomeStatus = 'pending' | 'approved' | 'declined' | 'more_info' | 'manual_review';

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
    message: 'Your underwriting application is being reviewed. The Risk team will contact you with the final decision. Please save your Case ID for reference.',
  },
  approved: {
    icon: (
      <svg className="w-8 h-8 text-[#079F8F]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    iconBg: 'bg-[#E0F3F1]',
    title: 'Application Approved',
    badgeLabel: 'Approved',
    badgeBg: 'bg-[#C1E7E3]',
    badgeText: 'text-[#0C4739]',
    dotColor: 'bg-[#079F8F]',
    message: 'Your underwriting application has been approved. Your deposit terms have been updated accordingly. You can proceed with onboarding.',
  },
  declined: {
    icon: (
      <svg className="w-8 h-8 text-[#BF0F0F]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    iconBg: 'bg-[#F7E1E1]',
    title: 'Application Declined',
    badgeLabel: 'Declined',
    badgeBg: 'bg-[#EFC3C3]',
    badgeText: 'text-[#6D2828]',
    dotColor: 'bg-[#BF0F0F]',
    message: 'Unfortunately, your underwriting application was not approved at this time. Standard deposit terms will apply. Please contact your Account Executive for more details.',
  },
  more_info: {
    icon: (
      <svg className="w-8 h-8 text-[#4a6ba6]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    iconBg: 'bg-[#E1F2F7]',
    title: 'Additional Information Required',
    badgeLabel: 'More Info Needed',
    badgeBg: 'bg-[#C3E5EF]',
    badgeText: 'text-[#1E2B47]',
    dotColor: 'bg-[#4a6ba6]',
    message: 'We need additional documentation to process your application. Your Account Executive will reach out with specific requests. Please respond promptly to avoid delays.',
  },
  manual_review: {
    icon: (
      <svg className="w-8 h-8 text-[#F77700]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
      </svg>
    ),
    iconBg: 'bg-[#FEEEDD]',
    title: 'Under Manual Review',
    badgeLabel: 'Manual Review',
    badgeBg: 'bg-[#FDDDBB]',
    badgeText: 'text-[#733B17]',
    dotColor: 'bg-[#F77700]',
    message: 'Your application has been escalated for manual review by our Risk team. This typically takes 2-3 business days. You will be notified once a decision is made.',
  },
};

export default function SubmissionConfirmationView() {
  const [searchParams] = useSearchParams();
  const caseId = searchParams.get('caseId') ?? 'N/A';
  const rawStatus = searchParams.get('status') ?? 'pending';
  const status: OutcomeStatus = (rawStatus in STATUS_CONFIGS)
    ? (rawStatus as OutcomeStatus)
    : 'pending';

  const config = STATUS_CONFIGS[status];

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-6">
      <div className="max-w-[520px] w-full bg-white border border-[#e5e7eb] rounded-xl shadow-sm p-10 flex flex-col items-center gap-6">
        {/* Icon */}
        <div className={`w-16 h-16 rounded-full ${config.iconBg} flex items-center justify-center`}>
          {config.icon}
        </div>

        <h1 className="text-[24px] font-bold leading-[32px] text-[#1a1a1a] text-center tracking-[-0.2px]">
          {config.title}
        </h1>

        <div className="w-full bg-[#f8f8f8] rounded-lg px-5 py-4 flex flex-col gap-3">
          <div className="flex justify-between items-center">
            <span className="text-[14px] text-[#6b7280]">Status</span>
            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full ${config.badgeBg} ${config.badgeText} text-[13px] font-medium`}>
              <span className={`w-1.5 h-1.5 rounded-full ${config.dotColor}`} />
              {config.badgeLabel}
            </span>
          </div>
          <div className="h-px bg-[#e5e7eb]" />
          <div className="flex justify-between items-center">
            <span className="text-[14px] text-[#6b7280]">Case ID</span>
            <span className="text-[14px] font-mono text-[#1a1a1a]">{caseId}</span>
          </div>
        </div>

        <p className="text-[14px] leading-[20px] text-[#6b7280] text-center">
          {config.message}
        </p>
      </div>
    </div>
  );
}
