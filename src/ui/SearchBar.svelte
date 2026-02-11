<script lang="ts">
	import { Platform } from "obsidian";
	import type LaunchpadSearchBar from "../searchBar";

	export let searchBar: LaunchpadSearchBar;

	const searchBarEl = searchBar.searchBarEl;
	const activeExtEl = searchBar.activeExtEl;
	const container = searchBar.suggestionContainerEl;

	// @ts-ignore
	const isPhone = Platform.isPhone;

	let inputValue = "";
</script>

<div class="launchpad-searchbar-container" bind:this={$container}>
	<div
		class="launchpad-searchbar"
		style:width={isPhone ? "90%" : "50%"}
	>
		<div class="launchpad-search-icon">
			<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
				<circle cx="11" cy="11" r="8"></circle>
				<line x1="21" y1="21" x2="16.65" y2="16.65"></line>
			</svg>
		</div>
		<div class="nav-file-tag launchpad-filter-tag hide" bind:this={$activeExtEl}></div>
		<input
			type="search"
			spellcheck="false"
			placeholder="Search your vault..."
			bind:value={inputValue}
			bind:this={$searchBarEl}
		/>
	</div>
</div>

<style>
	.launchpad-searchbar-container {
		display: flex;
		align-items: center;
		flex-direction: column;
		margin-bottom: 24px;
	}
	.launchpad-searchbar {
		display: flex;
		align-items: center;
		min-width: 250px;
		max-width: 700px;
		margin: 0 auto;
		height: calc(var(--input-height) * 1.3);
		background-color: var(--background-modifier-form-field);
		border: var(--input-border-width) solid var(--background-modifier-border);
		padding: var(--size-2-3) var(--size-4-3);
		border-radius: var(--radius-l);
		outline: none;
		transition: border-color 0.15s ease;
	}
	.launchpad-searchbar:focus-within {
		border-color: var(--interactive-accent);
	}
	.launchpad-search-icon {
		display: flex;
		align-items: center;
		color: var(--text-muted);
		margin-right: 8px;
		flex-shrink: 0;
	}
	.launchpad-searchbar input {
		width: 100%;
		height: 100%;
		box-shadow: none;
		font-size: var(--font-ui-medium);
		background: none;
		border: none;
		padding: 0;
		color: var(--text-normal);
	}
	.launchpad-searchbar input:hover {
		background: none;
		border: none;
	}
	.launchpad-searchbar input:focus {
		box-shadow: none;
	}
	.launchpad-filter-tag.hide {
		display: none;
	}

	.launchpad-searchbar.is-active {
		border-bottom: none !important;
		border-bottom-left-radius: 0 !important;
		border-bottom-right-radius: 0 !important;
	}
</style>
