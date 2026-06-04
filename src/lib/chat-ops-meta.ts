/* CONTRACT: Ops-only response headers for /api/chat reliability — metadata only, never content. */

import type { ViddelAiBackend } from "./viddel-ai-backend";

export const OPS_META_HEADER_BACKEND = "x-viddel-ops-meta-backend-mode";
export const OPS_META_HEADER_ERROR_CODE = "x-viddel-ops-meta-error-code";
export const OPS_META_HEADER_UPSTREAM_HTTP = "x-viddel-ops-meta-upstream-http-status";
export const OPS_META_HEADER_DURATION_BUCKET = "x-viddel-ops-meta-duration-bucket";
export const OPS_META_HEADER_RETRY_USED = "x-viddel-ops-meta-retry-used";
export const OPS_META_HEADER_ATTEMPT_COUNT = "x-viddel-ops-meta-attempt-count";
export const OPS_META_HEADER_HAS_CITATIONS = "x-viddel-ops-meta-has-citations";

export type OpsChatResponseMeta = {
  backend_mode: ViddelAiBackend;
  error_code?: string | null;
  upstream_http_status?: number | null;
  duration_bucket?: string | null;
  retry_used?: boolean;
  attempt_count?: number;
  has_citations?: boolean | null;
};

/** Safe headers for ops reliability script — only when x-viddel-ops-test-token matches. */
export function buildOpsChatMetaHeaders(meta: OpsChatResponseMeta): Record<string, string> {
  const headers: Record<string, string> = {
    [OPS_META_HEADER_BACKEND]: meta.backend_mode,
  };
  if (meta.error_code != null && meta.error_code !== "") {
    headers[OPS_META_HEADER_ERROR_CODE] = meta.error_code;
  }
  if (meta.upstream_http_status != null) {
    headers[OPS_META_HEADER_UPSTREAM_HTTP] = String(meta.upstream_http_status);
  }
  if (meta.duration_bucket) {
    headers[OPS_META_HEADER_DURATION_BUCKET] = meta.duration_bucket;
  }
  if (meta.retry_used != null) {
    headers[OPS_META_HEADER_RETRY_USED] = meta.retry_used ? "1" : "0";
  }
  if (meta.attempt_count != null) {
    headers[OPS_META_HEADER_ATTEMPT_COUNT] = String(meta.attempt_count);
  }
  if (meta.has_citations != null) {
    headers[OPS_META_HEADER_HAS_CITATIONS] = meta.has_citations ? "1" : "0";
  }
  return headers;
}
