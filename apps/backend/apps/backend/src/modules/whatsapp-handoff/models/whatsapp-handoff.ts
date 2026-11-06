import { model } from "@medusajs/framework/utils";

/**
 * A WhatsApp handoff is the pending order created when a customer asks to
 * order over WhatsApp. Opening WhatsApp does not place the order: the status
 * stays `pending` until KM Foods staff confirm it in the admin.
 */
const WhatsAppHandoff = model.define("whatsapp_handoff", {
  id: model.id({ prefix: "whho" }).primaryKey(),
  order_id: model.text().unique(),
  cart_id: model.text().unique(),
  reference: model.text().unique(),
  status: model.enum(["pending", "confirmed"]).default("pending"),
  message: model.text(),
  customer_name: model.text(),
  customer_phone: model.text(),
  delivery_city: model.text(),
  delivery_area: model.text().nullable(),
  delivery_address: model.text(),
  metadata: model.json().nullable(),
});

export default WhatsAppHandoff;
