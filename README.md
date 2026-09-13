# Perú Online

An illustrated history of the internet in Peru, **1997–2025**, created for CM1040 Web Development. The period starts with the author's birth year; 1997 is not claimed as the beginning of Peru's internet.

## View the website

The website is published at https://nielspac177.github.io/peru-online/ . See `evidence/deployment.json` for the verified deployment status.

For a downloaded copy, use either:

1. Open this folder in Visual Studio Code. With the Live Server extension installed, right-click `index.html` and choose **Open with Live Server**.
2. With Node.js 22 or newer installed, run `npm start` in this folder, then open http://127.0.0.1:4173/ . No npm install is needed just to view the website.

Serve the folder over HTTP. Opening `index.html` through a `file://` URL prevents normal JSON fetching in many browsers. Core navigation and page introductions work without JavaScript; JSON collections explain the requirement when scripting is disabled.

## Pages

| File               | Purpose                                                                |
| ------------------ | ---------------------------------------------------------------------- |
| `index.html`       | Overview, animated globe, three themes and statistical snapshot        |
| `timeline.html`    | Searchable, filterable historical milestones                           |
| `connections.html` | Public booths, mobile networks and comparable household access figures |
| `about.html`       | Research scope, definitions, source bibliography and credits           |
| `404.html`         | A recovery page for unknown URLs                                       |

## How the code works

- `data/content.json` contains milestones, statistics and primary-source records.
- `js/validate-data.js` checks field types, limits, IDs, dates, HTTPS URLs and citation references before rendering.
- `js/template-engine.js` substitutes escaped `{{field}}` values into the HTML templates. It does not evaluate JavaScript or allow raw HTML data.
- `js/app.js` fetches JSON, creates view models and updates the timeline on search/filter changes. Source citations use stable page anchors.
- `js/globe.js` projects a 3D sphere onto a 2D canvas. Its geography is approximate and arcs are decorative. Animation responds to pause, reduced-motion, page visibility and intersection state.
- `css/style.css` defines shared tokens, desktop/tablet/mobile layouts and keyboard focus.
- `assets/` contains original SVG artwork and locally hosted open-license fonts. No third-party runtime requests are needed.

The custom engine follows the course outline's Topic 6 objective to implement a JavaScript template engine without libraries. Confirm the exact lesson engine before final submission if your tutor requires a particular library or supplied implementation.

## Evidence and report

- `research/`: fact sheet, source notes and data provenance.
- `docs/plan.md`: requirements, milestones, dependencies and page plan.
- `docs/wireframes.html`: desktop and mobile prototypes for every content page.
- `docs/feedback.md`: completed automated agent reviews, changes and verification.
- `evidence/tests/`: preserved initial checks, final checks, test limitations and fixes.
- `evidence/`: browser observations, screenshots and deployment record.
- `docs/report.md`: editable report text; `Peru_Online_Final_Report.pdf` is delivered separately. Rebuild with `scripts/build-report.py` (ReportLab and pypdf required).

**Review coverage:** independent agents reviewed the implementation and recorded reproducible findings. No external participant review was conducted, so the brief's other-person feedback criterion is not covered.

## Reproduce checks

Install development-only dependencies with `npm ci`. Then run `npm test` and `npm run audit`. The latter validates both source HTML and template-rendered HTML and runs structural accessibility checks. See its report for limitations. `tests/browser-audit.html`, served over HTTP, runs axe in a real browser. The test tools and node_modules are not needed to view the site.

## Credits

Research links appear next to milestones and in the source bibliography. The visual direction is inspired by Alex Bender/FANCY's Dribbble references supplied in the project brief; no reference artwork is copied. DM Sans and Instrument Serif are distributed under the SIL Open Font License; license files are included.
