# KM Foods — environment variables

## Backend (`apps/backend/apps/backend/.env`)

| Variable | Required | Default | Purpose |
| --- | --- | --- | --- |
| `DATABASE_URL` | yes | — | PostgreSQL connection string |
| `JWT_SECRET` | yes | — | Admin/auth token signing key |
| `COOKIE_SECRET` | yes | — | Cookie signing key |
| `AUTH_MFA_ENCRYPTION_KEY` | for MFA | — | Encryption key for MFA secrets |
| `REDIS_URL` | recommended | — | Redis connection string. Without it Medusa uses an in-memory bus and warns |
| `STORE_CORS` | yes | — | Comma-separated storefront origins |
| `ADMIN_CORS` | yes | — | Comma-separated admin origins |
| `AUTH_CORS` | yes | — | Comma-separated auth origins |
| `WHATSAPP_BUSINESS_NUMBER` | for checkout | — | Pakistani mobile in international form, e.g. `923211234567` |
| `CATALOG_CSV_PATH` | no | `../../../../data/catalog/kmfoods-catalog.csv` | CSV used by `import-catalog` |
| `CATALOG_EXPORT_PATH` | no | `../../../../data/catalog/kmfoods-export.csv` | CSV written by `export-catalog` |

`WHATSAPP_BUSINESS_NUMBER` must be supplied by the business owner. Until it is
set the checkout still creates the pending order, but returns
`whatsapp.configured: false` and no `wa.me` link, so no message can be sent to a
number taken from the price list.

## Storefront (`apps/storefront/.env.local`)

| Variable | Required | Default | Purpose |
| --- | --- | --- | --- |
| `NEXT_PUBLIC_MEDUSA_BACKEND_URL` | yes | `http://localhost:9000` | Medusa API base URL. **Never localhost in production** — see the Vercel guide |
| `NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY` | yes | — | Publishable API key from Medusa Admin → Settings → Publishable API Keys |
| `NEXT_PUBLIC_SITE_URL` | recommended | `http://localhost:3000` | Canonical origin, used for metadata and the sitemap |
| `PORT` | no | `3000` | Port the storefront listens on |
| `E2E_BASE_URL` | tests only | `http://localhost:3000` | Playwright base URL |

## Secrets

`.env` and `.env.local` are gitignored. Never commit them.

- Generate `JWT_SECRET` and `COOKIE_SECRET` with `openssl rand -hex 32`.
- The Medusa admin password is created with `medusa user` and is not stored in
  the repository.
- The WhatsApp number is configuration, not a secret, but it must come from the
  owner rather than the price list.

## Environments

| Environment | Database | Notes |
| --- | --- | --- |
| local | PostgreSQL on localhost | Docker Compose or a local install |
| test | a separate database | Used by integration and Playwright runs |
| staging | staging PostgreSQL | Seeded with a copy of the catalogue |
| production | production PostgreSQL | Requires real secrets and a confirmed WhatsApp number |

See [docs/deployment/staging.md](docs/deployment/staging.md) and
[docs/deployment/production.md](docs/deployment/production.md).
