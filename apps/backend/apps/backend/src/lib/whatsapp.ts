import { normalizePakistaniPhone } from "@kmfoods/shared";

/**
 * The WhatsApp business number comes from configuration, never from the price
 * list. Until the owner supplies the real number, the checkout returns the
 * message text and `configured: false` so no message can be sent to a
 * stranger's number.
 */
export function getWhatsAppConfig(): {
  phone: string | null;
  configured: boolean;
} {
  const raw = process.env.WHATSAPP_BUSINESS_NUMBER?.trim() ?? "";
  const phone = normalizePakistaniPhone(raw);
  return { phone, configured: Boolean(phone) };
}
