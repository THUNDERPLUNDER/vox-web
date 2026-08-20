/* CONTRACT: Product POST — equipment photo → Vertex vision JSON. No storage. Origin guard in app; rate limit in Vercel Firewall. */
import type { APIRoute } from "astro";
import { checkChatOrigin } from "../../lib/chat-api-guard";
import { handleImageVisionPostCore } from "../../lib/image-vision-post-core-v01.ts";
import { canUsePublicAi } from "../../lib/public-ai-access-v01.ts";

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  const origin = checkChatOrigin(request);
  if (!origin.ok) {
    return new Response(JSON.stringify({ error: "invalid_request", message: origin.message }), {
      status: 403,
      headers: { "Content-Type": "application/json; charset=utf-8" },
    });
  }

  if (!(await canUsePublicAi(request))) {
    return new Response(JSON.stringify({ error: "public_ai_disabled", message: "Viddel er ikke tilgjengelig akkurat nå." }), {
      status: 503,
      headers: { "Content-Type": "application/json; charset=utf-8" },
    });
  }

  return handleImageVisionPostCore(request);
};
