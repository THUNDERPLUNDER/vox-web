/* CONTRACT: Public interest signup v0.1 — email-only opt-in, no profile or health data. #453 */

export const INTEREST_SIGNUP_CONSENT_VERSION = "public-interest-v1-2026-09-18";
export const INTEREST_SIGNUP_SOURCE = "public_home" as const;
export const INTEREST_SIGNUP_MAX_BODY_BYTES = 2_000;
export const INTEREST_SIGNUP_MAX_EMAIL_LENGTH = 254;

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const ALLOWED_FIELDS = new Set(["email", "consent_version", "source", "website"]);

export type InterestSignupInput = {
  email: string;
  consentVersion: typeof INTEREST_SIGNUP_CONSENT_VERSION;
  source: typeof INTEREST_SIGNUP_SOURCE;
};

export type InterestSignupValidationResult =
  | { ok: true; kind: "submit"; value: InterestSignupInput }
  | { ok: true; kind: "spam" }
  | { ok: false; error: "invalid_signup" | "invalid_email" };

export function validateInterestSignup(value: unknown): InterestSignupValidationResult {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return { ok: false, error: "invalid_signup" };
  }

  const body = value as Record<string, unknown>;
  if (Object.keys(body).some((field) => !ALLOWED_FIELDS.has(field))) {
    return { ok: false, error: "invalid_signup" };
  }

  if (body.website !== undefined && typeof body.website !== "string") {
    return { ok: false, error: "invalid_signup" };
  }
  if (typeof body.website === "string" && body.website.trim() !== "") {
    return { ok: true, kind: "spam" };
  }

  const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
  if (!email || email.length > INTEREST_SIGNUP_MAX_EMAIL_LENGTH || !EMAIL_PATTERN.test(email)) {
    return { ok: false, error: "invalid_email" };
  }

  if (
    body.consent_version !== INTEREST_SIGNUP_CONSENT_VERSION ||
    body.source !== INTEREST_SIGNUP_SOURCE
  ) {
    return { ok: false, error: "invalid_signup" };
  }

  return {
    ok: true,
    kind: "submit",
    value: {
      email,
      consentVersion: INTEREST_SIGNUP_CONSENT_VERSION,
      source: INTEREST_SIGNUP_SOURCE,
    },
  };
}

export function resolveInterestSignupEnvironment(): string {
  const value = (process.env.VERCEL_ENV ?? import.meta.env.MODE ?? "development").trim();
  return value === "production" || value === "preview" ? value : "development";
}
