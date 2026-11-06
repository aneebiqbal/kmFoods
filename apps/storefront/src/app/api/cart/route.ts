import { NextResponse } from "next/server";
import { getCart } from "@/lib/cart-server";

export const dynamic = "force-dynamic";

/** Current cart for the drawer. Read-only; totals come from Medusa. */
export async function GET() {
  const cart = await getCart();
  return NextResponse.json({ cart });
}
