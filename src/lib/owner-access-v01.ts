/* CONTRACT: Temporary owner access for public AI controls. Four-digit PIN -> fixed secure owner cookie. Not user auth. */

import { timingSafeEqual } from "node:crypto";

export const OWNER_SESSION_COOKIE = "viddel_owner_session";
const OWNER_SESSION_TTL_SECONDS = 30 * 24 * 60 * 60;

function readEnv(name: string): string {
  return (process.env[name] ?? import.meta.env?.[name] ?? "").trim();
}

function safeEqual(a: string, b: string): boolean {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  if (bufA.length !== bufB.length) return false;
  return timingSafeEqual(bufA, bufB);
}

function ownerPin(): string {
  return readEnv("VIDDEL_OWNER_PIN");
}

function ownerSessionToken(): string {
  return readEnv("VIDDEL_OWNER_SESSION_TOKEN");
}

function isValidOwnerSessionToken(value: string): boolean {
  return /^[A-Za-z0-9_-]{32,}$/.test(value);
}

export function isOwnerAccessConfigured(): boolean {
  return /^\d{4}$/.test(ownerPin()) && isValidOwnerSessionToken(ownerSessionToken());
}

/** Constant-time PIN check. The PIN is never returned or logged. */
export function verifyOwnerPin(candidate: string): boolean {
  const expected = ownerPin();
  if (!/^\d{4}$/.test(candidate) || !/^\d{4}$/.test(expected)) return false;
  return safeEqual(candidate, expected);
}

function readCookie(request: Request, name: string): string | null {
  const header = request.headers.get("cookie") ?? "";
  for (const part of header.split(";")) {
    const trimmed = part.trim();
    if (trimmed.startsWith(`${name}=`)) {
      try {
        return decodeURIComponent(trimmed.slice(name.length + 1));
      } catch {
        return null;
      }
    }
  }
  return null;
}

export function hasOwnerSession(request: Request): boolean {
  const expected = ownerSessionToken();
  const actual = readCookie(request, OWNER_SESSION_COOKIE) ?? "";
  if (!isValidOwnerSessionToken(expected) || !actual) return false;
  return safeEqual(actual, expected);
}

function secureCookieFlag(): boolean {
  return import.meta.env?.DEV !== true;
}

export function buildOwnerSessionSetCookie(): string {
  const token = ownerSessionToken();
  if (!isValidOwnerSessionToken(token)) throw new Error("owner_session_not_configured");
  const parts = [
    `${OWNER_SESSION_COOKIE}=${encodeURIComponent(token)}`,
    "Path=/",
    "HttpOnly",
    "SameSite=Strict",
    `Max-Age=${OWNER_SESSION_TTL_SECONDS}`,
  ];
  if (secureCookieFlag()) parts.push("Secure");
  return parts.join("; ");
}

export function buildOwnerSessionClearCookie(): string {
  const parts = [
    `${OWNER_SESSION_COOKIE}=`,
    "Path=/",
    "HttpOnly",
    "SameSite=Strict",
    "Max-Age=0",
  ];
  if (secureCookieFlag()) parts.push("Secure");
  return parts.join("; ");
}
