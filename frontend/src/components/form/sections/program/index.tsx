import { GraduationCap, BookOpen } from 'lucide-react';
import { RadioGroup } from '../../../ui/radio';
import { MultiSelect } from '../../../ui/multiselect';
import type { JobData } from '../../../../types/job';
import { useMajors, useMinors } from '../../../../hooks/autocomplete';
import { fetchCoopCyles, useCoopCycles, useCoopYears, useProgram } from '../../../../hooks/radio';

interface ProgramSectionProps {
	formData: JobData;
	onChange: (data: Partial<JobData>) => void;
}

export const ProgramSection = ({ formData, onChange }: ProgramSectionProps) => {
	const {
		loading: loadingMajors,
		fetchOptions: fetchMajors,
	} = useMajors();

	const {
		loading: loadingMinors,
		fetchOptions: fetchMinors,
	} = useMinors();

	const { data: cycles } = useCoopCycles();
	const { data: program } = useProgram();
	const { data: coopYear } = useCoopYears();

	return (
		<div className="space-y-6">
			<h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
				<GraduationCap className="w-5 h-5 text-blue-600" />
				Program Details
			</h2>
			<div className="grid grid-cols-1 gap-6">
				<RadioGroup
					label="Level"
					options={program}
					value={formData.level}
					onChange={(value) => onChange({ level: value as JobData['level'] })}
					type="level"
				/>
				<MultiSelect
					label="Majors"
					icon={<GraduationCap className="w-4 h-4 text-gray-500" />}
					values={formData.majors}
					onChange={(values) => onChange({ majors: values })}
					fetchOptions={(value) => fetchMajors(formData.level, value)}
					required
					maxItems={5}
					placeholder="Add a major..."
					loading={loadingMajors}
				/>
				<MultiSelect
					label="Minors (optional)"
					icon={<BookOpen className="w-4 h-4 text-gray-500" />}
					values={formData.minors}
					onChange={(values) => onChange({ minors: values })}
					fetchOptions={(value) => fetchMinors(formData.level, value)}
					placeholder="Add a minor"
					loading={loadingMinors}
				/>
				<RadioGroup
					label="Co-op Cycle"
					options={cycles}
					value={formData.coopCycle}
					onChange={(value) => onChange({ coopCycle: value as JobData['coopCycle'] })}
					type="cycle"
				/>
				<RadioGroup
					label="Co-op Year"
					options={coopYear}
					value={formData.coopYear}
					onChange={(value) => onChange({ coopYear: value as JobData['coopYear'] })}
					type="year"
				/>
			</div>
		</div>
	);
}
