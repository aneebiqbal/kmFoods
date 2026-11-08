/**
 * Provisional category artwork. Only the categories a verified photograph
 * honestly depicts are mapped; the rest are set in type. See
 * docs/design/homepage-phase-1.md.
 */
const ART: Record<string, string> = {
  "chilies-peppers": "/assets/lib/chili-market.jpg",
  "whole-spices": "/assets/lib/gewuerze.jpg",
};

/** Atmospheric market photography, credited, never a product claim. */
export const MARKET_ART = "/assets/lib/souk-stall.jpg";

export function categoryArt(handle: string): string | null {
  return ART[handle] ?? null;
}
