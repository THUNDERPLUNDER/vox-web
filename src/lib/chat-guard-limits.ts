/* CONTRACT: Public chat rate limit config from Vercel env — safe parse, defaults 10/50 (#180). */

export const DEFAULT_CHAT_BURST_LIMIT = 10;
export const DEFAULT_CHAT_DAILY_LIMIT = 50;

export const CHAT_BURST_LIMIT_ENV = "VIDDEL_CHAT_BURST_LIMIT";
export const CHAT_DAILY_LIMIT_ENV = "VIDDEL_CHAT_DAILY_LIMIT";

function readEnv(name: string): string {
  return (process.env[name] ?? import.meta.env[name] ?? "").trim();
}

/** Positive integer only; invalid or missing → default. */
export function parsePositiveIntEnv(name: string, fallback: number): number {
  const raw = readEnv(name);
  if (!raw) return fallback;
  const n = Number.parseInt(raw, 10);
  if (!Number.isFinite(n) || n < 1) return fallback;
  return n;
}

export type ChatRateLimitConfig = {
  burstLimit: number;
  dailyLimit: number;
  burstFromEnv: boolean;
  dailyFromEnv: boolean;
};

export function getChatRateLimitConfig(): ChatRateLimitConfig {
  const burstRaw = readEnv(CHAT_BURST_LIMIT_ENV);
  const dailyRaw = readEnv(CHAT_DAILY_LIMIT_ENV);
  const burstLimit = parsePositiveIntEnv(CHAT_BURST_LIMIT_ENV, DEFAULT_CHAT_BURST_LIMIT);
  const dailyLimit = parsePositiveIntEnv(CHAT_DAILY_LIMIT_ENV, DEFAULT_CHAT_DAILY_LIMIT);
  return {
    burstLimit,
    dailyLimit,
    burstFromEnv: Boolean(burstRaw) && burstLimit === Number.parseInt(burstRaw, 10),
    dailyFromEnv: Boolean(dailyRaw) && dailyLimit === Number.parseInt(dailyRaw, 10),
  };
}
