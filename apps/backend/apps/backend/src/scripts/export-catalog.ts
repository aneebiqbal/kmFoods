import fs from "node:fs";
import path from "node:path";
import { ContainerRegistrationKeys } from "@medusajs/framework/utils";
import type { ExecArgs } from "@medusajs/framework/types";
import { toCsv } from "../lib/catalog-csv";

/**
 * Exports Medusa products and variants back to the catalog CSV shape.
 *
 *   cd apps/backend && npx medusa exec ./src/scripts/export-catalog.ts
 *
 * Useful for reviewing edits made in the admin against the source price list.
 */
export default async function exportCatalog({ container }: ExecArgs) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER);
  const query = container.resolve(ContainerRegistrationKeys.QUERY);

  const { data: products } = await query.graph({
    entity: "product",
    fields: [
      "id",
      "handle",
      "title",
      "status",
      "metadata",
      "variants.id",
      "variants.title",
      "variants.sku",
      "variants.prices.amount",
      "variants.prices.currency_code",
    ],
    filters: { handle: { $like: "%" } },
    limit: 1000,
  } as never);

  const rows: Array<Array<string | number | null>> = [
    [
      "sr_no",
      "name_en",
      "name_ur",
      "category",
      "price_100g_pkr",
      "price_1kg_pkr",
      "status",
      "source_file",
      "source_page",
      "source_row",
    ],
  ];

  for (const product of products as Array<Record<string, unknown>>) {
    const metadata = (product.metadata ?? {}) as Record<string, unknown>;
    const srNo = Number(metadata.sr_no ?? metadata.source_row ?? 0);
    const variants = (product.variants ?? []) as Array<
      Record<string, unknown> & {
        prices?: Array<{ amount?: number | null; currency_code?: string }>;
      }
    >;

    const priceFor = (title: string): number | null => {
      const variant = variants.find((candidate) => candidate.title === title);
      const price = variant?.prices?.find(
        (entry) => (entry.currency_code ?? "").toLowerCase() === "pkr"
      );
      return price ? Number(price.amount) : null;
    };

    rows.push([
      srNo || null,
      String(product.title ?? ""),
      typeof metadata.name_ur === "string" ? metadata.name_ur : "",
      typeof metadata.category === "string" ? metadata.category : "",
      priceFor("100g"),
      priceFor("1kg"),
      String(product.status ?? ""),
      typeof metadata.source_file === "string" ? metadata.source_file : "",
      Number(metadata.source_page ?? 1),
      Number(metadata.source_row ?? 1),
    ]);
  }

  const outputPath = path.resolve(
    process.cwd(),
    process.env.CATALOG_EXPORT_PATH ?? "../../../../data/catalog/kmfoods-export.csv"
  );
  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, toCsv(rows));

  logger.info(`Exported ${products.length} product(s) to ${outputPath}`);
}
