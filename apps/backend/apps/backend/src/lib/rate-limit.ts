import { Redis } from "ioredis";

/**
 * Fixed-window rate limiting.
 *
 * Uses Redis when REDIS_URL is configured so the limit is shared across every
 * backend instance; falls back to a per-process counter otherwise. The
 * in-memory path is marked as a shortcut in the middleware that calls this.
 */

type Result = {
  allowed: boolean;
  remaining: number;
  resetAt: number;
};

const WINDOW_MS = 60_000;
const MAX_ENTRIES = 10_000;

let client: Redis | null | undefined;

function getRedis(): Redis | null {
  if (client !== undefined) return client;
  const url = process.env.REDIS_URL;
  if (!url) {
    client = null;
    return null;
  }
  try {
    client = new Redis(url, {
      maxRetriesPerRequest: 1,
      lazyConnect: false,
      retryStrategy: () => null,
      enableOfflineQueue: false,
    });
    client.on("error", () => {
      // Swallow connection errors; the caller falls back to memory.
    });
    return client;
  } catch {
    client = null;
    return null;
  }
}

// Per-process fallback when Redis is not configured.
const buckets = new Map<string, { count: number; resetAt: number }>();

async function memoryLimit(key: string, limit: number): Promise<Result> {
  if (buckets.size > MAX_ENTRIES) buckets.clear();

  const now = Date.now();
  const bucket = buckets.get(key);

  if (!bucket || bucket.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + WINDOW_MS });
    return { allowed: true, remaining: limit - 1, resetAt: now + WINDOW_MS };
  }

  bucket.count += 1;
  return {
    allowed: bucket.count <= limit,
    remaining: Math.max(0, limit - bucket.count),
    resetAt: bucket.resetAt,
  };
}

export async function rateLimit(key: string, limit: number): Promise<Result> {
  const redis = getRedis();

  if (redis) {
    try {
      const now = Date.now();
      const windowIndex = Math.floor(now / WINDOW_MS);
      const redisKey = `kmfoods:ratelimit:${key}:${windowIndex}`;

      const count = await redis.incr(redisKey);
      if (count === 1) {
        await redis.pexpire(redisKey, WINDOW_MS);
      }

      return {
        allowed: count <= limit,
        remaining: Math.max(0, limit - count),
        resetAt: (windowIndex + 1) * WINDOW_MS,
      };
    } catch {
      // Redis is unreachable — degrade rather than reject traffic.
    }
  }

  return memoryLimit(key, limit);
}
