# Browser interaction checks

Tested 13 September 2026 in the Codex Chromium browser.

- All four pages rendered their expected JSON content over local HTTP.
- All four pages fit 320, 390, 768 and 1280 CSS pixel widths after fixes. Actual viewport and scroll widths are saved in layout-checks.json.
- Keyboard activation of the 2010–2019 filter showed four of ten milestones. Searching rural narrowed this to one. An unmatched term produced a readable empty state; clearing the field with Select All / Backspace restored ten records with All years selected.
- The first generated citation navigated to about.html#idb-1997. After the source loaded, keyboard focus moved to idb-1997 and its top was visible near the top of the viewport.
- Activating Skip to content focused the main element.
- Keyboard activation of the globe button changed aria-pressed from false to true and back, pausing and resuming motion.
- Initial missing JSON during construction displayed the expected loading failure message; the completed data loaded normally. No failure was deliberately inserted for evidence.
- Reduced-motion handling is implemented and code-reviewed. Operating-system preference emulation and a full screen-reader session were not performed.
- Browser axe results are separate from these functional observations. No claim of complete WCAG conformance is made.
