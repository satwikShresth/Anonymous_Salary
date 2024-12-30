<script>
	import { DollarSign, Plus, X } from 'lucide-svelte';
	import Slider from '$lib/components/Slider.svelte';

	let {
		formData = $bindable(),
		validate = $bindable(),
		validValues,
		showErrors = false
	} = $props();

	const MAX_ADDITIONAL_COMPENSATION = 5;

	const compensationTypes = [
		{ value: 'Hourly', label: 'Hourly' },
		{ value: 'Stipend', label: 'Stipend' },
		{ value: 'Bonus', label: 'Bonus' },
		{ value: 'Housing', label: 'Housing' },
		{ value: 'Transportation', label: 'Transportation' },
		{ value: 'Food', label: 'Food' },
		{ value: 'Other', label: 'Other' }
	];
	validate = () => ({ isValid: true, errors: [] });

	const compensationRanges = {
		Hourly: {
			min: 10,
			max: 120,
			step: 0.5,
			unit: '$/hr'
		},
		Stipend: {
			min: 100,
			max: 1000,
			step: 50,
			unit: '$/week'
		},
		Bonus: {
			min: 1000,
			max: 10000,
			step: 500,
			unit: '$'
		},
		Housing: {
			min: 500,
			max: 5000,
			step: 100,
			unit: '$/month'
		},
		Transportation: {
			min: 50,
			max: 500,
			step: 25,
			unit: '$/month'
		},
		Food: {
			min: 100,
			max: 1000,
			step: 50,
			unit: '$/month'
		},
		Other: {
			min: 0,
			max: 10000,
			step: 100,
			unit: '$'
		}
	};

	function handleAddCompensation() {
		if (formData.compensations.length < MAX_ADDITIONAL_COMPENSATION) {
			formData.compensations.push({
				type: 'Stipend',
				amount: null,
				description: '',
				isNotApplicable: false
			});
		}
	}

	function handleUpdateCompensation(index, item) {
		formData.compensations[index] = item;
	}

	function handleRemoveCompensation(index) {
		formData.compensations = formData.compensations.filter((_, i) => i !== index);
	}

	function handleTypeChange(item, newType) {
		const newRange = compensationRanges[newType];
		return {
			...item,
			type: newType,
			amount: newRange.min + (newRange.max - newRange.min) * 0.3
		};
	}
</script>

{#snippet compensationItemContent(item, index)}
	<div
		class="space-y-4 rounded-lg border p-4"
		class:border-red-300={showErrors}
		class:bg-red-50={showErrors}
		class:border-gray-200={!showErrors}
	>
		<div class="flex items-center justify-between">
			<span class="text-sm font-medium text-gray-700">
				{#if item.type === 'Hourly'}
					Hourly Rate
				{:else}
					<select
						value={item.type}
						onchange={(e) =>
							handleUpdateCompensation(index, handleTypeChange(item, e.target.value))}
						class="border-none bg-transparent p-0 pr-8 focus:ring-0"
					>
						{#each compensationTypes as type}
							<option value={type.value}>
								{type.label}
							</option>
						{/each}
					</select>
				{/if}
			</span>

			{#if item.type !== 'Hourly'}
				<button
					type="button"
					onclick={() => handleRemoveCompensation(index)}
					class="text-gray-400 transition-colors hover:text-gray-600"
				>
					<X class="h-4 w-4" />
				</button>
			{/if}
		</div>

		<div class="space-y-4">
			<div>
				<div class="mb-2 flex items-center justify-between">
					<div class="flex items-center gap-2">
						<DollarSign class="h-4 w-4 text-gray-500" />
						<span class="text-sm font-medium text-gray-700">Amount</span>
					</div>
					<label class="flex items-center gap-2">
						<span class="text-sm">N/A</span>
						<input
							type="checkbox"
							checked={item.isNotApplicable}
							onchange={(e) =>
								handleUpdateCompensation(index, {
									...item,
									isNotApplicable: e.target.checked,
									amount: e.target.checked ? null : compensationRanges[item.type].min
								})}
							class="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
						/>
					</label>
				</div>

				{#if !item.isNotApplicable}
					<Slider
						bind:value={formData.compensations[index].amount}
						min={compensationRanges[item.type].min}
						max={compensationRanges[item.type].max}
						step={compensationRanges[item.type].step}
						disabled={item.isNotApplicable}
						unit={compensationRanges[item.type].unit}
					/>
				{/if}

				{#if showErrors}
					<p class="mt-1 text-sm text-red-600">Please enter a valid amount or mark as N/A</p>
				{/if}
			</div>

			<label class="block">
				<span class="text-sm font-medium text-gray-700">Description</span>
				<textarea
					value={item.description}
					oninput={(e) => handleUpdateCompensation(index, { ...item, description: e.target.value })}
					class="mt-1 block w-full rounded-lg border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
					rows={2}
					placeholder="Add details about this compensation..."
				></textarea>
			</label>
		</div>
	</div>
{/snippet}

{#each formData.compensations as item, index (index)}
	{#key index}
		{@render compensationItemContent(item, index)}
	{/key}
{/each}

{#if formData.compensations.length < MAX_ADDITIONAL_COMPENSATION}
	<button
		type="button"
		onclick={handleAddCompensation}
		class="flex w-full items-center justify-center gap-2 rounded-lg border-2 border-dashed border-gray-300 py-3 text-gray-600 transition-colors duration-200 hover:border-blue-500 hover:text-blue-600"
	>
		<Plus class="h-4 w-4" />
		Add Compensation
	</button>
{/if}
