import type { Locale } from "@kmfoods/shared";

/**
 * Original, non-photographic product artwork.
 *
 * No approved product photography exists yet, so the catalogue uses an
 * editorial "type poster" treatment: a category-coloured wash with the Urdu
 * name set large. It never pretends to be a photograph of the real product.
 * When Medusa has a thumbnail, `ProductMedia` uses it instead.
 */

type Art = { from: string; to: string; ring: string; text: string };

const CATEGORY_ART: Record<string, Art> = {
  "chilies-peppers": { from: "#E03A44", to: "#5C090F", ring: "#F1E6D6", text: "#FDFBF7" },
  "whole-spices": { from: "#A9713A", to: "#2B1E14", ring: "#E5D5BF", text: "#FDFBF7" },
  "ground-spices": { from: "#D9A94C", to: "#7A4E12", ring: "#FDFBF7", text: "#3B2A1E" },
  seeds: { from: "#3C7250", to: "#0F1D14", ring: "#F1E6D6", text: "#FDFBF7" },
  "dry-fruits-nuts": { from: "#BE9135", to: "#4A3526", ring: "#FDFBF7", text: "#FDFBF7" },
  "herbs-seasonings": { from: "#5E8C46", to: "#16291D", ring: "#F1E6D6", text: "#FDFBF7" },
  sweeteners: { from: "#E2D0AF", to: "#8A6A3B", ring: "#7A4E12", text: "#3B2A1E" },
  "cooking-essentials": { from: "#7E6247", to: "#1C130C", ring: "#E5D5BF", text: "#FDFBF7" },
};

const FALLBACK_ART: Art = {
  from: "#8C5A2B",
  to: "#2B1E14",
  ring: "#E5D5BF",
  text: "#FDFBF7",
};

export function productArt(category: string | null): Art {
  return CATEGORY_ART[category ?? ""] ?? FALLBACK_ART;
}

export function ProductVisual({
  title,
  titleUr,
  category,
  locale = "en",
  className = "",
  variantLabel,
}: {
  title: string;
  titleUr: string | null;
  category: string | null;
  locale?: Locale;
  className?: string;
  variantLabel?: string | null | undefined;
}) {
  const art = productArt(category);
  const display = locale === "ur" ? titleUr || title : title;
  const initial = (titleUr ?? title).trim().charAt(0) || "KM";

  return (
    <div
      className={`relative flex flex-col items-center justify-center overflow-hidden ${className}`}
      style={{
        background: `radial-gradient(circle at 30% 22%, ${art.from}, ${art.to} 78%)`,
      }}
      role="img"
      aria-label={title}
    >
      {/* Concentric ring motif — a restrained, original pattern. */}
      <svg
        className="pointer-events-none absolute inset-0 h-full w-full opacity-12"
        viewBox="0 0 100 100"
        preserveAspectRatio="xMidYMid slice"
        aria-hidden="true"
      >
        <circle cx="50" cy="50" r="46" fill="none" stroke={art.ring} strokeWidth="0.6" />
        <circle cx="50" cy="50" r="34" fill="none" stroke={art.ring} strokeWidth="0.4" />
        <circle cx="50" cy="50" r="22" fill="none" stroke={art.ring} strokeWidth="0.3" />
      </svg>

      <span
        className="relative font-display text-7xl leading-none drop-shadow-sm"
        style={{ color: art.text }}
        aria-hidden="true"
      >
        {initial}
      </span>

      <span
        className="relative mt-3 max-w-[85%] text-center text-[11px] font-medium leading-snug"
        style={{ color: art.text }}
      >
        {display}
      </span>

      {variantLabel && (
        <span
          className="relative mt-2 rounded-full px-2 py-0.5 text-[9px] font-semibold uppercase tracking-[0.14em]"
          style={{ background: "rgba(0,0,0,0.18)", color: art.text }}
        >
          {variantLabel}
        </span>
      )}

      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(circle at 74% 84%, rgba(255,255,255,0.18), transparent 55%)",
        }}
      />
    </div>
  );
}
