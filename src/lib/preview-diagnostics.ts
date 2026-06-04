/* CONTRACT: Gate internal diagnostics — enabled on Vercel Preview / dev only, never production. */

function readVercelEnv(): string {
  return (process.env.VERCEL_ENV ?? import.meta.env.VERCEL_ENV ?? "").trim();
}

/** True when not deployed as Vercel production (preview, development, or local dev). */
export function isPreviewDiagnosticsEnabled(): boolean {
  return readVercelEnv() !== "production";
}

export function previewDiagnosticsDisabledReason(): string {
  return "Kun tilgjengelig i Vercel Preview (ikke production).";
}
