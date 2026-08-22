import { LockKeyhole } from "lucide-react";
import { anchor } from "../../core/geometry";
import type { SceneRenderContext } from "../../core/types";
import { Badge } from "../../primitives/Badge";
import { DataStream } from "../../primitives/DataStream";
import { Edge } from "../../primitives/Edge";
import { Packet } from "../../primitives/Packet";
import { SceneNode } from "../../primitives/SceneNode";
import { Stage } from "../../primitives/Stage";
import type { WalLayout } from "./layout";
import { deriveWalSceneState, type WalPhaseId } from "./model";
import { WalIndex, WalLog } from "./WalArtifacts";

export interface WalPushStageProps {
  context: SceneRenderContext<WalPhaseId>;
  layout: WalLayout;
  compact?: boolean;
}

export function WalPushStage({ context, layout, compact = false }: WalPushStageProps) {
  const state = deriveWalSceneState(context.elapsedMs);
  const clientToFrontend = {
    from: anchor(layout.client, compact ? "bottom" : "right"),
    to: anchor(layout.frontend, compact ? "top" : "left"),
  };
  const frontendToStore = {
    from: anchor(layout.frontend, compact ? "bottomRight" : "right"),
    to: anchor(layout.store, compact ? "top" : "left"),
  };
  const frontendToRepo = {
    from: anchor(layout.frontend, "bottom"),
    to: anchor(layout.repo, "top"),
  };
  const uploadProgress = context.progress(1600, 2650);
  const getProgress = context.progress(2650, 3450);
  const putProgress = context.progress(4300, 5350);
  const refProgress = context.progress(5350, 6300);
  const packetCurvature = compact ? -0.12 : 0;

  const frontendIndexX = layout.frontend.x + 22;
  const frontendIndexY = layout.frontend.y + (compact ? 108 : 128);
  const frontendIndexWidth = layout.frontend.width - 44;
  const storeContentX = layout.store.x + 20;
  const storeContentY = layout.store.y + (compact ? 74 : 92);

  return (
    <Stage width={layout.width} height={layout.height} label="Git push write-ahead log sequence">
      <g className="cg-stage-grid" aria-hidden="true">
        {Array.from({ length: 13 }, (_, index) => (
          <line key={index} x1={index * 80} y1="0" x2={index * 80} y2={layout.height} />
        ))}
      </g>

      <Edge
        {...clientToFrontend}
        active={state.phaseId === "push"}
        tone="accent"
        dashed={state.phaseId !== "push"}
      />
      <Edge
        {...frontendToStore}
        curvature={packetCurvature}
        active={["upload", "get", "put"].includes(state.phaseId)}
        tone={state.phaseId === "get" ? "read" : state.phaseId === "put" ? "write" : "data"}
      />
      <Edge
        {...frontendToRepo}
        active={["lock", "refTxn"].includes(state.phaseId)}
        tone={state.phaseId === "refTxn" ? "commit" : "lock"}
      />

      <SceneNode
        box={layout.client}
        title="GIT CLIENT"
        subtitle="git push origin main"
        tone="accent"
        active={state.phaseId === "push"}
      />
      <SceneNode
        box={layout.frontend}
        eyebrow="WRITE FRONTEND"
        title="WALGIT"
        subtitle={state.frontendStatus}
        tone={state.frontendTone}
        active
      />
      <SceneNode
        box={layout.repo}
        title="BARE REPO"
        subtitle={state.repoStatus}
        tone={state.repoTone}
        active={state.phaseId === "lock" || state.phaseId === "refTxn"}
      >
        {state.lockVisible ? (
          <foreignObject x={layout.repo.width - 46} y="19" width="22" height="22">
            <LockKeyhole className="cg-node-lock" size={19} aria-label="Reference locked" />
          </foreignObject>
        ) : null}
      </SceneNode>
      <SceneNode
        box={layout.store}
        title="S3 / OBJECT STORE"
        subtitle="IMMUTABLE WAL + INDEX"
        tone="data"
        active={["upload", "get", "put"].includes(state.phaseId)}
      />

      <WalIndex
        x={frontendIndexX}
        y={frontendIndexY}
        width={frontendIndexWidth}
        count={state.indexCount}
      />
      <WalLog x={storeContentX} y={storeContentY} count={state.objectCount} compact={compact} />
      <WalIndex
        x={storeContentX}
        y={storeContentY + (compact ? 82 : 95)}
        width={layout.store.width - 40}
        count={compact ? Math.min(2, state.indexCount) : state.indexCount}
        etag={state.etag}
      />

      <Packet
        {...clientToFrontend}
        progress={context.progress(80, 820)}
        label="PACK"
        visible={state.phaseId === "push"}
        tone="accent"
      />
      <DataStream
        {...frontendToStore}
        progress={uploadProgress}
        curvature={packetCurvature}
        active={state.phaseId === "upload"}
        tone="data"
      />
      <Packet
        from={frontendToStore.to}
        to={frontendToStore.from}
        progress={getProgress}
        curvature={-packetCurvature}
        label="INDEX"
        visible={state.phaseId === "get"}
        tone="read"
      />
      <Packet
        {...frontendToRepo}
        progress={context.progress(3450, 4200)}
        label="LOCK"
        visible={state.phaseId === "lock"}
        tone="lock"
      />
      <Packet
        {...frontendToStore}
        progress={putProgress}
        curvature={packetCurvature}
        label="PUT WAL"
        visible={state.phaseId === "put"}
        tone="write"
        width={78}
      />
      <Packet
        {...frontendToRepo}
        progress={refProgress}
        label="REF TXN"
        visible={state.phaseId === "refTxn" && !state.committed}
        tone="commit"
        width={78}
      />
      {state.committed ? (
        <Badge
          x={layout.repo.x + layout.repo.width - 88}
          y={layout.repo.y + layout.repo.height - 35}
          label="COMMITTED"
          tone="commit"
          width={76}
        />
      ) : null}
    </Stage>
  );
}
