import {
  AlertTriangle,
  Braces,
  Check,
  Clipboard,
  Code2,
  FlaskConical,
  Layers3,
  Play,
  RotateCcw,
  Sparkles,
} from "lucide-react";
import { useState } from "react";
import { SiteHeader } from "../components/SiteHeader";
import { siteHref } from "../sitePath";
import { AuthoredScenePreview } from "./AuthoredScenePreview";
import {
  filterSceneCatalog,
  resolveCatalogScene,
  SCENE_CATALOG,
  SCENE_DOMAINS,
  sceneCountForDomain,
  scenePhases,
  type SceneCatalogEntry,
  type SceneDomainFilter,
} from "./catalog";
import { DataDrivenScene } from "./DataDrivenScene";
import { BUILT_IN_EXAMPLES } from "./examples";
import {
  cloneSceneDefinition,
  parseSceneDefinitionJson,
  sceneDefinitionToJson,
  type SceneDefinition,
} from "./schema";

function initialCatalogEntry(): SceneCatalogEntry {
  if (typeof window === "undefined") {
    return SCENE_CATALOG[0]!;
  }
  return resolveCatalogScene(new URLSearchParams(window.location.search).get("scene"));
}

function editableSceneFor(entry: SceneCatalogEntry): SceneDefinition {
  return entry.kind === "editable" ? entry.example.scene : BUILT_IN_EXAMPLES[0]!.scene;
}

export default function PlaygroundPage() {
  const firstEntry = initialCatalogEntry();
  const firstEditableScene = editableSceneFor(firstEntry);
  const [selectedId, setSelectedId] = useState(firstEntry.id);
  const [activeDomain, setActiveDomain] = useState<SceneDomainFilter>("all");
  const [source, setSource] = useState(() => sceneDefinitionToJson(firstEditableScene));
  const [activeScene, setActiveScene] = useState<SceneDefinition>(() =>
    cloneSceneDefinition(firstEditableScene),
  );
  const [revision, setRevision] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState(
    firstEntry.kind === "editable" ? "BUILT-IN EXAMPLE LOADED" : "AUTHORED SVG SCENE LOADED",
  );

  const selectedEntry = resolveCatalogScene(selectedId);
  const visibleEntries = filterSceneCatalog(activeDomain);

  const selectEntry = (entry: SceneCatalogEntry): void => {
    setSelectedId(entry.id);
    if (entry.kind === "editable") {
      const nextScene = cloneSceneDefinition(entry.example.scene);
      setSource(sceneDefinitionToJson(nextScene));
      setActiveScene(nextScene);
      setNotice("BUILT-IN EXAMPLE LOADED");
    } else {
      setNotice("AUTHORED SVG SCENE LOADED");
    }
    setRevision((current) => current + 1);
    setError(null);
    window.history.replaceState(null, "", siteHref(`playground/?scene=${entry.id}`));
  };

  const selectDomain = (domain: SceneDomainFilter): void => {
    setActiveDomain(domain);
    const nextEntries = filterSceneCatalog(domain);
    if (!nextEntries.some((entry) => entry.id === selectedId)) {
      const firstVisible = nextEntries[0];
      if (firstVisible) {
        selectEntry(firstVisible);
      }
    }
  };

  const applySource = (): void => {
    try {
      const nextScene = parseSceneDefinitionJson(source);
      setActiveScene(nextScene);
      setRevision((current) => current + 1);
      setError(null);
      setNotice("SCENE APPLIED / CLOCK RESTARTED");
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Unable to parse this scene.");
      setNotice("LAST VALID PREVIEW PRESERVED");
    }
  };

  const formatSource = (): void => {
    try {
      const formatted = sceneDefinitionToJson(parseSceneDefinitionJson(source));
      setSource(formatted);
      setError(null);
      setNotice("SOURCE VALIDATED + FORMATTED");
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Unable to format this scene.");
      setNotice("FORMAT BLOCKED");
    }
  };

  const resetSource = (): void => {
    if (selectedEntry.kind !== "editable") {
      return;
    }
    setSource(sceneDefinitionToJson(selectedEntry.example.scene));
    setError(null);
    setNotice("EDITOR RESET TO BUILT-IN SOURCE");
  };

  const copySource = async (): Promise<void> => {
    try {
      await navigator.clipboard.writeText(source);
      setNotice("SOURCE COPIED TO CLIPBOARD");
    } catch {
      setNotice("CLIPBOARD ACCESS UNAVAILABLE");
    }
  };

  const lineCount = source.split("\n").length;
  const selectedPhases = scenePhases(selectedEntry);

  return (
    <main className="cg-playground-page">
      <SiteHeader active="playground" />

      <section className="cg-playground-intro">
        <div>
          <p className="cg-eyebrow">PLAYGROUND / CATEGORIZED SCENE LIBRARY</p>
          <h1>Shape knowledge into motion.</h1>
        </div>
        <p>
          Explore editable system diagrams and authored scientific narratives through one
          deterministic SVG runtime. Every scene remains seekable, inspectable, and phase-driven.
        </p>
      </section>

      <section
        className={`cg-workbench${selectedEntry.kind === "authored" ? " is-authored" : ""}`}
        aria-label="Chronoglyph scene playground"
      >
        <aside className="cg-example-rail">
          <div className="cg-workbench-heading">
            <Sparkles size={15} aria-hidden="true" />
            <span>SCENE CATALOG</span>
          </div>
          <nav className="cg-domain-filter" aria-label="Scene domain filters">
            <button
              type="button"
              aria-pressed={activeDomain === "all"}
              onClick={() => selectDomain("all")}
            >
              <span>ALL</span>
              <small>{sceneCountForDomain("all")}</small>
            </button>
            {SCENE_DOMAINS.map((domain) => (
              <button
                type="button"
                key={domain.id}
                aria-pressed={activeDomain === domain.id}
                onClick={() => selectDomain(domain.id)}
              >
                <span>{domain.label}</span>
                <small>{sceneCountForDomain(domain.id)}</small>
              </button>
            ))}
          </nav>
          <div className="cg-example-list">
            {visibleEntries.map((entry) => {
              const absoluteIndex = SCENE_CATALOG.findIndex((candidate) => candidate.id === entry.id);
              return (
                <button
                  type="button"
                  key={entry.id}
                  className="cg-example-option"
                  aria-pressed={selectedId === entry.id}
                  onClick={() => selectEntry(entry)}
                >
                  <span className="cg-example-option__index">
                    {String(absoluteIndex + 1).padStart(2, "0")}
                  </span>
                  <span className="cg-example-option__category">{entry.category}</span>
                  <strong>{entry.title}</strong>
                  <span>{entry.summary}</span>
                  <small>
                    {scenePhases(entry).length} PHASES / {entry.kind === "editable" ? "EDITABLE JSON" : "AUTHORED SVG"}
                  </small>
                </button>
              );
            })}
          </div>
          <details className="cg-schema-help">
            <summary>CATALOG NOTES</summary>
            <p>
              Domains are stable metadata. Editable diagrams use the constrained JSON schema;
              authored scenes use dedicated SVG geometry for scientific forms.
            </p>
          </details>
        </aside>

        {selectedEntry.kind === "editable" ? (
          <section className="cg-editor-panel" aria-label="Scene JSON editor">
            <div className="cg-workbench-heading">
              <Code2 size={15} aria-hidden="true" />
              <span>SCENE.JSON</span>
              <span className="cg-workbench-heading__meta">{lineCount} LINES</span>
            </div>
            <div className="cg-editor-toolbar">
              <button type="button" onClick={formatSource}>
                <Braces size={14} aria-hidden="true" /> FORMAT
              </button>
              <button type="button" onClick={resetSource}>
                <RotateCcw size={14} aria-hidden="true" /> RESET
              </button>
              <button type="button" onClick={() => void copySource()}>
                <Clipboard size={14} aria-hidden="true" /> COPY
              </button>
            </div>
            <textarea
              aria-label="Scene JSON"
              value={source}
              onChange={(event) => setSource(event.target.value)}
              spellCheck={false}
            />
            <div className={`cg-editor-status ${error ? "is-error" : "is-valid"}`} role="status">
              {error ? <AlertTriangle size={14} aria-hidden="true" /> : <Check size={14} aria-hidden="true" />}
              <span>{error ?? notice}</span>
            </div>
            <button type="button" className="cg-apply-button" onClick={applySource}>
              <Play size={16} aria-hidden="true" /> APPLY + RESTART
            </button>
          </section>
        ) : (
          <section className="cg-authored-blueprint" aria-label="Authored scene blueprint">
            <div className="cg-workbench-heading">
              <FlaskConical size={15} aria-hidden="true" />
              <span>SCENE BLUEPRINT</span>
              <span className="cg-workbench-heading__meta">CURATED SVG</span>
            </div>
            <div className="cg-authored-blueprint__intro">
              <span>{selectedEntry.category}</span>
              <h2>{selectedEntry.title}</h2>
              <p>{selectedEntry.description}</p>
            </div>
            <ol className="cg-blueprint-phases" aria-label={`${selectedEntry.title} phases`}>
              {selectedPhases.map((phase, index) => (
                <li key={phase.id}>
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <strong>{phase.label}</strong>
                  <small>T+{phase.snapshotMs}MS</small>
                </li>
              ))}
            </ol>
            <div className="cg-blueprint-entities">
              <div>
                <Layers3 size={15} aria-hidden="true" />
                <span>VISUAL ENTITIES</span>
              </div>
              <ul>
                {selectedEntry.blueprint.map((item) => <li key={item}>{item}</li>)}
              </ul>
            </div>
            <p className="cg-blueprint-note">
              The timeline is data-driven, while the scientific illustration uses custom SVG
              geometry tailored to the subject.
            </p>
          </section>
        )}

        <section className="cg-preview-panel" aria-label="Live scene preview">
          <div className="cg-workbench-heading">
            <span className="cg-live-dot" aria-hidden="true" />
            <span>LIVE PREVIEW</span>
            <span className="cg-workbench-heading__meta">REV {String(revision).padStart(2, "0")}</span>
          </div>
          <div className="cg-preview-meta">
            <div>
              <span>{selectedEntry.domain} / {selectedEntry.category}</span>
              <h2>{selectedEntry.kind === "editable" ? activeScene.title : selectedEntry.title}</h2>
            </div>
            <p>{selectedEntry.kind === "editable" ? activeScene.description : selectedEntry.description}</p>
          </div>
          <div className="cg-preview-canvas">
            {selectedEntry.kind === "editable" ? (
              <DataDrivenScene scene={activeScene} revision={revision} />
            ) : (
              <AuthoredScenePreview sceneId={selectedEntry.authoredId} />
            )}
          </div>
        </section>
      </section>

      <footer className="cg-footer cg-playground-footer">
        <span>CHRONOGLYPH / PLAYGROUND V0.4</span>
        <span>EDITABLE DIAGRAMS + AUTHORED SCIENCE SCENES</span>
      </footer>
    </main>
  );
}
