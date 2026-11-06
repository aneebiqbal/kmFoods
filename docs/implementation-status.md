# Implementation status

Status after Phase 3 (UI/UX excellence and feature gap closure). "Verified"
means a test or a browser inspection was executed.

## Completed in Phase 3

| Area | Status | Evidence |
| --- | --- | --- |
| Brand mark replaced with an original transparent SVG | Done | Header/footer/policies render sharp at all sizes |
| Announcement bar | Done | Dismissible, localised, links to the delivery policy |
| Homepage hero with layered product composition | Done | Real catalogue data, desktop + mobile screenshots |
| Homepage brand story and 3-step ordering explainer | Done | Server-rendered, localised |
| Product artwork system | Done | Category-coloured editorial treatment with the Urdu name; real thumbnail used when Medusa has one |
| Shop category chips | Done | Plain anchors — work without JS and are crawlable |
| Cart drawer | Done | Opens from the header, server-side totals, keyboard dismissible |
| Mobile sticky purchase bar | Done | Verified in Playwright on a phone viewport |
| Stock availability endpoint + UI | Done | `GET /store/stock`, "In stock"/"Out of stock" on the product page |
| Admin UI: Delivery Areas | Done | `/app/delivery-areas` — list, create, edit, delete |
| Admin UI: WhatsApp Orders | Done | `/app/whatsapp-handoffs` — filter, search by reference, confirm, order link |
| Redis-backed rate limiting | Done | 10 requests/minute per IP; returns 429 after the limit; falls back to memory |
| Abandoned-cart retention job | Done | `CART_RETENTION_DAYS=0` disables it; only incomplete carts are removed |
| Privacy-safe request logging | Done | Method, path, status, duration — never bodies or headers |
| Loading skeletons | Done | `app/shop/loading.tsx`, `app/product/[slug]/loading.tsx` |
| Route error boundary | Done | `app/error.tsx` with retry and a shop link |
| Accessibility: focus-visible, skip link, reduced motion | Done | CSS in `globals.css`, skip link in the root layout |
| SEO: canonical URLs | Done | Home, shop (per category) and product pages |
| SEO: generated Open Graph image | Done | `app/opengraph-image.tsx` |
| Language switch applies immediately | Done | Full reload after setting the locale cookie (RSC refresh served a cached layout) |

## Test totals

| Suite | Count | Command |
| --- | --- | --- |
| Shared unit tests | 42 | `npm run test` |
| Storefront unit tests | 10 | `npm run test` |
| Playwright end-to-end | 39 passing, 3 mobile-only skips | `npx playwright test` |

## Measured performance (documented conditions)

Local production build (`next start`), Chromium, 390×844 viewport, **no network
throttling**, cold first load:

| Page | TTFB | LCP | CLS | JS transferred |
| --- | --- | --- | --- | --- |
| Home | 641 ms | 1732 ms | 0 | ~154 KB |
| Shop | 11 ms | 112 ms | 0 | ~152 KB |
| Product | 15 ms | 1360 ms | 0 | ~156 KB |

These are not Lighthouse scores and no Lighthouse claim is made. The shop and
product rows benefit from warm caches after the first navigation.

## Still partial

| Area | What is missing |
| --- | --- |
| Product photography | Still the original artwork; no client photos |
| Delivery fees | Still 0 and confirmed on WhatsApp |
| Backend Jest integration tests | Workflow verified through HTTP and Playwright, not Jest |
| Contact channel | WhatsApp only |
| Lighthouse / Core Web Vitals audit | Not run; the numbers above are a browser performance-API sample |
| Load testing | Not run |

## Blocked on the owner

Unchanged from earlier phases: WhatsApp business number, delivery charges,
policy page approval, product photography, best-seller selection.
