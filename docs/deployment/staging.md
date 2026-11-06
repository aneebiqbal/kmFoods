# Staging deployment

Staging mirrors production as closely as possible without touching real
customers.

## Infrastructure

| Component | Recommendation |
| --- | --- |
| Backend | A single Node.js process (or container) running `medusa start` |
| Database | Managed PostgreSQL, separate from production |
| Redis | Managed Redis, or the in-memory fallback for a small staging environment |
| Storefront | A Node.js process running `next start` |
| Object storage | An S3-compatible bucket for product images |
| Media | Medusa's `file-s3` provider |

## Build

```bash
npm install
npm run build:shared
cd apps/backend && npm install && npm run build
cd ../storefront && npm run build
```

## Database

```bash
cd apps/backend/apps/backend
DATABASE_URL=postgresql://... npx medusa db:migrate
DATABASE_URL=postgresql://... npx medusa exec ./src/scripts/import-catalog.ts
DATABASE_URL=postgresql://... npx medusa exec ./src/scripts/seed-delivery-areas.ts
npx medusa user -e admin@your-domain -p '...'
```

## Environment

Copy `.env.template` and set every value. Particular care:

- `JWT_SECRET`, `COOKIE_SECRET` — freshly generated, never reused from local.
- `STORE_CORS` / `ADMIN_CORS` / `AUTH_CORS` — the staging origin only.
- `WHATSAPP_BUSINESS_NUMBER` — use a staging/test number, not the production
  number, so test orders are not sent to real customers.

## Verification before opening staging

1. `GET /health` returns `200`.
2. The storefront home page shows products and prices.
3. A checkout creates a pending order and a handoff.
4. The admin shows the pending order.
5. `robots.txt` disallows indexing (staging should not be crawled).

## Rollback

Staging holds no real customer data, so rollback is a redeploy. Keep the previous
image tag and point the service back at it if a release misbehaves.
