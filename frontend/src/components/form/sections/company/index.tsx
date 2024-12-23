import { Building2, MapPin, Briefcase } from 'lucide-react';
import { AutocompleteInput } from '../../../ui/autocomplete';
import { RangeInput } from '../../../ui/rangeInput';
import type { JobData } from '../../../../types/job';
import { RadioGroup } from '../../../ui/radio';
import { useCompanies, useLocations, usePositions } from '../../../../hooks/autocomplete';
import { useSource } from '../../../../hooks/radio';

export const suggestionConfigs = {
	company: {
		type: 'company',
		title: 'Company Name',
		description: 'Please provide the name of the company you would like to add to our database.',
		icon: Building2,
		allowSuggestions: true,
	},
	position: {
		type: 'position',
		title: 'Position',
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

interface CompanySectionProps {
	formData: JobData;
	onChange: (data: Partial<JobData>) => void;
}

export function CompanySection({ formData, onChange }: CompanySectionProps) {

	const { data: companies, loading: loadingCompanies, setData: setCompanies, fetchOptions: fetchCompanies, options: companyOptions } = useCompanies();

	const { data: position, loading: loadingPositions, setData: setPositions, fetchOptions: fetchPositions, options: positionOptions } = usePositions();

	const { loading: loadingLocations, fetchOptions: fetchLocations, options: locationOptions } = useLocations();

	const { data: sources } = useSource();

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
					fetchOptions={fetchCompanies}
					options={companyOptions} // Use the options from the hook
					loading={loadingCompanies}
					onSuggestion={(value: string) => {
						onChange({ companyName: value });
						if (!companies.includes(value)) {
							setCompanies([...companies, value]);
						}
					}}
				/>

				<AutocompleteInput
					config={suggestionConfigs.position}
					value={formData.position}
					onChange={(value) => onChange({ position: value })}
					fetchOptions={(item) => fetchPositions(formData.companyName, item)}
					options={positionOptions} // Use the options from the hook
					loading={loadingPositions}
					onSuggestion={(value: string) => {
						onChange({ position: value });
						if (!position.includes(value)) {
							setPositions([...position, value]);
						}
					}}
				/>

				<AutocompleteInput
					config={suggestionConfigs.location}
					value={formData.location}
					onChange={(value) => onChange({ location: value })}
					fetchOptions={fetchLocations}
					options={locationOptions}
					loading={loadingLocations}
				/>

				<RadioGroup
					label="Source"
					options={sources}
					value={formData.source}
					onChange={(value) => onChange({ source: value as JobData['source'] })}
					type="source"
				/>
				<RangeInput
					label="Weekly Hours"
					value={formData.workHours}
					onChange={(value) => onChange({ workHours: value })}
					step={1}
					min={0}
					max={80}
					icon="clock"
				/>
			</div>
		</div>
	);
}
