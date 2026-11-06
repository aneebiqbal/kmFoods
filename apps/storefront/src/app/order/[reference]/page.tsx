import type { Metadata } from "next";
import Link from "next/link";
import { translate } from "@kmfoods/shared";
import { sdk } from "@/lib/medusa";
import { getLocale } from "@/i18n/locale";
import { money } from "@/lib/format";
import type { OrderStatus } from "@/lib/types";
import { Section } from "@/components/ui";

export const dynamic = "force-dynamic";

export const metadata: Metadata = { title: "Order status" };

export default async function OrderStatusPage({
  params,
}: {
  params: Promise<{ reference: string }>;
}) {
  const { reference } = await params;
  const locale = await getLocale();

  let order: OrderStatus | null = null;
  let failed = false;

  try {
    order = await sdk.client.fetch<OrderStatus>(
      `/store/whatsapp-handoff/${encodeURIComponent(reference)}`
    );
  } catch {
    failed = true;
  }

  return (
    <Section>
      <div className="max-w-2xl">
        <span className="eyebrow">{translate(locale, "common.tagline")}</span>
        <h1 className="mt-4 text-4xl font-semibold sm:text-5xl">
          {translate(locale, "order.title")}
        </h1>
      </div>

      {failed || !order ? (
        <div className="mt-10 max-w-2xl">
          <div className="shell">
            <div className="core p-8 text-center">
              <p className="text-earth-600">
                {translate(locale, "order.notFound")}
              </p>
              <Link
                href="/order"
                className="btn btn-ghost mt-5 px-5 py-2 text-sm"
              >
                {translate(locale, "common.back")}
              </Link>
            </div>
          </div>
        </div>
      ) : (
        <div className="mt-10 grid max-w-4xl gap-8 lg:grid-cols-[1fr_320px]">
          <div className="shell">
            <div className="core p-6">
              <dl className="grid gap-4 text-sm sm:grid-cols-2">
                <div>
                  <dt className="text-xs uppercase tracking-[0.16em] text-earth-500">
                    {translate(locale, "order.reference")}
                  </dt>
                  <dd
                    data-testid="order-reference"
                    className="mt-1 font-semibold tracking-[0.14em] text-chili-700"
                  >
                    {order.reference}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs uppercase tracking-[0.16em] text-earth-500">
                    {translate(locale, "order.status")}
                  </dt>
                  <dd className="mt-1">
                    <span className="rounded-full bg-gold-400/20 px-3 py-1 text-xs font-semibold text-earth-800">
                      {order.status === "confirmed"
                        ? translate(locale, "order.status")
                        : translate(locale, "order.pending")}
                    </span>
                  </dd>
                </div>
              </dl>

              <h2 className="mt-8 text-sm font-semibold uppercase tracking-[0.16em] text-earth-500">
                {translate(locale, "order.items")}
              </h2>
              <ul className="mt-3 divide-y divide-earth-900/8 text-sm">
                {order.items.map((item, index) => (
                  <li key={index} className="flex items-center justify-between py-3">
                    <span>
                      {item.title}{" "}
                      <span className="text-earth-500">× {item.quantity}</span>
                    </span>
                    <span className="font-semibold text-earth-900">
                      {money(item.unit_price * item.quantity, locale)}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <aside className="shell h-fit">
            <div className="core p-6">
              <h2 className="text-sm font-semibold uppercase tracking-[0.16em] text-earth-500">
                {translate(locale, "order.subtotal")}
              </h2>
              <p className="mt-2 text-2xl font-semibold text-chili-700">
                {money(order.total, locale)}
              </p>
              <p className="mt-3 text-xs leading-relaxed text-earth-500">
                {translate(locale, "order.pendingBody")}
              </p>
              <Link
                href="/shop"
                className="btn btn-ghost mt-5 w-full px-5 py-2.5 text-sm"
              >
                {translate(locale, "checkout.backToShop")}
              </Link>
            </div>
          </aside>
        </div>
      )}
    </Section>
  );
}
