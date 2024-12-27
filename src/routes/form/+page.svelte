<script>
	import FormNavigation from './Navigation.svelte';
	import FormProgress from './Progress.svelte';
	import CompanySection from './sections/Company.section.svelte';
	import ProgramSection from './sections/Program.section.svelte';
	import CompensationSection from './sections/Compensation.section.svelte';

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

	const stepTitles = [
		{ label: 'Company', component: CompanySection },
		{ label: 'Program', component: ProgramSection },
		{ label: 'Compensation', component: CompensationSection }
	];
	let currentStep = $state(1);
	const errors = $state({});

	const totalSteps = stepTitles.length;

	function handleSubmit(event) {
		event.preventDefault();
	}

	function goToStep(step) {
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
	<form onsubmit={handleSubmit} class="mx-36 max-w-6xl space-y-8 rounded-xl bg-white p-8 shadow-lg">
		<h2 class="mb-6 text-2xl font-bold text-gray-900">Anonymous Salary Form</h2>

		<FormProgress
			{currentStep}
			stepTitles={stepTitles.map((item) => item.label)}
			onStepClick={goToStep}
			{errors}
		/>

		{#each stepTitles as item, idx}
			{#if idx + 1 == currentStep}
				<item.component bind:formData />
			{/if}
		{/each}

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
