import { describe, expect, it } from "vitest";
import { siteHref, siteRoute } from "./sitePath";

describe("site paths", () => {
  it("builds links from the configured Vite base", () => {
    expect(siteHref()).toBe("/");
    expect(siteHref("playground/?scene=water-cycle")).toBe(
      "/playground/?scene=water-cycle",
    );
  });

  it("normalizes root and nested routes", () => {
    expect(siteRoute("/")).toBe("/");
    expect(siteRoute("/playground/")).toBe("/playground");
  });
});
