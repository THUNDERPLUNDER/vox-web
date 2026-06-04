/* CONTRACT: Server proxy for Viddel chat — guards, optional CES or Agent Search backend, no content logging. */
import type { APIRoute } from "astro";
import { runAgentSearchAnswer, resolveAgentSearchEnv } from "../../lib/agent-search-answer";
import {
  CHAT_GUARD_MESSAGES,
  CHAT_MAX_MESSAGE_LENGTH,
  checkChatOrigin,
  checkChatRateLimit,
} from "../../lib/chat-api-guard";
import { isOpsReliabilityRequest } from "../../lib/chat-ops-test";
import {
  mapApiErrorToDriftSignal,
  recordChatDriftSignal,
  recordChatOpsDriftSignal,
  type ChatDriftSignal,
} from "../../lib/chat-usage-metrics";
import { resolveCesEnv } from "../../lib/ces-env";
import { CesRunSessionError, runCesSession } from "../../lib/ces-run-session";
import { resolveViddelAiBackend, type ViddelAiBackend } from "../../lib/viddel-ai-backend";

export const prerender = false;

const SESSION_ID_PATTERN = /^[a-zA-Z0-9][a-zA-Z0-9-_]{4,62}$/;

type ChatRequestBody = {
  message?: unknown;
  sessionId?: unknown;
};

type ChatSuccessMeta = {
  duration_bucket: string;
  retry_used: boolean;
  attempt_count: number;
  has_citations?: boolean;
};

function jsonResponse(body: Record<string, unknown>, status: number): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json; charset=utf-8" },
  });
}

function trackDrift(
  opsTest: boolean,
  signal: ChatDriftSignal,
  meta?: {
    error_code?: string;
    upstream_http_status?: number | null;
    duration_bucket?: string | null;
    retry_used?: boolean;
    attempt_count?: number;
    backend_mode?: ViddelAiBackend;
  },
): void {
  if (opsTest) {
    recordChatOpsDriftSignal(signal, {
      error_code: meta?.error_code ?? null,
      upstream_http_status: meta?.upstream_http_status ?? null,
      duration_bucket: meta?.duration_bucket ?? null,
      retry_used: meta?.retry_used ?? false,
      attempt_count: meta?.attempt_count ?? 1,
      backend_mode: meta?.backend_mode ?? null,
    });
    return;
  }
  recordChatDriftSignal(signal, meta?.error_code ? { error_code: meta.error_code } : undefined);
}

function respond(
  opsTest: boolean,
  body: Record<string, unknown>,
  status: number,
  signal?: ChatDriftSignal,
  errorCode?: string,
  backendMode?: ViddelAiBackend,
): Response {
  if (signal) {
    trackDrift(opsTest, signal, errorCode ? { error_code: errorCode, backend_mode: backendMode } : { backend_mode: backendMode });
  }
  return jsonResponse(body, status);
}

function configurationMissingResponse(opsTest: boolean, backendMode: ViddelAiBackend): Response {
  return respond(
    opsTest,
    {
      error: "configuration_missing",
      message: "Viddel er ikke tilgjengelig akkurat nå.",
    },
    503,
    "configuration_missing",
    "configuration_missing",
    backendMode,
  );
}

function handleBackendError(
  opsTest: boolean,
  error: CesRunSessionError,
  sessionId: string,
  backendMode: ViddelAiBackend,
): Response {
  trackDrift(opsTest, "error", {
    error_code: error.code,
    upstream_http_status: error.upstreamHttpStatus,
    duration_bucket: error.durationBucket,
    retry_used: error.retryUsed,
    attempt_count: error.attemptCount,
    backend_mode: backendMode,
  });
  if (!opsTest) {
    console.error("[api/chat] backend_failed", {
      backend_mode: backendMode,
      error_code: error.code,
      upstream_http_status: error.upstreamHttpStatus,
      duration_bucket: error.durationBucket,
      retry_used: error.retryUsed,
      attempt_count: error.attemptCount,
      session_id_length: sessionId.length,
    });
  }
  return jsonResponse(
    {
      error: error.code,
      message:
        error.code === "auth"
          ? "Viddel er ikke tilgjengelig akkurat nå."
          : CHAT_GUARD_MESSAGES.invalidRequest,
    },
    error.status,
  );
}

function logSuccess(
  opsTest: boolean,
  backendMode: ViddelAiBackend,
  meta: ChatSuccessMeta,
): void {
  if (opsTest) return;
  console.info("[api/chat] backend_ok", {
    backend_mode: backendMode,
    error_code: null,
    upstream_http_status: null,
    duration_bucket: meta.duration_bucket,
    retry_used: meta.retry_used,
    attempt_count: meta.attempt_count,
    has_citations: meta.has_citations ?? null,
  });
}

export const POST: APIRoute = async ({ request }) => {
  const opsTest = isOpsReliabilityRequest(request);
  const backendMode = resolveViddelAiBackend();

  let body: ChatRequestBody;
  try {
    body = (await request.json()) as ChatRequestBody;
  } catch {
    return respond(
      opsTest,
      { error: "invalid_json", message: CHAT_GUARD_MESSAGES.invalidRequest },
      400,
      "error",
      "invalid_json",
      backendMode,
    );
  }

  const message = typeof body.message === "string" ? body.message.trim() : "";
  const sessionId = typeof body.sessionId === "string" ? body.sessionId.trim() : "";

  if (!message) {
    return respond(
      opsTest,
      { error: "invalid_message", message: "Skriv et spørsmål før du sender." },
      400,
      "error",
      "invalid_message",
      backendMode,
    );
  }

  if (message.length > CHAT_MAX_MESSAGE_LENGTH) {
    return respond(
      opsTest,
      { error: "message_too_long", message: CHAT_GUARD_MESSAGES.messageTooLong },
      400,
      "message_too_long",
      "message_too_long",
      backendMode,
    );
  }

  if (!sessionId || !SESSION_ID_PATTERN.test(sessionId)) {
    return respond(
      opsTest,
      { error: "invalid_session", message: CHAT_GUARD_MESSAGES.invalidRequest },
      400,
      "error",
      "invalid_session",
      backendMode,
    );
  }

  const originCheck = checkChatOrigin(request);
  if (!originCheck.ok) {
    return respond(
      opsTest,
      { error: "forbidden_origin", message: originCheck.message },
      403,
      "error",
      "forbidden_origin",
      backendMode,
    );
  }

  const rateLimit = await checkChatRateLimit(request);
  if (!rateLimit.ok) {
    const signal = mapApiErrorToDriftSignal(rateLimit.error);
    return respond(
      opsTest,
      { error: rateLimit.error, message: rateLimit.message },
      rateLimit.status,
      signal,
      rateLimit.error,
      backendMode,
    );
  }

  trackDrift(opsTest, "request", { backend_mode: backendMode });

  if (backendMode === "google_agent_search_direct") {
    const agentEnv = resolveAgentSearchEnv();
    if (!agentEnv.ok) {
      return configurationMissingResponse(opsTest, backendMode);
    }

    try {
      const result = await runAgentSearchAnswer(agentEnv.config, { message });
      const meta: ChatSuccessMeta = {
        duration_bucket: result.meta.durationBucket,
        retry_used: result.meta.retryUsed,
        attempt_count: result.meta.attemptCount,
        has_citations: result.meta.hasCitations,
      };
      trackDrift(opsTest, "success", { ...meta, backend_mode: backendMode });
      logSuccess(opsTest, backendMode, meta);
      return jsonResponse(
        {
          text: result.text,
          turnCompleted: result.turnCompleted,
          turnIndex: result.turnIndex,
        },
        200,
      );
    } catch (error) {
      if (error instanceof CesRunSessionError) {
        return handleBackendError(opsTest, error, sessionId, backendMode);
      }
      console.error("[api/chat] unexpected_error", { backend_mode: backendMode });
      return respond(
        opsTest,
        { error: "internal_error", message: CHAT_GUARD_MESSAGES.invalidRequest },
        500,
        "error",
        "internal_error",
        backendMode,
      );
    }
  }

  const env = resolveCesEnv();
  if (!env.ok) {
    return configurationMissingResponse(opsTest, backendMode);
  }

  try {
    const result = await runCesSession(env.config, { message, sessionId });
    const meta: ChatSuccessMeta = {
      duration_bucket: result.meta.durationBucket,
      retry_used: result.meta.retryUsed,
      attempt_count: result.meta.attemptCount,
    };
    trackDrift(opsTest, "success", { ...meta, backend_mode: backendMode });
    logSuccess(opsTest, backendMode, meta);
    return jsonResponse(
      {
        text: result.text,
        turnCompleted: result.turnCompleted,
        turnIndex: result.turnIndex,
      },
      200,
    );
  } catch (error) {
    if (error instanceof CesRunSessionError) {
      return handleBackendError(opsTest, error, sessionId, backendMode);
    }

    console.error("[api/chat] unexpected_error", { backend_mode: backendMode });
    return respond(
      opsTest,
      { error: "internal_error", message: CHAT_GUARD_MESSAGES.invalidRequest },
      500,
      "error",
      "internal_error",
      backendMode,
    );
  }
};
