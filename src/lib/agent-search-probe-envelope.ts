/* CONTRACT: Safe API envelope for preview Agent Search probe — no secrets or content. */

import { discoveryHost, resolveAgentSearchEnv } from "./agent-search-direct";
import {
  getPreviewDiagnosticsState,
  previewDiagnosticsDisabledReason,
} from "./preview-diagnostics";

export type AgentSearchEnvReadiness = {
  has_project_id: boolean;
  has_location: boolean;
  has_app_id_or_engine_id: boolean;
  has_service_account: boolean;
};

export function resolveAgentSearchEnvReadiness(): AgentSearchEnvReadiness {
  const env = resolveAgentSearchEnv();
  if (env.ok) {
    return {
      has_project_id: true,
      has_location: true,
      has_app_id_or_engine_id: true,
      has_service_account: true,
    };
  }
  const missing = new Set(env.missing);
  return {
    has_project_id: !missing.has("CES_PROJECT_ID"),
    has_location: !missing.has("CES_LOCATION") && !missing.has("AGENT_SEARCH_LOCATION"),
    has_app_id_or_engine_id:
      !missing.has("CES_APP_ID") && !missing.has("AGENT_SEARCH_ENGINE_ID"),
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
    api_route_reached: "yes",
  };
}

export function probeDisabledBody(): Record<string, unknown> {
  const envelope = buildProbeEnvelope();
  return {
    ...envelope,
    preview_enabled: false,
    enabled: false,
    error: "disabled",
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
