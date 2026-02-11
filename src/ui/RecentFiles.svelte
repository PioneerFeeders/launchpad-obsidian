<script lang="ts">
	import { recentFilesStore } from "../store";
	import type { RecentFileEntry } from "../types";
	import type { View } from "obsidian";

	export let view: View;

	let recentFiles: RecentFileEntry[] = [];
	recentFilesStore.subscribe((f) => (recentFiles = f));

	function openFile(entry: RecentFileEntry) {
		view.leaf.openFile(entry.file);
	}

	function timeAgo(timestamp: number): string {
		const diff = Date.now() - timestamp;
		const minutes = Math.floor(diff / 60000);
		if (minutes < 1) return "just now";
		if (minutes < 60) return `${minutes}m ago`;
		const hours = Math.floor(minutes / 60);
		if (hours < 24) return `${hours}h ago`;
		const days = Math.floor(hours / 24);
		return `${days}d ago`;
	}
</script>

{#if recentFiles.length > 0}
	<div class="launchpad-recent-section">
		<h3 class="launchpad-section-title">📄 Recent Notes</h3>
		{#each recentFiles as entry}
			<button class="launchpad-recent-item" on:click={() => openFile(entry)}>
				<span class="launchpad-recent-name">{entry.file.basename}</span>
				<span class="launchpad-recent-time">{timeAgo(entry.timestamp)}</span>
			</button>
		{/each}
	</div>
{/if}

<style>
	.launchpad-recent-section {
		width: 50%;
		min-width: 250px;
		max-width: 700px;
		margin: 0 auto 24px auto;
		padding: 0 20px;
	}
	.launchpad-section-title {
		font-size: var(--font-ui-medium);
		font-weight: 600;
		color: var(--text-normal);
		margin: 0 0 10px 0;
	}
	.launchpad-recent-item {
		display: flex;
		align-items: center;
		justify-content: space-between;
		width: 100%;
		padding: 6px 12px;
		border: none;
		background: none;
		border-radius: var(--radius-s);
		color: var(--text-normal);
		cursor: pointer;
		font-size: var(--font-ui-small);
		transition: background 0.1s ease;
		text-align: left;
	}
	.launchpad-recent-item:hover {
		background: var(--background-modifier-hover);
	}
	.launchpad-recent-name {
		flex: 1;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}
	.launchpad-recent-time {
		font-size: var(--font-ui-smaller);
		color: var(--text-faint);
		margin-left: 12px;
		flex-shrink: 0;
	}
</style>
