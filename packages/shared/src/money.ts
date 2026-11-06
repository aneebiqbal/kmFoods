/**
 * PKR helpers. Medusa's default currency table declares PKR with zero decimal
 * digits, so amounts are whole rupees (the source price list is also whole
 * rupees). If that table ever changes, only this file needs updating.
 */
export const PKR_CURRENCY_CODE = "pkr";
export const PKR_DECIMAL_DIGITS = 0;

const PKR_FORMAT: Intl.NumberFormatOptions = {
  style: "currency",
  currency: "PKR",
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
};

export function formatPKR(amount: number, locale = "en-PK"): string {
  // ICU inserts a non-breaking space after the symbol; normalize it so the
  // output is predictable in tests and copy-paste.
  return new Intl.NumberFormat(locale, PKR_FORMAT)
    .format(amount)
    .replace(/\u00a0/g, " ");
}

/** Urdu grouping and digits, for the RTL storefront. */
export function formatPKRUrdu(amount: number): string {
  return new Intl.NumberFormat("ur-PK", PKR_FORMAT)
    .format(amount)
    .replace(/\u00a0/g, " ");
}

/** Medusa returns minor-unit amounts; PKR has none, so this is the identity. */
export function minorToMajor(amount: number): number {
  return amount / 10 ** PKR_DECIMAL_DIGITS;
}
