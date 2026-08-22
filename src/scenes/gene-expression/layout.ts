import type { Point } from "../../core/types";

export interface GeneExpressionLayout {
  width: number;
  height: number;
  nucleus: { cx: number; cy: number; rx: number; ry: number };
  dna: { x: number; y: number; length: number };
  transcriptStart: Point;
  pore: Point;
  ribosome: Point;
  protein: Point;
  compact: boolean;
}

export const GENE_EXPRESSION_LAYOUT_WIDE: GeneExpressionLayout = {
  width: 980,
  height: 520,
  nucleus: { cx: 285, cy: 270, rx: 225, ry: 190 },
  dna: { x: 185, y: 132, length: 265 },
  transcriptStart: { x: 220, y: 245 },
  pore: { x: 500, y: 272 },
  ribosome: { x: 690, y: 304 },
  protein: { x: 870, y: 205 },
  compact: false,
};

export const GENE_EXPRESSION_LAYOUT_COMPACT: GeneExpressionLayout = {
  width: 560,
  height: 800,
  nucleus: { cx: 280, cy: 250, rx: 225, ry: 190 },
  dna: { x: 180, y: 118, length: 250 },
  transcriptStart: { x: 220, y: 238 },
  pore: { x: 280, y: 438 },
  ribosome: { x: 280, y: 575 },
  protein: { x: 420, y: 700 },
  compact: true,
};
