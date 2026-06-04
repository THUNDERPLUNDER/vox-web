/* CONTRACT: Canonical path for Agent Search preview probe API — must match src/pages/api/agent-search-direct-probe.ts */

export const AGENT_SEARCH_PROBE_API_SEGMENT = "api/agent-search-direct-probe";

/** Root-absolute API path (respects Astro base for GitHub Pages). */
export function agentSearchProbeApiPath(baseUrl = "/"): string {
  const base = baseUrl.endsWith("/") ? baseUrl : `${baseUrl}/`;
  const combined = `${base}${AGENT_SEARCH_PROBE_API_SEGMENT}`.replace(/\/{2,}/g, "/");
  return combined.startsWith("/") ? combined : `/${combined}`;
}
