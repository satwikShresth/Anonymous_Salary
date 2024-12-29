<script>
	import { onMount } from 'svelte';
	import { Building2, Clock5, MapPin, Briefcase, University } from 'lucide-svelte';
	import AutoComplete from '$lib/components/AutoComplete.svelte';
	import Slider from '$lib/components/Slider.svelte';
	import MultiSelect from '$lib/components/MultiSelect.svelte';
	import RadioGroup from '$lib/components/RadioGroup.svelte';

	let {
		formData,
		validate = $bindable(),
		onChange = ({ company, position, location, source, workHours }) => {}
	} = $props();

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
			value={formData.company}
			icon={Building2}
			label="Company"
			apiEndpoint="/api/v1/options/company"
			onChange={(company) => onChange({ company })}
		/>
	</div>
	<div class="flex-1">
		<AutoComplete
			value={formData.position}
			icon={Briefcase}
			bind:queryDep={formData.company}
			label="Position"
			apiEndpoint="/api/v1/options/position"
			onChange={(position) => onChange({ position })}
		/>
	</div>
</div>

<div class="flex justify-between gap-6 py-3">
	<div class="flex-1">
		<AutoComplete
			value={formData.location}
			label="Location"
			icon={MapPin}
			apiEndpoint="/api/v1/options/location"
			onChange={(location) => onChange({ location })}
		/>
	</div>
	<div class="flex-1">
		<RadioGroup
			label="Source"
			icon={University}
			value={formData.source}
			apiEndpoint="/api/v1/options/source"
			onChange={(source) => onChange({ source })}
		/>
	</div>
</div>

<div class="mx-24 w-auto py-3">
	<Slider
		label="Work Hours"
		value={formData.workHours}
		min={20}
		max={80}
		icon={Clock5}
		unit="hrs/week"
		onChange={(workHours) => onChange({ workHours })}
	/>
</div>
