"use client";

import Link from "next/link";
import { useState } from "react";
import { useLanguage } from "@/i18n/language-context";
import { money, productTitle } from "@/lib/format";
import type { StoreProduct } from "@/lib/types";
import { ProductVisual } from "@/components/product-visual";
import { ProductAction } from "@/components/add-to-cart-button";

/**
 * The Living Shelf — the homepage signature.
 *
 * A tactile rail of real ingredients. Selecting one brings its composition
 * forward in an arch stage and shows the real pack sizes, price and a
 * variant-safe action. Touch-friendly, keyboard-focusable, reduced-motion safe.
 */
export function LivingShelf({ items }: { items: StoreProduct[] }) {
  const { t, locale } = useLanguage();
  const [active, setActive] = useState(0);
  const product = items[active];

  if (!product) return null;

  const title = productTitle(product.title, product.titleUr, locale);
  const pack = product.variants.map((variant) => variant.title).join(" / ");

  return (
    <div className="grid gap-10 lg:grid-cols-12 lg:items-center">
      <div className="min-w-0 lg:col-span-7">
        <div className="rail flex min-w-0 snap-x gap-3 overflow-x-auto pb-2">
          {items.map((item, index) => {
            const itemTitle = productTitle(item.title, item.titleUr, locale);
            const isActive = index === active;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setActive(index)}
                aria-pressed={isActive}
                className={`w-24 shrink-0 snap-start border text-start transition-colors duration-[220ms] ${
                  isActive
                    ? "border-ink bg-paper-2"
                    : "border-rule bg-paper hover:border-ink"
                }`}
              >
                <ProductVisual
                  title={item.title}
                  titleUr={item.titleUr}
                  locale={locale}
                  className="aspect-square"
                />
                <span className="block p-3">
                  <span className="block truncate text-sm text-ink">
                    {itemTitle}
                  </span>
                  <span className="price mt-0.5 block text-sm">
                    {item.minPrice !== null
                      ? money(item.minPrice, locale)
                      : t("product.priceOnRequest")}
                  </span>
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="lg:col-span-5">
        <ProductVisual
          title={product.title}
          titleUr={product.titleUr}
          locale={locale}
          variantLabel={pack}
          className="photo photo--arch aspect-[4/5]"
        />
        <h3 className="text-title mt-5 text-ink">{title}</h3>
        <p className="small mt-1">{pack || "Pack size to be confirmed"}</p>
        <div className="mt-5 flex items-center justify-between gap-4">
          <span className="price text-3xl">
            {product.minPrice !== null
              ? money(product.minPrice, locale)
              : t("product.priceOnRequest")}
          </span>
          {product.variants.length > 0 && (
            <ProductAction product={product} locale={locale} />
          )}
        </div>
        <Link href={`/product/${product.handle}`} className="link mt-4 inline-block text-sm">
          {t("product.view")}
        </Link>
      </div>
    </div>
  );
}
