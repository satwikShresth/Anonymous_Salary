import { Check } from 'lucide-react';

interface FormProgressProps {
	currentStep: number;
	totalSteps: number;
	onStepClick: (step: number) => void;
	stepTitles: string[];
	errors: Record<string, string>;
}

export function FormProgress({
	currentStep,
	totalSteps,
	onStepClick,
	stepTitles,
	errors
}: FormProgressProps) {
	const hasErrors = Object.keys(errors).length > 0;

	return (
		<div className="mb-8">
			<div className="flex justify-between mb-2">
				{Array.from({ length: totalSteps }).map((_, index) => {
					const stepNumber = index + 1;
					const isComplete = currentStep > stepNumber;
					const isCurrent = currentStep === stepNumber;
					const hasError = hasErrors && isCurrent;

					return (
						<button
							key={index}
							type="button"
							onClick={() => onStepClick(stepNumber)}
							className="flex flex-col items-center"
						>
							<div className={`
                w-8 h-8 rounded-full flex items-center justify-center font-semibold text-sm 
                transition-colors duration-200 
                ${isComplete
									? 'bg-green-500 text-white'
									: isCurrent
										? hasError
											? 'bg-red-500 text-white'
											: 'bg-blue-600 text-white'
										: 'bg-gray-100 text-gray-400'
								}
              `}>
								{isComplete ? <Check className="w-4 h-4" /> : stepNumber}
							</div>
							<span className={`text-xs mt-1 ${isCurrent
								? hasError
									? 'text-red-600 font-medium'
									: 'text-blue-600 font-medium'
								: 'text-gray-500'
								}`}>
								{stepTitles[index]}
							</span>
						</button>
					);
				})}
			</div>
			<div className="relative mt-4">
				<div className="absolute top-0 left-0 h-1 bg-gray-200 w-full rounded">
					<div
						className="absolute top-0 left-0 h-full bg-blue-600 rounded transition-all duration-300"
						style={{ width: `${((currentStep - 1) / (totalSteps - 1)) * 100}%` }}
					/>
				</div>
			</div>
		</div>
	);
}
