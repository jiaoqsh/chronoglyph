# Chronoglyph Design

## Architecture

Chronoglyph separates reusable rendering mechanics from scene-specific narration:

1. Core: deterministic time, phase selection, geometry, viewport awareness.
2. Primitives: SVG stage, nodes, edges, packets, and streams.
3. Controls: phase strip and transport controls.
4. Player: composes the clock, deterministic seek state, and scene render callback.
5. Scenes: own domain state, coordinates, labels, and event windows. The home-page reference uses a familiar HTTP page-load narrative; natural-science scenes add organic illustrations while sharing the same deterministic player.
6. Catalog: registers stable ids, domains, categories, summaries, scene kind, phase counts, and preview metadata independently from UI order.
7. Playground: validates constrained JSON for editable diagrams and presents a phase blueprint for authored scenes that require domain-specific SVG geometry.

## State model

The central invariant is that the frame is a pure function of time and inputs. Selecting a phase supplies an explicit timestamp override; autoplay supplies the scene clock timestamp.

## Rendering

SVG is used for scalable geometry, DOM accessibility, CSS theming, and article integration. Motion for React is limited to entry and exit transitions; continuous protocol movement is calculated with deterministic geometry functions.

## Visual direction

The demo uses an industrial, utilitarian visual system: near-black olive surfaces, precise line work, orange active states, green commits, IBM Plex typography, and an asymmetric editorial layout.

Natural-science scenes preserve that instrument-panel shell but use an organic interior vocabulary. Water uses cyan flow, pale cloud masses, topographic silhouettes, and curved circulation paths. Gene expression uses a cell boundary, nuclear membrane, paired DNA strands, an RNA thread, ribosome geometry, and a folded protein chain. Orange remains the single active-event accent.

## Home reference narrative

The primary demonstration follows a page load through URL, DNS, TLS, HTTP GET, database query, HTML response, and browser render. It uses a browser node, DNS resolver, edge endpoint, application server, and database. Dedicated wide and compact layouts preserve the same semantic topology rather than merely shrinking coordinates.

## Playground boundary

The playground is data-driven rather than an in-browser code executor. Its schema covers phases, nodes, edges, packets, streams, tones, and phase-specific node states. Validation occurs before the active scene is replaced, so malformed input cannot destroy the last renderable preview.

Built-in examples are immutable source definitions. Selecting one deep-clones its data into the editor, while Apply creates a separately validated runtime value and increments the player key to restart time deterministically.

## Scene catalog and authored-scene boundary

The catalog uses a stable `domain` id (`technology` or `natural-science`) plus a more specific display category. Entries are discriminated as `editable` or `authored`: editable entries retain the JSON workflow, while authored entries provide timeline metadata and a dedicated SVG renderer. This keeps category growth declarative without pretending that terrain, molecular structure, and system nodes share one universal shape schema.

The Playground filter operates on domain ids and derives labels/counts from catalog metadata. Selecting a filter that excludes the current scene moves selection to the first scene in that domain, keeping the URL, preview, and rail synchronized.

## Natural-science narratives

The water-cycle scene follows solar heating, evaporation, condensation, precipitation, runoff, and collection. Curved particle paths make the cycle explicit, and phase snapshots expose the active reservoir and process.

The DNA-to-protein scene follows gene activation, transcription, RNA processing, nuclear export, translation, and folding. It intentionally presents the central-dogma narrative as a teaching model rather than a complete account of gene regulation.

## Testing strategy

- Unit tests cover clamping, event progress, phase resolution, point interpolation, and bounded controls.
- Component tests cover phase selection and play/pause behavior.
- TypeScript, ESLint, demo build, library build, and declaration generation run before completion.
- Browser validation covers autoplay, phase selection, Back/Next, responsive layout, and console errors.
- Playground tests cover schema validation, reference integrity, built-in example parsing, invalid-input recovery, and query-based example selection.
- Catalog tests cover domain filtering, stable lookup, authored/editable discrimination, and safe fallback.
- Natural-science model tests cover causal phase order and final-state invariants; browser validation covers phase selection and wide/compact compositions.
