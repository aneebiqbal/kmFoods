import { describe, expect, it } from "vitest";
import { formatPKR, formatPKRUrdu, minorToMajor, PKR_DECIMAL_DIGITS } from "./money";
import { isValidPakistaniPhone, normalizePakistaniPhone, formatPakistaniPhone } from "./phone";
import { quoteDelivery, type DeliveryArea } from "./delivery";
import { validateQuantity } from "./quantity";

describe("money", () => {
  it("formats whole rupees with grouping", () => {
    expect(formatPKR(85)).toBe("Rs 85");
    expect(formatPKR(1300)).toBe("Rs 1,300");
    expect(formatPKR(17000)).toBe("Rs 17,000");
  });

  it("formats in the Urdu locale without throwing", () => {
    expect(formatPKRUrdu(85)).toContain("85");
  });

  it("treats Medusa amounts as whole rupees", () => {
    expect(minorToMajor(85)).toBe(85);
    expect(PKR_DECIMAL_DIGITS).toBe(0);
  });
});

describe("Pakistani phone numbers", () => {
  it("normalizes the common local form", () => {
    expect(normalizePakistaniPhone("0321 1210333")).toBe("+923211210333");
  });

  it("normalizes the international form", () => {
    expect(normalizePakistaniPhone("+92 321 1210333")).toBe("+923211210333");
    expect(normalizePakistaniPhone("0092 321 1210333")).toBe("+923211210333");
  });

  it("rejects landlines and short numbers", () => {
    expect(normalizePakistaniPhone("042 35771234")).toBeNull();
    expect(normalizePakistaniPhone("0321")).toBeNull();
    expect(normalizePakistaniPhone("")).toBeNull();
  });

  it("exposes a validity check and a display format", () => {
    expect(isValidPakistaniPhone("0321 1210333")).toBe(true);
    expect(isValidPakistaniPhone("12345")).toBe(false);
    expect(formatPakistaniPhone("03211210333")).toBe("+92 321 1210333");
  });
});

describe("delivery eligibility", () => {
  const areas: DeliveryArea[] = [
    { id: "a1", city: "Lahore", area_name: "", serviceable: true, fee_pkr: 0 },
    { id: "a2", city: "Lahore", area_name: "DHA", serviceable: true, fee_pkr: 0 },
    { id: "a3", city: "Karachi", area_name: "", serviceable: false, fee_pkr: 0 },
  ];

  it("matches a city-wide default for any area in that city", () => {
    const quote = quoteDelivery("Lahore", "Model Town", areas);
    expect(quote.serviceable).toBe(true);
    expect(quote.matched_area?.id).toBe("a1");
  });

  it("matches a specific area", () => {
    expect(quoteDelivery("Lahore", "DHA", areas).serviceable).toBe(true);
  });

  it("rejects a city that is not configured", () => {
    const quote = quoteDelivery("Islamabad", "F-6", areas);
    expect(quote.serviceable).toBe(false);
    expect(quote.fee_pkr).toBe(0);
  });

  it("honours a non-serviceable configured area", () => {
    expect(quoteDelivery("Karachi", "", areas).serviceable).toBe(false);
  });

  it("is case- and whitespace-insensitive", () => {
    expect(quoteDelivery("  lahore ", "  dha ", areas).serviceable).toBe(true);
  });
});

describe("quantity validation", () => {
  it("accepts whole numbers within range", () => {
    expect(validateQuantity(1)).toEqual({ ok: true, quantity: 1 });
    expect(validateQuantity("5")).toEqual({ ok: true, quantity: 5 });
    expect(validateQuantity(999)).toEqual({ ok: true, quantity: 999 });
  });

  it("rejects zero, negatives, fractions and non-numbers", () => {
    expect(validateQuantity(0)).toEqual({ ok: false, reason: "below_minimum" });
    expect(validateQuantity(-1)).toEqual({ ok: false, reason: "below_minimum" });
    expect(validateQuantity(1.5)).toEqual({ ok: false, reason: "not_an_integer" });
    expect(validateQuantity("abc")).toEqual({ ok: false, reason: "not_a_number" });
    expect(validateQuantity("")).toEqual({ ok: false, reason: "not_a_number" });
    expect(validateQuantity(null)).toEqual({ ok: false, reason: "not_a_number" });
  });

  it("rejects absurd quantities", () => {
    expect(validateQuantity(1000)).toEqual({ ok: false, reason: "above_maximum" });
  });
});
