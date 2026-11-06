"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useLanguage } from "@/i18n/language-context";
import { CATEGORY_LABELS, type Category, type Locale } from "@kmfoods/shared";
import { money, productTitle } from "@/lib/format";
import type { StoreProduct } from "@/lib/types";
import { addToCartAction } from "@/lib/cart-actions";
import { IDLE, type ActionState } from "@/lib/action-state";
import { useStock } from "@/lib/use-stock";
import { ProductVisual } from "@/components/product-visual";

export type Shelf = {
  category: string;
  products: StoreProduct[];
};

/**
 * The Pantry Shelf — KM Foods' signature commerce module.
 *
 * A dark atelier plate with parchment shelves. Each shelf is a real category
 * from the catalogue, and every tile adds a real variant to the real cart.
 */
export function PantryShelf({ shelves }: { shelves: Shelf[] }) {
  const { t, locale } = useLanguage();
  const active = shelves.slice(0, 5);

  return (
    <div className="stage">
      <div className="core-dark grain grain-dark relative overflow-hidden p-6 sm:p-10 lg:p-14">
        <div
          className="pointer-events-none absolute -right-24 -top-24 h-96 w-96 rounded-full bg-saffron-500/10 blur-3xl"
          aria-hidden="true"
        />

        <div className="relative flex flex-wrap items-end justify-between gap-6">
          <div className="max-w-xl">
            <span className="eyebrow eyebrow-on-dark">
              {t("pantry.eyebrow")}
            </span>
            <h2 className="display-section mt-5 text-4xl text-bone-50 sm:text-5xl">
              {t("pantry.title")}
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-bone-100/70 sm:text-base">
              {t("pantry.subtitle")}
            </p>
          </div>
          <p className="text-xs text-bone-100/50">
            {t("pantry.hint")}
          </p>
        </div>

        <div className="relative mt-12 space-y-10">
          {active.map((shelf, index) => {
            const labels = CATEGORY_LABELS[shelf.category as Category];
            return (
              <section key={shelf.category}>
                <div className="mb-5 flex items-baseline gap-4">
                  <span className="numeral text-3xl">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <h3 className="text-lg font-semibold text-bone-50">
                    {labels ? labels[locale] : shelf.category}
                  </h3>
                  <span className="text-[0.625rem] uppercase tracking-[0.24em] text-bone-100/40">
                    {shelf.products.length} {t("pantry.items")}
                  </span>
                </div>

                <div className="shelf p-4 sm:p-5">
                  <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
                    {shelf.products.slice(0, 5).map((product) => (
                      <ShelfTile key={product.id} product={product} locale={locale} />
                    ))}
                  </div>
                  <div className="shelf-board mt-4" aria-hidden="true" />
                </div>
              </section>
            );
          })}
        </div>

        <div className="relative mt-12 flex flex-wrap items-center gap-3">
          <Link href="/shop" className="btn btn-accent px-6 py-3 text-sm">
            {t("pantry.viewAll")}
            <span className="btn-icon" aria-hidden="true">
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </span>
          </Link>
          <span className="text-xs text-bone-100/50">{t("pantry.note")}</span>
        </div>
      </div>
    </div>
  );
}

function ShelfTile({
  product,
  locale,
}: {
  product: StoreProduct;
  locale: Locale;
}) {
  const { t } = useLanguage();
  const [variantId, setVariantId] = useState(product.variants[0]?.id ?? "");
  const [state, setState] = useState<ActionState>(IDLE);
  const [pending, startTransition] = useTransition();
  const { stock } = useStock(product.variants.map((variant) => variant.id));

  const selected = product.variants.find((variant) => variant.id === variantId);
  const outOfStock = selected ? (stock[selected.id] ?? 1) <= 0 : false;
  const unavailable = product.variants.length === 0 || product.minPrice === null;

  function add() {
    const formData = new FormData();
    formData.set("variantId", variantId);
    formData.set("quantity", "1");
    startTransition(async () => {
      setState(await addToCartAction(IDLE, formData));
    });
  }

  return (
    <div className="group flex flex-col">
      <Link
        href={`/product/${product.handle}`}
        className="core-dark relative block overflow-hidden rounded-2xl"
      >
        <ProductVisual
          title={product.title}
          titleUr={product.titleUr}
          category={product.category}
          locale={locale}
          className="aspect-[4/5] transition-transform duration-700 group-hover:scale-[1.04]"
        />
        {unavailable && (
          <span className="absolute inset-0 flex items-center justify-center bg-aubergine-900/60 text-[0.5625rem] font-semibold uppercase tracking-[0.18em] text-bone-50">
            {t("product.priceOnRequest")}
          </span>
        )}
      </Link>

      <div className="mt-3 flex-1">
        <Link
          href={`/product/${product.handle}`}
          className="block text-[0.8125rem] font-semibold leading-snug text-bone-50 hover:text-saffron-400"
        >
          {productTitle(product.title, product.titleUr, locale)}
        </Link>
        <p className="price mt-1 text-sm text-saffron-400">
          {selected?.price !== null && selected?.price !== undefined
            ? money(selected.price, locale)
            : t("product.priceOnRequest")}
        </p>
      </div>

      {product.variants.length > 1 && (
        <div className="mt-2.5 flex flex-wrap gap-1.5" role="group" aria-label={t("product.packSize")}>
          {product.variants.map((variant) => (
            <button
              key={variant.id}
              type="button"
              onClick={() => setVariantId(variant.id)}
              aria-pressed={variantId === variant.id}
              className={`rounded-full border px-2.5 py-1 text-[0.625rem] font-semibold transition-colors ${
                variantId === variant.id
                  ? "border-saffron-400 bg-saffron-400 text-aubergine-900"
                  : "border-bone-50/35 bg-bone-50/5 text-bone-100/85 hover:border-bone-50/70 hover:text-bone-50"
              }`}
            >
              {variant.title}
            </button>
          ))}
        </div>
      )}

      <button
        type="button"
        onClick={add}
        disabled={pending || !selected || outOfStock || unavailable}
        className="btn btn-on-dark mt-3 w-full px-3 py-2 text-[0.6875rem] disabled:cursor-not-allowed disabled:opacity-40"
      >
        {pending ? t("common.loading") : outOfStock ? t("product.outOfStock") : t("product.addToCart")}
      </button>

      {state.status !== "idle" && (
        <p
          className={`mt-1.5 text-center text-[0.625rem] ${
            state.status === "success" ? "text-olive-400" : "text-paprika-400"
          }`}
          role="status"
        >
          {state.message}
        </p>
      )}
    </div>
  );
}
