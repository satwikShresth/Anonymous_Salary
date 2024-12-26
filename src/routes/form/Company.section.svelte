<script>
	import { onMount } from 'svelte';
	import AutoComplete from '$lib/client/components/AutoComplete.svelte';
	import SliderWithInput from '$lib/client/components/Slider.svelte';
	import MultiSelect from '$lib/client/components/MultiSelect.svelte';
	import RadioGroup from '$lib/client/components/RadioGroup.svelte';

	let { formData = $bindable() } = $props();

	let loading = $state(true);
	let error = $state(null);
	let countries = $state([]);
	let interests = $state([]);
	let subscriptionOptions = $state([]);

	$effect(() => {
		if (!formData) {
			console.warn('formData is not initialized yet');
		}
	});

	onMount(async () => {
		try {
			loading = true;
			const response = await fetch('/api/options');
			if (!response.ok) {
				throw new Error('Failed to fetch options');
			}
			const data = await response.json();
			countries = data.countries;
			interests = data.interests;
			subscriptionOptions = data.subscriptionOptions;
		} catch (error) {
			console.error('Failed to fetch options:', error);
			error = error.message;
		} finally {
			loading = false;
		}
	});
</script>

<div class="px-4 py-12 sm:px-6 lg:px-8">
	<h2 class="mb-6 text-2xl font-bold text-gray-900">Comapny Information</h2>

	{#if error}
		<div class="mb-4 rounded-md bg-red-50 p-4 text-red-700">
			{error}
		</div>
	{/if}

	{#if loading}
		<div class="flex justify-center py-8">
			<div
				class="h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"
			></div>
		</div>
	{:else}
		<div class="space-y-6">
			<AutoComplete
				label="Country"
				options={countries}
				value={formData.country}
				onChange={(value) => (formData.country = value)}
				onAddOption={(value) => (countries = [...countries, value])}
			/>

			<SliderWithInput
				label="Age"
				min={18}
				max={100}
				value={formData.age}
				onChange={(value) => (formData.age = value)}
			/>

			<MultiSelect
				label="Interests"
				options={interests}
				values={formData.interests}
				onChange={(value) => {
					formData.interests = $state.snapshot(value);
				}}
				onAddOption={(value) => (interests = [...interests, value])}
			/>

			<RadioGroup
				label="Subscription Plan"
				options={subscriptionOptions}
				value={formData.subscription}
				onChange={(value) => (formData.subscription = value)}
			/>
		</div>
	{/if}
</div>
