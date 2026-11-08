import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";
import { ContainerRegistrationKeys } from "@medusajs/framework/utils";
import type { WhatsAppHandoffModuleService } from "../../../../modules/whatsapp-handoff";

/**
 * Public order-status lookup by the customer-facing reference (KM-000123).
 * Exposes only what the customer needs: status, items and their own details.
 */
export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  const handoffService =
    req.scope.resolve<WhatsAppHandoffModuleService>("whatsappHandoff");

  const handoffs = await handoffService.listWhatsAppHandoffs({
    reference: req.params.reference,
  });
  const handoff = handoffs[0];

  if (!handoff) {
    res.status(404).json({
      message: `No order found with reference ${req.params.reference}`,
    });
    return;
  }

  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY);
  const { data: orders } = await query.graph({
    entity: "order",
    fields: ["id", "display_id", "total", "currency_code", "payment_status", "items.title", "items.quantity", "items.unit_price"],
    filters: { id: handoff.order_id },
  });
  const order = orders[0];

  res.json({
    reference: handoff.reference,
    status: handoff.status,
    order_id: handoff.order_id,
    created_at: handoff.created_at,
    items: order?.items ?? [],
    total: order?.total ?? null,
    currency_code: order?.currency_code ?? null,
    payment_status: order?.payment_status ?? null,
  });
};
