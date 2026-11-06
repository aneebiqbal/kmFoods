import Medusa from "@medusajs/js-sdk";

/**
 * The storefront must never silently fall back to a local backend. On Vercel a
 * localhost URL produces `ECONNREFUSED` during the build, and in production it
 * sends customers to a machine that does not exist.
 */
const baseUrl = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL ?? "";
const publishableKey = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY ?? "";

const LOCAL_HOST = /^(https?:\/\/)?(localhost|127\.0\.0\.1|\[::1\])(:|\/|$)/i;

export function assertMedusaConfigured(): void {
  if (!baseUrl) {
    throw new Error(
      "NEXT_PUBLIC_MEDUSA_BACKEND_URL is not set. Point it at the public URL of your Medusa backend, e.g. https://api.kmfoods.store."
    );
  }

  if (process.env.NODE_ENV === "production" && LOCAL_HOST.test(baseUrl)) {
    // Loud, but not fatal: `next start` against a local backend is a legitimate
    // way to test a production build. A real deployment uses a public URL and
    // never sees this.
    console.warn(
      `[medusa] NEXT_PUBLIC_MEDUSA_BACKEND_URL is "${baseUrl}". ` +
        "A deployed storefront must use the public Medusa URL, not a local backend."
    );
  }
}

export const medusaBaseUrl = baseUrl;
export const medusaPublishableKey = publishableKey;

/**
 * Server-side Medusa client. The publishable key is public by design; the
 * WhatsApp business number and admin credentials never reach this bundle.
 */
export const sdk = new Medusa({
  baseUrl,
  publishableKey,
  auth: { type: "jwt", jwtTokenStorageMethod: "nostore" },
});
