/* CONTRACT: Resolve VIDDEL_AI_BACKEND for /api/chat — default ces_channel, no client exposure. */

export type ViddelAiBackend = "ces_channel" | "google_agent_search_direct";

const VALID_BACKENDS: ReadonlySet<string> = new Set([
  "ces_channel",
  "google_agent_search_direct",
]);

function readEnv(name: string): string {
  return (process.env[name] ?? import.meta.env[name] ?? "").trim();
}

/** Server-only backend mode for POST /api/chat. Invalid/unset → ces_channel. */
export function resolveViddelAiBackend(): ViddelAiBackend {
  const raw = readEnv("VIDDEL_AI_BACKEND").toLowerCase();
  if (!raw) return "ces_channel";
  if (VALID_BACKENDS.has(raw)) {
    return raw as ViddelAiBackend;
  }
  console.warn("[api/chat] backend_mode_invalid", { backend_mode: raw });
  return "ces_channel";
}
