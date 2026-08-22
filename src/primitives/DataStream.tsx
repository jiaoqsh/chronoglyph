import { motion } from "motion/react";
import { pointAlong } from "../core/geometry";
import type { Point, SceneTone } from "../core/types";

export interface DataStreamProps {
  from: Point;
  to: Point;
  progress: number;
  active?: boolean;
  curvature?: number;
  tone?: SceneTone;
  count?: number;
}

export function DataStream({
  from,
  to,
  progress,
  active = true,
  curvature = 0,
  tone = "data",
  count = 4,
}: DataStreamProps) {
  if (!active) {
    return null;
  }

  return (
    <g className={`cg-stream cg-tone-${tone}`}>
      {Array.from({ length: count }, (_, index) => {
        const offset = index / count;
        const itemProgress = (progress + offset) % 1;
        const position = pointAlong(from, to, itemProgress, curvature);
        return (
          <motion.circle
            key={index}
            className="cg-stream__dot"
            cx={position.x}
            cy={position.y}
            r={index === 0 ? 3.5 : 2.5}
            initial={false}
            animate={{ opacity: 0.25 + itemProgress * 0.75 }}
          />
        );
      })}
    </g>
  );
}
