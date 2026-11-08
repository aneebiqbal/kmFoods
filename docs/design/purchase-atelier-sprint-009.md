# The Purchase Atelier — sprint 009

The sprint record: the audit, the purchase system, the basket ledger, the
delivery folio, the order note, the order record, the security correction and
the evidence. The locked system is `design.md`; the homepage remains the
design authority.

## A. Purchase journey audit

| # | Finding | Severity |
| --- | --- | --- |
| 1 | The cart was a plain list: 56px thumbnails, no line total, no pack clarity, no Urdu name | High |
| 2 | The cart summary showed "Delivery Rs 0" and a total equal to the subtotal — a misleading zero-delivery fee | High (brief forbids it) |
| 3 | The quantity control was a tiny `− 2 +` with a permanent "Update" text button | Medium |
| 4 | The empty cart was a bare well with one button | Medium |
| 5 | The checkout was a single well of inputs; no section hierarchy, no ruled groups, no editorial headings | High |
| 6 | The checkout showed "Delivery Rs 0" and a total that implied free delivery | High |
| 7 | No inline validation; the first signal was a single alert after submit | Medium |
| 8 | The success state was a bare well; when WhatsApp was unconfigured it showed the wrong message ("area not serviceable") | High |
| 9 | No copy-reference, no copy-order-note, no retry, no next-steps | Medium |
| 10 | The order status was a plain well; no status indicator, no next action, no support pathway | Medium |
| 11 | The order lookup was public, unthrottled and keyed on a short sequential reference | High (security) |
| 12 | Cart product links were broken: `product_handle` was never requested from Medusa, so every link pointed at `/product/` | High (pre-existing) |
| 13 | Cart lines carried no Urdu name; the catalogue has one for every product | Low |

## B. The purchase visual system

The customer's basket becomes an ingredient ledger, then a delivery folio,
then a numbered order note. Every screen shares one grammar:

- **Ruled rows, not cards.** The ledger and the record are separated by hairlines
  on the parchment ground. The only raised surface is the order summary and the
  order note, where a `.well` is justified.
- **Numbered references.** The ledger rows are numbered `01`, `02`, `03`; the
  folio sections are `01`, `02`; the order-note steps are `01`, `02`, `03`. The
  reference itself is set large in tabular figures.
- **One signal.** Oxide red is reserved for the single primary action on each
  screen. Everything else is ink, rule and parchment.
- **Honest money.** Delivery is never shown as `Rs 0`. When the charge is not
  yet approved it reads "Confirmed on WhatsApp"; the total is the subtotal with
  the note "Delivery is added after WhatsApp confirmation."
- **Restrained motion.** Colour steps on hover, a 44px stepper, a pill that
  fills on copy. No animation on money, no decorative delay on a real action.

## C. The basket ledger

`apps/storefront/src/app/cart/page.tsx` + `src/components/cart.tsx`

- A numbered ledger: `01` numeral, an 80px visual (64px on a phone), the
  product name with its Urdu name beneath, the pack, the unit price, the real
  Medusa stock level, a 44px quantity stepper, the line total and a remove
  action.
- The stepper submits on change and disables while a mutation is in flight, so
  two taps cannot race. A failed mutation leaves an inline error on the row.
- The order summary is a `.well`, sticky on desktop from `lg:top-28`. It shows
  the subtotal, the delivery state ("Confirmed on WhatsApp"), the total and the
  single checkout action.
- The empty cart is an original composition, **The shelf is ready.**: a line
  drawing of a shelf of jars, a scoop and a plant, the explanation, the help
  line, the catalogue action and up to four category chips. No shopping-bag
  cliché.
- A stale cookie (a completed or expired cart) renders the same composition
  with the "Your cart is no longer available" message instead of the waiting
  message.

## D. The delivery folio

`apps/storefront/src/app/checkout/page.tsx` + `src/components/checkout-form.tsx`

- The page opens with a compact header (headline, one sentence) and then the
  folio: **01 Delivery details** (name, phone, city, area, address, delivery
  notes) and **02 Contact** (email). Each section is a ruled group with an
  editorial heading.
- The city is a select of the serviceable cities; the area is a text field with
  a datalist of that city's areas. The backend's city-wide default still applies
  when the area is blank.
- Validation is inline and pure (`src/lib/checkout-validation.ts`): required
  fields, a real Pakistani mobile number, a malformed email, and an area the
  backend will not service. The first invalid field is focused on submit. The
  server re-validates everything; the client never decides.
- Duplicate submission is prevented by the pending state; the button reads
  "Creating your order..." while the request runs.
- The summary beside the folio repeats the items, the pack sizes, the subtotal
  and the honest delivery state.

## E. The order note

The principal conversion moment, rendered in place after the order is created.

- The reference is set huge (`KM-000058`) with a **Copy reference** pill.
- The purchased lines are snapshotted from the cart before it is cleared, so
  the note never loses its items.
- The status is a pill: **Pending confirmation**. The word "confirmed" is never
  used for a pending order.
- The actions: **Send order on WhatsApp** (the real `wa.me` link built from the
  server's message), **Copy order note**, **Retry opening WhatsApp**, and
  **View order status**.
- When WhatsApp is not configured the CTA is replaced by a clear
  "WhatsApp ordering is not configured yet" message and the copy-note action
  remains, so the customer can still send the order by hand.
- Three numbered next steps: copy the reference, send the note, we confirm.

The WhatsApp message itself is unchanged in substance: reference, items,
subtotal, name, phone, delivery area, address, optional notes, and the request
to confirm availability, delivery charges and the final total.

## F. The order record and security

`apps/storefront/src/app/order/[reference]/page.tsx`

- A composed record: the reference set large, a status pill, the items, the
  product subtotal, the payment state ("To be confirmed on WhatsApp"), the
  created date, the next action and a support pathway.
- No logistics events, no delivery estimates, no payment capture. The payment
  status is displayed as awaiting, never as paid.
- The lookup page is a ruled form with the reference field and a clear
  not-found state that offers the support pathway.

**Security correction.** The reference lookup
(`GET /store/whatsapp-handoff/:reference`) was public and unthrottled. A short
sequential reference (`KM-000001`…) let anyone enumerate orders. The response
already exposed no customer details — no name, phone or address — but the
enumeration itself was open. The route now shares the existing Redis-backed
rate limiter at 60 requests per minute per IP, generous enough for a customer
checking their own order. `src/api/middlewares.ts`.

**Data correction.** `product_handle` was never requested from Medusa, so every
cart line linked to `/product/`. It is now requested explicitly and the cart map
prefers it over the nested relation. Verified: `/product/red-chili-crushed`.

**New data.** Cart lines now carry the product id and the Urdu name. The cart
page resolves the Urdu names from the catalogue (`getUrduNames`) so the ledger
shows `لال مرچ دادڑ` beneath `Red Chili Crushed`.

## G. The shared component system

`apps/storefront/src/components/purchase.tsx`

One grammar across the three surfaces: `QuantityStepper`, `CopyButton`,
`StatusPill`, `SummaryRow`, `FieldError`, `FolioSection` and `EmptyShelf`.
Every control has a label, a focus state, a pending state and an error state.
The stepper is 44px at the touch points; the copy button confirms with a pill
fill; the status pill is text only — no decorative dots.

## H. Motion

Colour steps on hover, a 0.98 press scale on buttons, a 44px stepper with a
disabled state while a mutation runs, a copy confirmation, and a shelf that
breathes on hover. All CSS, all transform/opacity, all reduced-motion safe.
No animation touches money.

## I. Mobile and Urdu

Tested at 320, 360, 375, 390, 430, 768, 1024, 1440 and 1920. The ledger
restacks to a two-row grid on a phone: the title and line total on the first
row, the stepper and remove on the second. The folio collapses to a single
column with the summary below. The order note and the record reflow to one
column. Urdu mirrors the ledger, the folio, the note and the record in
Nastaliq/Naskh with the correct RTL direction; the reference and phone numbers
stay in tabular Latin figures.

## J. Screenshots

`.hallmark/shots/s9-*.png`: the cart at 1440 and 390, the empty cart, the cart
drawer, the checkout at 1440 and 390, the order note, the order record at 1440
and 390, the order lookup, the Urdu cart and the Urdu checkout. The before state
is in `s9-before-*.png`. The dev server moved to port 3100 during the sprint
because another local project took port 3000; every screenshot and sweep in this
record was verified against the KM Foods app by its document title.

## K. Tests

| Suite | Result |
| --- | --- |
| Storefront unit | 47 pass |
| Shared unit | 44 pass |
| Backend unit | 4 pass |
| ESLint (storefront) | 0 warnings / 0 errors |
| ESLint (backend, changed files) | 0 errors |
| Typecheck | pass |
| Production build | pass |

New coverage: checkout validation (required fields, phone, email, serviceable
area, Urdu messages), the cart map (Urdu name, product handle), the WhatsApp
message (delivery notes), and the backend's WhatsApp configuration (missing,
blank, invalid, valid). The end-to-end journey was driven in a real browser:
add to cart → ledger → checkout → submit → order note → order record, with the
delivery notes verified inside the prepared WhatsApp message.

**Backend note.** The shared package is consumed by Medusa through its built
`dist/`, so a change to `packages/shared/src` needs `npm run build` in that
package before the backend sees it. The local `medusa develop` watcher did not
rebuild `.medusa` on its own during this sprint; the backend was rebuilt and
restarted to load the workflow and validator changes.

## L. Hallmark sweeps

| Gate | Result |
| --- | --- |
| Static | 0 FAIL · 0 REFLEX · 0 WARN |
| Render `/cart` | 0 FAIL · 2 REFLEX (44c, 79) · 1 WARN (77) |
| Render `/checkout` | 0 FAIL · 2 REFLEX (44c, 79) · 1 WARN (77) |
| Render `/order` | 0 FAIL · 2 REFLEX (44c, 79) · 1 WARN (77) |
| Render `/order/KM-000058` | 0 FAIL · 2 REFLEX (44c, 79) · 1 WARN (77) |

The 44c/79 reflexes are recorded, not waived: they measure a landing-page hero
against a transactional page whose header is deliberately compact so the form
sits high. The empty-shelf illustration is waived on the record (gate 80) — the
brief explicitly asks for an ingredient-inspired vector illustration.

## M. Known issues

- **The image generator was unavailable**, so the empty shelf is a line drawing
  and the product photography remains the seven verified library photographs.
- **The WhatsApp number is configured in the backend.** The storefront renders
  the real `wa.me` link when it is set and a clear not-configured message when
  it is not. The owner must still approve the number.
- **The delivery charge is unapproved.** Every surface shows "Confirmed on
  WhatsApp" rather than a fee, and the total is the subtotal.
- **The production Medusa backend is still local.** The storefront degrades to
  a designed unavailable state when it cannot be reached.
- The GitHub token in `.git/config` still needs revoking (never printed).

## N. Production readiness

Not production-ready while the Medusa backend is local. No localhost dependency
was added to the production build. The owner must still approve the WhatsApp
number, the delivery policy and charges, the return/privacy/terms content, and
the product photography.

## O. Acceptance matrix

| Gate | Status |
| --- | --- |
| Cart is premium and functional | PASS |
| Checkout is clear and usable | PASS |
| WhatsApp handoff is accurate | PASS |
| Order status is secure | PASS (rate-limited; no PII) |
| Purchase components consistent | PASS |
| Mobile polished | PASS |
| English and Urdu work | PASS |
| Loading, error and empty states | PASS |
| Existing commerce logic correct | PASS (Medusa totals untouched) |
| Tests and builds pass | PASS |
| Hallmark sweeps run | PASS (0 FAIL) |
| Browser screenshots reviewed | PASS |
| Major defects | none known |
