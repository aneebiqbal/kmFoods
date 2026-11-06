import { beforeEach, describe, expect, it, vi } from "vitest";

/**
 * The sitemap runs during `next build`, where no backend is reachable. It must
 * still produce a valid sitemap and must never crash the build.
 */

const listProducts = vi.fn();
const getDefaultRegion = vi.fn();

vi.mock("@/lib/products", () => ({
  getDefaultRegion: (...args: unknown[]) => getDefaultRegion(...args),
  listProducts: (...args: unknown[]) => listProducts(...args),
}));

async function loadSitemap() {
  vi.resetModules();
  return (await import("./sitemap")).default;
}

describe("sitemap", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.unstubAllEnvs();
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", "https://kmfoods.store");
  });

  it("always lists the static routes, even with no backend", async () => {
    vi.stubEnv("NEXT_PUBLIC_MEDUSA_BACKEND_URL", "https://api.kmfoods.store");
    getDefaultRegion.mockRejectedValue(new Error("ECONNREFUSED 127.0.0.1:9000"));

    const entries = await (await loadSitemap())();
    const urls = entries.map((entry) => entry.url);

    expect(urls).toContain("https://kmfoods.store");
    expect(urls).toContain("https://kmfoods.store/shop");
    expect(urls).toContain("https://kmfoods.store/privacy-policy");
    expect(urls.some((url) => url.includes("/product/"))).toBe(false);
  });

  it("includes published product URLs when Medusa is reachable", async () => {
    vi.stubEnv("NEXT_PUBLIC_MEDUSA_BACKEND_URL", "https://api.kmfoods.store");
    getDefaultRegion.mockResolvedValue({ id: "reg_1", currency_code: "pkr" });
    listProducts.mockResolvedValue({
      products: [
        {
          id: "prod_1",
          handle: "red-chili-powder",
          title: "Red Chili Powder",
          titleUr: null,
          description: null,
          category: null,
          thumbnail: null,
          status: "published",
          variants: [],
          minPrice: 80,
        },
      ],
      count: 1,
    });

    const entries = await (await loadSitemap())();
    expect(entries.map((entry) => entry.url)).toContain(
      "https://kmfoods.store/product/red-chili-powder"
    );
  });

  it("resolves when the backend URL is not configured at all", async () => {
    vi.stubEnv("NEXT_PUBLIC_MEDUSA_BACKEND_URL", "");
    getDefaultRegion.mockReset();

    const entries = await (await loadSitemap())();
    expect(entries.length).toBeGreaterThan(0);
    expect(entries[0]?.url).toBe("https://kmfoods.store");
  });

  it("does not let a product-listing failure remove the static routes", async () => {
    vi.stubEnv("NEXT_PUBLIC_MEDUSA_BACKEND_URL", "https://api.kmfoods.store");
    getDefaultRegion.mockResolvedValue({ id: "reg_1", currency_code: "pkr" });
    listProducts.mockRejectedValue(new Error("timeout"));

    const entries = await (await loadSitemap())();
    expect(entries.map((entry) => entry.url)).toContain("https://kmfoods.store/shop");
  });
});
