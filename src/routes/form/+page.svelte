<script>
	import FormNavigation from './Navigation.svelte';
	import FormProgress from './Progress.svelte';
	import CompanySection from './Company.section.svelte';

	let formData = $state({
		companyName: '',
		position: '',
		majors: [],
		minors: [],
		location: '',
		workHours: 0,
		coopYear: '',
		coopCycle: '',
		compensations: [],
		level: '',
		source: '',
		offerStatus: '',
		decision: '',
		decisionReason: '',
		otherNotes: ''
	});

	let currentStep = $state(1);
	const errors = $state({});
	const totalSteps = 3;
	const stepTitles = ['Company Information', 'Position Details', 'Offer Details'];

	function handleSubmit(event) {
		event.preventDefault();
		// Handle form submission
	}

	function goToStep(step) {
		// Add validation logic if needed
		currentStep = step;
	}

	function goToPreviousStep() {
		if (currentStep > 1) {
			currentStep--;
		}
	}

	function goToNextStep() {
		if (currentStep < totalSteps) {
			currentStep++;
		}
	}
</script>

<div class="px-4 py-12 sm:px-6 lg:px-8">
	<h2 class="mb-6 text-2xl font-bold text-gray-900">Profile Setup</h2>
	<form
		onsubmit={handleSubmit}
		class="mx-auto max-w-6xl space-y-8 rounded-xl bg-white p-8 shadow-lg"
	>
		<FormProgress {currentStep} {totalSteps} {stepTitles} onStepClick={goToStep} {errors} />
		{#if currentStep === 1}
			<CompanySection bind:formData />
		{:else if currentStep === 2}
			<div>Step 2 Content</div>
		{:else if currentStep === 3}
			<div>Step 3 Content</div>
		{/if}

		{#if currentStep < totalSteps}
			<FormNavigation
				{currentStep}
				{totalSteps}
				onPrevious={goToPreviousStep}
				onNext={goToNextStep}
			/>
		{/if}
	</form>
</div>
