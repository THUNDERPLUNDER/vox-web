/* CONTRACT: Per-tab chat identity — reload may continue; fresh/copied tabs must not inherit hidden state. */

export const CHAT_SESSION_PRESENCE_CHANNEL = "viddel-chat-session-presence-v1";
export const CHAT_SESSION_PROBE = "viddel-chat-session-probe-v1";
export const CHAT_SESSION_OCCUPIED = "viddel-chat-session-occupied-v1";

export type ChatNavigationType = "navigate" | "reload" | "back_forward" | "prerender";

type SessionPresenceMessage = {
  type: string;
  sessionId: string;
  instanceId: string;
  targetInstanceId?: string;
};

function asPresenceMessage(value: unknown): SessionPresenceMessage | null {
  if (!value || typeof value !== "object") return null;
  const message = value as Record<string, unknown>;
  if (
    typeof message.type !== "string" ||
    typeof message.sessionId !== "string" ||
    typeof message.instanceId !== "string"
  ) return null;
  return {
    type: message.type,
    sessionId: message.sessionId,
    instanceId: message.instanceId,
    ...(typeof message.targetInstanceId === "string"
      ? { targetInstanceId: message.targetInstanceId }
      : {}),
  };
}

export function shouldReuseStoredConversation(
  hasValidStoredSession: boolean,
  navigationType: ChatNavigationType,
): boolean {
  return hasValidStoredSession && navigationType === "reload";
}

export function isMatchingPeerProbe(
  value: unknown,
  ownSessionId: string,
  ownInstanceId: string,
): boolean {
  const message = asPresenceMessage(value);
  return Boolean(
    message &&
    message.type === CHAT_SESSION_PROBE &&
    message.sessionId === ownSessionId &&
    message.instanceId !== ownInstanceId,
  );
}

export function isOccupiedReplyForInstance(
  value: unknown,
  ownSessionId: string,
  ownInstanceId: string,
): boolean {
  const message = asPresenceMessage(value);
  return Boolean(
    message &&
    message.type === CHAT_SESSION_OCCUPIED &&
    message.sessionId === ownSessionId &&
    message.instanceId !== ownInstanceId &&
    message.targetInstanceId === ownInstanceId,
  );
}
