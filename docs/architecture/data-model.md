# Data model

KM Foods uses Medusa's native commerce models wherever possible. Only two custom
entities are added.

## Medusa-native entities (used as-is)

| Entity | Table | Notes |
| --- | --- | --- |
| `Product` | `product` | `title` is the English name; `metadata.name_ur` holds the Urdu name |
| `ProductVariant` | `product_variant` | One row per pack size; `sku` is `KM-###-100G` / `KM-###-1KG` |
| `ProductOption` | `product_option` | Shared option titled `Pack Size` with values `100g`, `1kg` |
| `ProductCategory` | `product_category` | One row per catalogue category, handle equals the catalogue slug |
| `Price` / `PriceSet` | `price`, `price_set` | PKR amounts, whole rupees (PKR has zero decimal digits in Medusa's currency table) |
| `Region` | `region` | `Pakistan`, currency `pkr`, country `pk` |
| `Cart` / `LineItem` | `cart`, `cart_line_item` | Persistent carts, id stored in an `httpOnly` cookie |
| `Order` / `OrderItem` | `order`, `order_item` | Real orders created by `completeCartWorkflow` |
| `PaymentCollection` / `PaymentSession` | `payment_collection`, `payment_session` | Provider `pp_system_default`, status `authorized`, never captured |
| `InventoryItem` / `InventoryLevel` | `inventory_item`, `inventory_level` | Stock per variant per location |
| `SalesChannel` / `ApiKey` | `sales_channel`, `api_key` | `Pakistan Store` + a publishable key for the storefront |

## Custom entities

### `delivery_area`

| Column | Type | Notes |
| --- | --- | --- |
| `id` | text, PK, prefix `dlva` | |
| `city` | text | e.g. `Lahore` |
| `area_name` | text | Empty string means "any area in this city" |
| `serviceable` | boolean | Whether KM Foods delivers there |
| `fee_pkr` | integer | Defaults to `0`; the final charge is confirmed on WhatsApp |
| `metadata` | jsonb, nullable | |
| `created_at` / `updated_at` / `deleted_at` | timestamptz | |

Seeded with a serviceable city-wide Lahore row and a non-serviceable Karachi row.
Managed through `GET/POST/PATCH/DELETE /admin/delivery-areas` (authenticated).

### `whatsapp_handoff`

| Column | Type | Notes |
| --- | --- | --- |
| `id` | text, PK, prefix `whho` | |
| `order_id` | text, unique | The Medusa order this handoff belongs to |
| `cart_id` | text, unique | The cart that produced it — makes the workflow idempotent |
| `reference` | text, unique | Customer-facing `KM-000001` (from the order's `display_id`) |
| `status` | enum | `pending` or `confirmed` |
| `message` | text | The exact WhatsApp message body |
| `customer_name` | text | |
| `customer_phone` | text | Normalized `+92...` |
| `delivery_city` | text | |
| `delivery_area` | text, nullable | |
| `delivery_address` | text | |
| `metadata` | jsonb, nullable | |
| `created_at` / `updated_at` / `deleted_at` | timestamptz | |

`status` stays `pending` until a member of KM Foods confirms it in the admin.

## Catalog provenance

Every product carries the source row in `metadata`:

```json
{
  "name_ur": "لال مرچ پاؤڈر",
  "category": "chilies-peppers",
  "source_file": "kmfoods-price-list.pdf",
  "source_page": 1,
  "source_row": 2
}
```

## Lifecycle

```text
cart  ──completeCartWorkflow──►  order (payment_status = awaiting)
                                     │
                                     └──► whatsapp_handoff (status = pending)
                                                     │
                                        admin confirms│
                                                     ▼
                                          status = confirmed
```

Orders are never auto-confirmed. Payment is never auto-captured.
