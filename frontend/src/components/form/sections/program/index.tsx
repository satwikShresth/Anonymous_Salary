import { GraduationCap, BookOpen } from 'lucide-react';
import { RadioGroup } from '../../../ui/radio';
import { MultiSelect } from '../../../ui/multiselect';
import type { JobData } from '../../../../types/job';
import { useMajors, useMinors } from '../../../../hooks/autocomplete';

interface ProgramSectionProps {
	formData: JobData;
	onChange: (data: Partial<JobData>) => void;
}

export function ProgramSection({ formData, onChange }: ProgramSectionProps) {
	const { data: majors, loading: loadingMajors } = useMajors();
	const { data: minors, loading: loadingMinors } = useMinors();
	return (
		<div className="space-y-6">
			<h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
				<GraduationCap className="w-5 h-5 text-blue-600" />
				Program Details (Optional)
			</h2>
			<div className="grid grid-cols-1 gap-6">
				<MultiSelect
					label="Majors"
					icon={<GraduationCap className="w-4 h-4 text-gray-500" />}
					options={majors}
					values={formData.majors}
					loading={loadingMajors}
					onChange={(values) => onChange({ majors: values })}
					placeholder="Add a major..."
				/>
				<MultiSelect
					label="Minors"
					icon={<BookOpen className="w-4 h-4 text-gray-500" />}
					options={minors}
					values={formData.minors}
					loading={loadingMinors}
					onChange={(values) => onChange({ minors: values })}
					placeholder="Add a minor..."
				/>
				<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
					<RadioGroup
						label="Co-op Year"
						options={['1st', '2nd', '3rd']}
						value={formData.coopYear}
						onChange={(value) => onChange({ coopYear: value as JobData['coopYear'] })}
						type="year"
					/>
					<RadioGroup
						label="Co-op Cycle"
						options={['spring/summer', 'fall/winter']}
						value={formData.coopCycle}
						onChange={(value) => onChange({ coopCycle: value as JobData['coopCycle'] })}
						type="cycle"
					/>
					<RadioGroup
						label="Level"
						options={['undergraduate', 'graduate']}
						value={formData.level}
						onChange={(value) => onChange({ level: value as JobData['level'] })}
						type="level"
					/>
					<RadioGroup
						label="Source"
						options={['SCDC', 'external']}
						value={formData.source}
						onChange={(value) => onChange({ source: value as JobData['source'] })}
						type="source"
					/>
				</div>
			</div>
		</div>
	);
}
