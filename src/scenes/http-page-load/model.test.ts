import { describe, expect, it } from "vitest";
import { derivePageLoadSceneState, PAGE_LOAD_PHASES } from "./model";

describe("HTTP page-load scene model", () => {
  it("keeps the classic page-load phases in causal order", () => {
    expect(PAGE_LOAD_PHASES.map((phase) => phase.id)).toEqual([
      "url",
      "dns",
      "tls",
      "get",
      "query",
      "html",
      "render",
    ]);
  });

  it("shows DNS resolution before a secure connection", () => {
    const resolving = derivePageLoadSceneState(1200);
    expect(resolving.phaseId).toBe("dns");
    expect(resolving.dnsResolved).toBe(false);
    expect(resolving.secure).toBe(false);

    const secured = derivePageLoadSceneState(2400);
    expect(secured.dnsResolved).toBe(true);
    expect(secured.secure).toBe(true);
  });

  it("does not expose a response before the database result", () => {
    const querying = derivePageLoadSceneState(4150);
    expect(querying.phaseId).toBe("query");
    expect(querying.databaseStatus).toBe("SELECT ARTICLES");
    expect(querying.statusCode).toBe("—");
  });

  it("finishes with a successful response and painted browser", () => {
    const rendered = derivePageLoadSceneState(6600);
    expect(rendered.phaseId).toBe("render");
    expect(rendered.statusCode).toBe("200 OK");
    expect(rendered.rendered).toBe(true);
    expect(rendered.browserStatus).toContain("FIRST PAINT");
  });
});
