import { phaseAtTime } from "../../core/time";
import type { ScenePhase, SceneTone } from "../../core/types";

export type WalPhaseId = "push" | "index" | "upload" | "get" | "lock" | "put" | "refTxn";

export const WAL_DURATION_MS = 6800;

export const WAL_PHASES = [
  { id: "push", label: "PUSH", startMs: 0, snapshotMs: 450 },
  { id: "index", label: "INDEX", startMs: 900, snapshotMs: 1250 },
  { id: "upload", label: "UPLOAD", startMs: 1600, snapshotMs: 2400 },
  { id: "get", label: "GET", startMs: 2650, snapshotMs: 3050 },
  { id: "lock", label: "LOCK", startMs: 3450, snapshotMs: 3900 },
  { id: "put", label: "PUT", startMs: 4300, snapshotMs: 4550 },
  { id: "refTxn", label: "REF TXN", startMs: 5350, snapshotMs: 5650 },
] as const satisfies readonly ScenePhase<WalPhaseId>[];

export interface WalSceneState {
  phaseId: WalPhaseId;
  frontendStatus: string;
  frontendTone: SceneTone;
  repoStatus: string;
  repoTone: SceneTone;
  lockVisible: boolean;
  committed: boolean;
  objectCount: number;
  indexCount: number;
  etag: string;
}

const FRONTEND_STATE: Record<WalPhaseId, [string, SceneTone]> = {
  push: ["RECEIVING", "accent"],
  index: ["BUILD INDEX", "prepare"],
  upload: ["UPLOAD WAL", "data"],
  get: ["GET INDEX", "read"],
  lock: ["ACQUIRE LOCK", "lock"],
  put: ["PUT INDEX", "write"],
  refTxn: ["COMMIT REF", "commit"],
};

export function deriveWalSceneState(elapsedMs: number): WalSceneState {
  const phase = phaseAtTime(WAL_PHASES, elapsedMs);
  const [frontendStatus, frontendTone] = FRONTEND_STATE[phase.id];
  const committed = elapsedMs >= 6200;

  return {
    phaseId: phase.id,
    frontendStatus,
    frontendTone,
    repoStatus: committed ? "MAIN → 56E2" : phase.id === "lock" || phase.id === "put" ? "REF.LOCK" : "IDLE",
    repoTone: committed ? "commit" : phase.id === "lock" || phase.id === "put" ? "lock" : "neutral",
    lockVisible: elapsedMs >= 3650 && elapsedMs < 6200,
    committed,
    objectCount: elapsedMs >= 5000 ? 3 : elapsedMs >= 2150 ? 2 : 1,
    indexCount: elapsedMs >= 4750 ? 3 : 2,
    etag: elapsedMs >= 5000 ? "e41" : "e40",
  };
}
