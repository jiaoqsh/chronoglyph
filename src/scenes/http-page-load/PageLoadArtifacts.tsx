import { motion } from "motion/react";
import type { Box } from "../../core/types";

interface BrowserViewportProps {
  box: Box;
  rendered: boolean;
  compact?: boolean;
}

export function BrowserViewport({ box, rendered, compact = false }: BrowserViewportProps) {
  const x = box.x + 18;
  const y = box.y + (compact ? 67 : 72);
  const width = box.width - 36;
  const height = box.height - (compact ? 84 : 90);

  return (
    <g className="cg-browser-viewport" transform={`translate(${x} ${y})`}>
      <rect className="cg-browser-viewport__surface" width={width} height={height} rx="5" />
      <rect className="cg-browser-viewport__bar" width={width} height="25" rx="5" />
      <circle cx="10" cy="12.5" r="2.5" />
      <circle cx="19" cy="12.5" r="2.5" />
      <circle cx="28" cy="12.5" r="2.5" />
      <rect className="cg-browser-viewport__address" x="38" y="6" width={width - 46} height="13" rx="3" />
      <text x="44" y="15">https://example.com</text>
      <motion.g initial={false} animate={{ opacity: rendered ? 1 : 0.32 }}>
        <rect className="cg-browser-viewport__hero" x="10" y="36" width={width - 20} height={compact ? 22 : 34} rx="3" />
        <rect className="cg-browser-viewport__line" x="10" y={compact ? 65 : 82} width={width * 0.62} height="5" rx="2" />
        <rect className="cg-browser-viewport__line" x="10" y={compact ? 76 : 94} width={width * 0.43} height="5" rx="2" />
        {compact ? null : (
          <>
            <rect className="cg-browser-viewport__card" x="10" y="112" width={(width - 30) / 2} height={height - 122} rx="3" />
            <rect
              className="cg-browser-viewport__card"
              x={20 + (width - 30) / 2}
              y="112"
              width={(width - 30) / 2}
              height={height - 122}
              rx="3"
            />
          </>
        )}
      </motion.g>
      {rendered ? (
        <g className="cg-browser-viewport__paint" transform={`translate(${width - 69} ${height - 23})`}>
          <rect width="60" height="16" rx="3" />
          <text x="30" y="11" textAnchor="middle">PAINTED</text>
        </g>
      ) : null}
    </g>
  );
}

interface ServiceRowsProps {
  box: Box;
  rows: readonly string[];
  tone: "read" | "data" | "commit" | "prepare";
  compact?: boolean;
}

export function ServiceRows({ box, rows, tone, compact = false }: ServiceRowsProps) {
  if (compact) {
    return null;
  }
  return (
    <g className={`cg-service-rows cg-tone-${tone}`} transform={`translate(${box.x + 22} ${box.y + 78})`}>
      {rows.map((row, index) => (
        <g key={row} transform={`translate(0 ${index * 27})`}>
          <circle cx="4" cy="4" r="2.5" />
          <text x="14" y="7">{row}</text>
        </g>
      ))}
    </g>
  );
}

interface DatabaseRowsProps {
  box: Box;
  complete: boolean;
}

export function DatabaseRows({ box, complete }: DatabaseRowsProps) {
  return (
    <g className="cg-database-rows" transform={`translate(${box.x + box.width - 76} ${box.y + 24})`}>
      {[0, 1, 2].map((index) => (
        <motion.rect
          key={index}
          x="0"
          y={index * 14}
          width={48 - index * 6}
          height="4"
          rx="2"
          initial={false}
          animate={{ opacity: complete ? 1 : 0.25 }}
        />
      ))}
    </g>
  );
}
