import { translate } from "@kmfoods/shared";
import { getCart } from "@/lib/cart-server";
import { getDeliveryConfig } from "@/lib/cart-actions";
import { getLocale } from "@/i18n/locale";
import { CheckoutForm } from "@/components/checkout-form";
import { CatalogueUnavailable, Section } from "@/components/ui";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Checkout",
};

export default async function CheckoutPage() {
  const locale = await getLocale();
  const cart = await getCart();
  const delivery = await getDeliveryConfig();

  if (!delivery) {
    return (
      <Section>
        <div className="max-w-2xl">
          <h1>{translate(locale, "checkout.title")}</h1>
        </div>
        <div className="mt-12">
          <CatalogueUnavailable
            message="We could not reach the store to prepare your delivery details. Please try again in a moment."
          />
        </div>
      </Section>
    );
  }

  return (
    <Section>
      <header className="max-w-2xl">
        <h1>{translate(locale, "checkout.title")}</h1>
        <p className="lead mt-4">{translate(locale, "checkout.subtitle")}</p>
      </header>

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
