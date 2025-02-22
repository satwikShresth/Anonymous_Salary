<script>
	import FormNavigation from './Navigation.svelte';
	import FormProgress from './Progress.svelte';
	import CompanySection from './sections/Company.section.svelte';
	import ProgramSection from './sections/Program.section.svelte';
	import DecisionSection from './sections/Decision.section.svelte';
	import CompensationSection from './sections/Compensation.section.svelte';
	import PreviewSection from './sections/Preview.section.svelte';
	import Notification from '$lib/components/Notification.svelte';
	import { Building2, DollarSign, CheckCircle2, GraduationCap } from 'lucide-svelte';
	import { FormData } from './state/form.svelte';
	import { localStore } from '$lib/LocalStore.svelte';
	import { browser } from '$app/environment';
	import axios from 'axios';

	let { data } = $props();
	let { validValues } = data;
	let validate = $state(() => {});
	let currStep = localStore('form:currStep', 1);
	let errors = $state([]);

	const stepTitles = [
		{ label: 'Company', icon: Building2, component: CompanySection },
		{ label: 'Compensation', icon: DollarSign, component: CompensationSection },
		{ label: 'Decision', icon: CheckCircle2, component: DecisionSection },
		{ label: 'Program', icon: GraduationCap, component: ProgramSection },
		{ label: 'Preview', icon: GraduationCap, component: PreviewSection }
	];
	const totalSteps = stepTitles.length;
	let error = $state(null);

	const formData = FormData(validValues);

	function handleSubmit(event) {
		event.preventDefault();
	}

	async function onSubmit() {
		try {
			await axios.post('api/v1/form/submit', formData.finalData, {
				headers: {
					'Content-Type': 'application/json'
				}
			});

			//formData.clear();
			//currStep.clear();

			//if (browser) {
			//	location.reload();
			//}
		} catch (err) {
			const errorMessages = err.response?.data;
			console.error(errorMessages);
			errors.push(`Error: ${JSON.stringify(errorMessages)}`);
		}
	}

	function goToStep(step) {
		currStep.value = step;
	}

	function onPrevious() {
		if (currStep.value > 1) {
			currStep.value--;
		}
	}

	function onNext(label) {
		if (currStep.value < totalSteps) {
			const result = validate(formData);
			if (result.isValid) {
				currStep.value++;
				errors = [];
				return;
			}
			errors = result.errors;
		}
	}

	if (browser) {
		window.onerror = (message) => {
			if (!errors.includes(message)) {
				errors.push(message);
			}
		};
	}
</script>

<div class="px-4 py-12 sm:px-6 lg:px-8">
	<Notification bind:errors />

	<form onsubmit={handleSubmit} class="mx-36 max-w-6xl space-y-8 rounded-xl bg-white p-8 shadow-lg">
		<FormProgress
			bind:currentStep={currStep}
			stepTitles={stepTitles.map((item) => item.label)}
			onStepClick={goToStep}
			{errors}
		/>

		{#each stepTitles as item, idx}
			{#if idx + 1 === currStep.value}
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
						<item.component bind:validate {formData} {validValues} />
					</div>
				</div>
			{/if}
		{/each}

		{#if currStep.value <= totalSteps}
			<FormNavigation bind:currentStep={currStep} {totalSteps} {onPrevious} {onNext} {onSubmit} />
		{/if}
	</form>
</div>
