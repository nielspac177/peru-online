# Automated code review

Reviewer: an automated code-review agent, independently assigned to inspect JSON validation, template rendering and runtime interactions. This record is not human participant feedback.

Reviewed baseline: `082dfc9c8f1f29d856a2caddbc5c89a3f4417cf7` on 13 September 2026.

Method: read the implementation and existing tests; run focused Node probes against the real archive; execute the timeline application with jsdom and a local fetch stub. No browser accessibility or human usability conclusions are inferred from these checks.

## Findings

### CR-01: nonexistent access dates pass validation

- Severity: minor data-validation defect. Existing researched data is unaffected.
- Baseline location: `js/validate-data.js:57`.
- Reproduction: clone `data/content.json`, set the first source's `accessed` property to `2025-02-29`, `2025-02-31` or `2025-04-31`, and call `validateData`.
- Observed: all three values are accepted. JavaScript normalises them to 1 March, 3 March and 1 May respectively, so a successful `Date.parse` alone does not confirm a calendar date.
- Recommendation: require an exact ISO date round trip after parsing. Add negative tests for impossible dates and a positive test for `2024-02-29`.
- Initial decision: accept the finding for a focused correction.

### CR-02: empty-search recovery guidance does not restore results

- Severity: minor interaction defect.
- Baseline location: `js/app.js:105` and the era-button handler at line 111.
- Reproduction: load the timeline with its real ten records, enter `unfindableterm`, and follow the empty-state instruction to select “All years”.
- Observed: the result remains `0 OF 10 MILESTONES`. The era changes, but the unmatched text query remains active.
- Recommendation: provide a distinct clear-filters control that resets the text and era together; change the empty-state guidance to describe that control. Verify restored count, query value, pressed state and URL parameter.
- Initial decision: accept the finding for a focused correction.

## Scope and outcome

No production files were edited by this reviewer. The template engine uses escaped interpolation, requires own properties, and rejects unsupported value types; no concrete escaping defect was found in this review. Only the two reproducible findings above were recommended for implementation.

## Post-correction verification

The maintainer implemented both recommendations. This reviewer added five focused regression cases: three impossible dates, one real leap date, and one timeline recovery interaction. Before the production corrections, the focused data/runtime run passed 54 of 58 tests and failed the four expected defect cases (`regressions-before.tap`). After correction, all 58 passed (`regressions-after.tap`).

- CR-01 is resolved: all three impossible access dates are rejected, while `2024-02-29` remains accepted.
- CR-02 is resolved: “Clear filters” removes the unmatched query and era parameter, restores all ten records, selects “All years”, and transfers focus to the search input when the reset control hides.
- A separate 404 recovery correction identified by the maintainer was also checked: navigation and asset links resolve to existing site files when the error page is served at one-level or deeply nested missing URLs. This adds one regression case in `tests/links.test.mjs`.

The complete test suite passed 70 of 70 tests, with no failures, on 13 September 2026. The full machine-readable log is `../tests/after/unit-tests.tap`. These are automated correctness checks; they do not constitute human participant feedback or establish full accessibility conformance.
