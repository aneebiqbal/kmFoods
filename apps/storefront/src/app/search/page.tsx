import type { Metadata } from "next";
import Link from "next/link";
import { translate } from "@kmfoods/shared";
import { getDefaultRegion, listCategories, listProducts } from "@/lib/products";
import { getLocale } from "@/i18n/locale";
import { ProductRow } from "@/components/product-card";
import { CatalogueUnavailable, EmptyState, Section } from "@/components/ui";

export const dynamic = "force-dynamic";

export const metadata: Metadata = { title: "Search" };

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const locale = await getLocale();
  const query = typeof params.q === "string" ? params.q.trim() : "";
  const region = await getDefaultRegion();
  const categories = await listCategories();

  const searching = region !== null && query.length >= 2;
  let products: Awaited<ReturnType<typeof listProducts>>["products"] = [];
  let count = 0;

  if (searching) {
    const result = await listProducts({
      regionId: region.id,
      limit: 100,
      q: query,
    });
    products = result.products;
    count = result.count;
  }

  return (
    <>
      <section className="border-b border-rule">
        <div className="container section--s">
          <h1 className="display-section">{translate(locale, "common.search")}</h1>
          <form action="/search" method="get" className="mt-8 max-w-3xl" role="search">
            <div className="flex flex-wrap items-center gap-4 gap-y-3 border-b-2 border-ink pb-4">
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="shrink-0 text-accent"
                aria-hidden="true"
              >
                <circle cx="11" cy="11" r="7" />
                <path d="m20 20-3.5-3.5" />
              </svg>
              <input
                name="q"
                type="search"
                defaultValue={query}
                placeholder={translate(locale, "common.searchPlaceholder")}
                autoFocus
                className="min-w-0 flex-1 bg-transparent text-2xl text-ink outline-none placeholder:text-muted"
                aria-label={translate(locale, "common.search")}
              />
              <button type="submit" className="btn btn-primary shrink-0 px-6 py-3 text-sm">
                {translate(locale, "common.search")}
              </button>
            </div>
          </form>

          {searching && (
            <p className="small mt-4" data-testid="result-count">
              {translate(locale, "shop.results", { count })}
            </p>
          )}
        </div>
      </section>

      <Section className="pt-0">
        {!region ? (
          <CatalogueUnavailable />
        ) : query.length < 2 ? (
          <div>
            <p className="small">{translate(locale, "nav.categories")}</p>
            <div className="mt-4 grid gap-x-10 gap-y-1 sm:grid-cols-2">
              {categories.map((category) => (
                <Link
                  key={category.id}
                  href={`/shop?category=${category.handle}`}
                  className="group flex items-baseline justify-between gap-3 border-b border-rule py-2.5"
                >
                  <span className="text-base text-ink transition-colors duration-[220ms] group-hover:text-accent sm:text-title">
                    {category.name}
                  </span>
                  <span className="small">{category.handle}</span>
                </Link>
              ))}
            </div>
          </div>
        ) : products.length === 0 ? (
          <EmptyState
            title={translate(locale, "shop.empty")}
            body={translate(locale, "common.searchPlaceholder")}
            action={
              <Link href="/shop" className="btn btn-ghost mt-2 px-5 py-2 text-sm">
                {translate(locale, "shop.emptyCta")}
              </Link>
            }
          />
        ) : (
          <div>
            {products.map((product, index) => (
              <ProductRow
                key={product.id}
                product={product}
                locale={locale}
                index={index}
              />
            ))}
          </div>
        )}
      </Section>
    </>
  );
}
