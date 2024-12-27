<script>
	import { onMount } from 'svelte';
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
					<RadioGroup
						label="Level"
						apiEndpoint="/api/options/tiers"
						value={formData.level}
						onChange={(value) => (formData.level = value)}
					/>
				</div>
			</div>

			<div class="flex justify-between gap-6">
				<div class="flex-1">
					<MultiSelect label="Majors" onChange={(values) => (formData.majors = [...values])} />
				</div>
				<div class="flex-1">
					<MultiSelect label="Minors" onChange={(values) => (formData.minors = [...values])} />
				</div>
			</div>

			<div class="flex justify-between gap-6">
				<div class="flex-1">
					<RadioGroup
						label="Coop Cycle"
						apiEndpoint="/api/options/tiers"
						value={formData.coopCycle}
						onChange={(value) => (formData.coopCycle = value)}
					/>
				</div>
				<div class="flex-1">
					<RadioGroup
						label="Coop Year"
						apiEndpoint="/api/options/tiers"
						value={formData.coopYear}
						onChange={(value) => (formData.coopYear = value)}
					/>
				</div>
			</div>
		</div>
	</div>
</div>

