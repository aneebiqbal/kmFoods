"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useLanguage } from "@/i18n/language-context";

type SortKey = "featured" | "price-asc" | "price-desc" | "name";

/**
 * The shop's search and sort bar. Categories are handled by the numbered
 * directory and the category chapter, so the rail stays compact.
 */
export function ShopFilters({
  activeCategory,
  query,
  sort,
}: {
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
          <span className="pointer-events-none absolute start-4 top-1/2 -translate-y-1/2 text-muted">
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
            className="field ps-10"
            aria-label={t("common.search")}
          />
        </div>

        <button type="submit" className="btn btn-primary shrink-0 px-5 text-sm">
          {t("common.search")}
        </button>
      </form>

      <label className="flex items-center gap-2 text-sm text-ink-2 sm:ms-auto">
        <span className="sr-only">{t("shop.filters")}</span>
        <select
          value={sort}
          onChange={(event) => navigate({ sort: event.target.value })}
          className="field w-auto px-3 py-2.5 text-sm"
        >
          <option value="featured">{t("shop.sortFeatured")}</option>
          <option value="price-asc">{t("shop.sortPriceAsc")}</option>
          <option value="price-desc">{t("shop.sortPriceDesc")}</option>
          <option value="name">{t("shop.sortName")}</option>
        </select>
      </label>
    </div>
  );
}
