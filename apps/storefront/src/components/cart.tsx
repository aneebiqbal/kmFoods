"use client";

import Link from "next/link";
import { useState, useTransition, type FormEvent } from "react";
import { useLanguage } from "@/i18n/language-context";
import { money } from "@/lib/format";
import type { CartLine } from "@/lib/types";
import { removeLineItemAction } from "@/lib/cart-actions";
import { IDLE, type ActionState } from "@/lib/action-state";
import { useStock } from "@/lib/use-stock";
import { ProductVisual } from "@/components/product-visual";
import { QuantityStepper } from "@/components/purchase";

function RemoveForm({ line }: { line: CartLine }) {
  const { t } = useLanguage();
  const [state, setState] = useState<ActionState>(IDLE);
  const [pending, startTransition] = useTransition();

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (pending) return;
    const formData = new FormData(event.currentTarget);
    startTransition(async () => {
      setState(await removeLineItemAction(IDLE, formData));
    });
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col items-end gap-1">
      <input type="hidden" name="lineId" value={line.id} />
      <button
        type="submit"
        disabled={pending}
        aria-label={t("cart.removeItem", { name: line.title })}
        className="text-xs font-medium text-ink-2 underline underline-offset-2 transition-colors hover:text-accent disabled:opacity-50"
      >
        {t("cart.remove")}
      </button>
      {state.status === "error" && (
        <span className="field-error" role="alert">
          {state.message}
        </span>
      )}
    </form>
  );
}

/**
 * The basket ledger: every ingredient numbered, priced per pack, with the
 * line total and a thumb-reachable quantity stepper. Totals come from Medusa;
 * this only lays them out.
 */
export function CartLedger({ lines }: { lines: CartLine[] }) {
  const { t, locale } = useLanguage();
  const { stock, loading: stockLoading } = useStock(
    lines.map((line) => line.variantId)
  );

  return (
    <div className="ledger">
      <div className="ledger__head" aria-hidden="true">
        <span className="ledger__num" />
        <span className="ledger__head-visual" />
        <span className="small ledger__head-main">
          <span>{t("cart.item")}</span>
          <span>{t("cart.lineTotal")}</span>
        </span>
        <span className="small ledger__head-actions">{t("cart.quantity")}</span>
      </div>

      <ul className="ledger__list">
        {lines.map((line, index) => {
          const available = stock[line.variantId];
          return (
          <li key={line.id} className="ledger-row">
            <span className="numeral ledger-row__num" aria-hidden="true">
              {String(index + 1).padStart(2, "0")}
            </span>

            <Link
              href={`/product/${line.productHandle}`}
              className="ledger-row__visual"
              aria-label={line.title}
            >
              <ProductVisual
                title={line.title}
                titleUr={line.titleUr}
                locale={locale}
                className="h-full w-full"
                compact
              />
            </Link>

            <div className="ledger-row__main">
              <div className="ledger-row__top">
                <Link
                  href={`/product/${line.productHandle}`}
                  className="ledger-row__title link"
                >
                  {line.title}
                </Link>
                <span className="ledger-row__total">
                  {money(line.unitPrice * line.quantity, locale)}
                </span>
              </div>
              {line.titleUr && (
                <p className="ledger-row__ur" lang="ur">
                  {line.titleUr}
                </p>
              )}
              <p className="ledger-row__meta">
                {line.variantTitle} · {money(line.unitPrice, locale)}{" "}
                {t("cart.each")}
              </p>
              <p
                className={`ledger-row__stock${
                  available === 0 ? " ledger-row__stock--out" : ""
                }`}
                role="status"
              >
                {stockLoading
                  ? t("common.loading")
                  : available === 0
                    ? t("product.outOfStock")
                    : available !== undefined && available > 0
                      ? t("product.inStock")
                      : t("product.stockUnavailable")}
              </p>
            </div>

            <div className="ledger-row__actions">
              <QuantityStepper
                lineId={line.id}
                quantity={line.quantity}
                name={line.title}
              />
              <RemoveForm line={line} />
            </div>
          </li>
          );
        })}
      </ul>
    </div>
  );
}
