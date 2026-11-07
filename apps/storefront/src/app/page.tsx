import Link from "next/link";
import { CATEGORY_LABELS, translate, type Category, type Locale } from "@kmfoods/shared";
import { getDefaultRegion, listCategories, listProducts } from "@/lib/products";
import { getLocale } from "@/i18n/locale";
import { money, productTitle } from "@/lib/format";
import { ProductCard, ProductMedia } from "@/components/product-card";
import { IngredientIndex } from "@/components/ingredient-index";
import { CatalogueUnavailable, Section, SectionHeading } from "@/components/ui";
import { productArt } from "@/lib/product-art";
import type { StoreProduct } from "@/lib/types";

export const dynamic = "force-dynamic";

const HERO_IMAGE = "/assets/lib/bumbu-rempah.jpg";

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
    <section className="border-b border-rule">
      <div className="container grid gap-10 py-10 lg:grid-cols-[120px_1fr_1.15fr] lg:min-h-[calc(100dvh_-_6.75rem)] lg:gap-0 lg:py-0">
        <aside className="hidden border-e border-rule pt-10 lg:block">
          <ol>
            {RAIL[locale].map((item, index) => (
              <li
                key={item}
                className="flex items-baseline gap-3 border-t border-rule py-3.5 first:border-t-0"
              >
                <span className="numeral text-xs">{String(index + 1).padStart(2, "0")}</span>
                <span className="text-xs text-ink-2">{item}</span>
              </li>
            ))}
          </ol>
        </aside>

        <div className="px-0 py-10 lg:px-10 lg:py-0">
          <h1 className="display-hero max-w-[12ch]">{translate(locale, "home.heroTitle")}</h1>
          <p className="lead mt-6">{translate(locale, "home.heroSubtitle")}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/shop" className="btn btn-primary px-7 py-3.5 text-sm">
              {translate(locale, "home.heroCta")}
            </Link>
            <Link href="/cart" className="btn btn-secondary px-7 py-3.5 text-sm">
              {translate(locale, "home.heroSecondary")}
            </Link>
          </div>
        </div>

        <div className="py-10 lg:py-10 lg:pl-10">
          <figure className="photo aspect-[4/3] lg:aspect-auto lg:h-full">
            {/* eslint-disable-next-line @next/next/no-img-element -- a verified local asset */}
            <img
              src={HERO_IMAGE}
              alt="Whole spices and aromatics laid out for the KM Foods kitchen"
              fetchPriority="high"
            />
            <figcaption className="photo__caption">{CAPTION[locale]}</figcaption>
          </figure>
        </div>
      </div>

      {categories.length > 0 && (
        <div className="border-t border-rule">
          <div className="container flex flex-wrap gap-x-8 gap-y-2 py-5">
            {categories.map((category, index) => {
              const labels = CATEGORY_LABELS[category.handle as Category];
              return (
                <Link
                  key={category.id}
                  href={`/shop?category=${category.handle}`}
                  className="flex items-baseline gap-2 text-sm text-ink-2 transition-colors hover:text-accent"
                >
                  <span className="numeral text-xs">
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

/* ── 03 · The Daily Shelf ────────────────────────────────────────────────── */
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

/* ── 04 · The Ingredient Feature ─────────────────────────────────────────── */
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
            className="aspect-[4/3]"
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
            {product.minPrice !== null ? money(product.minPrice, locale) : translate(locale, "product.priceOnRequest")}
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

/* ── 05 · The Pantry Edit ────────────────────────────────────────────────── */
function PantryEdit({ products, locale }: { products: StoreProduct[]; locale: Locale }) {
  const byCategory = new Map<string, StoreProduct>();
  for (const product of products) {
    if (product.category && !byCategory.has(product.category) && product.variants.length > 0) {
      byCategory.set(product.category, product);
    }
  }
  const items = [...byCategory.values()].slice(0, 5);
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
                    {product.minPrice !== null ? money(product.minPrice, locale) : translate(locale, "product.priceOnRequest")}
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

/* ── 06 · The Ordering Experience ────────────────────────────────────────── */
function OrderingExperience({ locale }: { locale: Locale }) {
  const steps = [
    { key: "home.steps1" as const, label: translate(locale, "home.steps1") },
    { key: "home.steps2" as const, label: translate(locale, "home.steps2") },
    { key: "home.steps3" as const, label: translate(locale, "home.steps3") },
  ];

  return (
    <section className="band--ink">
      <div className="container section--s">
        <div className="grid gap-10 lg:grid-cols-12 lg:items-end">
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
        <p className="small mt-6 text-dusk-ink/60">{translate(locale, "home.stepsNote")}</p>
      </div>
    </section>
  );
}

/* ── 07 · The Brand Note ─────────────────────────────────────────────────── */
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

  // One product per category for the Daily Shelf; the Pantry Edit takes the rest.
  const dailyItems: StoreProduct[] = [];
  const dailyCategories = new Set<string>();
  for (const product of products) {
    if (product.variants.length > 0 && product.category && !dailyCategories.has(product.category)) {
      dailyCategories.add(product.category);
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
          <Section className="section--s">
            <SectionHeading
              title={translate(locale, "home.categories")}
              subtitle={translate(locale, "home.categoriesSubtitle")}
            />
            <div className="mt-12">
              <IngredientIndex categories={categories} counts={counts} locale={locale} />
            </div>
          </Section>

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
