<script>
	import { onMount, onDestroy } from 'svelte';
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
	let selectedValue = $state('');
	let filteredOptions = $state([]);
	let loading = $state(false);
	let hasFetched = $state(false);
	let wrapperRef;
	let inputRef;
	const inputId = `autocomplete-${label}-${Math.random().toString(36).substr(2, 9)}`;
	let debounceTimeout;

	const api = axios.create({
		baseURL: apiEndpoint,
		timeout: 500
	});

	async function fetchOptions(query) {
		if (!query.trim()) {
			filteredOptions = [];
			hasFetched = false; // Reset fetch state
			return;
		}

		try {
			loading = true;
			hasFetched = false; // Reset before new fetch
			const { data } = await api.get('', {
				params: { q: query }
			});
			filteredOptions = Array.isArray(data) ? data : [];
		} catch (error) {
			console.error('Error fetching options:', error);
			filteredOptions = [];
		} finally {
			loading = false;
			hasFetched = true; // Mark fetch as complete
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
		selectedValue = option;
		inputValue = selectedValue;

		onChange(option);
		isOpen = false;
	}

	function handleOptionKeyDown(e, option) {
		if (e.key === 'Enter' || e.key === ' ') {
			e.preventDefault();
			handleOptionClick(option);
		}
	}

	function handleAddOption() {
		if (inputValue.trim()) {
			handleOptionClick(inputValue.trim());
		}
	}

	function handleAddOptionKeyDown(e) {
		if (e.key === 'Enter' || e.key === ' ') {
			e.preventDefault();
			handleAddOption();
		}
	}
	$inspect(inputValue);

	onMount(() => {
		const handleClickOutside = (event) => {
			if (wrapperRef && !wrapperRef.contains(event.target)) {
				inputValue = selectedValue;
				isOpen = false;
			}
		};
		document.addEventListener('mousedown', handleClickOutside);

		return () => {
			document.removeEventListener('mousedown', handleClickOutside);
		};
	});

	onDestroy(() => {
		clearTimeout(debounceTimeout);
	});
</script>

<div class="relative w-full" bind:this={wrapperRef}>
	<span for={inputId} class="mb-2 font-medium text-gray-700">
		{label}
	</span>
	<input
		id={inputId}
		bind:this={inputRef}
		type="text"
		value={inputValue}
		oninput={handleInputChange}
		onfocus={() => (isOpen = true)}
		class="w-full rounded-md border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-blue-500"
		role="combobox"
		aria-expanded={isOpen}
		aria-controls="autocomplete-options"
		aria-autocomplete="list"
	/>
	{#if isOpen}
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
					onclick={handleAddOption}
					onkeydown={handleAddOptionKeyDown}
					class="w-full cursor-pointer px-4 py-2 text-left text-blue-600 hover:bg-gray-100"
				>
					Add "{inputValue}"
				</button>
			{/if}
		</div>
	{/if}
</div>
