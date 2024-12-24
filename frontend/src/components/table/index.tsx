// JobTable/index.tsx
import { useState, useRef, useCallback } from 'react';
import { Dialog, DialogContent, DialogTitle, Paper } from '@mui/material';
import {
  getCoreRowModel,
  useReactTable,
  VisibilityState,
} from '@tanstack/react-table';
import type { JobData } from '../../types/job';
import { TableHeader } from './header';
import { TableBody } from './body';
import { TableToolbar } from './toolbar';
import { TableColumnVisibility } from './columnVisibility';
import { useColumns } from '../../hooks/useColumns';
import { JobDetails } from './jobDetails';

interface JobTableProps {
  jobs: JobData[];
  isLoading: boolean;
  hasMore: boolean;
  onLoadMore: () => void;
}

export function JobTable({
  jobs,
  isLoading,
  hasMore,
  onLoadMore,
}: JobTableProps) {
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [columnAnchorEl, setColumnAnchorEl] = useState<HTMLButtonElement | null>(null);
  const [selectedJob, setSelectedJob] = useState<JobData | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  // Ref for intersection observer
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadingRef = useCallback((node: HTMLDivElement | null) => {
    if (isLoading) return;

    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    observerRef.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        onLoadMore();
      }
    });

    if (node) {
      observerRef.current.observe(node);
    }
  }, [isLoading, hasMore, onLoadMore]);

  const handleOpenDetails = (job: JobData) => {
    setSelectedJob(job);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setSelectedJob(null);
  };

  const columns = useColumns({
    onOpenDetails: handleOpenDetails,
  });

  const table = useReactTable({
    data: jobs,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    state: {
      columnVisibility,
    },
    manualPagination: true,
  });

  return (
    <Paper elevation={2} className="rounded-xl">
      <TableToolbar
        onColumnsClick={(e) => setColumnAnchorEl(e.currentTarget)}
      />
      <div className="rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <TableHeader headerGroups={table.getHeaderGroups()} />
            <TableBody rows={table.getRowModel().rows} />
          </table>

          {/* Loading/Intersection Observer trigger */}
          <div
            ref={loadingRef}
            className="w-full p-4 text-center"
          >
            {isLoading && (
              <div className="flex justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
              </div>
            )}
            {!isLoading && !hasMore && jobs.length > 0 && (
              <div className="text-gray-500">No more jobs to load</div>
            )}
          </div>
        </div>
      </div>

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
