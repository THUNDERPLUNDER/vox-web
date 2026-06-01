/* CONTRACT: Server proxy for CES runSession — validates input, guards, never exposes credentials or diagnosticInfo. */
import type { APIRoute } from "astro";
import {
  CHAT_GUARD_MESSAGES,
  CHAT_MAX_MESSAGE_LENGTH,
  checkChatOrigin,
  checkChatRateLimit,
} from "../../lib/chat-api-guard";
import {
  mapApiErrorToDriftSignal,
  recordChatDriftSignal,
  type ChatDriftSignal,
} from "../../lib/chat-usage-metrics";
import { resolveCesEnv } from "../../lib/ces-env";
import { CesRunSessionError, runCesSession } from "../../lib/ces-run-session";

export const prerender = false;

const SESSION_ID_PATTERN = /^[a-zA-Z0-9][a-zA-Z0-9-_]{4,62}$/;

type ChatRequestBody = {
  message?: unknown;
  sessionId?: unknown;
};

function jsonResponse(body: Record<string, unknown>, status: number): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json; charset=utf-8" },
  });
}

function respond(
  body: Record<string, unknown>,
  status: number,
  signal?: ChatDriftSignal,
  errorCode?: string,
): Response {
  if (signal) {
    recordChatDriftSignal(signal, errorCode ? { error_code: errorCode } : undefined);
  }
  return jsonResponse(body, status);
}

export const POST: APIRoute = async ({ request }) => {
  let body: ChatRequestBody;
  try {
    body = (await request.json()) as ChatRequestBody;
  } catch {
    return respond(
      { error: "invalid_json", message: CHAT_GUARD_MESSAGES.invalidRequest },
      400,
      "error",
      "invalid_json",
    );
  }

  const message = typeof body.message === "string" ? body.message.trim() : "";
  const sessionId = typeof body.sessionId === "string" ? body.sessionId.trim() : "";

  if (!message) {
    return respond(
      { error: "invalid_message", message: "Skriv et spørsmål før du sender." },
      400,
      "error",
      "invalid_message",
    );
  }

  if (message.length > CHAT_MAX_MESSAGE_LENGTH) {
    return respond(
      { error: "message_too_long", message: CHAT_GUARD_MESSAGES.messageTooLong },
      400,
      "message_too_long",
      "message_too_long",
    );
  }

  if (!sessionId || !SESSION_ID_PATTERN.test(sessionId)) {
    return respond(
      { error: "invalid_session", message: CHAT_GUARD_MESSAGES.invalidRequest },
      400,
      "error",
      "invalid_session",
    );
  }

  const originCheck = checkChatOrigin(request);
  if (!originCheck.ok) {
    return respond(
      { error: "forbidden_origin", message: originCheck.message },
      403,
      "error",
      "forbidden_origin",
    );
  }

  const rateLimit = await checkChatRateLimit(request);
  if (!rateLimit.ok) {
    const signal = mapApiErrorToDriftSignal(rateLimit.error);
    return respond({ error: rateLimit.error, message: rateLimit.message }, rateLimit.status, signal, rateLimit.error);
  }

  recordChatDriftSignal("request");

  const env = resolveCesEnv();
  if (!env.ok) {
    return respond(
      {
        error: "configuration_missing",
        message: "Viddel er ikke tilgjengelig akkurat nå.",
      },
      503,
      "configuration_missing",
      "configuration_missing",
    );
  }

  try {
    const result = await runCesSession(env.config, { message, sessionId });
    recordChatDriftSignal("success");
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
      console.error("[api/chat] ces_run_session_failed", {
        code: error.code,
        status: error.status,
        sessionIdLength: sessionId.length,
      });
      recordChatDriftSignal("error", { error_code: error.code });
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

    console.error("[api/chat] unexpected_error");
    return respond({ error: "internal_error", message: CHAT_GUARD_MESSAGES.invalidRequest }, 500, "error", "internal_error");
  }
};
