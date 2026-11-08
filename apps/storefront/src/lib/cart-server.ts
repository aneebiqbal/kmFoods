import { cookies } from "next/headers";
import { sdk } from "./medusa";
import { toStoreCart, type MedusaCart } from "./cart-map";
import type { StoreCart } from "./types";

export const CART_COOKIE = "km_cart_id";
const CART_MAX_AGE_SECONDS = 60 * 60 * 24 * 30;

const CART_FIELDS = [
  "id",
  "subtotal",
  "total",
  "currency_code",
  "items.id",
  "items.quantity",
  "items.unit_price",
  "items.title",
  "items.thumbnail",
  "items.variant_id",
  "items.product_id",
  "items.product_handle",
  "*items.variant",
  "*items.product",
].join(",");

/** Read-only cart lookup for server components. */
export async function getCartId(): Promise<string | null> {
  const store = await cookies();
  return store.get(CART_COOKIE)?.value ?? null;
}

export async function getCart(): Promise<StoreCart | null> {
  const cartId = await getCartId();
  if (!cartId) return null;

  try {
    const { cart } = await sdk.store.cart.retrieve(cartId, {
      fields: CART_FIELDS,
    });
    return toStoreCart(cart as MedusaCart);
  } catch {
    return null;
  }
}

export { CART_MAX_AGE_SECONDS };
