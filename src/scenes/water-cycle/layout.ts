import type { Point } from "../../core/types";

export interface WaterCycleLayout {
  width: number;
  height: number;
  sun: Point;
  cloud: Point;
  oceanY: number;
  mountainPeak: Point;
  mountainLeft: Point;
  mountainRight: Point;
  evaporationFrom: Point;
  condensationTo: Point;
  precipitationFrom: Point;
  precipitationTo: Point;
  runoffFrom: Point;
  runoffTo: Point;
}

export const WATER_CYCLE_LAYOUT_WIDE: WaterCycleLayout = {
  width: 980,
  height: 520,
  sun: { x: 118, y: 95 },
  cloud: { x: 515, y: 140 },
  oceanY: 392,
  mountainPeak: { x: 765, y: 205 },
  mountainLeft: { x: 565, y: 418 },
  mountainRight: { x: 980, y: 418 },
  evaporationFrom: { x: 270, y: 410 },
  condensationTo: { x: 490, y: 160 },
  precipitationFrom: { x: 570, y: 178 },
  precipitationTo: { x: 730, y: 335 },
  runoffFrom: { x: 745, y: 342 },
  runoffTo: { x: 390, y: 440 },
};

export const WATER_CYCLE_LAYOUT_COMPACT: WaterCycleLayout = {
  width: 560,
  height: 760,
  sun: { x: 92, y: 98 },
  cloud: { x: 315, y: 175 },
  oceanY: 625,
  mountainPeak: { x: 385, y: 330 },
  mountainLeft: { x: 185, y: 580 },
  mountainRight: { x: 560, y: 580 },
  evaporationFrom: { x: 100, y: 650 },
  condensationTo: { x: 285, y: 200 },
  precipitationFrom: { x: 345, y: 220 },
  precipitationTo: { x: 385, y: 430 },
  runoffFrom: { x: 385, y: 440 },
  runoffTo: { x: 145, y: 650 },
};
