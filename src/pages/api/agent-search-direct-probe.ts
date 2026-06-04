/* CONTRACT: Preview-only single-call Agent Search probe API — safe metadata, no content logging. */
import type { APIRoute } from "astro";
import { runAgentSearchDirectProbeOnce, resolveAgentSearchEnv } from "../../lib/agent-search-direct";
import {
  buildProbeEnvelope,
  probeDisabledBody,
  probeEnabledBase,
} from "../../lib/agent-search-probe-envelope";
import { isPreviewDiagnosticsEnabled } from "../../lib/preview-diagnostics";

export const prerender = false;

function json(body: Record<string, unknown>, status: number): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json; charset=utf-8" },
  });
}

export const GET: APIRoute = async () => {
  if (!isPreviewDiagnosticsEnabled()) {
    return json(
      {
        ...probeDisabledBody(),
        error_code: "disabled_in_production",
        error_source: "app",
        api_http_status: 404,
      },
      404,
    );
  }
  return json(
    {
      ...probeEnabledBase(),
      ready: true,
      message: "POST for ett :answer-kall med safe metadata.",
      api_http_status: 200,
    },
    200,
  );
};

export const POST: APIRoute = async () => {
  const envelope = buildProbeEnvelope();

  if (!isPreviewDiagnosticsEnabled()) {
    return json(probeDisabledBody(), 404);
  }

  const env = resolveAgentSearchEnv();
  if (!env.ok) {
    return json(
      {
        ...probeEnabledBase(),
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
      503,
    );
  }

  const meta = await runAgentSearchDirectProbeOnce(env.config);
  const httpStatus = meta.status === "success" ? 200 : 502;

  return json(
    {
      ...probeEnabledBase(),
      ...meta,
      error_source: meta.status === "success" ? null : "google",
      google_call_attempted: true,
      api_http_status: httpStatus,
    },
    httpStatus,
  );
};
