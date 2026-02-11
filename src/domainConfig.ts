// ============================================================
// Launchpad — Domain & Note Type Configuration
// ============================================================

import type { DomainConfig, LaunchpadFrontmatter, NoteTypeConfig } from "./types";

// --- Template Helpers ---
function frontmatterBlock(fm: LaunchpadFrontmatter): string {
	const lines: string[] = ["---"];
	lines.push(`type: ${fm.type}`);
	lines.push(`domain: ${fm.domain}`);
	if (fm.status) lines.push(`status: ${fm.status}`);
	if (fm.eisenhower) lines.push(`eisenhower: ${fm.eisenhower}`);
	if (fm.due) lines.push(`due: ${fm.due}`);
	lines.push(`created: ${fm.created}`);
	lines.push(`tags: [${fm.tags.join(", ")}]`);
	if (fm.store) lines.push(`store: "${fm.store}"`);
	lines.push("---");
	return lines.join("\n");
}

// --- Business Note Types ---

const businessIdea: NoteTypeConfig = {
	id: "idea",
	label: "Idea",
	emoji: "💡",
	folder: "Business/Ideas",
	tags: ["business", "idea"],
	hasEisenhower: false,
	templateFn: (title, fm) => `${frontmatterBlock(fm)}

# 💡 ${title}

## The Spark
<!-- What inspired this idea? What problem does it solve? -->


## How It Works
<!-- Describe the concept -->


## Next Steps
<!-- What would need to happen to move this forward? -->


## Notes

`,
};

const businessIdeaProblem: NoteTypeConfig = {
	...businessIdea,
	templateFn: (title, fm) => `${frontmatterBlock(fm)}

# 🔧 ${title}

## What's Broken?
<!-- Describe the problem clearly -->


## Impact
<!-- How does this affect the business? Customers? Team? -->


## Possible Solutions
<!-- Brainstorm fixes -->
- 

## Next Steps

`,
};

const businessIssue: NoteTypeConfig = {
	id: "issue",
	label: "Issue",
	emoji: "🔧",
	folder: "Business/Issues",
	tags: ["business", "issue"],
	hasEisenhower: false,
	templateFn: (title, fm) => `${frontmatterBlock(fm)}

# 🔧 ${title}

## What's Wrong?
<!-- Describe the issue -->


## Impact
<!-- Severity: 🔴 Critical / 🟡 Moderate / 🟢 Low -->


## Steps to Reproduce
1. 

## Resolution
<!-- How was it fixed? (fill in when resolved) -->


## Notes

`,
};

const businessLog: NoteTypeConfig = {
	id: "log",
	label: "Log",
	emoji: "📓",
	folder: "Business/Logs",
	tags: ["business", "log"],
	hasEisenhower: false,
	templateFn: (title, fm) => `${frontmatterBlock(fm)}

# 📓 ${title}

## Summary
<!-- What happened? Key takeaways? -->


## Details


## Action Items
- [ ] 

`,
};

const businessSop: NoteTypeConfig = {
	id: "sop",
	label: "SOP / Reference",
	emoji: "📋",
	folder: "Business/SOPs",
	tags: ["business", "sop"],
	hasEisenhower: false,
	templateFn: (title, fm) => `${frontmatterBlock(fm)}

# 📋 ${title}

## Purpose
<!-- What is this document for? When should someone reference it? -->


## Steps
1. 

## Notes
<!-- Tips, common mistakes, edge cases -->

`,
};

const businessContact: NoteTypeConfig = {
	id: "contact",
	label: "Contact / Account",
	emoji: "👤",
	folder: "Business/Contacts",
	tags: ["business", "contact"],
	hasEisenhower: false,
	templateFn: (title, fm) => `${frontmatterBlock(fm)}

# 👤 ${title}

## Contact Info
- **Company:** 
- **Role:** 
- **Email:** 
- **Phone:** 

## Relationship Notes
<!-- How do we work with them? Preferences? History? -->


## Order / Account Notes


## Communication Log
| Date | Notes |
|------|-------|
| ${fm.created} | Initial contact |

`,
};

const businessTodo: NoteTypeConfig = {
	id: "todo",
	label: "Todo",
	emoji: "✅",
	folder: "Business/Todos",
	tags: ["business", "todo"],
	hasEisenhower: true,
	templateFn: (title, fm) => `${frontmatterBlock(fm)}

# ✅ ${title}

## What needs to be done?


## Context
<!-- Why does this matter? Any dependencies? -->


## Subtasks
- [ ] 

`,
};

// --- Personal Note Types ---

const personalIdea: NoteTypeConfig = {
	id: "idea",
	label: "Idea",
	emoji: "💡",
	folder: "Personal/Ideas",
	tags: ["personal", "idea"],
	hasEisenhower: false,
	templateFn: (title, fm) => `${frontmatterBlock(fm)}

# 💡 ${title}

## The Spark


## How It Works


## Next Steps

`,
};

const personalReference: NoteTypeConfig = {
	id: "reference",
	label: "Reference",
	emoji: "🔖",
	folder: "Personal/Reference",
	tags: ["personal", "reference"],
	hasEisenhower: false,
	templateFn: (title, fm) => `${frontmatterBlock(fm)}

# 🔖 ${title}


`,
};

const personalPeople: NoteTypeConfig = {
	id: "people",
	label: "People",
	emoji: "👥",
	folder: "Personal/People",
	tags: ["personal", "people"],
	hasEisenhower: false,
	templateFn: (title, fm) => `${frontmatterBlock(fm)}

# 👥 ${title}

## About
- **Relationship:** 
- **Contact:** 

## Gift Ideas
- 

## Important Dates
- 

## Notes
<!-- Things they've mentioned, preferences, conversation notes -->

`,
};

const personalTodo: NoteTypeConfig = {
	id: "todo",
	label: "Todo",
	emoji: "✅",
	folder: "Personal/Todos",
	tags: ["personal", "todo"],
	hasEisenhower: true,
	templateFn: (title, fm) => `${frontmatterBlock(fm)}

# ✅ ${title}

## What needs to be done?


## Subtasks
- [ ] 

`,
};

// --- List Note Types ---

const listShopping: NoteTypeConfig = {
	id: "shopping",
	label: "Shopping List",
	emoji: "🛒",
	folder: "Lists/Shopping",
	tags: ["list", "shopping"],
	hasEisenhower: false,
	templateFn: (title, fm) => `${frontmatterBlock(fm)}

# 🛒 ${title}

## Items
- [ ] 

`,
};

const listChecklist: NoteTypeConfig = {
	id: "checklist",
	label: "Checklist",
	emoji: "✅",
	folder: "Lists/Checklists",
	tags: ["list", "checklist"],
	hasEisenhower: false,
	templateFn: (title, fm) => `${frontmatterBlock(fm)}

# ✅ ${title}

- [ ] 

`,
};

const listScratch: NoteTypeConfig = {
	id: "scratch",
	label: "Scratch Note",
	emoji: "📝",
	folder: "Lists/Scratch",
	tags: ["list", "scratch"],
	hasEisenhower: false,
	templateFn: (title, fm) => `${frontmatterBlock(fm)}

# 📝 ${title}


`,
};

// --- Domain Configs ---

export const BUSINESS_CONFIG: DomainConfig = {
	id: "business",
	label: "Business",
	emoji: "🏢",
	folder: "Business",
	noteTypes: [businessIdea, businessIssue, businessLog, businessSop, businessContact, businessTodo],
};

export const PERSONAL_CONFIG: DomainConfig = {
	id: "personal",
	label: "Personal",
	emoji: "🏠",
	folder: "Personal",
	noteTypes: [personalIdea, personalReference, personalPeople, personalTodo],
};

export const LISTS_CONFIG: DomainConfig = {
	id: "lists",
	label: "Lists",
	emoji: "📋",
	folder: "Lists",
	noteTypes: [listShopping, listChecklist, listScratch],
};

export const ALL_DOMAINS: DomainConfig[] = [BUSINESS_CONFIG, PERSONAL_CONFIG, LISTS_CONFIG];

// Export the problem-spark variant for ideas
export const BUSINESS_IDEA_PROBLEM = businessIdeaProblem;

export function getDomainConfig(domain: string): DomainConfig | undefined {
	return ALL_DOMAINS.find((d) => d.id === domain);
}

export function getNoteTypeConfig(domain: string, noteType: string): NoteTypeConfig | undefined {
	const domainConfig = getDomainConfig(domain);
	return domainConfig?.noteTypes.find((nt) => nt.id === noteType);
}
