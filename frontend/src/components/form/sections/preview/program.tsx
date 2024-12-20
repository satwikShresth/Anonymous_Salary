import { GraduationCap, BookOpen } from 'lucide-react';
import type { JobData } from '../../../../types/job';
import { PreviewItem } from './components/item';
import { PreviewBadge } from './components/badge';

interface PreviewProgramProps {
	formData: JobData;
}

export function PreviewProgram({ formData }: PreviewProgramProps) {
	return (
		<div className="space-y-6">
			<h3 className="font-medium text-gray-900 flex items-center gap-2">
				<GraduationCap className="w-4 h-4 text-blue-600" />
				Program Details
			</h3>
			<div className="space-y-4">
				<PreviewItem
					icon={<GraduationCap className="w-4 h-4" />}
					label="Majors"
					value={formData.majors.join(', ')}
				/>
				<PreviewItem
					icon={<BookOpen className="w-4 h-4" />}
					label="Minors"
					value={formData.minors.length > 0 ? formData.minors.join(', ') : 'None'}
				/>
				<div className="space-y-1">
					<div className="flex items-center gap-2 text-gray-500 text-sm">
						<BookOpen className="w-4 h-4" />
						Level & Source
					</div>
					<div className="flex gap-2">
						<PreviewBadge color="blue">{formData.level}</PreviewBadge>
						<PreviewBadge color={formData.source === 'SCDC' ? 'green' : 'purple'}>
							{formData.source}
						</PreviewBadge>
					</div>
				</div>
			</div>
		</div>
	);
}
