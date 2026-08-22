import { motion } from "motion/react";
import { cx } from "../core/classNames";
import { curvePath } from "../core/geometry";
import type { Point, SceneTone } from "../core/types";

export interface EdgeProps {
  from: Point;
  to: Point;
  curvature?: number;
  tone?: SceneTone;
  active?: boolean;
  dashed?: boolean;
  className?: string;
}

export function Edge({
  from,
  to,
  curvature = 0,
  tone = "neutral",
  active = false,
  dashed = true,
  className,
}: EdgeProps) {
  return (
    <motion.path
      className={cx(
        "cg-edge",
        `cg-tone-${tone}`,
        active && "is-active",
        dashed && "is-dashed",
        className,
      )}
      d={curvePath(from, to, curvature)}
      fill="none"
      initial={false}
      animate={{ opacity: active ? 0.94 : 0.32 }}
      transition={{ duration: 0.2 }}
    />
  );
}
