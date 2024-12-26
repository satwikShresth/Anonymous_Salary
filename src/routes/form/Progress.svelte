<script lang="ts">
	import { Check } from 'lucide-svelte';
	const { currentStep, totalSteps, onStepClick, stepTitles, errors } = $props();

	const hasErrors = $derived(Object.keys(errors).length > 0);
	const progressWidth = $derived(`${((currentStep - 1) / (totalSteps - 1)) * 100}%`);

	function getStepClasses(stepNumber: number) {
		const isComplete = currentStep > stepNumber;
		const isCurrent = currentStep === stepNumber;
		const hasError = hasErrors && isCurrent;

		return `
      w-8 h-8 rounded-full flex items-center justify-center font-semibold text-sm 
      transition-colors duration-200 
      ${
				isComplete
					? 'bg-green-500 text-white'
					: isCurrent
						? hasError
							? 'bg-red-500 text-white'
							: 'bg-blue-600 text-white'
						: 'bg-gray-100 text-gray-400'
			}
    `;
	}

	function getTitleClasses(stepNumber: number) {
		const isCurrent = currentStep === stepNumber;
		const hasError = hasErrors && isCurrent;

		return `text-xs mt-1 ${
			isCurrent
				? hasError
					? 'text-red-600 font-medium'
					: 'text-blue-600 font-medium'
				: 'text-gray-500'
		}`;
	}
</script>

<div class="mb-8">
	<div class="mb-2 flex justify-between">
		{#each Array(totalSteps) as _, index}
			{@const stepNumber = index + 1}
			{@const isComplete = currentStep > stepNumber}
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
		<div class="absolute left-0 top-0 h-1 w-full rounded bg-gray-200">
			<div
				class="absolute left-0 top-0 h-full rounded bg-blue-600 transition-all duration-300"
				style="width: {progressWidth}"
			></div>
		</div>
	</div>
</div>
