<script lang="ts">
	import type Fuse from "fuse.js";
	import type { SearchFile } from "../../suggester/fuzzySearch";
	import type { TextInputSuggester } from "../../suggester/suggester";
	import Suggestion from "./suggestion.svelte";

	export let index: number;
	export let textInputSuggester: TextInputSuggester<SearchFile>;
	export let selectedItemIndex: number;
	export let suggestion: Fuse.FuseResult<SearchFile>;

	export let nameToDisplay: string;
	export let filePath: string | undefined = undefined;

	let suggestionItem = suggestion.item;
</script>

<Suggestion
	{index}
	{textInputSuggester}
	{selectedItemIndex}
	suggestionTitleClass={`suggestion-title home-tab-suggestion-title ${suggestionItem.isUnresolved ? "is-unresolved" : ""}`}
>
	<svelte:fragment slot="suggestion-title">
		<span>{nameToDisplay}</span>
		{#if suggestionItem.fileType !== "markdown"}
			<div class="nav-file-tag home-tab-suggestion-file-tag">
				{suggestionItem.extension}
			</div>
		{/if}
	</svelte:fragment>

	<svelte:fragment slot="suggestion-extra-content">
		{#if suggestionItem.isCreated && suggestionItem.aliases && suggestionItem.aliases?.includes(nameToDisplay)}
			<div class="home-tab-suggestion-description">
				<span>↳ {suggestionItem.basename}</span>
			</div>
		{/if}
	</svelte:fragment>

	<svelte:fragment slot="suggestion-aux">
		{#if !suggestionItem.isCreated}
			<div class="home-tab-suggestion-tip">
				{#if suggestionItem.isUnresolved}
					<span>⊕ Create</span>
				{:else}
					<div class="suggestion-hotkey">
						<span>↵ to create</span>
					</div>
				{/if}
			</div>
		{/if}
		{#if (suggestionItem.isCreated || suggestionItem.isUnresolved) && filePath}
			<div class="home-tab-suggestion-filepath">
				<span>📁 {filePath}</span>
			</div>
		{/if}
	</svelte:fragment>
</Suggestion>
