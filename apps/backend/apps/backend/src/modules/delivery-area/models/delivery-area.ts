import { model } from "@medusajs/framework/utils";

/**
 * Delivery eligibility and fees are business configuration, not code. The
 * storefront reads these; the owner edits them. `fee_pkr` defaults to 0
 * because KM Foods confirms the final delivery charge over WhatsApp.
 */
const DeliveryArea = model.define("delivery_area", {
  id: model.id({ prefix: "dlva" }).primaryKey(),
  city: model.text(),
  area_name: model.text(),
  serviceable: model.boolean().default(true),
  fee_pkr: model.number().default(0),
  metadata: model.json().nullable(),
});

export default DeliveryArea;
