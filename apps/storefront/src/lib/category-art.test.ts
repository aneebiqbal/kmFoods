import { describe, expect, it } from "vitest";
import { categoryArt } from "./category-art";

describe("categoryArt", () => {
  it("maps the categories a photograph honestly depicts", () => {
    expect(categoryArt("chilies-peppers")).toBe("/assets/lib/chili-market.jpg");
    expect(categoryArt("whole-spices")).toBe("/assets/lib/gewuerze.jpg");
  });

  it("returns null for categories without a photograph", () => {
    expect(categoryArt("seeds")).toBeNull();
    expect(categoryArt("sweeteners")).toBeNull();
  });
});
