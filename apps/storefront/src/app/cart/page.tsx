import Link from "next/link";
import { translate } from "@kmfoods/shared";
import { getCart } from "@/lib/cart-server";
import { getLocale } from "@/i18n/locale";
import { money } from "@/lib/format";
import { CartLineItems } from "@/components/cart";
import { EmptyState, Section } from "@/components/ui";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Cart",
};

export default async function CartPage() {
  const locale = await getLocale();
  const cart = await getCart();

  return (
    <Section>
      <div className="max-w-2xl">
        <span className="eyebrow">{translate(locale, "common.tagline")}</span>
        <h1 className="mt-4 text-4xl font-semibold sm:text-5xl">
          {translate(locale, "cart.title")}
        </h1>
      </div>

      {!cart || cart.items.length === 0 ? (
        <div className="mt-12">
          <EmptyState
            title={translate(locale, "cart.empty")}
            action={
              <Link
                href="/shop"
                className="btn btn-primary mt-2 px-6 py-3 text-sm"
              >
                {translate(locale, "cart.emptyCta")}
              </Link>
            }
          />
        </div>
      ) : (
        <div className="mt-12 grid gap-8 lg:grid-cols-[1fr_360px]">
          <CartLineItems lines={cart.items} />

          <aside className="shell h-fit">
            <div className="core p-6">
              <h2 className="text-lg font-semibold">
                {translate(locale, "cart.orderSummary")}
              </h2>
              <dl className="mt-5 space-y-3 text-sm">
                <div className="flex items-center justify-between">
                  <dt className="text-ink-600">
                    {translate(locale, "cart.subtotal")}
                  </dt>
                  <dd className="font-semibold text-ink-900">
                    {money(cart.subtotal, locale)}
                  </dd>
                </div>
                <div className="flex items-center justify-between">
                  <dt className="text-ink-600">
                    {translate(locale, "cart.delivery")}
                  </dt>
                  <dd className="font-semibold text-ink-900">
                    {money(0, locale)}
                  </dd>
                </div>
                <p className="text-xs leading-relaxed text-ink-500">
                  {translate(locale, "cart.deliveryNote")}
                </p>
                <div className="flex items-center justify-between border-t border-ink-900/10 pt-3">
                  <dt className="font-semibold text-ink-900">
                    {translate(locale, "cart.total")}
                  </dt>
                  <dd className="text-lg font-semibold text-paprika-700">
                    {money(cart.total, locale)}
                  </dd>
                </div>
              </dl>
              <Link
                href="/checkout"
                className="btn btn-primary mt-6 w-full px-6 py-3 text-sm"
              >
                {translate(locale, "cart.checkout")}
              </Link>
              <Link
                href="/shop"
                className="mt-3 block text-center text-xs font-semibold text-ink-500 hover:text-paprika-700"
              >
                {translate(locale, "cart.continue")}
              </Link>
            </div>
          </aside>
        </div>
      )}
    </Section>
  );
}
