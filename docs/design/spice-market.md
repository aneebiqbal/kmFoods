# KM Foods — The Modern Spice Market

The Phase 5 creative record: direction, system, asset inventory and the
photography dependency.

## Direction

**Concept.** KM Foods is a contemporary Lahore ingredient market. The interface
is cream paper and warm brown ink, set in Yeseva One, with gold hairlines and
one vermilion signal. The catalogue is the hero: real products, real PKR
prices, real pack sizes. The Market Shelf is the signature object.

**Why Solstice.** The deal offered Broadside (auction wood-type, too stark),
Almanac (cool slate and magenta, not food) and Solstice (cream paper, warm
brown ink, low-warm-light photography, one vermilion signal). Solstice is the
only material that can carry a premium food market. Broadside and Almanac were
rejected on the record.

**Palette.** Paper `oklch(94% 0.03 80)`, ink `oklch(27% 0.05 50)`, vermilion
`oklch(54% 0.20 24)`, gold `oklch(74% 0.14 75)`, dusk `oklch(27% 0.05 40)`
for the footer and the WhatsApp band. No second warm colour; gold never colours
text.

**Type.** Yeseva One (display), Archivo (body), Archivo Narrow (small print).
Urdu: Noto Nastaliq Urdu (display), Noto Naskh Arabic (body).

**Surfaces.** Square everywhere but the control pair. A well is paper-2 with a
2px ink border, a 1px gold outline inset 7px and a hard paper shadow. No soft
shadows, no rounded cards, no card in a card.

## Asset inventory

| Asset | Path | Subject | Licence | Status |
| --- | --- | --- | --- | --- |
| Hero | `public/assets/lib/bumbu-rempah.jpg` | Chilies, ginger, garlic, turmeric, peppercorns, coriander seed, clove | CC BY-SA 4.0, Galeri ega, Wikimedia Commons | Approved for the hero as a market ingredient flat lay; replace with owner photography |
| Chilies | `public/assets/lib/dried-chillies.jpg` | Dried red chilies | CC BY 2.0, Richard Mortel, Wikimedia Commons | Provisional; maps to red chili products |
| Whole spices | `public/assets/lib/gewuerze.jpg` | Star anise, cinnamon sticks, cloves | CC BY-SA 4.0, Friedrich Haag, Wikimedia Commons | Provisional; maps to cinnamon, clove and star anise products |

Product mapping lives in `apps/storefront/src/lib/product-art.ts`. Every
product without an honest photograph is set in type, never a gradient standing
in for a photo.

**Photography dependency.** The image generator was unavailable (free-tier
quota exhausted) and the Hallmark library holds only three honest spice
photographs. Category artwork, product photography and collection visuals are
therefore PARTIAL. The owner's own photographs replace the three library assets
and the typographic product cards when they are supplied.

## Signature

The Market Shelf (`apps/storefront/src/components/market-shelf.tsx`): real
categories as ruled shelves, real products with pack-size pills, one tap to add
a real variant to the real cart. It replaces the Pantry Shelf.

## Gates

- Visual identity: distinct (Solstice material, Market Shelf).
- Typography: Yeseva One / Archivo / Archivo Narrow, Urdu Nastaliq and Naskh.
- Imagery: three verified library photographs; product photography PARTIAL.
- Commerce: Medusa catalogue, variants, PKR prices, cart, checkout, WhatsApp handoff.
- Accessibility: focus rings, semantic landmarks, reduced motion, Urdu RTL.
