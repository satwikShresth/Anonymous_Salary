// components/table/TableToolbar.tsx
import { IconButton, Tooltip, FormControlLabel, Switch } from '@mui/material';
import ViewColumnIcon from '@mui/icons-material/ViewColumn';

interface TableToolbarProps {
  onColumnsClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
  densePadding: boolean;
  onDensePaddingChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export function TableToolbar({
  onColumnsClick,
  densePadding,
  onDensePaddingChange,
}: TableToolbarProps) {
  return (
    <div className="flex justify-between items-center p-4">
      <div className="flex gap-3">
        <Tooltip title="Column visibility">
          <IconButton
            onClick={onColumnsClick}
            sx={{
              backgroundColor: 'rgba(59, 130, 246, 0.1)',
              '&:hover': {
                backgroundColor: 'rgba(59, 130, 246, 0.2)',
              },
            }}
          >
            <ViewColumnIcon className="text-blue-600" />
          </IconButton>
        </Tooltip>
      </div>
      <FormControlLabel
        control={
          <Switch
            checked={densePadding}
            onChange={onDensePaddingChange}
            sx={{
              '& .MuiSwitch-track': {
                backgroundColor: 'rgba(59, 130, 246, 0.2)',
              },
              '& .MuiSwitch-thumb': {
                backgroundColor: 'rgb(59, 130, 246)',
              },
            }}
          />
        }
        label="Dense padding"
      />
    </div>
  );
}
