<script>
	import {
		Building2,
		Briefcase,
		MapPin,
		Clock,
		DollarSign,
		Gift,
		GraduationCap,
		CheckCircle2,
		FileText,
		ChevronRight,
		CircleDollarSign
	} from 'lucide-svelte';
	import { compensationRanges } from './compensationTypes.js';

	let { formData = $bindable(), validate = $bindable(), validValues = $bindable() } = $props();

	function formatCompensations(compensations) {
		return compensations.map((comp) => `${comp.type}: $${comp.amount}`).join(', ');
	}
</script>

<div class="space-y-12 rounded-lg p-8">
	<!-- Company Information -->
	<section>
		<h2
			class="flex items-center gap-2 border-b-2 border-blue-100 pb-2 text-3xl font-extrabold text-blue-700"
		>
			<Building2 class="h-7 w-7 text-blue-600" /> Company Information
		</h2>
		<ul class="mt-6 space-y-3">
			<li class="flex items-center gap-3 rounded-lg border px-4 py-2 text-gray-700">
				<Briefcase class="h-5 w-5 text-gray-500" />
				<span class="text-lg">{formData.position}</span>
			</li>
			<li class="flex items-center gap-3 rounded-lg border px-4 py-2 text-gray-700">
				<Building2 class="h-5 w-5 text-gray-500" />
				<span class="text-lg">{formData.company}</span>
			</li>
			<li class="flex items-center gap-3 rounded-lg border px-4 py-2 text-gray-700">
				<Clock class="h-5 w-5 text-gray-500" />
				<span class="text-lg">{formData.workHours} hrs/week</span>
			</li>
			<li class="flex items-center gap-3 rounded-lg border px-4 py-2 text-gray-700">
				<MapPin class="h-5 w-5 text-gray-500" />
				<span class="text-lg">{formData.location}</span>
			</li>
		</ul>
	</section>

	<!-- Compensation -->
	<section>
		<h2
			class="flex items-center gap-2 border-b-2 border-blue-100 pb-2 text-3xl font-extrabold text-blue-700"
		>
			<DollarSign class="h-7 w-7 text-blue-600" /> Compensation
		</h2>
		<ul class="mt-6 space-y-6">
			{#each formData.compensations as comp}
				<li class="rounded-lg border p-4">
					<div class="my-2 flex">
						<p class="font-semibold text-gray-800">{comp.type}:</p>
						{#if comp.amount}
							<p class="flex px-1 text-gray-700">
								{comp.amount}
								{compensationRanges[comp.type].unit}
							</p>
						{/if}
					</div>
					{#if comp.description}
						<p class="mt-1 text-sm text-gray-500">{comp.description}</p>
					{/if}
				</li>
			{/each}
		</ul>
	</section>

	<!-- Decision Information -->
	<section>
		<h2
			class="flex items-center gap-2 border-b-2 border-blue-100 pb-2 text-3xl font-extrabold text-blue-700"
		>
			<CheckCircle2 class="h-7 w-7 text-blue-600" /> Decision
		</h2>
		<ul class="mt-6 space-y-3 text-gray-800">
			<li
				class="rounded-lg border px-4 py-2 text-lg font-semibold"
				class:bg-green-100={formData.offerStatus === 'Offered'}
				class:bg-yellow-100={formData.offerStatus !== 'Offered'}
			>
				Offer Status: <span
					class="rounded-lg px-4 py-2 text-lg font-semibold"
					class:green-100={formData.offerStatus === 'Offered'}
					class:text-green-700={formData.offerStatus === 'Offered'}>{formData.offerStatus}</span
				>
			</li>
			<li class="rounded-lg border px-4 py-2 text-lg">
				<span class="font-semibold">Notes:</span>
				{formData.otherNotes}
			</li>
		</ul>
	</section>

	<!-- Program Information -->
	<section>
		<h2
			class="flex items-center gap-2 border-b-2 border-blue-100 pb-2 text-3xl font-extrabold text-blue-700"
		>
			<GraduationCap class="h-7 w-7 text-blue-600" /> Program Information
		</h2>
		<ul class="mt-6 space-y-4 text-gray-800">
			<li>
				<ul class="rounded-lg border px-4 py-2 text-lg">
					<span class="font-semibold">Majors:</span>
					{#each formData.majors as major}
						<li class="flex py-1"><ChevronRight class="my-[1px]" />{major}</li>
					{/each}
				</ul>
			</li>
			<li>
				<ul class="rounded-lg border px-4 py-2 text-lg">
					<span class="font-semibold">Minors:</span>
					{#each formData.minors as minor}
						<li class="flex py-1"><ChevronRight class="my-[1px]" />{minor}</li>
						<li class="text-lg">{minor}</li>
					{/each}
				</ul>
			</li>
			<li class="rounded-lg border px-4 py-2 text-lg">
				<span class="font-semibold">Level:</span>
				{formData.level}
			</li>
			<li class="rounded-lg border px-4 py-2 text-lg">
				<span class="font-semibold">Co-op Year:</span>
				{formData.coopYear}
			</li>
			<li class="rounded-lg border px-4 py-2 text-lg">
				<span class="font-semibold">Co-op Cycle:</span>
				{formData.coopCycle}
			</li>
		</ul>
	</section>
</div>
