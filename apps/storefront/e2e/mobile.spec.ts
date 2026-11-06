import { test, expect } from "@playwright/test";

const CUSTOMER = {
  name: "Playwright Test",
  phone: "0321 1234567",
  city: "Lahore",
  area: "DHA",
  address: "House 1, Street 2, DHA Phase 5, Lahore",
};

test.describe("mobile purchase experience", () => {
  test("a sticky purchase bar is available on phones", async ({ page }) => {
    await page.goto("/product/red-chili-powder");
    const bar = page.getByRole("button", {
      name: /Add Red Chili Powder to cart/i,
    });
    await expect(bar).toBeVisible();
    await expect(bar).toBeEnabled();
  });

  test("the sticky bar adds the selected pack size to the cart", async ({
    page,
  }) => {
    await page.goto("/product/red-chili-powder");
    const bar = page.getByRole("button", {
      name: /Add Red Chili Powder to cart/i,
    });
    await bar.click();
    await expect(page.getByText("Added to your cart.").first()).toBeVisible();

    // The cart page shows the item with the selected variant.
    await page.goto("/cart");
    await expect(page.getByText("Red Chili Powder").first()).toBeVisible();
    await expect(page.getByText("100g").first()).toBeVisible();
  });

  test("the cart drawer shows the current cart without leaving the page", async ({
    page,
  }) => {
    await page.goto("/product/turmeric");
    await page.getByRole("button", { name: "Add to cart" }).first().click();
    await expect(page.getByText("Added to your cart.").first()).toBeVisible();

    await page.getByRole("button", { name: /^Cart$/ }).click();
    const dialog = page.getByRole("dialog", { name: "Cart" });
    await expect(dialog).toBeVisible();
    await expect(dialog.getByText("Turmeric").first()).toBeVisible();
    await expect(dialog.getByText(/Rs 80/)).toBeVisible();
  });

  test("availability is shown on the product page", async ({ page }) => {
    await page.goto("/product/turmeric");
    await expect(page.getByText("In stock").first()).toBeVisible();
  });
});
