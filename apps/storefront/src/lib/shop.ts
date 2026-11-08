export type SortKey = "featured" | "price-asc" | "price-desc" | "name";

export const PAGE_SIZE = 24;

/**
 * Server-side sort over a page of real products. Prices come from Medusa; a
 * missing price sorts last rather than being treated as zero.
 */
export function sortProducts<T extends { minPrice: number | null; title: string }>(
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

/**
 * Builds a shop URL that keeps the active query, category and sort, and only
 * adds a page parameter past the first page.
 */
export function pageHref(
  base: { query: string; categoryHandle: string | null; sort: SortKey },
  page: number
): string {
  const params = new URLSearchParams();
  if (base.query) params.set("q", base.query);
  if (base.categoryHandle) params.set("category", base.categoryHandle);
  if (base.sort !== "featured") params.set("sort", base.sort);
  if (page > 1) params.set("page", String(page));
  const qs = params.toString();
  return qs ? `/shop?${qs}` : "/shop";
}
