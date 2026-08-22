import { curvePath } from "../../core/geometry";
import type { SceneRenderContext } from "../../core/types";
import { DataStream } from "../../primitives/DataStream";
import { Stage } from "../../primitives/Stage";
import type { WaterCycleLayout } from "./layout";
import { deriveWaterCycleState, type WaterCyclePhaseId } from "./model";

export interface WaterCycleStageProps {
  context: SceneRenderContext<WaterCyclePhaseId>;
  layout: WaterCycleLayout;
  compact?: boolean;
}

function Cloud({ x, y, active }: { x: number; y: number; active: boolean }) {
  return (
    <g className={`cg-water-cloud${active ? " is-active" : ""}`} transform={`translate(${x} ${y})`}>
      <ellipse cx="0" cy="12" rx="78" ry="30" />
      <circle cx="-42" cy="0" r="34" />
      <circle cx="8" cy="-18" r="47" />
      <circle cx="52" cy="3" r="34" />
      <text x="0" y="62" textAnchor="middle">CLOUD RESERVOIR</text>
    </g>
  );
}

function ProcessLabel({ x, y, label, active }: { x: number; y: number; label: string; active: boolean }) {
  return (
    <g className={`cg-science-label${active ? " is-active" : ""}`} transform={`translate(${x} ${y})`}>
      <rect x="-52" y="-13" width="104" height="26" rx="13" />
      <text textAnchor="middle" y="4">{label}</text>
    </g>
  );
}

export function WaterCycleStage({ context, layout, compact = false }: WaterCycleStageProps) {
  const state = deriveWaterCycleState(context.elapsedMs);
  const evaporationCurvature = compact ? -0.2 : -0.24;
  const rainCurvature = compact ? 0.04 : 0.08;
  const runoffCurvature = compact ? 0.16 : 0.11;
  const cloudActive = state.phaseId === "condensation" || state.phaseId === "precipitation";

  return (
    <Stage width={layout.width} height={layout.height} label="Water cycle from ocean to atmosphere and back">
      <rect className="cg-science-sky" width={layout.width} height={layout.height} />
      <g className="cg-science-contours" aria-hidden="true">
        {Array.from({ length: 5 }, (_, index) => (
          <path
            key={index}
            d={`M 0 ${84 + index * 58} Q ${layout.width * 0.28} ${45 + index * 66} ${layout.width * 0.56} ${95 + index * 55} T ${layout.width} ${78 + index * 61}`}
          />
        ))}
      </g>

      <g className={`cg-water-sun${state.phaseId === "sunlight" ? " is-active" : ""}`} transform={`translate(${layout.sun.x} ${layout.sun.y})`}>
        {Array.from({ length: 12 }, (_, index) => {
          const angle = (index / 12) * Math.PI * 2;
          return (
            <line
              key={index}
              x1={Math.cos(angle) * 38}
              y1={Math.sin(angle) * 38}
              x2={Math.cos(angle) * 58}
              y2={Math.sin(angle) * 58}
            />
          );
        })}
        <circle r="27" />
        <text x="0" y="82" textAnchor="middle">SOLAR ENERGY</text>
      </g>

      <Cloud x={layout.cloud.x} y={layout.cloud.y} active={cloudActive} />

      <g className="cg-water-mountain">
        <path d={`M ${layout.mountainLeft.x} ${layout.mountainLeft.y} L ${layout.mountainPeak.x} ${layout.mountainPeak.y} L ${layout.mountainRight.x} ${layout.mountainRight.y} Z`} />
        <path
          className="cg-water-mountain__snow"
          d={`M ${layout.mountainPeak.x - 54} ${layout.mountainPeak.y + 58} L ${layout.mountainPeak.x} ${layout.mountainPeak.y} L ${layout.mountainPeak.x + 68} ${layout.mountainPeak.y + 70} L ${layout.mountainPeak.x + 24} ${layout.mountainPeak.y + 53} L ${layout.mountainPeak.x - 6} ${layout.mountainPeak.y + 75} Z`}
        />
        <text x={layout.mountainPeak.x + 84} y={layout.mountainPeak.y + 122}>LAND</text>
      </g>

      <path
        className={`cg-science-flow cg-science-flow--vapor${state.phaseId === "evaporation" ? " is-active" : ""}`}
        d={curvePath(layout.evaporationFrom, layout.condensationTo, evaporationCurvature)}
      />
      <path
        className={`cg-science-flow cg-science-flow--rain${state.phaseId === "precipitation" ? " is-active" : ""}`}
        d={curvePath(layout.precipitationFrom, layout.precipitationTo, rainCurvature)}
      />
      <path
        className={`cg-science-flow cg-science-flow--runoff${state.returning ? " is-active" : ""}`}
        d={curvePath(layout.runoffFrom, layout.runoffTo, runoffCurvature)}
      />

      <g className="cg-water-ocean">
        <path d={`M 0 ${layout.oceanY} Q ${layout.width * 0.12} ${layout.oceanY - 23} ${layout.width * 0.25} ${layout.oceanY} T ${layout.width * 0.5} ${layout.oceanY} T ${layout.width * 0.75} ${layout.oceanY} T ${layout.width} ${layout.oceanY} V ${layout.height} H 0 Z`} />
        <path className="cg-water-ocean__line" d={`M 0 ${layout.oceanY + 30} Q ${layout.width * 0.12} ${layout.oceanY + 9} ${layout.width * 0.25} ${layout.oceanY + 30} T ${layout.width * 0.5} ${layout.oceanY + 30}`} />
        <text x="24" y={layout.oceanY + 58}>OCEAN / COLLECTION</text>
      </g>

      <DataStream
        from={layout.evaporationFrom}
        to={layout.condensationTo}
        curvature={evaporationCurvature}
        progress={context.progress(1120, 2400)}
        active={state.phaseId === "evaporation"}
        tone="read"
        count={7}
      />
      <DataStream
        from={layout.precipitationFrom}
        to={layout.precipitationTo}
        curvature={rainCurvature}
        progress={context.progress(3670, 4850)}
        active={state.raining}
        tone="read"
        count={9}
      />
      <DataStream
        from={layout.runoffFrom}
        to={layout.runoffTo}
        curvature={runoffCurvature}
        progress={context.progress(4920, 6320)}
        active={state.returning}
        tone="data"
        count={8}
      />

      <ProcessLabel
        x={compact ? 150 : 340}
        y={compact ? 405 : 235}
        label="EVAPORATION"
        active={state.phaseId === "evaporation"}
      />
      <ProcessLabel
        x={compact ? 425 : 655}
        y={compact ? 275 : 120}
        label="CONDENSATION"
        active={state.phaseId === "condensation"}
      />
      <ProcessLabel
        x={compact ? 275 : 585}
        y={compact ? 520 : 345}
        label={state.phaseId === "collection" ? "COLLECTION" : "RUNOFF"}
        active={state.returning}
      />

      <g className="cg-science-stage-status" transform={`translate(20 ${compact ? 30 : 28})`}>
        <text>{state.process}</text>
        <text x={layout.width - 40} textAnchor="end">ACTIVE RESERVOIR / {state.reservoir}</text>
      </g>
    </Stage>
  );
}
