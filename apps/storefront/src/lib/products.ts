import { sdk } from "./medusa";
import type { StoreCategory, StoreProduct, StoreVariant } from "./types";

const PRODUCT_FIELDS = [
  "id",
  "title",
  "handle",
  "description",
  "status",
  "thumbnail",
  "metadata",
  "*variants",
  "*variants.prices",
  "*variants.calculated_price",
].join(",");

type MedusaVariant = {
  id: string;
  title?: string | null;
  sku?: string | null;
  calculated_price?: { calculated_amount?: number | null } | null;
};

type MedusaProduct = {
  id: string;
  title: string;
  handle?: string | null;
  description?: string | null;
  status?: string | null;
  thumbnail?: string | null;
  metadata?: Record<string, unknown> | null;
  variants?: MedusaVariant[] | null;
};

type MedusaCategory = {
  id: string;
  name?: string | null;
  handle?: string | null;
};

export function toStoreProduct(product: MedusaProduct): StoreProduct {
  const variants: StoreVariant[] = (product.variants ?? []).map((variant) => ({
    id: variant.id,
    title: variant.title ?? "Standard",
    sku: variant.sku ?? "",
    price: variant.calculated_price?.calculated_amount ?? null,
  }));

  const prices = variants
    .map((variant) => variant.price)
    .filter((price): price is number => price !== null);

  return {
    id: product.id,
    handle: product.handle ?? "",
    title: product.title,
    titleUr:
      typeof product.metadata?.name_ur === "string"
        ? product.metadata.name_ur
        : null,
    description: product.description ?? null,
    category:
      typeof product.metadata?.category === "string"
        ? product.metadata.category
        : null,
    thumbnail: product.thumbnail ?? null,
    status: product.status ?? "draft",
    variants,
    minPrice: prices.length ? Math.min(...prices) : null,
  };
}

export async function getDefaultRegion(): Promise<{
  id: string;
  currency_code: string;
} | null> {
  const { regions } = await sdk.store.region.list({
    limit: 1,
    fields: "id,currency_code",
  });
  return regions[0] ?? null;
}

export async function listCategories(): Promise<StoreCategory[]> {
  const { product_categories } = await sdk.store.category.list({
    limit: 100,
    fields: "id,name,handle",
  });
  return (product_categories ?? []).map((category: MedusaCategory) => ({
    id: category.id,
    name: category.name ?? "",
    handle: category.handle ?? "",
  }));
}

export type ProductListQuery = {
  regionId: string;
  limit?: number;
  offset?: number;
  q?: string | undefined;
  categoryId?: string | undefined;
  handle?: string | undefined;
};

export async function listProducts(
  query: ProductListQuery
): Promise<{ products: StoreProduct[]; count: number }> {
  const response = await sdk.store.product.list({
    region_id: query.regionId,
    limit: query.limit ?? 50,
    offset: query.offset ?? 0,
    q: query.q || undefined,
    category_id: query.categoryId || undefined,
    handle: query.handle || undefined,
    fields: PRODUCT_FIELDS,
  } as never);

  return {
    products: (response.products ?? []).map(toStoreProduct),
    count: response.count ?? 0,
  };
}

export async function getProductByHandle(
  handle: string,
  regionId: string
): Promise<StoreProduct | null> {
  const { products } = await listProducts({ regionId, handle, limit: 1 });
  return products[0] ?? null;
}

export async function getRelatedProducts(
  product: StoreProduct,
  regionId: string,
  limit = 4
): Promise<StoreProduct[]> {
  const { products } = await listProducts({
    regionId,
    categoryId: undefined,
    limit: 24,
  });
  return products
    .filter(
      (candidate) =>
        candidate.id !== product.id && candidate.category === product.category
    )
    .slice(0, limit);
}
