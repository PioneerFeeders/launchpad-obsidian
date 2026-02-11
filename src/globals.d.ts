import type { App } from "obsidian";

declare global {
	var app: App;
	function createDiv(cls?: string): HTMLDivElement;
	function createEl<K extends keyof HTMLElementTagNameMap>(
		tag: K,
		o?: string | DomElementInfo
	): HTMLElementTagNameMap[K];
}
