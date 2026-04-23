export interface PolicyComponent {
  name: string;
  calculationMethod: string;
}

export interface MemberCondition {
  entity: string;
  field: string;
  operator: string;
  value: string;
}

export type PolicyType = 'severance' | 'vacation_pay' | 'notice_period_pay';

export const POLICY_TYPE_LABELS: Record<PolicyType, string> = {
  severance: 'Severance Pay',
  vacation_pay: 'Vacation Pay',
  notice_period_pay: 'Notice Period Pay',
};

export interface TerminationPolicy {
  id: string;
  name: string;
  policyType?: PolicyType;
  members: MemberCondition[];
  exceptFor: MemberCondition[];
  components: PolicyComponent[];
}

export const TERMINATION_POLICIES_BY_COUNTRY: Record<string, TerminationPolicy[]> = {
  NL: [
    {
      id: 'nl-1',
      name: 'Termination Liability: Indefinite',
      members: [
        { entity: 'Employee', field: 'Is an EOR Employee?', operator: 'equals', value: 'True' },
        { entity: 'Employee', field: 'Country?', operator: 'equals', value: 'Netherlands' },
        { entity: 'Employee', field: 'Contract Type?', operator: 'equals', value: 'Indefinite' },
      ],
      exceptFor: [],
      components: [
        { name: 'Statutory Severance (Transitievergoeding)', calculationMethod: '1/3 month per year of service' },
        { name: 'Notice Period', calculationMethod: 'Per year of service with tiers' },
        { name: 'Vacation Payout', calculationMethod: 'All accrued days' },
      ],
    },
    {
      id: 'nl-2',
      name: 'Termination Liability: MTA Indefinite',
      members: [
        { entity: 'Employee', field: 'Is an EOR Employee?', operator: 'equals', value: 'True' },
        { entity: 'Employee', field: 'Country?', operator: 'equals', value: 'Netherlands' },
        { entity: 'Employee', field: 'Contract Type?', operator: 'equals', value: 'Indefinite' },
        { entity: 'Employee', field: 'Termination Reason?', operator: 'equals', value: 'Mutual Agreement' },
      ],
      exceptFor: [],
      components: [
        { name: 'Statutory Severance (Transitievergoeding)', calculationMethod: '1/3 month per year of service' },
        { name: 'MTA Payment', calculationMethod: 'Fixed: 2 months salary' },
        { name: 'Vacation Payout', calculationMethod: 'All accrued days' },
      ],
    },
  ],
  IN: [
    {
      id: 'in-1',
      name: 'Termination Liability: Indefinite',
      members: [
        { entity: 'Employee', field: 'Is an EOR Employee?', operator: 'equals', value: 'True' },
        { entity: 'Employee', field: 'Country?', operator: 'equals', value: 'India' },
        { entity: 'Employee', field: 'Contract Type?', operator: 'equals', value: 'Indefinite' },
      ],
      exceptFor: [],
      components: [
        { name: 'Severance / Ex-Gratia', calculationMethod: '15 days per year of service' },
        { name: 'Vacation Payout', calculationMethod: 'All accrued days' },
      ],
    },
    {
      id: 'in-2',
      name: 'Termination Liability: Gratuity Eligible',
      members: [
        { entity: 'Employee', field: 'Is an EOR Employee?', operator: 'equals', value: 'True' },
        { entity: 'Employee', field: 'Country?', operator: 'equals', value: 'India' },
        { entity: 'Employee', field: 'Contract Type?', operator: 'equals', value: 'Indefinite' },
        { entity: 'Employee', field: 'Tenure?', operator: 'is at least', value: '5 years' },
      ],
      exceptFor: [],
      components: [
        { name: 'Gratuity', calculationMethod: '15 days per year (26-day divisor)' },
        { name: 'Severance / Ex-Gratia', calculationMethod: '15 days per year of service' },
        { name: 'Vacation Payout', calculationMethod: 'All accrued days' },
      ],
    },
  ],
  GB: [
    {
      id: 'gb-1',
      name: 'Termination Liability: Indefinite',
      members: [
        { entity: 'Employee', field: 'Is an EOR Employee?', operator: 'equals', value: 'True' },
        { entity: 'Employee', field: 'Country?', operator: 'equals', value: 'United Kingdom' },
        { entity: 'Employee', field: 'Contract Type?', operator: 'equals', value: 'Indefinite' },
      ],
      exceptFor: [],
      components: [
        { name: 'Notice Period', calculationMethod: '1 week per year of service (min 1, max 12 weeks)' },
        { name: 'Vacation Payout', calculationMethod: 'All accrued days (statutory 5.6 weeks/year)' },
      ],
    },
    {
      id: 'gb-2',
      name: 'Termination Liability: Redundancy',
      members: [
        { entity: 'Employee', field: 'Is an EOR Employee?', operator: 'equals', value: 'True' },
        { entity: 'Employee', field: 'Country?', operator: 'equals', value: 'United Kingdom' },
        { entity: 'Employee', field: 'Contract Type?', operator: 'equals', value: 'Indefinite' },
        { entity: 'Employee', field: 'Termination Reason?', operator: 'equals', value: 'Redundancy' },
        { entity: 'Employee', field: 'Tenure?', operator: 'is at least', value: '2 years' },
      ],
      exceptFor: [],
      components: [
        { name: 'Statutory Redundancy Pay', calculationMethod: 'Tenure-based tiers with age multiplier; salary cap £643/week' },
        { name: 'Notice Period', calculationMethod: '1 week per year of service (min 1, max 12 weeks)' },
        { name: 'Vacation Payout', calculationMethod: 'All accrued days (statutory 5.6 weeks/year)' },
      ],
    },
  ],
  DE: [
    {
      id: 'de-1',
      name: 'Termination Liability: Indefinite',
      members: [
        { entity: 'Employee', field: 'Is an EOR Employee?', operator: 'equals', value: 'True' },
        { entity: 'Employee', field: 'Country?', operator: 'equals', value: 'Germany' },
        { entity: 'Employee', field: 'Contract Type?', operator: 'equals', value: 'Indefinite' },
      ],
      exceptFor: [],
      components: [
        { name: 'Severance (Abfindung)', calculationMethod: '0.5 months per year of service' },
        { name: 'Notice Period', calculationMethod: 'Tenure-based tiers (1-7 months)' },
      ],
    },
  ],
  FR: [
    {
      id: 'fr-1',
      name: 'Termination Liability: Indefinite',
      members: [
        { entity: 'Employee', field: 'Is an EOR Employee?', operator: 'equals', value: 'True' },
        { entity: 'Employee', field: 'Country?', operator: 'equals', value: 'France' },
        { entity: 'Employee', field: 'Contract Type?', operator: 'equals', value: 'Indefinite' },
        { entity: 'Employee', field: 'Tenure?', operator: 'is at least', value: '8 months' },
      ],
      exceptFor: [],
      components: [
        { name: 'Severance (Indemnite de licenciement)', calculationMethod: '1/4 month per year (first 10), 1/3 month thereafter' },
        { name: 'Notice Period', calculationMethod: 'Tenure-based tiers (1-2 months)' },
        { name: 'Vacation Payout', calculationMethod: 'All accrued days' },
        { name: '13th Month Proration', calculationMethod: 'Prorated to months worked' },
      ],
    },
    {
      id: 'fr-2',
      name: 'Termination Liability: Rupture Conventionnelle',
      members: [
        { entity: 'Employee', field: 'Is an EOR Employee?', operator: 'equals', value: 'True' },
        { entity: 'Employee', field: 'Country?', operator: 'equals', value: 'France' },
        { entity: 'Employee', field: 'Contract Type?', operator: 'equals', value: 'Indefinite' },
        { entity: 'Employee', field: 'Termination Reason?', operator: 'equals', value: 'Mutual Agreement (Rupture conventionnelle)' },
      ],
      exceptFor: [],
      components: [
        { name: 'MTA Payment', calculationMethod: 'Fixed: 1 month salary; 15 days to secure' },
        { name: 'Vacation Payout', calculationMethod: 'All accrued days' },
        { name: '13th Month Proration', calculationMethod: 'Prorated to months worked' },
      ],
    },
  ],
  BR: [
    {
      id: 'br-1',
      name: 'Termination Liability: Indefinite',
      members: [
        { entity: 'Employee', field: 'Is an EOR Employee?', operator: 'equals', value: 'True' },
        { entity: 'Employee', field: 'Country?', operator: 'equals', value: 'Brazil' },
        { entity: 'Employee', field: 'Contract Type?', operator: 'equals', value: 'Indefinite' },
      ],
      exceptFor: [],
      components: [
        { name: 'FGTS Fine (40%)', calculationMethod: '40% of FGTS balance' },
        { name: 'Notice Period', calculationMethod: '30 days + 3 days per year of service' },
        { name: 'Vacation Payout', calculationMethod: 'All accrued + 1/3 constitutional bonus' },
        { name: '13th Salary Proration', calculationMethod: '1/12 per month worked' },
      ],
    },
  ],
  AR: [
    {
      id: 'ar-1',
      name: 'Termination Liability: Indefinite',
      members: [
        { entity: 'Employee', field: 'Is an EOR Employee?', operator: 'equals', value: 'True' },
        { entity: 'Employee', field: 'Country?', operator: 'equals', value: 'Argentina' },
        { entity: 'Employee', field: 'Contract Type?', operator: 'equals', value: 'Indefinite' },
      ],
      exceptFor: [],
      components: [
        { name: 'Severance (Indemnizacion)', calculationMethod: '1 month per year of service (min 1 month)' },
        { name: 'Notice Period', calculationMethod: 'Tenure < 5yr: 1 month; Tenure >= 5yr: 2 months' },
        { name: 'Vacation Payout', calculationMethod: 'All accrued days' },
        { name: 'Integration Month', calculationMethod: 'Prorated days in final month' },
      ],
    },
  ],
  CA: [
    {
      id: 'ca-1',
      name: 'Termination Liability: Fixed Term',
      members: [
        { entity: 'Employee', field: 'Is an EOR Employee?', operator: 'equals', value: 'True' },
        { entity: 'Employee', field: 'Country?', operator: 'equals', value: 'Canada' },
        { entity: 'Employee', field: 'Province?', operator: 'equals', value: 'Ontario' },
        { entity: 'Employee', field: 'Contract Type?', operator: 'equals', value: 'Fixed Term' },
      ],
      exceptFor: [],
      components: [
        { name: 'Remaining Contract Value', calculationMethod: 'Remaining days on contract x daily rate' },
        { name: 'Vacation Payout', calculationMethod: 'All accrued days (4% of earnings)' },
      ],
    },
    {
      id: 'ca-2',
      name: 'Termination Liability: Indefinite',
      members: [
        { entity: 'Employee', field: 'Is an EOR Employee?', operator: 'equals', value: 'True' },
        { entity: 'Employee', field: 'Country?', operator: 'equals', value: 'Canada' },
        { entity: 'Employee', field: 'Province?', operator: 'equals', value: 'Ontario' },
        { entity: 'Employee', field: 'Contract Type?', operator: 'equals', value: 'Indefinite' },
      ],
      exceptFor: [],
      components: [
        { name: 'Severance Pay', calculationMethod: '1 week per year of service (max 8 weeks)' },
        { name: 'Notice Period', calculationMethod: 'Tenure-based: 1-8 weeks' },
        { name: 'Vacation Payout', calculationMethod: 'All accrued days (4% of earnings)' },
      ],
    },
  ],
  ES: [
    {
      id: 'es-1',
      name: 'Termination Liability: Objective Dismissal',
      members: [
        { entity: 'Employee', field: 'Is an EOR Employee?', operator: 'equals', value: 'True' },
        { entity: 'Employee', field: 'Country?', operator: 'equals', value: 'Spain' },
        { entity: 'Employee', field: 'Contract Type?', operator: 'equals', value: 'Indefinite' },
        { entity: 'Employee', field: 'Termination Reason?', operator: 'equals', value: 'Objective Dismissal' },
      ],
      exceptFor: [],
      components: [
        { name: 'Severance', calculationMethod: '20 days per year of service (max 12 months)' },
        { name: 'Notice Period', calculationMethod: 'Fixed: 15 days' },
        { name: 'Vacation Payout', calculationMethod: 'All accrued days' },
      ],
    },
  ],
  MX: [
    {
      id: 'mx-1',
      name: 'Termination Liability: Unjustified Dismissal',
      members: [
        { entity: 'Employee', field: 'Is an EOR Employee?', operator: 'equals', value: 'True' },
        { entity: 'Employee', field: 'Country?', operator: 'equals', value: 'Mexico' },
        { entity: 'Employee', field: 'Contract Type?', operator: 'equals', value: 'Indefinite' },
        { entity: 'Employee', field: 'Termination Reason?', operator: 'equals', value: 'Unjustified Dismissal' },
      ],
      exceptFor: [],
      components: [
        { name: 'Severance (3 months constitutional)', calculationMethod: 'Fixed: 3 months salary' },
        { name: 'Vacation Payout', calculationMethod: 'All accrued days + 25% vacation premium' },
        { name: 'Aguinaldo Proration', calculationMethod: 'Prorated 15 days' },
      ],
    },
    {
      id: 'mx-2',
      name: 'Termination Liability: Seniority Premium',
      members: [
        { entity: 'Employee', field: 'Is an EOR Employee?', operator: 'equals', value: 'True' },
        { entity: 'Employee', field: 'Country?', operator: 'equals', value: 'Mexico' },
        { entity: 'Employee', field: 'Contract Type?', operator: 'equals', value: 'Indefinite' },
        { entity: 'Employee', field: 'Tenure?', operator: 'is at least', value: '15 years' },
        { entity: 'Employee', field: 'Termination Reason?', operator: 'equals', value: 'Unjustified Dismissal' },
      ],
      exceptFor: [],
      components: [
        { name: 'Severance (3 months constitutional)', calculationMethod: 'Fixed: 3 months salary' },
        { name: 'Seniority Premium', calculationMethod: '12 days per year (capped at 2x min wage)' },
        { name: 'Vacation Payout', calculationMethod: 'All accrued days + 25% vacation premium' },
        { name: 'Aguinaldo Proration', calculationMethod: 'Prorated 15 days' },
      ],
    },
  ],
};
