import type { Metadata } from "next";
import { translate } from "@kmfoods/shared";
import { getDefaultRegion, listCategories, listProducts } from "@/lib/products";
import { getLocale } from "@/i18n/locale";
import { ProductCard } from "@/components/product-card";
import { EmptyState, Reveal, Section } from "@/components/ui";
import { ShopFilters } from "@/components/shop-filters";

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

type SortKey = "featured" | "price-asc" | "price-desc" | "name";

function sortProducts<T extends { minPrice: number | null; title: string }>(
  products: T[],
  sort: SortKey
): T[] {
  const copy = [...products];
  switch (sort) {
    case "price-asc":
      return copy.sort(
        (a, b) => (a.minPrice ?? Infinity) - (b.minPrice ?? Infinity)
      );
    case "price-desc":
      return copy.sort(
        (a, b) => (b.minPrice ?? -Infinity) - (a.minPrice ?? -Infinity)
      );
    case "name":
      return copy.sort((a, b) => a.title.localeCompare(b.title));
    default:
      return copy;
  }
}

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

  const categories = await listCategories();
  const activeCategory =
    categories.find((category) => category.handle === categoryHandle) ?? null;

  const { products, count } = region
    ? await listProducts({
        regionId: region.id,
        limit: 100,
        q: query || undefined,
        categoryId: activeCategory?.id,
      })
    : { products: [], count: 0 };

  const sorted = sortProducts(products, sort);

  return (
    <Section>
      <div className="flex flex-wrap items-end justify-between gap-6">
        <div className="max-w-xl">
          <span className="eyebrow">{translate(locale, "common.tagline")}</span>
          <h1 className="mt-4 text-4xl font-semibold sm:text-5xl">
            {translate(locale, "shop.title")}
          </h1>
          <p className="mt-3 text-ink-600">
            {translate(locale, "shop.subtitle")}
          </p>
        </div>
        <p data-testid="result-count" className="text-sm text-ink-500">
          {translate(locale, "shop.results", { count })}
        </p>
      </div>

      <div className="mt-10">
        <ShopFilters
          categories={categories.map((category) => ({
            id: category.id,
            name: category.name,
            handle: category.handle,
          }))}
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
              <a href="/shop" className="btn btn-ghost mt-2 px-5 py-2 text-sm">
                {translate(locale, "shop.emptyCta")}
              </a>
            }
          />
        </div>
      ) : (
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {sorted.map((product, index) => (
            <Reveal key={product.id} delay={(index % 4) * 60}>
              <ProductCard product={product} locale={locale} />
            </Reveal>
          ))}
        </div>
      )}
    </Section>
  );
}
