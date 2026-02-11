// ============================================================
// Launchpad — HTML Utilities
// ============================================================

interface hotkeySuggestion {
	hotkey: string;
	action: string;
}

export function generateHotkeySuggestion(
	hotkeySuggestions: hotkeySuggestion[],
	containerClass: string
): HTMLElement {
	const hotkeySuggestionElement = createDiv(containerClass);

	hotkeySuggestions.forEach((hs) => {
		const el = hotkeySuggestionElement.createDiv("prompt-instruction");
		el.createEl("span", { text: hs.hotkey }).addClass("prompt-instruction-command");
		el.createEl("span", { text: hs.action });
	});

	return hotkeySuggestionElement;
}
