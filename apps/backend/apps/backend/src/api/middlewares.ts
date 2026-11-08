import {
  configureStoreSearch,
  defineMiddlewares,
  MedusaNextFunction,
  MedusaRequest,
  MedusaResponse,
  validateAndTransformBody,
} from "@medusajs/framework/http";
import { ContainerRegistrationKeys } from "@medusajs/framework/utils";
import { PostCreateWhatsAppHandoff } from "./store/whatsapp-handoff/validators";
import { AdminCreateDeliveryArea, AdminUpdateDeliveryArea } from "./admin/delivery-areas/validators";
import { AdminUpdateHandoff } from "./admin/whatsapp-handoffs/validators";
import { rateLimit } from "../lib/rate-limit";

const CHECKOUT_LIMIT = 10;
const ORDER_LOOKUP_LIMIT = 60;

async function rateLimitHeaders(
  res: MedusaResponse,
  limit: number,
  result: { remaining: number; resetAt: number }
) {
  res.setHeader("X-RateLimit-Limit", String(limit));
  res.setHeader("X-RateLimit-Remaining", String(result.remaining));
  res.setHeader("X-RateLimit-Reset", String(Math.ceil(result.resetAt / 1000)));
}

async function checkoutRateLimit(
  req: MedusaRequest,
  res: MedusaResponse,
  next: MedusaNextFunction
) {
  const key = req.ip ?? "unknown";
  const result = await rateLimit(key, CHECKOUT_LIMIT);
  rateLimitHeaders(res, CHECKOUT_LIMIT, result);

  if (!result.allowed) {
    res.status(429).json({
      message: "Too many requests. Please wait a minute and try again.",
    });
    return;
  }

  next();
}

/**
 * Order references are short and sequential. The lookup exposes no customer
 * details, but an unthrottled endpoint would still let anyone enumerate every
 * order. The limit is generous enough for a customer checking their own order.
 */
async function orderLookupRateLimit(
  req: MedusaRequest,
  res: MedusaResponse,
  next: MedusaNextFunction
) {
  const key = `order-lookup:${req.ip ?? "unknown"}`;
  const result = await rateLimit(key, ORDER_LOOKUP_LIMIT);
  rateLimitHeaders(res, ORDER_LOOKUP_LIMIT, result);

  if (!result.allowed) {
    res.status(429).json({
      message: "Too many requests. Please wait a minute and try again.",
    });
    return;
  }

  next();
}

/**
 * Privacy-safe request log line: method, path, status and duration. Never logs
 * bodies, query strings carrying customer details, or headers.
 */
function requestLogger(
  req: MedusaRequest,
  res: MedusaResponse,
  next: MedusaNextFunction
) {
  const start = Date.now();
  res.on("finish", () => {
    const logger = req.scope?.resolve?.(
      ContainerRegistrationKeys.LOGGER
    ) as { info?: (message: string) => void } | undefined;
    logger?.info?.(
      `${req.method} ${req.baseUrl ?? req.url} ${res.statusCode} ${Date.now() - start}ms`
    );
  });
  next();
}

export default defineMiddlewares({
  routes: [
    {
      method: ["POST"],
      matcher: "/store/search",
      middlewares: [
        configureStoreSearch({
          allowed_indexes: {
            product: true,
          },
        }),
      ],
    },
    {
      method: ["POST"],
      matcher: "/store/whatsapp-handoff",
      middlewares: [
        checkoutRateLimit,
        validateAndTransformBody(PostCreateWhatsAppHandoff),
      ],
    },
    {
      method: ["GET"],
      matcher: "/store/whatsapp-handoff/:reference",
      middlewares: [orderLookupRateLimit],
    },
    {
      method: ["POST"],
      matcher: "/admin/delivery-areas",
      middlewares: [validateAndTransformBody(AdminCreateDeliveryArea)],
    },
    {
      method: ["PATCH"],
      matcher: "/admin/delivery-areas/:id",
      middlewares: [validateAndTransformBody(AdminUpdateDeliveryArea)],
    },
    {
      method: ["PATCH"],
      matcher: "/admin/whatsapp-handoffs/:id",
      middlewares: [validateAndTransformBody(AdminUpdateHandoff)],
    },
    {
      matcher: "*",
      middlewares: [requestLogger],
    },
  ],
});
