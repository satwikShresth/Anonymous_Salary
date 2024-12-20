import type { JobData } from '../../../../types/job';
import { PreviewHeader } from './components/header';
import { PreviewCompany } from './company';
import { PreviewProgram } from './program';
import { PreviewCompensation } from './compensation';
import { PreviewTerm } from './term';

interface PreviewSectionProps {
	formData: JobData;
	onSubmit: () => void;
	onBack: () => void;
}

export function PreviewSection({ formData, onSubmit, onBack }: PreviewSectionProps) {
	return (
		<div className="space-y-8">
			<PreviewHeader />

			<div className="grid grid-cols-1 md:grid-cols-2 gap-8">
				<PreviewCompany formData={formData} />
				<PreviewProgram formData={formData} />
				<PreviewCompensation formData={formData} />
				<PreviewTerm formData={formData} />
			</div>

			<div className="border-t border-gray-200 pt-6 flex justify-between">
				<button
					type="button"
					onClick={onBack}
					className="px-6 py-3 border border-gray-300 rounded-lg text-base font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
				>
					Back to Edit
				</button>
				<button
					type="button"
					onClick={onSubmit}
					className="px-6 py-3 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors duration-200"
				>
					Submit
				</button>
			</div>

			<p className="text-sm text-gray-500">
				Please review all information carefully before submitting. Your co-op details will be shared anonymously.
			</p>
		</div>
	);
}
