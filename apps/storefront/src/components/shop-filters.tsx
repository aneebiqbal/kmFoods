"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useLanguage } from "@/i18n/language-context";

type SortKey = "featured" | "price-asc" | "price-desc" | "name";

export function ShopFilters({
  categories,
  activeCategory,
  query,
  sort,
}: {
  categories: Array<{ id: string; name: string; handle: string }>;
  activeCategory: string | null;
  query: string;
  sort: SortKey;
}) {
  const { t } = useLanguage();
  const router = useRouter();
  const [queryDraft, setQueryDraft] = useState(query);

  function navigate(next: Record<string, string>) {
    const params = new URLSearchParams();
    if (query) params.set("q", query);
    if (activeCategory) params.set("category", activeCategory);
    if (sort !== "featured") params.set("sort", sort);
    for (const [key, value] of Object.entries(next)) {
      if (value) params.set(key, value);
      else params.delete(key);
    }
    const qs = params.toString();
    router.push(qs ? `/shop?${qs}` : "/shop", { scroll: false });
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center gap-3">
        <form
          onSubmit={(event) => {
            event.preventDefault();
            navigate({ q: queryDraft });
          }}
          className="flex min-w-0 flex-1 flex-col gap-2 sm:flex-row sm:items-center"
          role="search"
        >
          <div className="relative min-w-0 flex-1">
            <span className="pointer-events-none absolute start-4 top-1/2 -translate-y-1/2 text-earth-500">
              <svg
                width="15"
                height="15"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <circle cx="11" cy="11" r="7" />
                <path d="m20 20-3.5-3.5" />
              </svg>
            </span>
            <input
              type="search"
              name="q"
              value={queryDraft}
              onChange={(event) => setQueryDraft(event.target.value)}
              placeholder={t("common.searchPlaceholder")}
              className="w-full rounded-full border border-earth-900/12 bg-cream-50 py-2.5 ps-10 pe-4 text-sm outline-none transition-colors focus:border-chili-600"
              aria-label={t("common.search")}
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary shrink-0 px-5 py-2.5 text-sm"
          >
            {t("common.search")}
          </button>
        </form>

        <label className="flex items-center gap-2 text-xs text-earth-500 sm:ms-auto">
          <span className="sr-only">{t("shop.filters")}</span>
          <select
            value={sort}
            onChange={(event) => navigate({ sort: event.target.value })}
            className="rounded-full border border-earth-900/12 bg-cream-50 px-3 py-2 text-xs font-semibold text-earth-700 outline-none"
          >
            <option value="featured">{t("shop.sortFeatured")}</option>
            <option value="price-asc">{t("shop.sortPriceAsc")}</option>
            <option value="price-desc">{t("shop.sortPriceDesc")}</option>
            <option value="name">{t("shop.sortName")}</option>
          </select>
        </label>
      </div>

      {/* Category chips. They wrap rather than scroll horizontally, so every
          category is reachable without a hidden scroll gesture. */}
      <div
        className="flex flex-wrap gap-2"
        role="group"
        aria-label={t("shop.category")}
      >
        <a
          href="/shop"
          className={`shrink-0 rounded-full border px-4 py-1.5 text-xs font-semibold transition-colors ${
            !activeCategory
              ? "border-chili-600 bg-chili-600 text-cream-50"
              : "border-earth-900/12 bg-cream-50 text-earth-700 hover:border-earth-900/25"
          }`}
        >
          {t("shop.all")}
        </a>

        {categories.map((category) => (
          <a
            key={category.id}
            href={`/shop?category=${category.handle}`}
            aria-current={activeCategory === category.handle ? "true" : undefined}
            className={`shrink-0 rounded-full border px-4 py-1.5 text-xs font-semibold transition-colors ${
              activeCategory === category.handle
                ? "border-chili-600 bg-chili-600 text-cream-50"
                : "border-earth-900/12 bg-cream-50 text-earth-700 hover:border-earth-900/25"
            }`}
          >
            {category.name}
          </a>
        ))}
      </div>
    </div>
  );
}
