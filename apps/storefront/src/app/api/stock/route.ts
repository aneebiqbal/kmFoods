import { NextRequest, NextResponse } from "next/server";
import { sdk } from "@/lib/medusa";

export const dynamic = "force-dynamic";

/** Proxies Medusa stock levels so the storefront never queries Medusa directly from the browser. */
export async function GET(request: NextRequest) {
  const variants = request.nextUrl.searchParams.get("variants") ?? "";

  if (!variants) {
    return NextResponse.json({ stock: {} });
  }

  try {
    const data = await sdk.client.fetch<{ stock: Record<string, number> }>(
      `/store/stock?variants=${encodeURIComponent(variants)}`
    );
    return NextResponse.json(data);
  } catch {
    return NextResponse.json(
      { stock: {}, error: "Stock is unavailable right now." },
      { status: 200 }
    );
  }
}
