# WhatsApp order flow

WhatsApp is the primary conversion channel. This document describes exactly what
happens, and what does not.

## The customer journey

1. Browse the catalogue and open a product.
2. Choose a pack size (`100g` or `1kg`) and a quantity.
3. Add it to the cart. The cart id is stored in an `httpOnly` cookie.
4. Open the cart, adjust quantities, continue shopping.
5. Open checkout and enter name, phone, city, area and address.
6. Submit. The storefront creates a pending order and shows a reference.
7. Tap **Send order on WhatsApp** — a `wa.me` link opens WhatsApp with the
   message pre-filled.
8. The customer sends the message.
9. KM Foods staff confirm availability and the delivery charge.

## What the message contains

```text
Hello KM Foods,

I would like to place an order.

Order Reference: KM-000003

Items:
Red Chili Powder x 2

Product Subtotal: Rs. 160

Name: Customer Name
Phone: +923211234567
Delivery Area: Lahore - DHA
Address: House 1, Street 2, DHA Phase 5

Please confirm availability,
delivery charges and final total.
```

Prices come from Medusa, never from the browser.

## What "pending" means

| State | Meaning |
| --- | --- |
| `whatsapp_handoff.status = pending` | The order exists in Medusa but KM Foods has not confirmed it |
| `order.payment_status = awaiting` | No payment was authorized for capture; no money moved |
| `whatsapp.configured = false` | No WhatsApp number is configured, so no link is produced |

The storefront never marks a handoff as confirmed, and never captures a payment.
Both actions belong to KM Foods staff in the admin.

## Duplicate and abandoned orders

- `completeCartWorkflow` is idempotent per cart. Repeating it returns the same
  order rather than creating another.
- The handoff table has unique constraints on `order_id`, `cart_id` and
  `reference`, and the workflow returns the existing handoff for a cart.
- A retried checkout therefore returns the same reference instead of a new one.
- An abandoned cart is simply never completed. No order is created until the
  customer submits the checkout form.

## Configuration

`WHATSAPP_BUSINESS_NUMBER` must be the owner-approved business number in
international form (`923211234567`). The number printed in the price-list PDF is
**not** used anywhere in the code.

If the variable is empty the checkout still creates the pending order and
reference, but the storefront reports `whatsapp.configured: false` and shows no
link. This prevents a message being sent to a number that was never approved.

## Future official WhatsApp Business Platform

The handoff entity is the seam. Swapping the `wa.me` link for a Cloud API call
means changing one service: build the same message, send it through the official
API, and keep the same `pending` status until a webhook confirms it. No other
part of the system needs to change.
