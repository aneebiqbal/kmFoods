import { isValidPakistaniPhone, translate } from "@kmfoods/shared";
import type { Locale } from "@kmfoods/shared";

/**
 * Checkout validation, kept pure so it can be tested without a DOM. The
 * server re-validates everything; this only catches mistakes before the
 * request and gives the customer an inline message.
 */

export type CheckoutValues = {
  customer_name: string;
  customer_phone: string;
  delivery_city: string;
  delivery_area: string;
  delivery_address: string;
  delivery_notes: string;
  customer_email: string;
};

export type CheckoutErrors = Partial<Record<keyof CheckoutValues, string>>;

export type DeliveryArea = {
  id: string;
  city: string;
  area_name: string;
  serviceable: boolean;
  fee_pkr: number;
};

function normalize(value: string): string {
  return value.trim().toLowerCase().replace(/\s+/g, " ");
}

/**
 * Mirrors the backend's `quoteDelivery`: an exact area match wins, otherwise a
 * city-wide row with an empty area name stands in for the whole city.
 */
export function matchesArea(
  city: string,
  areaName: string,
  areas: DeliveryArea[]
): boolean {
  const cityKey = normalize(city);
  const areaKey = normalize(areaName);
  const inCity = areas.filter((area) => normalize(area.city) === cityKey);
  if (inCity.length === 0) return false;

  const exact =
    inCity.find((area) => normalize(area.area_name) === areaKey) ??
    inCity.find((area) => area.area_name.trim() === "");

  return exact?.serviceable ?? false;
}

export function validateCheckout(
  values: CheckoutValues,
  areas: DeliveryArea[],
  locale: Locale
): CheckoutErrors {
  const errors: CheckoutErrors = {};

  if (!values.customer_name.trim()) {
    errors.customer_name = translate(locale, "checkout.nameRequired");
  }
  if (!isValidPakistaniPhone(values.customer_phone)) {
    errors.customer_phone = translate(locale, "checkout.phoneInvalid");
  }
  if (!values.delivery_city.trim()) {
    errors.delivery_city = translate(locale, "checkout.cityRequired");
  }
  if (!values.delivery_address.trim()) {
    errors.delivery_address = translate(locale, "checkout.addressRequired");
  }
  if (
    values.customer_email &&
    !/^\S+@\S+\.\S+$/.test(values.customer_email.trim())
  ) {
    errors.customer_email = translate(locale, "checkout.emailInvalid");
  }
  if (
    values.delivery_city &&
    !matchesArea(values.delivery_city, values.delivery_area, areas)
  ) {
    errors.delivery_area = translate(locale, "checkout.areaNotServiceable");
  }

  return errors;
}

export function firstError(errors: CheckoutErrors): string | null {
  const key = Object.keys(errors)[0];
  return key ? errors[key as keyof CheckoutValues] ?? null : null;
}
