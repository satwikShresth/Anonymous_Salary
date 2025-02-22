<script>
	import axios from 'axios';
	import { onMount } from 'svelte';

	let {
		apiEndpoint = '/api/options/tiers',
		value = $bindable(''),
		label = '',
		icon = null,
		...props
	} = $props();

	let options = $state([]);
	let loading = $state(true);
	let error = $state(null);

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

<div class="w-auto">
	<span class="block flex gap-2 font-medium font-semibold text-gray-700">
		{#if icon}
			<div class="pl-2 text-blue-600">
				{@render icon('')}
			</div>
		{/if}
		{label}
	</span>
	<div class="grid grid-cols-2 gap-2 py-1">
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
			{#each options as option, idx}
				<label
					class=" flex cursor-pointer items-center justify-center rounded-lg px-5 py-3 text-base
            transition-colors duration-200 ease-in-out
            {value === option
						? 'bg-blue-600 font-medium text-white shadow-md'
						: 'bg-gray-100 text-gray-700 hover:bg-gray-200'}"
				>
					<input
						type="radio"
						bind:value
						id={`radio-${option}-${idx}`}
						class="hidden"
						checked={value === option}
						onchange={() => {
							value = option;
						}}
						{...props}
					/>
					<span>{option}</span>
				</label>
			{/each}
		{:else}
			<div class="col-span-2 py-4 text-center text-gray-500">No options available</div>
		{/if}
	</div>
</div>
