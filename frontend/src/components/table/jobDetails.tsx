// components/table/JobDetails.tsx
import { Typography } from '@mui/material';
import type { JobData } from '../../types/job';

interface JobDetailsProps {
  job: JobData;
}

export function JobDetails({ job }: JobDetailsProps) {
  return (
    <div className="space-y-4 pt-2">
      <div>
        <Typography variant="subtitle2" color="text.secondary">Company</Typography>
        <Typography>{job.companyName}</Typography>
      </div>
      <div>
        <Typography variant="subtitle2" color="text.secondary">Position</Typography>
        <Typography>{job.position}</Typography>
      </div>
      <div>
        <Typography variant="subtitle2" color="text.secondary">Location</Typography>
        <Typography>{job.location}</Typography>
      </div>
      <div>
        <Typography variant="subtitle2" color="text.secondary">Work Schedule</Typography>
        <Typography>{job.workHours}hrs/week</Typography>
      </div>
      <div>
        <Typography variant="subtitle2" color="text.secondary">Majors</Typography>
        <Typography>{job.majors?.join(', ') || 'Not specified'}</Typography>
      </div>
      {job.minors?.length > 0 && (
        <div>
          <Typography variant="subtitle2" color="text.secondary">Minors</Typography>
          <Typography>{job.minors.join(', ')}</Typography>
        </div>
      )}
      <div>
        <Typography variant="subtitle2" color="text.secondary">Co-op Year</Typography>
        <Typography>{job.coopYear} Year</Typography>
      </div>
      <div>
        <Typography variant="subtitle2" color="text.secondary">Co-op Term</Typography>
        <Typography>{job.coopCycle}</Typography>
      </div>
      <div>
        <Typography variant="subtitle2" color="text.secondary">Level</Typography>
        <Typography className="capitalize">{job.level}</Typography>
      </div>
      <div>
        <Typography variant="subtitle2" color="text.secondary">Source</Typography>
        <Typography>{job.source}</Typography>
      </div>
    </div>
  );
}
