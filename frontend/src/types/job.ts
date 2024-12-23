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
  coopYear: string;
  coopCycle: string;
  compensations: CompensationItem[];
  level: string;
  source: string;
  offerStatus: string;
  decision: string;
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
  coopCycle: 'Fall/Winter',
  compensations: [],
  level: 'Undergraduate',
  source: 'SCDC',
  offerStatus: 'Offered',
  decision: 'Accepted',
  decisionReason: '',
  otherNotes: ''
};
