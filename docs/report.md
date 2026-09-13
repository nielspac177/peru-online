# Perú Online: Project report

Niels Pacheco · September 2026

## A. Background research

Perú Online explores internet access in Peru from 1997, my birth year, through 2025. Its narrative connects public cabinas, home broadband, mobile networks and persistent geographic inequality.

IDB describes cabinas públicas providing shared computers and hourly access [1]; Telefónica documents the expansion of Speedy services [2]. MTC publications distinguish spectrum awards from commercial launches and document backbone deployment. Ten milestones connect to eleven sources, with publication dates, access dates and supported claims recorded together.

Operator reports describe their own services, so company claims are attributed. INEI supplies a separate population measure: preliminary Q4 2025 household internet access was 60.1% nationally, 78.2% in metropolitan Lima, 63.1% in other urban areas and 23.4% in rural areas [3]. Lima includes Callao. The 54.8 percentage point Lima–rural gap concerns household service, not connection speed, affordability or individual use.

## B. Planning

Four linked pages guide general readers. Overview introduces the story; Timeline presents searchable milestones; Connections examines everyday access and inequality; Sources provides references, definitions and credits.

MoSCoW prioritisation makes responsive layouts, attributed research, JSON templating and validation, testing and submission files essential. Animation supports the visual experience; accounts and live statistics fall outside the scope.

The project plan records research, structure, prototypes, review, implementation, verification and delivery as milestones, with dependencies and acceptance criteria. This separates design intentions from evidence of completed work.

## C. Development process: prototype designs

Desktop and mobile wireframes cover all four pages. Desktop compositions use columns and a sources sidebar; mobile layouts stack content while keeping navigation visible. Saved wireframes preserve the proposals, and browser screenshots document the resulting layouts.

![Figure 1: Initial desktop and mobile wireframes for the four website pages.](../evidence/wireframes-contact-sheet.png)

Dribbble references inspired spacious compositions and sculptural motion [4]. Warm paper colours, dark text and red accents create an editorial identity. Procedural illustrations are decorative interpretations, not historical photographs or accurate network maps. Credits record the visual references and font licences.

Browser inspection identified globe overflow, corrected by constraining the canvas. Smaller navigation padding resolved overflow at 320 pixels. Opaque label backgrounds improved contrast. These revisions arose from implementation inspection; external participant feedback remains pending, with a recording form in `docs/feedback.md`.

## D. Development process: developing the code

HTML, CSS, JavaScript and JSON separate content, presentation, behaviour and data. Semantic landmarks and headings establish reading order; CSS Grid, flexible sizing and media queries adapt the pages to different screens. Assets are stored locally.

After an HTTP fetch, `validateData` checks required fields, types, text, unique safe identifiers, years from 1997 to 2025, finite percentages from 0 to 100, HTTPS URLs and citation references. Valid JSON syntax alone does not guarantee valid project data; failures produce readable messages.

The custom template engine substitutes escaped `{{field}}` tokens. Text and attribute escaping complement URL and numeric validation; missing or nonprimitive values fail. This follows Topic 6's JavaScript template-engine objective [5], although the exact laboratory engine remains unconfirmed.

Timeline filters and accent-normalised search announce result counts and explain empty results. Motion can be paused and respects reduced-motion preferences. Relative paths support local HTTP serving and the verified GitHub Pages deployment at https://nielspac177.github.io/peru-online/, published 13 September 2026.

## E. Testing: validation reports and actions taken

The initial HTML lint report contained ten findings: seven source style edits and three documented accommodations for template identifiers and chart widths. A formatter regression was corrected. Final source and rendered checks covered five pages, including the error page, with zero HTML errors or warnings.

All 64 tests passed, covering data boundaries, invalid records, citations, injection escaping, missing fields and packaged links and assets. The jsdom accessibility check found zero structural violations; its lack of rendering prevented contrast assessment.

Browser axe tests covered four pages with contrast enabled: zero violations and two incomplete contrast rules. Manual CSS inspection and luminance calculations reviewed uncertain labels and symbols; strengthened backgrounds made labels independent of canvas imagery. Recorded colour pairs range from 4.84:1 to 13.39:1.

All four pages passed viewport checks at 320, 390, 768 and 1280 pixels without horizontal scrolling. These checks do not establish complete WCAG conformance; screen-reader testing remains unperformed. Detailed results and screenshots accompany the code.

## F. Reflections on learning

The project demonstrates why statistical definitions must accompany comparisons and why template escaping needs data validation. Responsive design also requires inspecting real rendered layouts. Automated results provide reproducible evidence, while accessibility and usability still require contextual judgement.

## References

[1] IDB. *Internet for the people*. November 1997.

[2] Telefónica del Perú. *2002 Annual Report*. SEC, 2003.

[3] INEI. *TIC en los hogares: IV Trimestre 2025*. 2026, pp. 6–7.

[4] Alex Bender/FANCY. Dribbble concepts 26305597 and 26270031.

[5] University of London. *CM1040 Web Development 2025*, Topic 6, p. 4.

Full source URLs and access dates: Sources page and `data/content.json`.
