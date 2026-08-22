import { describe, expect, it } from "vitest";
import { anchor, box, curvePath, pointAlong } from "./geometry";

describe("scene geometry", () => {
  it("resolves stable box anchors", () => {
    const target = box(10, 20, 100, 60);
    expect(anchor(target, "right")).toEqual({ x: 110, y: 50 });
    expect(anchor(target, "bottom")).toEqual({ x: 60, y: 80 });
  });

  it("interpolates points along straight and curved paths", () => {
    expect(pointAlong({ x: 0, y: 0 }, { x: 100, y: 40 }, 0.5)).toEqual({ x: 50, y: 20 });
    const curved = pointAlong({ x: 0, y: 0 }, { x: 100, y: 0 }, 0.5, 0.2);
    expect(curved.x).toBeCloseTo(50);
    expect(curved.y).toBeCloseTo(10);
    expect(curvePath({ x: 0, y: 0 }, { x: 100, y: 0 }, 0.2)).toContain(" Q ");
  });
});
