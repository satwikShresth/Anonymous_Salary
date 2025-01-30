<script>
	import { onMount } from 'svelte';
	import {
		Building2,
		Clock5,
		MapPin,
		Briefcase,
		University,
		Calendar,
		CalendarDays
	} from 'lucide-svelte';
	import { Datepicker } from 'flowbite-svelte';
	import AutoComplete from '$lib/components/AutoComplete.svelte';
	import Slider from '$lib/components/Slider.svelte';
	import MultiSelect from '$lib/components/MultiSelect.svelte';
	import RadioGroup from '$lib/components/RadioGroup.svelte';

	let { formData = $bindable(), validValues, validate = $bindable() } = $props();

	validate = ({ company, position, location, source, workHours }) => {
		const validations = {
			company: (v) => v?.trim(),
			position: (v) => v?.trim(),
			location: (v) => v?.trim(),
			source: (v) => v?.trim(),
			workHours: (v) => Number.isInteger(v) && v > 0
		};
		const errors = Object.entries(validations)
			.filter(([key, validator]) => !validator(formData[key]))
			.reduce((acc, [key]) => ({ ...acc, [key]: `${key} is required` }), {});

		return {
			isValid: Object.keys(errors).length === 0,
			errors
		};
	};
</script>

<div class="flex justify-between gap-6 py-3">
	<div class="flex-1">
		<AutoComplete
			bind:value={formData.company}
			icon={Building2}
			label="Company"
			apiEndpoint="/api/v1/options/company"
		/>
	</div>
	<div class="flex-1">
		<AutoComplete
			bind:value={formData.position}
			queryDep={formData.company}
			disabled={formData.company === ''}
			icon={Briefcase}
			label="Position"
			apiEndpoint="/api/v1/options/position"
		/>
	</div>
</div>

<div class="flex justify-between gap-6 py-3">
	<div class="flex-1">
		<AutoComplete
			bind:value={formData.location}
			label="Location"
			icon={MapPin}
			apiEndpoint="/api/v1/options/location"
		/>
	</div>
	<div class="flex-1">
		<RadioGroup
			label="Source"
			icon={University}
			bind:value={formData.source}
			apiEndpoint="/api/v1/options/source"
		/>
	</div>
</div>

<div class="flex justify-between gap-6 py-3">
	<div class="flex-1">
		<Slider
			label="Work Hours"
			bind:value={formData.workHours}
			min={20}
			max={80}
			icon={Clock5}
			unit="hrs/week"
		/>
	</div>
	<div class="flex-1">
		<Slider
			label="Year"
			bind:value={formData.year}
			min={1990}
			max={new Date().getFullYear() + 2}
			icon={CalendarDays}
			unit=""
		/>
	</div>
</div>
