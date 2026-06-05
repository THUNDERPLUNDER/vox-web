/* CONTRACT: Server-only Discovery Engine :answer for /api/chat — no prompt/answer logging. */

import { getGoogleAccessToken } from "./ces-auth";
import {
  VIDDEL_RESPONSE_CONTRACT_VERSION,
  VIDDEL_RESPONSE_PREAMBLE,
} from "./viddel-response-contract";
import {
  CES_FETCH_TIMEOUT_MS,
  CES_MAX_ATTEMPTS,
  CES_RETRY_DELAY_MS,
  CesRunSessionError,
  durationBucket,
  type CesErrorCode,
  type DurationBucket,
} from "./ces-run-session";

const COLLECTION = "default_collection";
const DEFAULT_ANSWER_SERVING = "default_serving_config";

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

export type AgentSearchAnswerInput = {
  message: string;
};

export type AgentSearchAnswerResult = {
  text: string;
  turnCompleted: boolean;
  turnIndex: number;
  meta: AgentSearchAnswerMeta;
};

export type AgentSearchAnswerMeta = {
  attemptCount: number;
  retryUsed: boolean;
  durationMs: number;
  durationBucket: DurationBucket;
  hasCitations: boolean;
  responseContractVersion: string;
};

type AgentSearchAnswerSessionMode = "omit" | "full";

function readEnv(name: string): string {
  return (process.env[name] ?? import.meta.env[name] ?? "").trim();
}

function discoveryHost(location: string): string {
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

function resolveAnswerSessionMode(): AgentSearchAnswerSessionMode {
  const raw = readEnv("AGENT_SEARCH_ANSWER_SESSION").toLowerCase();
  return raw === "full" ? "full" : "omit";
}

function buildAnswerSessionResource(config: AgentSearchEnvConfig): string {
  return `projects/${config.projectId}/locations/${config.location}/collections/${COLLECTION}/engines/${config.engineId}/sessions/-`;
}

function buildAnswerUrl(host: string, config: AgentSearchEnvConfig): string {
  const resource = `projects/${config.projectId}/locations/${config.location}/collections/${COLLECTION}/engines/${config.engineId}/servingConfigs/${config.servingConfig}`;
  return `${host}/v1/${resource}:answer`;
}

function buildAnswerRequestBody(config: AgentSearchEnvConfig, message: string): Record<string, unknown> {
  const body: Record<string, unknown> = {
    query: { text: message },
    groundingSpec: {
      includeGroundingSupports: true,
    },
    answerGenerationSpec: {
      ignoreAdversarialQuery: true,
      ignoreNonAnswerSeekingQuery: false,
      includeCitations: true,
      promptSpec: {
        preamble: VIDDEL_RESPONSE_PREAMBLE,
      },
    },
  };

  if (resolveAnswerSessionMode() === "full") {
    body.session = buildAnswerSessionResource(config);
  }

  return body;
}

function extractSafeGoogleError(responseText: string): { hint: string | null } {
  try {
    const parsed = JSON.parse(responseText) as {
      error?: { message?: string };
    };
    const msg = parsed.error?.message;
    if (typeof msg !== "string") return { hint: null };
    const hint = msg.slice(0, 160);
    return { hint: hint.length < msg.length ? `${hint}…` : hint };
  } catch {
    return { hint: null };
  }
}

function mapGoogleHttpToCesCode(httpStatus: number, hint: string | null): CesErrorCode {
  if (httpStatus === 401 || httpStatus === 403) return "auth";
  if (httpStatus === 408 || httpStatus === 504) return "timeout";
  if (httpStatus === 502 || httpStatus === 503) return "upstream";
  if (httpStatus === 400 && hint?.includes("Cannot fetch Engine")) return "upstream";
  return "upstream";
}

function extractAnswerText(payload: Record<string, unknown>): string {
  const answer = (payload.answer ?? payload) as Record<string, unknown>;
  const text = answer.answerText ?? answer.text ?? "";
  return typeof text === "string" ? text.trim() : "";
}

function hasCitations(payload: Record<string, unknown>): boolean {
  const answer = (payload.answer ?? payload) as Record<string, unknown>;
  const grounding = answer.groundingMetadata as Record<string, unknown> | undefined;
  const chunks =
    grounding?.groundingChunks ?? answer.groundingAttributions ?? answer.citations ?? [];
  return Array.isArray(chunks) && chunks.length > 0;
}

function attachAttemptMeta(
  error: CesRunSessionError,
  attemptCount: number,
  retryUsed: boolean,
  durationMs: number,
): CesRunSessionError {
  error.attemptCount = attemptCount;
  error.retryUsed = retryUsed;
  error.durationMs = durationMs;
  error.durationBucket = durationBucket(durationMs);
  return error;
}

const RETRYABLE_CODES = new Set<CesErrorCode>(["upstream", "empty_response"]);

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function runAgentSearchAnswerOnce(
  config: AgentSearchEnvConfig,
  input: AgentSearchAnswerInput,
  accessToken: string,
): Promise<{ text: string; hasCitations: boolean }> {
  const host = discoveryHost(config.location);
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), CES_FETCH_TIMEOUT_MS);

  try {
    const response = await fetch(buildAnswerUrl(host, config), {
      method: "POST",
      signal: controller.signal,
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json; charset=utf-8",
      },
      body: JSON.stringify(buildAnswerRequestBody(config, input.message)),
    });

    const responseText = await response.text().catch(() => "");

    if (!response.ok) {
      const { hint } = extractSafeGoogleError(responseText);
      const code = mapGoogleHttpToCesCode(response.status, hint);
      throw new CesRunSessionError(`agent_search_upstream_${response.status}`, code, 502, response.status);
    }

    let payload: Record<string, unknown> = {};
    if (responseText) {
      payload = (JSON.parse(responseText) as Record<string, unknown>) ?? {};
    }

    const text = extractAnswerText(payload);
    if (!text) {
      throw new CesRunSessionError("empty_agent_search_response", "empty_response", 502, 200);
    }

    return { text, hasCitations: hasCitations(payload) };
  } catch (error) {
    if (error instanceof CesRunSessionError) {
      throw error;
    }
    if (error instanceof Error && error.name === "AbortError") {
      throw new CesRunSessionError("agent_search_fetch_timeout", "timeout", 504, null);
    }
    throw new CesRunSessionError("agent_search_network_error", "upstream", 502, null);
  } finally {
    clearTimeout(timeoutId);
  }
}

/** Discovery Engine :answer for /api/chat — retries once on transient errors; never logs message or answer. */
export async function runAgentSearchAnswer(
  config: AgentSearchEnvConfig,
  input: AgentSearchAnswerInput,
): Promise<AgentSearchAnswerResult> {
  const started = performance.now();

  let accessToken: string;
  try {
    accessToken = await getGoogleAccessToken(config.serviceAccountJson);
  } catch {
    const durationMs = Math.round(performance.now() - started);
    throw attachAttemptMeta(
      new CesRunSessionError("google_auth_failed", "auth", 503, null),
      1,
      false,
      durationMs,
    );
  }

  let lastError: CesRunSessionError | undefined;
  let attemptsMade = 0;

  for (let attempt = 1; attempt <= CES_MAX_ATTEMPTS; attempt += 1) {
    attemptsMade = attempt;
    try {
      const result = await runAgentSearchAnswerOnce(config, input, accessToken);
      const durationMs = Math.round(performance.now() - started);
      return {
        text: result.text,
        turnCompleted: true,
        turnIndex: 0,
        meta: {
          attemptCount: attempt,
          retryUsed: attempt > 1,
          durationMs,
          durationBucket: durationBucket(durationMs),
          hasCitations: result.hasCitations,
          responseContractVersion: VIDDEL_RESPONSE_CONTRACT_VERSION,
        },
      };
    } catch (error) {
      if (!(error instanceof CesRunSessionError)) {
        throw error;
      }
      lastError = error;
      const canRetry = attempt < CES_MAX_ATTEMPTS && RETRYABLE_CODES.has(error.code);
      if (!canRetry) {
        break;
      }
      await sleep(CES_RETRY_DELAY_MS);
    }
  }

  const durationMs = Math.round(performance.now() - started);
  throw attachAttemptMeta(lastError!, attemptsMade, attemptsMade > 1, durationMs);
}
