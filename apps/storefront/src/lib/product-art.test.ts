import { describe, expect, it } from "vitest";
import { productArt } from "./product-art";

describe("productArt", () => {
  it("maps red chili products to the verified chili photograph", () => {
    expect(productArt("Red Chili Crushed")).toBe("/assets/lib/dried-chillies.jpg");
    expect(productArt("Red Chili Powder")).toBe("/assets/lib/dried-chillies.jpg");
  });

  it("maps whole spices to the verified whole-spice photograph", () => {
    expect(productArt("Cinnamon")).toBe("/assets/lib/gewuerze.jpg");
    expect(productArt("Clove")).toBe("/assets/lib/gewuerze.jpg");
    expect(productArt("Star Anise")).toBe("/assets/lib/gewuerze.jpg");
  });

  it("returns null for products with no honest photograph", () => {
    expect(productArt("Turmeric")).toBeNull();
    expect(productArt("Almond Grace")).toBeNull();
  });
});
