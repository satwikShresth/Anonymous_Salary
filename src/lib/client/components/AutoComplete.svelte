<script>
	import { onMount, onDestroy } from 'svelte';

	const {
		options = [],
		value = '',
		onChange = (val) => {},
		onAddOption = (val) => {},
		label = '',
		fetchOptions,
		searchOptions
	} = $props();

	let isOpen = $state(false);
	let inputValue = $state(value);
	let filteredOptions = $state([]);
	let loading = $state(false);
	let wrapperRef;
	let inputRef;
	let inputId = `autocomplete-${Math.random().toString(36).substr(2, 9)}`;

	$effect(() => {
		inputValue = value;
	});

	$effect(() => {
		if (searchOptions) {
			filteredOptions = searchOptions(options, inputValue);
		} else {
			filteredOptions = options.filter((option) =>
				option.toLowerCase().includes(inputValue.toLowerCase())
			);
		}
	});

	let handleClickOutside;

	onMount(() => {
		handleClickOutside = (event) => {
			if (wrapperRef && !wrapperRef.contains(event.target)) {
				isOpen = false;
			}
		};

		document.addEventListener('mousedown', handleClickOutside);
	});

	onDestroy(() => {
		if (handleClickOutside) {
			document.removeEventListener('mousedown', handleClickOutside);
		}
	});

	async function handleInputChange(e) {
		inputValue = e.target.value;
		onChange(inputValue);
		isOpen = true;

		if (fetchOptions) {
			try {
				loading = true;
				const newOptions = await fetchOptions(inputValue);
				filteredOptions = newOptions;
			} catch (error) {
				console.error('Error fetching options:', error);
				filteredOptions = [];
			} finally {
				loading = false;
			}
		}
	}

	function handleOptionClick(option) {
		inputValue = option;
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
			onAddOption(inputValue.trim());
			handleOptionClick(inputValue.trim());
		}
	}

	function handleAddOptionKeyDown(e) {
		if (e.key === 'Enter' || e.key === ' ') {
			e.preventDefault();
			handleAddOption();
		}
	}
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
		class="w-full rounded-md border border-gray-300 px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-blue-500"
		role="combobox"
		aria-expanded={isOpen}
		aria-controls="autocomplete-options"
		aria-autocomplete="list"
	/>
	{#if isOpen}
		<div
			id="autocomplete-options"
			class="absolute z-10 mt-1 w-full rounded-md border border-gray-300 bg-white shadow-lg"
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
						aria-selected={inputValue === option}
					>
						{option}
					</button>
				{/each}
			{:else}
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

