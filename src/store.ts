// ============================================================
// Launchpad — Svelte Stores
// ============================================================

import { writable } from "svelte/store";
import type { LaunchpadSettings } from "./settings";
import type { RecentFileEntry, ActiveProject, TodoItem, CaptureState } from "./types";
import { INITIAL_CAPTURE_STATE } from "./types";

export const settingsStore = writable<LaunchpadSettings>();
export const recentFilesStore = writable<RecentFileEntry[]>([]);
export const activeProjectsStore = writable<ActiveProject[]>([]);
export const todosStore = writable<TodoItem[]>([]);
export const captureStateStore = writable<CaptureState>({ ...INITIAL_CAPTURE_STATE });
export const showCaptureModal = writable<boolean>(false);
