/* CONTRACT: Better Auth handler for Viddel Access v0.1. #457 */
import type { APIRoute } from "astro";
import { accessAuth, isAccessAuthConfigured } from "../../../lib/access-auth-v01.ts";

export const prerender = false;

export const ALL: APIRoute = async ({ request }) => {
  if (!isAccessAuthConfigured()) {
    return new Response(JSON.stringify({ error: "access_auth_not_configured" }), {
      status: 503,
      headers: {
        "Cache-Control": "no-store",
        "Content-Type": "application/json; charset=utf-8",
      },
    });
  }

  return accessAuth.handler(request);
};
