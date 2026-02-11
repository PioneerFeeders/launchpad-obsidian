// ============================================================
// Launchpad — View
// ============================================================

import { FileView, WorkspaceLeaf } from "obsidian";
import type Launchpad from "./main";
import Homepage from "./ui/Homepage.svelte";
import LaunchpadSearchBar from "./searchBar";

export const VIEW_TYPE = "launchpad-view";

export class LaunchpadView extends FileView {
	plugin: Launchpad;
	homepage: Homepage;
	searchBar: LaunchpadSearchBar;
	containerEl: HTMLElement;

	constructor(leaf: WorkspaceLeaf, plugin: Launchpad) {
		super(leaf);
		this.leaf = leaf;
		this.plugin = plugin;
		this.navigation = true;
		this.allowNoFile = true;
		this.icon = "rocket";

		this.searchBar = new LaunchpadSearchBar(this.plugin, this);
	}

	getViewType() {
		return VIEW_TYPE;
	}

	getDisplayText(): string {
		return "Launchpad";
	}

	async onOpen(): Promise<void> {
		this.homepage = new Homepage({
			target: this.contentEl,
			props: {
				plugin: this.plugin,
				view: this,
				searchBar: this.searchBar,
			},
		});
		this.searchBar.load();
		this.searchBar.focusSearchbar();
	}

	async onClose(): Promise<void> {
		this.searchBar.fileSuggester?.close();
		this.homepage?.$destroy();
	}
}
