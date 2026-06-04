/* CONTRACT: Shared probe execution — POST and GET ?run=1 return identical safe JSON envelope. */

import { runAgentSearchDirectProbeOnce, resolveAgentSearchEnv } from "./agent-search-direct";
import { probeDisabledBody, probeEnabledBase } from "./agent-search-probe-envelope";
import { isPreviewDiagnosticsEnabled } from "./preview-diagnostics";

export type ProbeHandlerResult = {
  body: Record<string, unknown>;
  status: number;
};

export async function executeAgentSearchProbeOnce(method: "GET" | "POST"): Promise<ProbeHandlerResult> {
  if (!isPreviewDiagnosticsEnabled()) {
    return {
      body: {
        ...probeDisabledBody(),
        method,
        api_http_status: 404,
      },
      status: 404,
    };
  }

  const env = resolveAgentSearchEnv();
  if (!env.ok) {
    return {
      body: {
        ...probeEnabledBase(),
        method,
        status: "error",
        error_code: "configuration_missing",
        error_source: "config",
        missing_env: env.missing,
        upstream_http_status: null,
        duration_bucket: null,
        has_answer: false,
        has_citations: false,
        support_score: null,
        response_state: null,
        google_call_attempted: false,
        api_http_status: 503,
      },
      status: 503,
    };
  }

  const meta = await runAgentSearchDirectProbeOnce(env.config);
  const httpStatus = meta.status === "success" ? 200 : 502;

  return {
    body: {
      ...probeEnabledBase(),
      ...meta,
      method,
      error_source: meta.status === "success" ? null : "google",
      google_call_attempted: true,
      api_http_status: httpStatus,
    },
    status: httpStatus,
  };
}
