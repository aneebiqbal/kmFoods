"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { validateQuantity } from "@kmfoods/shared";
import { sdk } from "./medusa";
import { getDefaultRegion } from "./products";
import { CART_COOKIE, CART_MAX_AGE_SECONDS, getCart } from "./cart-server";
import type { CheckoutResult, DeliveryConfig } from "./types";
import type { ActionState } from "./action-state";

function messageFrom(error: unknown): string {
  if (error instanceof Error && error.message) return error.message;
  return "Something went wrong. Please try again.";
}

async function ensureCartId(): Promise<string> {
  const store = await cookies();
  const existing = store.get(CART_COOKIE)?.value;

  if (existing) {
    try {
      await sdk.store.cart.retrieve(existing);
      return existing;
    } catch {
      // Stale cookie from a completed or expired cart; create a fresh one.
    }
  }

  const region = await getDefaultRegion();
  if (!region) throw new Error("The store is not configured with a region yet.");

  const { cart } = await sdk.store.cart.create({ region_id: region.id });
  store.set(CART_COOKIE, cart.id, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: CART_MAX_AGE_SECONDS,
  });

  return cart.id;
}

export async function getDeliveryConfig(): Promise<DeliveryConfig> {
  return sdk.client.fetch<DeliveryConfig>("/store/delivery-config");
}

export async function addToCartAction(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  const variantId = String(formData.get("variantId") ?? "").trim();
  const quantity = validateQuantity(formData.get("quantity") ?? 1);

  if (!variantId) {
    return { status: "error", message: "Choose a pack size first." };
  }
  if (!quantity.ok) {
    return { status: "error", message: "Enter a valid quantity." };
  }

  try {
    const cartId = await ensureCartId();
    await sdk.store.cart.createLineItem(cartId, {
      variant_id: variantId,
      quantity: quantity.quantity,
    });
    // No revalidatePath: re-rendering the layout remounts the purchase form and
    // discards its success state before the customer can read it.
    return { status: "success", message: "Added to your cart." };
  } catch (error) {
    return { status: "error", message: messageFrom(error) };
  }
}

export async function updateLineItemAction(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  const lineId = String(formData.get("lineId") ?? "");
  const quantity = validateQuantity(formData.get("quantity") ?? 0);

  if (!lineId) return { status: "error", message: "Missing cart item." };
  if (!quantity.ok) return { status: "error", message: "Enter a valid quantity." };

  try {
    const cart = await getCart();
    if (!cart) return { status: "error", message: "Your cart is empty." };

    if (quantity.quantity === 0) {
      await sdk.store.cart.deleteLineItem(cart.id, lineId);
    } else {
      await sdk.store.cart.updateLineItem(cart.id, lineId, {
        quantity: quantity.quantity,
      });
    }

    revalidatePath("/", "layout");
    return { status: "success", message: "Cart updated." };
  } catch (error) {
    return { status: "error", message: messageFrom(error) };
  }
}

export async function removeLineItemAction(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  const lineId = String(formData.get("lineId") ?? "");
  if (!lineId) return { status: "error", message: "Missing cart item." };

  try {
    const cart = await getCart();
    if (!cart) return { status: "error", message: "Your cart is empty." };

    await sdk.store.cart.deleteLineItem(cart.id, lineId);
    revalidatePath("/", "layout");
    return { status: "success", message: "Item removed." };
  } catch (error) {
    return { status: "error", message: messageFrom(error) };
  }
}

export async function submitCheckoutAction(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  const customer_name = String(formData.get("customer_name") ?? "").trim();
  const customer_phone = String(formData.get("customer_phone") ?? "").trim();
  const delivery_city = String(formData.get("delivery_city") ?? "").trim();
  const delivery_area = String(formData.get("delivery_area") ?? "").trim();
  const delivery_address = String(formData.get("delivery_address") ?? "").trim();
  const customer_email = String(formData.get("customer_email") ?? "").trim();

  if (!customer_name || !customer_phone || !delivery_city || !delivery_address) {
    return { status: "error", message: "Please complete every required field." };
  }

  try {
    const cart = await getCart();
    if (!cart || cart.items.length === 0) {
      return { status: "error", message: "Your cart is empty." };
    }

    const delivery = await getDeliveryConfig();
    if (!delivery.shipping_option_id) {
      return {
        status: "error",
        message: "Delivery is not configured yet. Please contact us on WhatsApp.",
      };
    }

    const result = await sdk.client.fetch<CheckoutResult>("/store/whatsapp-handoff", {
      method: "POST",
      body: {
        cart_id: cart.id,
        delivery_option_id: delivery.shipping_option_id,
        customer_name,
        customer_phone,
        delivery_city,
        delivery_area: delivery_area || undefined,
        delivery_address,
        customer_email: customer_email || undefined,
      },
    });

    // The cart is now a completed order; start a fresh one next time.
    const store = await cookies();
    store.delete(CART_COOKIE);
    revalidatePath("/", "layout");

    return {
      status: "success",
      reference: result.handoff.reference,
      whatsappUrl: result.whatsapp.url,
      message: "Order reference created.",
    };
  } catch (error) {
    return { status: "error", message: messageFrom(error) };
  }
}
