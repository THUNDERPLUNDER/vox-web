/* CONTRACT: Dedicated feedback POST. Accepts bounded feedback only; never chat content or CES session IDs. #346 */
import type { APIRoute } from "astro";
import { checkChatOrigin } from "../../lib/chat-api-guard.ts";
import {
  CONVERSATION_FEEDBACK_MAX_BODY_BYTES,
  resolveFeedbackEnvironment,
  validateConversationFeedback,
} from "../../lib/conversation-feedback-v01.ts";
import { saveConversationFeedback } from "../../lib/conversation-feedback-store-v01.ts";

export const prerender = false;

const json = (body: Record<string, unknown>, status: number) =>
  new Response(JSON.stringify(body), {
    status,
    headers: {
      "Cache-Control": "no-store",
      "Content-Type": "application/json; charset=utf-8",
    },
  });

export const POST: APIRoute = async ({ request }) => {
  const origin = checkChatOrigin(request);
  if (!origin.ok) return json({ error: "forbidden_origin", message: "Kunne ikke sende tilbakemeldingen." }, 403);

  if (!request.headers.get("content-type")?.toLowerCase().startsWith("application/json")) {
    return json({ error: "unsupported_media_type", message: "Kunne ikke sende tilbakemeldingen." }, 415);
  }

  const declaredLength = Number(request.headers.get("content-length") ?? 0);
  if (Number.isFinite(declaredLength) && declaredLength > CONVERSATION_FEEDBACK_MAX_BODY_BYTES) {
    return json({ error: "payload_too_large", message: "Tilbakemeldingen er for lang." }, 413);
  }

  let body: unknown;
  try {
    const raw = await request.text();
    if (new TextEncoder().encode(raw).byteLength > CONVERSATION_FEEDBACK_MAX_BODY_BYTES) {
      return json({ error: "payload_too_large", message: "Tilbakemeldingen er for lang." }, 413);
    }
    body = JSON.parse(raw);
  } catch {
    return json({ error: "invalid_json", message: "Kunne ikke sende tilbakemeldingen." }, 400);
  }

  const validated = validateConversationFeedback(body);
  if (!validated.ok) {
    const message = validated.error === "comment_too_long"
      ? "Kommentaren kan være maks 500 tegn."
      : "Kontroller valgene og prøv igjen.";
    return json({ error: validated.error, message }, 400);
  }

  try {
    await saveConversationFeedback(validated.value, resolveFeedbackEnvironment());
    return json({ ok: true }, 201);
  } catch {
    console.error("[api/conversation-feedback] storage_error");
    return json({ error: "storage_unavailable", message: "Kunne ikke lagre tilbakemeldingen akkurat nå." }, 503);
  }
};
