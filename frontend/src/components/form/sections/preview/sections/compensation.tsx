import { DollarSign, Clock, Gift } from 'lucide-react';
import type { JobData } from '../../../../../types/job';
import { PreviewItem } from '../components/item';

interface PreviewCompensationProps {
	formData: JobData;
}

export function PreviewCompensation({ formData }: PreviewCompensationProps) {
	const formatCompensations = () => {
		if (formData.compensations.length === 0) return 'None';

		return formData.compensations
			.map(comp => {
				const amount = comp.isNotApplicable ? 'N/A' : `$${comp.amount}`;
				return `${comp.type}: ${amount}${comp.description ? ` (${comp.description})` : ''}`;
			})
			.join('\n');
	};

	return (
		<div className="space-y-6">
			<h3 className="font-medium text-gray-900 flex items-center gap-2">
				<DollarSign className="w-4 h-4 text-blue-600" />
				Compensation
			</h3>
			<div className="space-y-4">
				<PreviewItem
					icon={<Gift className="w-4 h-4" />}
					label="Benefits"
					value={formatCompensations()}
					multiline
				/>
			</div>
		</div>
	);
}
