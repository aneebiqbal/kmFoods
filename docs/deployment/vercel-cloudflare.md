# Vercel + Cloudflare deployment

This guide covers deploying the **storefront to Vercel** with **Cloudflare**
managing `kmfoods.store`, and the **Medusa backend on separate hosting**.

Nothing here invents hosting credentials, DNS targets or live URLs. Every value
marked `<like-this>` is yours to choose and is not a real endpoint.

---

## 1. Architecture

```text
Cloudflare DNS (kmfoods.store)
   ├── kmfoods.store            → Vercel (Next.js storefront)
   └── <api-subdomain>          → Medusa host (backend + admin)

Vercel storefront  ──HTTPS──►  Medusa backend  ──►  PostgreSQL
                                      │
                                      └──►  Redis
```

The storefront never talks to PostgreSQL or Redis. It only calls Medusa's public
Store API with a publishable key.

---

## 2. Order of operations

1. Provision PostgreSQL and Redis.
2. Deploy Medusa and confirm the admin and Store API respond.
3. Create a publishable API key in Medusa Admin.
4. Configure Cloudflare DNS.
5. Create the Vercel project and set its environment variables.
6. Deploy.

Doing it in this order means the storefront is never configured against a
backend that does not exist yet.

---

## 3. Medusa backend (separate host)

Any Node host works: Railway, Render, Fly, a VPS, or Medusa Cloud. It needs
Node 22+ and network access to PostgreSQL and Redis.

### Environment variables

Set these in the host's dashboard. Never commit them.

| Variable | Required | Notes |
| --- | --- | --- |
| `DATABASE_URL` | yes | `postgresql://user:pass@host:5432/kmfoods` |
| `JWT_SECRET` | yes | `openssl rand -hex 32` |
| `COOKIE_SECRET` | yes | `openssl rand -hex 32` |
| `REDIS_URL` | recommended | `redis://:pass@host:6379` |
| `STORE_CORS` | yes | The storefront origin, e.g. `https://kmfoods.store` |
| `ADMIN_CORS` | yes | The Medusa Admin origin you will actually use |
| `AUTH_CORS` | yes | Same origin(s) as `STORE_CORS` |
| `WHATSAPP_BUSINESS_NUMBER` | for checkout | Owner-approved number, e.g. `923211234567` |
| `CART_RETENTION_DAYS` | no | `0` (default) disables abandoned-cart cleanup |

`STORE_CORS` must be the **exact** storefront origin, including the scheme. If
you serve the storefront at both `https://kmfoods.store` and
`https://www.kmfoods.store`, list both comma-separated. A wrong value produces
CORS failures that look like network errors.

`ADMIN_CORS` must include the origin where you open Medusa Admin. If you serve
the admin from the Medusa host's own domain, use that origin. Do **not** put a
Vercel preview URL here permanently; add preview origins explicitly when you
need them.

### Migrations and seed

```bash
cd apps/backend/apps/backend
npx medusa db:migrate
npx medusa exec ./src/scripts/import-catalog.ts
npx medusa exec ./src/scripts/seed-delivery-areas.ts
npx medusa user -e <your-email> -p '<a-strong-password>'
```

Then start the process with `npx medusa start` (your host's start command).

### Verify the backend before deploying the storefront

```bash
curl -s -o /dev/null -w "%{http_code}\n" https://<api-subdomain>/health
# expect 200
```

```bash
curl -s https://<api-subdomain>/store/regions | head -c 200
# expect JSON with your region
```

If these fail, fix the backend before touching Vercel.

---

## 4. Publishable API key

1. Open Medusa Admin.
2. Go to **Settings → Publishable API Keys**.
3. Create a key and note its `pk_...` token.
4. Put it in Vercel as `NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY`.

The publishable key grants **store access only**. Never put an admin token,
`DATABASE_URL`, or the WhatsApp number in a `NEXT_PUBLIC_` variable — anything
with that prefix is shipped to the browser.

---

## 5. Cloudflare DNS

Cloudflare must be your domain's nameserver before these records work.

1. In Cloudflare, open **Websites → kmfoods.store → DNS → Records**.
2. Add the backend record:

   | Type | Name | Target | Proxy |
   | --- | --- | --- | --- |
   | CNAME | `<api-subdomain>` | your Medusa host's hostname | DNS only (grey cloud) |

   Use **DNS only** for the API. Proxying API traffic through Cloudflare adds a
   second layer of caching and TLS that you do not want on cart and checkout
   calls.

3. Add the storefront record once Vercel gives you its target (step 6). Vercel
   shows either a `cname.vercel-dns.com` target or two A records; enter exactly
   what it shows.

### TLS

- Set **SSL/TLS → Overview → Encryption mode** to **Full (strict)** for the
  storefront, with Vercel's certificate on the edge.
- For the API (DNS-only), the origin must present a valid certificate for
  `<api-subdomain>`.

### Always use HTTPS

Enable **SSL/TLS → Edge Certificates → Always Use HTTPS** and a
**Bulk Redirect** rule from `http://*` to `https://*`.

---

## 6. Vercel project

### Root directory

Set **Root Directory** to `.` (the repository root), **not** `apps/storefront`.

Reason: `apps/storefront` depends on `packages/shared` through a `file:`
dependency. Vercel only checks out files inside the root directory, so a root of
`apps/storefront` would not contain `packages/shared`.

### Commands

| Setting | Value |
| --- | --- |
| Install Command | `npm install` |
| Build Command | `npm run build:shared && npm run build -w apps/storefront` |
| Output Directory | `apps/storefront/.next` (or leave default with root `.`) |
| Node.js Version | `22.x` |

`npm run build:shared` compiles `packages/shared` before the storefront build.
Skipping it makes the build fail on the shared types.

### Environment variables

Set these in **Project → Settings → Environment Variables** for Production (and
again for Preview if you use preview deployments).

| Variable | Example | Notes |
| --- | --- | --- |
| `NEXT_PUBLIC_MEDUSA_BACKEND_URL` | `https://<api-subdomain>` | Public Medusa URL. **Never localhost.** |
| `NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY` | `pk_...` | From step 4 |
| `NEXT_PUBLIC_SITE_URL` | `https://kmfoods.store` | Canonical origin for metadata and the sitemap |
| `PORT` | `3000` | Optional; Vercel overrides this |

Vercel only exposes `NEXT_PUBLIC_*` variables to the browser, which is what the
publishable-key pattern requires.

### Build-time behaviour

The storefront does **not** call Medusa during the build. Product, cart and
checkout pages are server-rendered on demand, and the sitemap degrades to static
routes if the backend is unreachable:

```text
[next.config] NEXT_PUBLIC_MEDUSA_BACKEND_URL is not set.
  The storefront will not be able to reach Medusa. Set it to the public
  backend URL, e.g. https://api.kmfoods.store
```

If you see that warning in a Production build, the variable is missing. The build
still succeeds, but every page will fail at runtime — fix it before announcing
the site.

### Ignored build warnings

Vercel prints `npm warn install-scripts 1 package has install scripts not yet
covered by allowScripts`. This is informational; no action is needed.

---

## 7. Verification after deploy

```bash
# Storefront shell
curl -s -o /dev/null -w "home %{http_code}\n" https://kmfoods.store/
curl -s -o /dev/null -w "shop %{http_code}\n" https://kmfoods.store/shop
curl -s -o /dev/null -w "product %{http_code}\n" https://kmfoods.store/product/red-chili-powder

# Canonical + metadata
curl -s https://kmfoods.store/ | grep -o 'rel="canonical"[^>]*'
curl -s https://kmfoods.store/opengraph-image | file -
# expect: PNG image data

# Sitemap contains product URLs
curl -s https://kmfoods.store/sitemap.xml | grep -c "/product/"

# Backend reachability from the public internet
curl -s -o /dev/null -w "health %{http_code}\n" https://<api-subdomain>/health
```

Then run the end-to-end suite against production:

```bash
cd apps/storefront
E2E_BASE_URL=https://kmfoods.store \
E2E_BACKEND_URL=https://<api-subdomain> \
E2E_ADMIN_EMAIL=<your-email> \
E2E_ADMIN_PASSWORD='<your-password>' \
npx playwright test
```

### Manual smoke test

1. Open the storefront, switch to Urdu, confirm the layout flips to RTL.
2. Add a product to the cart, open the drawer, continue to checkout.
3. Submit the order. A `KM-000001` reference appears and a `wa.me` link opens.
4. Open Medusa Admin → **WhatsApp Orders** and confirm the handoff is listed as
   `pending`.
5. Confirm it. The status changes to `confirmed`.
6. Open the order status page with the reference and confirm it shows
   `confirmed`.

Opening WhatsApp must never mark the order confirmed on its own.

---

## 8. Rollback

### Vercel

Every deployment is immutable and kept. To roll back:

- Dashboard: **Deployments → select the previous deployment → Promote to
  Production**.
- CLI: `vercel rollback` (prompts for the target), or
  `vercel promote <deployment-id>`.

Rollback is instant and does not rebuild. Environment variables are **not**
reverted by a rollback — if the cause was a bad variable, fix the variable
first, then roll back.

### Backend

- Restore the PostgreSQL backup taken before the deploy.
- Redeploy the previous backend commit (`npx medusa start` again).
- Never re-run `medusa db:migrate` backwards unless you intend to; use
  `npx medusa db:rollback` only with a verified backup.

### DNS

If the storefront stops resolving, check the Cloudflare record still points at
Vercel and that proxy status was not changed. Changing a record back is
instant but cached by browsers and resolvers for up to the TTL.

---

## 9. Deployment blockers

These must be resolved before the site can take real orders:

| Blocker | Owner action |
| --- | --- |
| WhatsApp business number | Set `WHATSAPP_BUSINESS_NUMBER` in the backend |
| Delivery areas and fees | Configure in Medusa Admin → Delivery Areas |
| Policy pages | Approve the draft content |
| Product photography | Upload in Medusa Admin |
| `NEXT_PUBLIC_MEDUSA_BACKEND_URL` | Set it to the real backend URL in Vercel |
| Medusa Admin origin | Put the real admin origin in `ADMIN_CORS` |

---

## 10. Do not do

- Do not set `NEXT_PUBLIC_MEDUSA_BACKEND_URL` to `localhost` in Production. The
  build warns and the runtime fails.
- Do not put `DATABASE_URL`, `JWT_SECRET`, `COOKIE_SECRET` or the WhatsApp number
  in a `NEXT_PUBLIC_` variable.
- Do not serve the storefront from the Medusa host's port 9000.
- Do not point Cloudflare's orange cloud at the Medusa API.
