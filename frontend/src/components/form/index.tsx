import { defaultJobData, type JobData } from '../../types/job';
import { CompensationSection } from './sections/compensation';
import { CompanySection } from './sections/company';
import { ProgramSection } from './sections/program';
import { PreviewSection } from './sections/preview';
import { FormProgress } from './progress';
import { FormNavigation } from './navigation';
import { useFormSteps } from '../../hooks/useFormSteps';
import { useFormState } from '../../hooks/useFormStates';
import { DecisionSection } from './sections/decision';

interface JobFormProps {
	onSubmit: (data: JobData) => void;
}

const stepTitles = ['Company', 'Compensation', 'Decision', 'Program', 'Preview'];

export function JobForm({ onSubmit }: JobFormProps) {
	const {
		formData,
		updateFormData,
		resetFormData
	} = useFormState(defaultJobData);

	const {
		currentStep,
		totalSteps,
		errors,
		goToStep,
		goToNextStep,
		goToPreviousStep,
		clearStepState
	} = useFormSteps(5);

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
	};

	const handleFinalSubmit = () => {
		onSubmit(formData);
		resetFormData();
		clearStepState();
		goToStep(1, defaultJobData);
	};

	const renderStepContent = () => {
		switch (currentStep) {
			case 1:
				return <CompanySection formData={formData} onChange={updateFormData} />;
			case 2:
				return <CompensationSection formData={formData} onChange={updateFormData} />;
			case 3:
				return <DecisionSection formData={formData} onChange={updateFormData} />;
			case 4:
				return <ProgramSection formData={formData} onChange={updateFormData} />;
			case 5:
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
