import { useState } from 'react';
import InputText from '../components/InputText';
import Button from '../components/Button';

function isEmailValid(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export default function ContinueApplicationView() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async () => {
    if (!email.trim()) {
      setError('Work email address is required');
      return;
    }
    if (!isEmailValid(email)) {
      setError('Please enter a valid email address');
      return;
    }

    setError('');
    setIsSending(true);
    await new Promise((r) => setTimeout(r, 800));
    setIsSending(false);
    setSent(true);
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-[520px] mx-auto px-6 py-16">
        <div className="mb-8">
          <h1 className="text-[22px] font-bold leading-[30px] text-[#1a1a1a] tracking-[-0.2px]">
            Continue with your application
          </h1>
          <p className="mt-3 text-[14px] leading-[22px] text-[#6b7280]">
            Enter the email address you used to start your application. If this application exists,
            we will send a new email with a link to continue with your application.
          </p>
        </div>

        {sent ? (
          <div className="flex flex-col items-center gap-4 py-8">
            <svg className="w-12 h-12 text-[#079F8F]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-[14px] leading-[22px] text-[#6b7280] text-center">
              If an application exists for <span className="font-semibold text-[#1a1a1a]">{email}</span>,
              you will receive an email with a link to continue.
            </p>
          </div>
        ) : (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSubmit();
            }}
            className="flex flex-col gap-5"
          >
            <InputText
              label="Work email address"
              type="email"
              value={email}
              onChange={setEmail}
              placeholder="Work email address"
              required
              error={!!error}
              errorMessage={error}
            />
            <div className="flex justify-end">
              <Button
                type="submit"
                appearance="primary"
                size="lg"
                disabled={isSending}
              >
                {isSending ? 'Sending...' : 'Send email link'}
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
