import Link from "next/link";
import { translate } from "@kmfoods/shared";
import { getCart, getCartId } from "@/lib/cart-server";
import { getDeliveryConfig } from "@/lib/cart-actions";
import { getUrduNames, listCategories } from "@/lib/products";
import { getLocale } from "@/i18n/locale";
import { money } from "@/lib/format";
import { CartLedger } from "@/components/cart";
import { EmptyShelf, SummaryRow } from "@/components/purchase";
import { Section } from "@/components/ui";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Cart",
};

export default async function CartPage() {
  const locale = await getLocale();
  const cartId = await getCartId();
  const cart = await getCart();
  const delivery = await getDeliveryConfig();
  const feePkr = delivery?.fee_pkr ?? 0;
  const stale = Boolean(cartId && !cart);

  const categories = await listCategories();
  const urduNames = cart
    ? await getUrduNames(cart.items.map((item) => item.productId))
    : {};
  const lines = cart
    ? cart.items.map((item) => ({
        ...item,
        titleUr: item.titleUr ?? urduNames[item.productHandle] ?? null,
      }))
    : [];

  return (
    <Section>
      <header className="max-w-2xl">
        <h1>{translate(locale, "cart.title")}</h1>
        {cart && cart.items.length > 0 && (
          <p className="lead mt-4">
            {translate(locale, "cart.count", { count: cart.itemCount })}
          </p>
        )}
      </header>

      {!cart || cart.items.length === 0 ? (
        <div className="mt-12">
          <EmptyShelf
            title={translate(locale, "cart.emptyTitle")}
            body={translate(
              locale,
              stale ? "cart.stale" : "cart.emptyBody"
            )}
            help={translate(locale, "cart.emptyHelp")}
            action={
              <div className="mt-2 flex flex-col items-center gap-4">
                <Link
                  href="/shop"
                  className="btn btn-primary px-7 py-3 text-sm"
                >
                  {translate(locale, "cart.emptyCta")}
                </Link>
                {categories.length > 0 && (
                  <ul className="flex flex-wrap justify-center gap-2">
                    {categories.slice(0, 4).map((category) => (
                      <li key={category.id}>
                        <Link
                          href={`/shop?category=${category.handle}`}
                          className="chip"
                        >
                          {category.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            }
          />
        </div>
      ) : (
        <div className="mt-12 grid gap-10 lg:grid-cols-[minmax(0,1fr)_360px]">
          <CartLedger lines={lines} />

          <aside className="well h-fit p-6 lg:sticky lg:top-28">
            <h2 className="text-title">{translate(locale, "cart.orderSummary")}</h2>
            <dl className="mt-5 space-y-3 text-sm">
              <SummaryRow
                label={translate(locale, "cart.subtotal")}
                value={money(cart.subtotal, locale)}
              />
              <div className="summary-row">
                <dt className="text-ink-2">
                  {translate(
                    locale,
                    feePkr > 0 ? "cart.deliveryFee" : "cart.delivery"
                  )}
                </dt>
                <dd className="summary-row__value">
                  {feePkr > 0 ? (
                    <span className="price text-base">
                      {money(feePkr, locale)}
                    </span>
                  ) : (
                    <span className="text-sm font-medium text-ink-2">
                      {translate(locale, "cart.deliveryToConfirm")}
                    </span>
                  )}
                </dd>
              </div>
            </dl>
            <p className="small mt-3">{translate(locale, "cart.deliveryNote")}</p>
            <div className="mt-4 flex items-baseline justify-between border-t border-rule pt-4">
              <span className="font-medium text-ink">
                {translate(locale, "cart.total")}
              </span>
              <span className="price text-xl text-accent">
                {money(cart.subtotal + feePkr, locale)}
              </span>
            </div>
            <p className="small mt-2">{translate(locale, "cart.totalNote")}</p>
            <Link
              href="/checkout"
              className="btn btn-primary mt-6 w-full px-6 py-3 text-sm"
            >
              {translate(locale, "cart.checkout")}
            </Link>
            <Link
              href="/shop"
              className="mt-4 block text-center text-xs font-medium text-ink-2 underline underline-offset-2 transition-colors hover:text-accent"
            >
              {translate(locale, "cart.continue")}
            </Link>
          </aside>
        </div>
      )}
    </Section>
  );
}
