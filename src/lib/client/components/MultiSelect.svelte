<script>
	import { onMount, onDestroy } from 'svelte';
	import axios from 'axios';

	const {
		apiEndpoint = '/api/options/countries',
		values = [],
		onChange = (vals) => {},
		onAddOption = (val) => {},
		label = '',
		debounceMs = 300
	} = $props();

	let isOpen = $state(false);
	let inputValue = $state('');
	let filteredOptions = $state([]);
	let loading = $state(false);
	let inputRef;
	let wrapperRef;
	let debounceTimeout;

	const inputId = `multiselect-${label}-${Math.random().toString(36).substr(2, 9)}`;

	const api = axios.create({
		baseURL: apiEndpoint,
		timeout: 5000
	});

	async function fetchOptions(query) {
		if (!query.trim()) {
			filteredOptions = [];
			return;
		}

		try {
			loading = true;
			const { data } = await api.get('', {
				params: { q: query }
			});
			filteredOptions = Array.isArray(data)
				? data.filter((option) => !values.includes(option))
				: [];
		} catch (error) {
			console.error('Error fetching options:', error);
			filteredOptions = [];
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
		onChange([...values, option]);
		inputValue = '';
		if (inputRef) {
			inputRef.focus();
		}
	}

	function handleOptionKeyDown(e, option) {
		if (e.key === 'Enter' || e.key === ' ') {
			e.preventDefault();
			handleOptionClick(option);
		}
	}

	function handleRemoveValue(valueToRemove) {
		onChange(values.filter((value) => value !== valueToRemove));
	}

	function handleAddOption() {
		if (inputValue.trim()) {
			onAddOption(inputValue.trim());
			onChange([...values, inputValue.trim()]);
			inputValue = '';
		}
	}

	function handleAddOptionKeyDown(e) {
		if (e.key === 'Enter' || e.key === ' ') {
			e.preventDefault();
			handleAddOption();
		}
	}

	onMount(() => {
		const handleClickOutside = (event) => {
			if (wrapperRef && !wrapperRef.contains(event.target)) {
				inputValue = '';
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
	<span for={inputId} class="mb-1 block font-medium text-gray-700">
		{label}
	</span>
	<div
		class="min-h-[42px] rounded-md border border-gray-300 p-1 focus-within:border-transparent focus-within:ring-2 focus-within:ring-blue-500"
	>
		<div class="flex flex-wrap gap-1">
			{#each values as value}
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
						×
					</button>
				</span>
			{/each}
			<input
				id={inputId}
				bind:this={inputRef}
				type="text"
				bind:value={inputValue}
				oninput={handleInputChange}
				onfocus={() => (isOpen = true)}
				class="min-w-[120px] flex-1 border-transparent p-1 outline-none"
				placeholder="Type to search..."
				aria-expanded={isOpen}
				aria-controls="multiselect-options"
				role="combobox"
			/>
		</div>
	</div>
	{#if isOpen}
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
</div>

