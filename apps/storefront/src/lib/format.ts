import { formatPKR, formatPKRUrdu, type Locale } from "@kmfoods/shared";

export function money(
  amount: number | null | undefined,
  locale: Locale
): string {
  if (amount === null || amount === undefined) return "—";
  return locale === "ur" ? formatPKRUrdu(amount) : formatPKR(amount);
}

/** Urdu wins when the customer is in Urdu and the product carries a name. */
export function productTitle(
  title: string,
  titleUr: string | null,
  locale: Locale
): string {
  return locale === "ur" && titleUr ? titleUr : title;
}

export function categoryLabel(
  labels: { en: string; ur: string },
  locale: Locale
): string {
  return locale === "ur" ? labels.ur : labels.en;
}
