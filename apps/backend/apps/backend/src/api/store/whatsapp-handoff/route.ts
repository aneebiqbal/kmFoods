import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";
import { buildWhatsAppUrl } from "@kmfoods/shared";
import { createWhatsappHandoffWorkflow } from "../../../workflows/create-whatsapp-handoff";
import { getWhatsAppConfig } from "../../../lib/whatsapp";
import { z } from "@medusajs/framework/zod";
import type { PostCreateWhatsAppHandoff } from "./validators";

/**
 * Creates the pending order and its WhatsApp handoff.
 *
 * This is the only checkout endpoint. It never marks the order as paid or
 * confirmed: KM Foods staff confirm availability and delivery charges first.
 */
export const POST = async (
  req: MedusaRequest<z.infer<typeof PostCreateWhatsAppHandoff>>,
  res: MedusaResponse
) => {
  const { result: handoff, errors } = await createWhatsappHandoffWorkflow(
    req.scope
  ).run({
    input: req.validatedBody,
    throwOnError: false,
  });

  if (errors?.length) {
    throw errors[0]?.error;
  }

  const { phone, configured } = getWhatsAppConfig();

  res.status(201).json({
    handoff: {
      id: handoff.id,
      reference: handoff.reference,
      status: handoff.status,
      order_id: handoff.order_id,
      message: handoff.message,
      customer_name: handoff.customer_name,
      customer_phone: handoff.customer_phone,
      delivery_city: handoff.delivery_city,
      delivery_area: handoff.delivery_area,
      delivery_address: handoff.delivery_address,
    },
    whatsapp: {
      configured,
      number: phone,
      url: configured
        ? buildWhatsAppUrl(phone!, handoff.message)
        : null,
    },
  });
};
