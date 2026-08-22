import type { Anchor, Box, Point } from "./types";
import { clamp } from "./time";

export function box(x: number, y: number, width: number, height: number): Box {
  return { x, y, width, height };
}

export function anchor(target: Box, edge: Anchor): Point {
  const centerX = target.x + target.width / 2;
  const centerY = target.y + target.height / 2;

  switch (edge) {
    case "left":
      return { x: target.x, y: centerY };
    case "right":
      return { x: target.x + target.width, y: centerY };
    case "top":
      return { x: centerX, y: target.y };
    case "bottom":
      return { x: centerX, y: target.y + target.height };
    case "center":
      return { x: centerX, y: centerY };
    case "topLeft":
      return { x: target.x, y: target.y };
    case "topRight":
      return { x: target.x + target.width, y: target.y };
    case "bottomLeft":
      return { x: target.x, y: target.y + target.height };
    case "bottomRight":
      return { x: target.x + target.width, y: target.y + target.height };
  }
}

export function lerp(start: number, end: number, progress: number): number {
  return start + (end - start) * progress;
}

export function distance(from: Point, to: Point): number {
  return Math.hypot(to.x - from.x, to.y - from.y);
}

export function curveControlPoint(from: Point, to: Point, curvature: number): Point {
  const midpoint = { x: (from.x + to.x) / 2, y: (from.y + to.y) / 2 };
  if (curvature === 0) {
    return midpoint;
  }

  const deltaX = to.x - from.x;
  const deltaY = to.y - from.y;
  const magnitude = Math.hypot(deltaX, deltaY) || 1;
  const offset = curvature * magnitude;

  return {
    x: midpoint.x + (-deltaY / magnitude) * offset,
    y: midpoint.y + (deltaX / magnitude) * offset,
  };
}

export function pointAlong(
  from: Point,
  to: Point,
  progress: number,
  curvature = 0,
): Point {
  const bounded = clamp(progress, 0, 1);
  if (curvature === 0) {
    return {
      x: lerp(from.x, to.x, bounded),
      y: lerp(from.y, to.y, bounded),
    };
  }

  const control = curveControlPoint(from, to, curvature);
  const remaining = 1 - bounded;

  return {
    x:
      remaining * remaining * from.x +
      2 * remaining * bounded * control.x +
      bounded * bounded * to.x,
    y:
      remaining * remaining * from.y +
      2 * remaining * bounded * control.y +
      bounded * bounded * to.y,
  };
}

export function curvePath(from: Point, to: Point, curvature = 0): string {
  if (curvature === 0) {
    return "M " + from.x + " " + from.y + " L " + to.x + " " + to.y;
  }

  const control = curveControlPoint(from, to, curvature);
  return (
    "M " +
    from.x +
    " " +
    from.y +
    " Q " +
    control.x +
    " " +
    control.y +
    " " +
    to.x +
    " " +
    to.y
  );
}

export function angleBetween(from: Point, to: Point): number {
  return (Math.atan2(to.y - from.y, to.x - from.x) * 180) / Math.PI;
}
