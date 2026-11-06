import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";
import { z } from "@medusajs/framework/zod";
import type { AdminUpdateHandoff } from "../validators";
import { updateWhatsAppHandoffWorkflow } from "../../../../workflows/update-whatsapp-handoff";

/** Admin: confirm a handoff after KM Foods staff verify the order. */
export const PATCH = async (
  req: MedusaRequest<z.infer<typeof AdminUpdateHandoff>>,
  res: MedusaResponse
) => {
  const { result: handoff } = await updateWhatsAppHandoffWorkflow(
    req.scope
  ).run({
    input: { id: req.params.id, status: req.validatedBody.status },
  });

  res.json({ handoff });
};
