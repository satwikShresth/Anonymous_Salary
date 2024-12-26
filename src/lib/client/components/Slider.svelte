<script>
	const { min = 0, max = 100, value = 0, onChange = (val) => {}, label = '' } = $props();

	let currentValue = $state(value);
	let sliderId = `slider-${Math.random().toString(36).substr(2, 9)}`;
	let percentage = $derived(((value - min) / (max - min)) * 100);

	function handleSliderChange(e) {
		currentValue = Number(e.target.value);
		onChange(currentValue);
	}

	function handleInputChange(e) {
		const newValue = Number(e.target.value);
		if (newValue >= min && newValue <= max) {
			currentValue = newValue;
			onChange(newValue);
		}
	}
</script>

<div class=" gap-4">
	<span class="mb-1 font-medium text-gray-700">
		{label}
	</span>
	<div class="flex items-center gap-4">
		<input
			{min}
			{max}
			id={sliderId}
			type="range"
			value={currentValue}
			step="1"
			oninput={handleSliderChange}
			class="h-2 w-full cursor-pointer appearance-none rounded-lg bg-gray-200"
			style="background: linear-gradient(to right, rgb(59 130 246) {percentage}%, rgb(229 231 235) {percentage}%)"
			aria-label={label}
		/>
		<input
			type="number"
			{min}
			{max}
			value={currentValue}
			oninput={handleInputChange}
			class="w-20 rounded-md border border-gray-300 px-2 py-1"
			aria-label={`${label} number input`}
		/>
	</div>
</div>
