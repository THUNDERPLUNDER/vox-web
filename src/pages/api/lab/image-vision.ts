/* CONTRACT: Lab-gated POST — equipment photo → Vertex vision JSON (#237). No storage. */
import type { APIRoute } from "astro";
import { handleLabImageVisionPost } from "../../../lib/lab-image-vision-v01.ts";

export const prerender = false;

export const POST: APIRoute = async ({ request }) => handleLabImageVisionPost(request);
