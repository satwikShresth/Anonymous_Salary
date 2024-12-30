<script>
	import FormNavigation from './Navigation.svelte';
	import FormProgress from './Progress.svelte';
	import CompanySection from './sections/Company.section.svelte';
	import ProgramSection from './sections/Program.section.svelte';
	import DecisionSection from './sections/Decision.section.svelte';
	import CompensationSection from './sections/Compensation.section.svelte';
	import Notification from '$lib/components/Notification.svelte';
	import { Building2, DollarSign, CheckCircle2, GraduationCap } from 'lucide-svelte';
	import { FormData } from './state/form.svelte';

	let { data } = $props();
	let { validValues } = data;
	let validate = $state(() => {});
	let currentStep = $state(1);
	let errors = $state([]);

	const stepTitles = [
		{ label: 'Company', icon: Building2, component: CompanySection },
		{ label: 'Compensation', icon: DollarSign, component: CompensationSection },
		{ label: 'Decision', icon: CheckCircle2, component: DecisionSection },
		{ label: 'Program', icon: GraduationCap, component: ProgramSection },
		{ label: 'Preview', icon: GraduationCap, component: ProgramSection }
	];
	const totalSteps = stepTitles.length;
	let error = $state(null);

	const formData = new FormData(validValues);

	//$effect.pre(() => {
	//	console.log('getting formData form local storage');
	//	const savedFormData = localStorage.getItem('formData');
	//	if (savedFormData) {
	//		const parsedData = JSON.parse(savedFormData);
	//		Object.keys(formData).forEach((key) => {
	//			formData[key] = parsedData[key];
	//		});
	//	}
	//
	//	const savedFormStep = localStorage.getItem('formStep');
	//	console.log(savedFormStep);
	//	if (savedFormStep) {
	//		currentStep = Number(savedFormStep);
	//	}
	//});
	//
	//$effect(() => {
	//	console.log('setting formData to local storage');
	//	localStorage.setItem('formData', JSON.stringify(formData));
	//	localStorage.setItem('formStep', currentStep);
	//});

	$inspect(formData);

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

	function goToNextStep(label) {
		if (currentStep < totalSteps) {
			const result = validate(formData);
			if (result.isValid) {
				currentStep++;
				errors = [];
				return;
			}
			errors = result.errors;
		}
	}

	$inspect(errors);

	function onChange(updates) {
		if (updates.target) {
			const { name, value } = updates.target;

			handleSingleUpdate(name, value);
		} else {
			Object.entries(updates).forEach(([name, value]) => {
				handleSingleUpdate(name, value);
			});
		}
	}

	function handleSingleUpdate(name, value) {
		if (name in formData) {
			if (Array.isArray(formData[name])) {
				const arrayValue = Array.isArray(value)
					? value
					: value.split(',').map((item) => item.trim());
				formData[name] = arrayValue;
			} else if (name === 'workHours') {
				formData[name] = Number(value);
			} else {
				formData[name] = value;
			}
		}
	}
</script>

<div class="px-4 py-12 sm:px-6 lg:px-8">
	<Notification bind:errors />

	<form onsubmit={handleSubmit} class="mx-36 max-w-6xl space-y-8 rounded-xl bg-white p-8 shadow-lg">
		<FormProgress
			bind:currentStep
			stepTitles={stepTitles.map((item) => item.label)}
			onStepClick={goToStep}
			{errors}
		/>

		{#each stepTitles as item, idx}
			{#if idx + 1 === currentStep}
				<div class="space-y-6">
					<h2 class="flex items-center gap-2 pt-4 text-xl font-semibold text-gray-900">
						<item.icon class="h-8 w-8 text-blue-600" />
						{item.label} Details

						{#if error}
							<div class="mb-4 rounded-md bg-red-50 p-4 text-red-700">
								{error}
							</div>
						{/if}
					</h2>

					<div class="space-y-4 px-5">
						<item.component bind:validate {formData} {onChange} />
					</div>
				</div>
			{/if}
		{/each}

		{#if currentStep <= totalSteps}
			<FormNavigation
				{currentStep}
				{totalSteps}
				onPrevious={goToPreviousStep}
				onNext={goToNextStep}
			/>
		{/if}
	</form>
</div>
