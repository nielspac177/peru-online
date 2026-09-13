# Peru Online: project plan

Prepared 13 September 2026. This is a working project plan; milestones are acceptance gates, not a fabricated historical diary.

## Purpose and scope

Explain the history of internet access in Peru from 1997, the author's birth year, through 2025. The audience is a general reader, including students unfamiliar with Peru's internet history. Earlier events may appear only as clearly labelled background. The site connects infrastructure changes to everyday access through public cabinas, home broadband and mobile devices, while acknowledging the digital divide.

## Information architecture

| Page | Reader's question | Planned content |
| --- | --- | --- |
| `index.html` — Overview | What is the story? | Lifetime period, introductory globe, routes into the history, selected sourced milestones |
| `timeline.html` — Timeline | What changed, and when? | Chronological JSON records, period filters, source links and readable empty/error states |
| `connections.html` — Everyday connections | How did people get online? | Cabinas, home/mobile access and geographic inequalities; supporting evidence |
| `about.html` — Sources & project | How can I check this? | Source bibliography, scope, methodology and project information |

## Priorities (MoSCoW)

These are planning tools chosen for this project; the course's required planning terminology still needs to be checked by the student.

| Priority | Requirements |
| --- | --- |
| Must | At least three linked pages; 1997–2025 scope; reliable attributed research; responsive desktop and mobile layouts; JSON rendered through the module's template engine; JSON validation; readable commented code; HTML/accessibility tests; code ZIP; PDF report at most 1,500 words |
| Should | Four coherent pages; local dependencies and assets; keyboard support; reduced-motion support; visible source links; genuine feedback on prototypes with recorded improvements; clear local running instructions |
| Could | Restrained globe motion, period filters, generated decorative illustrations, visual comparison of access patterns |
| Won't in this version | User accounts, comments, a server database, live statistics, or unsourced personal memories |

## Milestones and dependencies

| Gate | Work and evidence | Depends on | Completion criterion |
| --- | --- | --- | --- |
| 1. Requirements and research | Read brief; select dated primary sources; record citations | Brief and lifetime boundary | Each published historical claim has a supporting source |
| 2. Structure and prototype | Sitemap; desktop/mobile wireframes for all four pages | Gate 1 | Reader can identify purpose, navigation and reading order |
| 3. Human feedback | Show prototypes; capture tasks, exact comments and changes | Gate 2 plus real reviewers | Dated authentic feedback and traced design revisions exist |
| 4. Implementation | Semantic HTML/CSS; template rendering; JSON validation; interactions | Gates 1–2, then feedback when available | All four pages load; valid data renders; invalid data fails safely |
| 5. Verification | HTML validator; automated accessibility checks; keyboard and viewport checks | Gate 4 | Results recorded and material failures corrected |
| 6. Delivery | Public GitHub Pages deployment; code ZIP; report PDF | Gates 3–5 | Live links checked, ZIP opens, report word count is within the limit |

## Design and technical decisions

Warm ivory (`#f4f1e9`), deep red (`#ad281b`) and dark ink (`#21241f`) support an editorial identity tied to Peru. The globe supplies the sculptural emphasis requested in the inspiration; text remains independent of decorative artwork. Thin rules and generous spacing distinguish sections. Desktop compositions use two or three columns; mobile uses a single reading column and accessible navigation.

Separate data, presentation and behaviour. Store repeatable chronology/source content in JSON; validate structure and values before handing data to templates. Use standard document navigation and relative asset paths to suit GitHub Pages. Confirm that the selected template engine is the one encountered in the module before submitting.

## Risks and mitigation

- **Unverified facts:** keep exact dates, populations, definitions and source links together; avoid treating subscriptions as unique people.
- **Heavy decorative assets:** compress images, reserve dimensions and respect reduced-motion preferences.
- **Missing real feedback:** use `feedback.md`; leave this requirement visibly pending until people actually review the design.
- **Course terminology/engine uncertainty:** student checks module notes and report language before submission.
- **Reproducibility:** include local run instructions, dependency licences and separate test evidence; exclude credentials and installation folders from the ZIP.

## Evidence index

- `docs/wireframes.html`: initial proposed desktop and mobile designs for all four pages.
- `evidence/wireframes-*.svg`: original editable vector evidence.
- `docs/design-revisions.md`: initial assumptions and revision log.
- `docs/feedback.md`: real-review protocol and unfilled capture form.
