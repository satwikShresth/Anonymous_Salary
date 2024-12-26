<script>
	const {
		options = [
			{ value: 'free', label: 'Free Tier' },
			{ value: 'basic', label: 'Basic ($9.99/mo)' },
			{ value: 'pro', label: 'Pro ($19.99/mo)' }
		],
		value = '',
		onChange = (val) => {},
		label = ''
	} = $props();
	const groupName = `radio-group-${Math.random().toString(36).slice(2)}`;
</script>

<div class="gap-4">
	<span class="mb-3 font-medium text-gray-700">
		{label}
	</span>
	<div class="grid grid-cols-2 gap-2">
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
					class="hidden"
					checked={value === option.value}
					onchange={() => onChange(option.value)}
				/>
				<span>{option.label}</span>
			</label>
		{/each}
	</div>
</div>
