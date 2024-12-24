import { DollarSign, Plus } from 'lucide-react';
import type { JobData } from '../../../../types/job';
import type { CompensationItem as CompensationItemType } from '../../../../types/compensation';
import { CompensationItem } from './item';

interface CompensationSectionProps {
	formData: JobData;
	onChange: (data: Partial<JobData>) => void;
	showErrors?: boolean;
}

const MAX_ADDITIONAL_COMPENSATION = 5;

export function CompensationSection({ formData, onChange, showErrors }: CompensationSectionProps) {
	const handleAddCompensation = () => {
		if (formData.compensations.length < MAX_ADDITIONAL_COMPENSATION) {
			onChange({
				compensations: [
					...formData.compensations,
					{
						type: 'stipend',
						amount: null,
						description: '',
						isNotApplicable: false
					}
				]
			});
		}
	};

	const handleUpdateCompensation = (index: number, item: CompensationItemType) => {
		const newCompensations = [...formData.compensations];
		newCompensations[index] = item;
		onChange({ compensations: newCompensations });
	};

	const handleRemoveCompensation = (index: number) => {
		onChange({
			compensations: formData.compensations.filter((_, i) => i !== index)
		});
	};

	const showError = showErrors

	return (
		<div className="space-y-6" >
			<h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2" >
				<DollarSign className="w-5 h-5 text-blue-600" />
				Compensation Details
			</h2>

			< div className="space-y-4" >
				{
					formData.compensations.map((item, index) => (
						<CompensationItem
							key={index}
							item={item}
							onChange={(updated) => handleUpdateCompensation(index, updated)}
							onRemove={() => handleRemoveCompensation(index)}
							showError={showError}
						/>
					))
				}

				{
					formData.compensations.length < MAX_ADDITIONAL_COMPENSATION && (
						<button
							type="button"
							onClick={handleAddCompensation}
							className="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-blue-500 hover:text-blue-600 transition-colors duration-200 flex items-center justify-center gap-2"
						>
							<Plus className="w-4 h-4" />
							Add Compensation
						</button>
					)
				}
			</div>
		</div>
	);
}
