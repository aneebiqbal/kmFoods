import type { Metadata } from "next";
import Link from "next/link";
import { translate } from "@kmfoods/shared";
import { sdk } from "@/lib/medusa";
import { getLocale } from "@/i18n/locale";
import { money } from "@/lib/format";
import type { OrderStatus } from "@/lib/types";
import { Section } from "@/components/ui";
import { StatusPill, SummaryRow } from "@/components/purchase";

export const dynamic = "force-dynamic";

export const metadata: Metadata = { title: "Order status" };

function formatDate(value: string, locale: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString(locale === "ur" ? "ur-PK" : "en-PK", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

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

  const confirmed = order?.status === "confirmed";

  return (
    <Section>
      <header className="max-w-2xl">
        <h1>{translate(locale, "order.title")}</h1>
      </header>

      {failed || !order ? (
        <div className="mt-10 max-w-2xl">
          <div className="well p-8">
            <h2 className="text-title">{translate(locale, "order.notFound")}</h2>
            <p className="lead mt-3">
              {translate(locale, "order.notFoundBody")}
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link href="/order" className="btn btn-primary px-5 py-2.5 text-sm">
                {translate(locale, "common.back")}
              </Link>
              <Link href="/contact" className="btn btn-ghost px-5 py-2.5 text-sm">
                {translate(locale, "order.supportCta")}
              </Link>
            </div>
          </div>
        </div>
      ) : (
        <div className="record mt-12">
          <header className="record__head">
            <div>
              <p className="label">{translate(locale, "order.reference")}</p>
              <p data-testid="order-reference" className="record__number">
                {order.reference}
              </p>
            </div>
            <div className="record__status">
              <p className="label">{translate(locale, "order.status")}</p>
              <StatusPill
                status={confirmed ? "confirmed" : "pending"}
                label={translate(
                  locale,
                  confirmed ? "order.statusConfirmed" : "order.pending"
                )}
              />
            </div>
          </header>

          <div className="record__grid">
            <div className="record__main">
              <h2 className="label">{translate(locale, "order.items")}</h2>
              {order.items.length === 0 ? (
                <p className="small mt-3">{translate(locale, "order.empty")}</p>
              ) : (
                <ul className="mt-3 divide-y divide-rule text-sm">
                  {order.items.map((item, index) => (
                    <li key={index} className="flex items-center justify-between gap-3 py-3">
                      <span className="min-w-0">
                        <span className="font-medium text-ink">{item.title}</span>{" "}
                        <span className="small">× {item.quantity}</span>
                      </span>
                      <span className="price shrink-0 text-base">
                        {money(item.unit_price * item.quantity, locale)}
                      </span>
                    </li>
                  ))}
                </ul>
              )}

              <dl className="mt-5 space-y-2 border-t border-rule pt-4 text-sm">
                <SummaryRow
                  label={translate(locale, "order.subtotal")}
                  value={money(order.total, locale)}
                />
                <div className="summary-row">
                  <dt className="text-ink-2">
                    {translate(locale, "order.payment")}
                  </dt>
                  <dd className="summary-row__value">
                    <span className="text-sm font-medium text-ink-2">
                      {translate(locale, "order.paymentAwaiting")}
                    </span>
                  </dd>
                </div>
              </dl>
            </div>

            <aside className="record__aside">
              <h2 className="label">{translate(locale, "order.nextAction")}</h2>
              <p className="small mt-3">
                {translate(locale, "order.nextActionBody")}
              </p>
              <p className="small mt-4">
                {translate(locale, "order.created")}:{" "}
                {formatDate(order.created_at, locale)}
              </p>
              <div className="mt-5 border-t border-rule pt-4">
                <h3 className="label">{translate(locale, "order.support")}</h3>
                <Link
                  href="/contact"
                  className="btn btn-ghost mt-3 w-full px-5 py-2.5 text-sm"
                >
                  {translate(locale, "order.supportCta")}
                </Link>
              </div>
            </aside>
          </div>
        </div>
      )}
    </Section>
  );
}
