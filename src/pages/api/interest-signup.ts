/* CONTRACT: Public email-only interest signup. Never logs or forwards email to analytics. #453 */
import type { APIRoute } from "astro";
import { checkChatOrigin } from "../../lib/chat-api-guard.ts";
import {
  INTEREST_SIGNUP_MAX_BODY_BYTES,
  resolveInterestSignupEnvironment,
  validateInterestSignup,
} from "../../lib/interest-signup-v01.ts";
import { saveInterestSignup } from "../../lib/interest-signup-store-v01.ts";

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
  if (!origin.ok) {
    return json({ error: "forbidden_origin", message: "Kunne ikke melde interesse akkurat nå." }, 403);
  }

  if (!request.headers.get("content-type")?.toLowerCase().startsWith("application/json")) {
    return json({ error: "unsupported_media_type", message: "Kunne ikke melde interesse akkurat nå." }, 415);
  }

  const declaredLength = Number(request.headers.get("content-length") ?? 0);
  if (Number.isFinite(declaredLength) && declaredLength > INTEREST_SIGNUP_MAX_BODY_BYTES) {
    return json({ error: "payload_too_large", message: "Kunne ikke melde interesse akkurat nå." }, 413);
  }

  let body: unknown;
  try {
    const raw = await request.text();
    if (new TextEncoder().encode(raw).byteLength > INTEREST_SIGNUP_MAX_BODY_BYTES) {
      return json({ error: "payload_too_large", message: "Kunne ikke melde interesse akkurat nå." }, 413);
    }
    body = JSON.parse(raw);
  } catch {
    return json({ error: "invalid_json", message: "Kunne ikke melde interesse akkurat nå." }, 400);
  }

  const validated = validateInterestSignup(body);
  if (!validated.ok) {
    const message = validated.error === "invalid_email"
      ? "Skriv inn en gyldig e-postadresse."
      : "Kontroller opplysningene og prøv igjen.";
    return json({ error: validated.error, message }, 400);
  }

  if (validated.kind === "spam") {
    return json({ ok: true }, 201);
  }

  try {
    await saveInterestSignup(validated.value, resolveInterestSignupEnvironment());
    return json({ ok: true }, 201);
  } catch {
    console.error("[api/interest-signup] storage_error");
    return json({ error: "storage_unavailable", message: "Kunne ikke melde interesse akkurat nå." }, 503);
  }
};
