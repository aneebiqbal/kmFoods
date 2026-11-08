import { z } from "@medusajs/framework/zod";

export const PostCreateWhatsAppHandoff = z.object({
  cart_id: z.string().min(1),
  delivery_option_id: z.string().min(1),
  customer_name: z.string().trim().min(1).max(120),
  customer_phone: z.string().trim().min(7).max(32),
  delivery_city: z.string().trim().min(1).max(80),
  delivery_area: z.string().trim().max(120).optional(),
  delivery_address: z.string().trim().min(3).max(300),
  delivery_notes: z.string().trim().max(300).optional(),
  customer_email: z.string().trim().email().max(200).optional(),
});
