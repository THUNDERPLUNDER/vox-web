/* CONTRACT: Lab logout — clear HTTP-only session cookie (#237). */
import type { APIRoute } from "astro";
import { buildLabSessionClearCookie, isLabRouteAvailable } from "../../../lib/lab-auth-v01.ts";

export const prerender = false;

export const POST: APIRoute = async () => {
  if (!isLabRouteAvailable()) {
    return new Response(JSON.stringify({ error: "not_available" }), {
      status: 404,
      headers: { "Content-Type": "application/json; charset=utf-8" },
    });
  }

  return new Response(JSON.stringify({ ok: true }), {
    status: 200,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Set-Cookie": buildLabSessionClearCookie(),
    },
  });
};
