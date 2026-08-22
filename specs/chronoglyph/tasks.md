# Implementation Plan

- [x] 1. Establish requirements and design
  - Define the deterministic time model and framework boundaries.
  - Define visual direction and verification requirements.
  - _Requirements: 1-8_

- [x] 2. Scaffold the project
  - Configure Vite, React, TypeScript, Tailwind, tests, lint, and library output.
  - _Requirements: 7-8_

- [x] 3. Implement the framework core
  - Add scene clock, phase utilities, viewport behavior, and geometry helpers.
  - _Requirements: 1-5_

- [x] 4. Implement SVG primitives and controls
  - Add reusable scene graph components and accessible transport controls.
  - _Requirements: 1-3_

- [x] 5. Implement the WAL push demonstration
  - Add desktop and compact layouts, timeline events, state panels, and inspector.
  - _Requirements: 1-6_

- [x] 6. Verify and document
  - Complete automated checks, browser validation, README, and package usage example.
  - _Requirements: 7-8_

## Initial v0.1 verification record

- TypeScript: passed.
- ESLint: passed.
- Vitest: 4 files, 11 tests passed.
- Demo, ES module, CSS, and declaration builds: passed.
- Package dry run: 34 files, 12.3 kB compressed.
- Browser: phase selection, Back/Next bounds, restart, play/pause, wide layout, and 390 px compact layout passed.

## Playground expansion

- [x] 7. Define the data-driven scene schema
  - Add runtime validation, reference integrity checks, and safe JSON parsing.
  - _Requirements: 9-13_

- [x] 8. Add built-in examples and generic scene renderer
  - Provide HTTP cache, queue fan-out, and two-phase commit scenes.
  - _Requirements: 9-11_

- [x] 9. Build the Playground experience
  - Add navigation, example selection, JSON editor actions, errors, and live preview.
  - _Requirements: 9-14_

- [x] 10. Verify and document the Playground
  - Extend tests, builds, README, and desktop/mobile browser validation.
  - _Requirements: 9-14_

## Playground v0.2 verification record

- TypeScript and ESLint: passed.
- Vitest: 6 files, 21 tests passed.
- Demo, ES module, CSS, and declaration builds: passed.
- Package dry run: 42 files, 19.3 kB compressed.
- Browser: query deep links, example switching, valid Apply, invalid-input recovery, and home-page sample links passed.
- Responsive browser: 390 px workbench and live preview passed with no page-level horizontal overflow.

## Home reference refresh

- [x] 11. Design the classic HTTP page-load narrative
  - Define URL, DNS, TLS, GET, query, HTML, and render phase snapshots.
  - _Requirements: 15-17_

- [x] 12. Implement the page-load reference scene
  - Add the scene model, wide/compact layouts, browser and protocol artifacts, and state inspector.
  - _Requirements: 15-17_

- [x] 13. Replace and verify the home-page demonstration
  - Update home copy, tests, docs, builds, and desktop/mobile browser verification.
  - _Requirements: 15-17_

## Home reference v0.3 verification record

- TypeScript, ESLint, demo build, library build, CSS, and declarations: passed.
- Vitest: 8 files, 26 tests passed.
- Browser phase snapshots: QUERY at 4150 ms and RENDER at 6600 ms passed.
- Browser final state: 200 OK, 12 database rows, and painted browser passed.
- Responsive browser: dedicated 390 px compact topology passed with no page-level horizontal overflow.

## Natural-science catalog expansion

- [x] 14. Add an extensible categorized scene catalog
  - Separate stable domain metadata from scene-specific display categories.
  - Support editable data scenes and authored SVG scenes through a discriminated catalog entry.
  - _Requirements: 18-19, 22_

- [x] 15. Implement the Water cycle scene
  - Add the six-phase state model, organic wide/compact SVG compositions, particles, and phase controls.
  - _Requirements: 20, 23_

- [x] 16. Implement the DNA-to-protein scene
  - Add the six-phase state model, cellular wide/compact SVG compositions, molecular artifacts, and phase controls.
  - _Requirements: 21, 23_

- [x] 17. Integrate classification into the Playground
  - Add domain filters, authored-scene blueprints, URL synchronization, and selection behavior.
  - _Requirements: 18-19, 22-23_

- [x] 18. Verify and document the natural-science release
  - Extend unit/component tests, update home/catalog copy and README, and validate desktop/mobile behavior in a browser.
  - _Requirements: 18-23_

## Natural-science catalog v0.4 verification record

- TypeScript, ESLint, demo build, library build, CSS, and declarations: passed.
- Vitest: 11 files, 39 tests passed.
- Dependency audit: 0 vulnerabilities.
- Package dry run: 60 files, 28.2 kB compressed.
- Browser catalog: domain filters, selected-scene fallback, editable/authored routing, and deep-link URL synchronization passed.
- Water cycle snapshot: precipitation at 4100 ms passed.
- DNA-to-protein snapshot: folded protein at 7850 ms passed.
- Responsive browser: both authored scenes used dedicated 390 px compact view boxes with no page-level horizontal overflow.
- Browser console: no warning or error entries during home, catalog, Water cycle, and DNA-to-protein flows.
