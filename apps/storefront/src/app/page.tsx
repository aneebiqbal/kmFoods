import Link from "next/link";
import { CATEGORY_LABELS, translate, type Category, type Locale } from "@kmfoods/shared";
import { getDefaultRegion, listCategories, listProducts } from "@/lib/products";
import { getLocale } from "@/i18n/locale";
import { money, productTitle } from "@/lib/format";
import { ProductCard } from "@/components/product-card";
import { ProductVisual } from "@/components/product-visual";
import { ProductMedia } from "@/components/product-card";
import { PantryShelf, type Shelf } from "@/components/pantry-shelf";
import { Reveal, Section, SectionHeading } from "@/components/ui";
import type { StoreProduct } from "@/lib/types";

export const dynamic = "force-dynamic";

/* ── Scrolling ingredient rail ─────────────────────────────────────────── */
const RAIL_WORDS = [
  "Red Chili",
  "Turmeric",
  "Black Pepper",
  "Cumin",
  "Cardamom",
  "Cinnamon",
  "Almond",
  "Flax Seed",
  "Saffron",
  "Olive",
  "Coriander",
  "Fennel",
];

function IngredientRail() {
  return (
    <div
      className="overflow-hidden border-y border-ink-900/8 bg-bone-100 py-4"
      aria-hidden="true"
    >
      <div className="animate-marquee flex w-max items-center gap-10">
        {[...RAIL_WORDS, ...RAIL_WORDS].map((word, index) => (
          <span
            key={`${word}-${index}`}
            className="flex items-center gap-10 text-[0.6875rem] font-semibold uppercase tracking-[0.3em] text-ink-500"
          >
            {word}
            <span className="h-1 w-1 rounded-full bg-paprika-500" />
          </span>
        ))}
      </div>
    </div>
  );
}

/* ── Scene 1 · Immersive introduction ──────────────────────────────────── */
function Hero({
  hero,
  sidekicks,
  locale,
}: {
  hero: StoreProduct;
  sidekicks: StoreProduct[];
  locale: Locale;
}) {
  return (
    <section className="grain grain-dark relative overflow-hidden bg-aubergine-900 text-bone-100">
      {/* Atmospheric glows */}
      <div
        className="pointer-events-none absolute -left-32 top-0 h-[38rem] w-[38rem] rounded-full bg-paprika-500/12 blur-3xl"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -right-40 bottom-0 h-[42rem] w-[42rem] rounded-full bg-saffron-500/10 blur-3xl"
        aria-hidden="true"
      />

      {/* Drifting spice motes — pure CSS, cheap on the GPU */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
        {[
          { left: "12%", size: 6, delay: "0s", duration: "11s" },
          { left: "28%", size: 4, delay: "1.4s", duration: "14s" },
          { left: "47%", size: 7, delay: "0.8s", duration: "12s" },
          { left: "63%", size: 5, delay: "2.2s", duration: "15s" },
          { left: "79%", size: 4, delay: "0.4s", duration: "10s" },
          { left: "90%", size: 6, delay: "1.9s", duration: "13s" },
        ].map((mote, index) => (
          <span
            key={index}
            className="animate-drift absolute top-1/3 rounded-full bg-saffron-400/40"
            style={{
              left: mote.left,
              width: mote.size,
              height: mote.size,
              animationDelay: mote.delay,
              animationDuration: mote.duration,
            }}
          />
        ))}
      </div>

      <div className="relative mx-auto grid max-w-[90rem] gap-14 px-4 pb-20 pt-16 sm:px-6 lg:grid-cols-[1.15fr_1fr] lg:items-center lg:gap-20 lg:px-8 lg:pb-28 lg:pt-24">
        <Reveal>
          <span className="eyebrow eyebrow-on-dark">
            {translate(locale, "home.heroEyebrow")}
          </span>
          <h1 className="display-hero mt-7 text-[clamp(3rem,8.5vw,7rem)] text-bone-50">
            {translate(locale, "home.heroTitle")}
          </h1>
          <p className="mt-7 max-w-lg text-base leading-relaxed text-bone-100/75 sm:text-lg">
            {translate(locale, "home.heroSubtitle")}
          </p>
          <div className="mt-10 flex flex-wrap items-center gap-3">
            <Link href="/shop" className="btn btn-accent px-7 py-3.5 text-sm">
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
            <Link href="/cart" className="btn btn-on-dark px-7 py-3.5 text-sm">
              {translate(locale, "home.heroSecondary")}
            </Link>
          </div>
        </Reveal>

          {/* Layered ingredient composition */}
          <Reveal delay={160} className="relative">
            <div className="relative mx-auto h-[24rem] max-w-md sm:h-[30rem]">
              {sidekicks.map((product, index) => (
                <div
                  key={product.id}
                  className="stage absolute"
                  style={{
                    width: "46%",
                    top: `${5 + index * 17}%`,
                    insetInlineStart: `${index * 48}%`,
                    transform: `rotate(${index % 2 === 0 ? -5 : 5}deg)`,
                    zIndex: 10 - index,
                  }}
                >
                  <div className="core-dark overflow-hidden">
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
                <div
                  className="stage absolute"
                  style={{
                    width: "70%",
                    top: "0%",
                    insetInlineStart: "15%",
                    zIndex: 20,
                  }}
                >
                  <div className="core-dark overflow-hidden">
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
          </Reveal>
      </div>
    </section>
  );
}

/* ── Scene 2 · Ingredient navigator ───────────────────────────────────── */
function IngredientNavigator({
  categories,
  counts,
  locale,
}: {
  categories: Array<{ id: string; name: string; handle: string }>;
  counts: Record<string, number>;
  locale: Locale;
}) {

  return (
    <Section className="py-16 lg:py-24">
      <div className="flex flex-wrap items-end justify-between gap-6">
        <SectionHeading
          eyebrow={translate(locale, "home.navigatorEyebrow")}
          title={translate(locale, "home.navigatorTitle")}
          subtitle={translate(locale, "home.navigatorSubtitle")}
        />
      </div>

      <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {categories.map((category, index) => {
          const labels = CATEGORY_LABELS[category.handle as Category];
          return (
            <Reveal key={category.id} delay={index * 70}>
              <Link
                href={`/shop?category=${category.handle}`}
                className="stage group block h-full"
              >
                <div className="core relative flex h-full flex-col justify-between overflow-hidden p-5">
                  <span
                    className="index-outline absolute -right-2 -top-3 text-7xl"
                    aria-hidden="true"
                  >
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <div className="relative h-24 w-24 overflow-hidden rounded-2xl">
                    <ProductVisual
                      title={category.name}
                      titleUr={null}
                      category={category.handle}
                      locale={locale}
                      className="h-full w-full"
                    />
                  </div>
                  <div className="relative mt-6">
                    <h3 className="text-base font-semibold text-ink-900">
                      {labels ? labels[locale] : category.name}
                    </h3>
                    <p className="mt-1 text-xs text-ink-500">
                      {counts[category.handle] ?? 0} {translate(locale, "pantry.items")}
                    </p>
                  </div>
                </div>
              </Link>
            </Reveal>
          );
        })}
      </div>
    </Section>
  );
}

/* ── Scene 3 · Product storytelling ────────────────────────────────────── */
function Storytelling({
  products,
  locale,
}: {
  products: StoreProduct[];
  locale: Locale;
}) {

  return (
    <Section className="py-16 lg:pb-10 lg:pt-24">
      <SectionHeading
        eyebrow={translate(locale, "home.storyEyebrow")}
        title={translate(locale, "home.storyTitle")}
        subtitle={translate(locale, "home.storySubtitle")}
        align="center"
      />

      <div className="mt-14 space-y-8">
        {products.map((product, index) => (
          <Reveal key={product.id}>
            <article
              className={`stage ${index % 2 === 1 ? "lg:[direction:rtl]" : ""}`}
            >
              <div
                className={`core grid items-center gap-8 p-6 sm:p-10 lg:grid-cols-2 ${
                  index % 2 === 1 ? "lg:[direction:ltr]" : ""
                }`}
              >
                <div className="relative overflow-hidden rounded-3xl">
                  <ProductMedia
                    product={product}
                    locale={locale}
                    className="aspect-[4/3]"
                    variantLabel={product.variants
                      .map((variant) => variant.title)
                      .join(" / ")}
                  />
                </div>
                <div>
                  <span className="numeral text-6xl">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <h3 className="mt-4 text-3xl font-semibold text-ink-900 sm:text-4xl">
                    {productTitle(product.title, product.titleUr, locale)}
                  </h3>
                  <p className="mt-4 max-w-md text-sm leading-relaxed text-ink-600 sm:text-base">
                    {product.description}
                  </p>
                  <dl className="mt-7 flex flex-wrap gap-3">
                    {product.variants.map((variant) => (
                      <div
                        key={variant.id}
                        className="rounded-2xl border border-ink-900/10 bg-bone-100 px-4 py-3"
                      >
                        <dt className="text-[0.5625rem] uppercase tracking-[0.2em] text-ink-500">
                          {variant.title}
                        </dt>
                        <dd className="price mt-1 text-base">
                          {variant.price !== null ? money(variant.price, locale) : "—"}
                        </dd>
                      </div>
                    ))}
                  </dl>
                  <Link
                    href={`/product/${product.handle}`}
                    className="btn btn-primary mt-8 px-6 py-3 text-sm"
                  >
                    {translate(locale, "product.view")}
                  </Link>
                </div>
              </div>
            </article>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}

/* ── Scene 4 · One-conversation checkout ──────────────────────────────── */
function WhatsAppScene({ locale }: { locale: Locale }) {
  const steps = [
    "home.steps1",
    "home.steps2",
    "home.steps3",
  ] as const;

  return (
    <Section className="py-16 lg:py-24">
      <div className="stage">
        <div className="core-dark grain grain-dark relative overflow-hidden p-8 sm:p-12 lg:p-16">
          <div className="relative grid gap-12 lg:grid-cols-[1.1fr_1fr] lg:items-center">
            <Reveal>
              <span className="eyebrow eyebrow-on-dark">
                {translate(locale, "home.checkoutEyebrow")}
              </span>
              <h2 className="display-section mt-5 text-4xl text-bone-50 sm:text-5xl">
                {translate(locale, "home.whatsappTitle")}
              </h2>
              <p className="mt-5 max-w-md text-sm leading-relaxed text-bone-100/70 sm:text-base">
                {translate(locale, "home.whatsappBody")}
              </p>
              <Link href="/cart" className="btn btn-accent mt-8 px-7 py-3.5 text-sm">
                {translate(locale, "home.whatsappCta")}
              </Link>
              <p className="mt-5 max-w-sm text-xs leading-relaxed text-bone-100/55">
                {translate(locale, "home.stepsNote")}
              </p>
            </Reveal>

            <Reveal delay={140}>
              <ol className="space-y-4">
                {steps.map((key, index) => (
                  <li
                    key={key}
                    className="core-dark flex items-start gap-4 rounded-2xl border border-bone-50/10 p-4"
                  >
                    <span className="numeral index-outline-dark text-3xl">
                      {index + 1}
                    </span>
                    <p className="text-sm font-semibold text-bone-50">
                      {translate(locale, key)}
                    </p>
                  </li>
                ))}
              </ol>
            </Reveal>
          </div>
        </div>
      </div>
    </Section>
  );
}

/* ── Page ─────────────────────────────────────────────────────────────── */
export default async function HomePage() {
  const locale = await getLocale();
  const region = await getDefaultRegion();

  if (!region) {
    return (
      <Section>
        <p className="text-ink-600">{translate(locale, "common.error")}</p>
      </Section>
    );
  }

  const [{ products }, categories] = await Promise.all([
    listProducts({ regionId: region.id, limit: 60 }),
    listCategories(),
  ]);

  const hero = products[0];
  const sidekicks = products.slice(1, 4);
  const featured = products.filter((product) => product.variants.length > 0).slice(0, 8);
  const story = products.filter((product) => product.variants.length > 1).slice(2, 4);

  const counts: Record<string, number> = {};
  for (const product of products) {
    if (product.category) {
      counts[product.category] = (counts[product.category] ?? 0) + 1;
    }
  }

  const shelves: Shelf[] = categories
    .map((category) => ({
      category: category.handle,
      products: products.filter((product) => product.category === category.handle).slice(0, 5),
    }))
    .filter((shelf) => shelf.products.length > 0);

  return (
    <div>
      {hero && <Hero hero={hero} sidekicks={sidekicks} locale={locale} />}
      <IngredientRail />

      <IngredientNavigator categories={categories} counts={counts} locale={locale} />

      <Section className="pt-0">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
          <SectionHeading
            eyebrow={translate(locale, "home.selectionEyebrow")}
            title={translate(locale, "home.selectionTitle")}
            subtitle={translate(locale, "home.selectionSubtitle")}
          />
          <Link href="/shop" className="link-underline text-sm font-semibold text-paprika-600">
            {translate(locale, "common.viewAll")}
          </Link>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {featured.map((product, index) => (
            <Reveal key={product.id} delay={(index % 4) * 70}>
              <ProductCard product={product} locale={locale} />
            </Reveal>
          ))}
        </div>
      </Section>

      <Section className="pt-0">
        <PantryShelf shelves={shelves} />
      </Section>

      {story.length > 0 && <Storytelling products={story} locale={locale} />}

      <WhatsAppScene locale={locale} />

      <Section className="pt-0">
        <div className="stage">
          <div className="core grain relative overflow-hidden p-8 text-center sm:p-14">
            <h2 className="display-section mx-auto max-w-2xl text-4xl sm:text-5xl">
              {translate(locale, "home.collectionsTitle")}
            </h2>
            <p className="mx-auto mt-5 max-w-xl text-sm leading-relaxed text-ink-600 sm:text-base">
              {translate(locale, "home.collectionsSubtitle")}
            </p>
            <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
              <Link href="/shop" className="btn btn-primary px-7 py-3 text-sm">
                {translate(locale, "nav.shop")}
              </Link>
              <Link href="/order" className="btn btn-ghost px-7 py-3 text-sm">
                {translate(locale, "order.title")}
              </Link>
            </div>
          </div>
        </div>
      </Section>
    </div>
  );
}
