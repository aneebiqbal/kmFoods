"use client";

import Link from "next/link";
import { useState, useTransition, type FormEvent } from "react";
import { useLanguage } from "@/i18n/language-context";
import { money } from "@/lib/format";
import type { CartLine } from "@/lib/types";
import { removeLineItemAction, updateLineItemAction } from "@/lib/cart-actions";
import { IDLE, type ActionState } from "@/lib/action-state";
import { ProductVisual } from "@/components/product-visual";

function QuantityForm({ line }: { line: CartLine }) {
  const { t } = useLanguage();
  const [quantity, setQuantity] = useState(line.quantity);
  const [state, setState] = useState<ActionState>(IDLE);
  const [pending, startTransition] = useTransition();

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    startTransition(async () => {
      setState(await updateLineItemAction(IDLE, formData));
    });
  }

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-2">
      <input type="hidden" name="lineId" value={line.id} />
      <input type="hidden" name="quantity" value={quantity} />
      <div className="inline-flex items-center rounded-full border border-earth-900/12">
        <button
          type="button"
          onClick={() => setQuantity((value) => Math.max(0, value - 1))}
          className="px-3 py-1.5 text-earth-700"
          aria-label="Decrease quantity"
        >
          −
        </button>
        <span className="min-w-7 text-center text-sm font-semibold">
          {quantity}
        </span>
        <button
          type="button"
          onClick={() => setQuantity((value) => Math.min(999, value + 1))}
          className="px-3 py-1.5 text-earth-700"
          aria-label="Increase quantity"
        >
          +
        </button>
      </div>
      <button
        type="submit"
        disabled={pending || quantity === line.quantity}
        className="text-xs font-semibold text-chili-700 disabled:opacity-40"
      >
        {t("cart.update")}
      </button>
      {state.status === "error" && (
        <span className="text-xs text-chili-700">{state.message}</span>
      )}
    </form>
  );
}

function RemoveForm({ line }: { line: CartLine }) {
  const { t } = useLanguage();
  const [state, setState] = useState<ActionState>(IDLE);
  const [pending, startTransition] = useTransition();

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    startTransition(async () => {
      setState(await removeLineItemAction(IDLE, formData));
    });
  }

  return (
    <form onSubmit={handleSubmit}>
      <input type="hidden" name="lineId" value={line.id} />
      <button
        type="submit"
        disabled={pending}
        className="text-xs font-semibold text-earth-500 underline-offset-2 hover:text-chili-700 hover:underline"
      >
        {t("cart.remove")}
      </button>
      {state.status === "error" && (
        <span className="ml-2 text-xs text-chili-700">{state.message}</span>
      )}
    </form>
  );
}

export function CartLineItems({ lines }: { lines: CartLine[] }) {
  const { locale } = useLanguage();

  return (
    <ul className="flex flex-col gap-4">
      {lines.map((line) => (
        <li key={line.id} className="shell">
          <div className="core flex flex-wrap items-center gap-4 p-4">
            <div className="h-20 w-20 shrink-0 overflow-hidden rounded-2xl">
              <ProductVisual
                title={line.title}
                titleUr={null}
                category={null}
                className="h-full w-full"
              />
            </div>

            <div className="min-w-40 flex-1">
              <Link
                href={`/product/${line.productHandle}`}
                className="text-sm font-semibold text-earth-900 hover:text-chili-700"
              >
                {line.title}
              </Link>
              <p className="mt-0.5 text-xs text-earth-500">
                {line.variantTitle}
              </p>
              <p className="mt-1 text-sm font-semibold text-earth-900">
                {money(line.unitPrice, locale)}
              </p>
            </div>

            <div className="flex flex-col items-end gap-2">
              <QuantityForm line={line} />
              <RemoveForm line={line} />
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}
