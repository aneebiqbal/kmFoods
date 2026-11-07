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
        <h1>{translate(locale, "cart.title")}</h1>
      </div>

      {!cart || cart.items.length === 0 ? (
        <div className="mt-12">
          <EmptyState
            title={translate(locale, "cart.empty")}
            action={
              <Link href="/shop" className="btn btn-primary mt-2 px-6 py-3 text-sm">
                {translate(locale, "cart.emptyCta")}
              </Link>
            }
          />
        </div>
      ) : (
        <div className="mt-12 grid gap-8 lg:grid-cols-[1fr_360px]">
          <CartLineItems lines={cart.items} />

          <aside className="well h-fit p-6">
            <h2 className="text-title">{translate(locale, "cart.orderSummary")}</h2>
            <dl className="mt-5 space-y-3 text-sm">
              <div className="flex items-center justify-between">
                <dt className="text-ink-2">{translate(locale, "cart.subtotal")}</dt>
                <dd className="price text-base">{money(cart.subtotal, locale)}</dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className="text-ink-2">{translate(locale, "cart.delivery")}</dt>
                <dd className="price text-base">{money(0, locale)}</dd>
              </div>
              <p className="small">{translate(locale, "cart.deliveryNote")}</p>
              <div className="flex items-center justify-between border-t border-rule pt-3">
                <dt className="font-medium text-ink">{translate(locale, "cart.total")}</dt>
                <dd className="price text-xl text-accent">{money(cart.total, locale)}</dd>
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
              className="mt-3 block text-center text-xs font-medium text-ink-2 hover:text-accent"
            >
              {translate(locale, "cart.continue")}
            </Link>
          </aside>
        </div>
      )}
    </Section>
  );
}
