# KM Foods — Har Ghar Ka Zaiqa

A premium Pakistani spices, dry fruits, seeds and kitchen-essentials storefront
for a Lahore-based food business.

The storefront is WhatsApp-first: customers build a cart, share their delivery
details, and send an order summary to KM Foods over WhatsApp. Staff confirm
availability and the delivery charge before the order becomes real.

## Stack

| Layer | Technology |
| --- | --- |
| Storefront | Next.js 15 (App Router), React 19, TypeScript, Tailwind CSS 4 |
| Commerce | Medusa v2 (`@medusajs/medusa` 2.22), Medusa Admin |
| Database | PostgreSQL 15+ |
| Cache / queue | Redis (Medusa Redis connector) |
| Validation | Zod 4 |
| Tests | Vitest (unit), Playwright (end-to-end), Jest (backend integration) |

## Repository layout

```text
apps/
  backend/            # Medusa DTC monorepo (turbo + npm workspaces)
    apps/backend/     # the Medusa application (@dtc/backend)
  storefront/         # Next.js storefront (@kmfoods/storefront)
packages/
  shared/             # catalog schema, pricing, delivery, WhatsApp, i18n
data/
  catalog/            # source price-list PDF + normalized CSV/JSON
scripts/
  catalog/            # PDF extraction script
docs/                 # architecture, setup, API, deployment, testing
```

## Prerequisites

- Node.js 22.23+ (Medusa requires it; Node 20+ works for the storefront)
- npm 11+
- PostgreSQL 15+
- Redis 6+ (optional locally; Medusa falls back to in-memory with a warning)

## Quick start

```bash
# 1. Install
npm install
npm run build:shared
cd apps/backend && npm install

# 2. Configure the backend
cp apps/backend/apps/backend/.env.template apps/backend/apps/backend/.env
# edit .env: DATABASE_URL, JWT_SECRET, COOKIE_SECRET, WHATSAPP_BUSINESS_NUMBER

# 3. Create and migrate the database
cd apps/backend/apps/backend
npx medusa db:create          # if the database does not exist yet
npx medusa db:migrate         # migrations + initial Pakistan seed

# 4. Load the catalogue and delivery areas
npx medusa exec ./src/scripts/import-catalog.ts
npx medusa exec ./src/scripts/seed-delivery-areas.ts

# 5. Create an admin user
npx medusa user -e admin@example.com -p <a-strong-password>

# 6. Configure the storefront
cd ../../storefront
cp .env.example .env.local    # set NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY

# 7. Run both apps
cd ../backend && npm run dev          # http://localhost:9000 (admin at /app)
cd ../storefront && npm run dev       # http://localhost:3000
```

See [docs/setup/local-development.md](docs/setup/local-development.md) for the
full walkthrough and troubleshooting.

Deploying to Vercel with Cloudflare DNS? See
[docs/deployment/vercel-cloudflare.md](docs/deployment/vercel-cloudflare.md).

## Scripts

| Command | Purpose |
| --- | --- |
| `npm run extract:pdf` | Extract the price-list PDF into `data/catalog/kmfoods-catalog.csv` |
| `npm run import:catalog` | Import the CSV into Medusa products and variants |
| `npm run export:catalog` | Export Medusa products back to CSV |
| `npm run build` | Build the shared package and the storefront |
| `npm run test` | Unit tests (shared + storefront) |
| `npm run test:e2e` | Playwright end-to-end tests |
| `npm run lint` | ESLint for the storefront |
| `npm run typecheck` | TypeScript for the shared package and storefront |

## Status

This is a foundation, not a launched store. See
[docs/implementation-status.md](docs/implementation-status.md) for what is
complete, partial or blocked, and
[docs/known-issues.md](docs/known-issues.md) for the limitations a maintainer
must know about.

## Licences

- Application code: MIT
- Medusa framework: MIT
- Product names, prices and Urdu labels: supplied by KM Foods
