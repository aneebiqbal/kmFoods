import Link from "next/link";
import {
  CATEGORY_LABELS,
  translate,
  type Category,
  type Locale,
} from "@kmfoods/shared";
import { getDefaultRegion, listCategories, listProducts } from "@/lib/products";
import { getLocale } from "@/i18n/locale";
import { productTitle } from "@/lib/format";
import { ProductCard } from "@/components/product-card";
import { ProductVisual } from "@/components/product-visual";
import { Reveal, Section, SectionHeading } from "@/components/ui";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const locale = await getLocale();
  const region = await getDefaultRegion();

  if (!region) {
    return (
      <Section>
        <p className="text-earth-600">
          {translate(locale, "common.error")}
        </p>
      </Section>
    );
  }

  const [{ products }, categories] = await Promise.all([
    listProducts({ regionId: region.id, limit: 12 }),
    listCategories(),
  ]);

  const hero = products[0];
  const featured = products.slice(0, 8);
  const sidekick = products.slice(1, 4);
  const essentials = products.filter((product) =>
    ["cooking-essentials", "ground-spices", "seeds"].includes(
      product.category ?? ""
    )
  ).slice(0, 4);

  return (
    <div>
      {/* Hero — editorial split: confident type left, layered product art right */}
      <section className="grain relative overflow-hidden bg-cream-100">
        <div className="pointer-events-none absolute -right-24 -top-24 h-96 w-96 rounded-full bg-chili-600/5 blur-3xl" />
        <div className="mx-auto grid max-w-7xl gap-12 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:items-center lg:gap-16 lg:py-28 lg:px-8">
          <Reveal>
            <span className="eyebrow">{translate(locale, "home.heroEyebrow")}</span>
            <h1 className="mt-6 text-5xl font-semibold leading-[1.03] sm:text-6xl lg:text-7xl">
              {translate(locale, "home.heroTitle")}
            </h1>
            <p className="mt-6 max-w-lg text-lg leading-relaxed text-earth-600">
              {translate(locale, "home.heroSubtitle")}
            </p>
            <div className="mt-9 flex flex-wrap items-center gap-3">
              <Link href="/shop" className="btn btn-primary px-6 py-3 text-sm">
                {translate(locale, "home.heroCta")}
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
              </Link>
              <Link href="/cart" className="btn btn-ghost px-6 py-3 text-sm">
                {translate(locale, "home.heroSecondary")}
              </Link>
            </div>
            <dl className="mt-12 grid max-w-md grid-cols-3 gap-6 border-t border-earth-900/10 pt-6">
              {[
                {
                  value: "78+",
                  label: locale === "ur" ? "مصنوعات" : "Products",
                },
                {
                  value: "Lahore",
                  label: locale === "ur" ? "ڈیلیوری" : "Delivery",
                },
                {
                  value: "PKR",
                  label: locale === "ur" ? "قیمتیں" : "Pricing",
                },
              ].map((stat) => (
                <div key={stat.label}>
                  <dt className="font-display text-2xl font-semibold text-chili-700">
                    {stat.value}
                  </dt>
                  <dd className="mt-1 text-xs uppercase tracking-[0.16em] text-earth-500">
                    {stat.label}
                  </dd>
                </div>
              ))}
            </dl>
          </Reveal>

          {/* Layered product composition — Z-axis cascade with real catalogue data */}
          <Reveal delay={140} className="relative">
            <div className="relative mx-auto h-[26rem] max-w-md sm:h-[30rem]">
              {sidekick.map((product, index) => (
                <div
                  key={product.id}
                  className="shell absolute"
                  style={{
                    width: `${58 - index * 10}%`,
                    top: `${index * 20}%`,
                    insetInlineStart: `${index * 38}%`,
                    transform: `rotate(${index % 2 === 0 ? -3 : 3}deg)`,
                    zIndex: 10 - index,
                  }}
                >
                  <div className="core overflow-hidden">
                    <ProductVisual
                      title={product.title}
                      titleUr={product.titleUr}
                      category={product.category}
                      locale={locale}
                      className="aspect-[4/5]"
                    />
                  </div>
                </div>
              ))}
              {hero && (
                <div className="shell absolute inset-x-0 top-0 z-20">
                  <div className="core overflow-hidden">
                    <ProductVisual
                      title={hero.title}
                      titleUr={hero.titleUr}
                      category={hero.category}
                      locale={locale}
                      className="aspect-[4/5]"
                    />
                  </div>
                </div>
              )}
            </div>
            {hero && (
              <p className="mt-5 text-center text-xs uppercase tracking-[0.2em] text-earth-500">
                {productTitle(hero.title, hero.titleUr, locale)}
              </p>
            )}
          </Reveal>
        </div>
      </section>

      {/* Trust */}
      <Section className="py-16">
        <div className="grid gap-4 sm:grid-cols-3">
          {(
            [
              ["home.trustQuality", "home.trustQualityBody"],
              ["home.trustPricing", "home.trustPricingBody"],
              ["home.trustDelivery", "home.trustDeliveryBody"],
            ] as const
          ).map(([title, body], index) => (
            <Reveal key={title} delay={index * 90}>
              <div className="shell h-full">
                <div className="core h-full p-6">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-chili-600/10 text-chili-700">
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <path d="M12 3l7 4v6c0 4-3 6-7 6s-7-2-7-6V7l7-4Z" />
                      <path d="m9 12 2 2 4-4" />
                    </svg>
                  </div>
                  <h3 className="mt-4 text-lg font-semibold">
                    {translate(locale, title)}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-earth-600">
                    {translate(locale, body)}
                  </p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* Featured products */}
      <Section>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <SectionHeading
            eyebrow={translate(locale, "common.tagline")}
            title={translate(locale, "home.bestsellers")}
            subtitle={translate(locale, "home.bestsellersSubtitle")}
          />
          <Link
            href="/shop"
            className="link-underline text-sm font-semibold text-chili-700"
          >
            {translate(locale, "common.viewAll")}
          </Link>
        </div>
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {featured.map((product, index) => (
            <Reveal key={product.id} delay={(index % 4) * 70}>
              <ProductCard product={product} locale={locale} />
            </Reveal>
          ))}
        </div>
      </Section>

      {/* Categories */}
      <Section>
        <SectionHeading
          eyebrow={translate(locale, "common.tagline")}
          title={translate(locale, "home.categories")}
          subtitle={translate(locale, "home.categoriesSubtitle")}
          align="center"
        />
        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {categories.map((category, index) => {
            const labels = CATEGORY_LABELS[category.handle as Category];
            return (
              <Reveal key={category.id} delay={index * 60}>
                <Link
                  href={`/shop?category=${category.handle}`}
                  className="shell group block"
                >
                  <div className="core flex items-center justify-between gap-4 p-5">
                    <div>
                      <h3 className="text-base font-semibold text-earth-900">
                        {labels ? labels[locale] : category.name}
                      </h3>
                      <p className="mt-1 text-xs text-earth-500">
                        {category.handle}
                      </p>
                    </div>
                    <span className="btn-icon shrink-0" aria-hidden="true">
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
                </Link>
              </Reveal>
            );
          })}
        </div>
      </Section>

      {/* Brand story */}
      <Section className="pt-0">
        <div className="shell">
          <div className="core grain relative overflow-hidden px-8 py-14 lg:px-16 lg:py-20">
            <div
              className="pointer-events-none absolute inset-0 opacity-40"
              style={{
                background:
                  "radial-gradient(circle at 12% 0%, rgba(200,155,60,0.28), transparent 55%)",
              }}
            />
            <div className="relative grid gap-10 lg:grid-cols-[1.2fr_1fr] lg:items-center">
              <Reveal>
                <span className="eyebrow">{translate(locale, "about.title")}</span>
                <h2 className="mt-4 text-3xl font-semibold leading-tight sm:text-4xl lg:text-5xl">
                  {locale === "ur"
                    ? "لاہور کے باورچی خانے سے، آپ کے باورچی خانے تک"
                    : "From Lahore's kitchens to yours"}
                </h2>
                <p className="mt-5 max-w-xl text-base leading-relaxed text-earth-600">
                  {translate(locale, "about.body")}
                </p>
                <Link
                  href="/about"
                  className="btn btn-secondary mt-8 px-6 py-3 text-sm"
                >
                  {translate(locale, "nav.about")}
                </Link>
              </Reveal>

              <Reveal delay={120}>
                <ul className="space-y-5">
                  {(
                    [
                      "home.storyPoint1",
                      "home.storyPoint2",
                      "home.storyPoint3",
                    ] as const
                  ).map((key) => (
                    <li key={key} className="flex gap-3">
                      <span
                        className="mt-1 h-2.5 w-2.5 shrink-0 rounded-full bg-gold-400"
                        aria-hidden="true"
                      />
                      <p className="text-sm leading-relaxed text-earth-600">
                        {translate(locale, key)}
                      </p>
                    </li>
                  ))}
                </ul>
              </Reveal>
            </div>
          </div>
        </div>
      </Section>

      {/* Kitchen essentials */}
      {essentials.length > 0 && (
        <Section className="pt-0">
          <div className="shell">
            <div className="core grid gap-8 p-8 lg:grid-cols-[1fr_1.4fr] lg:items-center lg:p-12">
              <Reveal>
                <span className="eyebrow">{translate(locale, "home.essentials")}</span>
                <h2 className="mt-4 text-3xl font-semibold leading-tight sm:text-4xl">
                  {translate(locale, "home.essentialsSubtitle")}
                </h2>
                <Link
                  href="/shop"
                  className="btn btn-secondary mt-8 px-6 py-3 text-sm"
                >
                  {translate(locale, "nav.shop")}
                </Link>
              </Reveal>
              <div className="grid grid-cols-2 gap-4">
                {essentials.map((product) => (
                  <Link key={product.id} href={`/product/${product.handle}`} className="shell">
                    <div className="core overflow-hidden">
                      <ProductVisual
                        title={product.title}
                        titleUr={product.titleUr}
                        category={product.category}
                        locale={locale}
                        className="aspect-square"
                      />
                      <p className="p-3 text-xs font-medium text-earth-700">
                        {productTitle(product.title, product.titleUr, locale)}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </Section>
      )}

      {/* WhatsApp CTA */}
      <Section>
        <div className="shell">
          <div className="core grain relative overflow-hidden px-8 py-14 text-center lg:py-20">
            <div
              className="pointer-events-none absolute inset-0 opacity-30"
              style={{
                background:
                  "radial-gradient(circle at 50% 0%, rgba(200,155,60,0.35), transparent 60%)",
              }}
            />
            <h2 className="relative mx-auto max-w-2xl text-3xl font-semibold leading-tight sm:text-4xl lg:text-5xl">
              {translate(locale, "home.whatsappTitle")}
            </h2>
            <p className="relative mx-auto mt-5 max-w-xl text-base leading-relaxed text-earth-600">
              {translate(locale, "home.whatsappBody")}
            </p>
            <div className="relative mt-9 flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/cart"
                className="btn btn-primary px-7 py-3 text-sm"
              >
                {translate(locale, "home.whatsappCta")}
              </Link>
              <Link href="/shop" className="btn btn-ghost px-7 py-3 text-sm">
                {translate(locale, "nav.shop")}
              </Link>
            </div>
            <ol className="relative mx-auto mt-12 grid max-w-3xl gap-4 text-start sm:grid-cols-3">
              {(
                [
                  "home.steps1",
                  "home.steps2",
                  "home.steps3",
                ] as const
              ).map((key, index) => (
                <li key={key} className="flex gap-3">
                  <span className="font-display text-xl font-semibold text-chili-700">
                    {index + 1}
                  </span>
                  <p className="text-sm leading-relaxed text-earth-600">
                    {translate(locale, key)}
                  </p>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </Section>
    </div>
  );
}
