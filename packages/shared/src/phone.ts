/**
 * Pakistani mobile numbers. Accepted input forms:
 *   03XX XXXXXXX, +92 3XX XXXXXXX, 0092 3XX XXXXXXX, 92 3XX XXXXXXX
 * Normalized output is always +92 followed by the 10-digit subscriber number.
 */
export function normalizePakistaniPhone(input: string): string | null {
  const digits = input.replace(/\D/g, "");
  if (/^03\d{9}$/.test(digits)) return `+923${digits.slice(2)}`;
  if (/^923\d{9}$/.test(digits)) return `+923${digits.slice(3)}`;
  if (/^00923\d{9}$/.test(digits)) return `+92${digits.slice(4)}`;
  return null;
}

export function isValidPakistaniPhone(input: string): boolean {
  return normalizePakistaniPhone(input) !== null;
}

/** +923211234567 -> +92 321 1234567 */
export function formatPakistaniPhone(input: string): string | null {
  const normalized = normalizePakistaniPhone(input);
  if (!normalized) return null;
  return `${normalized.slice(0, 3)} ${normalized.slice(3, 6)} ${normalized.slice(6)}`;
}
