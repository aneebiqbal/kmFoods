# House of Ingredients — homepage, Phase 1

The Phase 1 creative record: the concept, the system, the artwork, the motion
and the evidence. Skill usage is in `skill-usage.md`.

## Creative concept

**KM Foods — Har Ghar Ka Zaiqa.** Positioning: *every ingredient has a place.*

The homepage is a living editorial index of Pakistani ingredients, not a
promotional landing page. It opens as an archive counter: a numbered rail of
ingredients, an oversized Piazzolla headline, and a large still life. Below it,
the ingredient index turns the real categories into a browsable ledger; the
daily shelf and the pantry edit show real products with real PKR prices; the
ordering experience explains the WhatsApp flow; the brand note closes.

Three hero directions were built and rendered before the choice:

| Direction | Idea | Result |
| --- | --- | --- |
| A · The Ingredient Archive | Numbered rail, oversized type, cropped still life | **Selected.** Most distinctive, best product discovery |
| B · The Spice Studio | Full-bleed cinematic photograph, cream type | Beautiful, but hides the catalogue; borrowed for the photograph scale |
| C · The Modern Pantry | Product-led shelf of real products | Weakest; the typographic tiles read as empty frames |

A was chosen, with B's large tactile photograph treatment.

## Design tokens

Ground: parchment. Ink: near-black green. Signal: oxide red. Material:
saffron. Dark band: cardamom. All OKLCH.

| Role | Value |
| --- | --- |
| `--color-paper` | `oklch(93.7% 0.025 83)` |
| `--color-paper-2` | `oklch(95.9% 0.018 86)` |
| `--color-paper-3` | `oklch(90.6% 0.033 85)` |
| `--color-ink` | `oklch(25.1% 0.010 133)` |
| `--color-ink-2` | `oklch(35.7% 0.015 129)` |
| `--color-muted` | `oklch(53.5% 0.019 122)` |
| `--color-rule` | `oklch(84.9% 0.035 85)` |
| `--color-accent` | `oklch(50% 0.154 31)` oxide red |
| `--color-saffron` | `oklch(73.2% 0.135 76)` |
| `--color-dusk` | `oklch(39.2% 0.038 145)` cardamom |
| `--color-error` | `oklch(48% 0.16 28)` |
| `--color-success` | `oklch(48% 0.11 152)` |

Type scale, spacing, radii, shadows, easings and durations are the scaffold's,
in `tokens.css`. One accent, restrained posture.

## Typography

| Role | Face |
| --- | --- |
| Display | Piazzolla (variable, editorial serif, no catalog theme) |
| Body, labels, prices | Archivo |
| Urdu display | Noto Nastaliq Urdu |
| Urdu body | Noto Naskh Arabic |

Prices and index numerals use tabular figures in the body face. A mono was
dropped: Hallmark gate 37 rejects five families, and the brief's mono was a
suggestion, not a requirement.

## Artwork inventory

| Asset | Path | Subject | Licence | Status |
| --- | --- | --- | --- | --- |
| Hero | `public/assets/lib/bumbu-rempah.jpg` | Chilies, turmeric, coriander seed, clove, ginger | CC BY-SA 4.0, Galeri ega | Approved for the hero |
| Chilies | `public/assets/lib/dried-chillies.jpg` | Dried red chilies | CC BY 2.0, Richard Mortel | Provisional; maps to red chili products |
| Whole spices | `public/assets/lib/gewuerze.jpg` | Cinnamon, star anise, cloves | CC BY-SA 4.0, Friedrich Haag | Provisional; maps to cinnamon, clove, star anise and the whole-spice category |

The image generator was unavailable (free-tier quota exhausted), so no original
photography was generated. The owner's own photographs replace these assets and
the typographic product cards. No gradient stands in for a photograph.

## Motion specification

CSS only, `--ease-out` for arrivals, `--dur-micro` 120ms for press,
`--dur-short` 220ms for hover, `--dur-long` 420ms for entrances and the mobile
menu.

- Hero: one staggered rise on the headline, rail and index (0.4s in all),
  content visible without scripting.
- Ingredient index: the revealed shelf cross-fades over 500ms on hover/focus;
  the active row turns oxide red at 220ms.
- Buttons: `scale(0.98)` on `:active`; colour steps on hover.
- Mobile menu: `grid-template-rows` plus opacity, 420ms.
- Reduced motion: every animation and transition resolves to its end state at
  once.

## Responsive behavior

Tested at 320, 360, 375, 390, 430, 768, 1024, 1440 and 1920. Below 60rem the
hero rail collapses, the type and photograph stack, and the index panel follows
the list. The container caps at 1440px and the gutters grow at 1920. Urdu sets
`dir="rtl"`; the rail mirrors to the right and the header actions mirror.

## Test evidence

| Gate | Result |
| --- | --- |
| Typecheck | pass (`tsc --noEmit`) |
| Lint | pass (one advisory `<img>` note, disabled per line) |
| Unit tests | 56 pass (42 shared + 14 storefront) |
| Production build | pass; home 1.95 kB, First Load JS 138 kB |
| Hallmark static sweep | 0 FAIL, 0 REJECTED, 3 advisory LCP warnings (below-the-fold images; the hero LCP carries `fetchPriority="high"`) |
| Browser | rendered at 1440 and 390, EN and UR, no console errors |

## Remaining issues

- **Product photography is partial.** Three verified photographs cover the hero
  and two categories; the rest of the catalogue is set in type. The owner's own
  photography is the upgrade path.
- **The image generator was unavailable.** If it returns, the hero and category
  artworks should be regenerated as original art-directed photographs.
- **The backend is local.** `NEXT_PUBLIC_MEDUSA_BACKEND_URL` points at
  `localhost:9000`; the production Medusa backend is still not deployed.
- The category rail on the shop page is a horizontal scroll; on narrow desktops
  the last chips are cut by the edge, which is the intended rail behaviour.
