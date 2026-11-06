import Image from "next/image";

/**
 * Single brand asset used across the storefront (header, footer, policies, SEO).
 * An original SVG mark so it stays sharp at any size and works on any
 * background — the previous JPEG carried a cream box and a 16:9 crop.
 */
export const BRAND_LOGO_PATH = "/kmfoods-logo.svg";

const LOGO_WIDTH = 340;
const LOGO_HEIGHT = 84;

export function BrandLogo({
  alt,
  className = "h-9 w-auto",
  priority = false,
}: {
  alt: string;
  className?: string;
  priority?: boolean;
}) {
  return (
    <Image
      src={BRAND_LOGO_PATH}
      alt={alt}
      width={LOGO_WIDTH}
      height={LOGO_HEIGHT}
      className={className}
      priority={priority}
    />
  );
}
