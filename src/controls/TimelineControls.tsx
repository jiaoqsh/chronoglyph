import { Pause, Play, RotateCcw, StepBack, StepForward } from "lucide-react";
import type { KeyboardEvent } from "react";
import type { ScenePhase } from "../core/types";

export interface TimelineControlsProps<Id extends string> {
  phases: readonly ScenePhase<Id>[];
  activeIndex: number;
  elapsedMs: number;
  durationMs: number;
  isPlaying: boolean;
  panelId: string;
  onBack: () => void;
  onNext: () => void;
  onRestart: () => void;
  onSelectPhase: (phase: ScenePhase<Id>) => void;
  onToggle: () => void;
}

export function TimelineControls<Id extends string>({
  phases,
  activeIndex,
  elapsedMs,
  durationMs,
  isPlaying,
  panelId,
  onBack,
  onNext,
  onRestart,
  onSelectPhase,
  onToggle,
}: TimelineControlsProps<Id>) {
  const boundedProgress = Math.min(1, Math.max(0, elapsedMs / durationMs));

  const moveTabFocus = (
    event: KeyboardEvent<HTMLButtonElement>,
    index: number,
  ): void => {
    let targetIndex: number | null = null;
    if (event.key === "ArrowLeft") targetIndex = Math.max(0, index - 1);
    if (event.key === "ArrowRight") targetIndex = Math.min(phases.length - 1, index + 1);
    if (event.key === "Home") targetIndex = 0;
    if (event.key === "End") targetIndex = phases.length - 1;
    if (targetIndex === null || targetIndex === index) return;

    event.preventDefault();
    const targetPhase = phases[targetIndex];
    const targetTab = event.currentTarget.parentElement?.querySelectorAll<HTMLButtonElement>(
      '[role="tab"]',
    )[targetIndex];
    if (targetPhase && targetTab) {
      onSelectPhase(targetPhase);
      targetTab.focus();
    }
  };

  return (
    <div className="cg-controls" aria-label="Scene timeline controls">
      <div className="cg-controls__phases" role="tablist" aria-label="Scene phases">
        <span
          className="cg-controls__progress"
          aria-hidden="true"
          style={{ transform: `scaleX(${boundedProgress})` }}
        />
        {phases.map((phase, index) => (
          <button
            type="button"
            role="tab"
            aria-selected={activeIndex === index}
            aria-controls={panelId}
            tabIndex={activeIndex === index ? 0 : -1}
            className="cg-controls__phase"
            key={phase.id}
            onClick={() => onSelectPhase(phase)}
            onKeyDown={(event) => moveTabFocus(event, index)}
          >
            <span className="cg-controls__phase-number">{String(index + 1).padStart(2, "0")}</span>
            <span>{phase.label}</span>
          </button>
        ))}
      </div>

      <div className="cg-controls__transport">
        <button type="button" className="cg-icon-button" onClick={onRestart} title="Restart">
          <RotateCcw size={16} aria-hidden="true" />
          <span className="cg-sr-only">Restart scene</span>
        </button>
        <button
          type="button"
          className="cg-transport-button"
          onClick={onBack}
          disabled={activeIndex === 0}
        >
          <StepBack size={17} aria-hidden="true" />
          <span>Back</span>
        </button>
        <button
          type="button"
          className="cg-transport-button cg-transport-button--primary"
          onClick={onToggle}
        >
          {isPlaying ? <Pause size={17} aria-hidden="true" /> : <Play size={17} aria-hidden="true" />}
          <span>{isPlaying ? "Pause" : "Play"}</span>
        </button>
        <button
          type="button"
          className="cg-transport-button"
          onClick={onNext}
          disabled={activeIndex === phases.length - 1}
        >
          <span>Next</span>
          <StepForward size={17} aria-hidden="true" />
        </button>
        <output className="cg-controls__time" aria-live="off">
          {(elapsedMs / 1000).toFixed(1)}s / {(durationMs / 1000).toFixed(1)}s
        </output>
      </div>
    </div>
  );
}
