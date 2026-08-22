import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import App from "./App";

describe("home page reference scene", () => {
  it("uses the familiar HTTP page-load walkthrough", () => {
    render(<App />);

    expect(
      screen.getByRole("heading", { name: "What happens after you press Enter?" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("img", { name: "Browser page-load request lifecycle" })).toBeInTheDocument();
    expect(screen.queryByText("WAL PUSH / REFERENCE IMPLEMENTATION")).not.toBeInTheDocument();
  });

  it("links to natural-science scenes from the categorized catalog", () => {
    render(<App />);

    expect(screen.getByRole("heading", { name: "Water cycle" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "DNA to protein" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Water cycle/i })).toHaveAttribute(
      "href",
      "/playground/?scene=water-cycle",
    );
  });
});
