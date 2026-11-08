import { beforeEach, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";

const listProducts = vi.fn();
const getDefaultRegion = vi.fn();

vi.mock("@/lib/products", () => ({
  getDefaultRegion: (...args: unknown[]) => getDefaultRegion(...args),
  listProducts: (...args: unknown[]) => listProducts(...args),
}));

async function loadGet() {
  vi.resetModules();
  return (await import("./route")).GET;
}

function request(query: string) {
  return new NextRequest(
    `http://localhost:3000/api/search?q=${encodeURIComponent(query)}`
  );
}

describe("search route", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns no results for a short query without calling the backend", async () => {
    const GET = await loadGet();
    const response = await GET(request("a"));
    const body = await response.json();
    expect(body.results).toEqual([]);
    expect(getDefaultRegion).not.toHaveBeenCalled();
  });

  it("returns real catalogue results for a valid query", async () => {
    getDefaultRegion.mockResolvedValue({ id: "reg_1", currency_code: "pkr" });
    listProducts.mockResolvedValue({
      products: [{ id: "p1", title: "Red Chili Crushed" }],
      count: 1,
    });

    const GET = await loadGet();
    const response = await GET(request("chili"));
    const body = await response.json();

    expect(body.results).toHaveLength(1);
    expect(listProducts).toHaveBeenCalledWith(
      expect.objectContaining({ q: "chili", limit: 8 })
    );
  });

  it("reports an error when the backend is unreachable", async () => {
    getDefaultRegion.mockRejectedValue(new Error("ECONNREFUSED"));

    const GET = await loadGet();
    const response = await GET(request("chili"));
    const body = await response.json();

    expect(body.error).toBeDefined();
    expect(body.results).toEqual([]);
  });
});
