<script>
	import { CheckCircle2, FileText } from 'lucide-svelte';
	import RadioGroup from '$lib/components/RadioGroup.svelte';

	let {
		formData = {},
		validate = $bindable(),

		onChange = ({ offerStatus, decision, decisionReason, otherNotes } = {}) => {}
	} = $props();

	validate = () => ({ isValid: true, errors: [] });
</script>

<div class="grid grid-cols-1 gap-6 lg:grid-cols-2">
	<RadioGroup
		label="Offer Status"
		apiEndpoint="/api/options/tiers"
		onchange={(value) => onChange({ offerStatus: value })}
		type="status"
	/>

	<div class="space-y-2 lg:col-span-2">
		<label class="block text-sm font-medium text-gray-700">
			<div class="flex items-center gap-2">
				<FileText class="h-4 w-4 text-gray-500" />
				Other Notes
			</div>
		</label>
		<textarea
			oninput={(e) => onChange({ otherNotes: e.target.value })}
			class="w-full rounded-lg border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
			rows={3}
			placeholder="Any additional information you'd like to share..."
		></textarea>
	</div>
</div>
