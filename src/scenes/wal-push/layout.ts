import { box } from "../../core/geometry";
import type { Box } from "../../core/types";

export interface WalLayout {
  width: number;
  height: number;
  client: Box;
  frontend: Box;
  repo: Box;
  store: Box;
}

export const WAL_LAYOUT_WIDE: WalLayout = {
  width: 980,
  height: 520,
  client: box(38, 92, 156, 92),
  frontend: box(270, 72, 250, 265),
  repo: box(270, 382, 250, 86),
  store: box(730, 54, 220, 320),
};

export const WAL_LAYOUT_COMPACT: WalLayout = {
  width: 520,
  height: 720,
  client: box(22, 40, 180, 82),
  frontend: box(22, 165, 476, 240),
  repo: box(22, 448, 220, 92),
  store: box(254, 448, 244, 250),
};
