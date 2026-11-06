import { test, expect } from "@playwright/test";

test.describe("catalogue browsing", () => {
  test("homepage loads with real products and prices", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("heading", { level: 1 })).toContainText(
      "Har Ghar Ka Zaiqa"
    );
    await expect(page.getByText("Rs 85").first()).toBeVisible();
  });

  test("shop lists database-backed products", async ({ page }) => {
    await page.goto("/shop");
    await expect(page.getByText(/66 products/)).toBeVisible();
    await expect(page.getByRole("heading", { level: 1 })).toContainText("Shop");
  });

  test("category filter narrows the catalogue", async ({ page }) => {
    await page.goto("/shop", { waitUntil: "networkidle" });
    await page
      .locator("div[role=group][aria-label=Category]")
      .getByRole("link", { name: "Chilies & Peppers", exact: true })
      .click();
    await expect(page).toHaveURL(/category=chilies-peppers/);
    await expect(page.getByTestId("result-count")).toBeVisible();
  });

  test("search finds a product by name", async ({ page }) => {
    await page.goto("/shop", { waitUntil: "networkidle" });
    await page.locator('input[name="q"]').fill("turmeric");
    await page.locator("#main-content").getByRole("button", { name: "Search" }).click();
    await expect(page.getByTestId("result-count")).toContainText("1 products");
    await expect(page.getByText("Turmeric").first()).toBeVisible();
  });

  test("empty search shows the empty state", async ({ page }) => {
    await page.goto("/shop?q=zzzznotaproduct");
    await expect(page.getByText("No products match your search.")).toBeVisible();
  });

  test("product page shows variants, prices and an add-to-cart action", async ({
    page,
  }) => {
    await page.goto("/product/red-chili-powder");
    await expect(page.getByRole("heading", { level: 1 })).toContainText(
      "Red Chili Powder"
    );
    await expect(page.getByRole("button", { name: "100g" })).toBeVisible();
    await expect(page.getByRole("button", { name: "1kg" })).toBeVisible();
    await expect(page.getByText("Rs 80", { exact: true }).first()).toBeVisible();
    await expect(
      page.getByRole("button", { name: /Add to cart/i })
    ).toBeVisible();
  });

  test("draft products are not published", async ({ page }) => {
    await page.goto("/product/kachri-powder");
    await expect(page.getByText("Page not found")).toBeVisible();
  });
});
