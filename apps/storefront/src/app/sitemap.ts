import type { MetadataRoute } from "next";
import { assertMedusaConfigured } from "@/lib/medusa";

/**
 * Static routes are always listed. Product URLs are added when Medusa is
 * reachable, so a build (or a backend outage) never fails because the commerce
 * backend is not available at that moment.
 */
export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

  const staticPaths = [
    "",
    "/shop",
    "/about",
    "/contact",
    "/order",
    "/delivery-policy",
    "/return-policy",
    "/privacy-policy",
    "/terms",
  ];

  const entries: MetadataRoute.Sitemap = staticPaths.map((path) => ({
    url: `${base}${path}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: path === "" ? 1 : 0.7,
  }));

  try {
    assertMedusaConfigured();

    // Imported dynamically so a configuration error surfaces inside this
    // try/catch instead of failing the module at build time.
    const { getDefaultRegion, listProducts } = await import("@/lib/products");

    const region = await getDefaultRegion();
    if (region) {
      const { products } = await listProducts({ regionId: region.id, limit: 100 });
      for (const product of products) {
        entries.push({
          url: `${base}/product/${product.handle}`,
          lastModified: new Date(),
          changeFrequency: "weekly",
          priority: 0.8,
        });
      }
    }
  } catch (error) {
    // Loud, but never fatal: the sitemap is still valid without product URLs.
    console.warn(
      `[sitemap] product URLs were skipped: ${
        error instanceof Error ? error.message : String(error)
      }`
    );
  }

  return entries;
}
