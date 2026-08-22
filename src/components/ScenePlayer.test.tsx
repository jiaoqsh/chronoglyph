import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { ScenePlayer } from "./ScenePlayer";

const phases = [
  { id: "one", label: "ONE", startMs: 0, snapshotMs: 100 },
  { id: "two", label: "TWO", startMs: 500, snapshotMs: 650 },
  { id: "three", label: "THREE", startMs: 1000, snapshotMs: 1150 },
] as const;

describe("ScenePlayer", () => {
  it("pauses and seeks to a selected phase snapshot", () => {
    render(
      <ScenePlayer phases={phases} durationMs={1400} autoplay={false}>
        {(context) => <output data-testid="frame">{context.elapsedMs}</output>}
      </ScenePlayer>,
    );

    fireEvent.click(screen.getByRole("tab", { name: /two/i }));
    expect(screen.getByTestId("frame")).toHaveTextContent("650");
    expect(screen.getByRole("tab", { name: /two/i })).toHaveAttribute("aria-selected", "true");
  });

  it("steps between phases without exceeding timeline bounds", () => {
    render(
      <ScenePlayer phases={phases} durationMs={1400} autoplay={false}>
        {(context) => <output data-testid="phase">{context.phase.id}</output>}
      </ScenePlayer>,
    );

    fireEvent.click(screen.getByRole("button", { name: /back/i }));
    expect(screen.getByTestId("phase")).toHaveTextContent("one");
    expect(screen.getByRole("button", { name: /back/i })).toBeDisabled();
    fireEvent.click(screen.getByRole("button", { name: /next/i }));
    expect(screen.getByTestId("phase")).toHaveTextContent("two");
    fireEvent.click(screen.getByRole("tab", { name: /three/i }));
    fireEvent.click(screen.getByRole("button", { name: /next/i }));
    expect(screen.getByTestId("phase")).toHaveTextContent("three");
    expect(screen.getByRole("button", { name: /next/i })).toBeDisabled();
  });

  it("moves and selects phase tabs with the keyboard", () => {
    render(
      <ScenePlayer phases={phases} durationMs={1400} autoplay={false}>
        {(context) => <output data-testid="keyboard-phase">{context.phase.id}</output>}
      </ScenePlayer>,
    );

    const firstTab = screen.getByRole("tab", { name: /one/i });
    firstTab.focus();
    fireEvent.keyDown(firstTab, { key: "ArrowRight" });

    expect(screen.getByTestId("keyboard-phase")).toHaveTextContent("two");
    expect(screen.getByRole("tab", { name: /two/i })).toHaveFocus();
  });

  it("rejects invalid public timeline input with an actionable error", () => {
    expect(() =>
      render(
        <ScenePlayer phases={[]} durationMs={1400} autoplay={false}>
          {() => null}
        </ScenePlayer>,
      ),
    ).toThrow("Chronoglyph requires at least one scene phase.");
  });

  it("toggles play and pause state", () => {
    render(
      <ScenePlayer phases={phases} durationMs={1400} autoplay={false}>
        {() => null}
      </ScenePlayer>,
    );

    fireEvent.click(screen.getByRole("button", { name: "Play" }));
    expect(screen.getByRole("button", { name: "Pause" })).toBeInTheDocument();
  });

  it("renders a stable final frame when reduced motion is requested", () => {
    const matchMedia = vi.spyOn(window, "matchMedia").mockImplementation(
      (query) =>
        ({
          matches: query === "(prefers-reduced-motion: reduce)",
          media: query,
          onchange: null,
          addEventListener: vi.fn(),
          removeEventListener: vi.fn(),
          addListener: vi.fn(),
          removeListener: vi.fn(),
          dispatchEvent: vi.fn(() => true),
        }) as MediaQueryList,
    );

    render(
      <ScenePlayer phases={phases} durationMs={1400}>
        {(context) => <output data-testid="reduced-frame">{context.elapsedMs}</output>}
      </ScenePlayer>,
    );

    expect(screen.getByTestId("reduced-frame")).toHaveTextContent("1400");
    expect(screen.getByRole("tab", { name: /three/i })).toHaveAttribute("aria-selected", "true");
    fireEvent.click(screen.getByRole("button", { name: "Play" }));
    expect(screen.getByRole("button", { name: "Play" })).toBeInTheDocument();
    matchMedia.mockRestore();
  });
});
