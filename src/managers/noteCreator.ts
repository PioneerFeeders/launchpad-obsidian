// ============================================================
// Launchpad — Note Creator
// ============================================================

import { normalizePath, type App, TFile } from "obsidian";
import type { CaptureState, Domain, LaunchpadFrontmatter, NoteType } from "../types";
import { eisenhowerFromChoice } from "../types";
import { getNoteTypeConfig, BUSINESS_IDEA_PROBLEM } from "../domainConfig";

export class NoteCreator {
	private app: App;

	constructor(app: App) {
		this.app = app;
	}

	async createNote(state: CaptureState): Promise<TFile | null> {
		if (!state.domain || !state.noteType || !state.title) return null;

		const config = getNoteTypeConfig(state.domain, state.noteType);
		if (!config) return null;

		// Ensure folder exists
		const folderPath = normalizePath(config.folder);
		await this.ensureFolder(folderPath);

		// Build frontmatter
		const today = new Date().toISOString().split("T")[0];
		const frontmatter: LaunchpadFrontmatter = {
			type: state.noteType as NoteType,
			domain: state.domain as Domain,
			created: today,
			tags: [...config.tags],
		};

		// Add status for ideas and issues
		if (state.noteType === "idea") {
			frontmatter.status = "active";
		}
		if (state.noteType === "issue") {
			frontmatter.status = "active";
		}

		// Add Eisenhower for todos
		if (config.hasEisenhower && state.important !== null && state.urgent !== null) {
			frontmatter.eisenhower = eisenhowerFromChoice({
				important: state.important,
				urgent: state.urgent,
			});
			frontmatter.status = "active";
		}

		// Add due date
		if (state.dueDate) {
			frontmatter.due = state.dueDate;
		}

		// Add store for shopping lists
		if (state.store) {
			frontmatter.store = state.store;
		}

		// Use problem template variant for ideas sparked by problems
		let templateFn = config.templateFn;
		if (state.noteType === "idea" && state.problemSpark && state.domain === "business") {
			templateFn = BUSINESS_IDEA_PROBLEM.templateFn;
		}

		// Generate content
		const content = templateFn(state.title, frontmatter);

		// Create file
		const sanitizedTitle = state.title.replace(/[\\/:*?"<>|]/g, "-");
		const fileName = `${today} - ${sanitizedTitle}.md`;
		const filePath = normalizePath(`${folderPath}/${fileName}`);

		// Check for duplicate
		const existing = this.app.vault.getAbstractFileByPath(filePath);
		if (existing instanceof TFile) {
			return existing;
		}

		const file = await this.app.vault.create(filePath, content);
		return file;
	}

	async upgradeIdeaToProject(file: TFile): Promise<void> {
		const content = await this.app.vault.read(file);

		// Update frontmatter status from 'active' to 'project'
		const updated = content.replace(
			/^status: active$/m,
			"status: project"
		);

		// Add project sections if not already present
		const projectSection = `

## 🎯 Project Status
- **Phase:** Planning
- **Started:** ${new Date().toISOString().split("T")[0]}

## Linked Notes
<!-- Issues, logs, and SOPs related to this project will appear here -->

## Milestones
- [ ] 

`;

		const finalContent = updated.includes("## 🎯 Project Status")
			? updated
			: updated + projectSection;

		await this.app.vault.modify(file, finalContent);
	}

	private async ensureFolder(folderPath: string): Promise<void> {
		const parts = folderPath.split("/");
		let current = "";
		for (const part of parts) {
			current = current ? `${current}/${part}` : part;
			const normalized = normalizePath(current);
			if (!(await this.app.vault.adapter.exists(normalized))) {
				await this.app.vault.createFolder(normalized);
			}
		}
	}
}
