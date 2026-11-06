import { test, expect } from "@playwright/test";

const CUSTOMER = {
  name: "Playwright Test",
  phone: "0321 1234567",
  city: "Lahore",
  area: "DHA",
  address: "House 1, Street 2, DHA Phase 5, Lahore",
};

test.describe("cart and WhatsApp checkout", () => {
  test("add a product, update quantity and reach checkout", async ({ page }) => {
    await page.goto("/product/red-chili-powder");

    await page.getByRole("button", { name: "1kg" }).click();
    await page.getByRole("button", { name: "Add to cart" }).first().click();
    await expect(page.getByText("Added to your cart.")).toBeVisible();

    await page.goto("/cart");
    await expect(page.getByText("Red Chili Powder").first()).toBeVisible();
    await expect(page.getByText("Rs 800", { exact: true }).first()).toBeVisible();

    await page.getByRole("button", { name: "Increase quantity" }).click();
    await page.getByRole("button", { name: "Update" }).click();
    await expect(page.getByText("Rs 1,600", { exact: true }).first()).toBeVisible();
  });

  test("checkout creates a pending order, a WhatsApp handoff and a status page", async ({
    page,
  }) => {
    await page.goto("/product/turmeric");
    await page.getByRole("button", { name: "100g" }).click();
    await page.getByRole("button", { name: "Add to cart" }).first().click();
    await expect(page.getByText("Added to your cart.")).toBeVisible();

    await page.goto("/checkout");

    await page.getByLabel(/Full name/i).fill(CUSTOMER.name);
    await page.getByLabel(/Phone/i).fill(CUSTOMER.phone);
    await page.getByLabel(/City/i).fill(CUSTOMER.city);
    await page.getByLabel(/Area/i).fill(CUSTOMER.area);
    await page.getByLabel(/Complete address/i).fill(CUSTOMER.address);
    await page.getByRole("button", { name: /Place order on WhatsApp/i }).click();

    await expect(page.getByText("Order reference created")).toBeVisible();

    const reference = (await page
      .getByTestId("order-reference")
      .textContent()) ?? "";
    expect(reference).toMatch(/^KM-\d{6}$/);

    const whatsapp = page.getByRole("link", { name: /Send order on WhatsApp/i });
    await expect(whatsapp).toBeVisible();

    const href = (await whatsapp.getAttribute("href")) ?? "";
    expect(href).toMatch(/^https:\/\/wa\.me\/\d+\?text=/);
    expect(href).toContain(encodeURIComponent(`Order Reference: ${reference}`));
    expect(href).toContain(encodeURIComponent("Turmeric"));
    expect(href).toContain(encodeURIComponent("Rs. 80"));

    // The customer-facing status page shows the same pending reference.
    await page.goto(`/order/${reference}`);
    await expect(page.getByTestId("order-reference")).toContainText(reference);
    await expect(page.getByText("Pending confirmation")).toBeVisible();
  });

  test("rejects an invalid Pakistani phone number", async ({ page }) => {
    await page.goto("/product/turmeric");
    await page.getByRole("button", { name: "Add to cart" }).first().click();
    await expect(page.getByText("Added to your cart.")).toBeVisible();
    await page.goto("/checkout");

    await page.getByLabel(/Full name/i).fill(CUSTOMER.name);
    await page.getByLabel(/Phone/i).fill("12345");
    await page.getByLabel(/City/i).fill(CUSTOMER.city);
    await page.getByLabel(/Complete address/i).fill(CUSTOMER.address);
    await page.getByRole("button", { name: /Place order on WhatsApp/i }).click();

    await expect(
      page.getByText("Enter a valid Pakistani mobile number.")
    ).toBeVisible();
  });

  test("an empty cart shows an empty state on checkout", async ({ page }) => {
    await page.goto("/checkout");
    await expect(page.getByText("Your cart is empty.")).toBeVisible();
  });
});
