<script lang="ts">
	import { settingsStore } from "../store";
	import type { LaunchpadSettings } from "../settings";

	let settings: LaunchpadSettings;
	settingsStore.subscribe((s) => { if (s) settings = s; });

	function getGreeting(): string {
		const hour = new Date().getHours();
		const name = settings?.userName || "there";

		if (hour >= 5 && hour < 12) return `Good morning, ${name}`;
		if (hour >= 12 && hour < 17) return `Good afternoon, ${name}`;
		if (hour >= 17 && hour < 21) return `Good evening, ${name}`;
		return `Burning the midnight oil, ${name}`;
	}

	function getSubGreeting(): string {
		const hour = new Date().getHours();
		if (hour >= 5 && hour < 12) return "What's on the agenda today?";
		if (hour >= 12 && hour < 17) return "How's the day going?";
		if (hour >= 17 && hour < 21) return "Wrapping up?";
		return "Don't forget to rest.";
	}

	// Refresh greeting every minute
	let greeting = getGreeting();
	let subGreeting = getSubGreeting();

	const interval = setInterval(() => {
		greeting = getGreeting();
		subGreeting = getSubGreeting();
	}, 60000);

	import { onDestroy } from "svelte";
	onDestroy(() => clearInterval(interval));
</script>

<div class="launchpad-greeting">
	<h1 class="launchpad-greeting-text">{greeting}</h1>
	<p class="launchpad-greeting-sub">{subGreeting}</p>
</div>

<style>
	.launchpad-greeting {
		text-align: center;
		padding-top: 40px;
		padding-bottom: 10px;
	}
	.launchpad-greeting-text {
		font-size: 2em;
		font-weight: 600;
		margin: 0;
		color: var(--text-normal);
	}
	.launchpad-greeting-sub {
		font-size: var(--font-ui-medium);
		color: var(--text-muted);
		margin: 8px 0 0 0;
	}
	@media (max-height: 800px) {
		.launchpad-greeting {
			padding-top: 10px;
		}
		.launchpad-greeting-text {
			font-size: 1.5em;
		}
	}
</style>
