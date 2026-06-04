/* CONTRACT: Safe API envelope for preview Agent Search probe — no secrets or content. */

import { discoveryHost, resolveAgentSearchEnv } from "./agent-search-direct";
import {
  getPreviewDiagnosticsState,
  previewDiagnosticsDisabledReason,
} from "./preview-diagnostics";

export type AgentSearchEnvReadiness = {
  has_project_id: boolean;
  has_location: boolean;
  has_agent_search_engine_id: boolean;
  has_ces_app_id: boolean;
  has_service_account: boolean;
};

function readEnvFlag(name: string): boolean {
  return Boolean((process.env[name] ?? import.meta.env[name] ?? "").trim());
}

export function resolveAgentSearchEnvReadiness(): AgentSearchEnvReadiness {
  const env = resolveAgentSearchEnv();
  const hasEngineId = readEnvFlag("AGENT_SEARCH_ENGINE_ID");
  const hasCesAppId = readEnvFlag("CES_APP_ID");

  if (env.ok) {
    return {
      has_project_id: true,
      has_location: true,
      has_agent_search_engine_id: true,
      has_ces_app_id: hasCesAppId,
      has_service_account: true,
    };
  }
  const missing = new Set(env.missing);
  return {
    has_project_id: !missing.has("CES_PROJECT_ID"),
    has_location: !missing.has("CES_LOCATION") && !missing.has("AGENT_SEARCH_LOCATION"),
    has_agent_search_engine_id: hasEngineId,
    has_ces_app_id: hasCesAppId,
    has_service_account: !missing.has("GOOGLE_SERVICE_ACCOUNT_JSON"),
  };
}

export type AgentSearchProbeEnvelope = {
  route_reached: true;
  vercel_env: string;
  preview_enabled: boolean;
  preview_disabled_reason?: string;
  vercel_env_note: string | null;
  layer: "google_agent_search_direct";
  endpoint_host: string | null;
  env_readiness: AgentSearchEnvReadiness;
  engine_id_source: "AGENT_SEARCH_ENGINE_ID" | null;
  ces_app_id_not_engine: true;
  api_route_reached: "yes";
};

export function buildProbeEnvelope(): AgentSearchProbeEnvelope {
  const preview = getPreviewDiagnosticsState();
  const readiness = resolveAgentSearchEnvReadiness();
  const env = resolveAgentSearchEnv();
  const endpoint_host =
    env.ok && readiness.has_location ? discoveryHost(env.config.location) : null;

  return {
    route_reached: true,
    vercel_env: preview.vercel_env,
    preview_enabled: preview.preview_enabled,
    preview_disabled_reason: preview.preview_enabled
      ? undefined
      : previewDiagnosticsDisabledReason(),
    vercel_env_note: preview.vercel_env_note,
    layer: "google_agent_search_direct",
    endpoint_host,
    env_readiness: readiness,
    engine_id_source: env.ok ? "AGENT_SEARCH_ENGINE_ID" : null,
    ces_app_id_not_engine: true,
    api_route_reached: "yes",
  };
}

export function probeDisabledBody(): Record<string, unknown> {
  const envelope = buildProbeEnvelope();
  return {
    ...envelope,
    route_reached: true,
    api_route_reached: "yes",
    preview_enabled: false,
    enabled: false,
    error: "disabled",
    error_code: "disabled_in_production",
    error_source: "app",
    message: previewDiagnosticsDisabledReason(),
  };
}

export function probeEnabledBase(): Record<string, unknown> {
  const envelope = buildProbeEnvelope();
  return {
    ...envelope,
    enabled: true,
    preview_enabled: envelope.preview_enabled,
  };
}
