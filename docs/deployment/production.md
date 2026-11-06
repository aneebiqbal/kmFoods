# Production deployment

No production deployment has been performed for this project. This document is
the plan; it must be reviewed and completed with the owner before any real
customer traffic.

## Preconditions

- The owner has confirmed the WhatsApp business number.
- The owner has approved the delivery areas and any delivery charges.
- The owner has reviewed and approved the draft policy pages.
- Real product photography has been supplied, or the owner accepts the
  provisional colour treatment.
- A domain and TLS certificate are available.

## Infrastructure

| Component | Recommendation |
| --- | --- |
| Backend | Two or more Node.js instances behind a load balancer |
| Database | Managed PostgreSQL with daily backups and a recovery runbook |
| Redis | Managed Redis (required at more than one instance) |
| Storefront | Two or more Node.js instances, or a managed Next.js host |
| Object storage | S3-compatible bucket with a CDN in front |
| Media | Medusa's `file-s3` provider |
| Email | A transactional email provider, if order notifications are wanted |

The in-memory rate limiter and the local event bus are **not** suitable for
multiple instances. Before scaling past one backend, move the rate limit to Redis
and use the Redis event-bus connector.

## Environment

Every variable in `docs/setup/environment-variables.md` must be set. Generate
secrets with `openssl rand -hex 32`. Never commit `.env`.

## Migrations

```bash
cd apps/backend/apps/backend
DATABASE_URL=... npx medusa db:migrate
DATABASE_URL=... npx medusa exec ./src/scripts/import-catalog.ts
```

Run migrations during a deploy window. `db:migrate` is safe to re-run, but the
importer and the admin user creation are one-off steps.

## Backups and recovery

- Daily automated PostgreSQL backups with a retention policy.
- A tested restore procedure, run at least once before launch.
- Product images backed up separately if they are only in object storage.

## Observability

- Structured application logging (Medusa's built-in logger).
- Health checks on `GET /health` for both apps.
- Alerting on failed checkouts and on orders stuck in `pending` for too long.

## Security checklist

- [ ] `JWT_SECRET` and `COOKIE_SECRET` are unique and long.
- [ ] `WHATSAPP_BUSINESS_NUMBER` is the owner-approved number.
- [ ] Admin routes require authentication (verified by test).
- [ ] CORS lists only the production origins.
- [ ] No secrets in the repository or in container images.
- [ ] Product prices are read from Medusa, never trusted from the client.
- [ ] `robots.txt` allows indexing only when the site is ready.
- [ ] Dependencies reviewed for known vulnerabilities (`npm audit`).

## Launch sequence

1. Deploy the backend and run migrations.
2. Import the catalogue and confirm the product count.
3. Deploy the storefront.
4. Place a real test order through the storefront and confirm it appears in the
   admin with status `pending`.
5. Confirm the handoff in the admin and check the status page.
6. Enable indexing in `robots.txt`.
7. Monitor the first real orders closely.
