import { z } from "zod";

/**
 * Canonical catalog row, normalized from the client's price-list document.
 * Prices are whole Pakistani Rupees (PKR) exactly as printed; `null` means the
 * source document did not publish a price and none may be invented.
 */
export const catalogRowSchema = z.object({
  sr_no: z.number().int().positive(),
  name_en: z.string().min(1),
  name_ur: z.string().min(1),
  category: z.string().min(1),
  price_100g_pkr: z.number().int().positive().nullable(),
  price_1kg_pkr: z.number().int().positive().nullable(),
  status: z.enum(["published", "draft"]),
  source_file: z.string().min(1),
  source_page: z.number().int().positive(),
  source_row: z.number().int().positive(),
});

export type CatalogRow = z.infer<typeof catalogRowSchema>;

export const CATEGORIES = [
  "chilies-peppers",
  "whole-spices",
  "ground-spices",
  "seeds",
  "dry-fruits-nuts",
  "herbs-seasonings",
  "sweeteners",
  "cooking-essentials",
] as const;

export type Category = (typeof CATEGORIES)[number];

export const CATEGORY_LABELS: Record<Category, { en: string; ur: string }> = {
  "chilies-peppers": { en: "Chilies & Peppers", ur: "مرچ اور کالی مرچ" },
  "whole-spices": { en: "Whole Spices", ur: "ثابت مصالحہ" },
  "ground-spices": { en: "Ground Spices & Powders", ur: "پاؤڈر مصالحہ" },
  seeds: { en: "Seeds", ur: "بیج" },
  "dry-fruits-nuts": { en: "Dry Fruits & Nuts", ur: "خشک میوہ جات اور مغزات" },
  "herbs-seasonings": { en: "Herbs & Seasonings", ur: "جڑی بوٹیاں اور مسالہ جات" },
  sweeteners: { en: "Sweeteners", ur: "میٹھائی" },
  "cooking-essentials": { en: "Cooking Essentials", ur: "کھانے کی ضروری چیزیں" },
};

/**
 * Short neutral functional descriptions for the category chapters. They state
 * what the shelf holds, never a sourcing, purity or certification claim.
 */
export const CATEGORY_DESCRIPTIONS: Record<Category, { en: string; ur: string }> = {
  "chilies-peppers": {
    en: "Dried and ground chilies, packed in 100g and 1kg.",
    ur: "خشک اور پسی مرچ، 100 گرام اور 1 کلو پیک میں۔",
  },
  "whole-spices": {
    en: "Whole spices for daal, sabzi and biryani.",
    ur: "دال، سبزی اور بریانی کے لیے ثابت مصالحہ۔",
  },
  "ground-spices": {
    en: "Ground spices and powders, priced per pack.",
    ur: "پاؤڈر مصالحہ، ہر پیک کی قیمت۔",
  },
  seeds: {
    en: "Seeds for everyday cooking and seasoning.",
    ur: "روزمرہ کے کھانے اور مسالہ جات کے لیے بیج۔",
  },
  "dry-fruits-nuts": {
    en: "Dry fruits and nuts for the pantry.",
    ur: "پینٹری کے لیے خشک میوہ جات اور مغزات۔",
  },
  "herbs-seasonings": {
    en: "Herbs and seasonings, packed by weight.",
    ur: "جڑی بوٹیاں اور مسالہ جات، وزن کے مطابق پیک۔",
  },
  sweeteners: {
    en: "Sweeteners for tea, desserts and cooking.",
    ur: "چائے، میٹھے اور کھانے کے لیے میٹھائی۔",
  },
  "cooking-essentials": {
    en: "Everyday cooking essentials.",
    ur: "روزمرہ کھانے کی ضروری چیزیں۔",
  },
};

const CATEGORY_RULES: ReadonlyArray<{ category: Category; pattern: RegExp }> = [
  { category: "chilies-peppers", pattern: /chili|chilli|pepper|mirch/i },
  { category: "dry-fruits-nuts", pattern: /almond|badam|kaju|cashew|pistachio|pista|anjeer|fig|munakka|grapes|plum|alu bukhara|coconut|khopra|walnut|akhrot|makhane|roasted gram|gram pulps|chickpea|channa|dates|chuhara|khajoor/i },
  { category: "sweeteners", pattern: /sugar|gur\b|jaggery|shakkar/i },
  { category: "cooking-essentials", pattern: /salt|alum|phitkari|metha soda|tragacanth|gond|color|rang|sago|sabudana|corn|makka|starch|vinegar/i },
  { category: "ground-spices", pattern: /powder|pauder|masala|mixture|turmeric|haldi|spice/i },
  { category: "seeds", pattern: /seed|sesame|til\b|flax|chia|pumpkin|nigella|kalonji|celery|ajwain|fennel|sonf|cumin|zeera|raie|poppy|khashkhash|tukh|malanga|dana\b|dane|beej/i },
  { category: "herbs-seasonings", pattern: /fenugreek|methi|lemon grass|husk|isabgol|tamarind|imli|licorice|mulethi|sundh|bay leaf|tez patta|rose|gule/i },
];

/**
 * Assigns a shop category from the English product name. Rules are ordered:
 * the first match wins, so specific families (chilies, nuts) are checked
 * before the generic "contains spice" fallback.
 */
export function classifyCategory(nameEn: string): Category {
  for (const rule of CATEGORY_RULES) {
    if (rule.pattern.test(nameEn)) return rule.category;
  }
  return "whole-spices";
}

/** URL- and SKU-safe slug derived from the English product name. */
export function slugify(name: string): string {
  const slug = name
    .toLowerCase()
    .replace(/[().]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return slug || "product";
}

export function normalizeSlug(nameEn: string): string {
  return slugify(nameEn);
}

/** Parses a printed price token. Returns null for "---"/"--------"/blank. */
export function parsePriceToken(token: string | undefined): number | null {
  if (!token) return null;
  const cleaned = token.replace(/[^\d]/g, "");
  if (!cleaned) return null;
  const value = Number(cleaned);
  return Number.isInteger(value) && value > 0 ? value : null;
}

export type CatalogRowDraft = Omit<
  CatalogRow,
  "category" | "status" | "source_file" | "source_page" | "source_row"
> & {
  category?: string;
};

/**
 * Validates a raw catalog row. `name_en` and `name_ur` are the only critical
 * fields; a row with no published price is kept as `draft` rather than
 * published, because the storefront must never invent a price.
 */
export function normalizeCatalogRow(
  raw: CatalogRowDraft,
  source: { source_file: string; source_page: number; source_row: number },
): CatalogRow {
  const name_en = raw.name_en?.trim() ?? "";
  const name_ur = raw.name_ur?.trim() ?? "";
  if (!name_en) throw new Error(`Row ${raw.sr_no}: missing English product name`);
  if (!name_ur) throw new Error(`Row ${raw.sr_no}: missing Urdu product name`);

  const price_100g_pkr = raw.price_100g_pkr ?? null;
  const price_1kg_pkr = raw.price_1kg_pkr ?? null;

  return {
    sr_no: raw.sr_no,
    name_en,
    name_ur,
    category: raw.category?.trim() || classifyCategory(name_en),
    price_100g_pkr,
    price_1kg_pkr,
    status: price_100g_pkr === null && price_1kg_pkr === null ? "draft" : "published",
    source_file: source.source_file,
    source_page: source.source_page,
    source_row: source.source_row,
  };
}

export type ImportIssue = {
  sr_no: number | null;
  name_en: string;
  severity: "error" | "warning";
  message: string;
};

export type ImportReport = {
  total_rows: number;
  imported: number;
  skipped: number;
  errors: ImportIssue[];
  warnings: ImportIssue[];
  generated_at: string;
};

/** Splits a catalog row's name field into English and Urdu parts. */
export function splitName(rawName: string): { name_en: string; name_ur: string } {
  const arabic = /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF]/;
  const match = rawName.match(arabic);
  if (!match || match.index === undefined) {
    return { name_en: rawName.trim(), name_ur: rawName.trim() };
  }
  const name_en = rawName.slice(0, match.index).trim();
  const name_ur = rawName.slice(match.index).trim();
  return { name_en, name_ur };
}
