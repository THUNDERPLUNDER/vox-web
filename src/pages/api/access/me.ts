/* CONTRACT: Returns only the current Viddel access state. Never exposes allowlists. #457 */
import type { APIRoute } from "astro";
import { getViddelAccessSession, isAccessAuthConfigured } from "../../../lib/access-auth-v01.ts";

export const prerender = false;

export const GET: APIRoute = async ({ request }) => {
  const session = await getViddelAccessSession(request);

  return new Response(
    JSON.stringify({
      configured: isAccessAuthConfigured(),
      authenticated: Boolean(session),
      role: session?.role ?? null,
      name: session?.name ?? null,
    }),
    {
      status: 200,
      headers: {
        "Cache-Control": "private, no-store, max-age=0",
        "Content-Type": "application/json; charset=utf-8",
      },
    },
  );
};
