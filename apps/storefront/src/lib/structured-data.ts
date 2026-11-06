import { formatPKR } from "@kmfoods/shared";
import { BRAND_LOGO_PATH } from "@/components/brand-logo";

function siteOrigin(): string {
  return process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
}

export function organizationJsonLd() {
  const origin = siteOrigin();
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "KM Foods",
    url: origin,
    logo: `${origin}${BRAND_LOGO_PATH}`,
  };
}

export function brandWithLogo() {
  return {
    "@type": "Brand" as const,
    name: "KM Foods",
    logo: `${siteOrigin()}${BRAND_LOGO_PATH}`,
  };
}

/**
 * Product structured data uses numeric prices with an explicit PKR currency,
 * which is the only form schema.org validates reliably.
 */
export function priceWithCurrency(amount: number): string {
  return `${formatPKR(amount)}`;
}

export function productJsonLd(product: {
  handle: string;
  title: string;
  description: string | null;
  minPrice: number | null;
  category: string | null;
  status: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.title,
    description: product.description ?? undefined,
    brand: brandWithLogo(),
    ...(product.minPrice
      ? {
          offers: {
            "@type": "Offer",
            price: product.minPrice,
            priceCurrency: "PKR",
            availability:
              product.status === "published"
                ? "https://schema.org/InStock"
                : "https://schema.org/OutOfStock",
          },
        }
      : {}),
  };
}
