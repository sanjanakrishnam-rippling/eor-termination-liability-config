import { useParams, useNavigate } from 'react-router-dom';
import { COUNTRIES } from '../data/countries';
import Button from '../components/Button';

export default function CreateTerminationPolicyView() {
  const { code } = useParams<{ code: string }>();
  const navigate = useNavigate();

  const country = COUNTRIES.find((c) => c.code === code);
  const countryName = country?.name ?? code ?? 'Unknown';

  return (
    <div className="max-w-[720px] mx-auto px-8 py-8">
      <div className="flex items-center gap-2 mb-6 text-[13px]">
        <button
          onClick={() => navigate('/countries')}
          className="text-[#6b7280] hover:text-[#1a1a1a] transition-colors"
        >
          Countries
        </button>
        <svg className="w-3.5 h-3.5 text-[#c7c7c7]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
        <button
          onClick={() => navigate(`/countries/${code}`)}
          className="text-[#6b7280] hover:text-[#1a1a1a] transition-colors"
        >
          {countryName}
        </button>
        <svg className="w-3.5 h-3.5 text-[#c7c7c7]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
        <span className="text-[#1a1a1a] font-medium">Create Policy</span>
      </div>

      <h1 className="text-[22px] font-bold text-[#1a1a1a] mb-2">
        Create Termination Liability Policy
      </h1>
      <p className="text-[14px] text-[#6b7280] mb-8">
        Define the conditions and liability components for {countryName}.
      </p>

      <div className="bg-white border border-[#e5e7eb] rounded-lg p-8 text-center">
        <div className="w-16 h-16 rounded-full bg-[#f1f1f1] flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-[#9d9d9d]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
        </div>
        <h3 className="text-[16px] font-semibold text-[#1a1a1a] mb-2">Policy Configuration Wizard</h3>
        <p className="text-[14px] text-[#6b7280] max-w-[400px] mx-auto mb-6">
          The step-by-step policy builder will be implemented here. It will include contract type selection,
          condition configuration, component setup, and review/approval.
        </p>
        <div className="flex justify-center gap-3">
          <Button
            appearance="secondary"
            size="md"
            onClick={() => navigate(`/countries/${code}`)}
          >
            Back to {countryName}
          </Button>
        </div>
      </div>
    </div>
  );
}
