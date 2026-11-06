import {
  createStep,
  createWorkflow,
  StepResponse,
  WorkflowResponse,
} from "@medusajs/framework/workflows-sdk";
import type { WhatsAppHandoffModuleService } from "../modules/whatsapp-handoff";

export type UpdateWhatsAppHandoffInput = {
  id: string;
  status: "pending" | "confirmed";
};

const updateWhatsAppHandoffStep = createStep(
  "update-whats-app-handoff",
  async (input: UpdateWhatsAppHandoffInput, { container }) => {
    const service =
      container.resolve<WhatsAppHandoffModuleService>("whatsappHandoff");
    const [existing] = await service.listWhatsAppHandoffs({ id: input.id });
    const updated = await service.updateWhatsAppHandoffs({
      selector: { id: input.id },
      data: { status: input.status },
    });
    return new StepResponse(updated[0], existing ?? null);
  },
  async (existing, { container }) => {
    if (!existing?.id) return;
    const service =
      container.resolve<WhatsAppHandoffModuleService>("whatsappHandoff");
    await service.updateWhatsAppHandoffs({
      selector: { id: existing.id },
      data: { status: existing.status },
    });
  }
);

export const updateWhatsAppHandoffWorkflow = createWorkflow(
  "update-whats-app-handoff",
  (input: UpdateWhatsAppHandoffInput) => {
    const handoff = updateWhatsAppHandoffStep(input);
    return new WorkflowResponse(handoff);
  }
);
