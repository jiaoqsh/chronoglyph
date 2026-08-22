import type { SceneTone } from "../core/types";

export interface BadgeProps {
  x: number;
  y: number;
  label: string;
  tone?: SceneTone;
  width?: number;
}

export function Badge({ x, y, label, tone = "neutral", width = 66 }: BadgeProps) {
  return (
    <g className={`cg-badge cg-tone-${tone}`} transform={`translate(${x} ${y})`}>
      <rect className="cg-badge__surface" width={width} height="25" rx="5" />
      <text className="cg-badge__label" x={width / 2} y="16" textAnchor="middle">
        {label}
      </text>
    </g>
  );
}
