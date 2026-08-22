# Contributing to Chronoglyph

Thanks for helping Chronoglyph make complex processes easier to inspect and explain.

## Before opening a pull request

1. Search existing issues and discussions.
2. For a substantial API, schema, or visual-language change, open an issue first so the contract can be agreed before implementation.
3. Keep changes focused. Avoid mixing refactors, dependency upgrades, and a new scene in one pull request.

## Local development

Chronoglyph requires Node.js 20.19+, 22.12+, or 24+.

```bash
npm install
npm run dev
```

Before submitting a pull request, run:

```bash
npm run check
npm run build
npm pack --dry-run
```

## Project boundaries

- `src/core/`, `src/primitives/`, `src/controls/`, and `src/components/` form the stable framework surface.
- `src/playground/` contains the data schema, catalog, and interactive workbench.
- `src/scenes/` contains authored examples with domain-specific geometry.
- Framework styles belong in `src/chronoglyph.css`; authored-scene styles belong in `src/scenes.css`; site-only styles belong in `src/demo.css`.

Public exports are intentionally split across `chronoglyph`, `chronoglyph/data`, and `chronoglyph/scenes`. Update the README, declarations, package smoke test, and changelog when changing those boundaries.

## Adding a scene

- Use one deterministic elapsed-time source. Do not create an independent animation clock inside a scene.
- Provide stable phase snapshots and compact as well as wide layouts when geometry requires them.
- Add model tests for state transitions and timing windows.
- For scientific scenes, identify the represented scope, label simplifications, and link to authoritative references.
- Check `prefers-reduced-motion`, keyboard controls, direct links, and mobile layout.

## Commit and pull-request notes

Use a clear imperative summary. In the pull request, explain the behavior change, the public API impact, tests performed, and screenshots for visual changes.

By contributing, you agree that your contribution is licensed under the Apache License 2.0.
