import { describe, expect, it } from "vitest";
import { toStoreCart } from "./cart-map";

describe("toStoreCart", () => {
  it("keeps Medusa totals as the source of truth", () => {
    const cart = toStoreCart({
      id: "cart_1",
      subtotal: 160,
      total: 160,
      currency_code: "pkr",
      items: [],
    });
    expect(cart.subtotal).toBe(160);
    expect(cart.total).toBe(160);
    expect(cart.currencyCode).toBe("pkr");
    expect(cart.itemCount).toBe(0);
  });

  it("maps the variant title and product handle for each line", () => {
    const cart = toStoreCart({
      id: "cart_1",
      subtotal: 800,
      total: 800,
      currency_code: "pkr",
      items: [
        {
          id: "cali_1",
          quantity: 2,
          unit_price: 80,
          title: "Red Chili Powder",
          variant_id: "variant_1",
          variant: { title: "100g", product: { handle: "red-chili-powder" } },
        },
      ],
    });

    expect(cart.items[0]?.variantTitle).toBe("100g");
    expect(cart.items[0]?.productHandle).toBe("red-chili-powder");
    expect(cart.items[0]?.unitPrice).toBe(80);
    expect(cart.items[0]?.titleUr).toBeNull();
    expect(cart.itemCount).toBe(2);
  });

  it("maps the Urdu product name when the catalogue provides one", () => {
    const cart = toStoreCart({
      id: "cart_1",
      items: [
        {
          id: "cali_1",
          quantity: 1,
          unit_price: 80,
          title: "Red Chili Powder",
          variant_id: "variant_1",
          variant: {
            title: "100g",
            product: {
              handle: "red-chili-powder",
              metadata: { name_ur: "سرخ مرچ پاؤڈر" },
            },
          },
        },
      ],
    });

    expect(cart.items[0]?.titleUr).toBe("سرخ مرچ پاؤڈر");
  });

  it("prefers the flattened product handle Medusa returns on the line", () => {
    const cart = toStoreCart({
      id: "cart_1",
      items: [
        {
          id: "cali_1",
          quantity: 1,
          unit_price: 80,
          title: "Red Chili Powder",
          variant_id: "variant_1",
          product_id: "prod_1",
          product_handle: "red-chili-powder",
        },
      ],
    });

    expect(cart.items[0]?.productId).toBe("prod_1");
    expect(cart.items[0]?.productHandle).toBe("red-chili-powder");
  });

  it("falls back to sensible defaults when Medusa omits relations", () => {
    const cart = toStoreCart({
      id: "cart_2",
      items: [{ id: "cali_2", quantity: 1, unit_price: 50, title: null }],
    });

    expect(cart.items[0]?.title).toBe("Item");
    expect(cart.items[0]?.variantTitle).toBe("");
    expect(cart.items[0]?.productHandle).toBe("");
    expect(cart.subtotal).toBe(0);
    expect(cart.currencyCode).toBe("pkr");
  });

  it("sums the item count across quantities", () => {
    const cart = toStoreCart({
      id: "cart_3",
      items: [
        { id: "a", quantity: 3, unit_price: 10 },
        { id: "b", quantity: 2, unit_price: 10 },
      ],
    });
    expect(cart.itemCount).toBe(5);
  });
});
