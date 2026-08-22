import { fireEvent, render, screen, within } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import PlaygroundPage from "./PlaygroundPage";

afterEach(() => {
  window.history.replaceState(null, "", "/playground");
});

describe("PlaygroundPage", () => {
  it("loads a built-in example from the query string", () => {
    window.history.replaceState(null, "", "/playground?scene=queue-fanout");
    render(<PlaygroundPage />);

    expect(screen.getByRole("button", { name: /Queue fan-out/i })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    expect(screen.getByRole("heading", { name: "Queue fan-out" })).toBeInTheDocument();
  });

  it("switches examples and replaces editor source", () => {
    render(<PlaygroundPage />);
    fireEvent.click(screen.getByRole("button", { name: /Two-phase commit/i }));

    expect((screen.getByLabelText("Scene JSON") as HTMLTextAreaElement).value).toContain(
      '"id": "two-phase-commit"',
    );
    expect(screen.getByRole("heading", { name: "Two-phase commit" })).toBeInTheDocument();
  });

  it("preserves the last valid preview when invalid JSON is applied", () => {
    render(<PlaygroundPage />);
    const editor = screen.getByLabelText("Scene JSON");
    fireEvent.change(editor, { target: { value: "{}" } });
    fireEvent.click(screen.getByRole("button", { name: /apply \+ restart/i }));

    expect(screen.getByText("id must be a non-empty string.")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Edge cache miss" })).toBeInTheDocument();
  });

  it("applies a valid edited scene and restarts the preview", () => {
    render(<PlaygroundPage />);
    const editor = screen.getByLabelText("Scene JSON");
    const scene = JSON.parse((editor as HTMLTextAreaElement).value) as Record<string, unknown>;
    scene.title = "Edited edge path";
    fireEvent.change(editor, { target: { value: JSON.stringify(scene, null, 2) } });
    fireEvent.click(screen.getByRole("button", { name: /apply \+ restart/i }));

    expect(screen.getByRole("heading", { name: "Edited edge path" })).toBeInTheDocument();
    expect(screen.getByText("SCENE APPLIED / CLOCK RESTARTED")).toBeInTheDocument();
  });

  it("filters the catalog by domain and keeps a visible scene selected", () => {
    render(<PlaygroundPage />);
    fireEvent.click(screen.getByRole("button", { name: /NATURAL SCIENCE/i }));

    expect(screen.getByRole("button", { name: /Water cycle/i })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    expect(screen.queryByRole("button", { name: /Edge cache miss/i })).not.toBeInTheDocument();
    expect(
      within(screen.getByLabelText("Authored scene blueprint")).getByRole("heading", {
        name: "Water cycle",
      }),
    ).toBeInTheDocument();
  });

  it("loads an authored DNA scene from the query string without showing the JSON editor", () => {
    window.history.replaceState(null, "", "/playground?scene=dna-to-protein");
    render(<PlaygroundPage />);

    const blueprint = screen.getByLabelText("Authored scene blueprint");
    expect(within(blueprint).getByRole("heading", { name: "DNA to protein" })).toBeInTheDocument();
    expect(screen.getByRole("img", { name: "DNA transcription and translation into a protein" })).toBeInTheDocument();
    expect(screen.queryByLabelText("Scene JSON")).not.toBeInTheDocument();
  });
});
