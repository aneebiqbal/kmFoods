import { test, expect, type APIRequestContext } from "@playwright/test";

const backend = process.env.E2E_BACKEND_URL ?? "http://localhost:9000";
const email = process.env.E2E_ADMIN_EMAIL;
const password = process.env.E2E_ADMIN_PASSWORD;

test.describe("admin order visibility", () => {
  test.skip(
    !email || !password,
    "set E2E_ADMIN_EMAIL and E2E_ADMIN_PASSWORD to run admin tests"
  );

  async function adminToken(request: APIRequestContext): Promise<string> {
    const login = await request.post(`${backend}/auth/user/emailpass`, {
      data: { email, password },
    });
    expect(login.ok()).toBeTruthy();
    const body = (await login.json()) as { token: string };
    return body.token;
  }

  test("an authenticated admin sees pending orders and WhatsApp handoffs", async ({
    request,
  }) => {
    const token = await adminToken(request);
    const headers = { Authorization: `Bearer ${token}` };

    const orders = await request.get(
      `${backend}/admin/orders?limit=5&fields=id,display_id,status`,
      { headers }
    );
    expect(orders.ok()).toBeTruthy();
    const orderBody = (await orders.json()) as {
      orders: Array<{ status: string }>;
    };
    expect(orderBody.orders.length).toBeGreaterThan(0);
    expect(
      orderBody.orders.some((order) => order.status === "pending")
    ).toBeTruthy();

    const handoffs = await request.get(`${backend}/admin/whatsapp-handoffs`, {
      headers,
    });
    expect(handoffs.ok()).toBeTruthy();
    const handoffBody = (await handoffs.json()) as {
      count: number;
      handoffs: Array<{ reference: string; status: string }>;
    };
    expect(handoffBody.count).toBeGreaterThan(0);
    expect(handoffBody.handoffs[0]?.reference).toMatch(/^KM-\d{6}$/);
  });

  test("an admin can confirm a pending handoff", async ({ request }) => {
    const token = await adminToken(request);
    const headers = {
      Authorization: `Bearer ${token}`,
      "content-type": "application/json",
    };

    const list = await request.get(
      `${backend}/admin/whatsapp-handoffs?status=pending`,
      { headers }
    );
    const body = (await list.json()) as {
      handoffs: Array<{ id: string }>;
    };

    test.skip(body.handoffs.length === 0, "no pending handoff to confirm");

    const updated = await request.patch(
      `${backend}/admin/whatsapp-handoffs/${body.handoffs[0]?.id}`,
      { headers, data: { status: "confirmed" } }
    );
    expect(updated.ok()).toBeTruthy();
    const result = (await updated.json()) as {
      handoff: { status: string };
    };
    expect(result.handoff.status).toBe("confirmed");
  });

  test("admin routes reject unauthenticated requests", async ({ request }) => {
    const orders = await request.get(`${backend}/admin/orders`);
    expect(orders.status()).toBe(401);

    const handoffs = await request.get(`${backend}/admin/whatsapp-handoffs`);
    expect(handoffs.status()).toBe(401);
  });

  test("delivery areas are configurable by an admin", async ({ request }) => {
    const token = await adminToken(request);
    const headers = {
      Authorization: `Bearer ${token}`,
      "content-type": "application/json",
    };

    const created = await request.post(`${backend}/admin/delivery-areas`, {
      headers,
      data: { city: "Faisalabad", area_name: "", serviceable: false, fee_pkr: 0 },
    });
    expect(created.ok()).toBeTruthy();
    const body = (await created.json()) as { area: { id: string } };

    const list = await request.get(`${backend}/admin/delivery-areas`, { headers });
    const areas = (await list.json()) as {
      areas: Array<{ city: string }>;
    };
    expect(areas.areas.some((area) => area.city === "Faisalabad")).toBeTruthy();

    await request.delete(`${backend}/admin/delivery-areas/${body.area.id}`, {
      headers,
    });
  });
});
