/* CONTRACT: Server proxy for CES runSession — validates input, never exposes credentials or diagnosticInfo. */
import type { APIRoute } from "astro";
import { resolveCesEnv } from "../../lib/ces-env";
import { CesRunSessionError, runCesSession } from "../../lib/ces-run-session";

export const prerender = false;

const SESSION_ID_PATTERN = /^[a-zA-Z0-9][a-zA-Z0-9-_]{4,62}$/;
const MAX_MESSAGE_LENGTH = 2000;

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

export const POST: APIRoute = async ({ request }) => {
  const env = resolveCesEnv();
  if (!env.ok) {
    return jsonResponse(
      {
        error: "configuration_missing",
        message: "Server-side CES credentials or config are not configured.",
        missing: env.missing,
      },
      503,
    );
  }

  let body: ChatRequestBody;
  try {
    body = (await request.json()) as ChatRequestBody;
  } catch {
    return jsonResponse({ error: "invalid_json", message: "Request body must be valid JSON." }, 400);
  }

  const message = typeof body.message === "string" ? body.message.trim() : "";
  const sessionId = typeof body.sessionId === "string" ? body.sessionId.trim() : "";

  if (!message) {
    return jsonResponse({ error: "invalid_message", message: "message is required." }, 400);
  }

  if (message.length > MAX_MESSAGE_LENGTH) {
    return jsonResponse({ error: "message_too_long", message: "message exceeds allowed length." }, 400);
  }

  if (!sessionId || !SESSION_ID_PATTERN.test(sessionId)) {
    return jsonResponse({ error: "invalid_session", message: "sessionId is invalid." }, 400);
  }

  try {
    const result = await runCesSession(env.config, { message, sessionId });
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
      return jsonResponse(
        {
          error: error.code,
          message:
            error.code === "auth"
              ? "Could not authenticate to Google Cloud."
              : "Could not reach CES runSession.",
        },
        error.status,
      );
    }

    console.error("[api/chat] unexpected_error");
    return jsonResponse({ error: "internal_error", message: "Unexpected server error." }, 500);
  }
};
