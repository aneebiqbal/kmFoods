import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";
import { ContainerRegistrationKeys } from "@medusajs/framework/utils";
import type { DeliveryAreaModuleService } from "../../../modules/delivery-area";
import type { DeliveryArea } from "@kmfoods/shared";

const DEFAULT_DELIVERY_OPTION_NAME = "Lahore Delivery";

/**
 * Everything the checkout needs to know about delivery in one call: which
 * shipping option to add to the cart, and the areas KM Foods serves.
 */
export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  const deliveryArea = req.scope.resolve<DeliveryAreaModuleService>("deliveryArea");
  const areas = (await deliveryArea.listDeliveryAreas()) as DeliveryArea[];

  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY);
  const { data: options } = await query.graph({
    entity: "shipping_option",
    fields: ["id", "name", "amount"],
    filters: { name: DEFAULT_DELIVERY_OPTION_NAME },
  });
  const option = options[0] as
    | { id?: string; name?: string; amount?: number }
    | undefined;

  res.json({
    shipping_option_id: option?.id ?? null,
    shipping_option_name: option?.name ?? null,
    fee_pkr: option?.amount ?? 0,
    areas,
  });
};
