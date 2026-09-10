/* CONTRACT: Every Vercel Preview response is globally non-indexable; Production is untouched. */

import { defineMiddleware } from "astro:middleware";
import { isVercelPreview } from "./lib/vercel-environment.ts";

export const onRequest = defineMiddleware(async (_context, next) => {
  const response = await next();
  if (!isVercelPreview()) return response;

  const headers = new Headers(response.headers);
  headers.set("X-Robots-Tag", "noindex, nofollow");
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
});
