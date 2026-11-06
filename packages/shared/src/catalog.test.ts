import { describe, expect, it } from "vitest";
import {
  CATEGORY_LABELS,
  CATEGORIES,
  catalogRowSchema,
  classifyCategory,
  normalizeCatalogRow,
  parsePriceToken,
  slugify,
  splitName,
} from "./catalog";

describe("classifyCategory", () => {
  it("routes chilies and peppers first", () => {
    expect(classifyCategory("Red Chili Powder")).toBe("chilies-peppers");
    expect(classifyCategory("Black Pepper Crushed")).toBe("chilies-peppers");
    expect(classifyCategory("White Pepper Powder")).toBe("chilies-peppers");
  });

  it("routes nuts and dry fruits before the generic seed rule", () => {
    expect(classifyCategory("Almond Grace")).toBe("dry-fruits-nuts");
    expect(classifyCategory("Anjeer")).toBe("dry-fruits-nuts");
    expect(classifyCategory("Walnut Giri")).toBe("dry-fruits-nuts");
  });

  it("routes sweeteners", () => {
    expect(classifyCategory("Rock Sugar")).toBe("sweeteners");
    expect(classifyCategory("Gur")).toBe("sweeteners");
    expect(classifyCategory("Brown Sugar")).toBe("sweeteners");
  });

  it("routes seeds", () => {
    expect(classifyCategory("White Sesame")).toBe("seeds");
    expect(classifyCategory("Flax Seeds")).toBe("seeds");
    expect(classifyCategory("Pumpkin Seeds")).toBe("seeds");
    expect(classifyCategory("Cumin Seeds")).toBe("seeds");
  });

  it("falls back to whole spices for plain spice names", () => {
    expect(classifyCategory("Clove")).toBe("whole-spices");
    expect(classifyCategory("Cinnamon")).toBe("whole-spices");
  });

  it("covers every declared category at least once", () => {
    const names = [
      "Red Chili Powder", "Clove", "Turmeric Powder", "White Sesame",
      "Almond Grace", "Fenugreek Leaf", "Rock Sugar", "Black Salt",
    ];
    const assigned = new Set(names.map(classifyCategory));
    for (const category of CATEGORIES) {
      expect(assigned.has(category)).toBe(true);
    }
  });
});

describe("parsePriceToken", () => {
  it("parses printed digits", () => {
    expect(parsePriceToken("85")).toBe(85);
    expect(parsePriceToken("1,300")).toBe(1300);
  });

  it("returns null for missing price markers", () => {
    expect(parsePriceToken("---")).toBeNull();
    expect(parsePriceToken("--------")).toBeNull();
    expect(parsePriceToken("")).toBeNull();
    expect(parsePriceToken(undefined)).toBeNull();
  });
});

describe("normalizeCatalogRow", () => {
  const source = { source_file: "price-list.pdf", source_page: 1, source_row: 1 };

  it("keeps published prices and marks the row published", () => {
    const row = normalizeCatalogRow(
      {
        sr_no: 1,
        name_en: "Red Chili Powder",
        name_ur: "لال مرچ پاؤڈر",
        price_100g_pkr: 80,
        price_1kg_pkr: 800,
      },
      source,
    );
    expect(row.status).toBe("published");
    expect(row.category).toBe("chilies-peppers");
  });

  it("downgrades a row with no published price to draft", () => {
    const row = normalizeCatalogRow(
      {
        sr_no: 45,
        name_en: "Kachri Powder",
        name_ur: "کچری پاؤڈر",
        price_100g_pkr: null,
        price_1kg_pkr: null,
      },
      source,
    );
    expect(row.status).toBe("draft");
  });

  it("keeps a row with only one pack size priced", () => {
    const row = normalizeCatalogRow(
      {
        sr_no: 7,
        name_en: "Black Pepper Crushed",
        name_ur: "کالی مرچ دادڑ",
        price_100g_pkr: 280,
        price_1kg_pkr: null,
      },
      source,
    );
    expect(row.status).toBe("published");
    expect(row.price_1kg_pkr).toBeNull();
  });

  it("refuses a row with no English name", () => {
    expect(() =>
      normalizeCatalogRow(
        { sr_no: 2, name_en: "  ", name_ur: "ہلدی", price_100g_pkr: 80, price_1kg_pkr: 800 },
        source,
      ),
    ).toThrow(/missing English product name/);
  });

  it("refuses a row with no Urdu name", () => {
    expect(() =>
      normalizeCatalogRow(
        { sr_no: 2, name_en: "Turmeric", name_ur: "", price_100g_pkr: 80, price_1kg_pkr: 800 },
        source,
      ),
    ).toThrow(/missing Urdu product name/);
  });

  it("round-trips through the zod schema", () => {
    const row = normalizeCatalogRow(
      {
        sr_no: 3,
        name_en: "Red Chili (Kundri).",
        name_ur: "لال مرچ ثابت",
        price_100g_pkr: 120,
        price_1kg_pkr: 1200,
      },
      source,
    );
    expect(() => catalogRowSchema.parse(row)).not.toThrow();
  });
});

describe("splitName", () => {
  it("splits an English/Urdu pair on the first Arabic-script character", () => {
    const { name_en, name_ur } = splitName("Red Chili Crushed                    لال مرچ دادڑ");
    expect(name_en).toBe("Red Chili Crushed");
    expect(name_ur).toContain("لال مرچ دادڑ");
  });

  it("keeps both halves when no Urdu script is present", () => {
    const { name_en, name_ur } = splitName("Plain Product");
    expect(name_en).toBe("Plain Product");
    expect(name_ur).toBe("Plain Product");
  });
});

describe("slugify", () => {
  it("strips punctuation and collapses separators", () => {
    expect(slugify("Red Chili (Kundri).")).toBe("red-chili-kundri");
    expect(slugify("Dried Plum (Irani).")).toBe("dried-plum-irani");
  });

  it("never returns an empty slug", () => {
    expect(slugify("...")).toBe("product");
  });
});

describe("CATEGORY_LABELS", () => {
  it("has English and Urdu labels for every category", () => {
    for (const category of CATEGORIES) {
      expect(CATEGORY_LABELS[category].en.length).toBeGreaterThan(0);
      expect(CATEGORY_LABELS[category].ur.length).toBeGreaterThan(0);
    }
  });
});
