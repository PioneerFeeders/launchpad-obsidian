<script lang="ts">
	import { activeProjectsStore } from "../store";
	import type { ActiveProject } from "../types";
	import type { View } from "obsidian";

	export let view: View;

	let projects: ActiveProject[] = [];
	activeProjectsStore.subscribe((p) => (projects = p));

	function openProject(project: ActiveProject) {
		view.leaf.openFile(project.file);
	}
</script>

{#if projects.length > 0}
	<div class="launchpad-projects-section">
		<h3 class="launchpad-section-title">🎯 Active Projects</h3>
		<div class="launchpad-projects-grid">
			{#each projects as project}
				<button class="launchpad-project-card" on:click={() => openProject(project)}>
					<div class="launchpad-project-domain">
						{project.domain === "business" ? "🏢" : "🏠"}
					</div>
					<div class="launchpad-project-info">
						<span class="launchpad-project-title">{project.title}</span>
						{#if project.linkedCount > 0}
							<span class="launchpad-project-links">🔗 {project.linkedCount} linked</span>
						{/if}
					</div>
				</button>
			{/each}
		</div>
	</div>
{/if}

<style>
	.launchpad-projects-section {
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
	.launchpad-projects-grid {
		display: flex;
		flex-wrap: wrap;
		gap: 8px;
	}
	.launchpad-project-card {
		display: flex;
		align-items: center;
		gap: 10px;
		padding: 10px 14px;
		background: var(--background-secondary);
		border: 1px solid var(--background-modifier-border);
		border-radius: var(--radius-m);
		cursor: pointer;
		transition: all 0.12s ease;
		color: var(--text-normal);
		text-align: left;
	}
	.launchpad-project-card:hover {
		border-color: var(--interactive-accent);
		background: var(--background-modifier-hover);
		transform: translateY(-1px);
	}
	.launchpad-project-domain {
		font-size: 1.2em;
	}
	.launchpad-project-info {
		display: flex;
		flex-direction: column;
	}
	.launchpad-project-title {
		font-size: var(--font-ui-small);
		font-weight: 500;
	}
	.launchpad-project-links {
		font-size: var(--font-ui-smaller);
		color: var(--text-faint);
	}
</style>
