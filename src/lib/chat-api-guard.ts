/* CONTRACT: Server-side guards for POST /api/chat — origin check, IP rate limits (#180). */

import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { getChatRateLimitConfig } from "./chat-guard-limits.ts";
import { isOpsReliabilityRequest } from "./chat-ops-test.ts";

export const CHAT_MAX_MESSAGE_LENGTH = 2000;

export const CHAT_GUARD_MESSAGES = {
  messageTooLong: "Spørsmålet er litt for langt. Prøv å korte det ned og send på nytt.",
  rateLimited: "Du har stilt mange spørsmål på kort tid. Prøv igjen litt senere.",
  invalidRequest: "Vi fikk ikke tak i svaret akkurat nå. Prøv igjen.",
  guardUnavailable: "Viddel er ikke tilgjengelig akkurat nå.",
} as const;

const ALLOWED_ORIGIN_SUFFIXES = [".vercel.app"] as const;

const ALLOWED_ORIGIN_EXACT = new Set([
  "https://vox.raddum.no",
  "https://viddel.no",
  "https://www.viddel.no",
]);

function readEnv(name: string): string {
  return (process.env[name] ?? import.meta.env[name] ?? "").trim();
}

export function isChatGuardProduction(): boolean {
  const vercelEnv = readEnv("VERCEL_ENV");
  if (vercelEnv === "production") return true;
  if (vercelEnv === "preview" || vercelEnv === "development") return false;
  return import.meta.env.PROD === true;
}

export function isUpstashConfigured(): boolean {
  return Boolean(readEnv("UPSTASH_REDIS_REST_URL") && readEnv("UPSTASH_REDIS_REST_TOKEN"));
}

function normalizeOrigin(value: string): string | null {
  const trimmed = value.trim();
  if (!trimmed) return null;
  try {
    const url = new URL(trimmed);
    return `${url.protocol}//${url.host}`;
  } catch {
    return null;
  }
}

function isAllowedOrigin(origin: string): boolean {
  if (ALLOWED_ORIGIN_EXACT.has(origin)) return true;
  if (origin.startsWith("http://localhost") || origin.startsWith("https://localhost")) return true;
  if (origin.startsWith("http://127.0.0.1") || origin.startsWith("https://127.0.0.1")) return true;
  try {
    const { hostname, protocol } = new URL(origin);
    if (protocol !== "https:") return false;
    return ALLOWED_ORIGIN_SUFFIXES.some((suffix) => hostname.endsWith(suffix));
  } catch {
    return false;
  }
}

/** Extra friction — not primary security. Skipped in Astro dev. */
export function checkChatOrigin(request: Request): { ok: true } | { ok: false; message: string } {
  if (import.meta.env.DEV) {
    return { ok: true };
  }

  const origin = normalizeOrigin(request.headers.get("origin") ?? "");
  const referer = request.headers.get("referer") ?? "";
  const refererOrigin = referer ? normalizeOrigin(referer) : null;

  if (origin && isAllowedOrigin(origin)) return { ok: true };
  if (refererOrigin && isAllowedOrigin(refererOrigin)) return { ok: true };

  if (!origin && !refererOrigin && !isChatGuardProduction()) {
    return { ok: true };
  }

  return { ok: false, message: CHAT_GUARD_MESSAGES.invalidRequest };
}

export function getClientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    const first = forwarded.split(",")[0]?.trim();
    if (first) return first;
  }
  const realIp = request.headers.get("x-real-ip")?.trim();
  if (realIp) return realIp;
  return "unknown";
}

type RateLimitState = {
  burst: Ratelimit;
  daily: Ratelimit;
};

let rateLimitState: RateLimitState | null | undefined;

function getRateLimiters(): RateLimitState | null {
  if (rateLimitState !== undefined) return rateLimitState;
  if (!isUpstashConfigured()) {
    rateLimitState = null;
    return null;
  }
  const redis = Redis.fromEnv();
  const { burstLimit, dailyLimit } = getChatRateLimitConfig();
  rateLimitState = {
    burst: new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(burstLimit, "10 m"),
      prefix: "viddel-chat-burst",
    }),
    daily: new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(dailyLimit, "24 h"),
      prefix: "viddel-chat-daily",
    }),
  };
  return rateLimitState;
}

export type RateLimitCheckResult =
  | { ok: true; skipped?: boolean; opsBypass?: boolean }
  | { ok: false; status: 429 | 503; error: string; message: string };

/** Fail closed in production when Upstash env is missing. Ops reliability token bypasses burst/daily only. */
export async function checkChatRateLimit(request: Request): Promise<RateLimitCheckResult> {
  if (isOpsReliabilityRequest(request)) {
    return { ok: true, skipped: true, opsBypass: true };
  }

  const limiters = getRateLimiters();
  if (!limiters) {
    if (isChatGuardProduction()) {
      console.error("[api/chat] rate_limit_unconfigured");
      return {
        ok: false,
        status: 503,
        error: "guard_unavailable",
        message: CHAT_GUARD_MESSAGES.guardUnavailable,
      };
    }
    return { ok: true, skipped: true };
  }

  const identifier = getClientIp(request);

  try {
    const burst = await limiters.burst.limit(identifier);
    if (!burst.success) {
      return {
        ok: false,
        status: 429,
        error: "rate_limited",
        message: CHAT_GUARD_MESSAGES.rateLimited,
      };
    }

    const daily = await limiters.daily.limit(identifier);
    if (!daily.success) {
      return {
        ok: false,
        status: 429,
        error: "rate_limited",
        message: CHAT_GUARD_MESSAGES.rateLimited,
      };
    }

    return { ok: true };
  } catch (error) {
    console.error("[api/chat] rate_limit_storage_error");
    if (isChatGuardProduction()) {
      return {
        ok: false,
        status: 503,
        error: "guard_unavailable",
        message: CHAT_GUARD_MESSAGES.guardUnavailable,
      };
    }
    return { ok: true, skipped: true };
  }
}

/** Test helper — reset cached limiters between tests. */
export function resetChatRateLimitersForTests(): void {
  rateLimitState = undefined;
}
