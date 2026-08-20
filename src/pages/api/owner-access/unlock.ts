/* CONTRACT: Four-digit owner PIN unlock. Rate-limit this route in Vercel Firewall. */
import type { APIRoute } from "astro";
import { checkChatOrigin } from "../../../lib/chat-api-guard.ts";
import {
  buildOwnerSessionSetCookie,
  isOwnerAccessConfigured,
  verifyOwnerPin,
} from "../../../lib/owner-access-v01.ts";

export const prerender = false;

type UnlockBody = { pin?: unknown };

export const POST: APIRoute = async ({ request }) => {
  const origin = checkChatOrigin(request);
  if (!origin.ok) {
    return Response.json({ error: "invalid_request" }, { status: 403 });
  }
  if (!isOwnerAccessConfigured()) {
    return Response.json({ error: "not_available" }, { status: 503 });
  }

  let body: UnlockBody;
  try {
    body = (await request.json()) as UnlockBody;
  } catch {
    return Response.json({ error: "invalid_request" }, { status: 400 });
  }
  const pin = typeof body.pin === "string" ? body.pin.trim() : "";
  if (!verifyOwnerPin(pin)) {
    return Response.json({ error: "invalid_pin", message: "Feil kode." }, { status: 401 });
  }

  return new Response(JSON.stringify({ ok: true }), {
    status: 200,
    headers: {
      "Cache-Control": "no-store",
      "Content-Type": "application/json; charset=utf-8",
      "Set-Cookie": buildOwnerSessionSetCookie(),
    },
  });
};
