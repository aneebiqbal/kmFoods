import { cookies } from "next/headers";
import { sdk } from "./medusa";
import type { CartLine, StoreCart } from "./types";

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
  "items.variant_id",
  "items.variant.title",
  "items.thumbnail",
  "items.variant.product.handle",
].join(",");

type MedusaCartItem = {
  id: string;
  quantity: number;
  unit_price: number;
  title?: string | null;
  variant_id?: string | null;
  thumbnail?: string | null;
  variant?: { title?: string | null; product?: { handle?: string | null } | null } | null;
};

type MedusaCart = {
  id: string;
  subtotal?: number | null;
  total?: number | null;
  currency_code?: string | null;
  items?: MedusaCartItem[] | null;
};

export function toStoreCart(cart: MedusaCart): StoreCart {
  const items: CartLine[] = (cart.items ?? []).map((item) => ({
    id: item.id,
    variantId: item.variant_id ?? "",
    title: item.title ?? item.variant?.title ?? "Item",
    variantTitle: item.variant?.title ?? "",
    quantity: item.quantity,
    unitPrice: item.unit_price,
    thumbnail: item.thumbnail ?? null,
    productHandle: item.variant?.product?.handle ?? "",
  }));

  return {
    id: cart.id,
    items,
    subtotal: cart.subtotal ?? 0,
    total: cart.total ?? 0,
    currencyCode: cart.currency_code ?? "pkr",
    itemCount: items.reduce((sum, item) => sum + item.quantity, 0),
  };
}

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
