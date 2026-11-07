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
      <div className="inline-flex items-center border border-ink">
        <button
          type="button"
          onClick={() => setQuantity((value) => Math.max(0, value - 1))}
          className="px-3 py-1.5 text-ink-2"
          aria-label="Decrease quantity"
        >
          −
        </button>
        <span className="min-w-7 text-center text-sm font-medium text-ink">{quantity}</span>
        <button
          type="button"
          onClick={() => setQuantity((value) => Math.min(999, value + 1))}
          className="px-3 py-1.5 text-ink-2"
          aria-label="Increase quantity"
        >
          +
        </button>
      </div>
      <button
        type="submit"
        disabled={pending || quantity === line.quantity}
        className="text-xs font-medium text-accent disabled:opacity-40"
      >
        {t("cart.update")}
      </button>
      {state.status === "error" && (
        <span className="text-xs text-error">{state.message}</span>
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
        className="text-xs font-medium text-ink-2 underline underline-offset-2 hover:text-accent"
      >
        {t("cart.remove")}
      </button>
      {state.status === "error" && (
        <span className="ms-2 text-xs text-error">{state.message}</span>
      )}
    </form>
  );
}

export function CartLineItems({ lines }: { lines: CartLine[] }) {
  const { locale } = useLanguage();

  return (
    <ul className="divide-y divide-rule border-y border-rule">
      {lines.map((line) => (
        <li key={line.id} className="flex flex-wrap items-center gap-4 py-4">
          <div className="h-20 w-20 shrink-0 overflow-hidden border border-rule">
            <ProductVisual
              title={line.title}
              titleUr={null}
              locale={locale}
              className="h-full w-full"
            />
          </div>

          <div className="min-w-40 flex-1">
            <Link
              href={`/product/${line.productHandle}`}
              className="text-sm font-medium text-ink link"
            >
              {line.title}
            </Link>
            <p className="small mt-0.5">{line.variantTitle}</p>
            <p className="price mt-1 text-base">{money(line.unitPrice, locale)}</p>
          </div>

          <div className="flex flex-col items-end gap-2">
            <QuantityForm line={line} />
            <RemoveForm line={line} />
          </div>
        </li>
      ))}
    </ul>
  );
}
