import { createContext, useContext, useState, ReactNode } from 'react';
import {
  TERMINATION_POLICIES_BY_COUNTRY,
  TerminationPolicy,
} from '../data/terminationPolicies';

interface PolicyStore {
  getPolicies: (countryCode: string) => TerminationPolicy[];
  addPolicy: (countryCode: string, policy: TerminationPolicy) => void;
  deletePolicy: (countryCode: string, policyId: string) => void;
}

const PolicyContext = createContext<PolicyStore | null>(null);

export function PolicyProvider({ children }: { children: ReactNode }) {
  const [policiesByCountry, setPoliciesByCountry] = useState<Record<string, TerminationPolicy[]>>(
    () => structuredClone(TERMINATION_POLICIES_BY_COUNTRY)
  );

  const getPolicies = (countryCode: string): TerminationPolicy[] => {
    return policiesByCountry[countryCode] ?? [];
  };

  const addPolicy = (countryCode: string, policy: TerminationPolicy) => {
    setPoliciesByCountry((prev) => ({
      ...prev,
      [countryCode]: [...(prev[countryCode] ?? []), policy],
    }));
  };

  const deletePolicy = (countryCode: string, policyId: string) => {
    setPoliciesByCountry((prev) => ({
      ...prev,
      [countryCode]: (prev[countryCode] ?? []).filter((p) => p.id !== policyId),
    }));
  };

  return (
    <PolicyContext.Provider value={{ getPolicies, addPolicy, deletePolicy }}>
      {children}
    </PolicyContext.Provider>
  );
}

export function usePolicyStore(): PolicyStore {
  const ctx = useContext(PolicyContext);
  if (!ctx) throw new Error('usePolicyStore must be used within PolicyProvider');
  return ctx;
}
