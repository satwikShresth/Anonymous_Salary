<script>
	import axios from 'axios';
	import { onMount } from 'svelte';

	const {
		apiEndpoint = '/api/options/tiers',
		value = '',
		onChange = (val) => {},
		label = ''
	} = $props();

	let options = $state([]);
	let loading = $state(true);
	let error = $state(null);
	const groupName = `radio-group-${Math.random().toString(36).slice(2)}`;

	const api = axios.create({
		baseURL: apiEndpoint,
		timeout: 5000
	});

	async function fetchOptions() {
		try {
			loading = true;
			const { data } = await api.get('');
			options = Array.isArray(data) ? data : [];
		} catch (err) {
			console.error('Error fetching options:', err);
			error = 'Failed to load options';
			options = [];
		} finally {
			loading = false;
		}
	}

	onMount(() => {
		fetchOptions();
	});
</script>

<div class="gap-4">
	<span class="mb-3 font-medium text-gray-700">
		{label}
	</span>
	<div class="grid grid-cols-2 gap-2">
		{#if loading}
			<div class="col-span-2 flex justify-center py-4">
				<div
					class="h-6 w-6 animate-spin rounded-full border-2 border-blue-500 border-t-transparent"
				></div>
			</div>
		{:else if error}
			<div class="col-span-2 py-4 text-center text-red-600">
				{error}
			</div>
		{:else if options.length > 0}
			{#each options as option}
				<label
					class="flex cursor-pointer items-center justify-center rounded-lg px-6 py-3 text-base
            transition-colors duration-200 ease-in-out
            {value === option.value
						? 'bg-blue-600 font-medium text-white shadow-md'
						: 'bg-gray-100 text-gray-700 hover:bg-gray-200'}"
				>
					<input
						type="radio"
						name={groupName}
						class="hidden"
						checked={value === option.value}
						onchange={() => onChange(option.value)}
					/>
					<span>{option.label}</span>
				</label>
			{/each}
		{:else}
			<div class="col-span-2 py-4 text-center text-gray-500">No options available</div>
		{/if}
	</div>
</div>

