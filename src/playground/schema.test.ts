import { describe, expect, it } from "vitest";
import { BUILT_IN_EXAMPLES, resolveBuiltInExample } from "./examples";
import {
  parseSceneDefinition,
  parseSceneDefinitionJson,
  SceneDefinitionError,
  sceneDefinitionToJson,
} from "./schema";

describe("playground scene schema", () => {
  it("round-trips every built-in example through JSON validation", () => {
    for (const example of BUILT_IN_EXAMPLES) {
      const parsed = parseSceneDefinitionJson(sceneDefinitionToJson(example.scene));
      expect(parsed.id).toBe(example.id);
      expect(parsed.phases.length).toBeGreaterThan(0);
      expect(parsed.nodes.length).toBeGreaterThan(0);
    }
  });

  it("returns an actionable JSON syntax error", () => {
    expect(() => parseSceneDefinitionJson('{ "id": ')).toThrowError(
      /Invalid JSON:/,
    );
  });

  it("rejects unknown node references", () => {
    const source = structuredClone(BUILT_IN_EXAMPLES[0]!.scene);
    source.edges[0]!.to = "missing-node";
    expect(() => parseSceneDefinition(source)).toThrowError(
      new SceneDefinitionError("edges[0] must reference existing from and to nodes."),
    );
  });

  it("rejects phase-specific states that reference unknown phases", () => {
    const source = structuredClone(BUILT_IN_EXAMPLES[0]!.scene);
    source.nodes[0]!.states = { impossible: { subtitle: "BAD STATE" } };
    expect(() => parseSceneDefinition(source)).toThrowError(/unknown phase "impossible"/);
  });

  it("rejects transfer windows outside the scene duration", () => {
    const source = structuredClone(BUILT_IN_EXAMPLES[0]!.scene);
    source.transfers[0]!.endMs = source.durationMs + 1;
    expect(() => parseSceneDefinition(source)).toThrowError(/must fit inside durationMs/);
  });

  it("resolves requested examples and safely falls back", () => {
    expect(resolveBuiltInExample("queue-fanout").id).toBe("queue-fanout");
    expect(resolveBuiltInExample("does-not-exist").id).toBe(BUILT_IN_EXAMPLES[0]!.id);
  });
});
