import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";
import { ContainerRegistrationKeys } from "@medusajs/framework/utils";
import type { WhatsAppHandoffModuleService } from "../../../modules/whatsapp-handoff";

/**
 * Admin: list WhatsApp handoffs, newest first, with the order snapshot so the
 * staff can review items and the subtotal without leaving the page.
 */
export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  const handoffService =
    req.scope.resolve<WhatsAppHandoffModuleService>("whatsappHandoff");

  const status = req.query.status ? String(req.query.status) : undefined;
  const reference = req.query.reference ? String(req.query.reference) : undefined;

  const handoffs = await handoffService.listWhatsAppHandoffs({
    ...(status ? { status } : {}),
    ...(reference ? { reference } : {}),
  });

  if (!handoffs.length) {
    res.json({ handoffs: [], count: 0 });
    return;
  }

  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY);
  const { data: orders } = await query.graph({
    entity: "order",
    fields: [
      "id",
      "total",
      "currency_code",
      "items.title",
      "items.quantity",
      "items.unit_price",
    ],
    filters: { id: handoffs.map((handoff) => handoff.order_id) },
  });

  const orderById = new Map(
    (orders as Array<Record<string, unknown>>).map((order) => [order.id, order])
  );

  const payload = handoffs.map((handoff) => {
    const order = orderById.get(handoff.order_id) as
      | {
          total?: number | string;
          items?: Array<{
            title?: string | null;
            quantity?: number;
            unit_price?: number;
          }>;
        }
      | undefined;

    return {
      ...handoff,
      total: order?.total ?? null,
      items: (order?.items ?? []).map((item) => ({
        title: item.title ?? null,
        quantity: Number(item.quantity ?? 0),
        unit_price: Number(item.unit_price ?? 0),
      })),
    };
  });

  res.json({ handoffs: payload, count: payload.length });
};
