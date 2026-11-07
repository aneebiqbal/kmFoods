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
          <legend className="label">{t("product.packSize")}</legend>
          <div className="mt-3 flex flex-wrap gap-2">
            {product.variants.map((variant) => (
              <button
                key={variant.id}
                type="button"
                onClick={() => setVariantId(variant.id)}
                aria-pressed={variantId === variant.id}
                className={`rounded-pill border px-4 py-2 text-sm font-medium transition-colors duration-[220ms] ${
                  variantId === variant.id
                    ? "border-ink bg-ink text-paper"
                    : "border-rule bg-paper text-ink-2 hover:border-ink"
                }`}
              >
                {variant.title}
              </button>
            ))}
          </div>
        </fieldset>
      )}

      <div>
        <label htmlFor="quantity" className="label">
          {t("product.quantity")}
        </label>
        <div className="mt-3 inline-flex items-center border border-ink">
          <button
            type="button"
            onClick={() => setQuantity((value) => Math.max(1, value - 1))}
            className="px-4 py-2 text-lg text-ink-2"
            aria-label="Decrease quantity"
          >
            −
          </button>
          <span className="min-w-8 text-center text-sm font-medium text-ink">{quantity}</span>
          <button
            type="button"
            onClick={() => setQuantity((value) => Math.min(999, value + 1))}
            className="px-4 py-2 text-lg text-ink-2"
            aria-label="Increase quantity"
          >
            +
          </button>
        </div>
      </div>

      <p className="small" role="status">
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
          className="btn btn-primary flex-1 px-6 py-3 text-sm"
        >
          {pending ? t("common.loading") : t("product.addToCart")}
        </button>
        {selected?.price != null && (
          <span className="price text-xl">
            {money(selected.price * quantity, locale)}
          </span>
        )}
      </div>

      {state.status !== "idle" && (
        <p
          className={`text-sm ${
            state.status === "success" ? "text-success" : "text-error"
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
    <div className="fixed inset-x-0 bottom-0 z-raised border-t-2 border-ink bg-paper/95 px-4 py-3 backdrop-blur-sm lg:hidden">
      <form onSubmit={handleSubmit} className="flex items-center gap-3">
        <input type="hidden" name="variantId" value={variantId} />
        <input type="hidden" name="quantity" value={quantity} />

        <div className="min-w-0 flex-1">
          {product.variants.length > 1 ? (
            <label className="label">
              {t("product.packSize")}
              <select
                value={variantId}
                onChange={(event) => setVariantId(event.target.value)}
                className="field mt-1 px-2 py-1.5 text-sm"
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
            <span className="label">{t("product.price")}</span>
          )}
          <span className="price block text-lg">
            {selected?.price != null
              ? money(selected.price * quantity, locale)
              : t("product.priceOnRequest")}
          </span>
        </div>

        <div className="inline-flex shrink-0 items-center border border-ink">
          <button
            type="button"
            onClick={() => setQuantity((value) => Math.max(1, value - 1))}
            className="px-3 py-2 text-ink-2"
            aria-label="Decrease quantity"
          >
            −
          </button>
          <span className="min-w-6 text-center text-sm font-medium text-ink">{quantity}</span>
          <button
            type="button"
            onClick={() => setQuantity((value) => Math.min(999, value + 1))}
            className="px-3 py-2 text-ink-2"
            aria-label="Increase quantity"
          >
            +
          </button>
        </div>

        <button
          type="submit"
          disabled={pending || !selected || outOfStock}
          aria-label={t("product.addToCartFor", { name: product.title })}
          className="btn btn-primary shrink-0 px-5 py-2.5 text-sm"
        >
          {pending ? t("common.loading") : t("product.addToCart")}
        </button>
      </form>

      {state.status !== "idle" && (
        <p
          className={`mt-1 text-center text-xs ${
            state.status === "success" ? "text-success" : "text-error"
          }`}
          role="status"
        >
          {state.message}
        </p>
      )}
    </div>
  );
}
