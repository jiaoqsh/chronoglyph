# Chronoglyph

[![CI](https://github.com/jiaoqsh/chronoglyph/actions/workflows/ci.yml/badge.svg)](https://github.com/jiaoqsh/chronoglyph/actions/workflows/ci.yml)
[![GitHub Pages](https://github.com/jiaoqsh/chronoglyph/actions/workflows/pages.yml/badge.svg)](https://jiaoqsh.github.io/chronoglyph/)
[![License](https://img.shields.io/badge/license-Apache--2.0-blue.svg)](LICENSE)

Chronoglyph is a timeline-driven SVG scene framework for explainable system and science animations. It provides deterministic time, phase navigation, reusable SVG primitives, responsive scene layouts, a production-quality HTTP page-load walkthrough, and authored natural-science scenes.

The name combines _chronos_ (time) and _glyph_ (a visual symbol): the framework turns time into inspectable visual notation without tying the API to SVG or timelines in its brand.

**[Open the live demo](https://jiaoqsh.github.io/chronoglyph/)** · **[Launch the Playground](https://jiaoqsh.github.io/chronoglyph/playground/)**

> Chronoglyph is pre-1.0. Its scene contract is usable today, while public entry points may still evolve between minor releases.

## Install

```bash
npm install chronoglyph
```

Chronoglyph uses React 18.2+ or React 19 as a peer dependency. Import the framework stylesheet once in your application:

```ts
import "chronoglyph/styles.css";
```

The stylesheet uses IBM Plex when available and falls back to system fonts. Font files are not injected into consuming applications.

## Run the repository locally

Requirements: Node.js 20.19+, 22.12+, or 24+.

```bash
npm install
npm run dev
```

Then open the local URL printed by Vite. The home page autoplays the familiar URL → DNS → TLS → HTTP GET → database query → HTML → render sequence and supports phase selection, Back, Next, Pause, Play, and Restart.

Open `http://localhost:5173/playground/` for the interactive scene workbench.

## Playground

The Playground organizes scenes into **Technology** and **Natural Science** domains and uses the same live Chronoglyph runtime for both. It supports:

- Filtering a stable scene catalog by domain.
- Three editable system diagrams: Edge Cache Miss, Queue Fan-out, and Two-phase Commit.
- Two authored science scenes: Water Cycle and DNA to Protein.
- Editing phases, nodes, phase-specific node states, edges, packets, and streams.
- Formatting, resetting, copying, applying, and deterministically restarting a scene.
- Preserving the last valid preview when the editor contains malformed or inconsistent data.
- Loading a scene directly, for example `/playground/?scene=water-cycle`.

The editor intentionally does not execute JavaScript. Runtime validation checks unique IDs, node and phase references, stage bounds, phase ordering, and transfer windows before replacing the preview. Authored science scenes show a phase blueprint instead of a misleading JSON editor because terrain and molecular geometry are intentionally domain-specific.

### Natural-science timelines

- **Water Cycle:** solar heating → evaporation → condensation → precipitation → runoff → collection. This is a simplified surface-and-atmosphere teaching model; it does not yet depict the full set of groundwater, infiltration, sublimation, or evapotranspiration flows described by the [USGS Water Science School](https://www.usgs.gov/water-science-school/water-cycle).
- **Eukaryotic DNA to Protein:** gene activation → transcription → RNA processing → nuclear export → translation → folding. Nuclear RNA processing and export make this specifically a simplified eukaryotic-cell narrative; see NCBI Bookshelf's [How Cells Read the Genome](https://www.ncbi.nlm.nih.gov/books/NBK21050/).

Both use dedicated wide and compact SVG compositions, deterministic phase snapshots, and the standard playback controls.

## Checks

```bash
npm run typecheck
npm run lint
npm test
npm run build
```

`npm run build` emits:

- `dist/`: the demonstration application.
- `dist-lib/chronoglyph.js`: the ES module library.
- `dist-lib/data.js`: data-driven scene schema, catalog, and renderer.
- `dist-lib/scenes.js`: authored natural-science scene components.
- `dist-lib/index.css`: framework styles exported as `chronoglyph/styles.css`.
- `dist-lib/scenes.css`: authored-scene styles exported as `chronoglyph/scenes.css`.
- `dist-lib/index.d.ts`, `data.d.ts`, and `scenes.d.ts`: bundled TypeScript declarations.

## Minimal scene

```tsx
import { SceneNode, ScenePlayer, Stage, type ScenePhase } from "chronoglyph";
import "chronoglyph/styles.css";

const phases = [
  { id: "receive", label: "RECEIVE", startMs: 0, snapshotMs: 300 },
  { id: "commit", label: "COMMIT", startMs: 1000, snapshotMs: 1250 },
] as const satisfies readonly ScenePhase[];

export function Example() {
  return (
    <ScenePlayer phases={phases} durationMs={1800}>
      {(scene) => (
        <Stage width={800} height={400} label="Example transaction">
          <SceneNode
            box={{ x: 40, y: 80, width: 220, height: 100 }}
            title="INGRESS"
            subtitle={scene.phase.label}
            active
          />
        </Stage>
      )}
    </ScenePlayer>
  );
}
```

Every frame is derived from `elapsedMs`. Scene code should use `scene.progress(startMs, endMs)` for continuous movement and `scene.phase` for named state changes. Selecting a phase seeks to its stable `snapshotMs`.

For data-driven scenes, use the same model as the Playground:

```tsx
import { BUILT_IN_EXAMPLES, DataDrivenScene } from "chronoglyph/data";
import "chronoglyph/styles.css";

export function CacheExample() {
  return <DataDrivenScene scene={BUILT_IN_EXAMPLES[0].scene} />;
}
```

Authored scenes have a separate entry point and stylesheet so consumers only pay for domain-specific geometry when they use it:

```tsx
import { GeneExpressionDemo, WaterCycleDemo } from "chronoglyph/scenes";
import "chronoglyph/styles.css";
import "chronoglyph/scenes.css";

export function ScienceExamples() {
  return (
    <>
      <WaterCycleDemo />
      <GeneExpressionDemo />
    </>
  );
}
```

## Package entry points

| Import | Purpose |
| --- | --- |
| `chronoglyph` | Clock, player, geometry helpers, and reusable SVG primitives |
| `chronoglyph/data` | Validated JSON scene model, renderer, examples, and catalog |
| `chronoglyph/scenes` | Authored Water Cycle and eukaryotic gene-expression scenes |
| `chronoglyph/styles.css` | Required framework styles |
| `chronoglyph/scenes.css` | Additional authored-scene styles |

## Architecture

```text
ScenePlayer
├── useSceneClock       requestAnimationFrame, FPS cap, viewport and motion policy
├── TimelineControls    named phases and transport controls
└── scene(context)
    ├── Stage           responsive SVG viewport
    ├── SceneNode       labeled system component
    ├── Edge            straight or curved relationship
    ├── Packet          deterministic point-in-time transfer
    ├── DataStream      repeated transfer markers
    └── scene model     domain-specific state and invariants
```

The framework owns time, geometry, controls, accessibility, and common visual primitives. A scene owns its domain state, coordinates, labels, timing windows, and responsive layout.

The scene catalog adds a separate metadata layer:

```text
SceneCatalogEntry
├── domain            technology | natural-science
├── category          NETWORK | EARTH SCIENCE | MOLECULAR BIOLOGY | ...
├── kind              editable | authored
├── phases            shared deterministic timeline contract
└── renderer
    ├── DataDrivenScene     validated JSON diagrams
    └── Authored SVG        scientific and illustrative geometry
```

Adding a category or domain only requires catalog metadata. The Playground navigation, counts, filtering, deep link, and metadata panel derive from the registry.

## Project layout

- `src/core/`: deterministic clock, time helpers, geometry, and media queries.
- `src/primitives/`: reusable SVG scene graph components.
- `src/controls/`: accessible timeline and transport controls.
- `src/components/`: the generic `ScenePlayer` composition layer.
- `src/scenes/http-page-load/`: home-page reference scene with separate model and wide/compact layouts.
- `src/scenes/water-cycle/`: Earth-science scene, state model, and organic wide/compact layouts.
- `src/scenes/gene-expression/`: molecular-biology scene from DNA through protein folding.
- `src/scenes/wal-push/`: retained storage-focused authored-scene example.
- `src/playground/`: scene catalog, runtime schema, authored/data render routing, and workbench UI.
- `specs/chronoglyph/`: requirements, design, and implementation checklist.

## Motion and accessibility

- The animation loop is capped at 24 FPS by default.
- `IntersectionObserver` suspends progression while the player is offscreen.
- `prefers-reduced-motion` disables autoplay and renders a stable final frame.
- Controls use native buttons, visible focus treatment, roving tab focus, and Arrow/Home/End keyboard navigation.
- Compact viewports use dedicated coordinates rather than shrinking the wide composition.

## Browser and runtime support

The published package targets modern evergreen browsers with ES2022, SVG, `requestAnimationFrame`, `IntersectionObserver`, and `matchMedia`. React 18.2 through React 19 are included in the CI consumer matrix. Server-side rendering is not yet a documented compatibility target.

## Contributing and security

Read [CONTRIBUTING.md](CONTRIBUTING.md) before proposing API or scene changes. Community behavior is governed by [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md). Report vulnerabilities privately according to [SECURITY.md](SECURITY.md).

Releases are documented in [CHANGELOG.md](CHANGELOG.md). Chronoglyph is licensed under the [Apache License 2.0](LICENSE).
