import { z } from "@medusajs/framework/zod";

export const AdminCreateDeliveryArea = z.object({
  city: z.string().trim().min(1),
  area_name: z.string().trim().max(120).optional().default(""),
  serviceable: z.boolean().optional().default(true),
  fee_pkr: z.number().int().min(0).optional().default(0),
});

export const AdminUpdateDeliveryArea = z.object({
  city: z.string().trim().min(1).optional(),
  area_name: z.string().trim().max(120).optional(),
  serviceable: z.boolean().optional(),
  fee_pkr: z.number().int().min(0).optional(),
});
