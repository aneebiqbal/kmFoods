import Link from "next/link";
import { translate } from "@kmfoods/shared";
import { BrandLogo } from "@/components/brand-logo";
import { getLocale } from "@/i18n/locale";
import { Section } from "@/components/ui";

export default async function NotFound() {
  const locale = await getLocale();

  return (
    <Section className="text-center">
      <BrandLogo
        alt={translate(locale, "common.brand")}
        className="mx-auto h-11 w-auto object-contain"
      />
      <p className="mt-8 font-display text-7xl font-semibold text-chili-700">404</p>
      <h1 className="mt-4 text-2xl font-semibold">
        {locale === "ur" ? "صفحہ نہیں ملا" : "Page not found"}
      </h1>
      <Link href="/" className="btn btn-primary mt-8 px-6 py-3 text-sm">
        {translate(locale, "nav.home")}
      </Link>
    </Section>
  );
}
