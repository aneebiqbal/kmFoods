import type { Metadata } from "next";
import { translate } from "@kmfoods/shared";
import { getLocale } from "@/i18n/locale";
import { OrderLookup } from "@/components/order-lookup";
import { Section } from "@/components/ui";

export const metadata: Metadata = { title: "Order status" };

export default async function OrderPage() {
  const locale = await getLocale();

  return (
    <Section>
      <div className="max-w-2xl">
        <span className="eyebrow">{translate(locale, "common.tagline")}</span>
        <h1 className="mt-4 text-4xl font-semibold sm:text-5xl">
          {translate(locale, "order.title")}
        </h1>
        <p className="mt-3 text-earth-600">
          {translate(locale, "order.pendingBody")}
        </p>
      </div>
      <div className="mt-10 max-w-2xl">
        <OrderLookup />
      </div>
    </Section>
  );
}
