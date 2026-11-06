/**
 * Extracts the KM Foods price list PDF into a normalized CSV + JSON catalog.
 *
 *   npm run extract:pdf -- path/to/price-list.pdf
 *
 * The source document is a two-column table: a bare serial-number line is
 * followed by the product line for that serial. Product lines carry the
 * English name, the Urdu name, then the 100g and 1kg prices; a dash means the
 * price was not published.
 */
import fs from "node:fs";
import path from "node:path";
import pdf from "pdf-parse";
import {
  classifyCategory,
  normalizeCatalogRow,
  parsePriceToken,
  splitName,
  type CatalogRow,
  type ImportIssue,
  type ImportReport,
} from "../../packages/shared/src/index.ts";

const PRICE_TOKEN = /(\d+|[-]+)/;

function parseProductLine(line: string): {
  rawName: string;
  price100g: number | null;
  price1kg: number | null;
} | null {
  const match = line.match(`^(.*?)\\s+${PRICE_TOKEN.source}(?:\\s+${PRICE_TOKEN.source})?\\s*$`);
  if (!match) return null;
  const rawName = (match[1] ?? "").trim();
  const price100g = parsePriceToken(match[2]);
  const price1kg = parsePriceToken(match[3]);
  if (!rawName) return null;
  return { rawName, price100g, price1kg };
}

function escapeCsv(value: string | number | null): string {
  const text = value === null ? "" : String(value);
  if (/[",\n]/.test(text)) return `"${text.replace(/"/g, '""')}"`;
  return text;
}

function toCsv(rows: CatalogRow[]): string {
  const header = [
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
  ];
  const lines = rows.map((row) =>
    [
      row.sr_no,
      escapeCsv(row.name_en),
      escapeCsv(row.name_ur),
      row.category,
      row.price_100g_pkr,
      row.price_1kg_pkr,
      row.status,
      row.source_file,
      row.source_page,
      row.source_row,
    ].join(","),
  );
  return [header.join(","), ...lines].join("\n") + "\n";
}

async function main() {
  const input = process.argv[2] ?? "data/catalog/kmfoods-price-list.pdf";
  const outputFile = process.argv[3] ?? "data/catalog/kmfoods-catalog.csv";
  const jsonOutput = outputFile.replace(/\.csv$/, ".json");

  if (!fs.existsSync(input)) {
    console.error(`PDF not found: ${input}`);
    console.error("Usage: npm run extract:pdf -- path/to/price-list.pdf [out.csv]");
    process.exit(1);
  }

  const buffer = fs.readFileSync(input);
  const { text, numpages } = await pdf(buffer);
  const sourceFile = path.basename(input);

  const rows: CatalogRow[] = [];
  const errors: ImportIssue[] = [];
  const warnings: ImportIssue[] = [];
  let pendingSr: number | null = null;

  for (const rawLine of text.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line) continue;

    const serial = line.match(/^(\d+)\s*$/);
    if (serial) {
      pendingSr = Number(serial[1]);
      continue;
    }
    if (pendingSr === null) continue;

    const parsed = parseProductLine(line);
    if (!parsed) {
      pendingSr = null;
      continue;
    }

    const { name_en, name_ur } = splitName(parsed.rawName);
    try {
      const row = normalizeCatalogRow(
        {
          sr_no: pendingSr,
          name_en,
          name_ur,
          price_100g_pkr: parsed.price100g,
          price_1kg_pkr: parsed.price1kg,
        },
        { source_file: sourceFile, source_page: 1, source_row: pendingSr },
      );
      rows.push(row);
      if (row.status === "draft") {
        warnings.push({
          sr_no: row.sr_no,
          name_en: row.name_en,
          severity: "warning",
          message: "No published price; imported as draft.",
        });
      }
    } catch (error) {
      errors.push({
        sr_no: pendingSr,
        name_en: name_en || line,
        severity: "error",
        message: error instanceof Error ? error.message : String(error),
      });
    }

    pendingSr = null;
  }

  rows.sort((a, b) => a.sr_no - b.sr_no);

  fs.mkdirSync(path.dirname(outputFile), { recursive: true });
  fs.writeFileSync(outputFile, toCsv(rows));
  fs.writeFileSync(jsonOutput, `${JSON.stringify(rows, null, 2)}\n`);

  const report: ImportReport = {
    total_rows: rows.length + errors.length,
    imported: rows.length,
    skipped: errors.length,
    errors,
    warnings,
    generated_at: new Date().toISOString(),
  };
  fs.writeFileSync(
    outputFile.replace(/\.csv$/, "-report.json"),
    `${JSON.stringify(report, null, 2)}\n`,
  );

  const byCategory = rows.reduce<Record<string, number>>((acc, row) => {
    acc[row.category] = (acc[row.category] ?? 0) + 1;
    return acc;
  }, {});

  console.log(`Extracted ${rows.length} rows from ${sourceFile} (${numpages} page(s)).`);
  console.log(`  published: ${rows.filter((r) => r.status === "published").length}`);
  console.log(`  draft:     ${rows.filter((r) => r.status === "draft").length}`);
  console.log(`  errors:    ${errors.length}`);
  console.log("  categories:", byCategory);
  console.log(`  wrote ${outputFile}`);
  console.log(`  wrote ${jsonOutput}`);
  console.log(`  wrote ${outputFile.replace(/\.csv$/, "-report.json")}`);

  if (errors.length > 0) {
    console.error("\nRows that could not be normalized:");
    for (const issue of errors) console.error(`  - ${issue.name_en}: ${issue.message}`);
    process.exitCode = 1;
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
