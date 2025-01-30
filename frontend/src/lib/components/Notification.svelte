<script>
	import { onMount } from 'svelte';
	import { Alert, AlertDescription, AlertTitle } from '$lib/components/ui/alert';
	import { XCircle } from 'lucide-svelte';
	import { fade } from 'svelte/transition';

	let { errors = $bindable() } = $props();
	let isVisible = $state(false);
	let timeoutId = $state(null);
	let previousErrorCount = $state(0);

	$effect(() => {
		const currentErrorCount = Object.keys(errors).length;

		// Only show notification if we have new errors
		if (currentErrorCount > 0 && currentErrorCount !== previousErrorCount) {
			previousErrorCount = currentErrorCount;
			showNotification();
		} else if (currentErrorCount === 0) {
			previousErrorCount = 0;
			hideNotification();
		}
	});

	function showNotification() {
		if (!isVisible) {
			isVisible = true;
			if (timeoutId) {
				clearTimeout(timeoutId);
			}
			// Auto-hide after 5 seconds
			timeoutId = setTimeout(() => {
				hideNotification();
			}, 5000);
		}
	}

	function hideNotification() {
		if (isVisible) {
			isVisible = false;
			if (timeoutId) {
				clearTimeout(timeoutId);
				timeoutId = null;
			}
			errors = [];
		}
	}

	// Cleanup on component unmount
	onMount(() => {
		return () => {
			if (timeoutId) {
				clearTimeout(timeoutId);
			}
		};
	});
</script>

{#if isVisible && Object.keys(errors).length > 0}
	<div
		class="fixed right-4 top-4 z-50 w-96 max-w-[calc(100vw-2rem)]"
		transition:fade={{ duration: 200 }}
	>
		<Alert variant="destructive" class="relative bg-red-50">
			<button
				class="absolute right-2 top-2 text-gray-500 hover:text-gray-700"
				onclick={hideNotification}
			>
				<XCircle class="h-4 w-4" />
			</button>
			<AlertTitle class="mb-2 font-semibold">Please fix the following errors:</AlertTitle>
			<AlertDescription>
				<ul class="list-disc space-y-1 pl-4">
					{#each Object.entries(errors) as [field, message]}
						<li class="text-sm">
							{message}
						</li>
					{/each}
				</ul>
			</AlertDescription>
		</Alert>
	</div>
{/if}
