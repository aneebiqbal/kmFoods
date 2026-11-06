export type ActionState = {
  status: "idle" | "success" | "error";
  message?: string;
  reference?: string;
  whatsappUrl?: string | null;
};

export const IDLE: ActionState = { status: "idle" };
