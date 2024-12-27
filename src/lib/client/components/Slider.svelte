<script>
	import { onMount } from 'svelte';

	const { min = 0, max = 100, value = 0, onChange = (val) => {}, label = '', unit = '' } = $props();

	let currentValue = $state(value);
	let focused = $state(false);
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
	$inspect(focused);
</script>

<div class=" gap-4">
	<span class="mb-1 font-medium text-gray-700">
		{label}
	</span>
	<div class="spave-x-2 flex items-center gap-2">
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
			onfocusin={() => (focused = true)}
			onfocusout={() => (focused = false)}
			value={currentValue}
			oninput={handleInputChange}
			class=" pl w-[90] rounded-md border-transparent outline-transparent ring-transparent focus:border-transparent focus:outline-transparent focus:ring-transparent"
			aria-label={`${label} number input`}
		/>
		<span class={focused ? '-ml-3' : '-ml-9'}>{unit}</span>
	</div>
</div>
