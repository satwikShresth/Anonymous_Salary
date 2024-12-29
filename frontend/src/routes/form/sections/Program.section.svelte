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
			apiEndpoint="/api/v1/options/program"
			onChange={(level) => onChange({ level })}
		/>
	</div>
</div>

<div class="flex justify-between gap-6">
	<div class="flex-1">
		<MultiSelect
			label="Majors"
			bind:queryDep={formData.level}
			apiEndpoint="/api/v1/options/majors"
			values={formData.majors}
			onChange={(majors) => onChange({ majors })}
		/>
	</div>
	<div class="flex-1">
		<MultiSelect
			label="Minors"
			bind:queryDep={formData.level}
			apiEndpoint="/api/v1/options/minors"
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
			apiEndpoint="/api/v1/options/coop/cycle"
			onChange={(coopCycle) => onChange({ coopCycle })}
		/>
	</div>
	<div class="flex-1">
		<RadioGroup
			label="Coop Year"
			value={formData.coopYear}
			apiEndpoint="/api/v1/options/coop/years"
			onChange={(coopYear) => onChange({ coopYear })}
		/>
	</div>
</div>
