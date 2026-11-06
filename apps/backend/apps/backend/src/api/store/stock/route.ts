import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";
import { ContainerRegistrationKeys } from "@medusajs/framework/utils";

/**
 * Stock levels for a batch of variant ids, used by the storefront to show
 * availability. Returns `0` when a variant has no inventory item, so the
 * storefront can render an out-of-stock state.
 *
 *   GET /store/stock?variants=variant_1,variant_2
 */
export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  const requested = String(req.query.variants ?? "")
    .split(",")
    .map((value) => value.trim())
    .filter(Boolean)
    .slice(0, 50);

  if (!requested.length) {
    res.json({ stock: {} });
    return;
  }

  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY);

  const { data: links } = await query.graph({
    entity: "product_variant_inventory_item",
    fields: ["variant_id", "inventory_item_id", "required_quantity"],
    filters: { variant_id: requested },
  } as never);

  const { data: levels } = await query.graph({
    entity: "inventory_level",
    fields: ["inventory_item_id", "stocked_quantity", "reserved_quantity"],
    filters: {
      inventory_item_id: (links as Array<{ inventory_item_id: string }>).map(
        (link) => link.inventory_item_id
      ),
    },
  } as never);

  const stockByItem = new Map(
    (levels as Array<{ inventory_item_id: string; stocked_quantity: number; reserved_quantity: number }>).map(
      (level) => [
        level.inventory_item_id,
        Math.max(
          0,
          Number(level.stocked_quantity ?? 0) - Number(level.reserved_quantity ?? 0)
        ),
      ]
    )
  );

  const stock: Record<string, number> = {};
  for (const variantId of requested) stock[variantId] = 0;

  for (const link of links as Array<{
    variant_id: string;
    inventory_item_id: string;
    required_quantity: number;
  }>) {
    const available = stockByItem.get(link.inventory_item_id) ?? 0;
    const required = Number(link.required_quantity ?? 1) || 1;
    const possible = Math.floor(available / required);
    stock[link.variant_id] = Math.max(stock[link.variant_id] ?? 0, possible);
  }

  res.json({ stock });
};
