import { z } from "@medusajs/framework/zod";

export const AdminUpdateHandoff = z.object({
  status: z.enum(["pending", "confirmed"]),
});
