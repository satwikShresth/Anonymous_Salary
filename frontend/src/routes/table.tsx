// src/routes/index.tsx
import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { JobTable } from "../components/JobTable.tsx";
import { FilterBar } from "../components/filters/FilterBar.tsx";
import { Link } from "@tanstack/react-router";
import { PlusCircle } from "lucide-react";
import type { JobData } from "../types/job.ts";
import type { FilterOptions, SortOption } from "../types/filters.ts";
import { mockJobs } from "../data/mockJobs.ts";
import { filterJobs, sortJobs } from "../utils/jobFilters.ts";

const initialFilters: FilterOptions = {
  companyName: null,
  position: null,
  major: null,
  level: null,
  source: null,
  coopYear: null,
  coopCycle: null,
};

export const Route = createFileRoute("/table")({
  component: IndexPage,
});

function IndexPage() {
  const [filters, setFilters] = useState<FilterOptions>(initialFilters);
  const [sortOption, setSortOption] = useState<SortOption>("salary-desc");

  useEffect(() => {
    const existingJobs = localStorage.getItem("jobs");
    if (!existingJobs) {
      localStorage.setItem("jobs", JSON.stringify(mockJobs));
    }
  }, []);

  const jobs: JobData[] = JSON.parse(localStorage.getItem("jobs") || "[]");
  const filteredJobs = sortJobs(filterJobs(jobs, filters), sortOption);

  return (
    <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Anonymous Co-op Salaries
          </h1>
          <p className="mt-2 text-gray-600">
            Help others by sharing your co-op compensation details anonymously
          </p>
        </div>
        <Link
          to="/form"
          className="inline-flex items-center px-6 py-3 border border-transparent rounded-lg shadow-sm text-base font-medium text-white bg-blue-600 hover:bg-blue-700 transition-colors duration-200"
        >
          <PlusCircle className="h-5 w-5 mr-2" />
          Share Your Salary
        </Link>
      </div>

      <FilterBar
        filters={filters}
        onFilterChange={setFilters}
        sortOption={sortOption}
        onSortChange={setSortOption}
      />

      <JobTable jobs={filteredJobs} />
    </div>
  );
}
