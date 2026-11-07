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
        <h1>{translate(locale, "order.title")}</h1>
      </div>

      {failed || !order ? (
        <div className="mt-10 max-w-2xl">
          <div className="well p-8 text-center">
            <p className="lead">{translate(locale, "order.notFound")}</p>
            <Link href="/order" className="btn btn-ghost mt-5 px-5 py-2 text-sm">
              {translate(locale, "common.back")}
            </Link>
          </div>
        </div>
      ) : (
        <div className="mt-10 grid max-w-4xl gap-8 lg:grid-cols-[1fr_320px]">
          <div className="well p-6">
            <dl className="grid gap-4 text-sm sm:grid-cols-2">
              <div>
                <dt className="label">{translate(locale, "order.reference")}</dt>
                <dd data-testid="order-reference" className="price mt-1 text-lg">
                  {order.reference}
                </dd>
              </div>
              <div>
                <dt className="label">{translate(locale, "order.status")}</dt>
                <dd className="mt-1">
                  <span className="inline-flex border border-ink px-3 py-1 text-xs font-medium text-ink">
                    {order.status === "confirmed"
                      ? translate(locale, "order.status")
                      : translate(locale, "order.pending")}
                  </span>
                </dd>
              </div>
            </dl>

            <h2 className="label mt-8">{translate(locale, "order.items")}</h2>
            <ul className="mt-3 divide-y divide-rule text-sm">
              {order.items.map((item, index) => (
                <li key={index} className="flex items-center justify-between py-3">
                  <span>
                    {item.title}{" "}
                    <span className="text-muted">× {item.quantity}</span>
                  </span>
                  <span className="price text-base">
                    {money(item.unit_price * item.quantity, locale)}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <aside className="well h-fit p-6">
            <h2 className="label">{translate(locale, "order.subtotal")}</h2>
            <p className="price mt-2 text-2xl text-accent">{money(order.total, locale)}</p>
            <p className="small mt-3">{translate(locale, "order.pendingBody")}</p>
            <Link
              href="/shop"
              className="btn btn-ghost mt-5 w-full px-5 py-2.5 text-sm"
            >
              {translate(locale, "checkout.backToShop")}
            </Link>
          </aside>
        </div>
      )}
    </Section>
  );
}
