"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import { useLanguage } from "@/i18n/language-context";
import { translate, type Locale } from "@kmfoods/shared";
import { addToCartAction } from "@/lib/cart-actions";
import { IDLE, type ActionState } from "@/lib/action-state";
import type { StoreProduct } from "@/lib/types";

/**
 * One tap adds the selected variant to the real Medusa cart. The button owns
 * its pending and result state so a card never unmounts mid-transition.
 */
export function AddToCartButton({
  variantId,
  disabled = false,
  className = "",
  label,
}: {
  variantId: string;
  disabled?: boolean;
  className?: string;
  label?: string;
}) {
  const { t } = useLanguage();
  const [state, setState] = useState<ActionState>(IDLE);
  const [pending, startTransition] = useTransition();

  function add() {
    const formData = new FormData();
    formData.set("variantId", variantId);
    formData.set("quantity", "1");
    startTransition(async () => {
      setState(await addToCartAction(IDLE, formData));
    });
  }

  const isDisabled = pending || disabled || !variantId;

  return (
    <span className={`flex flex-col gap-1 ${className}`}>
      <button
        type="button"
        onClick={add}
        disabled={isDisabled}
        className="btn btn-ghost w-full px-4 text-sm"
      >
        {pending ? t("common.loading") : (label ?? t("product.addToCart"))}
      </button>
      {state.status !== "idle" && (
        <span
          className={`text-center text-xs ${
            state.status === "success" ? "text-success" : "text-error"
          }`}
          role="status"
        >
          {state.message}
        </span>
      )}
    </span>
  );
}

/**
 * Variant-safe list action. A single-variant product can be added directly; a
 * product with pack sizes routes to its dossier so the customer chooses the
 * pack explicitly. The list never guesses a default variant.
 */
export function ProductAction({
  product,
  locale,
  className = "",
}: {
  product: StoreProduct;
  locale: Locale;
  className?: string;
}) {
  const { t } = useLanguage();

  const only = product.variants[0];
  if (product.variants.length === 1 && only) {
    return (
      <AddToCartButton
        variantId={only.id}
        disabled={only.price === null}
        label={t("product.addToCart")}
        className={className}
      />
    );
  }

  return (
    <Link
      href={`/product/${product.handle}`}
      className={`btn btn-ghost shrink-0 px-4 text-sm ${className}`}
    >
      {translate(locale, "product.selectPack")}
    </Link>
  );
}
