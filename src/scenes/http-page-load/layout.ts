import { box } from "../../core/geometry";
import type { Box } from "../../core/types";

export interface PageLoadLayout {
  width: number;
  height: number;
  browser: Box;
  dns: Box;
  edge: Box;
  app: Box;
  database: Box;
}

export const PAGE_LOAD_LAYOUT_WIDE: PageLoadLayout = {
  width: 980,
  height: 540,
  browser: box(35, 135, 195, 250),
  dns: box(330, 55, 205, 105),
  edge: box(330, 230, 205, 150),
  app: box(680, 135, 245, 220),
  database: box(680, 405, 245, 95),
};

export const PAGE_LOAD_LAYOUT_COMPACT: PageLoadLayout = {
  width: 520,
  height: 760,
  browser: box(20, 40, 480, 190),
  dns: box(20, 275, 210, 105),
  edge: box(270, 275, 230, 105),
  app: box(20, 430, 480, 145),
  database: box(145, 625, 230, 95),
};
