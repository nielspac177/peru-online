# Design revision record

## Initial proposed layout — version 0

Created 13 September 2026 as an initial design proposal. This is a baseline for comparison, not a claim of a previously deployed website or completed user study.

- Overview: desktop split hero with large title and globe; a three-part reading route below. Mobile keeps the introduction before the globe and stacks the routes.
- Timeline: heading followed by period controls and dated narrative entries. On mobile, controls wrap and dates sit above their entries.
- Everyday connections: introductory composition followed by cabina/mobile/inequality sections. Desktop combines art and explanatory text; mobile follows a single reading order.
- Sources & project: sources and project explanation in separate reading areas. On mobile, full-width source entries precede project notes.
- Every page: consistent navigation, clear current-page state, thin dividers, a footer and accessible text alternatives in the implemented version.

The SVGs describe hierarchy and placement, so their short labels are not verified historical claims or final article copy. Final content must be supported by the research sources. Sizes are indicative: desktop 1200 pixels and mobile 390 pixels. Smaller widths and intermediate breakpoints still require implementation testing.

## Design rationale to check during implementation

| Initial assumption | Question to test | Possible response if evidence supports it |
| --- | --- | --- |
| Large globe makes the opening memorable | Can readers identify the topic and date range before scrolling? | Reduce illustration height or bring the summary higher |
| Four clear navigation links are manageable | Do all links remain readable and reachable on a narrow screen? | Wrap navigation or use an accessible menu |
| Period filters help scanning | Can readers find an event and tell which filter is active? | Improve control labels, selected state and result count |
| Source links beside facts build trust | Can readers distinguish a source from a next-page link? | Use explicit source labels and consistent placement |
| Editorial spacing improves reading | Does the phone layout require too much scrolling between related items? | Tighten spacing while retaining legibility |

## Completed revisions

The following changes came from implementation review and browser testing. They are not human participant feedback.

| Date/version | Trigger and evidence type | Before | After | Files/evidence |
| --- | --- | --- | --- | --- |
| 13 September 2026 | Browser layout inspection | Globe extended beyond desktop and phone viewport | Canvas constrained and mobile minimum height removed | `css/style.css`, `evidence/layout-checks.json` |
| 13 September 2026 | Browser test at 320px | Four navigation links extended 14px beyond viewport | Reduced link padding at narrowest breakpoint | `css/style.css` |
| 13 September 2026 | Browser axe contrast review | Canvas underlay made label contrast uncertain to tool | Opaque paper backgrounds added to globe labels | `evidence/contrast-review.json` |
| 13 September 2026 | Independent automated UX/code review | An unmatched search could not recover through All years | Clear filters resets search, era, URL and focus | `feedback.md`, `evidence/agent-review/` |
| 13 September 2026 | Independent automated UX review | Motion button mixed changing action labels with pressed-state semantics | Native action button announces Pause or Resume | `index.html`, `js/globe.js`, `evidence/agent-review/browser-checks.json` |
