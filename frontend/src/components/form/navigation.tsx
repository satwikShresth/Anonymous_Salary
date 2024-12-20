
interface FormNavigationProps {
	currentStep: number;
	totalSteps: number;
	onPrevious: () => void;
	onNext: () => void;
}

export function FormNavigation({ currentStep, totalSteps, onPrevious, onNext }: FormNavigationProps) {
	const isPreviewStep = currentStep === totalSteps;

	return (
		<div className="flex justify-between pt-6 border-t border-gray-200">
			{currentStep > 1 && (
				<button
					type="button"
					onClick={onPrevious}
					className="px-6 py-3 border border-gray-300 rounded-lg text-base font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
				>
					Previous
				</button>
			)}
			<div className="ml-auto">
				{isPreviewStep ? (
					<button
						type="submit"
						className="px-6 py-3 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors duration-200"
					>
						Submit
					</button>
				) : (
					<button
						type="button"
						onClick={onNext}
						className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
					>
						Next
					</button>
				)}
			</div>
		</div>
	);
}
