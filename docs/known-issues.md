# Known issues and limitations

## Resolved in Phase 3

These were real problems and are now fixed:

- **Brand mark was a cream-background JPEG.** Replaced with an original
  transparent SVG at the correct aspect ratio.
- **Product visuals were a flat gradient with a letter.** Now an editorial
  treatment that carries the Urdu name, and it uses the real Medusa thumbnail
  when one exists.
- **Shop category chips were hidden behind a horizontal scroll.** They now wrap
  and are plain anchors, so they work without JavaScript and are crawlable.
- **No cart drawer, no sticky mobile purchase bar, no loading skeletons, no
  route error boundary.** All added.
- **No availability information.** `GET /store/stock` feeds an in-stock /
  out-of-stock state on the product page.
- **Custom modules had no admin UI.** Delivery areas and WhatsApp orders now
  have Medusa admin screens, verified in a browser.
- **Rate limiting was per-process memory.** Now Redis-backed with a memory
  fallback, and it returns `429` with rate-limit headers.
- **Abandoned carts accumulated with no policy.** A retention job exists and is
  disabled unless `CART_RETENTION_DAYS` is set.
- **Request logging did not exist.** Added a privacy-safe logger (no bodies, no
  headers).
- **No focus-visible style, no skip link, no reduced-motion handling.** Added.
- **Language switch did not apply until a manual reload.** Fixed.
- **No canonical URLs, no generated Open Graph image.** Added.

## Still open

### Data and catalogue

1. **12 products have no price** and are drafts. Publishing them needs a price
   from the owner.
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
10. **The cart retention job is off by default.** Set `CART_RETENTION_DAYS` to
    enable it.

### Storefront

11. **Search is server-side and basic** — no typo tolerance or facets.
12. **Sorting happens in the browser.** Fine at 78 products.
13. **Policy pages are drafts** and the footer says so.
14. **No contact form** — WhatsApp only, because no mail service is configured.
15. **`next/font/google` needs network at build time.** Self-host the fonts for
    fully offline builds.

### Backend and infrastructure

16. **Local development uses the in-memory event bus and lock.** Use Redis for
    more than one instance.
17. **The search index fills on application start.** A fresh migrate logs
    "no active version" until the app boots once.
18. **Admin routes are guarded by authentication, not fine-grained RBAC
    policies.** The custom routes ship without a `permissions` declaration, so
    any authenticated admin can manage delivery areas and handoffs.

### Security

19. **The publishable API key is public by design** and grants store access only.
20. **No log-scrubbing pipeline** beyond not logging bodies or headers.
21. **No dependency-vulnerability gate in CI yet.** Run `npm audit` before launch.

### Testing

22. **Admin API tests skip without credentials.** Set `E2E_ADMIN_EMAIL` and
    `E2E_ADMIN_PASSWORD`.
23. **No Jest integration tests for the backend workflow.**
24. **No Lighthouse or load testing.** The performance numbers in
    `docs/implementation-status.md` are a browser performance-API sample under
    documented local conditions.
25. **The CI workflow has never run on a runner.**
