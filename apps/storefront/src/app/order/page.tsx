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
      <header className="max-w-2xl">
        <h1>{translate(locale, "order.lookupTitle")}</h1>
        <p className="lead mt-4">{translate(locale, "order.lookupBody")}</p>
      </header>

      <div className="mt-10 max-w-2xl">
        <OrderLookup />
      </div>
    </Section>
  );
}
