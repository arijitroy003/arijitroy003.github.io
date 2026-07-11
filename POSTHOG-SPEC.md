# PostHog.com Design Spec — Feature Menu

Pick what you want to bring into the portfolio. Grouped by effort level.

## Color System

| Token | Light | Dark | Usage |
|-------|-------|------|-------|
| Background | `#EEEFE9` (warm parchment) | `#151515` (deep charcoal) | Page bg |
| Text | `#151515` @ 90% opacity | `#EEEFE9` @ 90% opacity | Body text |
| Brand accent | `#F54E00` (orange) | Same | CTAs, hover reveals |
| Secondary | `#F7A501` (gold) | Same | Dark button hovers |
| Blue | `#1D4AFF` | Same | Links, focus |
| Card bg | `#fdfdf8` (warm white) | `#2C2C2C` | Cards |
| Card border | `#bfc1b7` 1px | Same | Subtle borders |
| Dividers | `#D0D1C9` dashed | `#4B4B4B` | Section breaks |

**Philosophy:** Opacity-first — modify via opacity, not new palette entries. Earthy sage/olive tones, not SaaS blue.

## Typography

- **Primary font:** IBM Plex Sans Variable (100-700+ weight)
- **Headings:** Bold 700-800, olive-charcoal `#23251d`
- **Body:** Regular weight, line-height 1.5-1.6
- **Hero headline:** 36px desktop / 28px mobile
- **Border radius:** 4-6px tight (scrappy, not rounded SaaS)

## OS Metaphor — Full Feature List

### Already Implemented
- [x] Desktop background with wallpaper
- [x] Desktop icons (grid)
- [x] Draggable windows with title bar
- [x] Traffic-light buttons (close/minimize/maximize)
- [x] Taskbar with open window tabs
- [x] Boot sequence
- [x] Window z-index stacking
- [x] Keyboard shortcuts (Escape to close)
- [x] Draggable icons
- [x] Resizable windows

### Available to Add
- [ ] **File-system navigation sidebar** — left sidebar styled as file explorer with `.mdx`, `.mov` extensions
- [ ] **"Switch to website mode" toggle** — flip between OS view and traditional scrolling site
- [ ] **Window snapping** — snap to edges/grid when dragged near viewport edges
- [ ] **Right-click context menu** — on desktop and windows (open, close, minimize all, etc.)
- [ ] **Keyboard shortcuts panel** — `/kbd` page showing all shortcuts
- [ ] **Screensaver** — activates after idle time, brand visuals
- [ ] **Window position persistence** — save positions to localStorage across sessions
- [ ] **Desktop icon rearrangement persistence** — save icon positions to localStorage
- [ ] **Customizable wallpapers** — library of backgrounds, preference saved
- [ ] **Multiple desktops/workspaces** — swipe between virtual desktops

## App-Specific Ideas (PostHog-Inspired)

- [ ] **Terminal app** — real terminal aesthetic with green-on-black, command prompt style chat
- [ ] **Presentation/slides app** — experience timeline as a slide deck
- [ ] **Text editor app** — blog articles rendered in a code-editor-style window
- [ ] **Media player app** — demo videos in a QuickTime-style player chrome
- [ ] **Spreadsheet app** — skills comparison or project stats in a spreadsheet grid
- [ ] **File explorer app** — projects as files/folders in an explorer view
- [ ] **Game/easter egg** — hidden interactive game accessible from desktop

## Interaction & Motion Patterns

### PostHog Hover States
- **Buttons:** Zoom scale ~1.05, no delay (snappy), press-down scale ~0.95
- **Cards:** Orange text flash (`#F54E00`), lift translateY(-2px)
- **Links:** Orange accent reveal on hover, smooth ~200ms transition
- **Navigation:** Background shift, underline appears/animates

### Animations
- **Window open/close:** Spring physics
- **Page transitions:** Fade in/out between routes
- **Scroll reveals:** Content fades in via intersection observer
- **Parallax:** Subtle on hero sections
- **Loading states:** Skeleton screens with subtle animations
- **Form focus:** Border color shift + shadow appear

## Content Patterns

### Homepage
- Large hero headline + CTA
- Customer/client logos with shuffle button
- Feature cards (3-column grid)
- Social proof stats

### Blog
- Article cards: featured image, title, metadata (date, author, tags, reading time), excerpt
- Category/tag filters
- Grid or list view toggle

### Documentation Style
- Left sidebar (240px) with hierarchical nav
- Right sidebar: auto-generated table of contents
- Code blocks with copy button + language label
- Callout boxes (info, warning, success)

## Brand Personality

### PostHog's Approach
- **Mascot:** "Max" the hedgehog — kawaii aesthetic, pastel, hand-drawn
- **Tone:** Playful, irreverent, self-aware, developer-friendly
- **Satirical marketing:** Fake urgency, parody product boxes
- **Transparency:** Public handbook links, authentic proof, open-source credibility

### Adaptable for Portfolio
- [ ] Personal mascot/avatar in different contexts (at desk, coding, reading)
- [ ] Witty copy in boot messages, error states, empty states
- [ ] "From the desk of" personal messaging style
- [ ] Easter eggs throughout the site
- [ ] Transparency section (open-source projects, public contributions)

## Mobile Strategy (PostHog)

- OS metaphor **disabled** on mobile ("boring mode")
- Traditional mobile layout with hamburger nav
- Full-height drawer slides from left
- Cards stack to single column
- Touch targets minimum 44px

## Quick Wins (Low Effort, High Impact)

1. **Warm parchment color scheme** — swap `#0a0a0a` bg to `#EEEFE9` for light mode
2. **Orange accent on hover** — hidden brand color reveals on card/link hover
3. **Snappy button feedback** — scale 1.05 hover, 0.95 press
4. **Tight border radius** — 4px instead of 6px (scrappier feel)
5. **Window position memory** — localStorage persistence
6. **Right-click context menu** — adds polish for minimal code
7. **File extensions in titles** — already done (about.md, terminal.sh, etc.)

## PostHog Technical Stack (for reference)

| Aspect | PostHog | Our Portfolio |
|--------|---------|---------------|
| Framework | Gatsby (React) | Vanilla HTML/CSS/JS |
| Animation | Framer Motion | CSS keyframes + pointer events |
| Styling | Tailwind CSS | CSS custom properties |
| UI Components | Radix UI + shadcn/ui | Hand-built |
| State | React Context | Plain JS Map/objects |
| Hosting | Vercel | GitHub Pages |
| Build step | Yes | None |
