/**
 * Provisional product photography.
 *
 * No approved product photography exists. A small set of verified Wikimedia
 * Commons photographs is mapped to the products they honestly depict; every
 * other product is set in type. Each mapping is a placeholder for the owner's
 * own photograph and is listed in docs/design/spice-market.md.
 */
const ART: Array<[RegExp, string]> = [
  [/^red chili/i, "/assets/lib/dried-chillies.jpg"],
  [/^cinnamon/i, "/assets/lib/gewuerze.jpg"],
  [/^clove/i, "/assets/lib/gewuerze.jpg"],
  [/^star anise/i, "/assets/lib/gewuerze.jpg"],
];

export function productArt(name: string): string | null {
  const trimmed = name.trim();
  for (const [pattern, src] of ART) {
    if (pattern.test(trimmed)) return src;
  }
  return null;
}
