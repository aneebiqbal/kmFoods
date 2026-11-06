import { translate } from "@kmfoods/shared";
import { getCart } from "@/lib/cart-server";
import { getDeliveryConfig } from "@/lib/cart-actions";
import { getLocale } from "@/i18n/locale";
import { CheckoutForm } from "@/components/checkout-form";
import { Section } from "@/components/ui";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Checkout",
};

export default async function CheckoutPage() {
  const locale = await getLocale();
  const cart = await getCart();
  const delivery = await getDeliveryConfig();

  return (
    <Section>
      <div className="max-w-2xl">
        <span className="eyebrow">{translate(locale, "common.tagline")}</span>
        <h1 className="mt-4 text-4xl font-semibold sm:text-5xl">
          {translate(locale, "checkout.title")}
        </h1>
        <p className="mt-3 text-ink-600">
          {translate(locale, "checkout.subtitle")}
        </p>
      </div>

      <div className="mt-12">
        <CheckoutForm
          locale={locale}
          areas={delivery.areas}
          feePkr={delivery.fee_pkr}
          items={
            cart?.items.map((item) => ({
              id: item.id,
              title: item.title,
              variantTitle: item.variantTitle,
              quantity: item.quantity,
              unitPrice: item.unitPrice,
            })) ?? []
          }
          subtotal={cart?.subtotal ?? 0}
        />
      </div>
    </Section>
  );
}
