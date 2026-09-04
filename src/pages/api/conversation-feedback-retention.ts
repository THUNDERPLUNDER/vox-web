/* CONTRACT: Daily 90-day cleanup for the dedicated feedback store. #346 */
import type { APIRoute } from "astro";
import { deleteExpiredConversationFeedback } from "../../lib/conversation-feedback-store-v01.ts";

export const prerender = false;

const respond = (body: Record<string, unknown>, status: number) =>
  new Response(JSON.stringify(body), {
    status,
    headers: {
      "Cache-Control": "no-store",
      "Content-Type": "application/json; charset=utf-8",
    },
  });

export const GET: APIRoute = async ({ request }) => {
  const secret = (process.env.CRON_SECRET ?? import.meta.env.CRON_SECRET ?? "").trim();
  if (!secret) return respond({ error: "retention_not_configured" }, 503);
  if (request.headers.get("authorization") !== `Bearer ${secret}`) {
    return respond({ error: "unauthorized" }, 401);
  }

  try {
    const deleted = await deleteExpiredConversationFeedback();
    return respond({ ok: true, deleted }, 200);
  } catch {
    console.error("[api/conversation-feedback-retention] cleanup_error");
    return respond({ error: "cleanup_failed" }, 503);
  }
};
