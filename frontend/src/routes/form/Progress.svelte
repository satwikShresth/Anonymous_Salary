<script>
	import { Check } from 'lucide-svelte';
	import { Tween } from 'svelte/motion';
	import { cubicOut } from 'svelte/easing';

	let progress = new Tween(0, {
		duration: 600,
		easing: cubicOut
	});
	const { currentStep = $bindable(), onStepClick, stepTitles, errors } = $props();

	const hasErrors = $derived(Object.keys(errors).length > 0);

	$effect(() => {
		progress.target = (currentStep.value - 1) / (stepTitles.length - 1);
	});

	function getStepClasses(stepNumber) {
		const isComplete = currentStep.value > stepNumber;
		const isCurrent = currentStep.value === stepNumber;
		const hasError = hasErrors && isCurrent;
		const badgeColor = isComplete
			? 'bg-green-500 text-white'
			: isCurrent
				? hasError
					? 'bg-red-500 text-white'
					: 'bg-blue-600 text-white'
				: 'bg-gray-100 text-gray-400';

		return ` w-8 h-8 rounded-full flex items-center justify-center font-semibold text-sm transition-colors duration-200 ${badgeColor}`;
	}

	function getTitleClasses(stepNumber) {
		const isCurrent = currentStep.value === stepNumber;
		const hasError = hasErrors && isCurrent;

		return `text-sm mt-1 ${
			isCurrent
				? hasError
					? 'text-red-600 font-medium'
					: 'text-blue-600 font-medium'
				: 'text-gray-500'
		}`;
	}
</script>

<div class="mb-8 w-[100%] px-7">
	<div class="mb-2 flex justify-between">
		{#each stepTitles as _, index}
			{@const stepNumber = index + 1}
			{@const isComplete = currentStep.value > stepNumber}
			<button
				type="button"
				onclick={() => onStepClick(stepNumber)}
				class="flex flex-col items-center"
			>
				<div class={getStepClasses(stepNumber)}>
					{#if isComplete}
						<Check class="h-4 w-4" />
					{:else}
						{stepNumber}
					{/if}
				</div>
				<span class={getTitleClasses(stepNumber)}>
					{stepTitles[index]}
				</span>
			</button>
		{/each}
	</div>
	<div class="relative mt-4">
		<progress
			class="absolute left-0 top-0 h-2 w-full rounded-xl bg-gray-200"
			value={progress.current}
		></progress>
	</div>
</div>

<style>
	progress {
		display: block;
		width: 100%;
		height: 8px; /* Adjust height */
		border-radius: 9999px; /* Fully rounded edges */
		overflow: hidden; /* Ensure inner progress doesn't spill outside rounded edges */
		background-color: #e5e7eb; /* Tailwind gray-200 equivalent */
		box-shadow: inset 0 0 4px rgba(0, 0, 0, 0.1); /* Subtle inset shadow */
	}

	progress::-webkit-progress-bar {
		background-color: #e5e7eb; /* Background color */
		border-radius: 9999px; /* Consistent rounded edges */
	}

	progress::-webkit-progress-value {
		background-color: #3b82f6; /* Tailwind blue-500 */
		border-radius: 9999px; /* Rounded edges */
	}

	progress::-moz-progress-bar {
		background-color: #3b82f6; /* Tailwind blue-500 */
		border-radius: 9999px; /* Rounded edges */
	}
</style>
