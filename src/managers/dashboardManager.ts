// ============================================================
// Launchpad — Dashboard Data Manager
// ============================================================

import { Component, TFile, type App } from "obsidian";
import type Launchpad from "../main";
import { activeProjectsStore, todosStore } from "../store";
import type { ActiveProject, TodoItem, Domain, EisenhowerQuadrant, NoteStatus } from "../types";

export class DashboardManager extends Component {
	private app: App;
	private plugin: Launchpad;
	private refreshTimer: ReturnType<typeof setInterval> | null = null;

	constructor(app: App, plugin: Launchpad) {
		super();
		this.app = app;
		this.plugin = plugin;
	}

	onload(): void {
		// Initial scan once layout is ready
		this.app.workspace.onLayoutReady(() => {
			this.refresh();
		});

		// Refresh on file changes
		this.registerEvent(this.app.vault.on("modify", () => this.debouncedRefresh()));
		this.registerEvent(this.app.vault.on("create", () => this.debouncedRefresh()));
		this.registerEvent(this.app.vault.on("delete", () => this.debouncedRefresh()));
		this.registerEvent(this.app.vault.on("rename", () => this.debouncedRefresh()));
		this.registerEvent(this.app.metadataCache.on("resolved", () => this.debouncedRefresh()));
	}

	onunload(): void {
		if (this.refreshTimer) {
			clearTimeout(this.refreshTimer);
		}
	}

	private debounceTimeout: ReturnType<typeof setTimeout> | null = null;
	private debouncedRefresh(): void {
		if (this.debounceTimeout) clearTimeout(this.debounceTimeout);
		this.debounceTimeout = setTimeout(() => this.refresh(), 500);
	}

	public refresh(): void {
		this.scanTodos();
		this.scanActiveProjects();
	}

	private scanTodos(): void {
		const todos: TodoItem[] = [];
		const files = this.app.vault.getMarkdownFiles();

		for (const file of files) {
			const cache = this.app.metadataCache.getFileCache(file);
			const fm = cache?.frontmatter;

			if (!fm) continue;
			if (fm.type !== "todo") continue;
			if (fm.status === "resolved" || fm.status === "archived") continue;

			const domain = fm.domain as Domain;
			const eisenhower = fm.eisenhower as EisenhowerQuadrant;

			if (!domain || !eisenhower) continue;

			todos.push({
				file,
				title: file.basename.replace(/^\d{4}-\d{2}-\d{2}\s*-\s*/, ""),
				domain,
				eisenhower,
				due: fm.due || null,
				status: (fm.status as NoteStatus) || "active",
			});
		}

		// Sort: do-first first, then by due date
		const quadrantOrder: Record<EisenhowerQuadrant, number> = {
			"do-first": 0,
			schedule: 1,
			delegate: 2,
			drop: 3,
		};

		todos.sort((a, b) => {
			const qDiff = quadrantOrder[a.eisenhower] - quadrantOrder[b.eisenhower];
			if (qDiff !== 0) return qDiff;
			if (a.due && b.due) return a.due.localeCompare(b.due);
			if (a.due) return -1;
			if (b.due) return 1;
			return 0;
		});

		todosStore.set(todos);
	}

	private scanActiveProjects(): void {
		const projects: ActiveProject[] = [];
		const files = this.app.vault.getMarkdownFiles();

		for (const file of files) {
			const cache = this.app.metadataCache.getFileCache(file);
			const fm = cache?.frontmatter;

			if (!fm) continue;
			if (fm.status !== "project") continue;

			const domain = fm.domain as Domain;
			if (!domain) continue;

			// Count linked notes (notes that link to this project)
			const linkedCount = this.countBacklinks(file);

			projects.push({
				file,
				title: file.basename.replace(/^\d{4}-\d{2}-\d{2}\s*-\s*/, ""),
				domain,
				linkedCount,
			});
		}

		activeProjectsStore.set(projects);
	}

	private countBacklinks(file: TFile): number {
		// Count how many other files link to this file
		const backlinks = this.app.metadataCache.getBacklinksForFile(file);
		return backlinks ? backlinks.count() : 0;
	}
}
