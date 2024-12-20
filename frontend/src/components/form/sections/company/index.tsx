import { Building2, MapPin, Briefcase } from 'lucide-react';
import { AutocompleteInput } from '../../../ui/autocomplete';
import { RangeInput } from '../../../ui/rangeInput';
import type { JobData } from '../../../../types/job';
import { companies } from '../../../../data/companies';
import { positions } from '../../../../data/positions';
import { locations } from '../../../../data/locations';
import { RadioGroup } from '../../../ui/radio';

interface CompanySectionProps {
	formData: JobData;
	onChange: (data: Partial<JobData>) => void;
}

export function CompanySection({ formData, onChange }: CompanySectionProps) {
	return (
		<div className="space-y-6">
			<h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
				<Building2 className="w-5 h-5 text-blue-600" />
				Company Information
			</h2>
			<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
				<AutocompleteInput
					label="Company Name"
					icon={<Building2 className="w-4 h-4 text-gray-500" />}
					options={companies}
					value={formData.companyName}
					onChange={(value) => onChange({ companyName: value })}
					placeholder="Select company..."
				/>
				<AutocompleteInput
					label="Position"
					icon={<Briefcase className="w-4 h-4 text-gray-500" />}
					options={positions}
					value={formData.position}
					onChange={(value) => onChange({ position: value })}
					placeholder="Select position..."
				/>
				<AutocompleteInput
					label="Location"
					icon={<MapPin className="w-4 h-4 text-gray-500" />}
					options={locations}
					value={formData.location}
					onChange={(value) => onChange({ location: value })}
					placeholder="Select location..."
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
		</div>
	);
}
