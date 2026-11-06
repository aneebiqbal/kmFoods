# Test plan

## Levels

| Level | Framework | Location | What it covers |
| --- | --- | --- | --- |
| Unit | Vitest | `packages/shared/src/*.test.ts` | Catalog normalisation, prices, quantities, delivery eligibility, WhatsApp messages, phone numbers, i18n parity |
| Unit | Vitest | `apps/storefront/src/**/*.test.ts` | Storefront helpers (money, format) |
| Integration | Jest | `apps/backend/apps/backend/src/**/__tests__/**` | Backend modules and workflows |
| End-to-end | Playwright | `apps/storefront/e2e/**` | Critical customer journeys and admin visibility |

## Unit coverage

`packages/shared` currently has 42 tests:

- `catalog.test.ts` — category classification, price parsing, row normalisation,
  draft downgrade, slug generation, name splitting, schema round-trip.
- `money.test.ts` — PKR formatting and grouping, Pakistani phone normalization
  (local, international, `0092`), quantity validation, delivery eligibility.
- `whatsapp.test.ts` — message content, the "confirm charges" wording, URL
  construction, i18n parity between English and Urdu.

## End-to-end coverage

`apps/storefront/e2e/` runs against a live storefront and a live Medusa backend.
There are 30 tests: 14 catalogue, 8 checkout and 8 admin (the catalogue and
checkout suites run on both desktop Chromium and a mobile device).

### `catalog.spec.ts`

1. Homepage loads with real products and prices.
2. Shop lists database-backed products (66).
3. Category filter narrows the catalogue.
4. Search finds a product by name.
5. Empty search shows the empty state.
6. Product page shows variants, prices and an add-to-cart action.
7. Draft products are not published (404).

### `checkout.spec.ts`

1. Add a product, update quantity, reach checkout.
2. Checkout creates a pending order, a WhatsApp handoff and a status page —
   including assertions on the `wa.me` URL contents.
3. Invalid Pakistani phone numbers are rejected.
4. An empty cart shows an empty state on checkout.

### `admin.spec.ts`

Requires `E2E_ADMIN_EMAIL` and `E2E_ADMIN_PASSWORD`; it skips otherwise.

1. An authenticated admin sees pending orders and WhatsApp handoffs.
2. An admin can confirm a pending handoff.
3. Admin routes reject unauthenticated requests (`401`).
4. Delivery areas are configurable by an admin.

## Running the tests

```bash
# Unit
npm run test

# End-to-end (storefront and backend must be running)
cd apps/storefront
E2E_BASE_URL=http://localhost:3000 \
E2E_BACKEND_URL=http://localhost:9000 \
E2E_ADMIN_EMAIL=admin@example.com \
E2E_ADMIN_PASSWORD='...' \
npx playwright test
```

The Playwright config starts `npm run dev` automatically when no server is
already listening, and reuses an existing server locally.

## Test data

Automated tests never use real customer information. The checkout tests use the
fixture values in `e2e/checkout.spec.ts`:

```text
Name    Playwright Test
Phone   0321 1234567
City    Lahore
Area    DHA
Address House 1, Street 2, DHA Phase 5, Lahore
```

The `wa.me` link is inspected as a string. No WhatsApp message is ever sent.

## What is not covered

- Medusa Admin UI interactions (the admin is exercised through its API).
- Payment capture (no payment provider is configured).
- Real WhatsApp delivery (no official API integration yet).
- Load testing and Lighthouse measurement.
