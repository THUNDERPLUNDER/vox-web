/* CONTRACT: Clear temporary owner session cookie. */
import type { APIRoute } from "astro";
import { checkChatOrigin } from "../../../lib/chat-api-guard.ts";
import { buildOwnerSessionClearCookie } from "../../../lib/owner-access-v01.ts";

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  const origin = checkChatOrigin(request);
  if (!origin.ok) return Response.json({ error: "invalid_request" }, { status: 403 });
  return new Response(JSON.stringify({ ok: true }), {
    status: 200,
    headers: {
      "Cache-Control": "no-store",
      "Content-Type": "application/json; charset=utf-8",
      "Set-Cookie": buildOwnerSessionClearCookie(),
    },
  });
};
