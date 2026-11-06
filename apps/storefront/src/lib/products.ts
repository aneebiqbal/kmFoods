import {
  medusaConfigError,
  sdk,
  warnIfLocalBackend,
} from "./medusa";
import type { StoreCategory, StoreProduct } from "./types";

/**
 * Every data call is wrapped so a missing configuration or an unreachable
 * backend degrades to an empty catalogue instead of taking the whole route
 * down. Prices and products always come from Medusa; nothing is fabricated
 * here.
 */

const logged = new Set<string>();

function logFailure(operation: string, error: unknown): void {
  if (logged.has(operation)) return;
  logged.add(operation);

  const message = error instanceof Error ? error.message : String(error);
  console.error(`[medusa] ${operation} failed: ${message}`);
}

function configFailure(): null {
  const error = medusaConfigError();
  if (error) logFailure("configuration", new Error(error));
  warnIfLocalBackend();
  return null;
}

export async function getDefaultRegion(): Promise<{
  id: string;
  currency_code: string;
} | null> {
  if (medusaConfigError()) return configFailure();

  try {
    warnIfLocalBackend();
    const { regions } = await sdk.store.region.list({
      limit: 1,
      fields: "id,currency_code",
    });
    return regions[0] ?? null;
  } catch (error) {
    logFailure("getDefaultRegion", error);
    return null;
  }
}

export async function listCategories(): Promise<StoreCategory[]> {
  if (medusaConfigError()) return [];

  try {
    warnIfLocalBackend();
    const { product_categories } = await sdk.store.category.list({
      limit: 100,
      fields: "id,name,handle",
    });
    return (product_categories ?? []).map((category: MedusaCategory) => ({
      id: category.id,
      name: category.name ?? "",
      handle: category.handle ?? "",
    }));
  } catch (error) {
    logFailure("listCategories", error);
    return [];
  }
}

export async function listProducts(query: {
  regionId: string;
  limit?: number;
  offset?: number;
  q?: string | undefined;
  categoryId?: string | undefined;
  handle?: string | undefined;
}): Promise<{ products: StoreProduct[]; count: number }> {
  try {
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
  } catch (error) {
    logFailure("listProducts", error);
    return { products: [], count: 0 };
  }
}

export async function getProductByHandle(
  handle: string,
  regionId: string,
): Promise<StoreProduct | null> {
  try {
    const { products } = await listProducts({ regionId, handle, limit: 1 });
    return products[0] ?? null;
  } catch (error) {
    logFailure("getProductByHandle", error);
    return null;
  }
}

export async function getRelatedProducts(
  product: StoreProduct,
  regionId: string,
  limit = 4,
): Promise<StoreProduct[]> {
  try {
    const { products } = await listProducts({ regionId, limit: 24 });
    return products
      .filter(
        (candidate) =>
          candidate.id !== product.id && candidate.category === product.category,
      )
      .slice(0, limit);
  } catch (error) {
    logFailure("getRelatedProducts", error);
    return [];
  }
}

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

type MedusaCategory = {
  id: string;
  name?: string | null;
  handle?: string | null;
};

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

export function toStoreProduct(product: MedusaProduct): StoreProduct {
  const variants = (product.variants ?? []).map((variant) => ({
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
      typeof product.metadata?.name_ur === "string" ? product.metadata.name_ur : null,
    description: product.description ?? null,
    category:
      typeof product.metadata?.category === "string" ? product.metadata.category : null,
    thumbnail: product.thumbnail ?? null,
    status: product.status ?? "draft",
    variants,
    minPrice: prices.length ? Math.min(...prices) : null,
  };
}
