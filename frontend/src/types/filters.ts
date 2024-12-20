export type FilterOptions = {
  level: string | null;
  source: string | null;
  coopYear: string | null;
  coopCycle: string | null;
  companyName: string | null;
  position: string | null;
  major: string | null;
};

export type SortOption =
  | 'salary-desc'
  | 'salary-asc'
  | 'hours-desc'
  | 'hours-asc'
  | 'company-asc'
  | 'company-desc';
