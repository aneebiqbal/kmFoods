/**
 * Delivery eligibility and fees are business configuration, not code. The
 * storefront only ever reads them; the owner edits them in the admin or the
 * seed script. `fee_pkr` defaults to 0 because KM Foods confirms the final
 * delivery charge with the customer over WhatsApp.
 */
export type DeliveryArea = {
  id: string;
  city: string;
  area_name: string;
  serviceable: boolean;
  fee_pkr: number;
};

export type DeliveryQuote = {
  serviceable: boolean;
  fee_pkr: number;
  matched_area: DeliveryArea | null;
};

function normalize(value: string): string {
  return value.trim().toLowerCase().replace(/\s+/g, " ");
}

/**
 * Matches a delivery request against the configured areas. A row with an empty
 * `area_name` is a city-wide default and matches any area in that city.
 */
export function quoteDelivery(
  city: string,
  areaName: string,
  areas: DeliveryArea[],
): DeliveryQuote {
  const cityKey = normalize(city);
  const areaKey = normalize(areaName);

  const inCity = areas.filter((area) => normalize(area.city) === cityKey);
  if (inCity.length === 0) {
    return { serviceable: false, fee_pkr: 0, matched_area: null };
  }

  const exact =
    inCity.find((area) => normalize(area.area_name) === areaKey) ??
    inCity.find((area) => area.area_name.trim() === "");

  if (!exact) {
    return { serviceable: false, fee_pkr: 0, matched_area: null };
  }

  return {
    serviceable: exact.serviceable,
    fee_pkr: exact.serviceable ? exact.fee_pkr : 0,
    matched_area: exact,
  };
}
