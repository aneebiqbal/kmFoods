import type { CartLine, StoreCart } from "./types";

export type MedusaCartItem = {
  id: string;
  quantity: number;
  unit_price: number;
  title?: string | null;
  variant_id?: string | null;
  thumbnail?: string | null;
  variant?: {
    title?: string | null;
    product?: { handle?: string | null } | null;
  } | null;
};

export type MedusaCart = {
  id: string;
  subtotal?: number | null;
  total?: number | null;
  currency_code?: string | null;
  items?: MedusaCartItem[] | null;
};

/**
 * Maps a Medusa cart onto the storefront's cart shape. Totals come from Medusa;
 * this only reshapes and never recomputes money.
 */
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
