import type { Anchor, ScenePhase, SceneTone } from "../core/types";

export interface SceneNodeState {
  subtitle?: string;
  tone?: SceneTone;
}

export interface SceneNodeDefinition {
  id: string;
  title: string;
  subtitle?: string;
  eyebrow?: string;
  x: number;
  y: number;
  width: number;
  height: number;
  tone?: SceneTone;
  activePhases?: string[];
  states?: Record<string, SceneNodeState>;
}

export interface SceneEdgeDefinition {
  id: string;
  from: string;
  to: string;
  fromAnchor?: Anchor;
  toAnchor?: Anchor;
  curvature?: number;
  tone?: SceneTone;
  activePhases?: string[];
  dashed?: boolean;
}

export interface SceneTransferDefinition {
  id: string;
  kind: "packet" | "stream";
  from: string;
  to: string;
  label?: string;
  startMs: number;
  endMs: number;
  fromAnchor?: Anchor;
  toAnchor?: Anchor;
  curvature?: number;
  tone?: SceneTone;
  reverse?: boolean;
}

export interface SceneDefinition {
  id: string;
  title: string;
  description: string;
  width: number;
  height: number;
  durationMs: number;
  phases: ScenePhase<string>[];
  nodes: SceneNodeDefinition[];
  edges: SceneEdgeDefinition[];
  transfers: SceneTransferDefinition[];
}

export class SceneDefinitionError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "SceneDefinitionError";
  }
}

const TONES: readonly SceneTone[] = [
  "neutral",
  "accent",
  "upload",
  "prepare",
  "data",
  "read",
  "lock",
  "write",
  "commit",
  "error",
];

const ANCHORS: readonly Anchor[] = [
  "left",
  "right",
  "top",
  "bottom",
  "center",
  "topLeft",
  "topRight",
  "bottomLeft",
  "bottomRight",
];

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function expectRecord(value: unknown, path: string): Record<string, unknown> {
  if (!isRecord(value)) {
    throw new SceneDefinitionError(`${path} must be an object.`);
  }
  return value;
}

function expectArray(value: unknown, path: string): unknown[] {
  if (!Array.isArray(value)) {
    throw new SceneDefinitionError(`${path} must be an array.`);
  }
  return value;
}

function expectString(value: unknown, path: string): string {
  if (typeof value !== "string" || value.trim().length === 0) {
    throw new SceneDefinitionError(`${path} must be a non-empty string.`);
  }
  return value;
}

function optionalString(value: unknown, path: string): string | undefined {
  return value === undefined ? undefined : expectString(value, path);
}

function expectNumber(value: unknown, path: string, minimum = 0): number {
  if (typeof value !== "number" || !Number.isFinite(value) || value < minimum) {
    throw new SceneDefinitionError(`${path} must be a finite number greater than or equal to ${minimum}.`);
  }
  return value;
}

function optionalNumber(value: unknown, path: string): number | undefined {
  if (value === undefined) {
    return undefined;
  }
  if (typeof value !== "number" || !Number.isFinite(value)) {
    throw new SceneDefinitionError(`${path} must be a finite number.`);
  }
  return value;
}

function optionalBoolean(value: unknown, path: string): boolean | undefined {
  if (value === undefined) {
    return undefined;
  }
  if (typeof value !== "boolean") {
    throw new SceneDefinitionError(`${path} must be a boolean.`);
  }
  return value;
}

function optionalTone(value: unknown, path: string): SceneTone | undefined {
  if (value === undefined) {
    return undefined;
  }
  if (typeof value !== "string" || !TONES.includes(value as SceneTone)) {
    throw new SceneDefinitionError(`${path} must be one of: ${TONES.join(", ")}.`);
  }
  return value as SceneTone;
}

function optionalAnchor(value: unknown, path: string): Anchor | undefined {
  if (value === undefined) {
    return undefined;
  }
  if (typeof value !== "string" || !ANCHORS.includes(value as Anchor)) {
    throw new SceneDefinitionError(`${path} must be one of: ${ANCHORS.join(", ")}.`);
  }
  return value as Anchor;
}

function optionalStringArray(value: unknown, path: string): string[] | undefined {
  if (value === undefined) {
    return undefined;
  }
  return expectArray(value, path).map((item, index) => expectString(item, `${path}[${index}]`));
}

function assignOptional<T extends object, K extends keyof T>(
  target: T,
  key: K,
  value: T[K] | undefined,
): void {
  if (value !== undefined) {
    target[key] = value;
  }
}

function parsePhase(value: unknown, index: number): ScenePhase<string> {
  const path = `phases[${index}]`;
  const source = expectRecord(value, path);
  return {
    id: expectString(source.id, `${path}.id`),
    label: expectString(source.label, `${path}.label`),
    startMs: expectNumber(source.startMs, `${path}.startMs`),
    snapshotMs: expectNumber(source.snapshotMs, `${path}.snapshotMs`),
  };
}

function parseNodeState(value: unknown, path: string): SceneNodeState {
  const source = expectRecord(value, path);
  const state: SceneNodeState = {};
  assignOptional(state, "subtitle", optionalString(source.subtitle, `${path}.subtitle`));
  assignOptional(state, "tone", optionalTone(source.tone, `${path}.tone`));
  return state;
}

function parseNode(value: unknown, index: number): SceneNodeDefinition {
  const path = `nodes[${index}]`;
  const source = expectRecord(value, path);
  const node: SceneNodeDefinition = {
    id: expectString(source.id, `${path}.id`),
    title: expectString(source.title, `${path}.title`),
    x: expectNumber(source.x, `${path}.x`),
    y: expectNumber(source.y, `${path}.y`),
    width: expectNumber(source.width, `${path}.width`, 1),
    height: expectNumber(source.height, `${path}.height`, 1),
  };
  assignOptional(node, "subtitle", optionalString(source.subtitle, `${path}.subtitle`));
  assignOptional(node, "eyebrow", optionalString(source.eyebrow, `${path}.eyebrow`));
  assignOptional(node, "tone", optionalTone(source.tone, `${path}.tone`));
  assignOptional(node, "activePhases", optionalStringArray(source.activePhases, `${path}.activePhases`));

  if (source.states !== undefined) {
    const states = expectRecord(source.states, `${path}.states`);
    node.states = Object.fromEntries(
      Object.entries(states).map(([phaseId, state]) => [
        phaseId,
        parseNodeState(state, `${path}.states.${phaseId}`),
      ]),
    );
  }
  return node;
}

function parseEdge(value: unknown, index: number): SceneEdgeDefinition {
  const path = `edges[${index}]`;
  const source = expectRecord(value, path);
  const edge: SceneEdgeDefinition = {
    id: expectString(source.id, `${path}.id`),
    from: expectString(source.from, `${path}.from`),
    to: expectString(source.to, `${path}.to`),
  };
  assignOptional(edge, "fromAnchor", optionalAnchor(source.fromAnchor, `${path}.fromAnchor`));
  assignOptional(edge, "toAnchor", optionalAnchor(source.toAnchor, `${path}.toAnchor`));
  assignOptional(edge, "curvature", optionalNumber(source.curvature, `${path}.curvature`));
  assignOptional(edge, "tone", optionalTone(source.tone, `${path}.tone`));
  assignOptional(edge, "activePhases", optionalStringArray(source.activePhases, `${path}.activePhases`));
  assignOptional(edge, "dashed", optionalBoolean(source.dashed, `${path}.dashed`));
  return edge;
}

function parseTransfer(value: unknown, index: number): SceneTransferDefinition {
  const path = `transfers[${index}]`;
  const source = expectRecord(value, path);
  if (source.kind !== "packet" && source.kind !== "stream") {
    throw new SceneDefinitionError(`${path}.kind must be packet or stream.`);
  }
  const transfer: SceneTransferDefinition = {
    id: expectString(source.id, `${path}.id`),
    kind: source.kind,
    from: expectString(source.from, `${path}.from`),
    to: expectString(source.to, `${path}.to`),
    startMs: expectNumber(source.startMs, `${path}.startMs`),
    endMs: expectNumber(source.endMs, `${path}.endMs`),
  };
  assignOptional(transfer, "label", optionalString(source.label, `${path}.label`));
  assignOptional(transfer, "fromAnchor", optionalAnchor(source.fromAnchor, `${path}.fromAnchor`));
  assignOptional(transfer, "toAnchor", optionalAnchor(source.toAnchor, `${path}.toAnchor`));
  assignOptional(transfer, "curvature", optionalNumber(source.curvature, `${path}.curvature`));
  assignOptional(transfer, "tone", optionalTone(source.tone, `${path}.tone`));
  assignOptional(transfer, "reverse", optionalBoolean(source.reverse, `${path}.reverse`));
  return transfer;
}

function assertUniqueIds(items: readonly { id: string }[], path: string): void {
  const ids = new Set<string>();
  for (const item of items) {
    if (ids.has(item.id)) {
      throw new SceneDefinitionError(`${path} contains duplicate id "${item.id}".`);
    }
    ids.add(item.id);
  }
}

function assertPhaseReferences(
  phaseIds: ReadonlySet<string>,
  values: readonly string[] | undefined,
  path: string,
): void {
  for (const phaseId of values ?? []) {
    if (!phaseIds.has(phaseId)) {
      throw new SceneDefinitionError(`${path} references unknown phase "${phaseId}".`);
    }
  }
}

function validateScene(scene: SceneDefinition): SceneDefinition {
  if (scene.phases.length === 0) {
    throw new SceneDefinitionError("phases must contain at least one phase.");
  }
  if (scene.nodes.length === 0) {
    throw new SceneDefinitionError("nodes must contain at least one node.");
  }
  assertUniqueIds(scene.phases, "phases");
  assertUniqueIds(scene.nodes, "nodes");
  assertUniqueIds(scene.edges, "edges");
  assertUniqueIds(scene.transfers, "transfers");

  const phaseIds = new Set(scene.phases.map((phase) => phase.id));
  const nodeIds = new Set(scene.nodes.map((node) => node.id));
  scene.phases.forEach((phase, index) => {
    const previous = scene.phases[index - 1];
    if (previous && phase.startMs <= previous.startMs) {
      throw new SceneDefinitionError(`phases[${index}].startMs must be greater than the previous phase.`);
    }
    if (phase.startMs > scene.durationMs || phase.snapshotMs > scene.durationMs) {
      throw new SceneDefinitionError(`phases[${index}] must fit inside durationMs.`);
    }
    if (phase.snapshotMs < phase.startMs) {
      throw new SceneDefinitionError(`phases[${index}].snapshotMs must not precede startMs.`);
    }
  });

  scene.nodes.forEach((node, index) => {
    if (node.x + node.width > scene.width || node.y + node.height > scene.height) {
      throw new SceneDefinitionError(`nodes[${index}] must fit inside the stage bounds.`);
    }
    assertPhaseReferences(phaseIds, node.activePhases, `nodes[${index}].activePhases`);
    for (const phaseId of Object.keys(node.states ?? {})) {
      if (!phaseIds.has(phaseId)) {
        throw new SceneDefinitionError(`nodes[${index}].states references unknown phase "${phaseId}".`);
      }
    }
  });

  scene.edges.forEach((edge, index) => {
    if (!nodeIds.has(edge.from) || !nodeIds.has(edge.to)) {
      throw new SceneDefinitionError(`edges[${index}] must reference existing from and to nodes.`);
    }
    assertPhaseReferences(phaseIds, edge.activePhases, `edges[${index}].activePhases`);
  });

  scene.transfers.forEach((transfer, index) => {
    if (!nodeIds.has(transfer.from) || !nodeIds.has(transfer.to)) {
      throw new SceneDefinitionError(`transfers[${index}] must reference existing from and to nodes.`);
    }
    if (transfer.endMs <= transfer.startMs) {
      throw new SceneDefinitionError(`transfers[${index}].endMs must be greater than startMs.`);
    }
    if (transfer.endMs > scene.durationMs) {
      throw new SceneDefinitionError(`transfers[${index}] must fit inside durationMs.`);
    }
    if (transfer.kind === "packet" && !transfer.label) {
      throw new SceneDefinitionError(`transfers[${index}].label is required for packet transfers.`);
    }
  });
  return scene;
}

export function parseSceneDefinition(value: unknown): SceneDefinition {
  const source = expectRecord(value, "scene");
  const scene: SceneDefinition = {
    id: expectString(source.id, "id"),
    title: expectString(source.title, "title"),
    description: expectString(source.description, "description"),
    width: expectNumber(source.width, "width", 320),
    height: expectNumber(source.height, "height", 240),
    durationMs: expectNumber(source.durationMs, "durationMs", 1),
    phases: expectArray(source.phases, "phases").map(parsePhase),
    nodes: expectArray(source.nodes, "nodes").map(parseNode),
    edges: expectArray(source.edges, "edges").map(parseEdge),
    transfers: expectArray(source.transfers, "transfers").map(parseTransfer),
  };
  return validateScene(scene);
}

export function parseSceneDefinitionJson(source: string): SceneDefinition {
  let value: unknown;
  try {
    value = JSON.parse(source) as unknown;
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown JSON error";
    throw new SceneDefinitionError(`Invalid JSON: ${message}`);
  }
  return parseSceneDefinition(value);
}

export function sceneDefinitionToJson(scene: SceneDefinition): string {
  return JSON.stringify(scene, null, 2);
}

export function cloneSceneDefinition(scene: SceneDefinition): SceneDefinition {
  return structuredClone(scene);
}
