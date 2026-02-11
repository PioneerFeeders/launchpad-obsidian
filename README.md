# 🚀 Launchpad

A dashboard home tab for Obsidian with guided note capture, quick actions, Eisenhower matrix todos, and active project tracking.

Remixed from [Obsidian Home Tab](https://github.com/olrenso/obsidian-home-tab) by olrenso (MIT License).

## Features

### Personalized Greeting
Time-aware greeting that changes throughout the day — morning, afternoon, evening, and late night messages.

### Fuzzy Search
Full vault search with fuzzy matching, file type filtering, and keyboard shortcuts. Carried forward from the original Home Tab plugin.

### Guided Note Capture
Three-domain system with a quick triage wizard:

- **🏢 Business** — Idea, Issue, Log, SOP/Reference, Contact, Todo
- **🏠 Personal** — Idea, Reference, People, Todo
- **📋 Lists** — Shopping, Checklist, Scratch

Each note type gets auto-tagged frontmatter, lands in the right folder, and starts with a purpose-built template.

### Eisenhower Matrix Todos
Business and Personal todos are prioritized with a two-tap Eisenhower matrix:
- 🔴 **Do First** — Important & Urgent
- 🟡 **Schedule** — Important & Not Urgent
- 🔵 **Delegate** — Not Important & Urgent
- ⚪ **Drop** — Not Important & Not Urgent

The dashboard shows your Do First and Scheduled items front and center.

### Idea → Project Upgrade
Ideas can be upgraded to projects in place. The note evolves — gains a project status tracker, milestones section, and linked notes area — without losing the original idea content.

### Active Projects
Projects show as cards on the dashboard with backlink counts so you can see how connected each project is.

### Shopping Lists
Cross-domain by design. A single Menards run can have items tagged for both business and personal use.

## Folder Structure

The plugin creates and manages:

```
Business/
  Ideas/
  Issues/
  Logs/
  SOPs/
  Contacts/
  Todos/
Personal/
  Ideas/
  People/
  Reference/
  Todos/
Lists/
  Shopping/
  Checklists/
  Scratch/
```

## Frontmatter

Every note gets structured frontmatter:

```yaml
---
type: idea
domain: business
status: active
created: 2026-02-10
tags: [business, idea]
---
```

Todos additionally get `eisenhower` and optional `due` fields.

## Installation

### Manual
1. Download the latest release
2. Extract to `.obsidian/plugins/launchpad/`
3. Enable in Settings → Community Plugins

### Development
```bash
git clone <repo>
cd launchpad
npm install
npm run dev
```

## Credits

Based on [Obsidian Home Tab](https://github.com/olrenso/obsidian-home-tab) by Renso (MIT License). Search infrastructure, suggestion system, and tab replacement logic adapted from the original.

## License

MIT
