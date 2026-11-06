import Medusa from "@medusajs/js-sdk";

const baseUrl =
  process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL ?? "http://localhost:9000";
const publishableKey = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY ?? "";

/**
 * Server-side Medusa client. The publishable key is public by design; the
 * WhatsApp business number and admin credentials never reach this bundle.
 */
export const sdk = new Medusa({
  baseUrl,
  publishableKey,
  auth: { type: "jwt", jwtTokenStorageMethod: "nostore" },
});
