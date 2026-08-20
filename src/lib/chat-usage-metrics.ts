/* CONTRACT: Server-side drift signals for /api/chat — structured Vercel logs, no content. */

export type ChatDriftSignal =
  | "request"
  | "success"
  | "error"
  | "message_too_long"
  | "configuration_missing";

/** Synchronous structured log — never logs message/session/IP. */
export function recordChatDriftSignal(signal: ChatDriftSignal, meta?: { error_code?: string }): void {
  try {
    console.info("[chat-drift]", {
      signal,
      error_code: meta?.error_code ?? null,
    });
  } catch {
    console.error("[chat-drift] metrics_record_failed", { signal });
  }
}

export type ChatOpsDriftMeta = {
  error_code?: string | null;
  upstream_http_status?: number | null;
  duration_bucket?: string | null;
  retry_used?: boolean;
  attempt_count?: number;
  backend_mode?: string | null;
};

/** Ops reliability tests — separate log stream and counters; never logs content, sessionId or IP. */
export function recordChatOpsDriftSignal(signal: ChatDriftSignal, meta?: ChatOpsDriftMeta): void {
  try {
    console.info("[chat-ops-drift]", {
      signal,
      ops_test: true,
      error_code: meta?.error_code ?? null,
      upstream_http_status: meta?.upstream_http_status ?? null,
      duration_bucket: meta?.duration_bucket ?? null,
      retry_used: meta?.retry_used ?? false,
      attempt_count: meta?.attempt_count ?? 1,
      backend_mode: meta?.backend_mode ?? null,
    });
  } catch {
    console.error("[chat-ops-drift] metrics_record_failed", { signal });
  }
}
