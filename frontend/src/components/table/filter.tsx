// TableFilters.tsx
import { FilterBar } from './filters/FilterBar';
import type { FilterOptions, SortOption } from '../../types/filters';
import { Box, Popover } from '@mui/material';

interface TableFiltersProps {
  anchorEl: HTMLButtonElement | null;
  onClose: () => void;
  filters: FilterOptions;
  onFilterChange: (filters: FilterOptions) => void;
  sortOption: SortOption;
  onSortChange: (sort: SortOption) => void;
}

export function TableFilters({
  anchorEl,
  onClose,
  filters,
  onFilterChange,
  sortOption,
  onSortChange,
}: TableFiltersProps) {
  return (
    <Popover
      open={Boolean(anchorEl)}
      anchorEl={anchorEl}
      onClose={onClose}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'left',
      }}
    >
      <Box sx={{ p: 2, minWidth: 300 }}>
        <FilterBar
          filters={filters}
          onFilterChange={onFilterChange}
          sortOption={sortOption}
          onSortChange={onSortChange}
        />
      </Box>
    </Popover>
  );
}

