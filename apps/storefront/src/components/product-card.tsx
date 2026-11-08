import Link from "next/link";
import { CATEGORY_LABELS, type Category, type Locale } from "@kmfoods/shared";
import { money, productTitle } from "@/lib/format";
import type { StoreProduct } from "@/lib/types";
import { ProductVisual } from "@/components/product-visual";
import { ProductAction } from "@/components/add-to-cart-button";

export function PriceTag({
  price,
  locale,
  className = "",
}: {
  price: number | null;
  locale: Locale;
  className?: string;
}) {
  if (price === null) {
    return <span className={`small ${className}`}>Price on request</span>;
  }
  return <span className={`price text-lg ${className}`}>{money(price, locale)}</span>;
}

/**
 * Uses the real Medusa thumbnail when one exists, otherwise a verified
 * photograph or the product set in type.
 */
export function ProductMedia({
  product,
  locale,
  className = "",
  variantLabel,
  compact = false,
}: {
  product: StoreProduct;
  locale: Locale;
  className?: string;
  variantLabel?: string | null;
  compact?: boolean;
}) {
  if (product.thumbnail) {
    return (
      <div className={`photo ${className}`}>
        {/* eslint-disable-next-line @next/next/no-img-element -- Medusa URLs are not in the Next image config */}
        <img src={product.thumbnail} alt={product.title} loading="lazy" />
      </div>
    );
  }

  return (
    <ProductVisual
      title={product.title}
      titleUr={product.titleUr}
      locale={locale}
      variantLabel={variantLabel}
      className={className}
      compact={compact}
    />
  );
}

function unavailable(product: StoreProduct): boolean {
  return product.variants.length === 0 || product.minPrice === null;
}

/**
 * The standard grid card: visual, category, name, pack and the variant-safe
 * action. Used for related ingredients and the homepage shelf.
 */
export function ProductCard({
  product,
  locale,
}: {
  product: StoreProduct;
  locale: Locale;
}) {
  const title = productTitle(product.title, product.titleUr, locale);
  const labels = product.category
    ? CATEGORY_LABELS[product.category as Category]
    : null;
  const pack = product.variants.map((variant) => variant.title).join(" / ");

  return (
    <div className="group flex h-full flex-col border border-rule bg-paper">
      <Link
        href={`/product/${product.handle}`}
        className="relative block"
        aria-label={title}
      >
        <ProductMedia
          product={product}
          locale={locale}
          className="aspect-[4/3]"
          variantLabel={pack}
        />
        {unavailable(product) && (
          <span className="absolute inset-0 flex items-center justify-center bg-ink/55 text-sm text-paper">
            Price on request
          </span>
        )}
      </Link>

      <div className="flex flex-1 flex-col gap-2 p-3 sm:p-4">
        {labels && <span className="small">{labels[locale]}</span>}
        <h3 className="text-xs leading-snug text-ink sm:text-title">
          <Link href={`/product/${product.handle}`} className="link">
            {title}
          </Link>
        </h3>
        <p className="small">{pack || "Pack size to be confirmed"}</p>

        <div className="mt-auto flex items-center justify-between gap-3 pt-2">
          <PriceTag price={product.minPrice} locale={locale} />
          {product.variants.length > 0 && (
            <ProductAction product={product} locale={locale} />
          )}
        </div>
      </div>
    </div>
  );
}

/**
 * The ledger row: number, ingredient visual, name, category and pack, price and
 * the variant-safe action. The shop's primary merchandising unit.
 */
export function ProductRow({
  product,
  locale,
  index,
}: {
  product: StoreProduct;
  locale: Locale;
  index: number;
}) {
  const title = productTitle(product.title, product.titleUr, locale);
  const labels = product.category
    ? CATEGORY_LABELS[product.category as Category]
    : null;
  const pack = product.variants.map((variant) => variant.title).join(" / ");

  return (
    <div className="group flex flex-wrap items-center gap-x-3 gap-y-2 border-b border-rule py-4 sm:gap-x-4">
      <span className="numeral w-8 shrink-0 text-sm">
        {String(index + 1).padStart(2, "0")}
      </span>

      <Link
        href={`/product/${product.handle}`}
        className="shrink-0 border border-transparent transition-colors duration-[220ms] hover:border-ink"
        aria-label={title}
      >
        <ProductMedia
          product={product}
          locale={locale}
          className="h-20 w-20 sm:h-24 sm:w-24"
          compact
        />
      </Link>

      <div className="min-w-0 flex-1 basis-40">
        <h3 className="text-base leading-snug text-ink sm:text-title">
          <Link href={`/product/${product.handle}`} className="link">
            {title}
          </Link>
        </h3>
        <p className="small mt-0.5">
          {labels ? labels[locale] : ""} · {pack || "Pack size to be confirmed"}
        </p>
      </div>

      <div className="ms-auto flex shrink-0 items-center gap-2 sm:gap-3">
        <PriceTag price={product.minPrice} locale={locale} />
        {product.variants.length > 0 && (
          <ProductAction product={product} locale={locale} />
        )}
      </div>
    </div>
  );
}
