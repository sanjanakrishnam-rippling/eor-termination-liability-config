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
  severance: 'Severance pay',
  vacation_pay: 'Vacation pay',
  notice_period_pay: 'Notice period pay',
};

export interface TerminationPolicy {
  id: string;
  name: string;
  policyType?: PolicyType;
  members: MemberCondition[];
  exceptFor: MemberCondition[];
  components: PolicyComponent[];
}

const eorEmployee = (countryName: string): MemberCondition[] => [
  { entity: 'Employee', field: 'Is an EOR Employee?', operator: 'equals', value: 'True' },
  { entity: 'Employee', field: 'Country?', operator: 'equals', value: countryName },
];

export const TERMINATION_POLICIES_BY_COUNTRY: Record<string, TerminationPolicy[]> = {
  NL: [
    {
      id: 'nl-sev-indefinite',
      name: 'Severance pay: Indefinite',
      policyType: 'severance',
      members: [
        ...eorEmployee('Netherlands'),
        { entity: 'Employee', field: 'Contract Type?', operator: 'equals', value: 'Indefinite' },
      ],
      exceptFor: [],
      components: [
        { name: 'Statutory Severance (Transitievergoeding)', calculationMethod: '1/3 month per year of service' },
      ],
    },
    {
      id: 'nl-sev-mta',
      name: 'Severance pay: Mutual Agreement',
      policyType: 'severance',
      members: [
        ...eorEmployee('Netherlands'),
        { entity: 'Employee', field: 'Contract Type?', operator: 'equals', value: 'Indefinite' },
        { entity: 'Employee', field: 'Termination Reason?', operator: 'equals', value: 'Mutual Agreement' },
      ],
      exceptFor: [],
      components: [
        { name: 'Statutory Severance (Transitievergoeding)', calculationMethod: '1/3 month per year of service' },
        { name: 'MTA Payment', calculationMethod: 'Fixed: 2 months salary' },
      ],
    },
    {
      id: 'nl-notice',
      name: 'Notice period pay: Standard',
      policyType: 'notice_period_pay',
      members: eorEmployee('Netherlands'),
      exceptFor: [],
      components: [
        { name: 'Notice period pay', calculationMethod: 'Per year of service with tiers' },
      ],
    },
    {
      id: 'nl-vac',
      name: 'Vacation pay: Standard',
      policyType: 'vacation_pay',
      members: eorEmployee('Netherlands'),
      exceptFor: [],
      components: [
        { name: 'Vacation pay', calculationMethod: 'All accrued days' },
      ],
    },
  ],
  IN: [
    {
      id: 'in-sev-indefinite',
      name: 'Severance pay: Indefinite',
      policyType: 'severance',
      members: [
        ...eorEmployee('India'),
        { entity: 'Employee', field: 'Contract Type?', operator: 'equals', value: 'Indefinite' },
      ],
      exceptFor: [],
      components: [
        { name: 'Severance / Ex-Gratia', calculationMethod: '15 days per year of service' },
      ],
    },
    {
      id: 'in-sev-gratuity',
      name: 'Severance pay: Gratuity Eligible',
      policyType: 'severance',
      members: [
        ...eorEmployee('India'),
        { entity: 'Employee', field: 'Contract Type?', operator: 'equals', value: 'Indefinite' },
        { entity: 'Employee', field: 'Tenure?', operator: 'is at least', value: '5 years' },
      ],
      exceptFor: [],
      components: [
        { name: 'Gratuity', calculationMethod: '15 days per year (26-day divisor)' },
        { name: 'Severance / Ex-Gratia', calculationMethod: '15 days per year of service' },
      ],
    },
    {
      id: 'in-vac',
      name: 'Vacation pay: Standard',
      policyType: 'vacation_pay',
      members: eorEmployee('India'),
      exceptFor: [],
      components: [
        { name: 'Vacation pay', calculationMethod: 'All accrued days' },
      ],
    },
  ],
  GB: [
    {
      id: 'gb-sev-redundancy',
      name: 'Severance pay: Redundancy',
      policyType: 'severance',
      members: [
        ...eorEmployee('United Kingdom'),
        { entity: 'Employee', field: 'Contract Type?', operator: 'equals', value: 'Indefinite' },
        { entity: 'Employee', field: 'Termination Reason?', operator: 'equals', value: 'Redundancy' },
        { entity: 'Employee', field: 'Tenure?', operator: 'is at least', value: '2 years' },
      ],
      exceptFor: [],
      components: [
        { name: 'Statutory Redundancy Pay', calculationMethod: 'Tenure-based tiers with age multiplier; salary cap £643/week' },
      ],
    },
    {
      id: 'gb-notice',
      name: 'Notice period pay: Standard',
      policyType: 'notice_period_pay',
      members: eorEmployee('United Kingdom'),
      exceptFor: [],
      components: [
        { name: 'Notice period pay', calculationMethod: '1 week per year of service (min 1, max 12 weeks)' },
      ],
    },
    {
      id: 'gb-vac',
      name: 'Vacation pay: Standard',
      policyType: 'vacation_pay',
      members: eorEmployee('United Kingdom'),
      exceptFor: [],
      components: [
        { name: 'Vacation pay', calculationMethod: 'All accrued days (statutory 5.6 weeks/year)' },
      ],
    },
  ],
  DE: [
    {
      id: 'de-sev-indefinite',
      name: 'Severance pay: Indefinite',
      policyType: 'severance',
      members: [
        ...eorEmployee('Germany'),
        { entity: 'Employee', field: 'Contract Type?', operator: 'equals', value: 'Indefinite' },
      ],
      exceptFor: [],
      components: [
        { name: 'Severance (Abfindung)', calculationMethod: '0.5 months per year of service' },
      ],
    },
    {
      id: 'de-notice',
      name: 'Notice period pay: Standard',
      policyType: 'notice_period_pay',
      members: eorEmployee('Germany'),
      exceptFor: [],
      components: [
        { name: 'Notice period pay', calculationMethod: 'Tenure-based tiers (1-7 months)' },
      ],
    },
  ],
  FR: [
    {
      id: 'fr-sev-indefinite',
      name: 'Severance pay: Indefinite',
      policyType: 'severance',
      members: [
        ...eorEmployee('France'),
        { entity: 'Employee', field: 'Contract Type?', operator: 'equals', value: 'Indefinite' },
        { entity: 'Employee', field: 'Tenure?', operator: 'is at least', value: '8 months' },
      ],
      exceptFor: [],
      components: [
        { name: 'Severance (Indemnité de licenciement)', calculationMethod: '1/4 month per year (first 10), 1/3 month thereafter' },
        { name: '13th Month Proration', calculationMethod: 'Prorated to months worked' },
      ],
    },
    {
      id: 'fr-sev-rupture',
      name: 'Severance pay: Rupture Conventionnelle',
      policyType: 'severance',
      members: [
        ...eorEmployee('France'),
        { entity: 'Employee', field: 'Contract Type?', operator: 'equals', value: 'Indefinite' },
        { entity: 'Employee', field: 'Termination Reason?', operator: 'equals', value: 'Mutual Agreement (Rupture conventionnelle)' },
      ],
      exceptFor: [],
      components: [
        { name: 'MTA Payment', calculationMethod: 'Fixed: 1 month salary; 15 days to secure' },
        { name: '13th Month Proration', calculationMethod: 'Prorated to months worked' },
      ],
    },
    {
      id: 'fr-notice',
      name: 'Notice period pay: Standard',
      policyType: 'notice_period_pay',
      members: eorEmployee('France'),
      exceptFor: [],
      components: [
        { name: 'Notice period pay', calculationMethod: 'Tenure-based tiers (1-2 months)' },
      ],
    },
    {
      id: 'fr-vac',
      name: 'Vacation pay: Standard',
      policyType: 'vacation_pay',
      members: eorEmployee('France'),
      exceptFor: [],
      components: [
        { name: 'Vacation pay', calculationMethod: 'All accrued days' },
      ],
    },
  ],
  BR: [
    {
      id: 'br-sev-indefinite',
      name: 'Severance pay: Indefinite',
      policyType: 'severance',
      members: [
        ...eorEmployee('Brazil'),
        { entity: 'Employee', field: 'Contract Type?', operator: 'equals', value: 'Indefinite' },
      ],
      exceptFor: [],
      components: [
        { name: 'FGTS Fine (40%)', calculationMethod: '40% of FGTS balance' },
        { name: '13th Salary Proration', calculationMethod: '1/12 per month worked' },
      ],
    },
    {
      id: 'br-notice',
      name: 'Notice period pay: Standard',
      policyType: 'notice_period_pay',
      members: eorEmployee('Brazil'),
      exceptFor: [],
      components: [
        { name: 'Notice period pay', calculationMethod: '30 days + 3 days per year of service' },
      ],
    },
    {
      id: 'br-vac',
      name: 'Vacation pay: Standard',
      policyType: 'vacation_pay',
      members: eorEmployee('Brazil'),
      exceptFor: [],
      components: [
        { name: 'Vacation pay', calculationMethod: 'All accrued + 1/3 constitutional bonus' },
      ],
    },
  ],
  AR: [
    {
      id: 'ar-sev-indefinite',
      name: 'Severance pay: Indefinite',
      policyType: 'severance',
      members: [
        ...eorEmployee('Argentina'),
        { entity: 'Employee', field: 'Contract Type?', operator: 'equals', value: 'Indefinite' },
      ],
      exceptFor: [],
      components: [
        { name: 'Severance (Indemnización)', calculationMethod: '1 month per year of service (min 1 month)' },
        { name: 'Integration Month', calculationMethod: 'Prorated days in final month' },
      ],
    },
    {
      id: 'ar-notice',
      name: 'Notice period pay: Standard',
      policyType: 'notice_period_pay',
      members: eorEmployee('Argentina'),
      exceptFor: [],
      components: [
        { name: 'Notice period pay', calculationMethod: 'Tenure < 5yr: 1 month; Tenure >= 5yr: 2 months' },
      ],
    },
    {
      id: 'ar-vac',
      name: 'Vacation pay: Standard',
      policyType: 'vacation_pay',
      members: eorEmployee('Argentina'),
      exceptFor: [],
      components: [
        { name: 'Vacation pay', calculationMethod: 'All accrued days' },
      ],
    },
  ],
  CA: [
    {
      id: 'ca-sev-fixed',
      name: 'Severance pay: Fixed Term',
      policyType: 'severance',
      members: [
        ...eorEmployee('Canada'),
        { entity: 'Employee', field: 'Province?', operator: 'equals', value: 'Ontario' },
        { entity: 'Employee', field: 'Contract Type?', operator: 'equals', value: 'Fixed Term' },
      ],
      exceptFor: [],
      components: [
        { name: 'Remaining Contract Value', calculationMethod: 'Remaining days on contract x daily rate' },
      ],
    },
    {
      id: 'ca-sev-indefinite',
      name: 'Severance pay: Indefinite',
      policyType: 'severance',
      members: [
        ...eorEmployee('Canada'),
        { entity: 'Employee', field: 'Province?', operator: 'equals', value: 'Ontario' },
        { entity: 'Employee', field: 'Contract Type?', operator: 'equals', value: 'Indefinite' },
      ],
      exceptFor: [],
      components: [
        { name: 'Severance pay', calculationMethod: '1 week per year of service (max 8 weeks)' },
      ],
    },
    {
      id: 'ca-notice',
      name: 'Notice period pay: Standard',
      policyType: 'notice_period_pay',
      members: eorEmployee('Canada'),
      exceptFor: [],
      components: [
        { name: 'Notice period pay', calculationMethod: 'Tenure-based: 1-8 weeks' },
      ],
    },
    {
      id: 'ca-vac',
      name: 'Vacation pay: Standard',
      policyType: 'vacation_pay',
      members: eorEmployee('Canada'),
      exceptFor: [],
      components: [
        { name: 'Vacation pay', calculationMethod: 'All accrued days (4% of earnings)' },
      ],
    },
  ],
  ES: [
    {
      id: 'es-sev-objective',
      name: 'Severance pay: Objective Dismissal',
      policyType: 'severance',
      members: [
        ...eorEmployee('Spain'),
        { entity: 'Employee', field: 'Contract Type?', operator: 'equals', value: 'Indefinite' },
        { entity: 'Employee', field: 'Termination Reason?', operator: 'equals', value: 'Objective Dismissal' },
      ],
      exceptFor: [],
      components: [
        { name: 'Severance', calculationMethod: '20 days per year of service (max 12 months)' },
      ],
    },
    {
      id: 'es-notice',
      name: 'Notice period pay: Standard',
      policyType: 'notice_period_pay',
      members: eorEmployee('Spain'),
      exceptFor: [],
      components: [
        { name: 'Notice period pay', calculationMethod: 'Fixed: 15 days' },
      ],
    },
    {
      id: 'es-vac',
      name: 'Vacation pay: Standard',
      policyType: 'vacation_pay',
      members: eorEmployee('Spain'),
      exceptFor: [],
      components: [
        { name: 'Vacation pay', calculationMethod: 'All accrued days' },
      ],
    },
  ],
  MX: [
    {
      id: 'mx-sev-unjustified',
      name: 'Severance pay: Unjustified Dismissal',
      policyType: 'severance',
      members: [
        ...eorEmployee('Mexico'),
        { entity: 'Employee', field: 'Contract Type?', operator: 'equals', value: 'Indefinite' },
        { entity: 'Employee', field: 'Termination Reason?', operator: 'equals', value: 'Unjustified Dismissal' },
      ],
      exceptFor: [],
      components: [
        { name: 'Severance (3 months constitutional)', calculationMethod: 'Fixed: 3 months salary' },
        { name: 'Aguinaldo Proration', calculationMethod: 'Prorated 15 days' },
      ],
    },
    {
      id: 'mx-sev-seniority',
      name: 'Severance pay: Seniority Premium',
      policyType: 'severance',
      members: [
        ...eorEmployee('Mexico'),
        { entity: 'Employee', field: 'Contract Type?', operator: 'equals', value: 'Indefinite' },
        { entity: 'Employee', field: 'Tenure?', operator: 'is at least', value: '15 years' },
        { entity: 'Employee', field: 'Termination Reason?', operator: 'equals', value: 'Unjustified Dismissal' },
      ],
      exceptFor: [],
      components: [
        { name: 'Severance (3 months constitutional)', calculationMethod: 'Fixed: 3 months salary' },
        { name: 'Seniority Premium', calculationMethod: '12 days per year (capped at 2x min wage)' },
        { name: 'Aguinaldo Proration', calculationMethod: 'Prorated 15 days' },
      ],
    },
    {
      id: 'mx-vac',
      name: 'Vacation pay: Standard',
      policyType: 'vacation_pay',
      members: eorEmployee('Mexico'),
      exceptFor: [],
      components: [
        { name: 'Vacation pay', calculationMethod: 'All accrued days + 25% vacation premium' },
      ],
    },
  ],
};
