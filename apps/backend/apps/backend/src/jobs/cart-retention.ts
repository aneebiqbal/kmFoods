import { ContainerRegistrationKeys, Modules } from "@medusajs/framework/utils";
import type { MedusaContainer } from "@medusajs/framework/types";

/**
 * Removes carts that were abandoned and never completed.
 *
 * Disabled unless CART_RETENTION_DAYS is set to a positive number, so no data
 * is ever removed by accident. Only incomplete carts older than the retention
 * window are deleted; completed orders are never touched.
 *
 *   CART_RETENTION_DAYS=180
 */
export const config = {
  name: "cart-retention",
  schedule: "0 3 * * *",
};

export default async function cartRetention(container: MedusaContainer) {
  const retentionDays = Number(process.env.CART_RETENTION_DAYS ?? 0);
  if (!Number.isFinite(retentionDays) || retentionDays <= 0) {
    return;
  }

  const logger = container.resolve(ContainerRegistrationKeys.LOGGER);
  const query = container.resolve(ContainerRegistrationKeys.QUERY);
  const cartService = container.resolve(Modules.CART);

  const cutoff = new Date(Date.now() - retentionDays * 86_400_000);

  const { data: abandoned } = await query.graph({
    entity: "cart",
    fields: ["id"],
    filters: {
      completed_at: null,
      updated_at: { $lt: cutoff.toISOString() },
    },
    limit: 200,
  } as never);

  if (!abandoned.length) return;

  await cartService.deleteCarts(abandoned.map((cart) => cart.id));
  logger.info(
    `Removed ${abandoned.length} abandoned cart(s) older than ${retentionDays} days.`
  );
}
