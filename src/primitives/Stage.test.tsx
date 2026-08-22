import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Stage } from "./Stage";

describe("Stage", () => {
  it("uses a unique glow filter for every SVG instance", () => {
    const { container } = render(
      <>
        <Stage width={100} height={100} label="First stage" />
        <Stage width={100} height={100} label="Second stage" />
      </>,
    );

    const filters = Array.from(container.querySelectorAll("filter"));
    expect(filters).toHaveLength(2);
    expect(filters[0]?.id).not.toBe(filters[1]?.id);
    expect(screen.getByRole("img", { name: "First stage" })).toHaveStyle({
      "--cg-soft-glow-filter": `url(#${filters[0]?.id})`,
    });
  });
});
