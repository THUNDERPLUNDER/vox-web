/* CONTRACT: Preview-only Agent Search probe API — safe metadata, no content logging. */
import type { APIRoute } from "astro";
import { executeAgentSearchProbeOnce } from "../../lib/agent-search-probe-handler";
import { probeDisabledBody, probeEnabledBase } from "../../lib/agent-search-probe-envelope";
import { isPreviewDiagnosticsEnabled } from "../../lib/preview-diagnostics";

export const prerender = false;

const JSON_HEADERS = {
  "Content-Type": "application/json; charset=utf-8",
  "Allow": "GET, POST, OPTIONS",
};

function json(body: Record<string, unknown>, status: number): Response {
  return new Response(JSON.stringify(body), { status, headers: JSON_HEADERS });
}

/** CORS preflight + Vercel OPTIONS allowlist compatibility for /api/*. */
export const OPTIONS: APIRoute = async () => {
  return new Response(null, {
    status: 204,
    headers: {
      ...JSON_HEADERS,
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Accept",
      "Access-Control-Max-Age": "86400",
    },
  });
};

export const GET: APIRoute = async ({ request }) => {
  const url = new URL(request.url);
  const execute = url.searchParams.get("run") === "1";

  if (!isPreviewDiagnosticsEnabled()) {
    return json(
      {
        ...probeDisabledBody(),
        method: execute ? "GET" : "GET",
        error_code: "disabled_in_production",
        error_source: "app",
        api_http_status: 404,
      },
      404,
    );
  }

  if (execute) {
    const result = await executeAgentSearchProbeOnce("GET");
    return json(result.body, result.status);
  }

  return json(
    {
      ...probeEnabledBase(),
      method: "GET",
      ready: true,
      message: "POST eller GET ?run=1 for ett :answer-kall med safe metadata.",
      api_http_status: 200,
      probe_execute_url_hint: `${url.pathname}?run=1`,
    },
    200,
  );
};

export const POST: APIRoute = async () => {
  if (!isPreviewDiagnosticsEnabled()) {
    return json(
      {
        ...probeDisabledBody(),
        method: "POST",
        error_code: "disabled_in_production",
        error_source: "app",
        api_http_status: 404,
      },
      404,
    );
  }

  const result = await executeAgentSearchProbeOnce("POST");
  return json(result.body, result.status);
};
