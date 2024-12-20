import type { JobData } from '../types/job';
import type { FilterOptions, SortOption } from '../types/filters';

export function filterJobs(jobs: JobData[], filters: FilterOptions): JobData[] {
  return jobs.filter((job) => {
    if (filters.level && job.level !== filters.level) return false;
    if (filters.source && job.source !== filters.source) return false;
    if (filters.coopYear && job.coopYear !== filters.coopYear) return false;
    if (filters.coopCycle && job.coopCycle !== filters.coopCycle) return false;
    if (filters.companyName && job.companyName !== filters.companyName) return false;
    if (filters.position && job.position !== filters.position) return false;
    if (filters.major && !job.majors.includes(filters.major)) return false;
    return true;
  });
}

export function sortJobs(jobs: JobData[], sortOption: SortOption): JobData[] {
  return [...jobs].sort((a, b) => {
    switch (sortOption) {
      case 'salary-desc':
        return b.salary - a.salary;
      case 'salary-asc':
        return a.salary - b.salary;
      case 'hours-desc':
        return b.workHours - a.workHours;
      case 'hours-asc':
        return a.workHours - b.workHours;
      case 'company-asc':
        return a.companyName.localeCompare(b.companyName);
      case 'company-desc':
        return b.companyName.localeCompare(a.companyName);
      default:
        return 0;
    }
  });
}
