# Automated UX and accessibility review

Date: 13 September 2026. Baseline commit: `082dfc9c8f1f29d856a2caddbc5c89a3f4417cf7`.

This is an independent agent inspection, not feedback from a human participant. Production files were read without editing. Evidence comprises authored HTML/CSS/JavaScript, the existing browser interaction log, and saved viewport screenshots. No new browser or screen-reader session was performed by this reviewer.

## Materials inspected

- All four content pages and `404.html`.
- `js/app.js`, `js/globe.js`, `css/style.css`.
- `evidence/screenshots/index-1280.png`, `timeline-390.png`, `connections-390.png`, and `about-390.png`.
- `evidence/browser-interactions.md`.

## Findings and acceptance checks

| ID | Evidence and user impact | Proposed change | Measurable acceptance check |
| --- | --- | --- | --- |
| UX-01 | In baseline `js/app.js` lines 104–117, the empty state recommends selecting “All years”, but the era click handler does not clear the search field. An unmatched query therefore still returns zero results after following that suggestion. | Provide an explicit Clear filters action that clears the query and selected era together; make the empty state explain that action. | Enter an unmatched term with an era active. Activate Clear filters using the keyboard. Confirm ten milestones, an empty query, All years selected, no `era` URL parameter, and a logical focus position. |
| UX-02 | In baseline `js/globe.js` lines 264–265, the motion button changes its accessible name from Pause motion to Resume motion while simultaneously becoming a pressed toggle. That combines two different button patterns and makes the pressed state ambiguous. | Keep the changing Pause/Resume action labels and remove `aria-pressed`; retain native button keyboard behavior. | Activate the button using Enter and Space. Confirm the label alternates, motion changes accordingly, focus stays on the button, and no `aria-pressed` attribute remains. |

UX-02 follows the [W3C ARIA Authoring Practices button pattern](https://www.w3.org/WAI/ARIA/apg/patterns/button/), consulted 13 September 2026. The guidance distinguishes a toggle with an unchanged name from an action button whose name changes with the action available.

## Visual observations

The inspected desktop overview and three 390-pixel page screenshots show consistent type, spacing, active navigation and content order. The mobile timeline exposes its era filters and search before the first milestone. The connections illustration fits its panel; the sources introduction and in-page navigation fit their viewport. No additional clipping or overlap defect is visible in these saved first-viewport images. These observations do not establish the state of the entire scrollable page, every viewport, live animation or assistive-technology output.

## Scope of the result

The recommendations are based on reproducible interface logic and identifiable semantics, without invented user quotations, participant identities, ratings or usability-study results. Existing automated checks and screenshots informed the review; final acceptance requires the implementation and checks recorded by the main project agent.

## Follow-up inspection

The changed production files were independently re-read on 13 September 2026.

- **UX-01 accepted by source inspection.** `timeline.html` now contains a native Clear filters button. `js/app.js` shows it when a query or era is active, resets both values on activation, removes the era URL parameter, renders all records, and explicitly returns focus to the search field before the now-hidden control can strand keyboard focus. The empty-state guidance names the implemented control. The summary row can wrap, and the control has a 44-pixel minimum height. `tests/runtime.test.mjs` exercises the real application, templates and data to check the recovered count, cleared query, era state, URL and focus; its execution result is recorded separately by the main agent.
- **UX-02 accepted by source inspection.** The authored motion button and `startGlobe()` no longer set `aria-pressed`. Its native button semantics remain, while its visible action label changes between Pause motion and Resume motion. The click handler does not remove or replace the button, so the change itself does not discard focus.

No remaining issue was identified in these changes during this bounded follow-up. Live Enter/Space activation, visual fit at 320 pixels and the final browser accessibility scan are verified separately by the main agent; this follow-up does not claim those checks were performed by this reviewer.
