import fs from "node:fs";
import path from "node:path";
import {
  createInventoryLevelsWorkflow,
  createProductCategoriesWorkflow,
  createProductOptionsWorkflow,
  createProductsWorkflow,
  updateProductsWorkflow,
} from "@medusajs/medusa/core-flows";
import {
  ContainerRegistrationKeys,
  MedusaError,
  ProductStatus,
} from "@medusajs/framework/utils";
import type { ExecArgs } from "@medusajs/framework/types";
import { slugify, type CatalogRow } from "@kmfoods/shared";
import { parseCsv } from "../lib/catalog-csv";

/**
 * Imports the normalized price-list CSV into Medusa products and variants.
 *
 *   cd apps/backend && npx medusa exec ./src/scripts/import-catalog.ts
 *
 * Idempotent: products are matched by handle and variants by SKU, so running it
 * twice updates in place instead of duplicating. Rows with no published price
 * become draft products, never published with an invented price.
 */

const DEFAULT_CSV_PATH = "../../../../data/catalog/kmfoods-catalog.csv";
const PACK_OPTION_TITLE = "Pack Size";
const PACK_SIZES = ["100g", "1kg"] as const;
const INITIAL_STOCK = 100000;

type CatalogRecord = {
  sr_no: number;
  name_en: string;
  name_ur: string;
  category: string;
  price_100g_pkr: number | null;
  price_1kg_pkr: number | null;
  status: string;
  source_file: string;
  source_page: number;
  source_row: number;
};

function readCatalog(filePath: string): CatalogRecord[] {
  const text = fs.readFileSync(filePath, "utf8");
  const [header, ...lines] = parseCsv(text).filter((row) => row.length > 1);
  if (!header) throw new MedusaError(MedusaError.Types.INVALID_DATA, "Empty catalog CSV");

  const index = (name: string) => header.indexOf(name);
  const required = [
    "sr_no",
    "name_en",
    "name_ur",
    "category",
    "price_100g_pkr",
    "price_1kg_pkr",
    "status",
  ];
  for (const column of required) {
    if (index(column) === -1) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        `Catalog CSV is missing the "${column}" column`
      );
    }
  }

  return lines.map((line) => {
    const number = (value: string | undefined) =>
      value === undefined || value.trim() === "" ? null : Number(value.trim());

    return {
      sr_no: Number(line[index("sr_no")]),
      name_en: (line[index("name_en")] ?? "").trim(),
      name_ur: (line[index("name_ur")] ?? "").trim(),
      category: (line[index("category")] ?? "").trim(),
      price_100g_pkr: number(line[index("price_100g_pkr")]),
      price_1kg_pkr: number(line[index("price_1kg_pkr")]),
      status: (line[index("status")] ?? "draft").trim(),
      source_file: (line[index("source_file")] ?? "").trim(),
      source_page: Number(line[index("source_page")] ?? 1),
      source_row: Number(line[index("source_row")] ?? 1),
    };
  });
}

function skuFor(sr_no: number, packSize: string): string {
  return `KM-${String(sr_no).padStart(3, "0")}-${packSize.replace("g", "G").replace("k", "K")}`;
}

function toSharedRow(record: CatalogRecord): CatalogRow {
  return {
    sr_no: record.sr_no,
    name_en: record.name_en,
    name_ur: record.name_ur,
    category: record.category,
    price_100g_pkr: record.price_100g_pkr,
    price_1kg_pkr: record.price_1kg_pkr,
    status: record.status === "published" ? "published" : "draft",
    source_file: record.source_file,
    source_page: record.source_page,
    source_row: record.source_row,
  };
}

export default async function importCatalog({ container }: ExecArgs) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER);
  const query = container.resolve(ContainerRegistrationKeys.QUERY);

  const csvPath = path.resolve(
    process.cwd(),
    process.env.CATALOG_CSV_PATH ?? DEFAULT_CSV_PATH
  );

  if (!fs.existsSync(csvPath)) {
    throw new MedusaError(
      MedusaError.Types.NOT_FOUND,
      `Catalog CSV not found at ${csvPath}. Run "npm run extract:pdf" from the repository root first.`
    );
  }

  const records = readCatalog(csvPath);
  logger.info(`Importing ${records.length} catalog rows from ${csvPath}`);

  // ---- Prerequisites -------------------------------------------------------
  const { data: options } = await query.graph({
    entity: "product_option",
    fields: ["id", "title"],
  });
  let packSizeOption: { id: string; title: string } | undefined = options.find(
    (option) => option.title === PACK_OPTION_TITLE
  );
  if (!packSizeOption) {
    const { result } = await createProductOptionsWorkflow(container).run({
      input: {
        product_options: [{ title: PACK_OPTION_TITLE, values: [...PACK_SIZES] }],
      },
    });
    packSizeOption = result[0];
    logger.info(`Created the "${PACK_OPTION_TITLE}" option`);
  }

  if (!packSizeOption) {
    throw new MedusaError(
      MedusaError.Types.UNEXPECTED_STATE,
      `The "${PACK_OPTION_TITLE}" option could not be created.`
    );
  }

  const { data: categories } = await query.graph({
    entity: "product_category",
    fields: ["id", "handle", "name"],
  });
  const categoryIdByHandle = new Map(categories.map((c) => [c.handle, c.id]));

  const missingCategories = [
    ...new Set(records.map((record) => record.category)),
  ].filter((handle) => !categoryIdByHandle.has(handle));

  if (missingCategories.length) {
    await createProductCategoriesWorkflow(container).run({
      input: {
        product_categories: missingCategories.map((handle) => ({
          name: handle,
          handle,
          is_active: true,
        })),
      },
    });
    const { data: refreshed } = await query.graph({
      entity: "product_category",
      fields: ["id", "handle"],
    });
    for (const category of refreshed) categoryIdByHandle.set(category.handle, category.id);
    logger.info(`Created ${missingCategories.length} missing categor(ies)`);
  }

  const { data: stockLocations } = await query.graph({
    entity: "stock_location",
    fields: ["id"],
  });
  const stockLocation = stockLocations[0];
  if (!stockLocation) {
    throw new MedusaError(
      MedusaError.Types.NOT_FOUND,
      "No stock location found. Run medusa db:migrate first."
    );
  }

  const { data: shippingProfiles } = await query.graph({
    entity: "shipping_profile",
    fields: ["id"],
  });
  const shippingProfile = shippingProfiles[0];
  if (!shippingProfile) {
    throw new MedusaError(
      MedusaError.Types.NOT_FOUND,
      "No shipping profile found. Run medusa db:migrate first."
    );
  }

  // ---- Existing products ---------------------------------------------------
  const { data: existingProducts } = await query.graph({
    entity: "product",
    fields: ["id", "handle", "variants.id", "variants.sku"],
  });
  const productByHandle = new Map(existingProducts.map((p) => [p.handle, p]));

  let created = 0;
  let updated = 0;
  let skipped = 0;
  const errors: Array<{ sr_no: number; name_en: string; message: string }> = [];

  for (const record of records) {
    const row = toSharedRow(record);
    const handle = slugify(row.name_en);
    const categoryId = categoryIdByHandle.get(row.category);

    const variants = PACK_SIZES.flatMap((packSize) => {
      const price = packSize === "100g" ? row.price_100g_pkr : row.price_1kg_pkr;
      if (price === null) return [];
      return [
        {
          title: packSize,
          sku: skuFor(row.sr_no, packSize),
          options: { [PACK_OPTION_TITLE]: packSize },
          prices: [{ amount: price, currency_code: "pkr" }],
        },
      ];
    });

    const payload = {
      title: row.name_en,
      description: `${row.name_en} — premium quality, delivered across Lahore.`,
      status:
        row.status === "published" ? ProductStatus.PUBLISHED : ProductStatus.DRAFT,
      shipping_profile_id: shippingProfile.id,
      category_ids: categoryId ? [categoryId] : [],
      metadata: {
        sr_no: row.sr_no,
        name_ur: row.name_ur,
        category: row.category,
        source_file: row.source_file,
        source_page: row.source_page,
        source_row: row.source_row,
      },
      options: [{ id: packSizeOption!.id }],
      variants,
    };

    const existing = productByHandle.get(handle);

    if (!existing) {
      if (variants.length === 0) {
        // A draft product with no priced variant is still created so the owner
        // can add a price in the admin, but it is never published.
        logger.info(`Created draft product "${row.name_en}" (no price published)`);
      }
      await createProductsWorkflow(container).run({
        input: { products: [{ ...payload, handle }] },
      });
      created++;
      continue;
    }

    // Match existing variants by SKU so an update never duplicates a pack size.
    const existingVariantsBySku = new Map(
      (existing.variants ?? []).map((variant) => [variant.sku, variant])
    );
    const mergedVariants = variants.map((variant) => {
      const existingVariant = existingVariantsBySku.get(variant.sku!);
      return existingVariant ? { ...variant, id: existingVariant.id } : variant;
    });

    await updateProductsWorkflow(container).run({
      input: {
        products: [
          {
            id: existing.id,
            ...payload,
            variants: mergedVariants,
          },
        ],
      },
    });
    updated++;
  }

  // ---- Inventory -----------------------------------------------------------
  const { data: inventoryItems } = await query.graph({
    entity: "inventory_item",
    fields: ["id"],
  });
  const { data: existingLevels } = await query.graph({
    entity: "inventory_level",
    fields: ["id", "inventory_item_id"],
  });
  const levelKey = new Set(
    existingLevels.map((level) => `${level.inventory_item_id}`)
  );

  const missingLevels = inventoryItems
    .filter((item) => !levelKey.has(item.id))
    .map((item) => ({
      location_id: stockLocation.id,
      inventory_item_id: item.id,
      stocked_quantity: INITIAL_STOCK,
    }));

  if (missingLevels.length) {
    await createInventoryLevelsWorkflow(container).run({
      input: { inventory_levels: missingLevels },
    });
  }

  if (skipped > 0) logger.info(`Skipped ${skipped} row(s)`);

  logger.info(
    `Catalog import complete: ${created} created, ${updated} updated, ${errors.length} error(s).`
  );
  if (errors.length) {
    for (const error of errors) {
      logger.error(`  - ${error.name_en} (row ${error.sr_no}): ${error.message}`);
    }
    throw new MedusaError(
      MedusaError.Types.INVALID_DATA,
      `Catalog import finished with ${errors.length} error(s). See the log.`
    );
  }
}
