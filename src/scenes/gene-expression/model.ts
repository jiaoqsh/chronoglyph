import { phaseAtTime } from "../../core/time";
import type { ScenePhase } from "../../core/types";

export type GeneExpressionPhaseId =
  | "gene"
  | "transcription"
  | "processing"
  | "export"
  | "translation"
  | "folding";

export const GENE_EXPRESSION_DURATION_MS = 8600;

export const GENE_EXPRESSION_PHASES = [
  { id: "gene", label: "GENE", startMs: 0, snapshotMs: 400 },
  { id: "transcription", label: "TRANSCRIBE", startMs: 1200, snapshotMs: 1750 },
  { id: "processing", label: "RNA PROCESSING", startMs: 2600, snapshotMs: 3150 },
  { id: "export", label: "EXPORT", startMs: 3900, snapshotMs: 4450 },
  { id: "translation", label: "TRANSLATE", startMs: 5400, snapshotMs: 6050 },
  { id: "folding", label: "FOLD", startMs: 7200, snapshotMs: 7850 },
] as const satisfies readonly ScenePhase<GeneExpressionPhaseId>[];

export interface GeneExpressionSceneState {
  phaseId: GeneExpressionPhaseId;
  process: string;
  location: string;
  detail: string;
  geneOpen: boolean;
  transcriptReady: boolean;
  rnaProcessed: boolean;
  rnaExported: boolean;
  translationActive: boolean;
  proteinFolded: boolean;
}

const PHASE_COPY: Record<GeneExpressionPhaseId, Pick<GeneExpressionSceneState, "process" | "location" | "detail">> = {
  gene: {
    process: "GENE ACTIVATION",
    location: "NUCLEUS / DNA",
    detail: "Regulatory machinery exposes a gene while the DNA sequence stays in the nucleus.",
  },
  transcription: {
    process: "DNA → PRE-MRNA",
    location: "NUCLEUS",
    detail: "RNA polymerase reads one DNA template strand and builds a complementary transcript.",
  },
  processing: {
    process: "PRE-MRNA → MRNA",
    location: "NUCLEUS",
    detail: "The transcript is capped, spliced, and prepared for export as mature messenger RNA.",
  },
  export: {
    process: "NUCLEAR EXPORT",
    location: "NUCLEAR PORE",
    detail: "Mature mRNA passes through a nuclear pore into the cytoplasm.",
  },
  translation: {
    process: "MRNA → POLYPEPTIDE",
    location: "RIBOSOME",
    detail: "A ribosome reads codons while transfer RNAs add amino acids to a growing chain.",
  },
  folding: {
    process: "CHAIN → PROTEIN",
    location: "CYTOPLASM",
    detail: "The amino-acid chain folds into a three-dimensional functional form.",
  },
};

export function deriveGeneExpressionState(elapsedMs: number): GeneExpressionSceneState {
  const phase = phaseAtTime(GENE_EXPRESSION_PHASES, elapsedMs);
  return {
    phaseId: phase.id,
    ...PHASE_COPY[phase.id],
    geneOpen: elapsedMs >= 400,
    transcriptReady: elapsedMs >= 2350,
    rnaProcessed: elapsedMs >= 3500,
    rnaExported: elapsedMs >= 5050,
    translationActive: phase.id === "translation",
    proteinFolded: elapsedMs >= 7800,
  };
}
