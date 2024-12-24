export type CompensationType = 'Hourly' | 'Stipend' | 'Bonus' | 'Housing' | 'Transportation' | 'Food' | 'Other';

export interface CompensationItem {
  type: CompensationType;
  amount: number | null;
  description: string;
  isNotApplicable?: boolean;
}

export const compensationTypes: { value: CompensationType; label: string; freq: string }[] = [
  { value: 'Hourly', label: 'Hourly Rate', freq: "hrs" },
  { value: 'Stipend', label: 'Stipend', freq: "week" },
  { value: 'Housing', label: 'Housing Allowance', freq: "coop" },
  { value: 'Transportation', label: 'Transportation', freq: "month" },
  { value: 'Food', label: 'Food/Meals', freq: "month" },
  { value: 'Other', label: 'Other', freq: "coop" }
];

export interface CompensationRange {
  min: number;
  max: number;
  step: number;
  unit: string;
  suffix?: string;
}
