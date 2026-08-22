import { describe, expect, it } from "vitest";
import { boundedPhaseIndex, clamp, phaseAtTime, phaseIndexAtTime, windowProgress } from "./time";

const phases = [
  { id: "receive", label: "RECEIVE", startMs: 0, snapshotMs: 100 },
  { id: "persist", label: "PERSIST", startMs: 500, snapshotMs: 700 },
  { id: "commit", label: "COMMIT", startMs: 1000, snapshotMs: 1200 },
] as const;

describe("timeline utilities", () => {
  it("clamps values and event progress", () => {
    expect(clamp(-2, 0, 10)).toBe(0);
    expect(clamp(12, 0, 10)).toBe(10);
    expect(windowProgress(750, 500, 1000)).toBe(0.5);
    expect(windowProgress(1200, 500, 1000)).toBe(1);
  });

  it("resolves named phases from deterministic timestamps", () => {
    expect(phaseIndexAtTime(phases, 0)).toBe(0);
    expect(phaseIndexAtTime(phases, 999)).toBe(1);
    expect(phaseAtTime(phases, 1000).id).toBe("commit");
  });

  it("keeps transport indices inside valid bounds", () => {
    expect(boundedPhaseIndex(-1, phases.length)).toBe(0);
    expect(boundedPhaseIndex(9, phases.length)).toBe(2);
  });
});
