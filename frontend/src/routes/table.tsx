// route/table.tsx
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { JobTable } from "../components/table";
import { FilterBar } from "../components/table/filters/FilterBar";
import { Link } from "@tanstack/react-router";
import { PlusCircle } from "lucide-react";
import type { FilterOptions, SortOption } from "../types/filters";
import { useJobs } from "../hooks/useJobs";
import { sortJobs } from "../utils/jobFilters";

const INITIAL_LIMIT = 20;

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

  const {
    jobs,
    isLoading,
    error,
    hasMore,
    loadMore
  } = useJobs(filters, INITIAL_LIMIT);

  const sortedJobs = sortJobs(jobs, sortOption);

  if (error) {
    return (
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">{error}</p>
        </div>
      </div>
    );
  }

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

      <JobTable
        jobs={sortedJobs}
        isLoading={isLoading}
        hasMore={hasMore}
        onLoadMore={loadMore}
        limit={INITIAL_LIMIT}
      />
    </div>
  );
}

