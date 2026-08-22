import { describe, expect, it } from "vitest";
import {
  filterSceneCatalog,
  resolveCatalogScene,
  SCENE_CATALOG,
  sceneCountForDomain,
  scenePhases,
} from "./catalog";

describe("scene catalog", () => {
  it("registers technology and natural-science scenes with unique ids", () => {
    expect(new Set(SCENE_CATALOG.map((entry) => entry.id)).size).toBe(SCENE_CATALOG.length);
    expect(sceneCountForDomain("technology")).toBe(3);
    expect(sceneCountForDomain("natural-science")).toBe(2);
  });

  it("filters by stable domains instead of display categories", () => {
    const science = filterSceneCatalog("natural-science");
    expect(science.map((entry) => entry.id)).toEqual(["water-cycle", "dna-to-protein"]);
    expect(science.every((entry) => entry.kind === "authored")).toBe(true);
  });

  it("resolves requested scenes and falls back safely", () => {
    expect(resolveCatalogScene("dna-to-protein").title).toBe("DNA to protein");
    expect(resolveCatalogScene("missing").id).toBe(SCENE_CATALOG[0]!.id);
  });

  it("exposes phases through one catalog helper for both scene kinds", () => {
    expect(scenePhases(resolveCatalogScene("http-cache")).length).toBe(6);
    expect(scenePhases(resolveCatalogScene("water-cycle")).map((phase) => phase.id)).toContain("precipitation");
  });
});
