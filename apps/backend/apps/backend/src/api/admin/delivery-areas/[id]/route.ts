import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";
import { z } from "@medusajs/framework/zod";
import { MedusaError } from "@medusajs/framework/utils";
import type { AdminUpdateDeliveryArea } from "../validators";
import {
  deleteDeliveryAreaWorkflow,
  updateDeliveryAreaWorkflow,
} from "../../../../workflows/manage-delivery-areas";

/** Admin: update a delivery area. */
export const PATCH = async (
  req: MedusaRequest<z.infer<typeof AdminUpdateDeliveryArea>>,
  res: MedusaResponse
) => {
  const { result: area, errors } = await updateDeliveryAreaWorkflow(
    req.scope
  ).run({
    input: {
      id: req.params.id,
      ...(req.validatedBody.city !== undefined
        ? { city: req.validatedBody.city }
        : {}),
      ...(req.validatedBody.area_name !== undefined
        ? { area_name: req.validatedBody.area_name }
        : {}),
      ...(req.validatedBody.serviceable !== undefined
        ? { serviceable: req.validatedBody.serviceable }
        : {}),
      ...(req.validatedBody.fee_pkr !== undefined
        ? { fee_pkr: req.validatedBody.fee_pkr }
        : {}),
    },
    throwOnError: false,
  });

  if (errors?.length) {
    throw errors[0]?.error;
  }
  if (!area) {
    throw new MedusaError(MedusaError.Types.NOT_FOUND, "Delivery area not found");
  }

  res.json({ area });
};

/** Admin: delete a delivery area. */
export const DELETE = async (req: MedusaRequest, res: MedusaResponse) => {
  await deleteDeliveryAreaWorkflow(req.scope).run({ input: req.params.id });
  res.status(204).send();
};
