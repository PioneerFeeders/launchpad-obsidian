<script lang="ts">
	import { onDestroy } from "svelte";
	import { captureStateStore, showCaptureModal } from "../store";
	import { INITIAL_CAPTURE_STATE, type NoteType, type CaptureState } from "../types";
	import { getDomainConfig, type NoteTypeConfig } from "../domainConfig";
	import { NoteCreator } from "../managers/noteCreator";
	import type { View } from "obsidian";

	export let view: View;

	let state: CaptureState;
	captureStateStore.subscribe((s) => (state = s));

	let visible = false;
	showCaptureModal.subscribe((v) => (visible = v));

	const noteCreator = new NoteCreator(view.app);

	// Get note types for current domain
	$: domainConfig = state.domain ? getDomainConfig(state.domain) : null;
	$: noteTypes = domainConfig?.noteTypes || [];

	function selectType(config: NoteTypeConfig) {
		captureStateStore.update((s) => ({
			...s,
			noteType: config.id,
			step: config.hasEisenhower ? "eisenhower" : "details",
		}));
	}

	function selectIdeaSpark(isProblem: boolean) {
		captureStateStore.update((s) => ({
			...s,
			noteType: "idea" as NoteType,
			problemSpark: isProblem,
			step: "details",
		}));
	}

	function setImportant(val: boolean) {
		captureStateStore.update((s) => ({ ...s, important: val }));
	}

	function setUrgent(val: boolean) {
		captureStateStore.update((s) => ({ ...s, urgent: val }));
	}

	function confirmEisenhower() {
		if (state.important !== null && state.urgent !== null) {
			captureStateStore.update((s) => ({ ...s, step: "details" }));
		}
	}

	function setTitle(e: Event) {
		const val = (e.target as HTMLInputElement).value;
		captureStateStore.update((s) => ({ ...s, title: val }));
	}

	function setDueDate(e: Event) {
		const val = (e.target as HTMLInputElement).value;
		captureStateStore.update((s) => ({ ...s, dueDate: val || null }));
	}

	function setStore(e: Event) {
		const val = (e.target as HTMLInputElement).value;
		captureStateStore.update((s) => ({ ...s, store: val || null }));
	}

	async function createNote() {
		if (!state.title.trim()) return;
		const file = await noteCreator.createNote(state);
		if (file) {
			view.leaf.openFile(file);
		}
		close();
	}

	function close() {
		showCaptureModal.set(false);
		captureStateStore.set({ ...INITIAL_CAPTURE_STATE });
	}

	function goBack() {
		captureStateStore.update((s) => {
			if (s.step === "details" && s.noteType === "todo") return { ...s, step: "eisenhower" };
			if (s.step === "details") return { ...s, step: "type", noteType: null };
			if (s.step === "eisenhower") return { ...s, step: "type", noteType: null, important: null, urgent: null };
			if (s.step === "type") { close(); return s; }
			return s;
		});
	}

	// Handle escape key
	function handleKeydown(e: KeyboardEvent) {
		if (e.key === "Escape") close();
		if (e.key === "Enter" && state.step === "details" && state.title.trim()) createNote();
	}

	// Show idea sub-choice (idea vs problem/solution)
	let showIdeaChoice = false;
	function handleIdeaClick() {
		if (state.domain === "business") {
			showIdeaChoice = true;
		} else {
			selectType(noteTypes.find((nt) => nt.id === "idea")!);
		}
	}
</script>

<svelte:window on:keydown={handleKeydown} />

{#if visible}
	<div class="launchpad-modal-overlay" on:click|self={close}>
		<div class="launchpad-modal">
			<!-- Header -->
			<div class="launchpad-modal-header">
				{#if state.step !== "type" || showIdeaChoice}
					<button class="launchpad-modal-back" on:click={() => { if (showIdeaChoice) { showIdeaChoice = false; } else { goBack(); } }}>
						← Back
					</button>
				{/if}
				<h3 class="launchpad-modal-title">
					{#if state.step === "type"}
						{domainConfig?.emoji} New {domainConfig?.label} Note
					{:else if state.step === "eisenhower"}
						✅ Prioritize
					{:else if state.step === "details"}
						📝 Details
					{/if}
				</h3>
			</div>

			<!-- Step: Pick Note Type -->
			{#if state.step === "type" && !showIdeaChoice}
				<div class="launchpad-modal-grid">
					{#each noteTypes as nt}
						<button
							class="launchpad-type-btn"
							on:click={() => nt.id === "idea" ? handleIdeaClick() : selectType(nt)}
						>
							<span class="launchpad-type-emoji">{nt.emoji}</span>
							<span class="launchpad-type-label">{nt.label}</span>
						</button>
					{/each}
				</div>
			{/if}

			<!-- Step: Idea sub-choice (business only) -->
			{#if state.step === "type" && showIdeaChoice}
				<p class="launchpad-modal-subtitle">What sparked this?</p>
				<div class="launchpad-modal-grid">
					<button class="launchpad-type-btn" on:click={() => { showIdeaChoice = false; selectIdeaSpark(false); }}>
						<span class="launchpad-type-emoji">💡</span>
						<span class="launchpad-type-label">I have an idea</span>
					</button>
					<button class="launchpad-type-btn" on:click={() => { showIdeaChoice = false; selectIdeaSpark(true); }}>
						<span class="launchpad-type-emoji">🔧</span>
						<span class="launchpad-type-label">Something's broken</span>
					</button>
				</div>
			{/if}

			<!-- Step: Eisenhower Matrix -->
			{#if state.step === "eisenhower"}
				<div class="launchpad-eisenhower">
					<div class="launchpad-eisenhower-row">
						<label class="launchpad-eisenhower-label">How important?</label>
						<div class="launchpad-eisenhower-btns">
							<button
								class="launchpad-eisenhower-btn"
								class:selected={state.important === true}
								on:click={() => setImportant(true)}
							>Important</button>
							<button
								class="launchpad-eisenhower-btn"
								class:selected={state.important === false}
								on:click={() => setImportant(false)}
							>Not Important</button>
						</div>
					</div>
					<div class="launchpad-eisenhower-row">
						<label class="launchpad-eisenhower-label">How urgent?</label>
						<div class="launchpad-eisenhower-btns">
							<button
								class="launchpad-eisenhower-btn"
								class:selected={state.urgent === true}
								on:click={() => setUrgent(true)}
							>Urgent</button>
							<button
								class="launchpad-eisenhower-btn"
								class:selected={state.urgent === false}
								on:click={() => setUrgent(false)}
							>Not Urgent</button>
						</div>
					</div>
					{#if state.important !== null && state.urgent !== null}
						<div class="launchpad-eisenhower-result">
							{#if state.important && state.urgent}
								🔴 Do First — Handle this now
							{:else if state.important && !state.urgent}
								🟡 Schedule — Important but can wait
							{:else if !state.important && state.urgent}
								🔵 Delegate — Urgent but not critical
							{:else}
								⚪ Drop / Batch — Low priority
							{/if}
						</div>
						<button class="launchpad-primary-btn" on:click={confirmEisenhower}>
							Continue →
						</button>
					{/if}
				</div>
			{/if}

			<!-- Step: Details (title, due date) -->
			{#if state.step === "details"}
				<div class="launchpad-details">
					<div class="launchpad-field">
						<label class="launchpad-field-label">Title</label>
						<!-- svelte-ignore a11y-autofocus -->
						<input
							type="text"
							class="launchpad-field-input"
							placeholder={state.noteType === "shopping" ? "e.g., Menards Run" : state.noteType === "contact" ? "e.g., Joe at Reptile Supply" : "What's this about?"}
							value={state.title}
							on:input={setTitle}
							autofocus
						/>
					</div>

					{#if state.noteType === "shopping"}
						<div class="launchpad-field">
							<label class="launchpad-field-label">Store (optional)</label>
							<input
								type="text"
								class="launchpad-field-input"
								placeholder="e.g., Menards, Amazon, Grocery"
								value={state.store || ""}
								on:input={setStore}
							/>
						</div>
					{/if}

					{#if state.noteType === "todo"}
						<div class="launchpad-field">
							<label class="launchpad-field-label">Due date (optional)</label>
							<input
								type="date"
								class="launchpad-field-input"
								value={state.dueDate || ""}
								on:input={setDueDate}
							/>
						</div>
					{/if}

					<button
						class="launchpad-primary-btn"
						class:disabled={!state.title.trim()}
						on:click={createNote}
					>
						Create Note →
					</button>
				</div>
			{/if}
		</div>
	</div>
{/if}

<style>
	.launchpad-modal-overlay {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background: rgba(0, 0, 0, 0.5);
		display: flex;
		align-items: center;
		justify-content: center;
		z-index: var(--layer-modal);
	}
	.launchpad-modal {
		background: var(--background-primary);
		border-radius: var(--radius-l);
		border: 1px solid var(--background-modifier-border);
		padding: 24px;
		min-width: 350px;
		max-width: 480px;
		width: 90%;
		box-shadow: var(--shadow-s);
	}
	.launchpad-modal-header {
		display: flex;
		align-items: center;
		gap: 12px;
		margin-bottom: 20px;
	}
	.launchpad-modal-back {
		background: none;
		border: none;
		color: var(--text-muted);
		cursor: pointer;
		font-size: var(--font-ui-small);
		padding: 4px 8px;
		border-radius: var(--radius-s);
	}
	.launchpad-modal-back:hover {
		color: var(--text-normal);
		background: var(--background-modifier-hover);
	}
	.launchpad-modal-title {
		margin: 0;
		font-size: 1.2em;
		font-weight: 600;
	}
	.launchpad-modal-subtitle {
		color: var(--text-muted);
		margin: 0 0 16px 0;
		font-size: var(--font-ui-medium);
	}
	.launchpad-modal-grid {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: 10px;
	}
	.launchpad-type-btn {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 6px;
		padding: 16px 12px;
		border-radius: var(--radius-m);
		border: 1px solid var(--background-modifier-border);
		background: var(--background-secondary);
		color: var(--text-normal);
		cursor: pointer;
		transition: all 0.12s ease;
	}
	.launchpad-type-btn:hover {
		background: var(--background-modifier-hover);
		border-color: var(--interactive-accent);
		transform: translateY(-1px);
	}
	.launchpad-type-emoji {
		font-size: 1.5em;
	}
	.launchpad-type-label {
		font-size: var(--font-ui-small);
		font-weight: 500;
	}

	/* Eisenhower */
	.launchpad-eisenhower {
		display: flex;
		flex-direction: column;
		gap: 16px;
	}
	.launchpad-eisenhower-row {
		display: flex;
		flex-direction: column;
		gap: 8px;
	}
	.launchpad-eisenhower-label {
		font-weight: 500;
		font-size: var(--font-ui-medium);
	}
	.launchpad-eisenhower-btns {
		display: flex;
		gap: 8px;
	}
	.launchpad-eisenhower-btn {
		flex: 1;
		padding: 10px;
		border-radius: var(--radius-m);
		border: 1px solid var(--background-modifier-border);
		background: var(--background-secondary);
		color: var(--text-normal);
		cursor: pointer;
		font-size: var(--font-ui-small);
		transition: all 0.12s ease;
	}
	.launchpad-eisenhower-btn:hover {
		background: var(--background-modifier-hover);
	}
	.launchpad-eisenhower-btn.selected {
		background: var(--interactive-accent);
		color: var(--text-on-accent);
		border-color: var(--interactive-accent);
	}
	.launchpad-eisenhower-result {
		text-align: center;
		padding: 12px;
		background: var(--background-secondary);
		border-radius: var(--radius-m);
		font-weight: 500;
	}

	/* Details */
	.launchpad-details {
		display: flex;
		flex-direction: column;
		gap: 16px;
	}
	.launchpad-field {
		display: flex;
		flex-direction: column;
		gap: 6px;
	}
	.launchpad-field-label {
		font-weight: 500;
		font-size: var(--font-ui-small);
		color: var(--text-muted);
	}
	.launchpad-field-input {
		padding: 8px 12px;
		border-radius: var(--radius-m);
		border: 1px solid var(--background-modifier-border);
		background: var(--background-modifier-form-field);
		font-size: var(--font-ui-medium);
		color: var(--text-normal);
	}
	.launchpad-field-input:focus {
		border-color: var(--interactive-accent);
		outline: none;
	}
	.launchpad-primary-btn {
		padding: 10px 20px;
		border-radius: var(--radius-m);
		border: none;
		background: var(--interactive-accent);
		color: var(--text-on-accent);
		font-size: var(--font-ui-medium);
		font-weight: 500;
		cursor: pointer;
		transition: opacity 0.12s ease;
	}
	.launchpad-primary-btn:hover {
		opacity: 0.9;
	}
	.launchpad-primary-btn.disabled {
		opacity: 0.4;
		cursor: not-allowed;
	}
</style>
