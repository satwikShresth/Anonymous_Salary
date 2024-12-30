<script>
	import { onMount } from 'svelte';
	import MultiSelect from '$lib/components/MultiSelect.svelte';
	import RadioGroup from '$lib/components/RadioGroup.svelte';
	import { BookCopy, Bookmark, Calendar, GraduationCap, SunSnow } from 'lucide-svelte';

	let { formData = $bindable(), validate = $bindable(), validValues = $bindable() } = $props();
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

<div class="flex justify-between gap-6 py-3">
	<div class="flex-1">
		<RadioGroup
			label="Level"
			icon={GraduationCap}
			bind:value={formData.level}
			apiEndpoint="/api/v1/options/program"
		/>
	</div>
</div>

<div class="flex justify-between gap-6 py-3">
	<div class="flex-1">
		<MultiSelect
			label="Majors"
			icon={Bookmark}
			bind:queryDep={formData.level}
			apiEndpoint="/api/v1/options/majors"
			bind:values={formData.majors}
		/>
	</div>
	<div class="flex-1">
		<MultiSelect
			label="Minors"
			icon={BookCopy}
			bind:queryDep={formData.level}
			apiEndpoint="/api/v1/options/minors"
			bind:values={formData.minors}
		/>
	</div>
</div>

<div class="flex justify-between gap-6 py-3">
	<div class="flex-1">
		<RadioGroup
			bind:value={formData.coopCycle}
			icon={SunSnow}
			label="Coop Cycle"
			apiEndpoint="/api/v1/options/coop/cycle"
		/>
	</div>

	<div class="flex-1">
		<RadioGroup
			label="Coop Year"
			icon={Calendar}
			bind:value={formData.coopYear}
			apiEndpoint="/api/v1/options/coop/years"
		/>
	</div>
</div>
