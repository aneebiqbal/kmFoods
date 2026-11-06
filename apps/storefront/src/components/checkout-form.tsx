"use client";

import Link from "next/link";
import { useState, useTransition, type FormEvent } from "react";
import { useLanguage } from "@/i18n/language-context";
import { isValidPakistaniPhone, type Locale } from "@kmfoods/shared";
import { money } from "@/lib/format";
import { submitCheckoutAction } from "@/lib/cart-actions";
import { IDLE, type ActionState } from "@/lib/action-state";

type Area = {
  id: string;
  city: string;
  area_name: string;
  serviceable: boolean;
  fee_pkr: number;
};

type Item = {
  id: string;
  title: string;
  variantTitle: string;
  quantity: number;
  unitPrice: number;
};

function fieldClass() {
  return "w-full rounded-2xl border border-earth-900/12 bg-cream-50 px-4 py-3 text-sm outline-none transition-colors focus:border-chili-600";
}

export function CheckoutForm({
  locale,
  areas,
  items,
  subtotal,
  feePkr,
}: {
  locale: Locale;
  areas: Area[];
  items: Item[];
  subtotal: number;
  feePkr: number;
}) {
  const { t } = useLanguage();
  const [state, setState] = useState<ActionState>(IDLE);
  const [pending, startTransition] = useTransition();
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("Lahore");
  const [error, setError] = useState<string | null>(null);

  const serviceableCities = [
    ...new Set(areas.filter((area) => area.serviceable).map((area) => area.city)),
  ];
  const cityAreas = areas.filter(
    (area) => area.city.toLowerCase() === city.toLowerCase()
  );
  const hasAreaMatch = cityAreas.some((area) => area.serviceable);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!isValidPakistaniPhone(phone)) {
      setError(t("checkout.phoneInvalid"));
      return;
    }
    if (!hasAreaMatch) {
      setError(t("checkout.areaNotServiceable"));
      return;
    }
    setError(null);
    const formData = new FormData(event.currentTarget);
    startTransition(async () => {
      setState(await submitCheckoutAction(IDLE, formData));
    });
  }

  // The cart is cleared once the order is placed, so an empty item list is only
  // an empty state while no order has been created yet.
  if (items.length === 0 && state.status !== "success") {
    return (
      <div className="shell">
        <div className="core flex flex-col items-center gap-4 px-6 py-16 text-center">
          <h2 className="text-2xl font-semibold">{t("cart.empty")}</h2>
          <Link href="/shop" className="btn btn-primary px-6 py-3 text-sm">
            {t("cart.emptyCta")}
          </Link>
        </div>
      </div>
    );
  }

  if (state.status === "success" && state.reference) {
    return (
      <div className="shell">
        <div className="core flex flex-col items-center gap-4 px-6 py-14 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-leaf-600/10 text-leaf-600">
            <svg
              width="26"
              height="26"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="m5 13 4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-semibold">{t("checkout.successTitle")}</h2>
          <p
            data-testid="order-reference"
            className="text-sm font-semibold tracking-[0.18em] text-chili-700"
          >
            {state.reference}
          </p>
          <p className="max-w-md text-sm leading-relaxed text-earth-600">
            {t("checkout.successBody")}
          </p>
          {state.whatsappUrl ? (
            <a
              href={state.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary mt-2 px-7 py-3 text-sm"
            >
              {t("checkout.sendWhatsapp")}
            </a>
          ) : (
            <p className="mt-2 text-sm text-chili-700">
              {t("checkout.areaNotServiceable")}
            </p>
          )}
          <Link
            href={`/order/${state.reference}`}
            className="link-underline text-sm font-semibold text-earth-700"
          >
            {t("order.title")}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
      <form onSubmit={handleSubmit} className="shell">
        <div className="core flex flex-col gap-5 p-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label
                htmlFor="customer_name"
                className="text-xs font-semibold uppercase tracking-[0.16em] text-earth-500"
              >
                {t("checkout.name")} *
              </label>
              <input
                id="customer_name"
                name="customer_name"
                required
                autoComplete="name"
                className={`mt-2 ${fieldClass()}`}
              />
            </div>
            <div>
              <label
                htmlFor="customer_phone"
                className="text-xs font-semibold uppercase tracking-[0.16em] text-earth-500"
              >
                {t("checkout.phone")} *
              </label>
              <input
                id="customer_phone"
                name="customer_phone"
                required
                inputMode="tel"
                autoComplete="tel"
                value={phone}
                onChange={(event) => setPhone(event.target.value)}
                className={`mt-2 ${fieldClass()}`}
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label
                htmlFor="delivery_city"
                className="text-xs font-semibold uppercase tracking-[0.16em] text-earth-500"
              >
                {t("checkout.city")} *
              </label>
              <input
                id="delivery_city"
                name="delivery_city"
                required
                list="serviceable-cities"
                value={city}
                onChange={(event) => setCity(event.target.value)}
                className={`mt-2 ${fieldClass()}`}
              />
              <datalist id="serviceable-cities">
                {serviceableCities.map((name) => (
                  <option key={name} value={name} />
                ))}
              </datalist>
            </div>
            <div>
              <label
                htmlFor="delivery_area"
                className="text-xs font-semibold uppercase tracking-[0.16em] text-earth-500"
              >
                {t("checkout.area")}
              </label>
              <input
                id="delivery_area"
                name="delivery_area"
                list="city-areas"
                placeholder="DHA, Model Town..."
                className={`mt-2 ${fieldClass()}`}
              />
              <datalist id="city-areas">
                {cityAreas
                  .filter((area) => area.area_name)
                  .map((area) => (
                    <option key={area.id} value={area.area_name} />
                  ))}
              </datalist>
            </div>
          </div>

          <div>
            <label
              htmlFor="delivery_address"
              className="text-xs font-semibold uppercase tracking-[0.16em] text-earth-500"
            >
              {t("checkout.address")} *
            </label>
            <textarea
              id="delivery_address"
              name="delivery_address"
              required
              rows={3}
              autoComplete="street-address"
              className={`mt-2 resize-none ${fieldClass()}`}
            />
          </div>

          <div>
            <label
              htmlFor="customer_email"
              className="text-xs font-semibold uppercase tracking-[0.16em] text-earth-500"
            >
              {t("contact.email")}
            </label>
            <input
              id="customer_email"
              name="customer_email"
              type="email"
              autoComplete="email"
              className={`mt-2 ${fieldClass()}`}
            />
          </div>

          {error && (
            <p className="text-sm text-chili-700" role="alert">
              {error}
            </p>
          )}
          {state.status === "error" && (
            <p className="text-sm text-chili-700" role="alert">
              {state.message}
            </p>
          )}

          <button
            type="submit"
            disabled={pending}
            className="btn btn-primary px-6 py-3 text-sm disabled:cursor-not-allowed disabled:opacity-60"
          >
            {pending ? t("checkout.placing") : t("checkout.placeOrder")}
          </button>
        </div>
      </form>

      <aside className="shell h-fit">
        <div className="core p-6">
          <h2 className="text-lg font-semibold">{t("checkout.review")}</h2>
          <ul className="mt-5 space-y-3 text-sm">
            {items.map((item) => (
              <li
                key={item.id}
                className="flex items-start justify-between gap-3"
              >
                <div>
                  <p className="font-medium text-earth-900">{item.title}</p>
                  <p className="text-xs text-earth-500">
                    {item.variantTitle} × {item.quantity}
                  </p>
                </div>
                <p className="font-semibold text-earth-900">
                  {money(item.unitPrice * item.quantity, locale)}
                </p>
              </li>
            ))}
          </ul>
          <dl className="mt-5 space-y-2 border-t border-earth-900/10 pt-4 text-sm">
            <div className="flex items-center justify-between">
              <dt className="text-earth-600">{t("cart.subtotal")}</dt>
              <dd className="font-semibold">{money(subtotal, locale)}</dd>
            </div>
            <div className="flex items-center justify-between">
              <dt className="text-earth-600">{t("cart.delivery")}</dt>
              <dd className="font-semibold">{money(feePkr, locale)}</dd>
            </div>
            <div className="flex items-center justify-between border-t border-earth-900/10 pt-3">
              <dt className="font-semibold text-earth-900">{t("cart.total")}</dt>
              <dd className="text-lg font-semibold text-chili-700">
                {money(subtotal + feePkr, locale)}
              </dd>
            </div>
          </dl>
          <p className="mt-3 text-xs leading-relaxed text-earth-500">
            {t("cart.deliveryNote")}
          </p>
        </div>
      </aside>
    </div>
  );
}
