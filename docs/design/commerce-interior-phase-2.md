# The House of Ingredients — Phase 2 · the commerce interior

The Phase 2 record: shop, category, search and the product dossier. The
homepage (Phase 1) stays the design authority; the interior extends its
grammar. The locked system is `design.md`.

## What changed

| Area | Before | After |
| --- | --- | --- |
| Shop | A four-column card grid under a chip rail | The complete ingredient ledger: an editorial intro, a numbered category directory, a search/sort bar and a numbered product ledger with pagination |
| Category | The shop grid filtered by a chip | The ingredient shelves: a chapter header with the category number, a neutral functional description, the count, related categories and a verified photograph where one honestly exists |
| Search | A modal with an input | A first-class `/search` page with a large typographic field and a ruled result ledger; the header quick-lookup feeds it |
| Product | A two-column media + purchase panel | The ingredient dossier: a visual stage, a ruled facts ledger (category, pack, reference, price), the purchase panel, the description and a related ledger |
| Product card | One card, quick-add guessed a variant | One system: `ProductCard` (grid), `ProductRow` (ledger) and `ProductAction` — variant-safe, so a list never guesses a pack |

## Design decisions

- **The numbered ledger.** Products are numbered `01…` in catalogue order and
  paginate at 24. The number is the printed catalogue's row, not an invented
  rank.
- **Variant safety.** A product with one pack can be added directly; a product
  with 100g and 1kg routes to its dossier. No list view guesses a default.
- **Category chapters.** Each category is a chapter with its index number, a
  short neutral description (what the shelf holds, never a sourcing claim) and
  a verified photograph when one honestly depicts the category.
- **Search is a page.** `/search?q=` is deep-linkable and SEO-friendly; the
  header overlay is a quick lookup that lands on it.
- **The dossier.** The product record reads as a ruled ledger: category, pack
  size, reference (the printed `No.`), price, then the purchase panel and the
  real description. No origin, purity, certification or health claims are
  invented.

## Imagery

The image generator was unavailable (free-tier quota exhausted, retry in hours)
and the Hallmark library holds only three honest spice photographs. They are
used where they honestly depict the subject and credited in the footer:

| Asset | Path | Used for | Licence |
| --- | --- | --- | --- |
| Mixed spice flat lay | `public/assets/lib/bumbu-rempah.jpg` | Shop intro | CC BY-SA 4.0, Galeri ega |
| Dried red chilies | `public/assets/lib/dried-chillies.jpg` | Chilies category and red chili products | CC BY 2.0, Richard Mortel |
| Cinnamon, star anise, clove | `public/assets/lib/gewuerze.jpg` | Whole-spice category and cinnamon/clove/star anise products | CC BY-SA 4.0, Friedrich Haag |

Every other product is set in type (`ProductVisual`), a consistent, honest
fallback. No gradient stands in for a photograph.

## Motion

The homepage's vocabulary continues: hover colour steps, a 0.98 press scale,
the mobile menu's grid-rows transition, and the category artwork cross-fade on
the homepage index. Reduced motion resolves everything to its end state.

## Responsive and Urdu

Tested at 320, 360, 375, 390, 430, 768, 1024, 1440 and 1920: no horizontal
overflow on `/shop`, `/search` or `/product/[slug]`. The ledger rows wrap their
action under the name on narrow screens. Urdu sets `dir="rtl"`; the rail, the
ledger and the dossier mirror, with Nastaliq display and Naskh body.

## Backend-unavailable states

With Medusa unreachable, `/shop`, `/search`, `/product/[slug]` and the category
route all render the designed catalogue-unavailable well — no fabricated
inventory, no error boundary, no empty success. The search route reports its
own error path in unit tests.

## Test evidence

| Gate | Result |
| --- | --- |
| Typecheck | pass |
| ESLint | 0 warnings / 0 errors |
| Unit tests | 31 storefront (14 baseline + 17 new) · 42 shared |
| Hallmark static sweep | 0 FAIL · 0 REJECTED · 2 advisory lazy-image warnings |
| Hallmark render sweep | 0 FAIL on `/shop`, `/search`, `/product/[slug]` |
| Production build | pass |
| Browser | rendered at 1440 and 390, EN and UR, with and without the backend |

New tests: `src/lib/shop.test.ts` (sort, pagination, page size),
`src/lib/product-art.test.ts`, `src/lib/category-art.ts` mapping,
`src/app/api/search/route.test.ts` (short query, real results, backend down).

## Screenshots

- `.hallmark/shots/localhost-3000-shop-1440x900.png`, `…-shop-1440-full.png`,
  `…-shop-375.png`
- `.hallmark/shots/localhost-3000-search-…` and
  `…-product-red-chili-crushed-…`
- `/tmp/after2-*.png` (working captures) and `/tmp/unavail-*.png`
  (backend-down states)

## Remaining issues

- **Product photography is still partial.** Three photographs cover the shop
  intro, the chilies and the whole spices. The owner's own photography is the
  upgrade path; the generator was unavailable for this phase.
- **The production Medusa backend is still local.** `localhost:9000`.
- The render tier misapplies the landing-page hero gates to the shop's page
  header and the product dossier; those two reflexes are recorded, not defects.
