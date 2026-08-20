/* CONTRACT: Read temporary owner/public-AI state. Never exposes PIN, cookie value or management token. */
import type { APIRoute } from "astro";
import { hasOwnerSession, isOwnerAccessConfigured } from "../../../lib/owner-access-v01.ts";

export const prerender = false;

export const GET: APIRoute = async ({ request }) => {
  const owner = hasOwnerSession(request);
  return new Response(JSON.stringify({
    owner,
    ownerConfigured: isOwnerAccessConfigured(),
  }), {
    status: 200,
    headers: {
      "Cache-Control": "no-store",
      "Content-Type": "application/json; charset=utf-8",
    },
  });
};
