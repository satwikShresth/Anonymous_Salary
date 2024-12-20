import type { JobData } from '../types/job';

export const mockJobs: JobData[] = [
  {
    companyName: "Google",
    position: "Software Engineer Intern",
    majors: ["Computer Science"],
    minors: [],
    salary: 45,
    salaryNA: false,
    location: "Mountain View, CA",
    workHours: 40,
    coopYear: "2nd",
    coopCycle: "spring/summer",
    compensations: [
      {
        type: 'housing',
        amount: 2000,
        description: 'Monthly housing stipend',
        isNotApplicable: false
      },
      {
        type: 'food',
        amount: 500,
        description: 'Free meals at campus',
        isNotApplicable: false
      }
    ],
    level: "undergraduate",
    source: "SCDC"
  },
  {
    companyName: "Microsoft",
    position: "Full Stack Developer Co-op",
    majors: ["Software Engineering", "Computer Science"],
    minors: [],
    salary: 42,
    salaryNA: false,
    location: "Seattle, WA",
    workHours: 40,
    coopYear: "3rd",
    coopCycle: "fall/winter",
    compensations: [
      {
        type: 'transportation',
        amount: 100,
        description: 'Transit pass',
        isNotApplicable: false
      }
    ],
    level: "graduate",
    source: "external"
  },
  {
    companyName: "Amazon",
    position: "Frontend Developer Intern",
    majors: ["Computer Engineering"],
    minors: ["Human-Computer Interaction"],
    salary: 40,
    salaryNA: false,
    location: "Vancouver, BC",
    workHours: 35,
    coopYear: "1st",
    coopCycle: "spring/summer",
    compensations: [
      {
        type: 'bonus',
        amount: 5000,
        description: 'Signing bonus',
        isNotApplicable: false
      }
    ],
    level: "undergraduate",
    source: "SCDC"
  }
];
