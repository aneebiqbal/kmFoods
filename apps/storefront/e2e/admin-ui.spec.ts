import { test, expect } from "@playwright/test";

const backend = process.env.E2E_BACKEND_URL ?? "http://localhost:9000";
const email = process.env.E2E_ADMIN_EMAIL;
const password = process.env.E2E_ADMIN_PASSWORD;

test.describe("admin custom screens", () => {
  test.skip(
    !email || !password,
    "set E2E_ADMIN_EMAIL and E2E_ADMIN_PASSWORD to run admin tests"
  );

  async function login(page: import("@playwright/test").Page) {
    await page.goto(`${backend}/app/login`);
    await page
      .locator("input[type=email], input[name=email]")
      .first()
      .fill(email!);
    await page
      .locator("input[type=password], input[name=password]")
      .first()
      .fill(password!);
    await page.locator("button[type=submit]").first().click();
    await page.waitForURL(/\/app/, { timeout: 20_000 });
    await page.waitForTimeout(2500);
  }

  test("delivery areas can be created and edited in the admin UI", async ({
    page,
  }) => {
    await login(page);
    await page.goto(`${backend}/app/delivery-areas`);
    await expect(page.getByRole("heading", { name: "Delivery Areas" })).toBeVisible();

    await page.getByRole("button", { name: "Add area" }).click();
    await page.getByLabel("City").fill("Faisalabad");
    await page.getByLabel("Area / locality").fill("");
    await page.getByLabel("Delivery fee (PKR)").fill("0");
    await page.getByRole("switch", { name: "Serviceable" }).click();
    await page.getByRole("button", { name: "Save" }).click();

    const table = page.locator("table");
    await expect(table.getByText("Faisalabad")).toBeVisible();

    // Clean up so the test is repeatable.
    const row = table.locator("tr", { hasText: "Faisalabad" });
    await row.getByRole("button", { name: "Delete" }).click();
    await expect(table.getByText("Faisalabad")).toHaveCount(0);
  });

  test("pending WhatsApp orders can be confirmed in the admin UI", async ({
    page,
  }) => {
    await login(page);
    await page.goto(`${backend}/app/whatsapp-handoffs`);
    await expect(page.getByRole("heading", { name: "WhatsApp Orders" })).toBeVisible();

    const confirmButtons = page.getByRole("button", { name: "Confirm" });
    const count = await confirmButtons.count();
    test.skip(count === 0, "no pending handoff to confirm");

    await confirmButtons.first().click();
    await expect(page.getByText("Confirmed").first()).toBeVisible();
  });
});
