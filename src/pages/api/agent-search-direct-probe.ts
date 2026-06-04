/* CONTRACT: Preview-only single-call Agent Search probe API — safe metadata, no content logging. */
import type { APIRoute } from "astro";
import { runAgentSearchDirectProbeOnce, resolveAgentSearchEnv } from "../../lib/agent-search-direct";
import { isPreviewDiagnosticsEnabled, previewDiagnosticsDisabledReason } from "../../lib/preview-diagnostics";

export const prerender = false;

function json(body: Record<string, unknown>, status: number): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json; charset=utf-8" },
  });
}

export const POST: APIRoute = async () => {
  if (!isPreviewDiagnosticsEnabled()) {
    return json({ enabled: false, error: "disabled", message: previewDiagnosticsDisabledReason() }, 404);
  }

  const env = resolveAgentSearchEnv();
  if (!env.ok) {
    return json(
      {
        enabled: true,
        status: "error",
        error_code: "configuration_missing",
        missing_env: env.missing,
      },
      503,
    );
  }

  const meta = await runAgentSearchDirectProbeOnce(env.config);
  return json({ enabled: true, ...meta }, meta.status === "success" ? 200 : 502);
};

export const GET: APIRoute = async () => {
  if (!isPreviewDiagnosticsEnabled()) {
    return json({ enabled: false, error: "disabled", message: previewDiagnosticsDisabledReason() }, 404);
  }
  return json({ enabled: true, layer: "google_agent_search_direct" }, 200);
};
