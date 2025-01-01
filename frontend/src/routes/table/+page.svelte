<script>
	import { localStore } from '$lib/LocalStore.svelte';

	// State management
	let rawData = $state([]);
	let displayData = $state([]);
	let loading = $state(true);
	let error = $state(null);
	let sortColumn = $state(null);
	let sortDirection = $state('asc');

	// Get column order from local storage
	const columnOrder = localStore('table:column', [
		'company',
		'position',
		'majors',
		'minors',
		'location',
		'coop',
		'compensations',
		'source',
		'offerStatus',
		'year'
	]);

	// Column definitions
	const columns = {
		company: {
			title: 'Company',
			sortable: true,
			headerClass: 'text-left font-medium',
			cellClass: 'font-medium'
		},
		position: {
			title: 'Position',
			sortable: true,
			headerClass: 'text-left'
		},
		majors: {
			title: 'Major(s)',
			sortable: true,
			headerClass: 'text-left',
			formatter: (value) => (Array.isArray(value) ? value.join(', ') : value)
		},
		minors: {
			title: 'Minor(s)',
			sortable: true,
			headerClass: 'text-left',
			formatter: (value) => (Array.isArray(value) && value.length ? value.join(', ') : '-')
		},
		location: {
			title: 'Location',
			sortable: true,
			headerClass: 'text-left'
		},
		coop: {
			title: 'Co-op',
			sortable: true,
			headerClass: 'text-left',
			formatter: (value) => {
				if (!value || (!value.year && !value.cycle)) return '-';
				return `${value.year || '-'} - ${value.cycle || '-'}`;
			},
			getValue: (row) => row.coop
		},
		compensations: {
			title: 'Compensation',
			sortable: true,
			headerClass: 'text-left',
			formatter: (value) => {
				if (!Array.isArray(value)) return '-';
				return value
					.map((comp) => `${comp.type}: $${comp.amount}${comp.type === 'Hourly' ? '/hr' : ''}`)
					.join(', ');
			}
		},
		source: {
			title: 'Source',
			sortable: true,
			headerClass: 'text-left'
		},
		offerStatus: {
			title: 'Status',
			sortable: true,
			headerClass: 'text-left',
			formatter: (value) => {
				const colorClass =
					value === 'Offered'
						? 'bg-green-100 text-green-800'
						: value === 'Pending'
							? 'bg-yellow-100 text-yellow-800'
							: 'bg-gray-100 text-gray-800';
				return `<span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${colorClass}">${value}</span>`;
			}
		},
		year: {
			title: 'Year',
			sortable: true,
			headerClass: 'text-left'
		}
	};

	// Load initial data
	async function loadData() {
		try {
			loading = true;
			const response = await fetch('/api/v1/form/submissions');
			const result = await response.json();
			rawData = result.data;
			updateDisplayData();
		} catch (err) {
			error = 'Failed to load submissions. Please try again later.';
			console.error('Failed to load submissions:', err);
		} finally {
			loading = false;
		}
	}

	// Update display data based on current sort
	function updateDisplayData() {
		if (!rawData.length) {
			displayData = [];
			return;
		}

		const sorted = [...rawData].sort((a, b) => {
			if (!sortColumn) return 0;

			const column = columns[sortColumn];
			const aValue = column.formatter ? column.formatter(a[sortColumn]) : a[sortColumn];
			const bValue = column.formatter ? column.formatter(b[sortColumn]) : b[sortColumn];

			if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
			if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
			return 0;
		});
		displayData = sorted;
	}

	// Handle sort
	function handleSort(columnKey) {
		if (sortColumn === columnKey) {
			sortDirection = sortDirection === 'asc' ? 'desc' : 'asc';
		} else {
			sortColumn = columnKey;
			sortDirection = 'asc';
		}
		updateDisplayData();
	}

	// Handle drag start: store the starting column index
	function handleDragStart(event, startIndex) {
		event.dataTransfer.setData('text/plain', startIndex);
	}

	// Allow drop
	function handleDragOver(event) {
		event.preventDefault();
	}

	// Handle drop: reorder columnOrder based on the dragged and target indices
	function handleDrop(event, dropIndex) {
		const startIndex = +event.dataTransfer.getData('text/plain');
		if (startIndex === dropIndex) return;

		const updatedOrder = [...columnOrder.value];
		const [moved] = updatedOrder.splice(startIndex, 1);
		updatedOrder.splice(dropIndex, 0, moved);
		columnOrder.value = updatedOrder;
	}

	$inspect(columns);
	$inspect(columnOrder.value);

	$effect(() => {
		loadData();
	});
</script>

<div class="mx-10 my-10 mb-8 max-w-full px-4 py-10">
	{#if loading}
		<div class="flex h-32 items-center justify-center">
			<div class="h-8 w-8 animate-spin rounded-full border-b-2 border-gray-900"></div>
		</div>
	{:else if error}
		<div class="rounded-lg border border-red-200 bg-red-50 p-4 text-red-800">
			{error}
		</div>
	{:else}
		<div class="overflow-x-auto rounded-lg shadow">
			<table class="min-w-full divide-y divide-gray-200">
				<thead class="bg-gray-50">
					<tr>
						{#each columnOrder.value as columnKey, i (columnKey)}
							{@const column = columns[columnKey]}
							{#if column}
								<th
									class="cursor-pointer select-none px-6 py-3 text-xs font-medium uppercase tracking-wider text-gray-500"
									class:sorted={sortColumn === columnKey}
									onclick={() => handleSort(columnKey)}
									draggable="true"
									ondragstart={(e) => handleDragStart(e, i)}
									ondragover={handleDragOver}
									ondrop={(e) => handleDrop(e, i)}
								>
									<div class="flex items-center space-x-1">
										<span>{column.title}</span>
										{#if sortColumn === columnKey}
											<span>{sortDirection === 'asc' ? '↑' : '↓'}</span>
										{/if}
									</div>
								</th>
							{/if}
						{/each}
					</tr>
				</thead>

				<tbody class="divide-y divide-gray-200 bg-white">
					{#each displayData as row}
						<tr class="hover:bg-gray-50">
							{#each columnOrder.value as columnKey}
								{@const column = columns[columnKey]}
								{#if column}
									<td class="whitespace-nowrap px-6 py-4 text-sm text-gray-900">
										{#if column.formatter}
											{@html column.formatter(row[columnKey])}
										{:else}
											{row[columnKey]}
										{/if}
									</td>
								{/if}
							{/each}
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	{/if}
</div>

<style>
	th.sorted {
		@apply bg-gray-100;
	}

	td {
		@apply align-middle;
	}
</style>
