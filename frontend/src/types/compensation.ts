export type CompensationType = 'Hourly' | 'Stipend' | 'Bonus' | 'Housing' | 'Transportation' | 'Food' | 'Other';

export interface CompensationItem {
  type: CompensationType;
  amount: number | null;
  description: string;
  isNotApplicable?: boolean;
}

export const compensationTypes: { value: CompensationType; label: string }[] = [
  { value: 'Hourly', label: 'Hourly Rate' },
  { value: 'Stipend', label: 'Stipend' },
  { value: 'Bonus', label: 'Bonus' },
  { value: 'Housing', label: 'Housing Allowance' },
  { value: 'Transportation', label: 'Transportation' },
  { value: 'Food', label: 'Food/Meals' },
  { value: 'Other', label: 'Other' }
];

export interface CompensationRange {
  min: number;
  max: number;
  step: number;
  unit: string;
  suffix?: string;
}
