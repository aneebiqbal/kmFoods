# Technical decisions

Each decision below records what was chosen, why, and what it costs.

## 1. Medusa v2 DTC starter as the backend

**Decision.** Use the official Medusa DTC starter (`create-medusa-app`) as the
backend foundation rather than writing a custom commerce layer.

**Why.** The brief asks for Medusa's native product, variant, pricing, cart,
order and admin capabilities. Re-implementing them would duplicate working,
maintained code.

**Cost.** The starter ships a Turborepo layout and demo fashion data. The demo
seed and demo products were deleted; the initial data seed was replaced with a
Pakistan-specific one.

## 2. Custom storefront, not the starter's storefront

**Decision.** Build a storefront in `apps/storefront` instead of installing the
DTC starter's Next.js storefront.

**Why.** The starter storefront is a fashion storefront with account, wishlist
and product-option modules the brief does not need. A purpose-built storefront is
smaller and matches the WhatsApp-first flow exactly.

**Cost.** More code to maintain than reusing a starter, but far less than
carrying an unrelated feature set.

## 3. WhatsApp-first checkout as a Medusa workflow

**Decision.** `POST /store/whatsapp-handoff` runs a custom workflow that
completes the cart and writes a handoff row in one execution.

**Why.** Completing the cart and recording the handoff must be atomic. Splitting
them across HTTP calls from the browser would leave orders without references
when a later call failed.

**Cost.** A custom workflow to maintain. Mitigated by reusing Medusa's own
`updateCartWorkflow`, `addShippingMethodToCartWorkflow`,
`createPaymentCollectionForCartWorkflow`, `createPaymentSessionsWorkflow` and
`completeCartWorkflow`.

## 4. Real orders with an authorized, uncaptured payment

**Decision.** Use Medusa's `pp_system_default` payment provider. The order is
created with `payment_status = awaiting`; nothing is captured.

**Why.** Medusa requires a payment session to complete a cart. The system
provider authorizes without capturing, which is exactly the "pending handoff"
state. The order is real and visible in the admin.

**Cost.** A payment session exists for every order. Staff must capture payment
in the admin when the order is fulfilled, or the order stays `awaiting`.

**Rejected alternative.** Creating draft orders instead. Draft orders are
admin-only and would have hidden customer orders from the order list, which the
brief requires.

## 5. Urdu product names in `metadata`, not the translation module

**Decision.** Store `name_ur` in the product's `metadata`.

**Why.** It keeps the catalogue import simple and avoids depending on Medusa's
translation module configuration. The storefront reads one field.

**Cost.** Urdu names are not editable through Medusa's localized product UI; they
are edited via metadata or the catalogue import. Acceptable while the catalogue
is managed from the price list.

## 6. PKR as a zero-decimal currency

**Decision.** Store whole rupees, matching Medusa's currency table for PKR
(`decimal_digits: 0`).

**Why.** The source price list is in whole rupees. Using the currency table's
own definition keeps Medusa's price calculations and formatting consistent.

**Cost.** Paisa cannot be represented. If KM Foods ever prices in paisa, the
currency table must be updated and this constant changed.

## 7. Delivery areas and fees in a custom module, fee defaulting to 0

**Decision.** A `deliveryArea` custom module holds city/area rows. The shipping
option and the area rows both default to a fee of `0`.

**Why.** Delivery charges are a business decision the owner has not confirmed.
The WhatsApp message explicitly asks staff to confirm charges, so the checkout
must not invent a fee.

**Cost.** Delivery fees are not charged online. The owner must either confirm
them by WhatsApp or configure them in the admin.

## 8. Guest checkout with a derived email

**Decision.** Medusa requires an email on the cart. When the customer does not
give one, the storefront uses `guest-<cart_id>@kmfoods.local`.

**Why.** The brief asks for contact information (name, phone, address), not
email. The derived address keeps Medusa happy without inventing customer data.

**Cost.** Order emails are synthetic. Real email marketing is out of scope for
this milestone.

## 9. Rate limiting in memory

**Decision.** A fixed-window in-memory limiter on `POST /store/whatsapp-handoff`
(10 requests per minute per IP).

**Why.** The endpoint creates orders, so it is the one public write path that
needs protection.

**Cost.** It resets on restart and is per-instance, so it does not hold when
running multiple backend instances. Marked with a `shortcut:` comment in the
code; upgrade to Redis when scaling past one instance.

## 10. No contact form

**Decision.** The contact page shows WhatsApp as the channel and does not
include a form.

**Why.** The brief allows a contact placeholder "only if supported by real
functionality". There is no mail service configured, so a form would be a
placeholder that pretends to send.

**Cost.** Customers cannot send an email from the site. Acceptable while WhatsApp
is the primary channel.

## 11. Phase 3: plain anchors for category filtering

**Decision.** Category chips are `<a href="/shop?category=...">`, not Next `Link`
components.

**Why.** Inside a client component on a phone-sized viewport, the `Link` click
handed off to the client router and the URL never updated. A plain anchor works
with and without JavaScript, is crawlable, and removed the flakiness.

**Cost.** A full page load instead of a client-side transition for category
filtering. Acceptable for a catalogue page.

## 12. Phase 3: direct server-action calls instead of `useActionState`

**Decision.** Cart and checkout forms call the server action from a submit
handler and store the result in local state.

**Why.** With `useActionState`, the success message never appeared: the action
ran (the cart was created) but the returned state was lost when the layout
re-rendered. Calling the action directly applies the result immediately.

**Cost.** A little more boilerplate than `useActionState`.

## 13. Phase 3: artwork instead of placeholder boxes

**Decision.** Products without photography render an original category-coloured
treatment carrying the Urdu name; the real Medusa thumbnail is used when one
exists.

**Why.** No approved photography exists, and a flat gradient with a letter read
as unfinished. The treatment is clearly graphic, never a fake photograph.

**Cost.** It is still not product photography. The owner must supply real images
for the site to feel like a photograph-led food brand.

## 14. Phase 3: availability from a dedicated endpoint

**Decision.** `GET /store/stock?variants=...` reads inventory levels directly.

**Why.** Medusa's computed `variants.inventory_quantity` was `null` in the store
product response, so the storefront could not show availability without a second
source of truth.

**Cost.** One extra request on the product page.

