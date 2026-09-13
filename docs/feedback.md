# Review feedback and completed improvements

Date: 13 September 2026. Baseline: commit `082dfc9`. Reviewers were independent automated agents examining the source, saved prototypes/screenshots and reproducible interactions. No external participant review was conducted; this record does not fulfil the brief's requirement to show designs to other people.

## Method

The process adapts the experiment loop described in [Karpathy's autoresearch](https://github.com/karpathy/autoresearch): propose a bounded change, check it against fixed criteria, retain a verified improvement and record the outcome. This project applied that approach to website review; it did not run the repository's language-model training program.

Two agents independently reviewed code/data handling and interface/accessibility. The implementation agent reproduced the findings, made small corrections and ran focused checks. The reviewers then inspected the changes again. Existing tests stayed in place; regression cases were added before fixing the reproduced failures. No scores, participant identities or quotations were invented.

## Feedback, response and verification

| Review finding | Implemented response | Evidence and outcome |
| --- | --- | --- |
| Code agent: access dates such as 2025-02-29 and 2025-04-31 passed validation because JavaScript normalised them. | Require parsed dates to round-trip to the original ISO calendar date. | Three invalid-date regressions now pass; a real leap day remains accepted. `js/validate-data.js`, `tests/data.test.mjs`. |
| Code and UX agents: an unmatched search suggested selecting All years, but that left the query active and still showed no results. | Add Clear filters to reset the search, selected era and URL together. Focus returns to search when the reset control hides. | A keyboard Enter activation restored 10 records, an empty query and All years. Browser and runtime checks confirm the state. `js/app.js`, `timeline.html`, `tests/runtime.test.mjs`. |
| UX agent: Pause/Resume labels changed while the button also announced a pressed state, mixing two button conventions. | Use a native action button whose label describes the next action, without `aria-pressed`. | Keyboard activation changed Pause to Resume and back while retaining focus. `index.html`, `js/globe.js`. |
| Implementation review: relative links on the 404 page resolved against an unknown nested directory. | Use canonical published URLs for 404 recovery links and styling. | Regression verifies home/navigation/assets resolve correctly from a nested unknown URL. `404.html`, `tests/links.test.mjs`. |

## Review results

The pre-fix focused run passed 54 of 58 tests; the four failures were the three impossible dates and the reset interaction. After the fixes, the same run passed 58 of 58. The complete final suite passed 70 tests. Authored and rendered HTML checks found zero errors or warnings across five pages. Browser axe checked four content pages with zero violations, zero execution errors and two incomplete contrast rules, whose separate review remains documented.

The new reset control measured 44 pixels high and remained within the viewport at 320, 390, 768 and 1280 pixels. The empty and recovered states were captured. Both independent agents accepted the corresponding fixes in a follow-up source review. These are technical review outcomes, not evidence of participant satisfaction or complete accessibility conformance.

## Evidence index

- `evidence/agent-review/code-review.md` and `ux-review.md`: independent findings and follow-up decisions.
- `evidence/agent-review/regressions-before.tap` and `regressions-after.tap`: comparable focused runs.
- `evidence/tests/after/unit-tests.tap`: complete final test run.
- `evidence/agent-review/browser-checks.json`: keyboard outcomes, focus and viewport measurements.
- `evidence/agent-review/search-before.png`, `search-after.png`, `search-mobile.png`: actual browser captures.
- `evidence/tests/after/report.json` and `evidence/tests/browser-axe.json`: final validation and accessibility results.
