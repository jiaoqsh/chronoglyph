import { Check, Database, Globe2, LockKeyhole, Paintbrush, Server } from "lucide-react";
import { ScenePlayer } from "../../components/ScenePlayer";
import { useMediaQuery } from "../../core/useMediaQuery";
import type { SceneRenderContext } from "../../core/types";
import { HttpPageLoadStage } from "./HttpPageLoadStage";
import { PAGE_LOAD_LAYOUT_COMPACT, PAGE_LOAD_LAYOUT_WIDE } from "./layout";
import {
  derivePageLoadSceneState,
  PAGE_LOAD_DURATION_MS,
  PAGE_LOAD_PHASES,
  type PageLoadPhaseId,
} from "./model";

function PageLoadInspector({ context }: { context: SceneRenderContext<PageLoadPhaseId> }) {
  const state = derivePageLoadSceneState(context.elapsedMs);
  const facts = [
    { label: "dns", value: state.dnsResolved ? "203.0.113.42" : "resolving", icon: Globe2 },
    { label: "tls", value: state.secure ? "encrypted" : "pending", icon: LockKeyhole },
    { label: "http", value: state.statusCode, icon: Server },
    { label: "database", value: context.elapsedMs >= 4550 ? "12 rows" : "idle", icon: Database },
    { label: "browser", value: state.rendered ? "painted" : "loading", icon: state.rendered ? Check : Paintbrush },
  ];

  return (
    <aside className="cg-inspector" aria-label="Current page-load state">
      <div className="cg-inspector__heading">
        <span>Request state</span>
        <span className="cg-inspector__clock">T+{Math.round(context.elapsedMs)}ms</span>
      </div>
      <div className="cg-inspector__facts cg-page-load-facts">
        {facts.map((fact) => {
          const Icon = fact.icon;
          return (
            <div className="cg-inspector__fact" key={fact.label}>
              <Icon size={15} aria-hidden="true" />
              <span>{fact.label}</span>
              <strong>{fact.value}</strong>
            </div>
          );
        })}
      </div>
      <div className="cg-inspector__note">
        <span>What the browser hides</span>
        <p>One address-bar action crosses naming, security, transport, application, and data layers.</p>
      </div>
    </aside>
  );
}

export function HttpPageLoadDemo() {
  const compact = useMediaQuery("(max-width: 760px)");
  const layout = compact ? PAGE_LOAD_LAYOUT_COMPACT : PAGE_LOAD_LAYOUT_WIDE;

  return (
    <ScenePlayer
      phases={PAGE_LOAD_PHASES}
      durationMs={PAGE_LOAD_DURATION_MS}
      className="cg-reference-player cg-page-load-player"
    >
      {(context) => (
        <div className="cg-reference-demo">
          <div className="cg-stage-frame">
            <div className="cg-stage-frame__label">
              <span>HTTP PAGE LOAD / REFERENCE IMPLEMENTATION</span>
              <span>{compact ? "COMPACT" : "WIDE"} VIEW</span>
            </div>
            <HttpPageLoadStage context={context} layout={layout} compact={compact} />
          </div>
          <PageLoadInspector context={context} />
        </div>
      )}
    </ScenePlayer>
  );
}
