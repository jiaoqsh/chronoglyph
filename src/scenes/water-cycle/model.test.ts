import { describe, expect, it } from "vitest";
import { deriveWaterCycleState, WATER_CYCLE_PHASES } from "./model";

describe("Water cycle scene model", () => {
  it("keeps the familiar hydrologic cycle in causal order", () => {
    expect(WATER_CYCLE_PHASES.map((phase) => phase.id)).toEqual([
      "sunlight",
      "evaporation",
      "condensation",
      "precipitation",
      "runoff",
      "collection",
    ]);
  });

  it("moves water through atmosphere, land, and back to the ocean", () => {
    expect(deriveWaterCycleState(2900).reservoir).toBe("CLOUD");
    expect(deriveWaterCycleState(4100).raining).toBe(true);
    expect(deriveWaterCycleState(5350).returning).toBe(true);
  });

  it("finishes with the cycle ready to repeat", () => {
    const collected = deriveWaterCycleState(7000);
    expect(collected.phaseId).toBe("collection");
    expect(collected.reservoir).toBe("OCEAN");
    expect(collected.cycleComplete).toBe(true);
  });
});
