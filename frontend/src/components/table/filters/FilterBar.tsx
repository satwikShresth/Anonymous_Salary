import { Filter, SortAsc } from "lucide-react";
import { FilterDropdown } from "./FilterDropdown";
import { SortDropdown } from "./SortDropdown";
import { SearchFilter } from "./SearchFilter";
import type { FilterOptions, SortOption } from "../../../types/filters";
import { useCompanies, usePositions } from "../../../hooks/useSubmission";
import { useCoopCycles, useCoopYears, useProgram, useSource } from "../../../hooks/radio";

interface FilterBarProps {
  filters: FilterOptions;
  onFilterChange: (filters: FilterOptions) => void;
  sortOption: SortOption;
  onSortChange: (sort: SortOption) => void;
}

type ExtendedFilterOptions = Omit<FilterOptions, 'companyName' | 'position'> & {
  companyName: string[];
  position: string[];
};

export function FilterBar({
  filters,
  onFilterChange,
  sortOption,
  onSortChange
}: FilterBarProps) {

  const { data: LEVEL_OPTIONS } = useProgram();
  const { data: YEAR_OPTIONS } = useCoopYears();
  const { data: TERM_OPTIONS } = useCoopCycles();
  const { data: SOURCE_OPTIONS } = useSource();

  const {
    loading: loadingCompanies,
    setData: setCompanies,
    fetchOptions: fetchCompanies,
    options: companyOptions
  } = useCompanies();

  const {
    loading: loadingPositions,
    setData: setPositions,
    fetchOptions: fetchPositions,
    options: positionOptions
  } = usePositions();

  const multiFilters = {
    ...filters,
    companyName: Array.isArray(filters.companyName)
      ? filters.companyName
      : filters.companyName ? [filters.companyName] : [],
    position: Array.isArray(filters.position)
      ? filters.position
      : filters.position ? [filters.position] : []
  } as ExtendedFilterOptions;

  const handleCompanySuggestion = (value: string) => {
    if (value && setCompanies) {
      setCompanies(prev => [...prev, value]);
      onFilterChange({
        ...filters,
        companyName: [...multiFilters.companyName, value]
      });
    }
  };

  // Handler for adding new position suggestions
  const handlePositionSuggestion = (value: string) => {
    if (value && setPositions) {
      setPositions(prev => [...prev, value]);
      onFilterChange({
        ...filters,
        position: [...multiFilters.position, value]
      });
    }
  };

  // Handler for company filter changes
  const handleCompanyChange = (values: string[]) => {
    onFilterChange({
      ...filters,
      companyName: values
    });
  };

  // Handler for position filter changes
  const handlePositionChange = (values: string[]) => {
    onFilterChange({
      ...filters,
      position: values
    });
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm mb-6 flex flex-col sm:flex-row gap-4">
      <div className="flex-1">
        {/* Filters Header */}
        <div className="flex items-center gap-2 mb-3">
          <Filter className="w-4 h-4 text-gray-500" />
          <span className="text-sm font-medium text-gray-700">Filters</span>
        </div>

        {/* Filter Options */}
        <div className="flex flex-wrap gap-2">
          {/* Company Search Filter */}
          <SearchFilter
            label="Company"
            options={companyOptions}
            selected={multiFilters.companyName}
            onChange={handleCompanyChange}
            fetchOptions={fetchCompanies}
            loading={loadingCompanies}
            allowSuggestions
            onSuggestion={handleCompanySuggestion}
            maxItems={5}
            placeholder="Search companies..."
          />

          {/* Position Search Filter */}
          <SearchFilter
            label="Position"
            options={positionOptions}
            selected={multiFilters.position}
            onChange={handlePositionChange}
            fetchOptions={fetchPositions}
            loading={loadingPositions}
            allowSuggestions
            onSuggestion={handlePositionSuggestion}
            maxItems={3}
            placeholder="Search positions..."
          />

          {/* Level Filter */}
          <FilterDropdown
            label="Level"
            options={LEVEL_OPTIONS}
            selected={filters.level}
            onChange={(value) => onFilterChange({ ...filters, level: value })}
          />

          {/* Source Filter */}
          <FilterDropdown
            label="Source"
            options={SOURCE_OPTIONS}
            selected={filters.source}
            onChange={(value) => onFilterChange({ ...filters, source: value })}
          />

          {/* Year Filter */}
          <FilterDropdown
            label="Year"
            options={YEAR_OPTIONS}
            selected={filters.coopYear}
            onChange={(value) => onFilterChange({ ...filters, coopYear: value })}
          />

          {/* Term Filter */}
          <FilterDropdown
            label="Term"
            options={TERM_OPTIONS}
            selected={filters.coopCycle}
            onChange={(value) => onFilterChange({ ...filters, coopCycle: value })}
          />
        </div>
      </div>

      {/* Sort Section */}
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
