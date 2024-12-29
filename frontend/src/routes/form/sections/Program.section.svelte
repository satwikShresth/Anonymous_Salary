<script>
	import { onMount } from 'svelte';
	import MultiSelect from '$lib/components/MultiSelect.svelte';
	import RadioGroup from '$lib/components/RadioGroup.svelte';
	import { GraduationCap } from 'lucide-svelte';

	let {
		formData = {},
		validate = $bindable(),
		onChange = ({ level, majors, minors, coopCycle, coopYear }) => {}
	} = $props();
	let error = $state(null);

	validate = ({ level, majors, minors, coopCycle, coopYear }) => {
		const validations = {
			level: (v) => v?.trim(),
			majors: (v) => Array.isArray(v) && v.length > 0,
			minors: (v) => Array.isArray(v),
			coopCycle: (v) => v?.trim(),
			coopYear: (v) => v?.trim()
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

<div class="flex justify-between gap-6">
	<div class="flex-1">
		<RadioGroup
			label="Level"
			value={formData.level}
			apiEndpoint="/api/options/source"
			onChange={(level) => onChange({ level })}
		/>
	</div>
</div>

<div class="flex justify-between gap-6">
	<div class="flex-1">
		<MultiSelect
			label="Majors"
			values={formData.majors}
			onChange={(majors) => onChange({ majors })}
		/>
	</div>
	<div class="flex-1">
		<MultiSelect
			label="Minors"
			values={formData.minors}
			onChange={(minors) => onChange({ minors })}
		/>
	</div>
</div>

<div class="flex justify-between gap-6">
	<div class="flex-1">
		<RadioGroup
			value={formData.coopCycle}
			label="Coop Cycle"
			apiEndpoint="/api/options/source"
			onChange={(coopCycle) => onChange({ coopCycle })}
		/>
	</div>
	<div class="flex-1">
		<RadioGroup
			label="Coop Year"
			value={formData.coopYear}
			apiEndpoint="/api/options/source"
			onChange={(coopYear) => onChange({ coopYear })}
		/>
	</div>
</div>
