import { anchor } from "../../core/geometry";
import type { SceneRenderContext } from "../../core/types";
import { Badge } from "../../primitives/Badge";
import { DataStream } from "../../primitives/DataStream";
import { Edge } from "../../primitives/Edge";
import { Packet } from "../../primitives/Packet";
import { SceneNode } from "../../primitives/SceneNode";
import { Stage } from "../../primitives/Stage";
import type { PageLoadLayout } from "./layout";
import { derivePageLoadSceneState, type PageLoadPhaseId } from "./model";
import { BrowserViewport, DatabaseRows, ServiceRows } from "./PageLoadArtifacts";

export interface HttpPageLoadStageProps {
  context: SceneRenderContext<PageLoadPhaseId>;
  layout: PageLoadLayout;
  compact?: boolean;
}

export function HttpPageLoadStage({ context, layout, compact = false }: HttpPageLoadStageProps) {
  const state = derivePageLoadSceneState(context.elapsedMs);
  const browserDns = {
    from: anchor(layout.browser, compact ? "bottom" : "right"),
    to: anchor(layout.dns, compact ? "top" : "left"),
  };
  const browserEdge = {
    from: anchor(layout.browser, compact ? "bottom" : "right"),
    to: anchor(layout.edge, compact ? "top" : "left"),
  };
  const edgeApp = {
    from: anchor(layout.edge, compact ? "bottom" : "right"),
    to: anchor(layout.app, compact ? "top" : "left"),
  };
  const appDatabase = {
    from: anchor(layout.app, "bottom"),
    to: anchor(layout.database, "top"),
  };
  const dnsCurvature = compact ? 0.14 : -0.22;
  const edgeCurvature = compact ? -0.14 : 0;

  return (
    <Stage width={layout.width} height={layout.height} label="Browser page-load request lifecycle">
      <g className="cg-stage-grid" aria-hidden="true">
        {Array.from({ length: Math.ceil(layout.width / 80) + 1 }, (_, index) => (
          <line key={index} x1={index * 80} y1="0" x2={index * 80} y2={layout.height} />
        ))}
      </g>

      <Edge
        {...browserDns}
        curvature={dnsCurvature}
        active={state.phaseId === "dns"}
        tone="read"
      />
      <Edge
        {...browserEdge}
        curvature={edgeCurvature}
        active={["tls", "get", "html"].includes(state.phaseId)}
        tone={state.phaseId === "tls" ? "lock" : state.phaseId === "html" ? "commit" : "accent"}
      />
      <Edge
        {...edgeApp}
        active={["get", "query", "html"].includes(state.phaseId)}
        tone={state.phaseId === "html" ? "commit" : "accent"}
      />
      <Edge
        {...appDatabase}
        active={state.phaseId === "query"}
        tone="prepare"
      />

      <SceneNode
        box={layout.browser}
        eyebrow="CHROME / TAB 01"
        title="BROWSER"
        subtitle={state.browserStatus}
        tone={state.browserTone}
        active
      />
      <SceneNode
        box={layout.dns}
        title="DNS RESOLVER"
        subtitle={state.dnsStatus}
        tone="read"
        active={state.phaseId === "dns"}
      />
      <SceneNode
        box={layout.edge}
        eyebrow="EDGE / 203.0.113.42"
        title="HTTPS ENDPOINT"
        subtitle={state.edgeStatus}
        tone={state.edgeTone}
        active={["tls", "get", "html"].includes(state.phaseId)}
      />
      <SceneNode
        box={layout.app}
        eyebrow="APP / NODE-04"
        title="WEB SERVER"
        subtitle={state.appStatus}
        tone={state.appTone}
        active={["get", "query", "html"].includes(state.phaseId)}
      />
      <SceneNode
        box={layout.database}
        title="DATABASE"
        subtitle={state.databaseStatus}
        tone={state.databaseTone}
        active={state.phaseId === "query"}
      />

      <BrowserViewport box={layout.browser} rendered={state.rendered} compact={compact} />
      <ServiceRows
        box={layout.edge}
        rows={[state.secure ? "TLS / ESTABLISHED" : "TLS / WAITING", state.statusCode]}
        tone={state.responseStarted ? "commit" : "read"}
        compact={compact}
      />
      <ServiceRows
        box={layout.app}
        rows={["ROUTE /", state.responseStarted ? "SSR / 12 KB" : "WORKER / READY", "CACHE / WARM"]}
        tone={state.responseStarted ? "commit" : "data"}
        compact={compact}
      />
      <DatabaseRows box={layout.database} complete={context.elapsedMs >= 4550} />

      {state.phaseId === "url" ? (
        <Badge
          x={layout.browser.x + layout.browser.width - 79}
          y={layout.browser.y + 18}
          label="ENTER ↵"
          tone="accent"
          width={66}
        />
      ) : null}

      <Packet
        {...browserDns}
        progress={context.progress(880, 1330)}
        curvature={dnsCurvature}
        label="A?"
        visible={context.elapsedMs >= 880 && context.elapsedMs < 1330}
        tone="read"
        width={48}
      />
      <Packet
        from={browserDns.to}
        to={browserDns.from}
        progress={context.progress(1300, 1680)}
        curvature={-dnsCurvature}
        label="IP"
        visible={context.elapsedMs >= 1300 && context.elapsedMs < 1680}
        tone="read"
        width={48}
      />
      <Packet
        {...browserEdge}
        progress={context.progress(1720, 2170)}
        curvature={edgeCurvature}
        label="CLIENT HELLO"
        visible={context.elapsedMs >= 1720 && context.elapsedMs < 2170}
        tone="lock"
        width={96}
      />
      <Packet
        from={browserEdge.to}
        to={browserEdge.from}
        progress={context.progress(2140, 2550)}
        curvature={-edgeCurvature}
        label="TLS 1.3"
        visible={context.elapsedMs >= 2140 && context.elapsedMs < 2550}
        tone="lock"
        width={72}
      />
      <Packet
        {...browserEdge}
        progress={context.progress(2620, 3150)}
        curvature={edgeCurvature}
        label="GET /"
        visible={context.elapsedMs >= 2620 && context.elapsedMs < 3150}
        tone="accent"
      />
      <Packet
        {...edgeApp}
        progress={context.progress(3000, 3650)}
        label="FORWARD"
        visible={context.elapsedMs >= 3000 && context.elapsedMs < 3650}
        tone="accent"
        width={80}
      />
      <Packet
        {...appDatabase}
        progress={context.progress(3720, 4200)}
        label="SELECT"
        visible={context.elapsedMs >= 3720 && context.elapsedMs < 4200}
        tone="prepare"
      />
      <Packet
        from={appDatabase.to}
        to={appDatabase.from}
        progress={context.progress(4160, 4800)}
        label="12 ROWS"
        visible={context.elapsedMs >= 4160 && context.elapsedMs < 4800}
        tone="commit"
        width={76}
      />
      <DataStream
        from={edgeApp.to}
        to={edgeApp.from}
        progress={context.progress(4920, 5550)}
        active={context.elapsedMs >= 4920 && context.elapsedMs < 5550}
        tone="data"
        count={5}
      />
      <DataStream
        from={browserEdge.to}
        to={browserEdge.from}
        progress={context.progress(5350, 6120)}
        curvature={-edgeCurvature}
        active={context.elapsedMs >= 5350 && context.elapsedMs < 6120}
        tone="commit"
        count={6}
      />
      {state.responseStarted ? (
        <Badge
          x={layout.edge.x + layout.edge.width - 81}
          y={layout.edge.y + layout.edge.height - 35}
          label="200 OK"
          tone="commit"
          width={68}
        />
      ) : null}
    </Stage>
  );
}
