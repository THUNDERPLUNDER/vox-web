/* CONTRACT: Ops-only reliability metadata gate for /api/chat — never exposed to client and never bypasses Vercel Firewall. */

import { timingSafeEqual } from "node:crypto";

export const OPS_TEST_HEADER = "x-viddel-ops-test-token";

function readEnv(name: string): string {
  return (process.env[name] ?? import.meta.env[name] ?? "").trim();
}

function tokensMatch(provided: string, expected: string): boolean {
  if (!provided || !expected) return false;
  const a = Buffer.from(provided);
  const b = Buffer.from(expected);
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

/** True when server token is configured and request header matches exactly. */
export function isOpsReliabilityRequest(request: Request): boolean {
  const expected = readEnv("VIDDEL_OPS_TEST_TOKEN");
  if (!expected) return false;
  const provided = request.headers.get(OPS_TEST_HEADER)?.trim() ?? "";
  if (!provided) return false;
  return tokensMatch(provided, expected);
}
