import type { MetadataRoute } from "next";
import { getDefaultRegion, listProducts } from "@/lib/products";

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

  return entries;
}
