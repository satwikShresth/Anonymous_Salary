import type { CompensationItem } from './compensation';

export interface JobData {
  companyName: string;
  position: string;
  majors: string[];
  minors: string[];
  salary: number;
  salaryNA: boolean;
  location: string;
  workHours: number;
  coopYear: '1st' | '2nd' | '3rd';
  coopCycle: 'spring/summer' | 'fall/winter';
  compensations: CompensationItem[];
  level: 'graduate' | 'undergraduate';
  source: 'SCDC' | 'external';
}
