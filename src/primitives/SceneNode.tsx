import type { PropsWithChildren } from "react";
import { motion } from "motion/react";
import { cx } from "../core/classNames";
import type { Box, SceneTone } from "../core/types";

export interface SceneNodeProps extends PropsWithChildren {
  box: Box;
  title: string;
  subtitle?: string;
  eyebrow?: string;
  tone?: SceneTone;
  active?: boolean;
  className?: string;
}

export function SceneNode({
  box,
  title,
  subtitle,
  eyebrow,
  tone = "neutral",
  active = false,
  className,
  children,
}: SceneNodeProps) {
  return (
    <motion.g
      className={cx("cg-node", `cg-tone-${tone}`, active && "is-active", className)}
      initial={false}
      animate={{ opacity: active ? 1 : 0.88 }}
      transition={{ duration: 0.22 }}
      transform={`translate(${box.x} ${box.y})`}
    >
      <rect className="cg-node__surface" width={box.width} height={box.height} rx="9" />
      {active ? (
        <rect className="cg-node__signal" width="3" height={box.height - 16} x="0" y="8" rx="2" />
      ) : null}
      <circle className="cg-node__dot" cx="18" cy="23" r="5" />
      {eyebrow ? (
        <text className="cg-node__eyebrow" x="32" y="17">
          {eyebrow}
        </text>
      ) : null}
      <text className="cg-node__title" x="32" y={eyebrow ? 34 : 28}>
        {title}
      </text>
      {subtitle ? (
        <text className="cg-node__subtitle" x="32" y={eyebrow ? 50 : 46}>
          {subtitle}
        </text>
      ) : null}
      {children}
    </motion.g>
  );
}
