import {
  ArrowDownRight,
  ArrowUpRight,
  Braces,
  CloudRain,
  DatabaseZap,
  Dna,
  Gauge,
  Globe2,
  Layers3,
  Waypoints,
} from "lucide-react";
import { SiteHeader } from "./components/SiteHeader";
import { SCENE_CATALOG, scenePhases } from "./playground/catalog";
import { HttpPageLoadDemo } from "./scenes/http-page-load/HttpPageLoadDemo";
import { siteHref } from "./sitePath";

const CAPABILITIES = [
  {
    icon: Gauge,
    title: "Deterministic clock",
    text: "One elapsed time drives every node, edge, packet and state transition.",
  },
  {
    icon: Layers3,
    title: "Composable SVG",
    text: "Build with semantic primitives instead of a one-off animation canvas.",
  },
  {
    icon: Braces,
    title: "Scene as data",
    text: "Phases, snapshots and timing windows stay inspectable and testable.",
  },
] as const;

const EXAMPLE_ICONS = {
  "http-cache": Globe2,
  "queue-fanout": Waypoints,
  "two-phase-commit": DatabaseZap,
  "water-cycle": CloudRain,
  "dna-to-protein": Dna,
} as const;

export default function App() {
  return (
    <main className="mx-auto min-h-screen max-w-[1680px] px-4 py-5 sm:px-6 lg:px-10 lg:py-8">
      <SiteHeader active="home" />

      <section id="top" className="cg-hero">
        <div className="cg-hero__index">01 — TIME</div>
        <div className="cg-hero__copy">
          <p className="cg-eyebrow">TIMELINE-DRIVEN / FRAMEWORK PROTOTYPE</p>
          <h1>
            Explain processes
            <span>in motion.</span>
          </h1>
        </div>
        <div className="cg-hero__aside">
          <p>
            Chronoglyph turns complex processes into deterministic, scrub-friendly SVG scenes. The
            same clock can narrate a network request, the water cycle, gene expression, or any
            process whose meaning changes over time.
          </p>
          <a href="#lab">
            OPEN THE LAB <ArrowDownRight size={16} aria-hidden="true" />
          </a>
        </div>
      </section>

      <section className="cg-capability-strip" aria-label="Framework capabilities">
        {CAPABILITIES.map((capability, index) => {
          const Icon = capability.icon;
          return (
            <article key={capability.title}>
              <div className="cg-capability-strip__number">0{index + 1}</div>
              <Icon size={20} strokeWidth={1.5} aria-hidden="true" />
              <h2>{capability.title}</h2>
              <p>{capability.text}</p>
            </article>
          );
        })}
      </section>

      <section className="cg-example-overview" aria-labelledby="example-heading">
        <div className="cg-section-heading">
          <div>
            <p className="cg-eyebrow">BUILT-IN SCENES / STARTING POINTS</p>
            <h2 id="example-heading">Processes you can take apart.</h2>
          </div>
          <p>
            Browse editable system diagrams and authored scientific illustrations in one catalog.
            Every sample uses the same deterministic timeline and phase controls.
          </p>
        </div>
        <div className="cg-example-grid">
          {SCENE_CATALOG.map((example, index) => {
            const Icon = EXAMPLE_ICONS[example.id as keyof typeof EXAMPLE_ICONS] ?? Braces;
            return (
              <a
                key={example.id}
                href={siteHref(`playground/?scene=${example.id}`)}
              >
                <span className="cg-example-grid__index">0{index + 1}</span>
                <Icon size={25} strokeWidth={1.4} aria-hidden="true" />
                <span className="cg-example-grid__category">{example.category}</span>
                <h3>{example.title}</h3>
                <p>{example.summary}</p>
                <span className="cg-example-grid__meta">
                  {scenePhases(example).length} PHASES / {example.entityCount} ENTITIES
                  <ArrowUpRight size={15} aria-hidden="true" />
                </span>
              </a>
            );
          })}
        </div>
      </section>

      <section id="lab" className="cg-lab">
        <div className="cg-section-heading">
          <div>
            <p className="cg-eyebrow">CLASSIC WALKTHROUGH / EVERY PAGE LOAD</p>
            <h2>What happens after you press Enter?</h2>
          </div>
          <p>
            One familiar action crosses DNS, TLS, HTTP, application code, a database, and finally
            the browser renderer. Select any phase to inspect its stable snapshot.
          </p>
        </div>
        <HttpPageLoadDemo />
      </section>

      <section className="cg-api-note">
        <div>
          <p className="cg-eyebrow">MINIMAL API</p>
          <h2>Your scene owns the meaning. Chronoglyph owns time.</h2>
        </div>
        <pre aria-label="Chronoglyph usage example">
          <code>{`<ScenePlayer phases={phases} durationMs={7200}>
  {(scene) => <ProcessFlow {...scene} />}
</ScenePlayer>`}</code>
        </pre>
      </section>

      <footer className="cg-footer">
        <span>CHRONOGLYPH / OPEN PROTOTYPE</span>
        <span>BUILT WITH REACT + SVG + MOTION</span>
      </footer>
    </main>
  );
}
