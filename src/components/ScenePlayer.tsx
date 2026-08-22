import type { ReactNode } from "react";
import { useId, useMemo, useRef } from "react";
import { cx } from "../core/classNames";
import {
  assertSceneTimeline,
  phaseAtTime,
  phaseIndexAtTime,
  windowProgress,
} from "../core/time";
import type { ScenePhase, SceneRenderContext } from "../core/types";
import { useSceneClock } from "../core/useSceneClock";
import { TimelineControls } from "../controls/TimelineControls";

export interface ScenePlayerProps<Id extends string> {
  phases: readonly ScenePhase<Id>[];
  durationMs: number;
  children: (context: SceneRenderContext<Id>) => ReactNode;
  autoplay?: boolean;
  loop?: boolean;
  fps?: number;
  className?: string;
}

export function ScenePlayer<Id extends string>({
  phases,
  durationMs,
  children,
  autoplay = true,
  loop = true,
  fps = 24,
  className,
}: ScenePlayerProps<Id>) {
  assertSceneTimeline(phases, durationMs);
  if (!Number.isFinite(fps) || fps <= 0) {
    throw new Error("Chronoglyph fps must be a finite number greater than zero.");
  }

  const rootRef = useRef<HTMLDivElement>(null);
  const scenePanelId = `cg-scene-${useId().replace(/:/g, "")}`;
  const clock = useSceneClock({ durationMs, autoplay, loop, fps, targetRef: rootRef });
  const activeIndex = phaseIndexAtTime(phases, clock.elapsedMs);
  const activePhase = phaseAtTime(phases, clock.elapsedMs);
  const context = useMemo<SceneRenderContext<Id>>(
    () => ({
      elapsedMs: clock.elapsedMs,
      phase: activePhase,
      phaseIndex: activeIndex,
      isPlaying: clock.isPlaying,
      progress: (startMs, endMs) => windowProgress(clock.elapsedMs, startMs, endMs),
    }),
    [activeIndex, activePhase, clock.elapsedMs, clock.isPlaying],
  );

  const seekToIndex = (index: number): void => {
    const boundedIndex = Math.min(phases.length - 1, Math.max(0, index));
    const target = phases[boundedIndex];
    if (target) {
      clock.pause();
      clock.seek(target.snapshotMs);
    }
  };

  return (
    <div
      ref={rootRef}
      className={cx("cg-player", className)}
      data-elapsed-ms={Math.round(clock.elapsedMs)}
      data-phase={activePhase.id}
    >
      <div
        id={scenePanelId}
        className="cg-player__scene"
        role="tabpanel"
        aria-label={`${activePhase.label} scene`}
      >
        {children(context)}
      </div>
      <TimelineControls
        phases={phases}
        activeIndex={activeIndex}
        elapsedMs={clock.elapsedMs}
        durationMs={durationMs}
        isPlaying={clock.isPlaying}
        panelId={scenePanelId}
        onBack={() => seekToIndex(activeIndex - 1)}
        onNext={() => seekToIndex(activeIndex + 1)}
        onRestart={() => {
          clock.pause();
          clock.restart();
        }}
        onSelectPhase={(phase) => {
          clock.pause();
          clock.seek(phase.snapshotMs);
        }}
        onToggle={clock.toggle}
      />
    </div>
  );
}
