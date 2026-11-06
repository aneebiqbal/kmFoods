# The Living Spice Atelier — design system

The storefront was reinvented from first principles. This document describes the
identity, the tokens and the rules a maintainer needs to stay consistent.

---

## 1. Creative direction

**Concept.** KM Foods is treated as a contemporary ingredient studio rather than a
promotional storefront. The interface is a dark atelier plate — deep midnight
aubergine — on which parchment shelves hold the catalogue. Typography carries the
editorial voice; imagery is treated as art direction, not decoration.

**Palette.**

| Token | Value | Use |
| --- | --- | --- |
| `bone-50 … bone-400` | `#FAF6EE … #D3BD9C` | Page background, cores, muted surfaces |
| `parchment-100 … 300` | `#F1E8D8 … #D6C19E` | Shelf boards, warm panels |
| `aubergine-400 … 900` | `#6B4A74 … #140B18` | Dark plates, primary buttons, footer |
| `paprika-400 … 700` | `#CF5A41 … #6D2318` | Accent CTAs, active states, prices on dark |
| `saffron-400 … 600` | `#E8A044 … #B56D1C` | Highlights, section indices, warm glows |
| `olive-400 … 700` | `#7D8C55 … #323B20` | Secondary accent, category identity |
| `ink-500 … 900` | `#6B5B52 … #1C1413` | Body text, headings |

Dark surfaces are deliberate and bounded: the announcement bar, the hero, the
Pantry Shelf plate, the WhatsApp plate and the footer. Content surfaces stay
bone so long catalogues remain readable.

**Typography.**

| Role | Latin | Urdu |
| --- | --- | --- |
| Display | Fraunces with optical sizing (`opsz`), weight 480–560 | Noto Nastaliq Urdu |
| Body / UI | Plus Jakarta Sans | Noto Naskh Arabic |

Fraunces is loaded with the `opsz` axis so headlines set at 144 and section
titles at 96 keep their contrast. Display sizes use `clamp()` and a 0.95–1.02
line height.

**Signature devices.**

- *Double bezel* — every card is a `stage` (outer shell, hairline, soft shadow)
  containing a `core` (inner surface, inset highlight).
- *Section index numerals* — oversized Fraunces numerals, outlined rather than
  filled (`.index-outline`), numbering shelves and scenes.
- *Parchment shelf* — a warm gradient board with a rounded "wood" edge bar.
- *Ingredient rail* — a slow marquee of ingredient names between scenes.
- *Button-in-button* — CTAs carry their arrow in a circular well that nudges on
  hover.
- *Grain* — a fixed SVG turbulence overlay at low opacity, multiply on light
  surfaces and screen on dark.

---

## 2. Motion language

All motion is CSS. No animation library is used.

| Primitive | Definition | Use |
| --- | --- | --- |
| `.reveal` | `translateY(1.75rem) + blur(8px) → none`, 900ms, atelier easing, triggered by `IntersectionObserver` | Section entrances |
| `.rise` | `translateY(1rem) → none`, 760ms | Hero content |
| `.animate-drift` | slow vertical float + 1.5° rotation, 9–15s | Decorative spice motes |
| `.animate-marquee` | `translateX(-50%)`, 38s linear | Ingredient rail |
| `.btn:active` | `scale(0.97)` | Press feedback |
| `.btn-icon` | `translateX(0.18rem)` on parent hover | CTA affordance |

Easing is `cubic-bezier(0.16, 1, 0.3, 1)` for entrances and
`cubic-bezier(0.76, 0, 0.24, 1)` for swaps.

**Rules.**

- Only `transform`, `opacity` and `filter` are animated.
- No scroll hijacking, no parallax on scroll position.
- Decorative motion stops under `prefers-reduced-motion: reduce`; `.reveal`
  resolves to its final state immediately.
- Motion never gates a purchase action — add-to-cart is always enabled.

---

## 3. Layout system

- Max content width `90rem`; section padding `py-16` mobile, `lg:py-24`.
- Grids: product grids `2 / 3 / 4` columns at `sm / lg / xl`; category rail
  `2 / 3 / 5`.
- Breakpoints follow Tailwind defaults (`640 / 768 / 1024 / 1280`).
- Horizontal overflow must stay at `0` at 320 → 1920. Verified at
  390 and 1440 in Phase 4.
- Urdu sets `dir="rtl"` on `<html>`; the brand mark forces LTR so it never
  mirrors.

---

## 4. Component inventory

| Component | File | Notes |
| --- | --- | --- |
| Announcement bar | `components/announcement-bar.tsx` | Dismissible, localised |
| Header | `components/chrome.tsx` | Three zones on desktop, dedicated mobile bar |
| Search overlay | `components/search-overlay.tsx` | Live results from `/api/search` |
| Cart drawer | `components/cart-drawer.tsx` | Portaled to `<body>` |
| Footer | `components/footer.tsx` | Dark atelier plate, oversized wordmark |
| Product card | `components/product-card.tsx` | Stage + core, pack indicator |
| Product artwork | `components/product-visual.tsx` | Category-coloured, uses real thumbnails |
| Pantry Shelf | `components/pantry-shelf.tsx` | Signature commerce module |
| Policy page | `components/policy-page.tsx` | Shared layout for policy routes |
| Body portal | `components/body-portal.tsx` | Required for overlays inside the header |

---

## 5. Visual assets

No approved product photography exists. The storefront uses an **original,
non-photographic artwork system** (`ProductVisual`) built from a
category-coloured radial wash, a concentric-ring motif and the Urdu product name.
It never impersonates a photograph, and it is replaced automatically the moment
a real Medusa thumbnail is present.

The brand mark (`components/brand-logo.tsx`) is original SVG: a two-tone ring
(paprika → olive) containing a chili, a leaf and a saffron seed, beside a serif
wordmark. A `variant="light"` treatment is used on dark surfaces.

**Provisional by design.** Every generated or drawn asset is a placeholder for
client photography. Upload real images in Medusa Admin to replace them.

---

## 6. Accessibility rules

- Semantic landmarks: `header`, `nav`, `main`, `footer`; one `h1` per route.
- Overlays are `role="dialog"` + `aria-modal`, close on `Escape`, and lock body
  scroll while open.
- Every interactive element has an accessible name; icon-only controls carry
  `aria-label`.
- Focus is always visible (`:focus-visible` outline).
- Colour is never the only signal: pack sizes are text labels, availability is
  text, category identity pairs colour with a name.
- Reduced motion is honoured globally.
- Touch targets are at least 40px on mobile.
