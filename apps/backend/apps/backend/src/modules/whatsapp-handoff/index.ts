import { Module } from "@medusajs/framework/utils";
import WhatsAppHandoffModuleService from "./services/whatsapp-handoff";

export default Module("whatsappHandoff", {
  service: WhatsAppHandoffModuleService,
});

export { WhatsAppHandoffModuleService };
export { default as WhatsAppHandoff } from "./models/whatsapp-handoff";
