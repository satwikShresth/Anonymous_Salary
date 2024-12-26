<script>
	import { onMount, onDestroy } from 'svelte';

	// Props using Svelte's export syntax
	export let options = [];
	export let values = [];
	export let onChange = (vals) => {};
	export let onAddOption = (val) => {};
	export let label = '';

	// Reactive declarations using Svelte's $ syntax
	let isOpen = false;
	let inputValue = '';
	let inputRef;
	let wrapperRef;
	let filteredOptions = [];

	const inputId = `multiselect-${Math.random().toString(36).substr(2, 9)}`;

	// Reactive statement using $: instead of $effect
	$: filteredOptions = options.filter(
		(option) => option.toLowerCase().includes(inputValue.toLowerCase()) && !values.includes(option)
	);

	onMount(() => {
		const handleClickOutside = (event) => {
			if (wrapperRef && !wrapperRef.contains(event.target)) {
				isOpen = false;
			}
		};

		document.addEventListener('mousedown', handleClickOutside);

		return () => {
			document.removeEventListener('mousedown', handleClickOutside);
		};
	});

	function handleInputChange(e) {
		inputValue = e.target.value;
		isOpen = true;
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
		if (inputValue && !options.includes(inputValue)) {
			onAddOption(inputValue);
			onChange([...values, inputValue]);
			inputValue = '';
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
	<label for={inputId} class="mb-1 block text-sm font-medium text-gray-700">
		{label}
	</label>
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
	{#if isOpen && (inputValue || filteredOptions.length > 0)}
		<div
			id="multiselect-options"
			class="absolute z-10 mt-1 w-full rounded-md border border-transparent bg-white shadow-lg"
			role="listbox"
		>
			{#if filteredOptions.length > 0}
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
			{:else if inputValue}
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

