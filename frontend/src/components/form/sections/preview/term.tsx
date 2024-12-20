import { Calendar } from 'lucide-react';
import type { JobData } from '../../../../types/job';
import { PreviewItem } from './components/item';

interface PreviewTermProps {
	formData: JobData;
}

export function PreviewTerm({ formData }: PreviewTermProps) {
	return (
		<div className="space-y-6">
			<h3 className="font-medium text-gray-900 flex items-center gap-2">
				<Calendar className="w-4 h-4 text-blue-600" />
				Term Details
			</h3>
			<div className="space-y-4">
				<PreviewItem
					icon={<Calendar className="w-4 h-4" />}
					label="Co-op Year"
					value={`${formData.coopYear} Year`}
				/>
				<PreviewItem
					icon={<Calendar className="w-4 h-4" />}
					label="Co-op Term"
					value={formData.coopCycle}
				/>
			</div>
		</div>
	);
}
