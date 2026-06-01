/* CONTRACT: Server-side drift signals for /api/chat — Upstash counters + structured logs, no content. */

import { Redis } from "@upstash/redis";
import { isUpstashConfigured } from "./chat-api-guard.ts";

export type ChatDriftSignal =
  | "request"
  | "success"
  | "error"
  | "rate_limited"
  | "message_too_long"
  | "guard_unavailable"
  | "configuration_missing";

let redisClient: Redis | null | undefined;

function getMetricsRedis(): Redis | null {
  if (redisClient !== undefined) return redisClient;
  if (!isUpstashConfigured()) {
    redisClient = null;
    return null;
  }
  redisClient = Redis.fromEnv();
  return redisClient;
}

function dayKey(): string {
  return new Date().toISOString().slice(0, 10);
}

export function mapApiErrorToDriftSignal(error: string): ChatDriftSignal {
  switch (error) {
    case "message_too_long":
      return "message_too_long";
    case "rate_limited":
      return "rate_limited";
    case "guard_unavailable":
      return "guard_unavailable";
    case "configuration_missing":
      return "configuration_missing";
    default:
      return "error";
  }
}

/** Fire-and-forget — never throws, never logs message/session/IP. */
export function recordChatDriftSignal(signal: ChatDriftSignal, meta?: { error_code?: string }): void {
  console.info("[chat-drift]", {
    signal,
    error_code: meta?.error_code ?? null,
  });

  const redis = getMetricsRedis();
  if (!redis) return;

  const key = `viddel:chat:drift:${signal}:${dayKey()}`;
  void redis
    .incr(key)
    .then(() => redis.expire(key, 60 * 60 * 24 * 45))
    .catch(() => {
      console.error("[chat-drift] metrics_incr_failed", { signal });
    });
}

/** Test helper — reset cached redis client between tests. */
export function resetChatMetricsRedisForTests(): void {
  redisClient = undefined;
}
