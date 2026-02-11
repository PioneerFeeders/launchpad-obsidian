<script lang="ts">
	import { settingsStore } from "../store";
	import type { LaunchpadSettings } from "../settings";
	import type LaunchpadSearchBar from "../searchBar";
	import type Launchpad from "../main";
	import type { View } from "obsidian";

	import Greeting from "./Greeting.svelte";
	import SearchBar from "./SearchBar.svelte";
	import QuickCapture from "./QuickCapture.svelte";
	import CaptureModal from "./CaptureModal.svelte";
	import TodosWidget from "./TodosWidget.svelte";
	import ProjectsWidget from "./ProjectsWidget.svelte";
	import RecentFiles from "./RecentFiles.svelte";

	export let view: View;
	export let searchBar: LaunchpadSearchBar;
	export let plugin: Launchpad;

	let settings: LaunchpadSettings;
	settingsStore.subscribe((s) => {
		if (s) settings = s;
	});
</script>

<main class="launchpad-home">
	<Greeting />

	<SearchBar {searchBar} />

	<QuickCapture />

	<CaptureModal {view} />

	{#if settings?.showTodos}
		<TodosWidget {view} />
	{/if}

	{#if settings?.showActiveProjects}
		<ProjectsWidget {view} />
	{/if}

	{#if settings?.showRecentFiles}
		<RecentFiles {view} />
	{/if}
</main>

<style>
	.launchpad-home {
		width: 100%;
		height: 100%;
		overflow-y: auto;
		padding-bottom: 40px;
	}
</style>
