/* CONTRACT: Product POST — equipment photo → Vertex vision JSON. No storage. Same guards as /api/chat. */
import type { APIRoute } from "astro";
import { checkChatOrigin, checkChatRateLimit } from "../../lib/chat-api-guard";
import { handleImageVisionPostCore } from "../../lib/image-vision-post-core-v01.ts";

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  const origin = checkChatOrigin(request);
  if (!origin.ok) {
    return new Response(JSON.stringify({ error: "invalid_request", message: origin.message }), {
      status: 403,
      headers: { "Content-Type": "application/json; charset=utf-8" },
    });
  }

  const rate = await checkChatRateLimit(request);
  if (!rate.ok) {
    return new Response(JSON.stringify({ error: rate.error, message: rate.message }), {
      status: rate.status,
      headers: { "Content-Type": "application/json; charset=utf-8" },
    });
  }

  return handleImageVisionPostCore(request);
};
