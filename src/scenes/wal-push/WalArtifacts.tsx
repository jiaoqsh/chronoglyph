import { AnimatePresence, motion } from "motion/react";

interface WalLogProps {
  x: number;
  y: number;
  count: number;
  compact?: boolean;
}

const WAL_OBJECTS = [
  { sequence: "#39", hash: "1a73" },
  { sequence: "#40", hash: "b8ab" },
  { sequence: "#41", hash: "56e2" },
] as const;

export function WalLog({ x, y, count, compact = false }: WalLogProps) {
  const itemWidth = compact ? 53 : 58;
  return (
    <g className="cg-wal-log" transform={`translate(${x} ${y})`}>
      <text className="cg-artifact-kicker" x="0" y="0">
        WAL OBJECTS
      </text>
      <AnimatePresence>
        {WAL_OBJECTS.slice(0, count).map((item, index) => (
          <g key={item.sequence} transform={`translate(${index * (itemWidth + 8)} 14)`}>
            <motion.g
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
            >
              <rect className="cg-wal-object" width={itemWidth} height="52" rx="6" />
              <text className="cg-wal-object__sequence" x="9" y="19">
                {item.sequence}
              </text>
              <text className="cg-wal-object__hash" x="9" y="39">
                {item.hash}
              </text>
            </motion.g>
          </g>
        ))}
      </AnimatePresence>
    </g>
  );
}

interface WalIndexProps {
  x: number;
  y: number;
  width: number;
  count: number;
  etag?: string;
}

export function WalIndex({ x, y, width, count, etag }: WalIndexProps) {
  return (
    <g className="cg-wal-index" transform={`translate(${x} ${y})`}>
      <rect className="cg-wal-index__surface" width={width} height={30 + count * 30} rx="6" />
      <text className="cg-wal-index__title" x="12" y="20">
        gitwal.pb
      </text>
      {etag ? (
        <text className="cg-wal-index__etag" x={width - 12} y="20" textAnchor="end">
          etag {etag}
        </text>
      ) : null}
      {WAL_OBJECTS.slice(0, count).map((item, index) => (
        <g key={item.sequence} transform={`translate(0 ${30 + index * 30})`}>
          <rect className="cg-wal-index__row" width={width} height="30" />
          <text className="cg-wal-index__sequence" x="12" y="19">
            {item.sequence}
          </text>
          <line className="cg-wal-index__line" x1="50" y1="15" x2={width - 70} y2="15" />
          <path className="cg-wal-index__arrow" d={`M ${width - 76} 11 L ${width - 66} 15 L ${width - 76} 19 Z`} />
          <text className="cg-wal-index__hash" x={width - 12} y="19" textAnchor="end">
            {item.hash}.wal
          </text>
        </g>
      ))}
    </g>
  );
}
