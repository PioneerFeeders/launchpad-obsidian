// ============================================================
// Launchpad — Recent Files Manager
// ============================================================

import { Component, TAbstractFile, TFile, type App } from "obsidian";
import { get } from "svelte/store";
import type Launchpad from "../main";
import { recentFilesStore } from "../store";
import type { RecentFileEntry, RecentFileStored } from "../types";

export class RecentFileManager extends Component {
	private app: App;
	private plugin: Launchpad;

	constructor(app: App, plugin: Launchpad) {
		super();
		this.app = app;
		this.plugin = plugin;
	}

	onload(): void {
		this.registerEvent(
			this.app.workspace.on("file-open", async (file) => {
				if (file) this.updateRecentFiles(file);
				await this.storeRecentFiles();
			})
		);
		this.registerEvent(
			this.app.vault.on("delete", async (file) => {
				if (file instanceof TFile) this.removeRecentFile(file);
				await this.storeRecentFiles();
			})
		);
		this.registerEvent(
			this.app.vault.on("rename", (file) => {
				if (file instanceof TFile) {
					recentFilesStore.update((arr) => arr);
				}
			})
		);

		this.loadStoredRecentFiles();
	}

	private updateRecentFiles(openedFile: TFile): void {
		const maxFiles = this.plugin.settings.maxRecentFiles;

		recentFilesStore.update((filesArray) => {
			const existingIndex = filesArray.findIndex((item) => item.file.path === openedFile.path);

			if (existingIndex >= 0) {
				filesArray[existingIndex].timestamp = Date.now();
			} else if (filesArray.length >= maxFiles) {
				filesArray[filesArray.length - 1] = { file: openedFile, timestamp: Date.now() };
			} else {
				filesArray.push({ file: openedFile, timestamp: Date.now() });
			}

			return filesArray.sort((a, b) => b.timestamp - a.timestamp);
		});
	}

	removeRecentFile(file: TFile): void {
		recentFilesStore.update((filesArray) => {
			return filesArray.filter((rf) => rf.file.path !== file.path);
		});
		this.storeRecentFiles();
	}

	private async storeRecentFiles(): Promise<void> {
		if (!this.plugin.settings.storeRecentFiles) return;

		const stored: RecentFileStored[] = get(recentFilesStore).map((item) => ({
			filepath: item.file.path,
			timestamp: item.timestamp,
		}));

		this.plugin.settings.recentFilesStore = stored;
		await this.plugin.saveData(this.plugin.settings);
	}

	private loadStoredRecentFiles(): void {
		if (!this.plugin.settings.storeRecentFiles) return;

		this.app.workspace.onLayoutReady(() => {
			const filesToLoad: RecentFileEntry[] = [];
			for (const item of this.plugin.settings.recentFilesStore) {
				const file = this.app.vault.getAbstractFileByPath(item.filepath);
				if (file instanceof TFile) {
					filesToLoad.push({ file, timestamp: item.timestamp });
				}
			}
			recentFilesStore.set(filesToLoad.sort((a, b) => b.timestamp - a.timestamp));
		});
	}
}
