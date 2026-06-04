/* CONTRACT: Server-only Agent Search :answer client — metadata only, no prompt/answer logging. */

import { getGoogleAccessToken } from "./ces-auth";
import { durationBucket, type DurationBucket } from "./ces-run-session";

const COLLECTION = "default_collection";
const DEFAULT_ANSWER_SERVING = "default_serving_config";
const FETCH_TIMEOUT_MS = 25_000;

/** Fixed test input — never logged or returned to clients. */
export const AGENT_SEARCH_PROBE_TEST_MESSAGE =
  "Hva gjør jeg når appen ikke finner høreapparatet?";

export type AgentSearchEnvConfig = {
  projectId: string;
  location: string;
  engineId: string;
  serviceAccountJson: string;
  servingConfig: string;
};

export type AgentSearchEnvResult =
  | { ok: true; config: AgentSearchEnvConfig }
  | { ok: false; missing: string[] };

export type AgentSearchProbeErrorCode =
  | "upstream"
  | "empty_response"
  | "auth"
  | "timeout"
  | "configuration_missing"
  | "google_400_bad_request"
  | "google_engine_not_found"
  | "google_invalid_session_name"
  | "google_403"
  | "google_404"
  | "google_502";

export type AgentSearchAnswerSessionMode = "omit" | "full";

export function mapGoogleUpstreamErrorCode(
  httpStatus: number,
  hint: string | null = null,
): AgentSearchProbeErrorCode {
  if (httpStatus === 400) {
    if (hint?.includes("Cannot fetch Engine")) return "google_engine_not_found";
    if (hint?.includes("Invalid session name")) return "google_invalid_session_name";
    return "google_400_bad_request";
  }
  if (httpStatus === 403) return "google_403";
  if (httpStatus === 404) return "google_404";
  if (httpStatus === 502 || httpStatus === 503 || httpStatus === 504) return "google_502";
  return "upstream";
}

export type AgentSearchProbeMetadata = {
  status: "success" | "error";
  error_code: AgentSearchProbeErrorCode | null;
  upstream_http_status: number | null;
  google_rpc_status: string | null;
  google_error_hint: string | null;
  duration_bucket: DurationBucket;
  has_answer: boolean;
  has_citations: boolean;
  support_score: number | null;
  response_state: string | null;
  layer: "google_agent_search_direct";
  method: "discoveryengine.servingConfigs.answer";
  endpoint_host: string;
  serving_config: string;
  location: string;
  project_id: string;
  engine_id: string;
};

function readEnv(name: string): string {
  return (process.env[name] ?? import.meta.env[name] ?? "").trim();
}

export function discoveryHost(location: string): string {
  const loc = location.trim().toLowerCase();
  if (loc === "eu") return "https://eu-discoveryengine.googleapis.com";
  if (loc === "us") return "https://us-discoveryengine.googleapis.com";
  return "https://discoveryengine.googleapis.com";
}

export function resolveAgentSearchEnv(): AgentSearchEnvResult {
  const projectId = readEnv("CES_PROJECT_ID");
  const location = readEnv("AGENT_SEARCH_LOCATION") || readEnv("CES_LOCATION");
  const engineId = readEnv("AGENT_SEARCH_ENGINE_ID");
  const serviceAccountJson = readEnv("GOOGLE_SERVICE_ACCOUNT_JSON");
  const servingConfig = readEnv("AGENT_SEARCH_SERVING_CONFIG") || DEFAULT_ANSWER_SERVING;

  const missing: string[] = [];
  if (!projectId) missing.push("CES_PROJECT_ID");
  if (!location) missing.push("CES_LOCATION or AGENT_SEARCH_LOCATION");
  if (!engineId) missing.push("AGENT_SEARCH_ENGINE_ID");
  if (!serviceAccountJson) missing.push("GOOGLE_SERVICE_ACCOUNT_JSON");

  if (missing.length > 0) {
    return { ok: false, missing };
  }

  return {
    ok: true,
    config: { projectId, location, engineId, serviceAccountJson, servingConfig },
  };
}

function buildAnswerUrl(host: string, config: AgentSearchEnvConfig): string {
  const resource = `projects/${config.projectId}/locations/${config.location}/collections/${COLLECTION}/engines/${config.engineId}/servingConfigs/${config.servingConfig}`;
  return `${host}/v1/${resource}:answer`;
}

/** Preview probe default: omit session. Override with AGENT_SEARCH_ANSWER_SESSION=full. */
export function resolveAnswerSessionMode(): AgentSearchAnswerSessionMode {
  const raw = readEnv("AGENT_SEARCH_ANSWER_SESSION").toLowerCase();
  return raw === "full" ? "full" : "omit";
}

/** Full session resource for auto session (wildcard id `-`). */
export function buildAnswerSessionResource(config: AgentSearchEnvConfig): string {
  return `projects/${config.projectId}/locations/${config.location}/collections/${COLLECTION}/engines/${config.engineId}/sessions/-`;
}

/** Documented AnswerQueryRequest body — no unknown JSON fields. */
export function buildAnswerRequestBody(config: AgentSearchEnvConfig): Record<string, unknown> {
  const body: Record<string, unknown> = {
    query: { text: AGENT_SEARCH_PROBE_TEST_MESSAGE },
    groundingSpec: {
      includeGroundingSupports: true,
    },
    answerGenerationSpec: {
      ignoreAdversarialQuery: true,
      ignoreNonAnswerSeekingQuery: false,
      includeCitations: true,
    },
  };

  if (resolveAnswerSessionMode() === "full") {
    body.session = buildAnswerSessionResource(config);
  }

  return body;
}

/** Parse Google error JSON — status + short hint only, never full body or query text. */
export function extractSafeGoogleError(
  responseText: string,
): { rpc_status: string | null; hint: string | null } {
  try {
    const parsed = JSON.parse(responseText) as {
      error?: { status?: string; message?: string };
    };
    const err = parsed.error;
    if (!err) return { rpc_status: null, hint: null };
    const rpc_status = typeof err.status === "string" ? err.status : null;
    let hint: string | null = null;
    if (typeof err.message === "string") {
      hint = err.message.slice(0, 160);
      if (hint.length < err.message.length) hint = `${hint}…`;
    }
    return { rpc_status, hint };
  } catch {
    return { rpc_status: null, hint: null };
  }
}

function countCitations(payload: Record<string, unknown>): number {
  const answer = (payload.answer ?? payload) as Record<string, unknown>;
  const grounding = answer.groundingMetadata as Record<string, unknown> | undefined;
  const chunks =
    grounding?.groundingChunks ?? answer.groundingAttributions ?? answer.citations ?? [];
  return Array.isArray(chunks) ? chunks.length : 0;
}

function extractSupportScore(payload: Record<string, unknown>): number | null {
  const answer = (payload.answer ?? payload) as Record<string, unknown>;
  const grounding = answer.groundingMetadata as Record<string, unknown> | undefined;
  const candidates = [grounding?.supportScore, grounding?.retrievalScore, answer.supportScore];
  for (const v of candidates) {
    if (typeof v === "number" && Number.isFinite(v)) return v;
  }
  return null;
}

function extractResponseState(payload: Record<string, unknown>): string | null {
  const answer = (payload.answer ?? payload) as Record<string, unknown>;
  const state = answer.state ?? answer.answerState;
  return typeof state === "string" ? state : null;
}

function hasAnswerText(payload: Record<string, unknown>): boolean {
  const answer = (payload.answer ?? payload) as Record<string, unknown>;
  const text = answer.answerText ?? answer.text ?? "";
  return typeof text === "string" && text.trim().length > 0;
}

function baseMeta(
  config: AgentSearchEnvConfig,
  host: string,
  started: number,
): Omit<AgentSearchProbeMetadata, "status" | "error_code" | "upstream_http_status" | "google_rpc_status" | "google_error_hint" | "has_answer" | "has_citations" | "support_score" | "response_state"> {
  return {
    duration_bucket: durationBucket(Date.now() - started),
    layer: "google_agent_search_direct",
    method: "discoveryengine.servingConfigs.answer",
    endpoint_host: host,
    serving_config: config.servingConfig,
    location: config.location,
    project_id: config.projectId,
    engine_id: config.engineId,
  };
}

/** One direct :answer call — never logs message or answer body. */
export async function runAgentSearchDirectProbeOnce(
  config: AgentSearchEnvConfig,
): Promise<AgentSearchProbeMetadata> {
  const host = discoveryHost(config.location);
  const started = Date.now();
  let token: string;

  try {
    token = await getGoogleAccessToken(config.serviceAccountJson);
  } catch {
    return {
      status: "error",
      error_code: "auth",
      upstream_http_status: null,
      google_rpc_status: null,
      google_error_hint: null,
      has_answer: false,
      has_citations: false,
      support_score: null,
      response_state: null,
      ...baseMeta(config, host, started),
    };
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);

  try {
    const response = await fetch(buildAnswerUrl(host, config), {
      method: "POST",
      signal: controller.signal,
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json; charset=utf-8",
      },
      body: JSON.stringify(buildAnswerRequestBody(config)),
    });

    const responseText = await response.text().catch(() => "");
    let payload: Record<string, unknown> = {};
    if (response.ok && responseText) {
      payload = (JSON.parse(responseText) as Record<string, unknown>) ?? {};
    }

    const safeErr = response.ok ? { rpc_status: null, hint: null } : extractSafeGoogleError(responseText);
    const ok = response.ok && hasAnswerText(payload);
    const durationMs = Date.now() - started;

    return {
      status: ok ? "success" : "error",
      error_code: ok
        ? null
        : response.ok
          ? "empty_response"
          : mapGoogleUpstreamErrorCode(response.status, safeErr.hint),
      upstream_http_status: response.status,
      google_rpc_status: safeErr.rpc_status,
      google_error_hint: safeErr.hint,
      duration_bucket: durationBucket(durationMs),
      has_answer: hasAnswerText(payload),
      has_citations: countCitations(payload),
      support_score: extractSupportScore(payload),
      response_state: extractResponseState(payload),
      ...baseMeta(config, host, started),
    };
  } catch (err) {
    const durationMs = Date.now() - started;
    const isAbort = err instanceof Error && err.name === "AbortError";
    return {
      status: "error",
      error_code: isAbort ? "timeout" : "upstream",
      upstream_http_status: null,
      google_rpc_status: null,
      google_error_hint: null,
      duration_bucket: durationBucket(durationMs),
      has_answer: false,
      has_citations: false,
      support_score: null,
      response_state: null,
      ...baseMeta(config, host, started),
    };
  } finally {
    clearTimeout(timeoutId);
  }
}
