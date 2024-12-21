export type CompensationType = 'hourly' | 'stipend' | 'bonus' | 'housing' | 'transportation' | 'food' | 'other';

export interface CompensationItem {
  type: CompensationType;
  amount: number | null;
  description: string;
  isNotApplicable?: boolean;
}

export const compensationTypes: { value: CompensationType; label: string }[] = [
  { value: 'hourly', label: 'Hourly Rate' },
  { value: 'stipend', label: 'Stipend' },
  { value: 'bonus', label: 'Bonus' },
  { value: 'housing', label: 'Housing Allowance' },
  { value: 'transportation', label: 'Transportation' },
  { value: 'food', label: 'Food/Meals' },
  { value: 'other', label: 'Other' }
];

export interface CompensationRange {
  min: number;
  max: number;
  step: number;
  unit: string;
  suffix?: string;
}
