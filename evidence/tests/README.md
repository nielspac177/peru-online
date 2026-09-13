# Testing evidence

All reports describe tests actually executed on the project. They are not a
claim that the website satisfies every accessibility requirement.

## Commands

```sh
npm ci
npm test
npm run audit
npm start
```

For real-browser axe, open `http://localhost:4173/tests/browser-audit.html` after
starting the server. This development-only harness tests the four content pages
at a 1280 × 900 iframe viewport. It includes colour-contrast checks. It waits for
actual JSON records and reports loading errors instead of auditing an empty page.
The results appear as JSON in the page, ready to copy into the evidence folder.

`browser-axe.json` records an actual Chrome run: four pages, zero violations,
zero execution errors, and two incomplete colour-contrast rules (Overview and
Timeline). Those incomplete results concern overlapping artwork/labels and
symbol-only content, and require explicit review. They are not counted as passes.

## Baseline and fixes

`before/source-baseline.json` preserves the initial authored-page audit and input
SHA-256 hashes. It used the unmodified html-validate recommended profile and
axe-core in jsdom. It found ten HTML-linter findings across five pages and zero
axe structural violations. The first baseline was collected before the archive
JSON was available, so **it does not claim to test rendered records**.

Seven findings were resolved in source: five lowercase doctype declarations were
standardised to uppercase, the Sources page title ampersand was encoded, and
trailing whitespace was removed from the 404 page. These are lint/style changes;
they are not presented as seven browser-breaking defects.

Three findings required the validator to understand the design:

- Two inert template IDs contain `{{id}}` tokens. The audit marks only the exact
  `{{id}}` and `event-{{id}}` forms as dynamic through html-validate's supported
  `DynamicValue` API. The completed rendered HTML is validated strictly without
  that exception, with inert template definitions removed.
- The chart's inline `width` is driven by a validated percentage. The
  `no-inline-style` rule allows only the `width` property; other inline styling
  remains prohibited. Numeric validation rejects strings, NaN, infinity and
  values outside 0–100 before rendering.

These configuration adjustments are recorded explicitly; the ten-to-zero
comparison must not be described as ten production-code fixes.

A later readability-formatting pass reintroduced lowercase doctypes and added
self-closing syntax to HTML void elements. `formatting-review.json` preserves
that intermediate audit (66 source lint/style findings). The generated-DOM
check also reported nine whitespace-only serialization findings. Whitespace
style is now enforced on authored files only, because DOM serialization and
removing inert templates introduce indentation text nodes; all structural
HTML rules remain enabled on the generated document.

`after/source-baseline.json` records zero findings under that documented profile.
`after/report.json` records the successful final run: five pages, each checked
as authored source and as a rendered document; zero HTML errors, zero warnings,
zero axe violations, and zero incomplete jsdom rules. Rendered content includes
10 milestones, 11 sources, four chart bars, and three overview statistics.
This report checks both authored HTML and the production templates rendered
from validated JSON. Input hashes,
tool versions, complete finding details and incomplete rules are in each report.

## Coverage and limits

All 64 Node tests passed; `after/unit-tests.tap` is their actual TAP output.
The tests exercise the actual data contract: invalid types, required fields,
empty collections, lifetime and percentage ranges, duplicate identifiers, unsafe
source URLs, dangling citations, and unsafe anchors. They also parse template
outputs to verify that malicious text cannot create HTML or escape an attribute.
Local-link tests check the packaged pages, files, fonts and citation anchors.

The jsdom audit explicitly disables colour contrast because jsdom has no layout
or paint engine. Zero jsdom violations say nothing about colour contrast, reflow,
visible focus, target size, motion, or the quality of screen-reader interaction.
The browser harness adds actual layout-based axe checks, but automated results
still require manual review, particularly any `incomplete` rules.

Keyboard traversal, responsive layouts, search/filter interactions, and reduced
motion must be recorded from real browser use, separately from these Node tests.
No participant feedback, human screen-reader test, or visual result is inferred
from an automated pass.
