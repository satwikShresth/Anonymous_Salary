import { Building2, MapPin, Briefcase } from 'lucide-react';
import { AutocompleteInput } from '../../../ui/autocomplete';
import { RangeInput } from '../../../ui/rangeInput';
import { SuggestionModal } from '../../../ui/suggestionModal';
import type { JobData } from '../../../../types/job';
import { companies } from '../../../../data/companies';
import { positions } from '../../../../data/positions';
import { locations } from '../../../../data/locations';
import { RadioGroup } from '../../../ui/radio';
import { useSuggestionModal } from '../../../../hooks/useSuggestionModal';


interface CompanySectionProps {
	formData: JobData;
	onChange: (data: Partial<JobData>) => void;
}


export const suggestionConfigs = {
	company: {
		type: 'company',
		title: 'Suggest New Company',
		description: 'Please provide the name of the company you would like to add to our database.',
		icon: Building2,
		allowSuggestions: true,
	},
	position: {
		type: 'position',
		title: 'Suggest New Position',
		description: 'Please provide the job title you would like to add to our database.',
		icon: Briefcase,
		allowSuggestions: true,
	},
	location: {
		type: 'location',
		title: 'Location',
		description: 'Select a location from the list.',
		icon: MapPin,
		allowSuggestions: false,
	}
};

export function CompanySection({ formData, onChange }: CompanySectionProps) {
	const {
		isOpen,
		modalConfig,
		openModal,
		closeModal,
		handleSubmit
	} = useSuggestionModal();

	const handleSuggestion = (type: keyof typeof suggestionConfigs) => (_: string) => {
		const config = suggestionConfigs[type];
		if (!config.allowSuggestions) return;

		openModal({
			title: config.title,
			description: config.description
		}, (newValue) => {
			// Here you would typically send this to your backend
			console.log(`New ${type} suggestion:`, newValue);
			onChange({ [type === 'company' ? 'companyName' : type]: newValue });
		});
	};

	return (
		<div className="space-y-6">
			<h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
				<Building2 className="w-5 h-5 text-blue-600" />
				Company Information
			</h2>
			<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
				<AutocompleteInput
					config={suggestionConfigs.company}
					value={formData.companyName}
					onChange={(value) => onChange({ companyName: value })}
					options={companies}
					onSuggestion={handleSuggestion('company')}
				/>
				<AutocompleteInput
					config={suggestionConfigs.position}
					value={formData.position}
					onChange={(value) => onChange({ position: value })}
					options={positions}
					onSuggestion={handleSuggestion('position')}
				/>
				<AutocompleteInput
					config={suggestionConfigs.location}
					value={formData.location}
					onChange={(value) => onChange({ location: value })}
					options={locations}
				/>
				<RadioGroup
					label="Source"
					options={['SCDC', 'external']}
					value={formData.source}
					onChange={(value) => onChange({ source: value as JobData['source'] })}
					type="source"
				/>
				<RangeInput
					label="Weekly Hours"
					value={formData.workHours}
					min={20}
					max={80}
					onChange={(value) => onChange({ workHours: value })}
					icon="clock"
				/>
			</div>

			{isOpen && (
				<SuggestionModal
					isOpen={isOpen}
					onClose={closeModal}
					onSubmit={handleSubmit}
					title={modalConfig.title}
					description={modalConfig.description}
				/>
			)}
		</div>
	);
}
