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

function resolveApiPath(configuredPath: string): string {
  const trimmed = configuredPath.trim();
  if (trimmed.startsWith("http")) return trimmed;
  const path = trimmed.startsWith("/") ? trimmed : `/${trimmed}`;
  return new URL(path, window.location.origin).href;
}

function isOurProbeRoute(data: Record<string, unknown>): boolean {
  return data.route_reached === true || data.api_route_reached === "yes";
}

function parseProbeHttpResponse(
  res: Response,
  text: string,
  method: "GET" | "POST",
): Record<string, unknown> {
  let data: Record<string, unknown> = {};
  try {
    data = JSON.parse(text) as Record<string, unknown>;
  } catch {
    const wrongPath = res.status === 404;
    return {
      route_reached: false,
      api_route_reached: "no",
      preview_enabled: false,
      status: "error",
      error_code: wrongPath ? "route_not_found" : "route_not_reached",
      error_source: "app",
      client_http_status: res.status,
      route_note:
        method === "GET"
          ? `GET ${res.status} — ikke JSON fra probe-API (sjekk at path er /api/agent-search-direct-probe)`
          : `POST ${res.status} — ikke JSON fra probe-API`,
      has_answer: false,
      has_citations: false,
      support_score: null,
      duration_bucket: "—",
    };
  }

  data.client_http_status = res.status;

  if (!isOurProbeRoute(data)) {
    const wrongPath = res.status === 404;
    return {
      ...data,
      route_reached: false,
      api_route_reached: "no",
      status: "error",
      error_code: wrongPath ? "route_not_found" : "route_not_reached",
      error_source: "app",
      route_note: wrongPath
        ? "Intern route ikke funnet — feil fetch-path (forventet /api/agent-search-direct-probe)"
        : "Svar mangler route_reached — ikke fra vår probe-API",
      has_answer: false,
      has_citations: false,
    };
  }

  if (data.preview_enabled === false && data.error_code !== "disabled_in_production") {
    data.error_code = "disabled_in_production";
    data.error_source = "app";
  }

  if (data.error_code === "configuration_missing") {
    data.error_source = "config";
  }

  if (data.google_call_attempted === true && data.status === "error" && !data.error_source) {
    data.error_source = "google";
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
      <li>API route reached: <strong>${routeOk ? "yes" : "no"}</strong></li>
      <li>HTTP: ${esc(data.client_http_status ?? data.api_http_status)}</li>
      <li>VERCEL_ENV: <code class="rounded bg-gray-100 px-1 text-xs">${esc(data.vercel_env)}</code></li>
      <li>Preview enabled: <strong>${data.preview_enabled ? "ja" : "nei"}</strong></li>
      <li>Endpoint host: ${esc(data.endpoint_host)}</li>
      <li>Env: project=${readiness.has_project_id ? "✓" : "✗"} location=${readiness.has_location ? "✓" : "✗"} engine=${readiness.has_app_id_or_engine_id ? "✓" : "✗"} SA=${readiness.has_service_account ? "✓" : "✗"}</li>
      ${data.error_code ? `<li>error_code: <code class="text-xs">${esc(data.error_code)}</code></li>` : ""}
    </ul>
    ${data.route_note ? `<p class="mt-2 text-xs text-amber-800">${esc(data.route_note)}</p>` : ""}
    ${data.vercel_env_note ? `<p class="mt-2 text-xs text-amber-800">${esc(data.vercel_env_note)}</p>` : ""}
  `;
}

function renderSummary(rows: ProbeRow[], diagMessages: string[]): void {
  const { summaryEl, diagEl } = requireElements();
  const total = rows.length;
  const success = rows.filter((r) => r.status === "success").length;
  const routeMiss = rows.filter((r) =>
    ["route_not_found", "route_not_reached"].includes(String(r.error_code)),
  ).length;
  const googleErr = rows.filter((r) => String(r.error_code).startsWith("google_")).length;
  const config = rows.filter((r) => r.error_code === "configuration_missing").length;
  const timeout = rows.filter((r) => r.error_code === "timeout").length;
  const fetchErr = rows.filter((r) => r.error_code === "client_fetch").length;
  const other = total - success - routeMiss - googleErr - config - timeout - fetchErr;
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
      <li>Route ikke treffet: ${routeMiss}</li>
      <li>Google-feil: ${googleErr}</li>
      <li>Config missing: ${config}</li>
      <li>Timeout: ${timeout}</li>
      <li>Fetch/klient: ${fetchErr}</li>
      <li>Andre: ${other}</li>
      <li>Success-rate: ${total ? `${rate}% — ${vsBaseline}` : "N/A"}</li>
    </ul>
    ${
      total === 0
        ? `<p class="mt-3 rounded border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-900">Ingen kall fullført. ${esc(diagMessages.join(" "))}</p>`
        : ""
    }
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

function buildRouteNote(data: Record<string, unknown>, res: Response): string {
  if (!isOurProbeRoute(data)) {
    return String(data.route_note ?? "Intern route ikke treffet");
  }
  if (data.error_code === "disabled_in_production") {
    return "Preview gate: production";
  }
  if (data.error_code === "configuration_missing") {
    return `Mangler env: ${Array.isArray(data.missing_env) ? (data.missing_env as string[]).join(", ") : "config"}`;
  }
  if (data.google_call_attempted === true) {
    if (data.status === "success") return "Google :answer OK";
    return `Google upstream HTTP ${esc(data.upstream_http_status)} (${esc(data.error_code)})`;
  }
  return String(data.message ?? `API HTTP ${res.status}`);
}

async function fetchReadiness(apiUrl: string): Promise<void> {
  const { readinessEl, statusEl } = requireElements();
  statusEl.textContent = "Sjekker API readiness…";
  try {
    const res = await fetch(apiUrl, { method: "GET", headers: { Accept: "application/json" } });
    const text = await res.text();
    const data = parseProbeHttpResponse(res, text, "GET");
    readinessEl.innerHTML = renderReadiness(data, apiUrl);

    if (!isOurProbeRoute(data)) {
      statusEl.textContent = `Feil path eller route — HTTP ${res.status}. Forvent /api/agent-search-direct-probe`;
      return;
    }
    statusEl.textContent = res.ok
      ? "Klar — trykk knappen for 5 kall."
      : `API readiness HTTP ${res.status} (${esc(data.error_code)}) — se panel.`;
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    readinessEl.innerHTML = `<p class="text-sm text-red-800">Kunne ikke nå API (GET): ${esc(message)}</p><p class="mt-1 text-xs">URL: ${esc(apiUrl)}</p>`;
    statusEl.textContent = "route_not_reached — nettverksfeil mot probe-API.";
  }
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

  statusEl.textContent = "Starter probe…";

  for (let i = 1; i <= RUN_COUNT; i += 1) {
    statusEl.textContent = `Kjører ${i}/${RUN_COUNT}…`;

    try {
      const res = await fetch(apiUrl, {
        method: "POST",
        headers: { Accept: "application/json" },
      });
      const text = await res.text();
      const data = parseProbeHttpResponse(res, text, "POST");
      data.route_note = buildRouteNote(data, res);
      rows.push(data);
      appendRow(i, data);

      if (!isOurProbeRoute(data)) {
        diagMessages.push(`Kall ${i}: ${data.route_note}`);
      } else if (data.error_code === "configuration_missing") {
        diagMessages.push(`Kall ${i}: mangler Vercel env — ${(data.missing_env as string[] | undefined)?.join(", ") ?? ""}`);
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
      };
      diagMessages.push(`Kall ${i}: ${message}`);
      rows.push(row);
      appendRow(i, row);
    }

    if (i < RUN_COUNT) await sleep(DELAY_MS);
  }

  renderSummary(rows, diagMessages);
  statusEl.textContent = rows.length ? `Ferdig — ${rows.length} kall registrert.` : "Ferdig uten registrerte kall.";
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
