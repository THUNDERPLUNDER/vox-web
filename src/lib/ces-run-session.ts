/* CONTRACT: Server-only CES runSession client — normalizes agent text, strips diagnosticInfo. */

import { getGoogleAccessToken } from "./ces-auth";
import { cesResourceBase, type CesEnvConfig } from "./ces-env";

export const CES_FETCH_TIMEOUT_MS = 25_000;
export const CES_RETRY_DELAY_MS = 600;
export const CES_MAX_ATTEMPTS = 2;

export type CesRunSessionInput = {
  message: string;
  sessionId: string;
};

export type CesRunSessionResult = {
  text: string;
  turnCompleted: boolean;
  turnIndex: number;
  meta: CesRunSessionMeta;
};

export type CesRunSessionMeta = {
  attemptCount: number;
  retryUsed: boolean;
  durationMs: number;
  durationBucket: DurationBucket;
};

export type DurationBucket = "<1s" | "1-3s" | "3-8s" | "8-20s" | ">20s";

type CesRunSessionApiOutput = {
  text?: string;
  turnCompleted?: boolean;
  turnIndex?: number;
  diagnosticInfo?: unknown;
};

type CesRunSessionApiResponse = {
  outputs?: CesRunSessionApiOutput[];
};

export type CesErrorCode = "upstream" | "empty_response" | "auth" | "timeout";

const RETRYABLE_CODES = new Set<CesErrorCode>(["upstream", "empty_response"]);

export class CesRunSessionError extends Error {
  upstreamHttpStatus: number | null = null;
  attemptCount = 1;
  retryUsed = false;
  durationMs = 0;
  durationBucket: DurationBucket = "<1s";

  constructor(
    message: string,
    readonly code: CesErrorCode,
    readonly status = 502,
    upstreamHttpStatus?: number | null,
  ) {
    super(message);
    this.name = "CesRunSessionError";
    if (upstreamHttpStatus !== undefined) {
      this.upstreamHttpStatus = upstreamHttpStatus;
    }
  }
}

export function durationBucket(ms: number): DurationBucket {
  if (ms < 1000) return "<1s";
  if (ms < 3000) return "1-3s";
  if (ms < 8000) return "3-8s";
  if (ms < 20000) return "8-20s";
  return ">20s";
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function buildRunSessionUrl(config: CesEnvConfig, sessionId: string): string {
  const base = cesResourceBase(config);
  return `https://ces.googleapis.com/v1beta/${base}/sessions/${encodeURIComponent(sessionId)}:runSession`;
}

function buildSessionResource(config: CesEnvConfig, sessionId: string): string {
  return `${cesResourceBase(config)}/sessions/${sessionId}`;
}

function buildDeploymentResource(config: CesEnvConfig): string {
  return `${cesResourceBase(config)}/deployments/${config.deploymentId}`;
}

function normalizeOutput(outputs: CesRunSessionApiOutput[] | undefined): Omit<CesRunSessionResult, "meta"> {
  const candidate =
    outputs?.find((item) => typeof item.text === "string" && item.text.trim()) ??
    outputs?.find((item) => typeof item.text === "string");

  const text = candidate?.text?.trim() ?? "";
  if (!text) {
    throw new CesRunSessionError("empty_agent_response", "empty_response", 502, 200);
  }

  return {
    text,
    turnCompleted: candidate?.turnCompleted ?? true,
    turnIndex: typeof candidate?.turnIndex === "number" ? candidate.turnIndex : 1,
  };
}

function attachAttemptMeta(
  error: CesRunSessionError,
  attemptCount: number,
  retryUsed: boolean,
  durationMs: number,
): CesRunSessionError {
  error.attemptCount = attemptCount;
  error.retryUsed = retryUsed;
  error.durationMs = durationMs;
  error.durationBucket = durationBucket(durationMs);
  return error;
}

async function runCesSessionOnce(
  config: CesEnvConfig,
  input: CesRunSessionInput,
  accessToken: string,
): Promise<Omit<CesRunSessionResult, "meta">> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), CES_FETCH_TIMEOUT_MS);

  try {
    const response = await fetch(buildRunSessionUrl(config, input.sessionId), {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json; charset=utf-8",
      },
      body: JSON.stringify({
        config: {
          session: buildSessionResource(config, input.sessionId),
          deployment: buildDeploymentResource(config),
        },
        inputs: [{ text: input.message }],
      }),
      signal: controller.signal,
    });

    if (!response.ok) {
      throw new CesRunSessionError(`ces_upstream_${response.status}`, "upstream", 502, response.status);
    }

    const payload = (await response.json()) as CesRunSessionApiResponse;
    const normalized = normalizeOutput(payload.outputs);
    return {
      text: normalized.text,
      turnCompleted: normalized.turnCompleted,
      turnIndex: normalized.turnIndex,
    };
  } catch (error) {
    if (error instanceof CesRunSessionError) {
      throw error;
    }
    if (error instanceof Error && error.name === "AbortError") {
      throw new CesRunSessionError("ces_fetch_timeout", "timeout", 504, null);
    }
    throw new CesRunSessionError("ces_network_error", "upstream", 502, null);
  } finally {
    clearTimeout(timeoutId);
  }
}

/** Call CES runSession with server credentials. Retries transient upstream/empty once. Never returns diagnosticInfo. */
export async function runCesSession(
  config: CesEnvConfig,
  input: CesRunSessionInput,
): Promise<CesRunSessionResult> {
  const started = performance.now();

  let accessToken: string;
  try {
    accessToken = await getGoogleAccessToken(config.serviceAccountJson);
  } catch {
    const durationMs = Math.round(performance.now() - started);
    throw attachAttemptMeta(
      new CesRunSessionError("google_auth_failed", "auth", 503, null),
      1,
      false,
      durationMs,
    );
  }

  let lastError: CesRunSessionError | undefined;
  let attemptsMade = 0;

  for (let attempt = 1; attempt <= CES_MAX_ATTEMPTS; attempt += 1) {
    attemptsMade = attempt;
    try {
      const result = await runCesSessionOnce(config, input, accessToken);
      const durationMs = Math.round(performance.now() - started);
      return {
        ...result,
        meta: {
          attemptCount: attempt,
          retryUsed: attempt > 1,
          durationMs,
          durationBucket: durationBucket(durationMs),
        },
      };
    } catch (error) {
      if (!(error instanceof CesRunSessionError)) {
        throw error;
      }
      lastError = error;
      const canRetry = attempt < CES_MAX_ATTEMPTS && RETRYABLE_CODES.has(error.code);
      if (!canRetry) {
        break;
      }
      await sleep(CES_RETRY_DELAY_MS);
    }
  }

  const durationMs = Math.round(performance.now() - started);
  throw attachAttemptMeta(lastError!, attemptsMade, attemptsMade > 1, durationMs);
}
