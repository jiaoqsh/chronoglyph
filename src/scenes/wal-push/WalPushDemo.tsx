import { Check, CircleDot, Database, GitCommitHorizontal, LockKeyhole } from "lucide-react";
import { ScenePlayer } from "../../components/ScenePlayer";
import { useMediaQuery } from "../../core/useMediaQuery";
import type { SceneRenderContext } from "../../core/types";
import { WAL_LAYOUT_COMPACT, WAL_LAYOUT_WIDE } from "./layout";
import {
  deriveWalSceneState,
  WAL_DURATION_MS,
  WAL_PHASES,
  type WalPhaseId,
} from "./model";
import { WalPushStage } from "./WalPushStage";

function SceneInspector({ context }: { context: SceneRenderContext<WalPhaseId> }) {
  const state = deriveWalSceneState(context.elapsedMs);
  const facts = [
    { label: "active phase", value: context.phase.label, icon: CircleDot },
    { label: "wal objects", value: String(state.objectCount), icon: Database },
    { label: "ref lock", value: state.lockVisible ? "held" : "open", icon: LockKeyhole },
    {
      label: "commit",
      value: state.committed ? "durable" : "pending",
      icon: state.committed ? Check : GitCommitHorizontal,
    },
  ];

  return (
    <aside className="cg-inspector" aria-label="Current scene state">
      <div className="cg-inspector__heading">
        <span>Live state</span>
        <span className="cg-inspector__clock">T+{Math.round(context.elapsedMs)}ms</span>
      </div>
      <div className="cg-inspector__facts">
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
        <span>Invariant</span>
        <p>The ref moves only after the WAL object and updated index are durable.</p>
      </div>
    </aside>
  );
}

export function WalPushDemo() {
  const compact = useMediaQuery("(max-width: 760px)");
  const layout = compact ? WAL_LAYOUT_COMPACT : WAL_LAYOUT_WIDE;

  return (
    <ScenePlayer phases={WAL_PHASES} durationMs={WAL_DURATION_MS} className="cg-wal-player">
      {(context) => (
        <div className="cg-wal-demo">
          <div className="cg-stage-frame">
            <div className="cg-stage-frame__label">
              <span>WAL PUSH / REFERENCE IMPLEMENTATION</span>
              <span>{compact ? "COMPACT" : "WIDE"} VIEW</span>
            </div>
            <WalPushStage context={context} layout={layout} compact={compact} />
          </div>
          <SceneInspector context={context} />
        </div>
      )}
    </ScenePlayer>
  );
}
