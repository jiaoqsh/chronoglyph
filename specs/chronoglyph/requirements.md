# Chronoglyph Requirements

## Problem

Technical articles need animations that remain inspectable, seekable, accessible, responsive, and deterministic. Video and GIF assets do not provide those properties, while one-off SVG animations duplicate timing, geometry, controls, and accessibility logic.

## Scope

Chronoglyph provides a React and TypeScript framework for timeline-driven SVG scenes, a production-quality HTTP page-load demonstration, and a categorized Playground for both editable system diagrams and authored natural-science scenes. The earlier WAL push scene remains available as an authored-scene reference but is no longer the home-page example.

## User stories

1. As an article author, I can describe a technical scene with reusable SVG primitives.
2. As a reader, I can play, pause, step through, and select named phases.
3. As a developer, I can render any deterministic timestamp for tests and screenshots.
4. As a mobile or reduced-motion user, I receive an appropriate layout and motion mode.
5. As an explorer, I can open built-in system scenes and change their definitions without writing React code.
6. As a scene author, I receive actionable validation errors without losing my last valid preview.
7. As an explorer, I can browse scenes by domain and distinguish editable diagrams from authored visual narratives.
8. As a science educator, I can step through familiar natural processes without needing to understand software architecture notation.

## Acceptance criteria

1. When a scene is playing, the framework shall derive the rendered frame from elapsed timeline time.
2. When a reader selects a phase, the framework shall pause and render the phase timestamp deterministically.
3. When Back or Next is activated, the framework shall move to the adjacent valid phase without exceeding timeline bounds.
4. While a scene is outside the viewport, the framework shall suspend clock progression.
5. While reduced motion is requested, the framework shall render a stable phase and avoid autoplay.
6. When the viewport is compact, the demonstration shall use a dedicated compact layout rather than shrinking desktop geometry alone.
7. When the package build runs, it shall produce a demo application, an ES module library, CSS, and TypeScript declarations.
8. When automated checks run, geometry, timeline, controls, type checking, linting, and production builds shall pass.
9. When a reader opens `/playground`, the application shall present an editable scene definition beside a live deterministic preview.
10. When a built-in example is selected, the playground shall load its source, metadata, and preview without mixing state from the previous example.
11. When valid scene JSON is applied, the preview shall restart using the new phases, nodes, edges, and transfers.
12. When invalid scene JSON is applied, the playground shall preserve the last valid preview and explain the first actionable validation error.
13. When the playground is opened with a `scene` query parameter, it shall select the matching built-in example and safely fall back when the id is unknown.
14. When the playground viewport is narrow, the example picker, editor, preview, and controls shall remain reachable without page-level horizontal overflow.
15. When a reader opens the home page, the primary reference scene shall explain the familiar browser page-load sequence from URL entry through rendering.
16. When the page-load scene reaches a phase snapshot, the visible node states and transfers shall match DNS, TLS, HTTP, database, response, or render semantics for that phase.
17. When the page-load scene is compact, it shall use dedicated node coordinates and keep the browser, network services, application, and database legible.
18. When the Playground opens, it shall expose an extensible scene catalog with stable domain metadata rather than deriving categories from presentation order.
19. When a domain filter is selected, the Playground shall show only matching scenes and keep a valid scene selected.
20. When Water cycle is selected, the Playground shall render solar heating, evaporation, condensation, precipitation, runoff, and collection as deterministic phase snapshots.
21. When DNA to protein is selected, the Playground shall render gene activation, transcription, RNA processing, nuclear export, translation, and protein folding as deterministic phase snapshots.
22. When an authored natural-science scene is selected, the Playground shall identify it as a curated SVG scene and show its phase blueprint without presenting an incompatible JSON editor.
23. When a natural-science scene is viewed on a narrow viewport, it shall use a dedicated compact composition and remain reachable without page-level horizontal overflow.

## Non-goals

- A general-purpose video editor.
- A JSON-only language capable of describing every possible animation; bespoke scientific illustrations remain authored React/SVG scenes.
- Canvas or WebGL rendering.
- A hosted collaboration or publishing service.
- Executing arbitrary JavaScript or TypeScript entered by a reader.
