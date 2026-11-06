import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";
import { z } from "@medusajs/framework/zod";
import type { DeliveryAreaModuleService } from "../../../modules/delivery-area";
import type { AdminCreateDeliveryArea } from "./validators";
import { createDeliveryAreaWorkflow } from "../../../workflows/manage-delivery-areas";

/** Admin: list delivery areas. */
export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  const deliveryArea =
    req.scope.resolve<DeliveryAreaModuleService>("deliveryArea");
  const areas = await deliveryArea.listDeliveryAreas();
  res.json({ areas, count: areas.length });
};

/** Admin: create a delivery area. */
export const POST = async (
  req: MedusaRequest<z.infer<typeof AdminCreateDeliveryArea>>,
  res: MedusaResponse
) => {
  const { result: area } = await createDeliveryAreaWorkflow(req.scope).run({
    input: {
      city: req.validatedBody.city,
      area_name: req.validatedBody.area_name ?? "",
      serviceable: req.validatedBody.serviceable,
      fee_pkr: req.validatedBody.fee_pkr,
    },
  });

  res.status(201).json({ area });
};
