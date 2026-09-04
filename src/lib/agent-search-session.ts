import { createHash } from "node:crypto";

const COLLECTION = "default_collection";
const GOOGLE_SESSION_ID_PATTERN = /^[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?$/;

export type AgentSearchSessionConfig = {
  projectId: string;
  location: string;
  engineId: string;
};

export function buildAgentSearchSessionParent(config: AgentSearchSessionConfig): string {
  return `projects/${config.projectId}/locations/${config.location}/collections/${COLLECTION}/engines/${config.engineId}`;
}

export function buildAgentSearchSessionId(localSessionId: string): string {
  if (GOOGLE_SESSION_ID_PATTERN.test(localSessionId)) {
    return localSessionId;
  }

  const digest = createHash("sha256").update(localSessionId, "utf8").digest("hex").slice(0, 48);
  return `viddel-${digest}`;
}

export function buildAgentSearchSessionResource(
  config: AgentSearchSessionConfig,
  localSessionId: string,
): string {
  return `${buildAgentSearchSessionParent(config)}/sessions/${buildAgentSearchSessionId(localSessionId)}`;
}

export function isAgentSearchSessionReadyStatus(status: number): boolean {
  return (status >= 200 && status < 300) || status === 409;
}
