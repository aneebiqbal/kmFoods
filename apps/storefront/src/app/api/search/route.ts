import { NextRequest, NextResponse } from "next/server";
import { listProducts, getDefaultRegion } from "@/lib/products";

export const dynamic = "force-dynamic";

/**
 * Live search for the header overlay. Returns a small set of real catalogue
 * results; it never invents suggestions or trending items.
 */
export async function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams.get("q")?.trim() ?? "";

  if (query.length < 2) {
    return NextResponse.json({ results: [], query });
  }

  try {
    const region = await getDefaultRegion();
    if (!region) {
      return NextResponse.json({ results: [], query });
    }

    const { products } = await listProducts({
      regionId: region.id,
      limit: 8,
      q: query,
    });

    return NextResponse.json({ results: products, query });
  } catch {
    return NextResponse.json(
      { results: [], query, error: "Search is unavailable right now." },
      { status: 200 },
    );
  }
}
