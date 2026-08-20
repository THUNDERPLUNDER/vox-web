/* CONTRACT: Application guards for public AI routes — input and origin checks (#180). */

export const CHAT_MAX_MESSAGE_LENGTH = 2000;

export const CHAT_GUARD_MESSAGES = {
  messageTooLong: "Spørsmålet er litt for langt. Prøv å korte det ned og send på nytt.",
  invalidRequest: "Vi fikk ikke tak i svaret akkurat nå. Prøv igjen.",
} as const;

const ALLOWED_ORIGIN_SUFFIXES = [".vercel.app"] as const;

const ALLOWED_ORIGIN_EXACT = new Set([
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
