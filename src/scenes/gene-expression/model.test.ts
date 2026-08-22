import { describe, expect, it } from "vitest";
import { deriveGeneExpressionState, GENE_EXPRESSION_PHASES } from "./model";

describe("DNA-to-protein scene model", () => {
  it("keeps the central-dogma teaching sequence in causal order", () => {
    expect(GENE_EXPRESSION_PHASES.map((phase) => phase.id)).toEqual([
      "gene",
      "transcription",
      "processing",
      "export",
      "translation",
      "folding",
    ]);
  });

  it("processes RNA before export and translation", () => {
    const processing = deriveGeneExpressionState(3150);
    expect(processing.phaseId).toBe("processing");
    expect(processing.rnaExported).toBe(false);

    const exported = deriveGeneExpressionState(5100);
    expect(exported.rnaProcessed).toBe(true);
    expect(exported.rnaExported).toBe(true);
  });

  it("finishes with a folded protein", () => {
    const folded = deriveGeneExpressionState(7900);
    expect(folded.phaseId).toBe("folding");
    expect(folded.proteinFolded).toBe(true);
    expect(folded.location).toBe("CYTOPLASM");
  });
});
