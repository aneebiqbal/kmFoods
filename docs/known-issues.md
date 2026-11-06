# Known issues and limitations

Everything here is real and present in the code. None of it is hidden.

## Data and catalogue

1. **12 products have no price.** The source price list leaves the price blank
   for Kachri Powder, Brown Sugar, Gur, Lemon Grass, Munakka, Sundh, Licorice
   Root, Kaju fry, White Kaju, Pistachio, Anjeer and Walnut Giri. They are
   imported as draft products and are invisible in the shop. Publishing them
   requires a price from the owner.
2. **Category assignment is a rule of thumb.** Categories are derived from the
   English product name. Some may be wrong for the owner's merchandising; they
   can be changed per product in Medusa Admin.
3. **No product images.** The cards use a designed colour treatment. Upload real
   photography in the admin to replace it.
4. **"Best sellers" is not sales data.** The home page currently shows the first
   published products. There is no order history to rank by yet.
5. **Urdu names are stored in `metadata`.** Editing them in the admin means
   editing metadata, not a localized field.

## Checkout and ordering

6. **Delivery fees are not charged.** Both the shipping option and the delivery
   area rows default to `0`. The WhatsApp message asks staff to confirm the
   charge. The owner must configure fees when they are decided.
7. **Orders stay `payment_status = awaiting`.** No payment is captured online.
   Staff must capture payment in the admin when the order is fulfilled, or the
   order remains unpaid in Medusa's records.
8. **Abandoned carts are never cleaned up.** Completed carts and abandoned carts
   accumulate in PostgreSQL. There is no retention job.
9. **The rate limiter is per-instance and in memory.** It resets on restart and
   does not share state between backend instances. Upgrade to Redis before
   running more than one instance.
10. **Guest emails are synthetic.** `guest-<cart_id>@kmfoods.local` is written on
    orders where the customer gave no email address.
11. **No online payment provider.** Only the system provider (authorize without
    capture) is configured.

## Storefront

12. **Search is server-side and case-insensitive but basic.** It uses Medusa's
    `q` filter; there is no typo tolerance or faceted search in the storefront.
13. **Sorting happens in the browser.** With 78 products this is fine; with
    thousands it should move to the server.
14. **The storefront port defaults to 3000.** If another service occupies it,
    start with `PORT=3001 npm run dev`.
15. **Policy pages are drafts.** Delivery, returns, privacy and terms are
    placeholders pending owner approval, and the footer says so.
16. **No contact form.** Only WhatsApp is offered, because no mail service is
    configured.

## Backend and infrastructure

17. **Local development uses the in-memory event bus and lock.** Medusa logs a
    warning. Use Redis for anything beyond a single local instance.
18. **Medusa's search index fills on application start.** Immediately after a
    fresh `db:migrate`, product events can log "no active version yet" until the
    app has booted once. Starting the backend clears it.
19. **`next/font/google` needs network access at build time.** A fully offline
    build requires self-hosted font files.
20. **No automated dependency vulnerability gate in CI yet.** Run `npm audit`
    before launch.

## Security

21. **The publishable API key is public by design.** It only grants store access.
22. **Admin routes rely on Medusa's authentication.** RBAC policies are only
    enforced when the RBAC module is enabled; the custom admin routes are
    guarded by authentication, not by fine-grained permissions.
23. **Logs should be reviewed before production.** Medusa's logger is structured,
    but no log-scrubbing policy for customer data has been applied beyond not
    logging request bodies.

## Testing

24. **Admin tests skip without credentials.** Set `E2E_ADMIN_EMAIL` and
    `E2E_ADMIN_PASSWORD` to run them.
25. **No load testing or Lighthouse measurement.** Performance claims are not
    made anywhere in this repository.
