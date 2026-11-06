export const MIN_QUANTITY = 1;
export const MAX_QUANTITY = 999;

export type QuantityResult =
  | { ok: true; quantity: number }
  | { ok: false; reason: "not_a_number" | "not_an_integer" | "below_minimum" | "above_maximum" };

/**
 * Cart quantities are whole packs. Rejects anything a customer could not
 * physically receive, before the value reaches Medusa.
 */
export function validateQuantity(value: unknown): QuantityResult {
  if (typeof value === "string" && value.trim() === "") {
    return { ok: false, reason: "not_a_number" };
  }
  const quantity = typeof value === "string" ? Number(value) : value;
  if (typeof quantity !== "number" || Number.isNaN(quantity)) {
    return { ok: false, reason: "not_a_number" };
  }
  if (!Number.isInteger(quantity)) {
    return { ok: false, reason: "not_an_integer" };
  }
  if (quantity < MIN_QUANTITY) return { ok: false, reason: "below_minimum" };
  if (quantity > MAX_QUANTITY) return { ok: false, reason: "above_maximum" };
  return { ok: true, quantity };
}
