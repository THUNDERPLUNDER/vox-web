/* CONTRACT: Authenticated CSV export for interest signups (#455). Never logs row content. */
import type { APIRoute } from "astro";
import { hasValidLabSession, isLabRouteAvailable } from "../../../lib/lab-auth-v01.ts";
import { listInterestSignups } from "../../../lib/interest-signup-store-v01.ts";

export const prerender = false;

const csvCell = (value: string) => {
  let safe = value;
  if (/^[=+\-@]/.test(safe)) safe = `'${safe}`;
  return `"${safe.replaceAll('"', '""')}"`;
};

export const GET: APIRoute = async ({ request }) => {
  if (!isLabRouteAvailable()) {
    return new Response(null, { status: 404, statusText: "Not Found" });
  }

  if (!hasValidLabSession(request)) {
    return new Response("Unauthorized", {
      status: 401,
      headers: { "Cache-Control": "private, no-store, max-age=0" },
    });
  }

  try {
    const records = await listInterestSignups();
    const header = [
      "email",
      "created_at",
      "consent_at",
      "consent_version",
      "source",
      "environment",
    ];
    const rows = records.map((record) =>
      [
        record.email,
        record.createdAt,
        record.consentAt,
        record.consentVersion,
        record.source,
        record.environment,
      ].map(csvCell).join(","),
    );

    const stamp = new Date().toISOString().slice(0, 10);
    return new Response([header.join(","), ...rows].join("\n") + "\n", {
      status: 200,
      headers: {
        "Cache-Control": "private, no-store, max-age=0",
        "Content-Disposition": `attachment; filename="viddel-interest-signups-${stamp}.csv"`,
        "Content-Type": "text/csv; charset=utf-8",
        "X-Robots-Tag": "noindex, nofollow",
      },
    });
  } catch {
    console.error("[api/lab/interest-signups.csv] read_error");
    return new Response("Kunne ikke hente interessentlisten.", {
      status: 503,
      headers: { "Cache-Control": "private, no-store, max-age=0" },
    });
  }
};
