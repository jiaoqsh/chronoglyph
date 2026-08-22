import { useCallback, useEffect, useRef, useState } from "react";
import type { RefObject } from "react";
import { clamp } from "./time";
import { useMediaQuery } from "./useMediaQuery";

export interface SceneClockOptions {
  durationMs: number;
  autoplay?: boolean;
  fps?: number;
  loop?: boolean;
  pauseWhenOffscreen?: boolean;
  targetRef?: RefObject<HTMLElement | null>;
}

export interface SceneClock {
  elapsedMs: number;
  isPlaying: boolean;
  pause: () => void;
  play: () => void;
  restart: () => void;
  seek: (timeMs: number) => void;
  toggle: () => void;
}

export function useSceneClock({
  durationMs,
  autoplay = true,
  fps = 24,
  loop = true,
  pauseWhenOffscreen = true,
  targetRef,
}: SceneClockOptions): SceneClock {
  const prefersReducedMotion = useMediaQuery("(prefers-reduced-motion: reduce)");
  const initialTime = prefersReducedMotion ? durationMs : 0;
  const elapsedRef = useRef(initialTime);
  const previousFrameRef = useRef<number | null>(null);
  const lastPaintRef = useRef(0);
  const [elapsedMs, setElapsedMs] = useState(initialTime);
  const [isVisible, setIsVisible] = useState(true);
  const [isPlaying, setIsPlaying] = useState(autoplay && !prefersReducedMotion);
  const effectiveElapsedMs = prefersReducedMotion ? durationMs : elapsedMs;
  const effectiveIsPlaying = isPlaying && !prefersReducedMotion;

  const commitTime = useCallback(
    (timeMs: number): void => {
      const bounded = clamp(timeMs, 0, durationMs);
      elapsedRef.current = bounded;
      setElapsedMs(bounded);
    },
    [durationMs],
  );

  const pause = useCallback((): void => setIsPlaying(false), []);
  const play = useCallback((): void => {
    if (!prefersReducedMotion) {
      setIsPlaying(true);
    }
  }, [prefersReducedMotion]);
  const seek = useCallback((timeMs: number): void => commitTime(timeMs), [commitTime]);
  const restart = useCallback((): void => commitTime(0), [commitTime]);
  const toggle = useCallback((): void => {
    if (!prefersReducedMotion) {
      setIsPlaying((current) => !current);
    }
  }, [prefersReducedMotion]);

  useEffect(() => {
    if (!pauseWhenOffscreen || typeof IntersectionObserver === "undefined") {
      return undefined;
    }

    const target = targetRef?.current;
    if (!target) {
      return undefined;
    }

    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry?.isIntersecting ?? true),
      { rootMargin: "160px 0px" },
    );
    observer.observe(target);

    return () => observer.disconnect();
  }, [pauseWhenOffscreen, targetRef]);

  useEffect(() => {
    if (!effectiveIsPlaying || !isVisible) {
      previousFrameRef.current = null;
      return undefined;
    }

    const paintInterval = 1000 / Math.max(1, fps);
    let frameId = 0;

    const tick = (timestamp: number): void => {
      const previous = previousFrameRef.current;
      previousFrameRef.current = timestamp;

      if (previous !== null) {
        let nextTime = elapsedRef.current + (timestamp - previous);
        if (nextTime >= durationMs) {
          if (loop) {
            nextTime %= durationMs;
          } else {
            nextTime = durationMs;
            setIsPlaying(false);
          }
        }

        elapsedRef.current = nextTime;
        if (timestamp - lastPaintRef.current >= paintInterval) {
          setElapsedMs(nextTime);
          lastPaintRef.current = timestamp;
        }
      }

      frameId = requestAnimationFrame(tick);
    };

    frameId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frameId);
  }, [durationMs, effectiveIsPlaying, fps, isVisible, loop]);

  return {
    elapsedMs: effectiveElapsedMs,
    isPlaying: effectiveIsPlaying,
    pause,
    play,
    restart,
    seek,
    toggle,
  };
}
