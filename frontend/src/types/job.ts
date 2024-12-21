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
  // Decision fields with default values
  offerStatus: 'Offered' | 'Qualified Alternative';
  decision: 'Accepted' | 'Ranked';
  decisionReason: string;
  otherNotes: string;
}

export const defaultJobData: JobData = {
  companyName: '',
  position: '',
  majors: [],
  minors: [],
  salary: 50,
  salaryNA: false,
  location: '',
  workHours: 40,
  coopYear: '1st',
  coopCycle: 'spring/summer',
  compensations: [],
  level: 'undergraduate',
  source: 'SCDC',
  offerStatus: 'Offered',
  decision: 'Accepted',
  decisionReason: '',
  otherNotes: ''
};
