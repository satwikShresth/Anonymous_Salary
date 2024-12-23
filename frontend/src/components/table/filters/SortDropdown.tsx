import React from "react";
import type { SortOption } from "../../types/filters.ts";

interface SortDropdownProps {
  value: SortOption;
  onChange: (value: SortOption) => void;
}

const sortOptions: { value: SortOption; label: string }[] = [
  { value: "salary-desc", label: "Salary (High to Low)" },
  { value: "salary-asc", label: "Salary (Low to High)" },
  { value: "hours-desc", label: "Hours (High to Low)" },
  { value: "hours-asc", label: "Hours (Low to High)" },
  { value: "company-asc", label: "Company (A-Z)" },
  { value: "company-desc", label: "Company (Z-A)" },
];

export function SortDropdown({ value, onChange }: SortDropdownProps) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value as SortOption)}
      className="block w-full rounded-md border-gray-300 py-1.5 pl-3 pr-10 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
    >
      {sortOptions.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
}

