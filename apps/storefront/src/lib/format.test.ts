import { describe, expect, it } from "vitest";
import { money, productTitle } from "./format";

describe("money", () => {
  it("formats PKR in English", () => {
    expect(money(85, "en")).toBe("Rs 85");
    expect(money(1300, "en")).toBe("Rs 1,300");
  });

  it("formats PKR in the Urdu locale", () => {
    expect(money(85, "ur")).toContain("85");
  });

  it("renders a dash for a missing price", () => {
    expect(money(null, "en")).toBe("—");
    expect(money(undefined, "en")).toBe("—");
  });
});

describe("productTitle", () => {
  it("prefers the Urdu name in Urdu", () => {
    expect(productTitle("Red Chili Powder", "لال مرچ پاؤڈر", "ur")).toBe(
      "لال مرچ پاؤڈر"
    );
  });

  it("falls back to English when no Urdu name exists", () => {
    expect(productTitle("Turmeric", null, "ur")).toBe("Turmeric");
  });

  it("uses English in English", () => {
    expect(productTitle("Turmeric", "ہلدی", "en")).toBe("Turmeric");
  });
});
