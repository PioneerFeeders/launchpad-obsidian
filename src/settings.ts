// ============================================================
// Launchpad — Settings
// ============================================================

import { App, PluginSettingTab, Setting } from "obsidian";
import type Launchpad from "./main";
import type { RecentFileStored } from "./types";

export interface LaunchpadSettings {
	// Greeting
	userName: string;

	// Search
	maxResults: number;
	searchDelay: number;
	markdownOnly: boolean;
	unresolvedLinks: boolean;
	showPath: boolean;
	showShortcuts: boolean;

	// Dashboard
	showTodos: boolean;
	showActiveProjects: boolean;
	showRecentFiles: boolean;
	maxRecentFiles: number;
	storeRecentFiles: boolean;
	recentFilesStore: RecentFileStored[];

	// Tab behavior
	replaceNewTabs: boolean;
	newTabOnStart: boolean;
	closePreviousSessionTabs: boolean;

	// Appearance
	selectionHighlight: "default" | "accentColor";
}

export const DEFAULT_SETTINGS: LaunchpadSettings = {
	userName: "Justin",
	maxResults: 5,
	searchDelay: 0,
	markdownOnly: false,
	unresolvedLinks: false,
	showPath: true,
	showShortcuts: true,
	showTodos: true,
	showActiveProjects: true,
	showRecentFiles: true,
	maxRecentFiles: 5,
	storeRecentFiles: true,
	recentFilesStore: [],
	replaceNewTabs: true,
	newTabOnStart: false,
	closePreviousSessionTabs: false,
	selectionHighlight: "default",
};

export class LaunchpadSettingTab extends PluginSettingTab {
	plugin: Launchpad;

	constructor(app: App, plugin: Launchpad) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const { containerEl } = this;
		containerEl.empty();

		containerEl.createEl("h3", { text: "Launchpad Settings" });

		// --- Greeting ---
		containerEl.createEl("h2", { text: "Greeting" });

		new Setting(containerEl)
			.setName("Your name")
			.setDesc("Used in the dashboard greeting.")
			.addText((text) =>
				text
					.setPlaceholder("Justin")
					.setValue(this.plugin.settings.userName)
					.onChange(async (value) => {
						this.plugin.settings.userName = value;
						await this.plugin.saveSettings();
					})
			);

		// --- Tab Behavior ---
		containerEl.createEl("h2", { text: "Tab Behavior" });

		new Setting(containerEl)
			.setName("Replace new tabs with Launchpad")
			.addToggle((toggle) =>
				toggle.setValue(this.plugin.settings.replaceNewTabs).onChange(async (value) => {
					this.plugin.settings.replaceNewTabs = value;
					await this.plugin.saveSettings();
				})
			);

		new Setting(containerEl)
			.setName("Open Launchpad on start")
			.setDesc("Opens a Launchpad tab when Obsidian starts.")
			.addToggle((toggle) =>
				toggle.setValue(this.plugin.settings.newTabOnStart).onChange(async (value) => {
					this.plugin.settings.newTabOnStart = value;
					await this.plugin.saveSettings();
					this.display();
				})
			);

		if (this.plugin.settings.newTabOnStart) {
			new Setting(containerEl)
				.setName("Close previous session tabs on start")
				.addToggle((toggle) =>
					toggle.setValue(this.plugin.settings.closePreviousSessionTabs).onChange(async (value) => {
						this.plugin.settings.closePreviousSessionTabs = value;
						await this.plugin.saveSettings();
					})
				);
		}

		// --- Search ---
		containerEl.createEl("h2", { text: "Search" });

		new Setting(containerEl)
			.setName("Search results")
			.setDesc("Maximum number of results to display.")
			.addSlider((slider) =>
				slider
					.setLimits(1, 25, 1)
					.setValue(this.plugin.settings.maxResults)
					.setDynamicTooltip()
					.onChange(async (value) => {
						this.plugin.settings.maxResults = value;
						await this.plugin.saveSettings();
					})
			);

		new Setting(containerEl)
			.setName("Search delay")
			.setDesc("Milliseconds to wait before searching (0 = instant).")
			.addSlider((slider) =>
				slider
					.setLimits(0, 500, 50)
					.setValue(this.plugin.settings.searchDelay)
					.setDynamicTooltip()
					.onChange(async (value) => {
						this.plugin.settings.searchDelay = value;
						await this.plugin.saveSettings();
					})
			);

		new Setting(containerEl)
			.setName("Search only markdown files")
			.addToggle((toggle) =>
				toggle.setValue(this.plugin.settings.markdownOnly).onChange(async (value) => {
					this.plugin.settings.markdownOnly = value;
					await this.plugin.saveSettings();
				})
			);

		new Setting(containerEl)
			.setName("Show file path")
			.addToggle((toggle) =>
				toggle.setValue(this.plugin.settings.showPath).onChange(async (value) => {
					this.plugin.settings.showPath = value;
					await this.plugin.saveSettings();
				})
			);

		new Setting(containerEl)
			.setName("Show keyboard shortcuts")
			.addToggle((toggle) =>
				toggle.setValue(this.plugin.settings.showShortcuts).onChange(async (value) => {
					this.plugin.settings.showShortcuts = value;
					await this.plugin.saveSettings();
				})
			);

		// --- Dashboard ---
		containerEl.createEl("h2", { text: "Dashboard" });

		new Setting(containerEl)
			.setName("Show today's todos")
			.addToggle((toggle) =>
				toggle.setValue(this.plugin.settings.showTodos).onChange(async (value) => {
					this.plugin.settings.showTodos = value;
					await this.plugin.saveSettings();
				})
			);

		new Setting(containerEl)
			.setName("Show active projects")
			.addToggle((toggle) =>
				toggle.setValue(this.plugin.settings.showActiveProjects).onChange(async (value) => {
					this.plugin.settings.showActiveProjects = value;
					await this.plugin.saveSettings();
				})
			);

		new Setting(containerEl)
			.setName("Show recent files")
			.addToggle((toggle) =>
				toggle.setValue(this.plugin.settings.showRecentFiles).onChange(async (value) => {
					this.plugin.settings.showRecentFiles = value;
					await this.plugin.saveSettings();
				})
			);

		new Setting(containerEl)
			.setName("Max recent files")
			.addSlider((slider) =>
				slider
					.setLimits(3, 15, 1)
					.setValue(this.plugin.settings.maxRecentFiles)
					.setDynamicTooltip()
					.onChange(async (value) => {
						this.plugin.settings.maxRecentFiles = value;
						await this.plugin.saveSettings();
					})
			);

		// --- Appearance ---
		containerEl.createEl("h2", { text: "Appearance" });

		new Setting(containerEl)
			.setName("Selection highlight")
			.addDropdown((dropdown) =>
				dropdown
					.addOption("default", "Theme default")
					.addOption("accentColor", "Accent color")
					.setValue(this.plugin.settings.selectionHighlight)
					.onChange(async (value: "default" | "accentColor") => {
						this.plugin.settings.selectionHighlight = value;
						await this.plugin.saveSettings();
					})
			);
	}
}
