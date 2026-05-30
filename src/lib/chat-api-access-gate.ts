/* CONTRACT: Server-side test access gate for POST /api/chat (#181). */

import { timingSafeEqual } from "node:crypto";

export const CHAT_ACCESS_ENV_KEY = "VIDDEL_CHAT_ACCESS_CODE";

export const CHAT_ACCESS_MESSAGES = {
  denied: "Du trenger en gyldig testkode for å bruke Spør Viddel.",
  unavailable: "Spør Viddel er ikke åpnet for testing akkurat nå.",
} as const;

function readEnv(name: string): string {
  return (process.env[name] ?? import.meta.env[name] ?? "").trim();
}

function isVercelProduction(): boolean {
  return readEnv("VERCEL_ENV") === "production";
}

/** Production always enforces; preview/dev enforce only when env code is set (for local/preview QA). */
export function isChatAccessGateEnforced(): boolean {
  if (isVercelProduction()) return true;
  return Boolean(readEnv(CHAT_ACCESS_ENV_KEY));
}

function getConfiguredAccessCode(): string {
  return readEnv(CHAT_ACCESS_ENV_KEY);
}

function safeCompare(provided: string, expected: string): boolean {
  if (!provided || !expected) return false;
  const providedBuf = Buffer.from(provided, "utf8");
  const expectedBuf = Buffer.from(expected, "utf8");
  if (providedBuf.length !== expectedBuf.length) return false;
  return timingSafeEqual(providedBuf, expectedBuf);
}

export type AccessGateCheckResult =
  | { ok: true; skipped?: boolean }
  | { ok: false; status: 403 | 503; error: string; message: string };

/** Fail closed in production when access code env is missing. */
export function checkChatAccessCode(accessCode: unknown): AccessGateCheckResult {
  if (!isChatAccessGateEnforced()) {
    return { ok: true, skipped: true };
  }

  const configured = getConfiguredAccessCode();
  if (!configured) {
    if (isVercelProduction()) {
      console.error("[api/chat] access_gate_unconfigured");
      return {
        ok: false,
        status: 503,
        error: "access_unavailable",
        message: CHAT_ACCESS_MESSAGES.unavailable,
      };
    }
    return { ok: true, skipped: true };
  }

  const provided = typeof accessCode === "string" ? accessCode.trim() : "";
  if (!provided || !safeCompare(provided, configured)) {
    return {
      ok: false,
      status: 403,
      error: "access_denied",
      message: CHAT_ACCESS_MESSAGES.denied,
    };
  }

  return { ok: true };
}
