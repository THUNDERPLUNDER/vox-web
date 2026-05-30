/* CONTRACT: Server-only CES runSession client — normalizes agent text, strips diagnosticInfo. */

import { getGoogleAccessToken } from "./ces-auth";
import { cesResourceBase, type CesEnvConfig } from "./ces-env";

export type CesRunSessionInput = {
  message: string;
  sessionId: string;
};

export type CesRunSessionResult = {
  text: string;
  turnCompleted: boolean;
  turnIndex: number;
};

type CesRunSessionApiOutput = {
  text?: string;
  turnCompleted?: boolean;
  turnIndex?: number;
  diagnosticInfo?: unknown;
};

type CesRunSessionApiResponse = {
  outputs?: CesRunSessionApiOutput[];
};

export class CesRunSessionError extends Error {
  constructor(
    message: string,
    readonly code: "upstream" | "empty_response" | "auth",
    readonly status = 502,
  ) {
    super(message);
    this.name = "CesRunSessionError";
  }
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

function normalizeOutput(outputs: CesRunSessionApiOutput[] | undefined): CesRunSessionResult {
  const candidate =
    outputs?.find((item) => typeof item.text === "string" && item.text.trim()) ??
    outputs?.find((item) => typeof item.text === "string");

  const text = candidate?.text?.trim() ?? "";
  if (!text) {
    throw new CesRunSessionError("empty_agent_response", "empty_response", 502);
  }

  return {
    text,
    turnCompleted: candidate?.turnCompleted ?? true,
    turnIndex: typeof candidate?.turnIndex === "number" ? candidate.turnIndex : 1,
  };
}

/** Call CES runSession with server credentials. Never returns diagnosticInfo. */
export async function runCesSession(
  config: CesEnvConfig,
  input: CesRunSessionInput,
): Promise<CesRunSessionResult> {
  let accessToken: string;
  try {
    accessToken = await getGoogleAccessToken(config.serviceAccountJson);
  } catch {
    throw new CesRunSessionError("google_auth_failed", "auth", 503);
  }

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
  });

  if (!response.ok) {
    throw new CesRunSessionError(`ces_upstream_${response.status}`, "upstream", 502);
  }

  const payload = (await response.json()) as CesRunSessionApiResponse;
  return normalizeOutput(payload.outputs);
}
