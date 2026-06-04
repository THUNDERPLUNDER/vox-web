/* CONTRACT: Preview probe UI — binds button, shows per-call metadata, never logs prompt/answer. */

const RUN_COUNT = 5;
const DELAY_MS = 8000;
const CHANNEL_BASELINE_PCT = 25;

type ProbeRow = Record<string, unknown>;

type ProbeElements = {
  runBtn: HTMLButtonElement;
  statusEl: HTMLElement;
  summaryEl: HTMLElement;
  tableEl: HTMLElement;
  tbody: HTMLElement;
  readinessEl: HTMLElement;
  diagEl: HTMLElement;
};

/** Set after successful readiness GET with route_reached. */
let readinessRouteOk = false;

function resolveApiPath(configuredPath: string): string {
  const trimmed = configuredPath.trim();
  if (trimmed.startsWith("http")) return trimmed;
  const path = trimmed.startsWith("/") ? trimmed : `/${trimmed}`;
  return new URL(path, window.location.origin).href;
}

function probeRunUrl(apiUrl: string): string {
  const url = new URL(apiUrl);
  url.searchParams.set("run", "1");
  return url.href;
}

function isOurProbeRoute(data: Record<string, unknown>): boolean {
  return data.route_reached === true || data.api_route_reached === "yes";
}

function looksLikeVercelProtectionHtml(text: string): boolean {
  const sample = text.slice(0, 2000).toLowerCase();
  return (
    sample.includes("vercel") &&
    (sample.includes("authentication") ||
      sample.includes("login") ||
      sample.includes("deployment protection") ||
      sample.includes("sso"))
  );
}

function classifyNonJsonResponse(
  res: Response,
  text: string,
  method: "GET" | "POST",
  isExecuteCall: boolean,
): Record<string, unknown> {
  const status = res.status;

  if (method === "POST" && isExecuteCall && readinessRouteOk && (status === 401 || status === 403)) {
    const vercelBlock = looksLikeVercelProtectionHtml(text);
    return {
      route_reached: false,
      api_route_reached: "no",
      status: "error",
      error_code: vercelBlock ? "post_blocked_before_handler" : "post_route_not_reached",
      error_source: "vercel",
      client_http_status: status,
      method: "POST",
      google_call_attempted: false,
      route_note: vercelBlock
        ? "POST blokkert før handler (sannsynlig Vercel Deployment Protection) — bruker GET ?run=1"
        : `POST ${status} uten JSON — ikke fra probe-handler`,
      has_answer: false,
      has_citations: false,
      support_score: null,
      duration_bucket: "—",
      response_preview_type: vercelBlock ? "html_vercel_protection" : "non_json",
    };
  }

  if (status === 404) {
    return {
      route_reached: false,
      api_route_reached: "no",
      status: "error",
      error_code: method === "POST" ? "post_route_not_reached" : "route_not_found",
      error_source: "app",
      client_http_status: status,
      method,
      google_call_attempted: false,
      route_note: `${method} 404 — route_not_found`,
      has_answer: false,
      has_citations: false,
      support_score: null,
      duration_bucket: "—",
      response_preview_type: "non_json",
    };
  }

  return {
    route_reached: false,
    api_route_reached: "no",
    status: "error",
    error_code: "non_json_response_from_probe_route",
    error_source: "app",
    client_http_status: status,
    method,
    google_call_attempted: false,
    route_note: `${method} ${status} — non_json_response_from_probe_route`,
    has_answer: false,
    has_citations: false,
    support_score: null,
    duration_bucket: "—",
    response_preview_type: looksLikeVercelProtectionHtml(text) ? "html_vercel_protection" : "non_json",
  };
}

function parseProbeHttpResponse(
  res: Response,
  text: string,
  method: "GET" | "POST",
  isExecuteCall: boolean,
): Record<string, unknown> {
  let data: Record<string, unknown>;
  try {
    data = JSON.parse(text) as Record<string, unknown>;
  } catch {
    return classifyNonJsonResponse(res, text, method, isExecuteCall);
  }

  data.client_http_status = res.status;
  data.method = data.method ?? method;

  if (!isOurProbeRoute(data)) {
    return {
      ...data,
      route_reached: false,
      api_route_reached: "no",
      status: "error",
      error_code:
        res.status === 404
          ? method === "POST"
            ? "post_route_not_reached"
            : "route_not_found"
          : "non_json_response_from_probe_route",
      error_source: "app",
      route_note: "Svar mangler route_reached — ikke fra vår probe-API",
      has_answer: false,
      has_citations: false,
    };
  }

  if (data.preview_enabled === false) {
    data.error_code = "disabled_in_production";
    data.error_source = "app";
  }

  if (data.error_code === "configuration_missing") {
    data.error_source = "config";
  }

  if (data.google_call_attempted === true && data.status === "error") {
    data.error_source = data.error_source ?? "google";
  }

  return data;
}

function requireElements(): ProbeElements {
  const ids = [
    ["probe-run", "runBtn"],
    ["probe-status", "statusEl"],
    ["probe-summary", "summaryEl"],
    ["probe-table", "tableEl"],
    ["probe-tbody", "tbody"],
    ["probe-readiness", "readinessEl"],
    ["probe-diagnostics", "diagEl"],
  ] as const;

  const out: Partial<ProbeElements> = {};
  const missing: string[] = [];

  for (const [id, key] of ids) {
    const el = document.getElementById(id);
    if (!el) {
      missing.push(`#${id}`);
      continue;
    }
    if (key === "runBtn" && !(el instanceof HTMLButtonElement)) {
      missing.push(`#${id} (ikke button)`);
      continue;
    }
    (out as Record<string, HTMLElement>)[key] = el as HTMLElement;
  }

  if (missing.length > 0) {
    throw new Error(`Probe UI mangler elementer: ${missing.join(", ")}`);
  }

  return out as ProbeElements;
}

function esc(value: unknown): string {
  if (value === null || value === undefined) return "—";
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function sleep(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
}

function renderReadiness(data: Record<string, unknown>, fetchUrl: string): string {
  const readiness = (data.env_readiness ?? {}) as Record<string, boolean>;
  const routeOk = isOurProbeRoute(data);
  return `
    <p class="font-medium text-gray-900">API readiness (GET)</p>
    <ul class="mt-2 space-y-1 text-sm">
      <li>Fetch URL: <code class="rounded bg-gray-100 px-1 text-xs break-all">${esc(fetchUrl)}</code></li>
      <li>Execute URL: <code class="rounded bg-gray-100 px-1 text-xs break-all">${esc(probeRunUrl(fetchUrl))}</code></li>
      <li>API route reached: <strong>${routeOk ? "yes" : "no"}</strong></li>
      <li>HTTP: ${esc(data.client_http_status ?? data.api_http_status)}</li>
      <li>VERCEL_ENV: <code class="rounded bg-gray-100 px-1 text-xs">${esc(data.vercel_env)}</code></li>
      <li>Preview enabled: <strong>${data.preview_enabled ? "ja" : "nei"}</strong></li>
      <li>Endpoint host: ${esc(data.endpoint_host)}</li>
      <li>Env: project=${readiness.has_project_id ? "✓" : "✗"} location=${readiness.has_location ? "✓" : "✗"} engine=${readiness.has_app_id_or_engine_id ? "✓" : "✗"} SA=${readiness.has_service_account ? "✓" : "✗"}</li>
    </ul>
    <p class="mt-2 text-xs text-gray-600">Probe-kjøring bruker <strong>GET ?run=1</strong> (POST er ofte blokkert av Vercel Deployment Protection på preview).</p>
    ${data.vercel_env_note ? `<p class="mt-2 text-xs text-amber-800">${esc(data.vercel_env_note)}</p>` : ""}
  `;
}

function renderSummary(rows: ProbeRow[], diagMessages: string[]): void {
  const { summaryEl, diagEl } = requireElements();
  const total = rows.length;
  const success = rows.filter((r) => r.status === "success").length;
  const blocked = rows.filter((r) => r.error_code === "post_blocked_before_handler").length;
  const googleErr = rows.filter((r) => String(r.error_code).startsWith("google_")).length;
  const config = rows.filter((r) => r.error_code === "configuration_missing").length;
  const timeout = rows.filter((r) => r.error_code === "timeout").length;
  const fetchErr = rows.filter((r) => r.error_code === "client_fetch").length;
  const other = total - success - blocked - googleErr - config - timeout - fetchErr;
  const rate = total ? Math.round((success / total) * 100) : 0;
  const vsBaseline =
    total === 0
      ? "ingen kall registrert — se diagnostikk"
      : rate > CHANNEL_BASELINE_PCT
        ? "bedre enn channel (25%)"
        : rate < CHANNEL_BASELINE_PCT
          ? "verre enn channel (25%)"
          : "lik channel-baseline (25%)";

  summaryEl.classList.remove("hidden");
  summaryEl.innerHTML = `
    <p class="font-medium text-gray-900">Oppsummering (direct :answer)</p>
    <ul class="mt-2 space-y-1">
      <li>Total: ${total}</li>
      <li>Success: ${success}</li>
      <li>Google-feil: ${googleErr}</li>
      <li>POST blokkert (Vercel): ${blocked}</li>
      <li>Config missing: ${config}</li>
      <li>Timeout: ${timeout}</li>
      <li>Fetch/klient: ${fetchErr}</li>
      <li>Andre: ${other}</li>
      <li>Success-rate: ${total ? `${rate}% — ${vsBaseline}` : "N/A"}</li>
    </ul>
  `;

  if (diagMessages.length) {
    diagEl.classList.remove("hidden");
    diagEl.innerHTML = `<p class="font-medium text-gray-900">Diagnostikk</p><ul class="mt-2 list-disc pl-5 text-sm">${diagMessages.map((m) => `<li>${esc(m)}</li>`).join("")}</ul>`;
  }
}

function appendRow(n: number, data: ProbeRow): void {
  const { tbody } = requireElements();
  const tr = document.createElement("tr");
  tr.className = "border-b border-gray-100";
  const resultLabel = data.status === "success" ? "success" : "error";
  tr.innerHTML = `
    <td class="py-2 pr-4">${n}</td>
    <td class="py-2 pr-4">${esc(resultLabel)}</td>
    <td class="py-2 pr-4">${esc(data.api_http_status ?? data.client_http_status ?? "—")}</td>
    <td class="py-2 pr-4">${esc(data.status ?? "—")}</td>
    <td class="py-2 pr-4">${esc(data.duration_bucket ?? "—")}</td>
    <td class="py-2 pr-4">${data.has_answer ? "ja" : "nei"}</td>
    <td class="py-2 pr-4">${data.has_citations ? "ja" : "nei"}</td>
    <td class="py-2 pr-4">${esc(data.support_score)}</td>
    <td class="py-2 pr-4">${esc(data.error_code ?? "—")}</td>
    <td class="py-2 pr-4 text-xs">${esc(data.route_note ?? "")}</td>
  `;
  tbody.appendChild(tr);
}

function buildRouteNote(data: Record<string, unknown>): string {
  if (data.error_code === "post_blocked_before_handler") {
    return String(data.route_note ?? "POST blokkert — GET ?run=1 brukt");
  }
  if (!isOurProbeRoute(data)) {
    return String(data.route_note ?? "Route ikke treffet");
  }
  if (data.error_code === "disabled_in_production") {
    return "Preview gate: production";
  }
  if (data.error_code === "configuration_missing") {
    return `Mangler env: ${Array.isArray(data.missing_env) ? (data.missing_env as string[]).join(", ") : "config"}`;
  }
  if (data.google_call_attempted === true) {
    if (data.status === "success") return "Google :answer OK (GET ?run=1)";
    const hint = data.google_error_hint ? ` — ${esc(data.google_error_hint)}` : "";
    const rpc = data.google_rpc_status ? ` ${esc(data.google_rpc_status)}` : "";
    return `Google HTTP ${esc(data.upstream_http_status)}${rpc} (${esc(data.error_code)})${hint}`;
  }
  return String(data.route_note ?? data.message ?? "—");
}

async function fetchProbeExecute(url: string, method: "GET" | "POST"): Promise<{ res: Response; text: string }> {
  const res = await fetch(url, {
    method,
    credentials: "include",
  });
  const text = await res.text();
  return { res, text };
}

async function fetchReadiness(apiUrl: string): Promise<void> {
  const { readinessEl, statusEl } = requireElements();
  readinessRouteOk = false;
  statusEl.textContent = "Sjekker API readiness…";
  try {
    const { res, text } = await fetchProbeExecute(apiUrl, "GET");
    const data = parseProbeHttpResponse(res, text, "GET", false);
    readinessRouteOk = isOurProbeRoute(data) && res.ok;
    readinessEl.innerHTML = renderReadiness(data, apiUrl);

    if (!readinessRouteOk) {
      statusEl.textContent = `Feil path eller route — HTTP ${res.status}. Forvent /api/agent-search-direct-probe`;
      return;
    }
    statusEl.textContent = "Klar — trykk knappen for 5 kall (GET ?run=1).";
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    readinessEl.innerHTML = `<p class="text-sm text-red-800">Kunne ikke nå API (GET): ${esc(message)}</p>`;
    statusEl.textContent = "GET readiness feilet — nettverksfeil.";
  }
}

async function runSingleProbeCall(apiUrl: string, callIndex: number): Promise<ProbeRow> {
  const runUrl = probeRunUrl(apiUrl);

  if (readinessRouteOk) {
    const { res, text } = await fetchProbeExecute(runUrl, "GET");
    const data = parseProbeHttpResponse(res, text, "GET", true);
    data.route_note = buildRouteNote(data);
    data.probe_transport = "GET ?run=1";
    return data;
  }

  const { res, text } = await fetchProbeExecute(apiUrl, "POST");
  let data = parseProbeHttpResponse(res, text, "POST", true);

  if (!isOurProbeRoute(data) && data.error_code === "post_blocked_before_handler") {
    const fallback = await fetchProbeExecute(runUrl, "GET");
    data = parseProbeHttpResponse(fallback.res, fallback.text, "GET", true);
    data.route_note = `POST blokkert (${res.status}) — fallback GET ?run=1`;
    data.probe_transport = "GET ?run=1 (fallback)";
    return data;
  }

  data.route_note = buildRouteNote(data);
  data.probe_transport = "POST";
  return data;
}

async function runProbe(apiUrl: string): Promise<void> {
  const { runBtn, statusEl, summaryEl, tableEl, tbody, diagEl } = requireElements();
  const rows: ProbeRow[] = [];
  const diagMessages: string[] = [];

  runBtn.disabled = true;
  tbody.innerHTML = "";
  summaryEl.classList.add("hidden");
  diagEl.classList.add("hidden");
  diagEl.innerHTML = "";
  tableEl.classList.remove("hidden");

  if (!readinessRouteOk) {
    diagMessages.push("Readiness GET manglet route_reached — kjører likevel.");
  }

  for (let i = 1; i <= RUN_COUNT; i += 1) {
    statusEl.textContent = `Kjører ${i}/${RUN_COUNT}… (GET ?run=1)`;
    try {
      const data = await runSingleProbeCall(apiUrl, i);
      rows.push(data);
      appendRow(i, data);

      if (data.google_call_attempted === true && data.status !== "success") {
        diagMessages.push(`Kall ${i}: ${data.error_code} (Google HTTP ${data.upstream_http_status})`);
      } else if (data.error_code === "configuration_missing") {
        diagMessages.push(`Kall ${i}: mangler env`);
      } else if (data.error_code === "post_blocked_before_handler") {
        diagMessages.push(`Kall ${i}: POST blokkert av Vercel — bruk GET ?run=1`);
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      const row: ProbeRow = {
        status: "error",
        error_code: "client_fetch",
        error_source: "client",
        client_http_status: null,
        duration_bucket: "—",
        has_answer: false,
        has_citations: false,
        support_score: null,
        route_note: `Fetch feilet: ${message}`,
        google_call_attempted: false,
      };
      diagMessages.push(`Kall ${i}: ${message}`);
      rows.push(row);
      appendRow(i, row);
    }

    if (i < RUN_COUNT) await sleep(DELAY_MS);
  }

  renderSummary(rows, diagMessages);
  statusEl.textContent = rows.length ? `Ferdig — ${rows.length} kall (GET ?run=1).` : "Ferdig uten rader.";
  runBtn.disabled = false;
}

export function initAgentSearchDirectProbe(configuredApiPath: string): void {
  const apiUrl = resolveApiPath(configuredApiPath);

  try {
    const { runBtn, diagEl } = requireElements();
    diagEl.classList.add("hidden");
    void fetchReadiness(apiUrl);

    runBtn.addEventListener("click", () => {
      void runProbe(apiUrl).catch((err) => {
        const message = err instanceof Error ? err.message : String(err);
        const { statusEl, summaryEl, runBtn } = requireElements();
        runBtn.disabled = false;
        statusEl.textContent = `Probe feilet: ${message}`;
        summaryEl.classList.remove("hidden");
        summaryEl.innerHTML = `<p class="text-sm text-red-800"><strong>Probe avbrutt:</strong> ${esc(message)}</p>`;
      });
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    const fallback = document.getElementById("probe-bootstrap-error");
    if (fallback) {
      fallback.textContent = `Klientfeil: ${message}`;
      fallback.classList.remove("hidden");
    }
  }
}
