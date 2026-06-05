/* CONTRACT: Dev-only gate for /dev/image-qa and /api/dev/image-vision — Preview flag only; never production. */

function readEnv(name: string): string {
  return (process.env[name] ?? import.meta.env[name] ?? "").trim();
}

/** Vercel Production deploy — image QA must never be enabled here. */
export function isImageQaBlockedInProduction(): boolean {
  return readEnv("VERCEL_ENV") === "production";
}

/**
 * True only when IMAGE_QA_DEV_ENABLED=true and not on Vercel Production.
 * Set the flag in Vercel Preview Environment (not Production) or in local .env.local.
 */
export function isImageQaDevEnabled(): boolean {
  if (isImageQaBlockedInProduction()) return false;
  return readEnv("IMAGE_QA_DEV_ENABLED").toLowerCase() === "true";
}
