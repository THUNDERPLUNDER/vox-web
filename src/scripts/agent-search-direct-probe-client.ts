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

function renderReadiness(data: Record<string, unknown>): string {
  const readiness = (data.env_readiness ?? {}) as Record<string, boolean>;
  return `
    <p class="font-medium text-gray-900">API readiness (GET)</p>
    <ul class="mt-2 space-y-1 text-sm">
      <li>API route reached: <strong>${esc(data.api_route_reached ?? data.route_reached ? "yes" : "no")}</strong></li>
      <li>VERCEL_ENV: <code class="rounded bg-gray-100 px-1 text-xs">${esc(data.vercel_env)}</code></li>
      <li>Preview enabled: <strong>${data.preview_enabled ? "ja" : "nei"}</strong></li>
      <li>Endpoint host: ${esc(data.endpoint_host)}</li>
      <li>Env: project=${readiness.has_project_id ? "✓" : "✗"} location=${readiness.has_location ? "✓" : "✗"} engine=${readiness.has_app_id_or_engine_id ? "✓" : "✗"} SA=${readiness.has_service_account ? "✓" : "✗"}</li>
    </ul>
    ${data.vercel_env_note ? `<p class="mt-2 text-xs text-amber-800">${esc(data.vercel_env_note)}</p>` : ""}
  `;
}

function renderSummary(rows: ProbeRow[], diagMessages: string[]): void {
  const { summaryEl, diagEl } = requireElements();
  const total = rows.length;
  const success = rows.filter((r) => r.status === "success").length;
  const upstream = rows.filter((r) => r.error_code === "upstream").length;
  const timeout = rows.filter((r) => r.error_code === "timeout").length;
  const config = rows.filter((r) => r.error_code === "configuration_missing").length;
  const fetchErr = rows.filter((r) => r.error_code === "client_fetch").length;
  const other = total - success - upstream - timeout - config - fetchErr;
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
      <li>Upstream: ${upstream}</li>
      <li>Timeout: ${timeout}</li>
      <li>Config missing: ${config}</li>
      <li>Fetch/klient: ${fetchErr}</li>
      <li>Andre feil: ${other}</li>
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
    <td class="py-2 pr-4">${esc(data.error_code ?? data.client_error ?? "—")}</td>
    <td class="py-2 pr-4 text-xs">${esc(data.route_note ?? "")}</td>
  `;
  tbody.appendChild(tr);
}

async function fetchReadiness(apiUrl: string): Promise<void> {
  const { readinessEl, statusEl } = requireElements();
  statusEl.textContent = "Sjekker API readiness…";
  try {
    const res = await fetch(apiUrl, { method: "GET", headers: { Accept: "application/json" } });
    const text = await res.text();
    let data: Record<string, unknown> = {};
    try {
      data = JSON.parse(text) as Record<string, unknown>;
    } catch {
      data = {
        route_reached: false,
        client_error: "invalid_json",
        client_http_status: res.status,
        route_note: `GET svarte ikke JSON (HTTP ${res.status})`,
      };
    }
    data.client_http_status = res.status;
    readinessEl.innerHTML = renderReadiness(data);
    statusEl.textContent = res.ok
      ? "Klar — trykk knappen for 5 kall."
      : `API readiness HTTP ${res.status} — se panel over.`;
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    readinessEl.innerHTML = `<p class="text-sm text-red-800">Kunne ikke nå API (GET): ${esc(message)}</p>`;
    statusEl.textContent = "API ikke nådd — sjekk preview-deploy og /api/agent-search-direct-probe.";
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
    let row: ProbeRow = {
      status: "error",
      error_code: "client_fetch",
      client_http_status: null,
      duration_bucket: "—",
      has_answer: false,
      has_citations: false,
      support_score: null,
      route_note: "",
    };

    try {
      const res = await fetch(apiUrl, {
        method: "POST",
        headers: { Accept: "application/json" },
      });
      const text = await res.text();
      row.client_http_status = res.status;

      let data: Record<string, unknown>;
      try {
        data = JSON.parse(text) as Record<string, unknown>;
      } catch {
        row.error_code = "client_fetch";
        row.route_note = `POST ikke JSON (HTTP ${res.status}, ${text.slice(0, 80)})`;
        diagMessages.push(`Kall ${i}: ugyldig JSON fra API.`);
        rows.push(row);
        appendRow(i, row);
        if (i < RUN_COUNT) await sleep(DELAY_MS);
        continue;
      }

      row = { ...row, ...data, client_http_status: res.status };

      if (data.preview_enabled === false || data.enabled === false) {
        row.error_code = data.error_code ?? "disabled";
        row.route_note = String(data.message ?? "Preview gate: deaktivert");
        diagMessages.push(`Kall ${i}: ${row.route_note}`);
      } else if (!res.ok && !data.error_code) {
        row.error_code = "upstream";
        row.route_note = `API HTTP ${res.status}`;
      } else if (data.google_call_attempted === false) {
        row.route_note = `Google ikke kalt — ${String(data.error_code ?? "config")}`;
      } else {
        row.route_note = data.status === "success" ? "Google :answer OK" : `Google ${esc(data.upstream_http_status)}`;
      }

      rows.push(row);
      appendRow(i, row);
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      row.error_code = "client_fetch";
      row.route_note = `Fetch feilet: ${message}`;
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
