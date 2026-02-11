// ============================================================
// Launchpad — Search Bar Controller
// ============================================================

import type { App, View } from "obsidian";
import type Launchpad from "./main";
import { writable, type Writable, get } from "svelte/store";
import HomeTabFileSuggester from "./suggester/homeTabSuggester";

export default class LaunchpadSearchBar {
	private app: App;
	protected view: View;
	protected plugin: Launchpad;

	public fileSuggester: HomeTabFileSuggester;
	public activeExtEl: Writable<HTMLElement>;
	public searchBarEl: Writable<HTMLInputElement>;
	public suggestionContainerEl: Writable<HTMLElement>;

	constructor(plugin: Launchpad, view: View) {
		this.app = view.app;
		this.view = view;
		this.plugin = plugin;
		this.searchBarEl = writable();
		this.activeExtEl = writable();
		this.suggestionContainerEl = writable();
	}

	public focusSearchbar(): void {
		const el = get(this.searchBarEl);
		if (el) el.focus();
	}

	public load(): void {
		this.fileSuggester = new HomeTabFileSuggester(
			this.plugin.app,
			this.plugin,
			this.view,
			this
		);
	}
}
