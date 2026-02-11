<script lang="ts">
	import { todosStore } from "../store";
	import type { TodoItem } from "../types";
	import { EISENHOWER_LABELS } from "../types";
	import type { View } from "obsidian";

	export let view: View;

	let todos: TodoItem[] = [];
	todosStore.subscribe((t) => (todos = t));

	$: doFirstTodos = todos.filter((t) => t.eisenhower === "do-first");
	$: scheduleTodos = todos.filter((t) => t.eisenhower === "schedule");
	$: businessDoFirst = doFirstTodos.filter((t) => t.domain === "business");
	$: personalDoFirst = doFirstTodos.filter((t) => t.domain === "personal");
	$: businessSchedule = scheduleTodos.filter((t) => t.domain === "business");
	$: personalSchedule = scheduleTodos.filter((t) => t.domain === "personal");

	$: hasItems = doFirstTodos.length > 0 || scheduleTodos.length > 0;

	function openFile(todo: TodoItem) {
		view.leaf.openFile(todo.file);
	}

	function formatDue(due: string | null): string {
		if (!due) return "";
		const d = new Date(due + "T00:00:00");
		const today = new Date();
		today.setHours(0, 0, 0, 0);
		const diff = Math.ceil((d.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
		if (diff < 0) return `⚠️ ${Math.abs(diff)}d overdue`;
		if (diff === 0) return "📅 Today";
		if (diff === 1) return "📅 Tomorrow";
		return `📅 ${diff}d`;
	}
</script>

{#if hasItems}
	<div class="launchpad-todos-section">
		<h3 class="launchpad-section-title">🔴 Do First</h3>

		{#if businessDoFirst.length > 0}
			<div class="launchpad-todo-group">
				<span class="launchpad-todo-group-label">🏢 Business</span>
				{#each businessDoFirst as todo}
					<button class="launchpad-todo-item" on:click={() => openFile(todo)}>
						<span class="launchpad-todo-title">{todo.title}</span>
						{#if todo.due}
							<span class="launchpad-todo-due" class:overdue={formatDue(todo.due).includes("overdue")}>{formatDue(todo.due)}</span>
						{/if}
					</button>
				{/each}
			</div>
		{/if}

		{#if personalDoFirst.length > 0}
			<div class="launchpad-todo-group">
				<span class="launchpad-todo-group-label">🏠 Personal</span>
				{#each personalDoFirst as todo}
					<button class="launchpad-todo-item" on:click={() => openFile(todo)}>
						<span class="launchpad-todo-title">{todo.title}</span>
						{#if todo.due}
							<span class="launchpad-todo-due" class:overdue={formatDue(todo.due).includes("overdue")}>{formatDue(todo.due)}</span>
						{/if}
					</button>
				{/each}
			</div>
		{/if}

		{#if scheduleTodos.length > 0}
			<h3 class="launchpad-section-title launchpad-section-title-sub">🟡 Scheduled</h3>

			{#if businessSchedule.length > 0}
				<div class="launchpad-todo-group">
					<span class="launchpad-todo-group-label">🏢 Business</span>
					{#each businessSchedule.slice(0, 3) as todo}
						<button class="launchpad-todo-item" on:click={() => openFile(todo)}>
							<span class="launchpad-todo-title">{todo.title}</span>
							{#if todo.due}
								<span class="launchpad-todo-due">{formatDue(todo.due)}</span>
							{/if}
						</button>
					{/each}
				</div>
			{/if}

			{#if personalSchedule.length > 0}
				<div class="launchpad-todo-group">
					<span class="launchpad-todo-group-label">🏠 Personal</span>
					{#each personalSchedule.slice(0, 3) as todo}
						<button class="launchpad-todo-item" on:click={() => openFile(todo)}>
							<span class="launchpad-todo-title">{todo.title}</span>
							{#if todo.due}
								<span class="launchpad-todo-due">{formatDue(todo.due)}</span>
							{/if}
						</button>
					{/each}
				</div>
			{/if}
		{/if}
	</div>
{/if}

<style>
	.launchpad-todos-section {
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
	.launchpad-section-title-sub {
		margin-top: 16px;
		font-size: var(--font-ui-small);
		color: var(--text-muted);
	}
	.launchpad-todo-group {
		margin-bottom: 8px;
	}
	.launchpad-todo-group-label {
		font-size: var(--font-ui-smaller);
		color: var(--text-faint);
		display: block;
		margin-bottom: 4px;
	}
	.launchpad-todo-item {
		display: flex;
		align-items: center;
		justify-content: space-between;
		width: 100%;
		padding: 8px 12px;
		border: none;
		background: var(--background-secondary);
		border-radius: var(--radius-s);
		color: var(--text-normal);
		cursor: pointer;
		margin-bottom: 4px;
		font-size: var(--font-ui-small);
		transition: background 0.1s ease;
		text-align: left;
	}
	.launchpad-todo-item:hover {
		background: var(--background-modifier-hover);
	}
	.launchpad-todo-title {
		flex: 1;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}
	.launchpad-todo-due {
		font-size: var(--font-ui-smaller);
		color: var(--text-muted);
		margin-left: 8px;
		flex-shrink: 0;
	}
	.launchpad-todo-due.overdue {
		color: var(--text-error);
	}
</style>
