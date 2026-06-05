/* CONTRACT: Simple shared-password Lab gate for /lab/* and /api/lab/* (#237). Not production user auth. */

import { createHmac, timingSafeEqual } from "node:crypto";

export const LAB_SESSION_COOKIE = "viddel_lab_session";
const SESSION_TTL_MS = 12 * 60 * 60 * 1000;

function readEnv(name: string): string {
  return (process.env[name] ?? import.meta.env[name] ?? "").trim();
}

/** Vercel Production — Lab prototype routes stay closed. */
export function isLabBlockedInProduction(): boolean {
  return readEnv("VERCEL_ENV") === "production";
}

export function isLabAuthConfigured(): boolean {
  return Boolean(readEnv("VIDDEL_LAB_PASSWORD") && readEnv("VIDDEL_LAB_COOKIE_SECRET"));
}

/** Lab routes available when auth env is set and not on Vercel Production. */
export function isLabRouteAvailable(): boolean {
  if (isLabBlockedInProduction()) return false;
  return isLabAuthConfigured();
}

function labCookieSecret(): string {
  return readEnv("VIDDEL_LAB_COOKIE_SECRET");
}

function labPassword(): string {
  return readEnv("VIDDEL_LAB_PASSWORD");
}

function signPayload(payload: string): string {
  return createHmac("sha256", labCookieSecret()).update(payload).digest("base64url");
}

function safeEqual(a: string, b: string): boolean {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  if (bufA.length !== bufB.length) return false;
  return timingSafeEqual(bufA, bufB);
}

/** Constant-time password check — never log password. */
export function verifyLabPassword(candidate: string): boolean {
  const expected = labPassword();
  if (!expected || !candidate) return false;
  return safeEqual(candidate, expected);
}

function parseSessionCookieValue(value: string): boolean {
  const secret = labCookieSecret();
  if (!secret || !value) return false;
  const dot = value.lastIndexOf(".");
  if (dot <= 0) return false;
  const payload = value.slice(0, dot);
  const sig = value.slice(dot + 1);
  if (!payload.startsWith("lab:")) return false;
  const expiresRaw = payload.slice(4);
  const expires = Number(expiresRaw);
  if (!Number.isFinite(expires) || Date.now() > expires) return false;
  const expectedSig = signPayload(payload);
  return safeEqual(sig, expectedSig);
}

export function getLabSessionCookie(request: Request): string | null {
  const header = request.headers.get("cookie") ?? "";
  for (const part of header.split(";")) {
    const trimmed = part.trim();
    if (trimmed.startsWith(`${LAB_SESSION_COOKIE}=`)) {
      return decodeURIComponent(trimmed.slice(LAB_SESSION_COOKIE.length + 1));
    }
  }
  return null;
}

export function hasValidLabSession(request: Request): boolean {
  if (!isLabAuthConfigured()) return false;
  const value = getLabSessionCookie(request);
  if (!value) return false;
  return parseSessionCookieValue(value);
}

function cookieSecureFlag(): boolean {
  return !import.meta.env.DEV;
}

/** Build Set-Cookie header value for a new Lab session. */
export function buildLabSessionSetCookie(): string {
  const expires = Date.now() + SESSION_TTL_MS;
  const payload = `lab:${expires}`;
  const value = `${payload}.${signPayload(payload)}`;
  const maxAge = Math.floor(SESSION_TTL_MS / 1000);
  const parts = [
    `${LAB_SESSION_COOKIE}=${encodeURIComponent(value)}`,
    "Path=/",
    "HttpOnly",
    "SameSite=Lax",
    `Max-Age=${maxAge}`,
  ];
  if (cookieSecureFlag()) parts.push("Secure");
  return parts.join("; ");
}

/** Clear Lab session cookie. */
export function buildLabSessionClearCookie(): string {
  const parts = [`${LAB_SESSION_COOKIE}=`, "Path=/", "HttpOnly", "SameSite=Lax", "Max-Age=0"];
  if (cookieSecureFlag()) parts.push("Secure");
  return parts.join("; ");
}
