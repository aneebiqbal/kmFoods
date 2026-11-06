import type { Metadata } from "next";
import type { Locale } from "@kmfoods/shared";
import { BRAND_LOGO_PATH } from "@/components/brand-logo";

const SITE_NAME = "KM Foods";
export { BRAND_LOGO_PATH };
const TAGLINE = "Har Ghar Ka Zaiqa";
const DEFAULT_DESCRIPTION =
  "Premium Pakistani spices, dry fruits, seeds and kitchen essentials, delivered across Lahore.";

export function siteMetadata(locale: Locale): Metadata {
  const description =
    locale === "ur"
      ? "پاکستانی مصالحہ جات، خشک میوہ جات، بیج اور کچن کی ضروری چیزیں — پورے لاہور میں ڈیلیوری۔"
      : DEFAULT_DESCRIPTION;

  return {
    metadataBase: new URL(
      process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"
    ),
    title: {
      default: `${SITE_NAME} — ${TAGLINE}`,
      template: `%s — ${SITE_NAME}`,
    },
    description,
    openGraph: {
      type: "website",
      siteName: SITE_NAME,
      title: `${SITE_NAME} — ${TAGLINE}`,
      description,
      images: [
        {
          url: BRAND_LOGO_PATH,
          width: 1376,
          height: 768,
          alt: `${SITE_NAME} — ${TAGLINE}`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${SITE_NAME} — ${TAGLINE}`,
      description,
      images: [BRAND_LOGO_PATH],
    },
    icons: {
      icon: "/favicon.svg",
      apple: BRAND_LOGO_PATH,
    },
  };
}
