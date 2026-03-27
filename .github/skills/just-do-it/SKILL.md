---
name: just-do-it
description: Implement a user story from the PRD end-to-end. Reads the user story and its acceptance criteria from the PRD, analyzes the codebase, makes all necessary code changes, and marks criteria as done. Use when user says "just do it", provides a user story name or ID (e.g. "US-3"), or asks to implement a story from the PRD.
---

# Just Do It — User Story Implementation

## Input

A user story identifier. Accepts any of:
- Story ID: `US-3`
- Story title: `Understand the base recipe`
- Partial match: `base recipe`, `dietary`, `re-spin`

## Workflow

### 1. Find the user story

- Read the PRD at `.github/copilot-instructions.md`.
- Locate the user story matching the input (by ID, title, or keyword).
- Extract the **full title**, **user story statement**, and **all acceptance criteria** (checkbox items).
- If no match is found, list available stories and ask the user to pick one.
- If the story's acceptance criteria are already all checked `[x]`, inform the user and stop.

### 2. Understand the codebase

- Read every project source file: `index.html`, `style.css`, `app.js`, `recipes.json`.
- Note the existing architecture, conventions, naming patterns, and CSS class naming (BEM-style).
- Identify which files need changes based on the acceptance criteria.

### 3. Plan the changes

For each acceptance criterion, determine:
- Which file(s) to modify.
- What HTML elements, CSS rules, or JS logic are needed.
- How the change integrates with existing code (DOM IDs, class names, JS functions).

Follow these project conventions:
- **Zero external dependencies** — no frameworks, CDNs, or libraries.
- **Vanilla JS** — IIFE pattern, `"use strict"`, DOM refs at top, state variables grouped.
- **CSS** — BEM-style class naming (`.block__element`), CSS custom properties from `:root`.
- **HTML** — semantic elements, accessibility attributes (`aria-*`), `id` for JS hooks.
- **Visual design** — warm palette (beige `#F5F0E8`, gold `#D4A84B`, brown `#5C4033`), system font stack.
- **Responsive** — mobile-first, breakpoint at `768px`.

### 4. Implement

- Make all code changes across the relevant files.
- Follow the file responsibility boundaries from the PRD:
  - `index.html` → structure and content
  - `style.css` → all styling, animations, responsive rules
  - `app.js` → interactivity, DOM manipulation, data logic
  - `recipes.json` → recipe data only
- After editing each file, validate for errors.

### 5. Mark acceptance criteria as done

- In `.github/copilot-instructions.md`, change each implemented criterion from `- [ ]` to `- [x]`.
- Only mark criteria that were actually implemented.

### 6. Verify

- Review all changed files for consistency.
- Confirm every acceptance criterion from the story is addressed.
- Summarize what was implemented and which files were changed.

## Example

**User prompt:** `/skill:just-do-it US-3`

**Agent actions:**
1. Reads PRD → finds US-3: "Understand the base recipe"
2. Extracts 3 acceptance criteria (prep blurb, 1:1 ratio, sweetener suggestions)
3. Reads `index.html`, `style.css`, `app.js`
4. Adds a `<section class="prep-blurb">` to `index.html` with the blurb text
5. Adds `.prep-blurb` styles to `style.css` matching the warm theme
6. No JS changes needed (static content)
7. Marks all 3 criteria as `[x]` in the PRD
8. Reports: "Implemented US-3 — added prep blurb section. Files changed: `index.html`, `style.css`, `.github/copilot-instructions.md`"

