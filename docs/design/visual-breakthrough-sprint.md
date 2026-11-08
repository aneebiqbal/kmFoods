# The Living Market — visual breakthrough sprint

The sprint record: the audit, the art direction, the assets, the homepage, the
merchandising, the signature interaction and the evidence. The locked system is
`design.md`; the homepage remains the design authority.

## Visual audit — the ten highest-impact weaknesses

| # | Weakness | Impact |
| --- | --- | --- |
| 1 | Three photographs for a 78-product catalogue | Brand, perceived quality |
| 2 | A light, text-first hero with no photographic drama | First impression, conversion |
| 3 | A typographic ledger with 56px thumbnails | Merchandising, desire |
| 4 | Repetitive section rhythm (ledger after ledger) | Perceived quality |
| 5 | No signature interaction beyond the homepage index | Memorability |
| 6 | Flat composition — no organic shapes, layers or scale contrast | Authorship |
| 7 | The shop intro used a flat-lay, not a market | Brand, storytelling |
| 8 | Motion was limited to a reveal and colour steps | Aliveness |
| 9 | Category identity was type-only | Discovery |
| 10 | No empty-state or social artwork | Polish |

## New art direction — The Living Market

The House of Ingredients evolves from a printed index into a **living market**:
cinematic ingredient photography, organic image shapes, layered asymmetric
compositions and a tactile shelf. The palette (parchment, ink, oxide red,
saffron, cardamom) and the faces (Piazzolla, Archivo, Nastaliq/Naskh) are
unchanged. The homepage hero is now a dark, cinematic plate; the market
photography carries the interior.

## Assets

The image generator was unavailable (free-tier quota, retry in hours), so the
sprint used the approved Hallmark library and honest typography. New verified
photographs, credited in the footer:

| Asset | Path | Used for | Licence |
| --- | --- | --- | --- |
| Dark spice flat lay | `public/assets/lib/bumbu-rempah-2.jpg` | Homepage hero | CC BY-SA 4.0, Galeri ega |
| Chili market bowls | `public/assets/lib/chili-market.jpg` | Chilies category and chapter | CC BY-SA 4.0, Wilfredor |
| Spice vendor | `public/assets/lib/spice-seller.jpg` | Market atmosphere | CC BY-SA 4.0, Jakub Hałun |
| Souk stall | `public/assets/lib/souk-stall.jpg` | Shop intro | CC BY-SA 3.0, J. Ligero Loarte |
| Dried red chilies | `public/assets/lib/dried-chillies.jpg` | Red chili products | CC BY 2.0, Richard Mortel |
| Cinnamon, star anise, clove | `public/assets/lib/gewuerze.jpg` | Whole-spice category and cinnamon/clove/star anise | CC BY-SA 4.0, Friedrich Haag |
| Saffron threads | `public/assets/lib/saffron-threads.jpg` | Market accent | CC BY-SA 4.0, Hubertl |

Products without an honest photograph remain set in type. No branded packaging
is reproduced; no photograph is presented as KM Foods product photography.

## Homepage improvements

- **The Counter** is now a dark cinematic plate: the numbered ingredient rail,
  an oversized Piazzolla headline and the organic-masked flat lay.
- **The Living Shelf** (new) is the signature: a tactile rail of real
  ingredients; selecting one brings its composition forward in an arch stage
  with the real pack, price and a variant-safe action.
- **Shop by category** keeps the hover-reveal ledger, now with the chili-market
  photograph.
- **Kitchen essentials**, the **ingredient feature** (organic-masked) and the
  **Pantry Edit** carry the photographic rhythm; the ordering band and the
  brand note close.

## Product merchandising

The ledger thumbnails grew from 56px to 80/96px with a hairline hover; the
Living Shelf tiles are 96px ingredient selectors; the product dossier keeps its
visual stage and adds the organic treatment on the feature.

## Signature interaction — the Living Shelf

A horizontal rail of the real ingredients a photograph honestly shows. Selecting
one (tap, click or keyboard) cross-fades the arch stage and updates the real
product, pack sizes, price and a variant-safe action. The rail is
touch-friendly, the panel is never empty, and reduced motion resolves the
change at once. Verified at 1440 and 390.

## Motion

The homepage hero staggers in (headline, standfirst, actions, photograph) with
`--rise-delay`; the organic photograph breathes on hover; the shelf cross-fades;
the ledger thumbnails lift their hairline. All CSS, all transform/opacity, all
reduced-motion safe.

## Interior pages

The shop intro uses the souk-stall photograph; the chilies chapter uses the
chili-market photograph; the whole-spice chapter uses the cinnamon photograph;
the product dossier uses the honest product photograph. The search page and the
cart/checkout keep the Phase 2 system.

## Mobile and Urdu

Tested at 320/360/375/390/430/768/1024/1440/1920: no horizontal overflow on
the homepage, shop, search or product routes. The Living Shelf rail scrolls
horizontally on mobile and the panel follows. Urdu mirrors the rail, shelf and
dossier in Nastaliq/Naskh.

## Test evidence

| Gate | Result |
| --- | --- |
| Typecheck | pass |
| ESLint | 0 warnings / 0 errors |
| Unit tests | 73 pass (42 shared + 31 storefront) |
| Hallmark static sweep | 0 FAIL · 1 waived (39b, Living Shelf tiles) |
| Hallmark render sweep | 0 FAIL on `/` |
| Production build | pass |
| Browser | rendered at 1440 and 390, EN and UR |

## Screenshots

`.hallmark/shots/s8-home-1440.png`, `s8-home-390.png`, `s8-shop-1440.png`,
`s8-shop-390.png`, `s8-category-1440.png`, `s8-search-1440.png`,
`s8-product-1440.png`; the before state in `s8-before-home-*.png`.

## Remaining issues

- **Product photography is still thin.** Seven verified photographs cover the
  hero, two categories and a handful of products; the generator was unavailable.
  The owner's own photography remains the upgrade path.
- **The render tier's hero reflexes** on the dark counter (44c) and the
  two-line product names at 1024 (49b, inside its guard) are recorded.
- The production Medusa backend is still local.
