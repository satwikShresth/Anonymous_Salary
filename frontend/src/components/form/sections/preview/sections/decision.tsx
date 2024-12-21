import { CheckCircle2, FileText } from 'lucide-react';
import type { JobData } from '../../../../../types/job';
import { PreviewItem } from '../components/item';
import { PreviewBadge } from '../components/badge';

interface PreviewDecisionProps {
	formData: JobData;
}

export function PreviewDecision({ formData }: PreviewDecisionProps) {
	if (!formData.offerStatus && !formData.decision && !formData.decisionReason && !formData.otherNotes) {
		return null;
	}

	return (
		<div className="space-y-6">
			<h3 className="font-medium text-gray-900 flex items-center gap-2">
				<CheckCircle2 className="w-4 h-4 text-blue-600" />
				Decision Details
			</h3>
			<div className="space-y-4">
				{(formData.offerStatus || formData.decision) && (
					<div className="space-y-1">
						<div className="flex items-center gap-2 text-gray-500 text-sm">
							<CheckCircle2 className="w-4 h-4" />
							Status & Decision
						</div>
						<div className="flex flex-wrap gap-2">
							{formData.offerStatus && (
								<PreviewBadge color={formData.offerStatus === 'Offered' ? 'green' : 'purple'}>
									{formData.offerStatus}
								</PreviewBadge>
							)}
							{formData.decision && (
								<PreviewBadge color={formData.decision === 'Accepted' ? 'blue' : 'purple'}>
									{formData.decision}
								</PreviewBadge>
							)}
						</div>
					</div>
				)}

				{formData.decisionReason && (
					<PreviewItem
						icon={<FileText className="w-4 h-4" />}
						label="Reason for Decision"
						value={formData.decisionReason}
						multiline
					/>
				)}

				{formData.otherNotes && (
					<PreviewItem
						icon={<FileText className="w-4 h-4" />}
						label="Additional Notes"
						value={formData.otherNotes}
						multiline
					/>
				)}
			</div>
		</div>
	);
}
