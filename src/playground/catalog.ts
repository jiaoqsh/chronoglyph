import type { ScenePhase } from "../core/types";
import { GENE_EXPRESSION_DURATION_MS, GENE_EXPRESSION_PHASES } from "../scenes/gene-expression/model";
import { WATER_CYCLE_DURATION_MS, WATER_CYCLE_PHASES } from "../scenes/water-cycle/model";
import { BUILT_IN_EXAMPLES, type BuiltInExample } from "./examples";

export type SceneDomainId = "technology" | "natural-science";
export type SceneDomainFilter = "all" | SceneDomainId;
export type AuthoredSceneId = "water-cycle" | "dna-to-protein";

export interface SceneDomain {
  id: SceneDomainId;
  label: string;
  description: string;
}

export const SCENE_DOMAINS: readonly SceneDomain[] = [
  {
    id: "technology",
    label: "TECHNOLOGY",
    description: "Networks, messaging, storage, and distributed coordination.",
  },
  {
    id: "natural-science",
    label: "NATURAL SCIENCE",
    description: "Earth systems, cells, molecules, and physical processes.",
  },
] as const;

interface SceneCatalogEntryBase {
  id: string;
  domain: SceneDomainId;
  category: string;
  title: string;
  description: string;
  summary: string;
  entityCount: number;
}

export interface EditableSceneCatalogEntry extends SceneCatalogEntryBase {
  kind: "editable";
  example: BuiltInExample;
}

export interface AuthoredSceneCatalogEntry extends SceneCatalogEntryBase {
  kind: "authored";
  authoredId: AuthoredSceneId;
  durationMs: number;
  phases: readonly ScenePhase<string>[];
  blueprint: readonly string[];
}

export type SceneCatalogEntry = EditableSceneCatalogEntry | AuthoredSceneCatalogEntry;

const TECHNOLOGY_CATALOG: readonly EditableSceneCatalogEntry[] = BUILT_IN_EXAMPLES.map((example) => ({
  id: example.id,
  domain: "technology",
  category: example.category,
  title: example.scene.title,
  description: example.scene.description,
  summary: example.summary,
  entityCount: example.scene.nodes.length,
  kind: "editable",
  example,
}));

const NATURAL_SCIENCE_CATALOG: readonly AuthoredSceneCatalogEntry[] = [
  {
    id: "water-cycle",
    authoredId: "water-cycle",
    domain: "natural-science",
    category: "EARTH SCIENCE",
    title: "Water cycle",
    description: "Follow a simplified surface-and-atmosphere path from ocean heating through clouds, land, and collection.",
    summary: "Evaporation, clouds, rain, runoff, and renewal.",
    entityCount: 4,
    durationMs: WATER_CYCLE_DURATION_MS,
    phases: WATER_CYCLE_PHASES,
    blueprint: ["Ocean reservoir", "Atmosphere + cloud", "Mountain watershed", "River return path"],
    kind: "authored",
  },
  {
    id: "dna-to-protein",
    authoredId: "dna-to-protein",
    domain: "natural-science",
    category: "MOLECULAR BIOLOGY",
    title: "DNA to protein",
    description: "Trace a simplified eukaryotic path from an activated gene to a folded protein in the cytoplasm.",
    summary: "Eukaryotic transcription, RNA processing, translation, and folding.",
    entityCount: 5,
    durationMs: GENE_EXPRESSION_DURATION_MS,
    phases: GENE_EXPRESSION_PHASES,
    blueprint: ["DNA + active gene", "Pre-mRNA + mature mRNA", "Nuclear pore", "Ribosome", "Protein chain"],
    kind: "authored",
  },
] as const;

export const SCENE_CATALOG: readonly SceneCatalogEntry[] = [
  ...TECHNOLOGY_CATALOG,
  ...NATURAL_SCIENCE_CATALOG,
] as const;

export function scenePhases(entry: SceneCatalogEntry): readonly ScenePhase<string>[] {
  return entry.kind === "editable" ? entry.example.scene.phases : entry.phases;
}

export function filterSceneCatalog(domain: SceneDomainFilter): readonly SceneCatalogEntry[] {
  return domain === "all" ? SCENE_CATALOG : SCENE_CATALOG.filter((entry) => entry.domain === domain);
}

export function resolveCatalogScene(id: string | null | undefined): SceneCatalogEntry {
  return SCENE_CATALOG.find((entry) => entry.id === id) ?? SCENE_CATALOG[0]!;
}

export function sceneCountForDomain(domain: SceneDomainFilter): number {
  return filterSceneCatalog(domain).length;
}
