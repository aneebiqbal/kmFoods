import type { Locale } from "@kmfoods/shared";
import { productArt } from "@/lib/product-art";

/**
 * Product visual: a verified photograph when one honestly depicts the product,
 * otherwise the product set in type. Never a gradient standing in for a photo.
 */
export function ProductVisual({
  title,
  titleUr,
  locale = "en",
  className = "",
  variantLabel,
  compact = false,
}: {
  title: string;
  titleUr: string | null;
  locale?: Locale;
  className?: string;
  variantLabel?: string | null | undefined;
  /** A small square for list rows: the initial alone, no overflowing name. */
  compact?: boolean;
}) {
  const art = productArt(title);
  const display = locale === "ur" ? titleUr || title : title;
  const initial = (locale === "ur" ? titleUr ?? title : title).trim().charAt(0) || "KM";

  if (art) {
    return (
      <div className={`photo ${className}`} role="img" aria-label={title}>
        {/* eslint-disable-next-line @next/next/no-img-element -- a verified local asset, not a Next image config source */}
        <img src={art} alt="" loading="lazy" />
      </div>
    );
  }

  if (compact) {
    return (
      <div
        className={`flex items-center justify-center bg-paper-2 ${className}`}
        role="img"
        aria-label={title}
      >
        <span className="font-display text-2xl leading-none text-ink" aria-hidden="true">
          {initial}
        </span>
      </div>
    );
  }

  return (
    <div
      className={`flex flex-col items-center justify-center gap-2 bg-paper-2 p-6 text-center ${className}`}
      role="img"
      aria-label={title}
    >
      <span className="font-display text-3xl leading-none text-ink" aria-hidden="true">
        {initial}
      </span>
      <span className="font-display text-xl leading-tight text-ink">{display}</span>
      {variantLabel && <span className="small mt-1">{variantLabel}</span>}
    </div>
  );
}
