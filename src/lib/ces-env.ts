/* CONTRACT: Server-only CES env resolution for headless runSession — no secrets in client bundle. */

export type CesEnvConfig = {
  projectId: string;
  location: string;
  appId: string;
  appVersionId: string;
  deploymentId: string;
  serviceAccountJson: string;
};

export type CesEnvMissing = {
  ok: false;
  missing: string[];
};

export type CesEnvResult = { ok: true; config: CesEnvConfig } | CesEnvMissing;

const REQUIRED_KEYS = [
  "CES_PROJECT_ID",
  "CES_LOCATION",
  "CES_APP_ID",
  "CES_APP_VERSION_ID",
  "CES_DEPLOYMENT_ID",
  "GOOGLE_SERVICE_ACCOUNT_JSON",
] as const;

function readEnv(name: (typeof REQUIRED_KEYS)[number]): string {
  return (process.env[name] ?? import.meta.env[name] ?? "").trim();
}

/** Resolve CES config from server env. Returns missing keys for clear operator errors. */
export function resolveCesEnv(): CesEnvResult {
  const values = Object.fromEntries(REQUIRED_KEYS.map((key) => [key, readEnv(key)])) as Record<
    (typeof REQUIRED_KEYS)[number],
    string
  >;

  const missing = REQUIRED_KEYS.filter((key) => !values[key]);
  if (missing.length > 0) {
    return { ok: false, missing: [...missing] };
  }

  return {
    ok: true,
    config: {
      projectId: values.CES_PROJECT_ID,
      location: values.CES_LOCATION,
      appId: values.CES_APP_ID,
      appVersionId: values.CES_APP_VERSION_ID,
      deploymentId: values.CES_DEPLOYMENT_ID,
      serviceAccountJson: values.GOOGLE_SERVICE_ACCOUNT_JSON,
    },
  };
}

export function cesResourceBase(config: Pick<CesEnvConfig, "projectId" | "location" | "appId">): string {
  return `projects/${config.projectId}/locations/${config.location}/apps/${config.appId}`;
}
