import { describe, expect, it } from "vitest";
import { buildWhatsAppMessage, buildWhatsAppUrl, type WhatsAppOrder } from "./whatsapp";
import { translate, dictionaries, type DictionaryKey } from "./i18n";

const order: WhatsAppOrder = {
  reference: "KM-000123",
  lines: [
    { title: "Red Chili Powder 100g", quantity: 2, unit_price_pkr: 80 },
    { title: "Turmeric 1kg", quantity: 1, unit_price_pkr: 800 },
  ],
  subtotal_pkr: 960,
  customer_name: "Test Customer",
  customer_phone: "+923211210333",
  delivery_city: "Lahore",
  delivery_area: "DHA",
  delivery_address: "House 1, Street 2, DHA Phase 5",
};

describe("buildWhatsAppMessage", () => {
  it("includes the reference, line items, subtotal and delivery details", () => {
    const message = buildWhatsAppMessage(order);
    expect(message).toContain("Order Reference: KM-000123");
    expect(message).toContain("Red Chili Powder 100g x 2");
    expect(message).toContain("Turmeric 1kg x 1");
    expect(message).toContain("Product Subtotal: Rs. 960");
    expect(message).toContain("Name: Test Customer");
    expect(message).toContain("Phone: +923211210333");
    expect(message).toContain("Delivery Area: Lahore - DHA");
    expect(message).toContain("Address: House 1, Street 2, DHA Phase 5");
  });

  it("asks the staff to confirm charges instead of stating a final total", () => {
    const message = buildWhatsAppMessage(order);
    expect(message).toContain("Please confirm availability,");
    expect(message).toContain("delivery charges and final total.");
  });

  it("omits the area separator when no area was given", () => {
    const message = buildWhatsAppMessage({ ...order, delivery_area: "" });
    expect(message).toContain("Delivery Area: Lahore");
    expect(message).not.toContain("Delivery Area: Lahore - ");
  });

  it("includes delivery notes when the customer left them", () => {
    const message = buildWhatsAppMessage({
      ...order,
      delivery_notes: "Call on arrival",
    });
    expect(message).toContain("Notes: Call on arrival");
  });

  it("omits the notes line when there are none", () => {
    const message = buildWhatsAppMessage(order);
    expect(message).not.toContain("Notes:");
  });
});

describe("buildWhatsAppUrl", () => {
  it("builds a wa.me link with the digits only and encoded text", () => {
    const url = buildWhatsAppUrl("+92 321 1210333", "Hello KM Foods,");
    expect(url.startsWith("https://wa.me/923211210333?text=")).toBe(true);
    expect(url).toContain(encodeURIComponent("Hello KM Foods,"));
  });
});

describe("i18n", () => {
  it("translates into Urdu", () => {
    expect(translate("ur", "nav.shop")).toBe("دکان");
    expect(translate("en", "nav.shop")).toBe("Shop");
  });

  it("falls back to English for a missing key", () => {
    expect(translate("ur", "nav.shop" as DictionaryKey)).toBe("دکان");
  });

  it("substitutes parameters", () => {
    expect(translate("en", "shop.results", { count: 78 })).toBe("78 products");
  });

  it("keeps English and Urdu dictionaries key-aligned", () => {
    const enKeys = Object.keys(dictionaries.en).sort();
    const urKeys = Object.keys(dictionaries.ur).sort();
    expect(urKeys).toEqual(enKeys);
  });
});
