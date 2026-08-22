import { curvePath } from "../../core/geometry";
import type { SceneRenderContext } from "../../core/types";
import { Packet } from "../../primitives/Packet";
import { Stage } from "../../primitives/Stage";
import type { GeneExpressionLayout } from "./layout";
import { deriveGeneExpressionState, type GeneExpressionPhaseId } from "./model";

export interface GeneExpressionStageProps {
  context: SceneRenderContext<GeneExpressionPhaseId>;
  layout: GeneExpressionLayout;
}

function DnaHelix({ x, y, length, active }: { x: number; y: number; length: number; active: boolean }) {
  const segments = 13;
  const points = Array.from({ length: segments }, (_, index) => {
    const offset = (index / (segments - 1)) * length;
    const wave = Math.sin(index * Math.PI * 0.72) * 27;
    return {
      y: y + offset,
      left: x + wave,
      right: x - wave,
    };
  });
  const leftPath = points.map((point, index) => `${index === 0 ? "M" : "L"} ${point.left} ${point.y}`).join(" ");
  const rightPath = points.map((point, index) => `${index === 0 ? "M" : "L"} ${point.right} ${point.y}`).join(" ");

  return (
    <g className={`cg-dna-helix${active ? " is-active" : ""}`}>
      <path d={leftPath} />
      <path d={rightPath} />
      {points.map((point, index) => (
        <line key={index} x1={point.left} y1={point.y} x2={point.right} y2={point.y} />
      ))}
      <rect className="cg-dna-helix__gene" x={x - 39} y={y + length * 0.32} width="78" height={length * 0.24} rx="12" />
      <text x={x} y={y + length + 28} textAnchor="middle">DNA / GENE</text>
    </g>
  );
}

function Ribosome({ x, y, active }: { x: number; y: number; active: boolean }) {
  return (
    <g className={`cg-ribosome${active ? " is-active" : ""}`} transform={`translate(${x} ${y})`}>
      <ellipse className="cg-ribosome__large" cx="0" cy="-10" rx="68" ry="38" />
      <ellipse className="cg-ribosome__small" cx="0" cy="24" rx="48" ry="25" />
      <line x1="-86" y1="8" x2="86" y2="8" />
      <text x="0" y="75" textAnchor="middle">RIBOSOME</text>
    </g>
  );
}

function ProteinChain({
  x,
  y,
  progress,
  folded,
  visible,
}: {
  x: number;
  y: number;
  progress: number;
  folded: boolean;
  visible: boolean;
}) {
  const chainPoints = [
    { x: x - 90, y: y + 80 },
    { x: x - 66, y: y + 43 },
    { x: x - 40, y: y + 65 },
    { x: x - 17, y: y + 25 },
    { x: x + 12, y: y + 51 },
    { x: x + 35, y: y + 12 },
    { x: x + 62, y: y + 37 },
    { x: x + 82, y: y },
  ];
  const visibleCount = folded ? chainPoints.length : Math.max(1, Math.ceil(chainPoints.length * progress));
  const visiblePoints = chainPoints.slice(0, visibleCount);

  return visible ? (
    <g className={`cg-protein-chain${folded ? " is-folded" : ""}`}>
      {visiblePoints.length > 1 ? (
        <polyline points={visiblePoints.map((point) => `${point.x},${point.y}`).join(" ")} />
      ) : null}
      {visiblePoints.map((point, index) => (
        <circle key={index} cx={point.x} cy={point.y} r={folded ? 8 : 6} />
      ))}
      <text x={x} y={y + 118} textAnchor="middle">{folded ? "FOLDED PROTEIN" : "POLYPEPTIDE"}</text>
    </g>
  ) : null;
}

function ProcessLabel({ x, y, label, active }: { x: number; y: number; label: string; active: boolean }) {
  return (
    <g className={`cg-science-label${active ? " is-active" : ""}`} transform={`translate(${x} ${y})`}>
      <rect x="-54" y="-13" width="108" height="26" rx="13" />
      <text textAnchor="middle" y="4">{label}</text>
    </g>
  );
}

export function GeneExpressionStage({ context, layout }: GeneExpressionStageProps) {
  const state = deriveGeneExpressionState(context.elapsedMs);
  const transcriptProgress = context.progress(1220, 2550);
  const translationProgress = context.progress(5420, 7160);
  const exportCurvature = layout.compact ? 0 : -0.14;
  const mrnaPath = curvePath(layout.transcriptStart, layout.pore, layout.compact ? 0.14 : -0.08);
  const exportFrom = layout.pore;
  const exportTo = layout.compact
    ? { x: layout.ribosome.x, y: layout.ribosome.y - 55 }
    : { x: layout.ribosome.x - 75, y: layout.ribosome.y };

  return (
    <Stage width={layout.width} height={layout.height} label="DNA transcription and translation into a protein">
      <rect className="cg-gene-cell" width={layout.width} height={layout.height} />
      <g className="cg-science-contours" aria-hidden="true">
        {Array.from({ length: 5 }, (_, index) => (
          <ellipse
            key={index}
            cx={layout.width * 0.72}
            cy={layout.height * 0.48}
            rx={80 + index * 52}
            ry={55 + index * 38}
          />
        ))}
      </g>

      <ellipse
        className={`cg-gene-nucleus${["gene", "transcription", "processing"].includes(state.phaseId) ? " is-active" : ""}`}
        cx={layout.nucleus.cx}
        cy={layout.nucleus.cy}
        rx={layout.nucleus.rx}
        ry={layout.nucleus.ry}
      />
      <text className="cg-gene-compartment-label" x={layout.nucleus.cx - layout.nucleus.rx + 24} y={layout.nucleus.cy - layout.nucleus.ry + 31}>NUCLEUS</text>
      <text className="cg-gene-compartment-label" x={layout.width - 24} y={layout.compact ? 485 : 64} textAnchor="end">CYTOPLASM</text>

      <DnaHelix
        x={layout.dna.x}
        y={layout.dna.y}
        length={layout.dna.length}
        active={state.phaseId === "gene" || state.phaseId === "transcription"}
      />

      <path
        className={`cg-mrna-transcript${state.rnaProcessed ? " is-processed" : ""}`}
        d={mrnaPath}
        pathLength="1"
        strokeDasharray="1"
        strokeDashoffset={Math.max(0, 1 - transcriptProgress)}
      />
      {state.phaseId === "processing" ? (
        <g className="cg-rna-processing" transform={`translate(${layout.pore.x - (layout.compact ? 58 : 118)} ${layout.pore.y - 62})`}>
          <circle cx="0" cy="0" r="7" />
          <circle cx="30" cy="-8" r="7" />
          <circle cx="60" cy="4" r="7" />
          <text x="30" y="28" textAnchor="middle">CAP / SPLICE / TAIL</text>
        </g>
      ) : null}

      <g className={`cg-nuclear-pore${state.phaseId === "export" ? " is-active" : ""}`} transform={`translate(${layout.pore.x} ${layout.pore.y})`}>
        <circle r="18" />
        <circle r="7" />
        <text x={layout.compact ? 34 : 0} y={layout.compact ? 4 : 39} textAnchor={layout.compact ? "start" : "middle"}>NUCLEAR PORE</text>
      </g>

      <path className="cg-mrna-guide" d={curvePath(exportFrom, exportTo, exportCurvature)} />
      <Packet
        from={exportFrom}
        to={exportTo}
        progress={context.progress(3920, 5150)}
        curvature={exportCurvature}
        label="mRNA"
        visible={state.phaseId === "export"}
        tone="read"
        width={62}
      />

      <Ribosome x={layout.ribosome.x} y={layout.ribosome.y} active={state.translationActive} />
      <ProteinChain
        x={layout.protein.x}
        y={layout.protein.y}
        progress={translationProgress}
        folded={state.proteinFolded}
        visible={state.translationActive || state.phaseId === "folding"}
      />

      <ProcessLabel
        x={layout.compact ? 370 : 330}
        y={layout.compact ? 88 : 112}
        label={state.phaseId === "processing" ? "RNA PROCESSING" : "TRANSCRIPTION"}
        active={state.phaseId === "transcription" || state.phaseId === "processing"}
      />
      <ProcessLabel
        x={layout.compact ? 122 : 690}
        y={layout.compact ? 505 : 185}
        label="TRANSLATION"
        active={state.phaseId === "translation"}
      />

      <g className="cg-science-stage-status" transform="translate(20 28)">
        <text>{state.process}</text>
        <text x={layout.width - 40} textAnchor="end">LOCATION / {state.location}</text>
      </g>
    </Stage>
  );
}
