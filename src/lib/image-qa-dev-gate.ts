/* CONTRACT: Dev-only gate for /dev/image-qa and /api/dev/image-vision — not for production upload. */

function readEnv(name: string): string {
  return (process.env[name] ?? import.meta.env[name] ?? "").trim();
}

/** True in Astro dev, or when IMAGE_QA_DEV_ENABLED=true (e.g. local preview with flag). */
export function isImageQaDevEnabled(): boolean {
  if (import.meta.env.DEV) return true;
  return readEnv("IMAGE_QA_DEV_ENABLED").toLowerCase() === "true";
}
