// ============================================================
// Launchpad — Main Plugin
// ============================================================

import { Plugin, WorkspaceLeaf } from "obsidian";
import { LaunchpadView, VIEW_TYPE } from "./launchpadView";
import { LaunchpadSettingTab, DEFAULT_SETTINGS, type LaunchpadSettings } from "./settings";
import { settingsStore } from "./store";
import { RecentFileManager } from "./managers/recentFiles";
import { DashboardManager } from "./managers/dashboardManager";

declare module "obsidian" {
	interface App {
		internalPlugins: InternalPlugins;
		plugins: Plugins;
		dom: any;
		isMobile: boolean;
	}
	interface InternalPlugins {
		getPluginById: Function;
		plugins: Record<string, any>;
	}
	interface Plugins {
		getPlugin: (id: string) => any;
	}
	interface Workspace {
		createLeafInTabGroup: Function;
	}
	interface WorkspaceLeaf {
		rebuildView: Function;
		activeTime: number;
		app: App;
	}
	interface TFile {
		deleted: boolean;
	}
	interface MetadataCache {
		getBacklinksForFile: (file: any) => any;
	}
}

export default class Launchpad extends Plugin {
	settings: LaunchpadSettings;
	recentFileManager: RecentFileManager;
	dashboardManager: DashboardManager;

	async onload() {
		console.log("Loading Launchpad plugin");

		await this.loadSettings();
		this.addSettingTab(new LaunchpadSettingTab(this.app, this));
		this.registerView(VIEW_TYPE, (leaf) => new LaunchpadView(leaf, this));

		// Replace new tabs with Launchpad
		this.registerEvent(
			this.app.workspace.on("layout-change", () => this.onLayoutChange())
		);

		// Refocus search bar on leaf change
		this.registerEvent(
			this.app.workspace.on("active-leaf-change", (leaf: WorkspaceLeaf) => {
				if (leaf?.view instanceof LaunchpadView) {
					leaf.view.searchBar.focusSearchbar();
				}
			})
		);

		// Store settings for Svelte components
		settingsStore.set(this.settings);

		// Initialize managers
		this.recentFileManager = new RecentFileManager(this.app, this);
		this.recentFileManager.load();

		this.dashboardManager = new DashboardManager(this.app, this);
		this.dashboardManager.load();

		// Commands
		this.addCommand({
			id: "open-new-launchpad",
			name: "Open new Launchpad tab",
			callback: () => this.activateView(false, true),
		});
		this.addCommand({
			id: "replace-with-launchpad",
			name: "Replace current tab with Launchpad",
			callback: () => this.activateView(true),
		});
		this.addCommand({
			id: "refresh-dashboard",
			name: "Refresh dashboard data",
			callback: () => this.dashboardManager.refresh(),
		});

		// On layout ready
		this.app.workspace.onLayoutReady(() => {
			if (this.settings.newTabOnStart) {
				const leaves = this.app.workspace.getLeavesOfType(VIEW_TYPE);
				if (leaves.length > 0) {
					this.app.workspace.revealLeaf(leaves[0]);
					leaves.forEach((leaf, index) => {
						if (index > 0) leaf.detach();
					});
				} else {
					this.activateView(false, true);
				}

				if (this.settings.closePreviousSessionTabs) {
					const leafTypes: string[] = [];
					this.app.workspace.iterateRootLeaves((leaf) => {
						const leafType = leaf.view.getViewType();
						if (!leafTypes.includes(leafType) && leafType !== VIEW_TYPE) {
							leafTypes.push(leafType);
						}
					});
					leafTypes.forEach((type) =>
						this.app.workspace.detachLeavesOfType(type)
					);
				}
			}
		});
	}

	onunload(): void {
		this.app.workspace.detachLeavesOfType(VIEW_TYPE);
		this.recentFileManager?.unload();
		this.dashboardManager?.unload();
	}

	async loadSettings(): Promise<void> {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings(): Promise<void> {
		await this.saveData(this.settings);
		settingsStore.update(() => this.settings);
	}

	private onLayoutChange(): void {
		if (this.settings.replaceNewTabs) {
			this.activateView();
		}
	}

	public activateView(overrideView?: boolean, openNewTab?: boolean): void {
		const leaf = openNewTab
			? this.app.workspace.getLeaf("tab")
			: this.app.workspace.getMostRecentLeaf();

		if (leaf && (overrideView || leaf.getViewState().type === "empty")) {
			leaf.setViewState({ type: VIEW_TYPE });
			if (openNewTab) {
				this.app.workspace.revealLeaf(leaf);
			}
		}
	}

	public refreshOpenViews(): void {
		this.app.workspace
			.getLeavesOfType(VIEW_TYPE)
			.forEach((leaf) => leaf.rebuildView());
	}
}
