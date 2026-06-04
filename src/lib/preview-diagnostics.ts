/* CONTRACT: Gate internal diagnostics — enabled on Vercel Preview / dev only, never production. */

export type PreviewDiagnosticsState = {
  vercel_env: string;
  preview_enabled: boolean;
  vercel_env_note: string | null;
};

export function readVercelEnv(): string {
  return (process.env.VERCEL_ENV ?? import.meta.env.VERCEL_ENV ?? "").trim();
}

/** True when not deployed as Vercel production (preview, development, or local dev). */
export function isPreviewDiagnosticsEnabled(): boolean {
  return readVercelEnv() !== "production";
}

export function previewDiagnosticsDisabledReason(): string {
  return "Kun tilgjengelig i Vercel Preview (ikke production).";
}

export function getPreviewDiagnosticsState(): PreviewDiagnosticsState {
  const vercel_env = readVercelEnv();
  const preview_enabled = vercel_env !== "production";
  let vercel_env_note: string | null = null;
  if (!vercel_env) {
    vercel_env_note =
      "VERCEL_ENV er ikke satt — behandles som ikke-production (lokalt/preview). Bekreft at du bruker Vercel Preview-URL.";
  } else if (vercel_env === "preview") {
    vercel_env_note = null;
  } else if (vercel_env === "development") {
    vercel_env_note = "VERCEL_ENV=development — probe tillatt (ikke production).";
  } else if (vercel_env === "production") {
    vercel_env_note = "VERCEL_ENV=production — probe er deaktivert.";
  } else {
    vercel_env_note = `Uventet VERCEL_ENV=${vercel_env} — kontakt utvikler.`;
  }
  return { vercel_env: vercel_env || "(unset)", preview_enabled, vercel_env_note };
}
