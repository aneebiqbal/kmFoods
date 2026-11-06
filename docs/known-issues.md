# Known issues and limitations

## Resolved across Phases 3–4

- Brand mark was a cream-background JPEG → replaced with an original transparent
  SVG, with light/dark variants.
- Product visuals were a flat gradient and a letter → replaced with an original
  category-coloured artwork system that uses real Medusa thumbnails when present.
- Shop category chips hid behind a horizontal scroll → they now wrap.
- No cart drawer, no sticky mobile purchase bar, no loading skeletons, no route
  error boundary → all added.
- Custom admin modules had no UI → Delivery Areas and WhatsApp Orders screens added.
- Rate limiting was per-process memory → Redis-backed with a memory fallback.
- Abandoned carts had no policy → opt-in retention job added.
- No request logging → privacy-safe logger added.
- No focus-visible style, skip link or reduced-motion handling → added.
- Language switch did not apply until reload → fixed.
- No canonical URLs or generated Open Graph image → added.
- The Vercel build failed prerendering `/sitemap.xml` → the sitemap now degrades
  safely without a backend.
- Overlays were clipped by the sticky header's `backdrop-blur` → they are
  portaled to `<body>`.
- The drawer served a cached empty cart → `no-store` on both the route and the
  fetch.
- The logo mirrored in RTL → the mark forces LTR.
- A large backlog of retired design tokens (`cream-*`, `earth-*`, `chili-*`,
  `leaf-*`, `gold-*`) remained in older pages → migrated.

## Still open

### Data and catalogue

1. **12 products have no price** and stay in draft. Publishing them needs a price.
2. **Category assignment is a rule of thumb** and can be changed per product.
3. **No product images** — the artwork is a placeholder, not a photograph.
4. **"Best sellers" is not sales data**; the home page shows the first published
   products.
5. **Urdu names live in `metadata`**, so editing them means editing metadata.

### Checkout and ordering

6. **Delivery fees are not charged online.** They stay `0` until the owner
   configures them.
7. **Orders stay `payment_status = awaiting`.** No payment is captured.
8. **Guest emails are synthetic** (`guest-<cart_id>@kmfoods.local`).
9. **No online payment provider.** Only the system provider is configured.
10. **The cart retention job is off by default.** Set `CART_RETENTION_DAYS`.

### Storefront

11. **Search is server-side and basic** — no typo tolerance or facets.
12. **Sorting happens in the browser.** Fine at 78 products.
13. **Policy pages are drafts** and the footer says so.
14. **No contact form** — WhatsApp only, because no mail service is configured.
15. **`next/font/google` needs network at build time.** Self-host for offline builds.
16. **The shop category rail is sticky.** On very short viewports it can cover a
    large share of the screen; it collapses with the page rather than floating
    over content.

### Backend and infrastructure

17. **Local development uses the in-memory event bus and lock.** Use Redis for
    more than one instance.
18. **The search index fills on application start.** A fresh migrate logs
    "no active version" until the app boots once.
19. **Admin routes are guarded by authentication, not fine-grained RBAC
    policies.** Any authenticated admin can manage delivery areas and handoffs.
20. **The local backend URL emits a warning on every call in development.** It is
    throttled to once per process.

### Security

21. **The publishable API key is public by design** and grants store access only.
22. **No log-scrubbing pipeline** beyond not logging bodies or headers.
23. **No dependency-vulnerability gate in CI yet.** Run `npm audit` before launch.
24. **The `origin` remote embeds a GitHub token in `.git/config`.** Revoke it and
    move to a credential helper.

### Testing

25. **Admin API tests skip without credentials.** Set `E2E_ADMIN_EMAIL` and
    `E2E_ADMIN_PASSWORD`.
26. **No Jest integration tests for the backend workflow.**
27. **No Lighthouse or load testing.** The performance numbers in
    `docs/implementation-status.md` are a browser performance-API sample.
28. **The CI workflow has never run on a runner.**
29. **Automated tests do not cover the new search overlay or the Pantry Shelf.**
