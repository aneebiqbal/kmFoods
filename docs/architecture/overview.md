# KM Foods — architecture overview

## What the system is

A WhatsApp-first storefront for a Lahore food business. Customers browse a real
Medusa catalogue, build a cart, and hand the order to KM Foods over WhatsApp.
Staff confirm the order in Medusa Admin; the storefront never marks an order as
paid or confirmed on its own.

## Components

```text
┌────────────────────────────┐        ┌──────────────────────────────┐
│  Storefront (Next.js 15)   │        │  Medusa backend (v2)         │
│  apps/storefront           │        │  apps/backend/apps/backend   │
│                            │        │                              │
│  App Router pages          │  HTTP  │  Store API                   │
│  Server components         │ ─────► │  Admin API                   │
│  Server actions (cart)     │  SDK   │  Custom modules:             │
│                            │        │   • deliveryArea             │
│  @kmfoods/shared           │        │   • whatsappHandoff          │
│  (catalog, pricing, i18n)  │        │  Workflow:                   │
│                            │        │   create-whatsapp-handoff    │
└────────────────────────────┘        └──────────────┬───────────────┘
                                                     │
                                        ┌────────────▼───────────────┐
                                        │  PostgreSQL  /  Redis      │
                                        └────────────────────────────┘
```

## Boundaries

| Boundary | Rule |
| --- | --- |
| Storefront → Medusa | Only the public Store API and the publishable API key. Never an admin key |
| Shared package | Pure functions and dictionaries. No Medusa imports, no Next imports |
| Medusa backend | Owns products, variants, prices, carts, orders, customers |
| Custom modules | Only what Medusa does not model: delivery areas and WhatsApp handoffs |
| Admin | Medusa Admin (built in) plus authenticated admin API routes for the custom modules |

## Request flow: placing an order

1. The customer adds a variant to the cart. A server action calls
   `POST /store/carts` and stores the cart id in an `httpOnly` cookie.
2. `POST /store/carts/:id/line-items` adds the line item.
3. At checkout the storefront posts to `POST /store/whatsapp-handoff` with the
   cart id and the delivery details.
4. The `create-whatsapp-handoff` workflow:
   - re-reads the cart from Medusa (never trusting client totals),
   - checks the delivery area against the `deliveryArea` module,
   - validates the Pakistani mobile number,
   - sets the cart email and shipping address,
   - adds the configured shipping option, refreshes tax lines,
   - creates the payment collection and a `pp_system_default` session,
   - completes the cart, which creates a real Medusa order with
     `payment_status = awaiting`,
   - writes a `whatsapp_handoff` row with reference `KM-000001` and the message.
5. The storefront shows the reference and a `wa.me` link. Opening WhatsApp is
   the customer's action; it does not confirm the order.
6. KM Foods staff see the order in Medusa Admin and the handoff in the custom
   admin route, then confirm it.

## Why the order is real but unpaid

Medusa's `completeCartWorkflow` requires a payment session. The built-in
`pp_system_default` provider authorizes a session without capturing anything, so
the order exists with `payment_status = awaiting`. No money moves. The business
confirms the order and the delivery charge over WhatsApp, and can capture
payment later in the admin.

## Idempotency

`completeCartWorkflow` is idempotent per cart: repeating it returns the same
order. The handoff table has unique constraints on `order_id`, `cart_id` and
`reference`, and the workflow returns an existing handoff for a cart instead of
creating a second one. A retried checkout therefore never creates a duplicate
order or a duplicate handoff.

## Localization

- UI strings live in `packages/shared/src/i18n.ts` (English + Urdu), selected by
  a cookie.
- Product names live in Medusa (`title` and `metadata.name_ur`).
- The root layout sets `<html lang dir>`; Urdu renders in Noto Nastaliq Urdu for
  headings and Noto Naskh Arabic for body text.
- Currency is PKR with zero decimal digits, matching Medusa's currency table.

## Data flow summary

| Data | Owner | Stored in |
| --- | --- | --- |
| Products, variants, prices | Medusa product/pricing modules | PostgreSQL |
| Categories | Medusa product module | PostgreSQL |
| Carts | Medusa cart module | PostgreSQL |
| Orders | Medusa order module | PostgreSQL |
| Payment sessions | Medusa payment module | PostgreSQL |
| Delivery areas | `deliveryArea` custom module | PostgreSQL |
| WhatsApp handoffs | `whatsappHandoff` custom module | PostgreSQL |
| Language choice | Storefront | Cookie |
| Cart identity | Storefront | `httpOnly` cookie |
