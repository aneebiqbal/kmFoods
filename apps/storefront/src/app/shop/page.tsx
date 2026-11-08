import type { Metadata } from "next";
import Link from "next/link";
import {
  CATEGORY_DESCRIPTIONS,
  CATEGORY_LABELS,
  translate,
  type Category,
  type Locale,
} from "@kmfoods/shared";
import { getDefaultRegion, listCategories, listProducts } from "@/lib/products";
import { getLocale } from "@/i18n/locale";
import { ProductRow } from "@/components/product-card";
import { CatalogueUnavailable, EmptyState, Section } from "@/components/ui";
import { ShopFilters } from "@/components/shop-filters";
import { categoryArt } from "@/lib/category-art";
import { PAGE_SIZE, pageHref, sortProducts, type SortKey } from "@/lib/shop";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}): Promise<Metadata> {
  const params = await searchParams;
  const locale = await getLocale();
  const categoryHandle =
    typeof params.category === "string" ? params.category : null;
  const categories = await listCategories();
  const category = categories.find((item) => item.handle === categoryHandle);
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const path = categoryHandle ? `/shop?category=${categoryHandle}` : "/shop";

  return {
    title: category ? category.name : "Shop",
    description: translate(locale, "shop.subtitle"),
    alternates: { canonical: `${base}${path}` },
    openGraph: { title: category ? category.name : "Shop", type: "website" },
  };
}

/* ── Editorial introduction ─────────────────────────────────────────────── */
function ShopIntro({ locale }: { locale: Locale }) {
  return (
    <section className="border-b border-rule">
      <div className="container section--s grid gap-10 lg:grid-cols-12 lg:items-center">
        <div className="lg:col-span-7">
          <h1 className="display-section">{translate(locale, "shop.title")}</h1>
          <p className="lead mt-4">{translate(locale, "shop.subtitle")}</p>
        </div>
        <div className="lg:col-span-5">
          <figure className="photo aspect-[4/3]">
            {/* eslint-disable-next-line @next/next/no-img-element -- a verified local asset */}
            <img
              src="/assets/lib/souk-stall.jpg"
              alt="A spice and dried fruit stall piled high at a market"
              fetchPriority="high"
            />
            <figcaption className="photo__caption">
              The market shelf, in season
            </figcaption>
          </figure>
        </div>
      </div>
    </section>
  );
}

function CategoryDirectory({
  locale,
  categories,
  counts,
}: {
  locale: Locale;
  categories: Array<{ id: string; name: string; handle: string }>;
  counts: Record<string, number>;
}) {
  return (
    <section className="border-b border-rule">
      <div className="container py-6">
        <ol className="grid gap-x-10 gap-y-1 sm:grid-cols-2">
          {categories.map((category, index) => {
            const labels = CATEGORY_LABELS[category.handle as Category];
            return (
              <li key={category.id}>
                <Link
                  href={`/shop?category=${category.handle}`}
                  className="group flex items-baseline justify-between gap-3 border-b border-rule py-2.5"
                >
                  <span className="flex items-baseline gap-3">
                    <span className="numeral text-xs">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span className="text-base text-ink transition-colors duration-[220ms] group-hover:text-accent sm:text-title">
                      {labels ? labels[locale] : category.name}
                    </span>
                  </span>
                  <span className="small shrink-0">
                    {counts[category.handle] ?? 0} {translate(locale, "pantry.items")}
                  </span>
                </Link>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}

/* ── Category chapter ───────────────────────────────────────────────────── */
function CategoryChapter({
  locale,
  category,
  index,
  count,
  categories,
}: {
  locale: Locale;
  category: { id: string; name: string; handle: string };
  index: number;
  count: number;
  categories: Array<{ id: string; name: string; handle: string }>;
}) {
  const labels = CATEGORY_LABELS[category.handle as Category];
  const description = CATEGORY_DESCRIPTIONS[category.handle as Category];
  const art = categoryArt(category.handle);
  const name = labels ? labels[locale] : category.name;

  return (
    <section className="border-b border-rule">
      <div className="container section--s grid gap-10 lg:grid-cols-12 lg:items-center">
        <div className="lg:col-span-7">
          <p className="numeral text-sm">{String(index + 1).padStart(2, "0")}</p>
          <h1 className="display-section mt-3">{name}</h1>
          <p className="lead mt-4">
            {description ? description[locale] : category.name}
          </p>
          <p className="small mt-4" data-testid="result-count">
            {count} {translate(locale, "pantry.items")}
          </p>

          <div className="mt-6 flex flex-wrap gap-2">
            {categories
              .filter((item) => item.handle !== category.handle)
              .map((item) => {
                const itemLabels = CATEGORY_LABELS[item.handle as Category];
                return (
                  <Link
                    key={item.id}
                    href={`/shop?category=${item.handle}`}
                    className="chip"
                  >
                    {itemLabels ? itemLabels[locale] : item.name}
                  </Link>
                );
              })}
          </div>
        </div>

        <div className="lg:col-span-5">
          {art ? (
            <figure className="photo aspect-[4/3]">
              {/* eslint-disable-next-line @next/next/no-img-element -- a verified local asset */}
              <img src={art} alt={name} loading="lazy" />
            </figure>
          ) : (
            <div className="photo flex aspect-[4/3] items-center justify-center">
              <span className="font-display text-7xl leading-none text-ink">
                {name.trim().charAt(0)}
              </span>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

/* ── Pagination ─────────────────────────────────────────────────────────── */
function Pagination({
  locale,
  page,
  totalPages,
  base,
}: {
  locale: Locale;
  page: number;
  totalPages: number;
  base: { query: string; categoryHandle: string | null; sort: SortKey };
}) {
  if (totalPages <= 1) return null;

  return (
    <nav
      className="mt-12 flex items-center justify-center gap-4"
      aria-label={translate(locale, "shop.title")}
    >
      {page > 1 ? (
        <Link
          href={pageHref(base, page - 1)}
          className="btn btn-ghost px-5 text-sm"
        >
          {translate(locale, "common.back")}
        </Link>
      ) : (
        <span className="btn btn-ghost px-5 text-sm opacity-40">
          {translate(locale, "common.back")}
        </span>
      )}

      <span className="small">
        {page} / {totalPages}
      </span>

      {page < totalPages ? (
        <Link
          href={pageHref(base, page + 1)}
          className="btn btn-ghost px-5 text-sm"
        >
          {translate(locale, "common.next")}
        </Link>
      ) : (
        <span className="btn btn-ghost px-5 text-sm opacity-40">
          {translate(locale, "common.next")}
        </span>
      )}
    </nav>
  );
}

/* ── Page ───────────────────────────────────────────────────────────────── */
export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const locale = await getLocale();
  const region = await getDefaultRegion();

  const categoryHandle =
    typeof params.category === "string" ? params.category : null;
  const query = typeof params.q === "string" ? params.q : "";
  const sort = (typeof params.sort === "string" ? params.sort : "featured") as SortKey;
  const page = Math.max(
    1,
    Number.parseInt(
      typeof params.page === "string" ? params.page : "1", 10
    ) || 1
  );

  const categories = await listCategories();
  const activeCategory =
    categories.find((category) => category.handle === categoryHandle) ?? null;
  const categoryIndex = categories.findIndex(
    (category) => category.handle === categoryHandle
  );

  if (!region) {
    return (
      <Section>
        <div className="max-w-xl">
          <h1>{translate(locale, "shop.title")}</h1>
        </div>
        <div className="mt-10">
          <CatalogueUnavailable />
        </div>
      </Section>
    );
  }

  const base = { query, categoryHandle, sort };
  const { products, count } = await listProducts({
    regionId: region.id,
    limit: PAGE_SIZE,
    offset: (page - 1) * PAGE_SIZE,
    q: query || undefined,
    categoryId: activeCategory?.id,
  });

  const sorted = sortProducts(products, sort);
  const totalPages = Math.max(1, Math.ceil(count / PAGE_SIZE));

  // The directory counts come from the full catalogue, not the page.
  const counts: Record<string, number> = {};
  if (!activeCategory && !query) {
    const all = await listProducts({ regionId: region.id, limit: 100 });
    for (const product of all.products) {
      if (product.category) {
        counts[product.category] = (counts[product.category] ?? 0) + 1;
      }
    }
  }

  return (
    <>
      {activeCategory ? (
        <CategoryChapter
          locale={locale}
          category={activeCategory}
          index={Math.max(0, categoryIndex)}
          count={count}
          categories={categories}
        />
      ) : (
        <ShopIntro locale={locale} />
      )}

      <CategoryDirectory
        locale={locale}
        categories={categories}
        counts={counts}
      />

      <Section>
        <p className="small" data-testid="result-count">
          {translate(locale, "shop.results", { count })}
        </p>
        <div className="sticky top-24 z-sticky border-b border-rule bg-paper/95 py-3 backdrop-blur-sm lg:top-28">
          <ShopFilters
            activeCategory={activeCategory?.handle ?? null}
            query={query}
            sort={sort}
          />
        </div>

        {sorted.length === 0 ? (
          <div className="mt-12">
            <EmptyState
              title={translate(locale, "shop.empty")}
              action={
                <Link href="/shop" className="btn btn-ghost mt-2 px-5 py-2 text-sm">
                  {translate(locale, "shop.emptyCta")}
                </Link>
              }
            />
          </div>
        ) : (
          <div className="mt-4">
            {sorted.map((product, index) => (
              <ProductRow
                key={product.id}
                product={product}
                locale={locale}
                index={(page - 1) * PAGE_SIZE + index}
              />
            ))}
          </div>
        )}

        <Pagination
          locale={locale}
          page={page}
          totalPages={totalPages}
          base={base}
        />
      </Section>
    </>
  );
}
