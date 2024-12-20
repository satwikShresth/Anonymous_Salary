import type { JobData } from '../../types/job';
import { CompensationSection } from './sections/compensation';
import { CompanySection } from './sections/company';
import { ProgramSection } from './sections/program';
import { PreviewSection } from './sections/preview';
import { FormProgress } from './progress';
import { FormNavigation } from './navigation';
import { useFormSteps } from '../../hooks/useFormSteps';
import { usePersistedFormState } from '../../hooks/usePersistantFormState';

interface JobFormProps {
	onSubmit: (data: JobData) => void;
}

const initialFormData: JobData = {
	companyName: '',
	position: '',
	majors: [],
	minors: [],
	salary: 50,
	salaryNA: false,
	location: '',
	workHours: 40,
	coopYear: '1st',
	coopCycle: 'spring/summer',
	compensations: [],
	level: 'undergraduate',
	source: 'SCDC'
};

const stepTitles = ['Company', 'Compensation', 'Program', 'Preview'];

export function JobForm({ onSubmit }: JobFormProps) {
	const {
		formData,
		setFormData,
		clearSavedState
	} = usePersistedFormState(initialFormData);

	const {
		currentStep,
		totalSteps,
		errors,
		goToStep,
		goToNextStep,
		goToPreviousStep,
		clearStepState
	} = useFormSteps(4);

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
	};

	const handleFinalSubmit = () => {
		onSubmit(formData);
		clearSavedState();
		clearStepState();
		setFormData(initialFormData);
		goToStep(1, initialFormData);
	};

	const updateFormData = (data: Partial<JobData>) => {
		setFormData(prev => ({ ...prev, ...data }));
	};

	const renderStepContent = () => {
		switch (currentStep) {
			case 1:
				return <CompanySection formData={formData} onChange={updateFormData} />;
			case 2:
				return <CompensationSection formData={formData} onChange={updateFormData} />;
			case 3:
				return <ProgramSection formData={formData} onChange={updateFormData} />;
			case 4:
				return (
					<PreviewSection
						formData={formData}
						onSubmit={handleFinalSubmit}
						onBack={() => goToPreviousStep()}
					/>
				);
			default:
				return null;
		}
	};

	return (
		<form onSubmit={handleSubmit} className="space-y-8 bg-white p-8 rounded-xl shadow-lg max-w-6xl mx-auto">
			<FormProgress
				currentStep={currentStep}
				totalSteps={totalSteps}
				stepTitles={stepTitles}
				onStepClick={(step) => goToStep(step, formData)}
				errors={errors}
			/>
			{renderStepContent()}
			{currentStep < totalSteps && (
				<FormNavigation
					currentStep={currentStep}
					totalSteps={totalSteps}
					onPrevious={goToPreviousStep}
					onNext={() => goToNextStep(formData)}
				/>
			)}
		</form>
	);
}
