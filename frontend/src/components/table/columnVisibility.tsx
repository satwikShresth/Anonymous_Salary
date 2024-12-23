import { Column } from '@tanstack/react-table';
import { Box, Popover, Typography, FormControlLabel, Switch } from '@mui/material';
import type { JobData } from '../../types/job';

interface TableColumnVisibilityProps {
  anchorEl: HTMLButtonElement | null;
  onClose: () => void;
  columns: Column<JobData, unknown>[];
}

export function TableColumnVisibility({
  anchorEl,
  onClose,
  columns,
}: TableColumnVisibilityProps) {
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
      <Box sx={{ p: 2, minWidth: 200 }}>
        <Typography variant="subtitle2" gutterBottom>Visible Columns</Typography>
        {columns.map(column => {
          const headerValue = typeof column.columnDef.header === 'string'
            ? column.columnDef.header
            : column.id;

          return (
            <FormControlLabel
              key={column.id}
              control={
                <Switch
                  checked={column.getIsVisible()}
                  onChange={column.getToggleVisibilityHandler()}
                />
              }
              label={headerValue}
            />
          );
        })}
      </Box>
    </Popover>
  );
}
