import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function EmailSentView() {
  const navigate = useNavigate();
  const [resending, setResending] = useState(false);
  const [resent, setResent] = useState(false);

  const intakeRaw = localStorage.getItem('underwriting_intake');
  const email = intakeRaw ? JSON.parse(intakeRaw)?.info?.workEmail : '';

  const handleResend = async () => {
    setResending(true);
    await new Promise((r) => setTimeout(r, 1000));
    setResending(false);
    setResent(true);
    setTimeout(() => setResent(false), 3000);
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-between bg-white px-6 pt-16 pb-10">
      <div className="flex flex-col items-center max-w-[520px] w-full">
        <img
          src="/images/email-envelope.png"
          alt="Email sent"
          className="w-[120px] h-[120px] object-contain mb-8"
        />

        <h1 className="text-[22px] font-bold leading-[30px] text-[#1a1a1a] text-center tracking-[-0.2px] mb-4">
          Check your inbox! You're one step closer to your Rippling journey
        </h1>

        <p className="text-[14px] leading-[22px] text-[#6b7280] text-center mb-2">
          The special link was sent to{' '}
          {email && <span className="font-semibold text-[#1a1a1a]">{email}</span>}
          . This email contains a unique link for you to access the credit application for a corporate card.
        </p>

        <p className="text-[14px] leading-[22px] text-[#6b7280] text-center">
          Make sure to check your spam folder in case our email landed in there, and do not share the email or link as it's unique to your company.
        </p>
      </div>

      <div className="flex flex-col items-center gap-2 mt-auto pt-16">
        <p className="text-[13px] leading-[20px] text-[#6b7280] text-center">
          It may take a few minutes for the email to arrive (check your spam folder).
        </p>
        <p className="text-[13px] leading-[20px] text-[#6b7280] text-center">
          Didn't get it?{' '}
          <button
            type="button"
            onClick={handleResend}
            disabled={resending}
            className="text-[#1e4aa9] font-medium hover:text-[#152d4a] transition-colors cursor-pointer bg-transparent border-none p-0 text-[13px] leading-[20px]"
          >
            {resending ? 'Sending...' : resent ? 'Email resent!' : 'Resend email'}
          </button>
        </p>

        {import.meta.env.DEV && (
          <button
            type="button"
            onClick={() => navigate('/apply/form')}
            className="mt-4 text-[12px] text-[#9ca3af] hover:text-[#6b7280] transition-colors cursor-pointer bg-transparent border-none p-0 underline"
          >
            [Dev] Skip to application
          </button>
        )}
      </div>
    </div>
  );
}
