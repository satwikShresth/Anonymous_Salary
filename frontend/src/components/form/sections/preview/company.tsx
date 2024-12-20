import { Building2, Briefcase, MapPin } from 'lucide-react';
import type { JobData } from '../../../../types/job';
import { PreviewItem } from './components/item.tsx';

interface PreviewCompanyProps {
	formData: JobData;
}

export function PreviewCompany({ formData }: PreviewCompanyProps) {
	return (
		<div className="space-y-6">
			<h3 className="font-medium text-gray-900 flex items-center gap-2">
				<Building2 className="w-4 h-4 text-blue-600" />
				Company Details
			</h3>
			<div className="space-y-4">
				<PreviewItem
					icon={<Building2 className="w-4 h-4" />}
					label="Company"
					value={formData.companyName}
				/>
				<PreviewItem
					icon={<Briefcase className="w-4 h-4" />}
					label="Position"
					value={formData.position}
				/>
				<PreviewItem
					icon={<MapPin className="w-4 h-4" />}
					label="Location"
					value={formData.location}
				/>
			</div>
		</div>
	);
}
