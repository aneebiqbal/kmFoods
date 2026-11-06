import { Module } from "@medusajs/framework/utils";
import DeliveryAreaModuleService from "./services/delivery-area";

export default Module("deliveryArea", { service: DeliveryAreaModuleService });

export { DeliveryAreaModuleService };
export { default as DeliveryArea } from "./models/delivery-area";
