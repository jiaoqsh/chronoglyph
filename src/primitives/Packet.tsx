import { AnimatePresence, motion } from "motion/react";
import { pointAlong } from "../core/geometry";
import type { Point, SceneTone } from "../core/types";

export interface PacketProps {
  from: Point;
  to: Point;
  progress: number;
  label: string;
  visible?: boolean;
  curvature?: number;
  tone?: SceneTone;
  width?: number;
}

export function Packet({
  from,
  to,
  progress,
  label,
  visible = true,
  curvature = 0,
  tone = "accent",
  width = 68,
}: PacketProps) {
  const position = pointAlong(from, to, progress, curvature);

  return (
    <AnimatePresence>
      {visible ? (
        <g transform={`translate(${position.x - width / 2} ${position.y - 14})`}>
          <motion.g
            className={`cg-packet cg-tone-${tone}`}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.82 }}
          >
            <rect className="cg-packet__surface" width={width} height="28" rx="5" />
            <text className="cg-packet__label" x={width / 2} y="18" textAnchor="middle">
              {label}
            </text>
          </motion.g>
        </g>
      ) : null}
    </AnimatePresence>
  );
}
