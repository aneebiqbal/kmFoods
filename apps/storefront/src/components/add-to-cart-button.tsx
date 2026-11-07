"use client";

import { useState, useTransition } from "react";
import { useLanguage } from "@/i18n/language-context";
import { addToCartAction } from "@/lib/cart-actions";
import { IDLE, type ActionState } from "@/lib/action-state";

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
