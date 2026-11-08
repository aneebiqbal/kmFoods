import { describe, expect, it } from "vitest";
import {
  firstError,
  matchesArea,
  validateCheckout,
  type CheckoutValues,
  type DeliveryArea,
} from "./checkout-validation";

const areas: DeliveryArea[] = [
  { id: "a1", city: "Lahore", area_name: "", serviceable: true, fee_pkr: 0 },
  { id: "a2", city: "Lahore", area_name: "DHA", serviceable: true, fee_pkr: 0 },
  { id: "a3", city: "Karachi", area_name: "", serviceable: false, fee_pkr: 0 },
];

const valid: CheckoutValues = {
  customer_name: "Ayesha Khan",
  customer_phone: "0321 1234567",
  delivery_city: "Lahore",
  delivery_area: "DHA",
  delivery_address: "House 12, Street 4, DHA Phase 5",
  delivery_notes: "",
  customer_email: "",
};

describe("validateCheckout", () => {
  it("accepts a complete, serviceable delivery", () => {
    expect(validateCheckout(valid, areas, "en")).toEqual({});
  });

  it("requires the name, phone, city and address", () => {
    const errors = validateCheckout(
      {
        ...valid,
        customer_name: "",
        customer_phone: "",
        delivery_city: "",
        delivery_address: "",
      },
      areas,
      "en"
    );

    expect(errors.customer_name).toBe("Enter your full name.");
    expect(errors.customer_phone).toBe("Enter a valid Pakistani mobile number.");
    expect(errors.delivery_city).toBe("Choose your city.");
    expect(errors.delivery_address).toBe("Enter your complete address.");
  });

  it("rejects a phone number that is not a Pakistani mobile", () => {
    const errors = validateCheckout(
      { ...valid, customer_phone: "041 1234567" },
      areas,
      "en"
    );
    expect(errors.customer_phone).toBe("Enter a valid Pakistani mobile number.");
  });

  it("rejects a malformed email but allows a blank one", () => {
    expect(
      validateCheckout({ ...valid, customer_email: "not-an-email" }, areas, "en")
        .customer_email
    ).toBe("Enter a valid email address.");
    expect(
      validateCheckout({ ...valid, customer_email: "" }, areas, "en")
        .customer_email
    ).toBeUndefined();
  });

  it("accepts a blank area when the city has a city-wide default", () => {
    expect(
      validateCheckout({ ...valid, delivery_area: "" }, areas, "en")
        .delivery_area
    ).toBeUndefined();
  });

  it("rejects a city that is not serviceable", () => {
    const errors = validateCheckout(
      { ...valid, delivery_city: "Karachi" },
      areas,
      "en"
    );
    expect(errors.delivery_area).toBe(
      "We do not deliver to this area yet. Please contact us on WhatsApp."
    );
  });

  it("translates the messages into Urdu", () => {
    const errors = validateCheckout(
      { ...valid, customer_name: "" },
      areas,
      "ur"
    );
    expect(errors.customer_name).toBe("اپنا پورا نام درج کریں۔");
  });

  it("reports the first error for focus management", () => {
    expect(firstError({})).toBeNull();
    expect(
      firstError({ customer_name: "Enter your full name." })
    ).toBe("Enter your full name.");
  });
});

describe("matchesArea", () => {
  it("matches an exact serviceable area", () => {
    expect(matchesArea("Lahore", "DHA", areas)).toBe(true);
  });

  it("falls back to the city-wide row when the area is blank", () => {
    expect(matchesArea("Lahore", "", areas)).toBe(true);
  });

  it("falls back to the city-wide row when the area is unknown", () => {
    expect(matchesArea("Lahore", "Unknown", areas)).toBe(true);
  });

  it("does not match a non-serviceable city", () => {
    expect(matchesArea("Karachi", "", areas)).toBe(false);
  });

  it("does not match a city with no rows", () => {
    expect(matchesArea("Islamabad", "", areas)).toBe(false);
  });

  it("matches case-insensitively", () => {
    expect(matchesArea("lahore", "dha", areas)).toBe(true);
  });
});
