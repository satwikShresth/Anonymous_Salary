<script>
	const { currentStep = $bindable(), totalSteps, onPrevious, onNext, onSubmit } = $props();
	const isPreviewStep = $derived(currentStep.value === totalSteps);
</script>

<div class="flex justify-between border-t border-gray-200 pt-6">
	{#if currentStep.value > 1}
		<button
			type="button"
			onclick={onPrevious}
			class="rounded-lg border border-gray-300 bg-white px-6 py-3 text-base font-medium text-gray-700 transition-colors duration-200 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
		>
			Previous
		</button>
	{/if}

	<div class="ml-auto">
		{#if isPreviewStep}
			<button
				type="submit"
				onclick={onSubmit}
				class="rounded-lg bg-green-400 px-6 py-3 font-medium text-white transition-colors duration-200 hover:bg-green-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
			>
				Submit
			</button>
		{:else}
			<button
				type="button"
				onclick={onNext}
				class="rounded-lg bg-blue-600 px-6 py-3 font-medium text-white transition-colors duration-200 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
			>
				Next
			</button>
		{/if}
	</div>
</div>
