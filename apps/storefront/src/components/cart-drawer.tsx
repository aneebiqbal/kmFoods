"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useLanguage } from "@/i18n/language-context";
import { money } from "@/lib/format";
import type { StoreCart } from "@/lib/types";
import { ProductVisual } from "@/components/product-visual";
import { BodyPortal } from "@/components/body-portal";

type CartLine = StoreCart["items"][number];

function DrawerLine({ line, locale }: { line: CartLine; locale: "en" | "ur" }) {
  return (
    <li className="flex items-center gap-3">
      <div className="h-14 w-14 shrink-0 overflow-hidden rounded-xl">
        <ProductVisual
          title={line.title}
          titleUr={null}
          category={null}
          locale={locale}
          className="h-full w-full"
        />
      </div>
      <div className="min-w-0 flex-1">
        <Link
          href={`/product/${line.productHandle}`}
          className="block truncate text-sm font-semibold text-bone-50 hover:text-saffron-400"
        >
          {line.title}
        </Link>
        <p className="text-xs text-bone-100/50">
          {line.variantTitle} × {line.quantity}
        </p>
      </div>
      <p className="text-sm font-semibold text-saffron-400">
        {money(line.unitPrice * line.quantity, locale)}
      </p>
    </li>
  );
}

/**
 * Cart drawer — a dark atelier panel. A server route supplies the cart so the
 * drawer never trusts client-side totals; the full cart page remains the
 * editing surface.
 */
export function CartDrawer() {
  const { t, locale } = useLanguage();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [cart, setCart] = useState<StoreCart | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open) return;
    let cancelled = false;
    setLoading(true);

    fetch("/api/cart", { cache: "no-store" })
      .then((response) => (response.ok ? response.json() : null))
      .then((data) => {
        if (!cancelled) setCart(data?.cart ?? null);
      })
      .catch(() => {
        if (!cancelled) setCart(null);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [open]);

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }
    if (open) {
      document.addEventListener("keydown", onKey);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  const itemCount = cart?.itemCount ?? 0;

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="btn btn-ghost relative px-3 py-2 text-sm"
        aria-label={t("nav.cart")}
      >
        <span className="hidden sm:inline">{t("nav.cart")}</span>
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M6 7h12l1 13H5L6 7Z" />
          <path d="M9 7a3 3 0 0 1 6 0" />
        </svg>
        {itemCount > 0 && (
          <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-paprika-500 px-1 text-[0.625rem] font-bold text-bone-50">
            {itemCount}
          </span>
        )}
      </button>

      {open && (
        <BodyPortal>
        <div
          className="fixed inset-0 z-50 flex justify-end bg-aubergine-900/55 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-label={t("nav.cart")}
          onClick={() => setOpen(false)}
        >
          <aside
            className="core-dark grain grain-dark flex h-full w-full max-w-md flex-col"
            onClick={(event) => event.stopPropagation()}
          >
            <header className="flex items-center justify-between border-b border-bone-50/10 px-5 py-4">
              <h2 className="text-lg font-semibold text-bone-50">{t("cart.title")}</h2>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label={t("common.close")}
                className="rounded-full p-2 text-bone-100/70 transition-colors hover:bg-bone-50/10 hover:text-bone-50"
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  aria-hidden="true"
                >
                  <path d="M6 6l12 12M18 6L6 18" />
                </svg>
              </button>
            </header>

            <div className="flex-1 overflow-y-auto px-5 py-4">
              {loading && (
                <ul className="space-y-4" aria-hidden="true">
                  {Array.from({ length: 3 }).map((_, index) => (
                    <li key={index} className="flex animate-pulse gap-3">
                      <div className="h-14 w-14 rounded-xl bg-bone-50/10" />
                      <div className="flex-1 space-y-2 py-1">
                        <div className="h-3 w-3/4 rounded bg-bone-50/10" />
                        <div className="h-3 w-1/2 rounded bg-bone-50/10" />
                      </div>
                    </li>
                  ))}
                </ul>
              )}

              {!loading && (!cart || cart.items.length === 0) && (
                <p className="py-12 text-center text-sm text-bone-100/60">
                  {t("cart.emptyCart")}
                </p>
              )}

              {!loading && cart && cart.items.length > 0 && (
                <ul className="space-y-4">
                  {cart.items.map((line) => (
                    <DrawerLine key={line.id} line={line} locale={locale} />
                  ))}
                </ul>
              )}
            </div>

            {cart && cart.items.length > 0 && (
              <footer className="border-t border-bone-50/10 px-5 py-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-bone-100/70">{t("cart.subtotal")}</span>
                  <span className="font-semibold text-bone-50">
                    {money(cart.subtotal, locale)}
                  </span>
                </div>
                <p className="mt-1 text-xs text-bone-100/50">{t("cart.deliveryNote")}</p>
                <button
                  type="button"
                  onClick={() => {
                    setOpen(false);
                    router.push("/cart");
                  }}
                  className="btn btn-on-dark mt-4 w-full px-6 py-3 text-sm"
                >
                  {t("cart.title")}
                </button>
                <Link
                  href="/checkout"
                  onClick={() => setOpen(false)}
                  className="btn btn-accent mt-2 w-full px-6 py-3 text-sm"
                >
                  {t("cart.checkout")}
                </Link>
              </footer>
            )}
          </aside>
        </div>
        </BodyPortal>
      )}
    </>
  );
}
