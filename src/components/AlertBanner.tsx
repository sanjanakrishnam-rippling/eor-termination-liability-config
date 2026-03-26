interface AlertBannerProps {
  variant: 'error' | 'warning' | 'info';
  message: string;
  className?: string;
}

const VARIANT_STYLES = {
  error: {
    container: 'bg-[#F7E1E1] border-[#EFC3C3]',
    icon: 'text-[#BF0F0F]',
    text: 'text-[#6D2828]',
  },
  warning: {
    container: 'bg-[#FFF8E0] border-[#FFF1C1]',
    icon: 'text-[#FFC707]',
    text: 'text-[#774F10]',
  },
  info: {
    container: 'bg-[#E1F2F7] border-[#C3E5EF]',
    icon: 'text-[#0F97BF]',
    text: 'text-[#1E2B47]',
  },
};

export default function AlertBanner({ variant, message, className = '' }: AlertBannerProps) {
  const styles = VARIANT_STYLES[variant];

  return (
    <div className={`flex items-start gap-3 border rounded-lg p-4 ${styles.container} ${className}`}>
      <svg className={`w-5 h-5 shrink-0 mt-0.5 ${styles.icon}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
      </svg>
      <p className={`text-[14px] leading-[20px] font-medium ${styles.text}`}>
        {message}
      </p>
    </div>
  );
}
