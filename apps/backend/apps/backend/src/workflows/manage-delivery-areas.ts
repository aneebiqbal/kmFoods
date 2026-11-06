import {
  createStep,
  createWorkflow,
  StepResponse,
  WorkflowResponse,
} from "@medusajs/framework/workflows-sdk";
import type { DeliveryAreaModuleService } from "../modules/delivery-area";

export type CreateDeliveryAreaInput = {
  city: string;
  area_name: string;
  serviceable: boolean;
  fee_pkr: number;
};

export type UpdateDeliveryAreaInput = {
  id: string;
  city?: string;
  area_name?: string;
  serviceable?: boolean;
  fee_pkr?: number;
};

const createDeliveryAreaStep = createStep(
  "create-delivery-area",
  async (input: CreateDeliveryAreaInput, { container }) => {
    const service = container.resolve<DeliveryAreaModuleService>("deliveryArea");
    const created = await service.createDeliveryAreas(input);
    return new StepResponse(created);
  },
  async (created, { container }) => {
    if (!created?.id) return;
    const service = container.resolve<DeliveryAreaModuleService>("deliveryArea");
    await service.deleteDeliveryAreas([created.id]);
  }
);

export const createDeliveryAreaWorkflow = createWorkflow(
  "create-delivery-area",
  (input: CreateDeliveryAreaInput) => {
    const area = createDeliveryAreaStep(input);
    return new WorkflowResponse(area);
  }
);

const updateDeliveryAreaStep = createStep(
  "update-delivery-area",
  async (input: UpdateDeliveryAreaInput, { container }) => {
    const service = container.resolve<DeliveryAreaModuleService>("deliveryArea");
    const updated = await service.updateDeliveryAreas({
      selector: { id: input.id },
      data: {
        ...(input.city !== undefined ? { city: input.city } : {}),
        ...(input.area_name !== undefined ? { area_name: input.area_name } : {}),
        ...(input.serviceable !== undefined
          ? { serviceable: input.serviceable }
          : {}),
        ...(input.fee_pkr !== undefined ? { fee_pkr: input.fee_pkr } : {}),
      },
    });
    return new StepResponse(updated[0]);
  },
  async (updated, { container }) => {
    if (!updated?.id) return;
    const service = container.resolve<DeliveryAreaModuleService>("deliveryArea");
    await service.deleteDeliveryAreas([updated.id]);
  }
);

export const updateDeliveryAreaWorkflow = createWorkflow(
  "update-delivery-area",
  (input: UpdateDeliveryAreaInput) => {
    const area = updateDeliveryAreaStep(input);
    return new WorkflowResponse(area);
  }
);

const deleteDeliveryAreaStep = createStep(
  "delete-delivery-area",
  async (id: string, { container }) => {
    const service = container.resolve<DeliveryAreaModuleService>("deliveryArea");
    const [existing] = await service.listDeliveryAreas({ id });
    await service.deleteDeliveryAreas([id]);
    return new StepResponse(undefined, existing ?? null);
  },
  async (existing, { container }) => {
    if (!existing?.id) return;
    const service = container.resolve<DeliveryAreaModuleService>("deliveryArea");
    await service.createDeliveryAreas(existing);
  }
);

export const deleteDeliveryAreaWorkflow = createWorkflow(
  "delete-delivery-area",
  (input: string) => {
    deleteDeliveryAreaStep(input);
    return new WorkflowResponse(undefined);
  }
);
