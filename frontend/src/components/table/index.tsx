// JobTable.tsx
import { useState } from 'react';
import { Dialog, DialogContent, DialogTitle, Paper } from '@mui/material';
import {
  getCoreRowModel,
  useReactTable,
  VisibilityState,
} from '@tanstack/react-table';
import type { JobData } from '../../types/job';
import { TableHeader } from './header';
import { TableBody } from './body';
import { TablePaginationBar } from './paginationBar';
import { TableToolbar } from './toolbar';
import { TableColumnVisibility } from './columnVisibility';
import { useColumns } from '../../hooks/useColumns';
import { JobDetails } from './jobDetails';

interface JobTableProps {
  jobs: JobData[]; // This will receive the filtered jobs
}

export function JobTable({ jobs }: JobTableProps) {
  // Table state
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [page, setPage] = useState(0);

  // Column visibility state
  const [columnAnchorEl, setColumnAnchorEl] = useState<HTMLButtonElement | null>(null);

  // Dialog state
  const [selectedJob, setSelectedJob] = useState<JobData | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleOpenDetails = (job: JobData) => {
    setSelectedJob(job);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setSelectedJob(null);
  };

  // Get column definitions
  const columns = useColumns({
    onOpenDetails: handleOpenDetails,
  });

  // Initialize table
  const table = useReactTable({
    data: jobs,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    state: {
      columnVisibility,
      pagination: {
        pageIndex: page,
        pageSize: rowsPerPage,
      },
    },
  });

  return (
    <Paper elevation={2} className="rounded-xl">
      <TableToolbar
        onColumnsClick={(e) => setColumnAnchorEl(e.currentTarget)}
      />

      <div className="rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <TableHeader
              headerGroups={table.getHeaderGroups()}
            />
            <TableBody
              rows={table.getRowModel().rows}
            />
          </table>
        </div>
      </div>

      <TablePaginationBar
        count={table.getFilteredRowModel().rows.length}
        page={page}
        rowsPerPage={rowsPerPage}
        onPageChange={(_, newPage) => setPage(newPage)}
        onRowsPerPageChange={(e) => {
          setRowsPerPage(parseInt(e.target.value, 10));
          setPage(0);
        }}
      />

      <TableColumnVisibility
        anchorEl={columnAnchorEl}
        onClose={() => setColumnAnchorEl(null)}
        columns={table.getAllLeafColumns()}
      />

      <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>Job Details</DialogTitle>
        <DialogContent>
          {selectedJob && <JobDetails job={selectedJob} />}
        </DialogContent>
      </Dialog>
    </Paper>
  );
}
