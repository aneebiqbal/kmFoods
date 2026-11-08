export type ActionState = {
  status: "idle" | "success" | "error";
  message?: string;
  reference?: string;
  whatsappUrl?: string | null;
  whatsappConfigured?: boolean;
  orderNote?: string | null;
  /** Snapshot of the purchased lines, taken before the cart is cleared. */
  items?: Array<{
    id: string;
    title: string;
    variantTitle: string;
    quantity: number;
    unitPrice: number;
  }>;
  subtotal?: number;
};

export const IDLE: ActionState = { status: "idle" };
