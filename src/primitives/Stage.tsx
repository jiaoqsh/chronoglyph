import type { CSSProperties, PropsWithChildren, SVGProps } from "react";
import { useId } from "react";
import { cx } from "../core/classNames";

export interface StageProps extends PropsWithChildren<Omit<SVGProps<SVGSVGElement>, "viewBox">> {
  width: number;
  height: number;
  label: string;
}

export function Stage({
  width,
  height,
  label,
  className,
  children,
  style,
  ...props
}: StageProps) {
  const glowFilterId = `cg-soft-glow-${useId().replace(/:/g, "")}`;
  const stageStyle: CSSProperties & { "--cg-soft-glow-filter": string } = {
    ...style,
    "--cg-soft-glow-filter": `url(#${glowFilterId})`,
  };

  return (
    <svg
      {...props}
      className={cx("cg-stage", className)}
      viewBox={`0 0 ${width} ${height}`}
      role="img"
      aria-label={label}
      preserveAspectRatio="xMidYMid meet"
      style={stageStyle}
    >
      <defs>
        <filter id={glowFilterId} x="-100%" y="-100%" width="300%" height="300%">
          <feGaussianBlur stdDeviation="4" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      {children}
    </svg>
  );
}
