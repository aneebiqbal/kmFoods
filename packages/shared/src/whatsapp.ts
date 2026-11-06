export type WhatsAppOrderLine = {
  title: string;
  quantity: number;
  unit_price_pkr: number;
};

export type WhatsAppOrder = {
  reference: string;
  lines: WhatsAppOrderLine[];
  subtotal_pkr: number;
  customer_name: string;
  customer_phone: string;
  delivery_city: string;
  delivery_area: string;
  delivery_address: string;
};

function money(amount: number): string {
  return `Rs. ${amount.toLocaleString("en-PK")}`;
}

/**
 * Builds the WhatsApp handoff message. Opening WhatsApp does not place the
 * order — KM Foods staff confirm it, including delivery charges.
 */
export function buildWhatsAppMessage(order: WhatsAppOrder): string {
  const lines = order.lines
    .map((line) => `${line.title} x ${line.quantity}`)
    .join("\n");

  return [
    "Hello KM Foods,",
    "",
    "I would like to place an order.",
    "",
    `Order Reference: ${order.reference}`,
    "",
    "Items:",
    lines,
    "",
    `Product Subtotal: ${money(order.subtotal_pkr)}`,
    "",
    `Name: ${order.customer_name}`,
    `Phone: ${order.customer_phone}`,
    `Delivery Area: ${order.delivery_city}${order.delivery_area ? ` - ${order.delivery_area}` : ""}`,
    `Address: ${order.delivery_address}`,
    "",
    "Please confirm availability,",
    "delivery charges and final total.",
  ].join("\n");
}

/** wa.me deep link. The number must be digits only, without "+". */
export function buildWhatsAppUrl(phone: string, message: string): string {
  const digits = phone.replace(/\D/g, "");
  const text = encodeURIComponent(message);
  return `https://wa.me/${digits}?text=${text}`;
}
