import { Filter, SortAsc } from "lucide-react";
import { FilterDropdown } from "./FilterDropdown.tsx";
import { SortDropdown } from "./SortDropdown.tsx";
import { SearchFilter } from "./SearchFilter.tsx";
import type { FilterOptions, SortOption } from "../../../types/filters.ts";
import { companies } from "../../../data/companies.ts";
import { positions } from "../../../data/positions.ts";
import { majors } from "../../../data/majors.ts";

interface FilterBarProps {
  filters: FilterOptions;
  onFilterChange: (filters: FilterOptions) => void;
  sortOption: SortOption;
  onSortChange: (sort: SortOption) => void;
}

export function FilterBar(
  { filters, onFilterChange, sortOption, onSortChange }: FilterBarProps,
) {
  return (
    <div className="bg-white p-4 rounded-lg shadow-sm mb-6 flex flex-col sm:flex-row gap-4">
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-3">
          <Filter className="w-4 h-4 text-gray-500" />
          <span className="text-sm font-medium text-gray-700">Filters</span>
        </div>
        <div className="flex flex-wrap gap-2">
          <SearchFilter
            label="Company"
            options={companies}
            selected={filters.companyName}
            onChange={(value) =>
              onFilterChange({ ...filters, companyName: value })}
          />
          <SearchFilter
            label="Position"
            options={positions}
            selected={filters.position}
            onChange={(value) =>
              onFilterChange({ ...filters, position: value })}
          />
          <SearchFilter
            label="Major"
            options={majors}
            selected={filters.major}
            onChange={(value) => onFilterChange({ ...filters, major: value })}
          />
          <FilterDropdown
            label="Level"
            options={["undergraduate", "graduate"]}
            selected={filters.level}
            onChange={(value) => onFilterChange({ ...filters, level: value })}
          />
          <FilterDropdown
            label="Source"
            options={["SCDC", "external"]}
            selected={filters.source}
            onChange={(value) => onFilterChange({ ...filters, source: value })}
          />
          <FilterDropdown
            label="Year"
            options={["1st", "2nd", "3rd"]}
            selected={filters.coopYear}
            onChange={(value) =>
              onFilterChange({ ...filters, coopYear: value })}
          />
          <FilterDropdown
            label="Term"
            options={["spring/summer", "fall/winter"]}
            selected={filters.coopCycle}
            onChange={(value) =>
              onFilterChange({ ...filters, coopCycle: value })}
          />
        </div>
      </div>
      <div className="border-t sm:border-l sm:border-t-0 sm:pl-4 pt-4 sm:pt-0">
        <div className="flex items-center gap-2 mb-3">
          <SortAsc className="w-4 h-4 text-gray-500" />
          <span className="text-sm font-medium text-gray-700">Sort By</span>
        </div>
        <SortDropdown value={sortOption} onChange={onSortChange} />
      </div>
    </div>
  );
}

