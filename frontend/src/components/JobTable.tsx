import { Building2, MapPin, DollarSign, Clock, Calendar, GraduationCap, BookOpen, Globe, Briefcase } from 'lucide-react';
import type { JobData } from '../types/job';
import { InfoItem } from './ui/info';
import { Badge } from './ui/badge';

interface JobTableProps {
  jobs: JobData[];
}

export function JobTable({ jobs }: JobTableProps) {
  if (jobs.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 mb-4">
          <Building2 className="w-8 h-8 text-blue-600" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No jobs added yet</h3>
        <p className="text-gray-500">Start by adding your first co-op job opportunity.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      <div className="grid grid-cols-1 gap-4 sm:gap-6 p-6">
        {jobs.map((job, index) => (
          <div
            key={index}
            className="bg-white rounded-lg border border-gray-200 p-6 hover:border-blue-500 transition-colors duration-200"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="space-y-4">
                <InfoItem icon={<Building2 className="w-4 h-4" />} label="Company" value={job.companyName} />
                <InfoItem icon={<Briefcase className="w-4 h-4" />} label="Position" value={job.position} />
                <InfoItem icon={<MapPin className="w-4 h-4" />} label="Location" value={job.location} />
              </div>

              <div className="space-y-4">
                <InfoItem
                  icon={<DollarSign className="w-4 h-4" />}
                  label="Compensation"
                  value={job.salaryNA ? 'N/A' : `$${job.salary}/hr`}
                />
                <InfoItem
                  icon={<Clock className="w-4 h-4" />}
                  label="Work Schedule"
                  value={`${job.workHours}hrs/week`}
                />
                <InfoItem
                  icon={<GraduationCap className="w-4 h-4" />}
                  label="Majors"
                  value={job.majors?.join(', ') || 'Not specified'}
                />
                {job.minors?.length > 0 && (
                  <InfoItem
                    icon={<BookOpen className="w-4 h-4" />}
                    label="Minors"
                    value={job.minors.join(', ')}
                  />
                )}
              </div>

              <div className="space-y-4">
                <InfoItem
                  icon={<Calendar className="w-4 h-4" />}
                  label="Co-op Year"
                  value={`${job.coopYear} Year`}
                />
                <InfoItem
                  icon={<Calendar className="w-4 h-4" />}
                  label="Co-op Term"
                  value={job.coopCycle}
                />
                <div className="flex items-center gap-2">
                  <Globe className="w-4 h-4 text-gray-500" />
                  <Badge color={job.source === 'SCDC' ? 'green' : 'purple'}>
                    {job.source}
                  </Badge>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
