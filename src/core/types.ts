import type { ReactNode } from "react";

export interface Point {
  x: number;
  y: number;
}

export interface Box extends Point {
  width: number;
  height: number;
}

export type Anchor =
  | "left"
  | "right"
  | "top"
  | "bottom"
  | "center"
  | "topLeft"
  | "topRight"
  | "bottomLeft"
  | "bottomRight";

export type SceneTone =
  | "neutral"
  | "accent"
  | "upload"
  | "prepare"
  | "data"
  | "read"
  | "lock"
  | "write"
  | "commit"
  | "error";

export interface ScenePhase<Id extends string = string> {
  id: Id;
  label: string;
  startMs: number;
  snapshotMs: number;
}

export interface SceneRenderContext<Id extends string = string> {
  elapsedMs: number;
  phase: ScenePhase<Id>;
  phaseIndex: number;
  isPlaying: boolean;
  progress: (startMs: number, endMs: number) => number;
}

export type SceneRenderer<Id extends string = string> = (
  context: SceneRenderContext<Id>,
) => ReactNode;
