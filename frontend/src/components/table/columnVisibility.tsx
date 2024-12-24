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
        horizontal: 'right',
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
    >
      <Box sx={{
        p: 2,
        minWidth: 200,
        display: 'flex',
        flexDirection: 'column',
        gap: 1
      }}>
        <Typography variant="subtitle2" color="text.secondary" className="font-medium border-b border-gray-200 pb-2">
          Visible Columns
        </Typography>
        <div className="flex flex-col gap-1">
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
                    size="small"
                    sx={{
                      '& .MuiSwitch-track': {
                        backgroundColor: 'rgba(59, 130, 246, 0.2)',
                      },
                      '& .MuiSwitch-thumb': {
                        backgroundColor: column.getIsVisible() ? 'rgb(59, 130, 246)' : undefined,
                      },
                      '&.Mui-checked': {
                        '& .MuiSwitch-thumb': {
                          backgroundColor: 'rgb(59, 130, 246)',
                        },
                        '& + .MuiSwitch-track': {
                          backgroundColor: 'rgba(59, 130, 246, 0.5) !important',
                        },
                      },
                    }}
                  />
                }
                label={
                  <Typography variant="body2" className="text-gray-700">
                    {headerValue}
                  </Typography>
                }
                sx={{
                  marginLeft: 0,
                  marginRight: 0,
                  paddingY: 0.5,
                  paddingX: 1,
                  borderRadius: 1,
                  '&:hover': {
                    backgroundColor: 'rgba(0, 0, 0, 0.04)',
                  },
                }}
              />
            );
          })}
        </div>
      </Box>
    </Popover>
  );
}
