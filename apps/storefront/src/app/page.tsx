import Link from "next/link";
import { CATEGORY_LABELS, translate, type Category, type Locale } from "@kmfoods/shared";
import { getDefaultRegion, listCategories, listProducts } from "@/lib/products";
import { getLocale } from "@/i18n/locale";
import { money, productTitle } from "@/lib/format";
import { ProductCard, ProductMedia } from "@/components/product-card";
import { LivingShelf } from "@/components/living-shelf";
import { IngredientIndex } from "@/components/ingredient-index";
import { CatalogueUnavailable, Section, SectionHeading } from "@/components/ui";
import { productArt } from "@/lib/product-art";
import type { StoreProduct } from "@/lib/types";

export const dynamic = "force-dynamic";

const HERO_IMAGE = "/assets/lib/bumbu-rempah-2.jpg";

const RAIL: Record<Locale, string[]> = {
  en: ["Red chili", "Turmeric", "Coriander seed", "Clove", "Ginger", "Cardamom", "Cinnamon", "Cumin"],
  ur: ["سرخ مرچ", "ہلدی", "دھنیا بیج", "لونگ", "ادرک", "الائچی", "دارچینی", "زیرہ"],
};

const CAPTION: Record<Locale, string> = {
  en: "01 Red chili · 02 Turmeric · 03 Coriander seed · 04 Clove · 05 Ginger",
  ur: "01 سرخ مرچ · 02 ہلدی · 03 دھنیا بیج · 04 لونگ · 05 ادرک",
};

/* ── 01 · The Counter ────────────────────────────────────────────────────── */
function Counter({
  locale,
  categories,
}: {
  locale: Locale;
  categories: Array<{ id: string; name: string; handle: string }>;
}) {
  return (
    <section className="relative overflow-hidden bg-ink text-paper">
      <div className="container grid gap-10 py-12 lg:grid-cols-12 lg:items-stretch lg:min-h-[calc(100dvh_-_6.75rem)]">
        <aside className="hidden border-e border-paper/15 lg:col-span-1 lg:block">
          <ol className="flex h-full flex-col justify-center">
            {RAIL[locale].map((item, index) => (
              <li
                key={item}
                className="flex items-baseline gap-3 border-t border-paper/10 py-3.5 first:border-t-0"
              >
                <span className="numeral text-xs text-saffron-2">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className="text-xs text-paper/60">{item}</span>
              </li>
            ))}
          </ol>
        </aside>

        <div className="lg:col-span-6 lg:flex lg:flex-col lg:justify-center">
          <h1 className="display-hero rise text-paper">
            {translate(locale, "home.heroTitle")}
          </h1>
          <p className="lead mt-6 text-paper/70 rise rise-1">
            {translate(locale, "home.heroSubtitle")}
          </p>
          <div className="mt-8 flex flex-wrap gap-3 rise rise-2">
            <Link href="/shop" className="btn btn-primary px-7 py-3.5 text-sm">
              {translate(locale, "home.heroCta")}
            </Link>
            <Link href="/cart" className="btn btn-on-dark px-7 py-3.5 text-sm">
              {translate(locale, "home.heroSecondary")}
            </Link>
          </div>
        </div>

        <div className="lg:col-span-5">
          <figure className="photo photo--organic rise rise-3 h-full">
            {/* eslint-disable-next-line @next/next/no-img-element -- a verified local asset */}
            <img
              src={HERO_IMAGE}
              alt="Whole and ground spices on a dark market table"
              fetchPriority="high"
            />
            <figcaption className="photo__caption">{CAPTION[locale]}</figcaption>
          </figure>
        </div>
      </div>

      {categories.length > 0 && (
        <div className="border-t border-paper/10">
          <div className="container flex flex-wrap gap-x-8 gap-y-2 py-5">
            {categories.map((category, index) => {
              const labels = CATEGORY_LABELS[category.handle as Category];
              return (
                <Link
                  key={category.id}
                  href={`/shop?category=${category.handle}`}
                  className="flex items-baseline gap-2 text-sm text-paper/70 transition-colors hover:text-paper"
                >
                  <span className="numeral text-xs text-saffron-2">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  {labels ? labels[locale] : category.name}
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </section>
  );
}

/* ── 02 · The Living Shelf ────────────────────────────────────────────────── */
function LivingShelfSection({
  items,
  locale,
}: {
  items: StoreProduct[];
  locale: Locale;
}) {
  if (items.length === 0) return null;

  return (
    <Section className="section--s">
      <div className="flex flex-wrap items-end justify-between gap-6">
        <SectionHeading
          title={translate(locale, "pantry.title")}
          subtitle={translate(locale, "pantry.subtitle")}
        />
        <Link href="/shop" className="link text-sm font-medium text-ink">
          {translate(locale, "pantry.viewAll")}
        </Link>
      </div>

      <div className="mt-12">
        <LivingShelf items={items} />
      </div>
    </Section>
  );
}

/* ── 03 · Category index ─────────────────────────────────────────────────── */
function CategoryIndex({
  categories,
  counts,
  locale,
}: {
  categories: Array<{ id: string; name: string; handle: string }>;
  counts: Record<string, number>;
  locale: Locale;
}) {
  return (
    <Section className="section--s">
      <SectionHeading
        title={translate(locale, "home.categories")}
        subtitle={translate(locale, "home.categoriesSubtitle")}
      />
      <div className="mt-12">
        <IngredientIndex categories={categories} counts={counts} locale={locale} />
      </div>
    </Section>
  );
}

/* ── 04 · The Daily Shelf ─────────────────────────────────────────────────── */
function DailyShelf({ items, locale }: { items: StoreProduct[]; locale: Locale }) {
  if (items.length === 0) return null;

  return (
    <Section className="section--s">
      <div className="flex flex-wrap items-end justify-between gap-6">
        <SectionHeading
          title={translate(locale, "home.essentials")}
          subtitle={translate(locale, "home.essentialsSubtitle")}
        />
        <Link href="/shop" className="link text-sm font-medium text-ink">
          {translate(locale, "common.viewAll")}
        </Link>
      </div>

      <div className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
        {items.map((product) => (
          <ProductCard key={product.id} product={product} locale={locale} />
        ))}
      </div>
    </Section>
  );
}

/* ── 05 · The Ingredient Feature ─────────────────────────────────────────── */
function IngredientFeature({
  products,
  locale,
}: {
  products: StoreProduct[];
  locale: Locale;
}) {
  const product = products.find((item) => productArt(item.title)) ?? products[0];
  if (!product) return null;

  return (
    <Section className="section--s">
      <div className="grid gap-10 lg:grid-cols-12 lg:items-center">
        <div className="lg:col-span-7">
          <ProductMedia
            product={product}
            locale={locale}
            className="photo--organic aspect-[4/3]"
            variantLabel={product.variants.map((variant) => variant.title).join(" / ")}
          />
        </div>
        <div className="lg:col-span-5">
          <p className="numeral text-sm">01</p>
          <h2 className="display-section mt-4 text-4xl text-ink sm:text-5xl">
            {productTitle(product.title, product.titleUr, locale)}
          </h2>
          <p className="lead mt-5">{product.description}</p>
          <p className="price mt-6 text-2xl">
            {product.minPrice !== null
              ? money(product.minPrice, locale)
              : translate(locale, "product.priceOnRequest")}
          </p>
          <Link
            href={`/product/${product.handle}`}
            className="btn btn-ghost mt-8 px-6 py-3 text-sm"
          >
            {translate(locale, "product.view")}
          </Link>
        </div>
      </div>
    </Section>
  );
}

/* ── 06 · The Pantry Edit ────────────────────────────────────────────────── */
function PantryEdit({ products, locale }: { products: StoreProduct[]; locale: Locale }) {
  const byCategory = new Map<string, StoreProduct>();
  for (const product of products) {
    if (product.category && !byCategory.has(product.category) && product.variants.length > 0) {
      byCategory.set(product.category, product);
    }
  }
  const items = [...byCategory.values()].slice(0, 6);
  if (items.length === 0) return null;

  return (
    <Section className="section--s">
      <div className="grid gap-10 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <SectionHeading
            title={translate(locale, "home.collectionsTitle")}
            subtitle={translate(locale, "home.collectionsSubtitle")}
          />
        </div>

        <div className="lg:col-span-8">
          <ul className="divide-y divide-rule border-y border-rule">
            {items.map((product, index) => (
              <li key={product.id}>
                <Link
                  href={`/product/${product.handle}`}
                  className="group flex items-baseline justify-between gap-4 py-4"
                >
                  <span className="flex items-baseline gap-4">
                    <span className="numeral text-xs">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span className="text-base text-ink transition-colors duration-[220ms] group-hover:text-accent sm:text-title">
                      {productTitle(product.title, product.titleUr, locale)}
                    </span>
                  </span>
                  <span className="price text-sm">
                    {product.minPrice !== null
                      ? money(product.minPrice, locale)
                      : translate(locale, "product.priceOnRequest")}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Section>
  );
}

/* ── 07 · The Ordering Experience ────────────────────────────────────────── */
function OrderingExperience({ locale }: { locale: Locale }) {
  const steps = [
    { key: "home.steps1" as const, label: translate(locale, "home.steps1") },
    { key: "home.steps2" as const, label: translate(locale, "home.steps2") },
    { key: "home.steps3" as const, label: translate(locale, "home.steps3") },
  ];

  return (
    <section className="band--ink">
      <div className="container section--s grid gap-10 lg:grid-cols-12 lg:items-end">
        <div className="lg:col-span-5">
          <h2 className="display-section text-4xl text-dusk-ink sm:text-5xl">
            {translate(locale, "home.whatsappTitle")}
          </h2>
          <p className="lead mt-5">{translate(locale, "home.whatsappBody")}</p>
          <Link href="/cart" className="btn btn-on-dark mt-8 px-7 py-3.5 text-sm">
            {translate(locale, "home.whatsappCta")}
          </Link>
        </div>

        <ol className="divide-y divide-dusk-rule border-t border-dusk-rule lg:col-span-7">
          {steps.map((step, index) => (
            <li key={step.key} className="flex items-baseline gap-6 py-6">
              <span className="numeral w-10 shrink-0 text-3xl text-saffron-2">
                {index + 1}
              </span>
              <p className="text-base font-medium leading-relaxed text-dusk-ink">
                {step.label}
              </p>
            </li>
          ))}
        </ol>
      </div>
      <div className="container pb-10">
        <p className="small text-dusk-ink/60">{translate(locale, "home.stepsNote")}</p>
      </div>
    </section>
  );
}

/* ── 08 · The Brand Note ─────────────────────────────────────────────────── */
function BrandNote({ locale }: { locale: Locale }) {
  return (
    <Section className="section--s">
      <p className="display-section max-w-5xl">{translate(locale, "about.body")}</p>
    </Section>
  );
}

/* ── Page ───────────────────────────────────────────────────────────────── */
export default async function HomePage() {
  const locale = await getLocale();
  const region = await getDefaultRegion();

  let products: StoreProduct[] = [];
  let categories: Array<{ id: string; name: string; handle: string }> = [];
  let unavailable = !region;

  if (region) {
    try {
      const [productResult, categoryResult] = await Promise.all([
        listProducts({ regionId: region.id, limit: 100 }),
        listCategories(),
      ]);
      products = productResult.products;
      categories = categoryResult;
    } catch {
      unavailable = true;
    }
  }

  const counts: Record<string, number> = {};
  for (const product of products) {
    if (product.category) {
      counts[product.category] = (counts[product.category] ?? 0) + 1;
    }
  }

  // The Living Shelf leads with the ingredients a photograph honestly shows.
  const shelfItems = products.filter((product) => productArt(product.title)).slice(0, 6);
  const dailyItems: StoreProduct[] = [];
  const seenCategories = new Set<string>();
  for (const product of products) {
    if (product.variants.length > 0 && product.category && !seenCategories.has(product.category)) {
      seenCategories.add(product.category);
      dailyItems.push(product);
    }
    if (dailyItems.length === 5) break;
  }
  const dailyIds = new Set(dailyItems.map((product) => product.id));
  const pantryProducts = products.filter((product) => !dailyIds.has(product.id));

  return (
    <>
      <Counter locale={locale} categories={categories} />

      {unavailable ? (
        <Section>
          <CatalogueUnavailable />
        </Section>
      ) : (
        <>
          {shelfItems.length > 0 && (
            <LivingShelfSection items={shelfItems} locale={locale} />
          )}

          <CategoryIndex categories={categories} counts={counts} locale={locale} />
          <DailyShelf items={dailyItems} locale={locale} />
          <IngredientFeature products={products} locale={locale} />
          <PantryEdit products={pantryProducts} locale={locale} />
        </>
      )}

      <OrderingExperience locale={locale} />
      <BrandNote locale={locale} />
    </>
  );
}
