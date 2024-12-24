import { useMemo } from 'react';
import { createColumnHelper } from '@tanstack/react-table';
import type { JobData } from '../types/job';
import type { CompensationItem } from '../types/compensation';
import { IconButton, Chip, Tooltip } from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import WorkIcon from '@mui/icons-material/Work';
import SchoolIcon from '@mui/icons-material/School';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import { compensationTypes } from "../types/compensation"

interface UseColumnsProps {
  onOpenDetails: (job: JobData) => void;
}

export function useColumns({ onOpenDetails }: UseColumnsProps) {
  const columnHelper = createColumnHelper<JobData>();

  const formatCompensation = (compensations: CompensationItem[]) => {
    if (!compensations?.length) return 'N/A';

    return (
      <div className="flex flex-col gap-1">
        {compensations.map((comp, index) => {
          const typeInfo = compensationTypes.find(t => t.value === comp.type);
          if (!typeInfo || comp.isNotApplicable) return null;

          return (
            <div key={index} className="whitespace-nowrap text-sm">
              <span className="font-medium">{typeInfo.label}:</span>{' '}
              {comp.amount ? (
                <span className="text-green-600">
                  ${comp.amount}/{typeInfo.freq}
                </span>
              ) : 'N/A'}
            </div>
          );
        })}
      </div>
    );
  };

  const columns = useMemo(
    () => [
      columnHelper.accessor('companyName', {
        header: () => (
          <div className="flex items-center gap-2 text-gray-700">
            <WorkIcon fontSize="small" />
            <span>Company</span>
          </div>
        ),
        cell: ({ getValue, row }) => (
          <div className="flex items-center gap-2">
            <span className="font-medium text-blue-600 hover:text-blue-800 cursor-pointer"
              onClick={() => onOpenDetails(row.original)}>
              {getValue()}
            </span>
            <Tooltip title="View Details">
              <IconButton
                size="small"
                onClick={() => onOpenDetails(row.original)}
                sx={{
                  padding: 0.5,
                  backgroundColor: 'rgba(59, 130, 246, 0.1)',
                  '&:hover': {
                    backgroundColor: 'rgba(59, 130, 246, 0.2)'
                  }
                }}
              >
                <InfoIcon fontSize="small" className="text-blue-600" />
              </IconButton>
            </Tooltip>
          </div>
        ),
      }),
      columnHelper.accessor('position', {
        header: () => (
          <div className="flex items-center gap-2 text-gray-700">
            <WorkIcon fontSize="small" />
            <span>Position</span>
          </div>
        ),
        cell: info => (
          <span className="font-medium">{info.getValue()}</span>
        ),
      }),
      columnHelper.accessor('location', {
        header: () => (
          <div className="flex items-center gap-2 text-gray-700">
            <LocationOnIcon fontSize="small" />
            <span>Location</span>
          </div>
        ),
        cell: info => (
          <Chip
            icon={<LocationOnIcon />}
            label={info.getValue()}
            variant="outlined"
            size="small"
            sx={{
              borderColor: 'rgba(59, 130, 246, 0.5)',
              color: 'rgb(59, 130, 246)'
            }}
          />
        ),
      }),
      columnHelper.accessor('compensations', {
        header: () => (
          <div className="flex items-center gap-2 text-gray-700">
            <AttachMoneyIcon fontSize="small" />
            <span>Compensation</span>
          </div>
        ),
        cell: info => formatCompensation(info.getValue()),
      }),
      columnHelper.accessor('majors', {
        header: () => (
          <div className="flex items-center gap-2 text-gray-700">
            <SchoolIcon fontSize="small" />
            <span>Majors</span>
          </div>
        ),
        cell: ({ getValue }) => (
          <div className="flex flex-wrap gap-1">
            {getValue()?.slice(0, 2).map((major, index) => (
              <Chip
                key={index}
                label={major}
                size="small"
                sx={{
                  backgroundColor: 'rgba(59, 130, 246, 0.1)',
                  color: 'rgb(59, 130, 246)',
                  fontSize: '0.75rem'
                }}
              />
            ))}
            {(getValue()?.length || 0) > 2 && (
              <Chip
                label={`+${getValue()?.length - 2}`}
                size="small"
                sx={{
                  backgroundColor: 'rgba(59, 130, 246, 0.1)',
                  color: 'rgb(59, 130, 246)',
                  fontSize: '0.75rem'
                }}
              />
            )}
          </div>
        ),
      }),
      columnHelper.accessor('coopYear', {
        header: () => (
          <div className="flex items-center gap-2 text-gray-700">
            <CalendarTodayIcon fontSize="small" />
            <span>Year</span>
          </div>
        ),
        cell: ({ getValue }) => (
          <Chip
            label={`${getValue()} Year`}
            size="small"
            sx={{
              backgroundColor: 'rgba(59, 130, 246, 0.1)',
              color: 'rgb(59, 130, 246)'
            }}
          />
        ),
      }),
      columnHelper.accessor('coopCycle', {
        header: 'Term',
        cell: info => (
          <Chip
            label={info.getValue()}
            size="small"
            sx={{
              backgroundColor: 'rgba(156, 163, 175, 0.1)',
              color: 'rgb(107, 114, 128)'
            }}
          />
        ),
      }),
      columnHelper.accessor('source', {
        header: 'Source',
        cell: ({ getValue }) => (
          <Chip
            label={getValue()}
            size="small"
            color={getValue() === 'SCDC' ? 'success' : 'secondary'}
            sx={{ fontWeight: 500 }}
          />
        ),
      }),
    ],
    [columnHelper, onOpenDetails]
  );

  return columns;
}
