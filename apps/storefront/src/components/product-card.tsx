import Link from "next/link";
import { CATEGORY_LABELS, type Category, type Locale } from "@kmfoods/shared";
import { money, productTitle } from "@/lib/format";
import type { StoreProduct } from "@/lib/types";
import { ProductVisual } from "@/components/product-visual";
import { productArt } from "@/lib/product-art";
import { AddToCartButton } from "@/components/add-to-cart-button";

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
}: {
  product: StoreProduct;
  locale: Locale;
  className?: string;
  variantLabel?: string | null;
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
    />
  );
}

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
  const art = productArt(product.title);
  const unavailable = product.variants.length === 0 || product.minPrice === null;
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
        {unavailable && (
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
          {art && product.variants.length > 0 && (
            <AddToCartButton
              variantId={product.variants[0]?.id ?? ""}
              disabled={unavailable}
              label={locale === "ur" ? "ڈالیں" : "Add"}
              className="w-auto"
            />
          )}
        </div>
      </div>
    </div>
  );
}
