"use client";

import { useState, useTransition, type FormEvent } from "react";
import { useLanguage } from "@/i18n/language-context";
import { money } from "@/lib/format";
import { translate } from "@kmfoods/shared";
import type { StoreProduct } from "@/lib/types";
import { addToCartAction } from "@/lib/cart-actions";
import { useStock } from "@/lib/use-stock";
import { IDLE, type ActionState } from "@/lib/action-state";

/**
 * Calls a server action from a client submit handler. Direct invocation is
 * used rather than useActionState so the result is applied to local state
 * immediately and is not lost to a layout re-render.
 */
async function runAction(
  setState: (state: ActionState) => void,
  formData: FormData
): Promise<void> {
  setState(await addToCartAction(IDLE, formData));
}

export function ProductPurchase({ product }: { product: StoreProduct }) {
  const { t, locale } = useLanguage();
  const [variantId, setVariantId] = useState(product.variants[0]?.id ?? "");
  const [quantity, setQuantity] = useState(1);
  const [state, setState] = useState<ActionState>(IDLE);
  const [pending, startTransition] = useTransition();
  const { stock, loading: stockLoading } = useStock(
    product.variants.map((variant) => variant.id)
  );

  const selected = product.variants.find((variant) => variant.id === variantId);
  const selectedStock = selected ? stock[selected.id] : undefined;
  const outOfStock = selectedStock !== undefined && selectedStock <= 0;

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    startTransition(() => runAction(setState, formData));
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <input type="hidden" name="variantId" value={variantId} />
      <input type="hidden" name="quantity" value={quantity} />

      {product.variants.length > 1 && (
        <fieldset>
          <legend className="text-xs font-semibold uppercase tracking-[0.18em] text-ink-500">
            {t("product.packSize")}
          </legend>
          <div className="mt-3 flex flex-wrap gap-2">
            {product.variants.map((variant) => (
              <button
                key={variant.id}
                type="button"
                onClick={() => setVariantId(variant.id)}
                aria-pressed={variantId === variant.id}
                className={`rounded-full border px-4 py-2 text-sm font-semibold transition-colors duration-200 ${
                  variantId === variant.id
                    ? "border-paprika-600 bg-paprika-600 text-bone-50"
                    : "border-ink-900/12 bg-bone-50 text-ink-700 hover:border-ink-900/25"
                }`}
              >
                {variant.title}
              </button>
            ))}
          </div>
        </fieldset>
      )}

      <div>
        <label
          htmlFor="quantity"
          className="text-xs font-semibold uppercase tracking-[0.18em] text-ink-500"
        >
          {t("product.quantity")}
        </label>
        <div className="mt-3 inline-flex items-center rounded-full border border-ink-900/12">
          <button
            type="button"
            onClick={() => setQuantity((value) => Math.max(1, value - 1))}
            className="px-4 py-2 text-lg text-ink-700"
            aria-label="Decrease quantity"
          >
            −
          </button>
          <span className="min-w-8 text-center text-sm font-semibold">
            {quantity}
          </span>
          <button
            type="button"
            onClick={() => setQuantity((value) => Math.min(999, value + 1))}
            className="px-4 py-2 text-lg text-ink-700"
            aria-label="Increase quantity"
          >
            +
          </button>
        </div>
      </div>

      <p className="text-xs text-ink-500" role="status">
        {stockLoading
          ? translate(locale, "common.loading")
          : outOfStock
            ? translate(locale, "product.outOfStock")
            : selectedStock !== undefined
              ? translate(locale, "product.inStock")
              : translate(locale, "product.stockUnavailable")}
      </p>

      <div className="flex items-center gap-4">
        <button
          type="submit"
          disabled={pending || !selected || outOfStock}
          className="btn btn-primary flex-1 px-6 py-3 text-sm disabled:cursor-not-allowed disabled:opacity-60"
        >
          {pending ? t("common.loading") : t("product.addToCart")}
        </button>
        {selected?.price != null && (
          <span className="text-lg font-semibold text-ink-900">
            {money(selected.price * quantity, locale)}
          </span>
        )}
      </div>

      {state.status !== "idle" && (
        <p
          className={`text-sm ${
            state.status === "success" ? "text-olive-600" : "text-paprika-700"
          }`}
          role="status"
        >
          {state.message}
        </p>
      )}
    </form>
  );
}

/**
 * Thumb-reachable purchase bar for phones. Hidden on desktop where the page's
 * own form is reachable.
 */
export function StickyPurchaseBar({ product }: { product: StoreProduct }) {
  const { t, locale } = useLanguage();
  const [variantId, setVariantId] = useState(product.variants[0]?.id ?? "");
  const [quantity, setQuantity] = useState(1);
  const [state, setState] = useState<ActionState>(IDLE);
  const [pending, startTransition] = useTransition();
  const { stock } = useStock(product.variants.map((variant) => variant.id));

  const selected = product.variants.find((variant) => variant.id === variantId);
  const outOfStock = selected ? (stock[selected.id] ?? 1) <= 0 : false;

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    startTransition(() => runAction(setState, formData));
  }

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-ink-900/10 bg-bone-50/95 px-4 py-3 backdrop-blur-md lg:hidden">
      <form onSubmit={handleSubmit} className="flex items-center gap-3">
        <input type="hidden" name="variantId" value={variantId} />
        <input type="hidden" name="quantity" value={quantity} />

        <div className="min-w-0 flex-1">
          {product.variants.length > 1 ? (
            <label className="block text-[10px] uppercase tracking-[0.16em] text-ink-500">
              {t("product.packSize")}
              <select
                value={variantId}
                onChange={(event) => setVariantId(event.target.value)}
                className="mt-0.5 w-full rounded-full border border-ink-900/12 bg-bone-50 px-2 py-1 text-xs font-semibold outline-none"
              >
                {product.variants.map((variant) => (
                  <option key={variant.id} value={variant.id}>
                    {variant.title}
                    {variant.price !== null ? ` — ${money(variant.price, locale)}` : ""}
                  </option>
                ))}
              </select>
            </label>
          ) : (
            <span className="text-[10px] uppercase tracking-[0.16em] text-ink-500">
              {t("product.price")}
            </span>
          )}
          <span className="block text-sm font-semibold text-ink-900">
            {selected?.price != null
              ? money(selected.price * quantity, locale)
              : t("product.priceOnRequest")}
          </span>
        </div>

        <div className="inline-flex shrink-0 items-center rounded-full border border-ink-900/12">
          <button
            type="button"
            onClick={() => setQuantity((value) => Math.max(1, value - 1))}
            className="px-3 py-2 text-ink-700"
            aria-label="Decrease quantity"
          >
            −
          </button>
          <span className="min-w-6 text-center text-sm font-semibold">{quantity}</span>
          <button
            type="button"
            onClick={() => setQuantity((value) => Math.min(999, value + 1))}
            className="px-3 py-2 text-ink-700"
            aria-label="Increase quantity"
          >
            +
          </button>
        </div>

        <button
          type="submit"
          disabled={pending || !selected || outOfStock}
          aria-label={t("product.addToCartFor", { name: product.title })}
          className="btn btn-primary shrink-0 px-5 py-2.5 text-sm disabled:opacity-60"
        >
          {pending ? t("common.loading") : t("product.addToCart")}
        </button>
      </form>

      {state.status !== "idle" && (
        <p
          className={`mt-1 text-center text-xs ${
            state.status === "success" ? "text-olive-600" : "text-paprika-700"
          }`}
          role="status"
        >
          {state.message}
        </p>
      )}
    </div>
  );
}
