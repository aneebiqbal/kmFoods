"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
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
 * The Market Shelf — KM Foods' signature commerce module.
 *
 * Real categories, real products, real PKR prices. Each shelf is a ruled row;
 * a tile adds a real variant to the real cart in one tap.
 */
export function MarketShelf({ shelves }: { shelves: Shelf[] }) {
  const { t, locale } = useLanguage();
  const active = shelves.slice(0, 5);

  return (
    <div>
      {active.map((shelf) => {
        const labels = CATEGORY_LABELS[shelf.category as Category];
        return (
          <section key={shelf.category} className="border-t border-rule py-10 first:border-t-0 first:pt-0">
            <div className="flex flex-wrap items-baseline justify-between gap-3">
              <h3 className="text-title text-ink">
                {labels ? labels[locale] : shelf.category}
              </h3>
              <span className="small">
                {shelf.products.length} {t("pantry.items")}
              </span>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
              {shelf.products.slice(0, 5).map((product) => (
                <ShelfTile key={product.id} product={product} locale={locale} />
              ))}
            </div>
          </section>
        );
      })}
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
    <div className="flex flex-col">
      <Link
        href={`/product/${product.handle}`}
        className="block"
        aria-label={productTitle(product.title, product.titleUr, locale)}
      >
        <ProductVisual
          title={product.title}
          titleUr={product.titleUr}
          locale={locale}
          className="aspect-square"
        />
      </Link>

      <div className="mt-3 flex-1">
        <Link
          href={`/product/${product.handle}`}
          className="block text-sm font-medium leading-snug text-ink link"
        >
          {productTitle(product.title, product.titleUr, locale)}
        </Link>
        <p className="price mt-1 text-base">
          {selected?.price != null ? money(selected.price, locale) : t("product.priceOnRequest")}
        </p>
      </div>

      {product.variants.length > 1 && (
        <div className="mt-3 flex flex-wrap gap-1.5" role="group" aria-label={t("product.packSize")}>
          {product.variants.map((variant) => (
            <button
              key={variant.id}
              type="button"
              onClick={() => setVariantId(variant.id)}
              aria-pressed={variantId === variant.id}
              className={`rounded-pill border px-2.5 py-1 text-xs font-medium transition-colors duration-[220ms] ${
                variantId === variant.id
                  ? "border-ink bg-ink text-paper"
                  : "border-rule bg-paper text-ink-2 hover:border-ink"
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
        className="btn btn-ghost mt-3 w-full px-3 py-2 text-xs"
      >
        {pending ? t("common.loading") : outOfStock ? t("product.outOfStock") : t("product.addToCart")}
      </button>

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
