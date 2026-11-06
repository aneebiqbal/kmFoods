import Link from "next/link";
import { CATEGORY_LABELS, type Category, type Locale } from "@kmfoods/shared";
import { money, productTitle } from "@/lib/format";
import type { StoreProduct } from "@/lib/types";
import { ProductVisual, productArt } from "@/components/product-visual";

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
    return <span className={`text-sm text-earth-500 ${className}`}>—</span>;
  }
  return (
    <span className={`font-semibold text-earth-900 ${className}`}>
      {money(price, locale)}
    </span>
  );
}

/**
 * Uses the real Medusa thumbnail when one exists, otherwise the original
 * non-photographic artwork.
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
      <div
        className={`relative overflow-hidden bg-cream-100 ${className}`}
        role="img"
        aria-label={product.title}
      >
        {/* eslint-disable-next-line @next/next/no-img-element -- Medusa URLs are not in the Next image config */}
        <img
          src={product.thumbnail}
          alt={product.title}
          loading="lazy"
          className="h-full w-full object-cover"
        />
      </div>
    );
  }

  return (
    <ProductVisual
      title={product.title}
      titleUr={product.titleUr}
      category={product.category}
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
  const art = productArt(product.category);
  const unavailable = product.variants.length === 0 || product.minPrice === null;

  return (
    <Link href={`/product/${product.handle}`} className="shell group block">
      <div className="core overflow-hidden">
        <div className="relative">
          <ProductMedia
            product={product}
            locale={locale}
            className="aspect-[4/3]"
            variantLabel={product.variants.map((v) => v.title).join(" / ")}
          />
          {unavailable && (
            <span
              className="absolute inset-0 flex items-center justify-center text-[10px] font-semibold uppercase tracking-[0.18em]"
              style={{ background: "rgba(28,19,12,0.55)", color: "#FDFBF7" }}
            >
              Price on request
            </span>
          )}
        </div>

        <div className="p-5">
          <div className="flex items-center gap-2">
            {labels && <span className="eyebrow">{labels[locale]}</span>}
            <span
              className="ml-auto h-2 w-2 rounded-full"
              style={{ background: art.from }}
              aria-hidden="true"
            />
          </div>

          <h3 className="mt-3 text-base font-semibold leading-snug text-earth-900 sm:text-lg">
            {title}
          </h3>
          <p className="mt-1 text-xs text-earth-500">
            {product.variants.length > 0
              ? product.variants.map((variant) => variant.title).join(" / ")
              : "Pack size to be confirmed"}
          </p>

          <div className="mt-4 flex items-center justify-between">
            <PriceTag price={product.minPrice} locale={locale} />
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
          </div>
        </div>
      </div>
    </Link>
  );
}
