// components/table/TableToolbar.tsx
import { IconButton, Tooltip } from '@mui/material';
import ViewColumnIcon from '@mui/icons-material/ViewColumn';

interface TableToolbarProps {
  onColumnsClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

export function TableToolbar({
  onColumnsClick,
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
    </div>
  );
}
