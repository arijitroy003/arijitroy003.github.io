# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

Static portfolio website for Arijit Kumar Roy (arijitroy003.github.io). Pure vanilla HTML/CSS/JavaScript — no frameworks, no build step, no npm dependencies.

## Development

```bash
# Serve locally
python3 -m http.server 8000

# Validate HTML/CSS/JS structure
python3 validate.py
```

Deployment is automatic via GitHub Actions on push to `main`: runs `validate.py`, then deploys to GitHub Pages.

## Architecture

**Single Page Application** with 4 sections (Home, Experience, Projects, Skills) swapped via JavaScript `display` toggling — no page reloads.

### Key Files

- **`index.html`** — All HTML content; loads scripts in order: knowledge-base.js → script.js → hero-effects.js
- **`styles.css`** — All styling; CSS custom properties in `:root` define the design system (`--bg`, `--green`, `--white`, `--accent-blue`, `--mono`, `--sans`)
- **`script.js`** — SPA navigation (`navigate(id)` function), chat UI message handling, footer injection
- **`knowledge-base.js`** — Rule-based chatbot: regex intent detection → response lookup from `knowledgeBase` object. Responses can be static strings, arrays (random selection), or functions (dynamic generation)
- **`hero-effects.js`** — Skills page SVG network visualization: floating labels with category-based colors, connecting lines, pixel grid animation. Percentage-based positioning with resize handling
- **`validate.py`** — CI validation: checks HTML structure, CSS brace/semicolon matching, JS bracket matching, external resource links

### Patterns

- **Intent-Response Pipeline**: `User Input → detectIntent(regex matching) → getResponse(intent) → Bot Reply`
- **Navigation state**: `.active` CSS class on nav links; sections shown/hidden via `display` property
- **Footer**: dynamically created and appended to whichever page section is active
- **Skills network**: SVG lines drawn between positioned HTML div labels; coordinates stored as percentage-based arrays

### Design System

Dark theme (`--bg: #0a0a0a`), green accent (`--green: #4ade80`), IBM Plex Mono for UI elements, Inter for body text. Consistent 6px border-radius. Respects `prefers-reduced-motion`.
