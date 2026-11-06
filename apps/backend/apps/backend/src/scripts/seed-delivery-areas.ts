import { ContainerRegistrationKeys } from "@medusajs/framework/utils";
import type { ExecArgs } from "@medusajs/framework/types";
import type { DeliveryAreaModuleService } from "../modules/delivery-area";
import type { DeliveryArea } from "@kmfoods/shared";

/**
 * Seeds the delivery-area configuration. KM Foods currently serves Lahore;
 * everything else is marked not serviceable until the owner adds it.
 *
 *   cd apps/backend && npx medusa exec ./src/scripts/seed-delivery-areas.ts
 *
 * Fees default to 0: the WhatsApp handoff asks staff to confirm the final
 * delivery charge before the order is final.
 */
const DEFAULT_AREAS: Array<{
  city: string;
  area_name: string;
  serviceable: boolean;
  fee_pkr: number;
}> = [
  { city: "Lahore", area_name: "", serviceable: true, fee_pkr: 0 },
  { city: "Karachi", area_name: "", serviceable: false, fee_pkr: 0 },
];

export default async function seedDeliveryAreas({ container }: ExecArgs) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER);
  const deliveryArea = container.resolve<DeliveryAreaModuleService>("deliveryArea");

  const existing = (await deliveryArea.listDeliveryAreas()) as DeliveryArea[];
  const existingKeys = new Set(
    existing.map((area) => `${area.city}::${area.area_name}`)
  );

  const missing = DEFAULT_AREAS.filter(
    (area) => !existingKeys.has(`${area.city}::${area.area_name}`)
  );

  if (!missing.length) {
    logger.info("Delivery areas already configured. Nothing to do.");
    return;
  }

  await deliveryArea.createDeliveryAreas(missing);
  logger.info(`Created ${missing.length} delivery area(s).`);
}
