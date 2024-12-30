<script>
	import { onMount } from 'svelte';

	let { min = 0, max = 100, value = $bindable(0), label = '', unit = '', icon = null } = $props();

	let currentValue = $state(value);
	let focused = $state(false);
	let sliderId = `slider-${Math.random().toString(36).substr(2, 9)}`;
	let percentage = $derived(((value - min) / (max - min)) * 100);

	function handleSliderChange(e) {
		currentValue = Number(e.target.value);
		value = currentValue;
	}

	function handleInputChange(e) {
		const newValue = Number(e.target.value);
		if (newValue >= min && newValue <= max) {
			currentValue = newValue;
			value = currentValue;
		}
	}
	$inspect(focused);
</script>

<div class=" gap-4">
	<span class="block flex gap-2 font-medium font-semibold text-gray-700">
		{#if icon}
			<div class="pl-2 text-blue-600">
				{@render icon('')}
			</div>
		{/if}
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
		<span class={focused ? '-ml-1' : '-ml-5'}>{unit}</span>
	</div>
</div>
