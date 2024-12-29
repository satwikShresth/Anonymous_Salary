<script>
	import { onDestroy } from 'svelte';
	import axios from 'axios';

	const {
		apiEndpoint = '/api/options/countries',
		value = '',
		onChange = (val) => {},
		label = '',
		debounceMs = 300
	} = $props();

	let isOpen = $state(false);
	let inputValue = $state(value);
	let lastSetValue = $state(value);
	let filteredOptions = $state([]);
	let loading = $state(false);
	let hasFetched = $state(false);
	let isOptionClickPending = $state(false);
	let debounceTimeout;

	const api = axios.create({
		baseURL: apiEndpoint,
		timeout: 500
	});

	async function fetchOptions(query) {
		if (!query.trim()) {
			filteredOptions = [];
			hasFetched = false;
			return;
		}

		try {
			loading = true;
			hasFetched = false;
			const { data } = await api.get('', {
				params: { q: query }
			});
			filteredOptions = Array.isArray(data) ? data : [];
		} catch (error) {
			console.error('Error fetching options:', error);
			filteredOptions = [];
		} finally {
			loading = false;
			hasFetched = true;
		}
	}

	function handleInputChange(e) {
		inputValue = e.target.value;
		clearTimeout(debounceTimeout);
		debounceTimeout = setTimeout(() => {
			fetchOptions(inputValue);
		}, debounceMs);
	}

	function handleOptionClick(option) {
		inputValue = option;
		lastSetValue = inputValue;
		onChange(option);
		isOptionClickPending = false;
		isOpen = false;
	}

	function handleOptionKeyDown(e, option) {
		if (e.key === 'Enter' || e.key === ' ') {
			e.preventDefault();
			handleOptionClick(option);
		}
	}

	onDestroy(() => {
		clearTimeout(debounceTimeout);
	});
</script>

<div class="relative w-full">
	<label for="autocomplete" class="mb-2 font-medium text-gray-700">
		{label}
	</label>
	<input
		type="text"
		value={inputValue}
		oninput={handleInputChange}
		onfocusin={() => (isOpen = true)}
		onfocusout={() => {
			if (!isOptionClickPending) {
				inputValue = lastSetValue;
				onChange('');
				isOpen = false;
			}
		}}
		class="w-full rounded-md border border-gray-300 px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-blue-500"
		role="combobox"
		aria-expanded={isOpen}
		aria-controls="autocomplete-options"
		aria-autocomplete="list"
	/>
	{#if isOpen || isOptionClickPending}
		<div
			id="autocomplete-options"
			class="absolute z-10 mt-1 w-full rounded-md border border-gray-300 bg-white"
			role="listbox"
		>
			{#if loading}
				<div class="flex justify-center p-2">
					<div class="h-5 w-5 animate-spin rounded-full border-2 border-blue-500"></div>
				</div>
			{:else if filteredOptions.length > 0}
				{#each filteredOptions as option}
					<button
						type="button"
						onmouseenter={() => {
							isOptionClickPending = true;
						}}
						onmouseleave={() => {
							isOptionClickPending = false;
						}}
						onclick={() => handleOptionClick(option)}
						onkeydown={(e) => handleOptionKeyDown(e, option)}
						class="w-full cursor-pointer px-4 py-2 text-left hover:bg-gray-100"
						role="option"
						aria-selected={inputValue === option}
					>
						{option}
					</button>
				{/each}
			{:else if hasFetched && inputValue}
				<button
					type="button"
					onmouseenter={() => {
						isOptionClickPending = true;
					}}
					onmouseleave={() => {
						isOptionClickPending = false;
					}}
					onclick={() => {
						if (inputValue.trim()) handleOptionClick(inputValue.trim());
					}}
					onkeydown={(e) => {
						if (inputValue.trim()) handleOptionKeyDown(e, inputValue.trim());
					}}
					class="w-full cursor-pointer px-4 py-2 text-left text-blue-600 hover:bg-gray-100"
				>
					Add "{inputValue}"
				</button>
			{/if}
		</div>
	{/if}
</div>
