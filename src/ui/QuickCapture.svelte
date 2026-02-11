<script lang="ts">
	import { showCaptureModal, captureStateStore } from "../store";
	import { INITIAL_CAPTURE_STATE } from "../types";
	import type { Domain } from "../types";
	import { ALL_DOMAINS } from "../domainConfig";

	function startCapture(domain: Domain) {
		captureStateStore.set({
			...INITIAL_CAPTURE_STATE,
			domain,
			step: "type",
		});
		showCaptureModal.set(true);
	}
</script>

<div class="launchpad-quick-capture">
	{#each ALL_DOMAINS as domain}
		<button
			class="launchpad-capture-btn launchpad-capture-{domain.id}"
			on:click={() => startCapture(domain.id)}
		>
			<span class="launchpad-capture-emoji">{domain.emoji}</span>
			<span class="launchpad-capture-label">{domain.label}</span>
		</button>
	{/each}
</div>

<style>
	.launchpad-quick-capture {
		display: flex;
		gap: 12px;
		justify-content: center;
		flex-wrap: wrap;
		margin-bottom: 28px;
		padding: 0 20px;
	}
	.launchpad-capture-btn {
		display: flex;
		align-items: center;
		gap: 8px;
		padding: 12px 24px;
		border-radius: var(--radius-m);
		border: 1px solid var(--background-modifier-border);
		background: var(--background-secondary);
		color: var(--text-normal);
		font-size: var(--font-ui-medium);
		cursor: pointer;
		transition: all 0.15s ease;
		font-weight: 500;
	}
	.launchpad-capture-btn:hover {
		background: var(--background-modifier-hover);
		border-color: var(--interactive-accent);
		transform: translateY(-1px);
	}
	.launchpad-capture-btn:active {
		transform: translateY(0);
	}
	.launchpad-capture-emoji {
		font-size: 1.3em;
	}
	.launchpad-capture-label {
		font-size: var(--font-ui-medium);
	}
</style>
