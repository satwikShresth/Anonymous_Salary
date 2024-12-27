<script>
	import { onMount } from 'svelte';
	import AutoComplete from '$lib/client/components/AutoComplete.svelte';
	import SliderWithInput from '$lib/client/components/Slider.svelte';
	import MultiSelect from '$lib/client/components/MultiSelect.svelte';
	import RadioGroup from '$lib/client/components/RadioGroup.svelte';

	let { formData = $bindable() } = $props();
	let error = $state(null);

	$effect(() => {
		if (!formData) {
			console.warn('formData is not initialized yet');
		}
	});

	$inspect(formData);
</script>

<div class="px-4 py-12 sm:px-6 lg:px-8">
	<h2 class="mb-6 text-2xl font-bold text-gray-900">Comapny Information</h2>

	{#if error}
		<div class="mb-4 rounded-md bg-red-50 p-4 text-red-700">
			{error}
		</div>
	{/if}

	<div class="mx-auto w-full max-w-4xl rounded-lg bg-white p-6 shadow-sm">
		<div class="space-y-8">
			<div class="flex justify-between gap-6">
				<div class="flex-1">
					<AutoComplete
						label="Company"
						apiEndpoint="/api/options/countries"
						value={formData.company}
						onChange={(value) => (formData.company = value)}
					/>
				</div>
				<div class="flex-1">
					<AutoComplete
						label="Position"
						apiEndpoint="/api/options/countries"
						value={formData.position}
						onChange={(value) => (formData.postion = value)}
					/>
				</div>
			</div>

			<div class="flex justify-between gap-6">
				<div class="flex-1">
					<AutoComplete
						label="Location"
						apiEndpoint="/api/options/countries"
						value={formData.location}
						onChange={(value) => (formData.location = value)}
					/>
				</div>
				<div class="flex-1">
					<RadioGroup
						label="Source"
						apiEndpoint="/api/options/tiers"
						options={['hello', 'bellow']}
						value={formData.source}
						onChange={(value) => (formData.source = value)}
					/>
				</div>
			</div>

			<div class="mx-32 w-auto">
				<SliderWithInput
					label="Work Hours"
					min={20}
					max={80}
					value={formData.workHours}
					onChange={(value) => (formData.workHours = value)}
				/>
			</div>
		</div>
	</div>
</div>
