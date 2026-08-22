import { phaseAtTime } from "../../core/time";
import type { ScenePhase } from "../../core/types";

export type WaterCyclePhaseId =
  | "sunlight"
  | "evaporation"
  | "condensation"
  | "precipitation"
  | "runoff"
  | "collection";

export const WATER_CYCLE_DURATION_MS = 7800;

export const WATER_CYCLE_PHASES = [
  { id: "sunlight", label: "SOLAR HEAT", startMs: 0, snapshotMs: 380 },
  { id: "evaporation", label: "EVAPORATION", startMs: 1100, snapshotMs: 1550 },
  { id: "condensation", label: "CONDENSATION", startMs: 2450, snapshotMs: 2900 },
  { id: "precipitation", label: "PRECIPITATION", startMs: 3650, snapshotMs: 4100 },
  { id: "runoff", label: "RUNOFF", startMs: 4900, snapshotMs: 5350 },
  { id: "collection", label: "COLLECTION", startMs: 6350, snapshotMs: 6900 },
] as const satisfies readonly ScenePhase<WaterCyclePhaseId>[];

export interface WaterCycleSceneState {
  phaseId: WaterCyclePhaseId;
  process: string;
  reservoir: string;
  detail: string;
  atmosphereLoaded: boolean;
  raining: boolean;
  returning: boolean;
  cycleComplete: boolean;
}

const PHASE_COPY: Record<WaterCyclePhaseId, Pick<WaterCycleSceneState, "process" | "reservoir" | "detail">> = {
  sunlight: {
    process: "SOLAR ENERGY",
    reservoir: "OCEAN",
    detail: "Sunlight warms surface water and supplies energy for a phase change.",
  },
  evaporation: {
    process: "LIQUID → VAPOR",
    reservoir: "LOWER ATMOSPHERE",
    detail: "Water molecules escape the ocean surface and rise as vapor.",
  },
  condensation: {
    process: "VAPOR → DROPLETS",
    reservoir: "CLOUD",
    detail: "Cooling vapor condenses around particles into suspended droplets.",
  },
  precipitation: {
    process: "CLOUD → LAND",
    reservoir: "MOUNTAIN",
    detail: "Droplets grow heavy enough to fall as rain over higher terrain.",
  },
  runoff: {
    process: "GRAVITY FLOW",
    reservoir: "RIVER",
    detail: "Surface water follows streams and rivers downhill toward the ocean.",
  },
  collection: {
    process: "CYCLE RENEWED",
    reservoir: "OCEAN",
    detail: "Water collects in the ocean, ready to circulate through the system again.",
  },
};

export function deriveWaterCycleState(elapsedMs: number): WaterCycleSceneState {
  const phase = phaseAtTime(WATER_CYCLE_PHASES, elapsedMs);
  return {
    phaseId: phase.id,
    ...PHASE_COPY[phase.id],
    atmosphereLoaded: elapsedMs >= 2850,
    raining: phase.id === "precipitation",
    returning: phase.id === "runoff" || phase.id === "collection",
    cycleComplete: elapsedMs >= 6900,
  };
}
