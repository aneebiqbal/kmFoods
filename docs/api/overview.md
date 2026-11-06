# API overview

Two APIs: Medusa's public Store API (used by the storefront) and Medusa's Admin
API (used by the dashboard and the custom admin routes).

## Storefront → Medusa

The storefront uses the official `@medusajs/js-sdk` with a publishable key. It
never uses an admin key.

| Purpose | Call |
| --- | --- |
| Default region | `GET /store/regions` |
| Categories | `GET /store/product-categories` |
| Product list | `GET /store/products?region_id=...&q=...&category_id=...` |
| Product by handle | `GET /store/products?region_id=...&handle=...` |
| Create cart | `POST /store/carts` |
| Add line item | `POST /store/carts/:id/line-items` |
| Update line item | `POST /store/carts/:id/line-items/:line_id` |
| Remove line item | `DELETE /store/carts/:id/line-items/:line_id` |
| Delivery config | `GET /store/delivery-config` |
| Place WhatsApp order | `POST /store/whatsapp-handoff` |
| Order status | `GET /store/whatsapp-handoff/:reference` |

### `GET /store/delivery-config`

```json
{
  "shipping_option_id": "so_...",
  "shipping_option_name": "Lahore Delivery",
  "fee_pkr": 0,
  "areas": [
    { "id": "dlva_...", "city": "Lahore", "area_name": "", "serviceable": true, "fee_pkr": 0 }
  ]
}
```

### `POST /store/whatsapp-handoff`

Request:

```json
{
  "cart_id": "cart_...",
  "delivery_option_id": "so_...",
  "customer_name": "Customer Name",
  "customer_phone": "0321 1234567",
  "delivery_city": "Lahore",
  "delivery_area": "DHA",
  "delivery_address": "House 1, Street 2",
  "customer_email": "optional@example.com"
}
```

Response:

```json
{
  "handoff": {
    "id": "whho_...",
    "reference": "KM-000001",
    "status": "pending",
    "order_id": "order_...",
    "message": "Hello KM Foods,\n\nI would like to place an order.\n...",
    "customer_name": "Customer Name",
    "customer_phone": "+923211234567",
    "delivery_city": "Lahore",
    "delivery_area": "DHA",
    "delivery_address": "House 1, Street 2"
  },
  "whatsapp": {
    "configured": true,
    "number": "+923211234567",
    "url": "https://wa.me/923211234567?text=..."
  }
}
```

`whatsapp.configured` is `false` and `url` is `null` until
`WHATSAPP_BUSINESS_NUMBER` is set.

Errors: `400` for an empty cart, an unserved area, an invalid phone number or a
missing delivery option; `404` for an unknown cart. The route is rate limited to
10 requests per minute per IP.

### `GET /store/whatsapp-handoff/:reference`

```json
{
  "reference": "KM-000001",
  "status": "pending",
  "order_id": "order_...",
  "created_at": "2026-01-01T00:00:00.000Z",
  "items": [{ "title": "Red Chili Powder", "quantity": 2, "unit_price": 80 }],
  "total": 160,
  "currency_code": "pkr"
}
```

Returns `404` for an unknown reference.

## Admin API (authenticated)

| Route | Purpose |
| --- | --- |
| `GET /admin/orders` | Orders, including pending WhatsApp orders |
| `GET /admin/products` · `POST /admin/products` · `PATCH /admin/products/:id` | Catalogue management |
| `GET /admin/whatsapp-handoffs` | List handoffs (`?status=pending`) |
| `PATCH /admin/whatsapp-handoffs/:id` | Set `status` to `pending` or `confirmed` |
| `GET /admin/delivery-areas` · `POST /admin/delivery-areas` | List and create delivery areas |
| `PATCH /admin/delivery-areas/:id` · `DELETE /admin/delivery-areas/:id` | Update and delete |

Admin routes require an authenticated Medusa user (session cookie or bearer
token). Unauthenticated requests receive `401`.
