# Product catalogue

## Source

`data/catalog/kmfoods-price-list.pdf` — the client's price list, dated
`09/29/2026`. It contains 78 products in a two-column table, each with an
English name, an Urdu name, a 100g price and a 1kg price. A dash means the price
was not published.

The document also states:

- "Price list is subject to change based on market place"
- "Mouse cut replace is not allowed"

## Normalized data

`npm run extract:pdf` produces:

| File | Purpose |
| --- | --- |
| `data/catalog/kmfoods-catalog.csv` | The normalized catalogue, the import input |
| `data/catalog/kmfoods-catalog.json` | The same rows as JSON |
| `data/catalog/kmfoods-catalog-report.json` | Import report: totals, warnings, errors |

### CSV columns

```text
sr_no,name_en,name_ur,category,price_100g_pkr,price_1kg_pkr,status,source_file,source_page,source_row
```

- `name_en` / `name_ur` are preserved exactly as printed.
- Prices are whole Pakistani Rupees. An empty price means "not published".
- `status` is `published` when at least one price exists, otherwise `draft`.

## Current import result

| Metric | Value |
| --- | --- |
| Rows extracted | 78 |
| Published products | 66 |
| Draft products (no price) | 12 |
| Rows rejected | 0 |

The 12 draft products are all dry fruits, nuts or sweeteners whose prices were
left blank in the source: Kachri Powder, Brown Sugar, Gur, Lemon Grass, Munakka,
Sundh, Licorice Root, Kaju fry, White Kaju, Pistachio, Anjeer, Walnut Giri.

## Categories

| Handle | English | Urdu |
| --- | --- | --- |
| `chilies-peppers` | Chilies & Peppers | مرچ اور کالی مرچ |
| `whole-spices` | Whole Spices | ثابت مصالحہ |
| `ground-spices` | Ground Spices & Powders | پاؤڈر مصالحہ |
| `seeds` | Seeds | بیج |
| `dry-fruits-nuts` | Dry Fruits & Nuts | خشک میوہ جات اور مغزات |
| `herbs-seasonings` | Herbs & Seasonings | جڑی بوٹیاں اور مسالہ جات |
| `sweeteners` | Sweeteners | میٹھائی |
| `cooking-essentials` | Cooking Essentials | کھانے کی ضروری چیزیں |

Categories are assigned from the English name by an ordered rule set in
`packages/shared/src/catalog.ts`. The rules are a convenience, not a business
decision — the owner can re-categorize any product in Medusa Admin.

## Variants

Every product has one variant per published pack size:

| Pack | SKU pattern |
| --- | --- |
| 100g | `KM-###-100G` |
| 1kg | `KM-###-1KG` |

`###` is the source row number, zero-padded.

## Import behaviour

`npm run import:catalog` (or `npx medusa exec ./src/scripts/import-catalog.ts`):

1. Validates the CSV has the required columns.
2. Ensures the shared `Pack Size` option and any missing categories exist.
3. Matches products by `handle` (derived from the English name) and variants by
   `sku`.
4. Creates new products, updates existing ones in place.
5. Assigns the default shipping profile.
6. Creates inventory levels for any variant that lacks them.

Re-running it is safe: it updates rather than duplicates.

Rows missing an English or Urdu name are rejected and reported. Rows with no
price at all become draft products, never published ones with an invented price.

## Export

`npm run export:catalog` writes `data/catalog/kmfoods-export.csv` using the same
column shape, so admin edits can be diffed against the source list.

## Images

No approved product photography exists yet. Product cards use a designed
category colour treatment, and the catalogue has no image URLs. Upload real
images in Medusa Admin to replace the treatment.
