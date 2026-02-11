// ============================================================
// Launchpad — Core Types
// ============================================================

import type { TFile } from "obsidian";

// --- Domains ---
export type Domain = "business" | "personal" | "lists";

// --- Note Types per Domain ---
export type BusinessNoteType =
	| "idea"
	| "issue"
	| "log"
	| "sop"
	| "contact"
	| "todo";

export type PersonalNoteType = "idea" | "reference" | "people" | "todo";

export type ListNoteType = "shopping" | "checklist" | "scratch";

export type NoteType = BusinessNoteType | PersonalNoteType | ListNoteType;

// --- Eisenhower Matrix ---
export type EisenhowerQuadrant =
	| "do-first"
	| "schedule"
	| "delegate"
	| "drop";

export interface EisenhowerChoice {
	important: boolean;
	urgent: boolean;
}

export function eisenhowerFromChoice(choice: EisenhowerChoice): EisenhowerQuadrant {
	if (choice.important && choice.urgent) return "do-first";
	if (choice.important && !choice.urgent) return "schedule";
	if (!choice.important && choice.urgent) return "delegate";
	return "drop";
}

export const EISENHOWER_LABELS: Record<EisenhowerQuadrant, { label: string; emoji: string; description: string }> = {
	"do-first": { label: "Do First", emoji: "🔴", description: "Important & Urgent" },
	schedule: { label: "Schedule", emoji: "🟡", description: "Important & Not Urgent" },
	delegate: { label: "Delegate", emoji: "🔵", description: "Not Important & Urgent" },
	drop: { label: "Drop / Batch", emoji: "⚪", description: "Not Important & Not Urgent" },
};

// --- Note Status ---
export type NoteStatus = "active" | "resolved" | "archived" | "project";

// --- Frontmatter ---
export interface LaunchpadFrontmatter {
	type: NoteType;
	domain: Domain;
	status?: NoteStatus;
	eisenhower?: EisenhowerQuadrant;
	due?: string; // ISO date string
	created: string; // ISO date string
	tags: string[];
	store?: string; // For shopping lists
	"item-domain"?: "business" | "personal"; // For shopping list items
}

// --- Domain Configuration ---
export interface NoteTypeConfig {
	id: NoteType;
	label: string;
	emoji: string;
	folder: string;
	tags: string[];
	hasEisenhower: boolean;
	templateFn: (title: string, frontmatter: LaunchpadFrontmatter) => string;
}

export interface DomainConfig {
	id: Domain;
	label: string;
	emoji: string;
	folder: string;
	noteTypes: NoteTypeConfig[];
}

// --- Capture Flow State ---
export type CaptureStep = "domain" | "type" | "eisenhower" | "details" | "done";

export interface CaptureState {
	step: CaptureStep;
	domain: Domain | null;
	noteType: NoteType | null;
	title: string;
	eisenhower: EisenhowerQuadrant | null;
	dueDate: string | null;
	important: boolean | null;
	urgent: boolean | null;
	store: string | null; // For shopping lists
	problemSpark: boolean; // Did user pick "Something's broken" for ideas?
}

export const INITIAL_CAPTURE_STATE: CaptureState = {
	step: "domain",
	domain: null,
	noteType: null,
	title: "",
	eisenhower: null,
	dueDate: null,
	important: null,
	urgent: null,
	store: null,
	problemSpark: false,
};

// --- Recent file type ---
export interface RecentFileEntry {
	file: TFile;
	timestamp: number;
}

export interface RecentFileStored {
	filepath: string;
	timestamp: number;
}

// --- Active Project ---
export interface ActiveProject {
	file: TFile;
	title: string;
	domain: Domain;
	linkedCount: number;
}

// --- Todo Item ---
export interface TodoItem {
	file: TFile;
	title: string;
	domain: Domain;
	eisenhower: EisenhowerQuadrant;
	due: string | null;
	status: NoteStatus;
}
