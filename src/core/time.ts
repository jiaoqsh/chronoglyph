import type { ScenePhase } from "./types";

export function assertSceneTimeline<Id extends string>(
  phases: readonly ScenePhase<Id>[],
  durationMs: number,
): void {
  if (!Number.isFinite(durationMs) || durationMs <= 0) {
    throw new Error("Chronoglyph durationMs must be a finite number greater than zero.");
  }
  if (phases.length === 0) {
    throw new Error("Chronoglyph requires at least one scene phase.");
  }

  const ids = new Set<string>();
  phases.forEach((phase, index) => {
    if (!phase.id.trim()) {
      throw new Error(`Chronoglyph phase at index ${index} requires a non-empty id.`);
    }
    if (ids.has(phase.id)) {
      throw new Error(`Chronoglyph phase id "${phase.id}" must be unique.`);
    }
    ids.add(phase.id);

    if (!Number.isFinite(phase.startMs) || !Number.isFinite(phase.snapshotMs)) {
      throw new Error(`Chronoglyph phase "${phase.id}" must use finite timeline values.`);
    }
    if (phase.startMs < 0 || phase.startMs >= durationMs) {
      throw new Error(`Chronoglyph phase "${phase.id}" must start within the scene duration.`);
    }
    if (index === 0 && phase.startMs !== 0) {
      throw new Error("Chronoglyph's first phase must start at 0ms.");
    }

    const previous = phases[index - 1];
    if (previous && phase.startMs <= previous.startMs) {
      throw new Error("Chronoglyph phases must have strictly increasing startMs values.");
    }

    const next = phases[index + 1];
    const phaseEndMs = next?.startMs ?? durationMs;
    if (phase.snapshotMs < phase.startMs || phase.snapshotMs > phaseEndMs) {
      throw new Error(
        `Chronoglyph phase "${phase.id}" snapshotMs must fall within its phase window.`,
      );
    }
  });
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

export function windowProgress(timeMs: number, startMs: number, endMs: number): number {
  if (endMs <= startMs) {
    return timeMs >= endMs ? 1 : 0;
  }

  return clamp((timeMs - startMs) / (endMs - startMs), 0, 1);
}

export function isWithinWindow(timeMs: number, startMs: number, endMs: number): boolean {
  return timeMs >= startMs && timeMs < endMs;
}

export function phaseIndexAtTime<Id extends string>(
  phases: readonly ScenePhase<Id>[],
  timeMs: number,
): number {
  if (phases.length === 0) {
    throw new Error("Chronoglyph requires at least one scene phase.");
  }

  let activeIndex = 0;

  for (let index = 1; index < phases.length; index += 1) {
    const phase = phases[index];
    if (phase && timeMs >= phase.startMs) {
      activeIndex = index;
    } else {
      break;
    }
  }

  return activeIndex;
}

export function phaseAtTime<Id extends string>(
  phases: readonly ScenePhase<Id>[],
  timeMs: number,
): ScenePhase<Id> {
  const phase = phases[phaseIndexAtTime(phases, timeMs)];
  if (!phase) {
    throw new Error("Chronoglyph could not resolve the active scene phase.");
  }

  return phase;
}

export function boundedPhaseIndex(index: number, phaseCount: number): number {
  return clamp(index, 0, Math.max(0, phaseCount - 1));
}
