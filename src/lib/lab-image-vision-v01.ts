/* CONTRACT: Shared POST handler for /api/lab/image-vision — equipment photo → Vertex JSON. No storage. */
import { handleImageVisionPostCore } from "./image-vision-post-core-v01.ts";
import { hasValidLabSession, isLabRouteAvailable } from "./lab-auth-v01.ts";

function json(body: Record<string, unknown>, status: number): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json; charset=utf-8" },
  });
}

/** Lab-gated image vision POST — requires valid Lab session cookie. */
export async function handleLabImageVisionPost(request: Request): Promise<Response> {
  if (!isLabRouteAvailable()) {
    return json({ error: "not_available", message: "Lab image QA is not available." }, 404);
  }

  if (!hasValidLabSession(request)) {
    return json({ error: "unauthorized", message: "Lab login required." }, 401);
  }

  return handleImageVisionPostCore(request);
}
