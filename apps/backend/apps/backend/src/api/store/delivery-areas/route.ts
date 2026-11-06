import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";
import type { DeliveryAreaModuleService } from "../../../modules/delivery-area";
import type { DeliveryArea } from "@kmfoods/shared";

/** Public list of delivery areas, used by the checkout form. */
export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  const deliveryArea = req.scope.resolve<DeliveryAreaModuleService>("deliveryArea");
  const areas = (await deliveryArea.listDeliveryAreas()) as DeliveryArea[];
  res.json({ areas });
};
