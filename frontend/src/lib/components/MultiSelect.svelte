<script>
	import { onMount, onDestroy } from 'svelte';
	import { X } from 'lucide-svelte';
	import axios from 'axios';

	let {
		apiEndpoint = '/api/options/countries',
		queryDep = '',
		values = $bindable(['']),
		disabled = false,
		label = '',
		max = 5,
		icon = null,
		debounceMs = 300,
		...props
	} = $props();

	let isOpen = $state(false);
	let isOptionClickPending = $state(false);
	let inputValue = $state('');
	let options = $state([]);
	let filteredOptions = $derived(options.filter((value) => !values.includes(value)));
	let loading = $state(false);
	let debounceTimeout;

	const api = axios.create({
		baseURL: apiEndpoint,
		timeout: 5000
	});

	async function fetchOptions(query) {
		if (!query.trim()) {
			options = [];
			return;
		}

		try {
			loading = true;
			const params = { q: query, c: queryDep };
			const { data } = await api.get('', { params });

			options = Array.isArray(data) ? data.filter((option) => !values.includes(option)) : [];
		} catch (error) {
			console.error('Error fetching options: ', error);
			error = 'Error fetching options: ' + error;
			options = [];
		} finally {
			loading = false;
		}
	}

	function handleInputChange(e) {
		inputValue = e.target.value;
		isOpen = true;

		clearTimeout(debounceTimeout);
		debounceTimeout = setTimeout(() => {
			fetchOptions(inputValue);
		}, debounceMs);
	}

	function handleOptionClick(option) {
		values.push(option);
	}

	function handleOptionKeyDown(e, option) {
		if (e.key === 'Enter' || e.key === ' ') {
			e.preventDefault();
			handleOptionClick(option);
		}
	}

	function handleRemoveValue(valueToRemove) {
		values = values.filter((value) => value !== valueToRemove);
	}

	onDestroy(() => {
		clearTimeout(debounceTimeout);
	});
</script>

<div class="relative w-full">
	<span class="mb-1 block flex gap-2 font-medium font-semibold text-gray-700">
		{#if icon}
			<div class="pl-2 text-blue-600">
				{@render icon('')}
			</div>
		{/if}
		{label}
	</span>
	<div class="py-1">
		{#each values as value}
			<div class="flex inline-flex px-1 py-1">
				<span
					class="inline-flex items-center rounded-md border-transparent bg-blue-100 px-2 py-1 text-sm text-blue-800"
				>
					{value}
					<button
						type="button"
						onclick={() => handleRemoveValue(value)}
						class="ml-1 text-blue-600 hover:text-blue-800"
						aria-label={`Remove ${value}`}
					>
						<X />
					</button>
				</span>
			</div>
		{/each}
	</div>

	{#if values.length < 5}
		<div
			class="min-h-[42px] rounded-md border border-gray-300 p-1 focus-within:border-transparent focus-within:ring-2 focus-within:ring-blue-500"
		>
			<div class="flex flex-wrap gap-1">
				<input
					type="text"
					bind:value={inputValue}
					oninput={handleInputChange}
					onfocusin={() => (isOpen = true)}
					onfocusout={() => {
						inputValue = '';
						isOpen = false;
					}}
					class="min-w-[120px] flex-1 border-transparent p-1 outline-none"
					placeholder="Type to search..."
					aria-expanded={isOpen}
					aria-controls="multiselect-options"
					role="combobox"
					{disabled}
				/>
			</div>
		</div>
		{#if isOpen || isOptionClickPending}
			<div
				id="multiselect-options"
				class="absolute z-10 mt-1 w-full rounded-md border border-transparent bg-white shadow-lg"
				role="listbox"
			>
				{#if loading}
					<div class="flex justify-center p-2">
						<div
							class="h-5 w-5 animate-spin rounded-full border-2 border-blue-500 border-t-transparent"
						></div>
					</div>
				{:else if filteredOptions.length > 0}
					{#each filteredOptions as option}
						<button
							type="button"
							onclick={() => handleOptionClick(option)}
							onkeydown={(e) => handleOptionKeyDown(e, option)}
							onmouseenter={() => {
								isOptionClickPending = true;
							}}
							onmouseleave={() => {
								isOptionClickPending = false;
							}}
							class="w-full cursor-pointer px-4 py-2 text-left hover:bg-gray-100"
							role="option"
							aria-selected="false"
						>
							{option}
						</button>
					{/each}
				{/if}
			</div>
		{/if}
	{/if}
</div>
