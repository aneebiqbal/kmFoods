# Local development setup

A new engineer should be able to go from a clone to a seeded storefront with the
steps below.

## 1. Prerequisites

- Node.js 22.23 or newer (`node -v`)
- npm 11 (`npm -v`)
- PostgreSQL 15+ running locally
- Redis 6+ (optional — Medusa falls back to in-memory and warns)

Check the ports are free: PostgreSQL `5432`, Redis `6379`, Medusa `9000`,
storefront `3000`.

## 2. Install dependencies

```bash
npm install
npm run build:shared
cd apps/backend && npm install
```

## 3. Configure the backend

```bash
cp apps/backend/apps/backend/.env.template apps/backend/apps/backend/.env
```

Edit `.env`:

- `DATABASE_URL` — e.g. `postgresql://user:pass@localhost:5432/kmfoods`
- `JWT_SECRET` and `COOKIE_SECRET` — `openssl rand -hex 32`
- `WHATSAPP_BUSINESS_NUMBER` — the owner-approved number, e.g. `923211234567`
- `STORE_CORS`, `ADMIN_CORS`, `AUTH_CORS` — must include `http://localhost:3000`

## 4. Create and migrate the database

```bash
cd apps/backend/apps/backend
npx medusa db:create
npx medusa db:migrate
```

`db:migrate` runs the core migrations, the module migrations and the
`initial-data-seed` migration script, which creates:

- the `Pakistan` region with the `pkr` currency,
- the `Pakistan Store` sales channel and a publishable API key,
- the `Lahore Warehouse` stock location and fulfilment set,
- the `Lahore Delivery` shipping option (fee `0`),
- the catalogue's product categories and the shared `Pack Size` option.

## 5. Load the catalogue

```bash
npx medusa exec ./src/scripts/import-catalog.ts
npx medusa exec ./src/scripts/seed-delivery-areas.ts
```

The importer is idempotent: products are matched by `handle` and variants by
`sku`, so re-running it updates in place. Rows with no published price become
draft products and never appear in the shop.

## 6. Create an admin user

```bash
npx medusa user -e admin@example.com -p 'a-strong-password'
```

Store the credentials somewhere safe. They are not in the repository.

## 7. Configure the storefront

```bash
cd apps/storefront
cp .env.example .env.local
```

Set:

- `NEXT_PUBLIC_MEDUSA_BACKEND_URL=http://localhost:9000`
- `NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY` — the `pk_...` token from
  `select token from api_key where type = 'publishable'` (or from Medusa Admin
  under Settings → API Keys)

## 8. Run both apps

```bash
cd apps/backend && npm run dev        # http://localhost:9000, admin at /app
cd apps/storefront && npm run dev     # http://localhost:3000
```

Open http://localhost:3000. Log in to the admin at http://localhost:9000/app.

## Stopping

`Ctrl+C` in each terminal. Data stays in PostgreSQL, so re-running
`npm run dev` picks up where you left off.

## Troubleshooting

| Symptom | Cause | Fix |
| --- | --- | --- |
| `EADDRINUSE :::3000` | Another app uses port 3000 | `PORT=3001 npm run dev` |
| `No "exports" main defined in @kmfoods/shared` | Shared package not built | `npm run build:shared` |
| `Catalog CSV not found` | Wrong path or PDF not extracted | Run `npm run extract:pdf` from the repo root |
| `Payment sessions are required to complete cart` | Checkout called without a payment session | Use `POST /store/whatsapp-handoff`; it creates the session |
| `The cart items require shipping profiles...` | Product has no shipping profile | Re-run `npm run import:catalog` |
| `Search index "product" has no active version` | Search index not filled | Start the backend once; it fills the index on boot |
| Storefront shows no products | Missing publishable key | Check `NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY` |

## Resetting local data

```bash
psql -U <user> -d postgres -c "DROP DATABASE IF EXISTS kmfoods;" -c "CREATE DATABASE kmfoods;"
cd apps/backend/apps/backend && npx medusa db:migrate
npx medusa exec ./src/scripts/import-catalog.ts
```

This deletes all local products, carts and orders. Do not run it against a
database that holds real customer data.
