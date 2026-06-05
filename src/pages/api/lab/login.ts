/* CONTRACT: Lab login — shared password → HTTP-only session cookie (#237). */
import type { APIRoute } from "astro";
import {
  buildLabSessionSetCookie,
  isLabRouteAvailable,
  verifyLabPassword,
} from "../../../lib/lab-auth-v01.ts";

export const prerender = false;

type LoginBody = { password?: unknown };

export const POST: APIRoute = async ({ request }) => {
  if (!isLabRouteAvailable()) {
    return new Response(JSON.stringify({ error: "not_available" }), {
      status: 404,
      headers: { "Content-Type": "application/json; charset=utf-8" },
    });
  }

  let body: LoginBody;
  try {
    body = (await request.json()) as LoginBody;
  } catch {
    return new Response(JSON.stringify({ error: "invalid_json" }), {
      status: 400,
      headers: { "Content-Type": "application/json; charset=utf-8" },
    });
  }

  const password = typeof body.password === "string" ? body.password : "";
  if (!verifyLabPassword(password)) {
    return new Response(JSON.stringify({ error: "invalid_password", message: "Feil passord." }), {
      status: 401,
      headers: { "Content-Type": "application/json; charset=utf-8" },
    });
  }

  return new Response(JSON.stringify({ ok: true }), {
    status: 200,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Set-Cookie": buildLabSessionSetCookie(),
    },
  });
};
