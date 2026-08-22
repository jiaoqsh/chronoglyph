import { describe, expect, it } from "vitest";
import { deriveWalSceneState } from "./model";

describe("WAL push scene model", () => {
  it("does not commit the ref while the lock is active", () => {
    const locked = deriveWalSceneState(4550);
    expect(locked.lockVisible).toBe(true);
    expect(locked.committed).toBe(false);
    expect(locked.repoStatus).toBe("REF.LOCK");
  });

  it("exposes the durable commit only at the end of the ref transaction", () => {
    const committed = deriveWalSceneState(6300);
    expect(committed.committed).toBe(true);
    expect(committed.lockVisible).toBe(false);
    expect(committed.repoStatus).toBe("MAIN → 56E2");
  });
});
