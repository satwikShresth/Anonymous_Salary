// utils/jobFilters.ts
import type { JobData } from '../types/job';
import type { FilterOptions, SortOption } from '../types/filters';

export function filterJobs(jobs: JobData[], filters: FilterOptions): JobData[] {
  return jobs.filter(job => {
    if (filters.companyName && !job.companyName.toLowerCase().includes(filters.companyName.toLowerCase())) {
      return false;
    }
    if (filters.position && !job.position.toLowerCase().includes(filters.position.toLowerCase())) {
      return false;
    }
    if (filters.major && job.majors && !job.majors.some(major =>
      major.toLowerCase().includes(filters.major!.toLowerCase())
    )) {
      return false;
    }
    if (filters.level && job.level !== filters.level) {
      return false;
    }
    if (filters.source && job.source !== filters.source) {
      return false;
    }
    if (filters.coopYear && job.coopYear !== filters.coopYear) {
      return false;
    }
    if (filters.coopCycle && job.coopCycle !== filters.coopCycle) {
      return false;
    }
    return true;
  });
}

export function sortJobs(jobs: JobData[], sortOption: SortOption): JobData[] {
  const sortedJobs = [...jobs];

  switch (sortOption) {
    case 'salary-desc':
      return sortedJobs.sort((a, b) => (b.salary || 0) - (a.salary || 0));
    case 'salary-asc':
      return sortedJobs.sort((a, b) => (a.salary || 0) - (b.salary || 0));
    case 'hours-desc':
      return sortedJobs.sort((a, b) => (b.workHours || 0) - (a.workHours || 0));
    case 'hours-asc':
      return sortedJobs.sort((a, b) => (a.workHours || 0) - (b.workHours || 0));
    case 'company-asc':
      return sortedJobs.sort((a, b) => a.companyName.localeCompare(b.companyName));
    case 'company-desc':
      return sortedJobs.sort((a, b) => b.companyName.localeCompare(a.companyName));
    default:
      return sortedJobs;
  }
}
