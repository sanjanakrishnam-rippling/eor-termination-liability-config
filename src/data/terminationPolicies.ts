export interface PolicyComponent {
  name: string;
  calculationMethod: string;
  conditions: string;
}

export interface TerminationPolicy {
  contractType: string;
  province: string;
  status: 'Active' | 'Draft';
  lastUpdated: string;
  components: PolicyComponent[];
}

export const TERMINATION_POLICIES_BY_COUNTRY: Record<string, TerminationPolicy[]> = {
  NL: [
    {
      contractType: 'Indefinite',
      province: 'All',
      status: 'Active',
      lastUpdated: '2026-03-15',
      components: [
        { name: 'Statutory Severance (Transitievergoeding)', calculationMethod: 'Per year of service: 1/3 month per year', conditions: 'All termination reasons' },
        { name: 'Notice Period', calculationMethod: 'Per year of service with tiers', conditions: 'All except gross misconduct' },
        { name: 'Vacation Payout', calculationMethod: 'All accrued days', conditions: 'Always' },
        { name: 'MTA Payment', calculationMethod: 'Fixed: 2 months salary', conditions: 'When MTA is applicable; 30 days to secure' },
      ],
    },
  ],
  IN: [
    {
      contractType: 'Indefinite',
      province: 'All',
      status: 'Active',
      lastUpdated: '2026-03-10',
      components: [
        { name: 'Gratuity', calculationMethod: 'Per year of service: 15 days per year (26-day divisor)', conditions: 'Tenure >= 5 years' },
        { name: 'Severance / Ex-Gratia', calculationMethod: 'Per year of service: 15 days per year', conditions: 'All termination reasons' },
        { name: 'Vacation Payout', calculationMethod: 'All accrued days', conditions: 'Always' },
      ],
    },
  ],
  GB: [
    {
      contractType: 'Indefinite',
      province: 'All',
      status: 'Active',
      lastUpdated: '2026-02-28',
      components: [
        { name: 'Statutory Redundancy Pay', calculationMethod: 'Tenure-based tiers with age multiplier; salary cap £643/week', conditions: 'Reason = Redundancy, Tenure >= 2 years' },
        { name: 'Notice Period', calculationMethod: '1 week per year of service, min 1 week, max 12 weeks', conditions: 'All except gross misconduct' },
        { name: 'Vacation Payout', calculationMethod: 'All accrued days (statutory 5.6 weeks/year)', conditions: 'Always' },
      ],
    },
  ],
  DE: [
    {
      contractType: 'Indefinite',
      province: 'All',
      status: 'Draft',
      lastUpdated: '2026-04-01',
      components: [
        { name: 'Severance (Abfindung)', calculationMethod: 'Per year of service: 0.5 months per year', conditions: 'All termination reasons' },
        { name: 'Notice Period', calculationMethod: 'Tenure-based tiers (1-7 months)', conditions: 'All except gross misconduct' },
      ],
    },
  ],
  FR: [
    {
      contractType: 'Indefinite',
      province: 'All',
      status: 'Active',
      lastUpdated: '2026-03-20',
      components: [
        { name: 'Severance (Indemnite de licenciement)', calculationMethod: 'Tenure-based: 1/4 month per year (first 10), 1/3 month thereafter', conditions: 'Tenure >= 8 months' },
        { name: 'Notice Period', calculationMethod: 'Tenure-based tiers (1-2 months)', conditions: 'All except gross misconduct' },
        { name: 'Vacation Payout', calculationMethod: 'All accrued days', conditions: 'Always' },
        { name: '13th Month Proration', calculationMethod: 'Fraction of salary: prorated to months worked', conditions: 'Always' },
        { name: 'MTA Payment', calculationMethod: 'Fixed: 1 month salary', conditions: 'When MTA is applicable; 15 days to secure' },
      ],
    },
  ],
  BR: [
    {
      contractType: 'Indefinite',
      province: 'All',
      status: 'Active',
      lastUpdated: '2026-01-15',
      components: [
        { name: 'FGTS Fine (40%)', calculationMethod: 'Fraction of salary: 40% of FGTS balance', conditions: 'Termination without cause' },
        { name: 'Notice Period', calculationMethod: '30 days + 3 days per year of service', conditions: 'All except just cause' },
        { name: 'Vacation Payout', calculationMethod: 'All accrued + 1/3 constitutional bonus', conditions: 'Always' },
        { name: '13th Salary Proration', calculationMethod: 'Fraction of salary: 1/12 per month worked', conditions: 'Always' },
      ],
    },
  ],
  AR: [
    {
      contractType: 'Indefinite',
      province: 'All',
      status: 'Active',
      lastUpdated: '2026-02-20',
      components: [
        { name: 'Severance (Indemnizacion)', calculationMethod: 'Per year of service: 1 month per year (min 1 month)', conditions: 'Termination without cause' },
        { name: 'Notice Period', calculationMethod: 'Tenure < 5yr: 1 month; Tenure >= 5yr: 2 months', conditions: 'All except just cause' },
        { name: 'Vacation Payout', calculationMethod: 'All accrued days', conditions: 'Always' },
        { name: 'Integration Month', calculationMethod: 'Fraction of salary: prorated days in final month', conditions: 'Always' },
      ],
    },
  ],
  ES: [
    {
      contractType: 'Indefinite',
      province: 'All',
      status: 'Active',
      lastUpdated: '2026-03-05',
      components: [
        { name: 'Severance', calculationMethod: 'Per year of service: 20 days per year (max 12 months)', conditions: 'Objective dismissal' },
        { name: 'Notice Period', calculationMethod: 'Fixed: 15 days', conditions: 'Objective dismissal' },
        { name: 'Vacation Payout', calculationMethod: 'All accrued days', conditions: 'Always' },
      ],
    },
  ],
  MX: [
    {
      contractType: 'Indefinite',
      province: 'All',
      status: 'Active',
      lastUpdated: '2026-02-10',
      components: [
        { name: 'Severance (3 months constitutional)', calculationMethod: 'Fixed: 3 months salary', conditions: 'Unjustified dismissal' },
        { name: 'Seniority Premium', calculationMethod: 'Per year of service: 12 days per year (capped at 2x min wage)', conditions: 'Tenure >= 15 years or unjustified dismissal' },
        { name: 'Vacation Payout', calculationMethod: 'All accrued days + 25% vacation premium', conditions: 'Always' },
        { name: 'Aguinaldo Proration', calculationMethod: 'Fraction of salary: prorated 15 days', conditions: 'Always' },
      ],
    },
  ],
};
