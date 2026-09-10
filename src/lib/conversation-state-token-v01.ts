/* CONTRACT: Encrypted, session-bound, short-lived conversation state. No raw history or persistent profile. */

import {
  createCipheriv,
  createDecipheriv,
  createHash,
  randomBytes,
} from "node:crypto";

export const CONVERSATION_STATE_TOKEN_ENV = "VIDDEL_CONVERSATION_STATE_SECRET";
export const CONVERSATION_STATE_TOKEN_TTL_MS = 12 * 60 * 60 * 1000;

const TOKEN_VERSION = "v1";
const TOKEN_AAD = Buffer.from("viddel-conversation-state:v1", "utf8");
const MAX_LAST_DELIVERY_LENGTH = 480;

export type UserEvidence = {
  source: "user";
  quote: string;
  turnIndex: number;
};

export type ActiveSituation = {
  summary: string;
  provenance: UserEvidence;
};

export type EstablishedContext = {
  kind: "general" | "product";
  summary: string;
  brand?: string;
  model?: string;
  provenance: UserEvidence;
};

export type ScopedCorrection = {
  summary: string;
  target: string;
  scope: "current_situation";
  scopeTurnIndex: number | null;
  provenance: UserEvidence;
};

export type ConversationState = {
  activeSituation: ActiveSituation | null;
  establishedContext: EstablishedContext[];
  corrections: ScopedCorrection[];
  lastDeliveryContext: string | null;
};

type ConversationStateEnvelope = {
  version: 1;
  sessionId: string;
  turnIndex: number;
  expiresAt: number;
  state: ConversationState;
};

export type ConversationStateTokenResult =
  | { valid: true; state: ConversationState; turnIndex: number }
  | {
      valid: false;
      reason: "missing" | "invalid" | "expired" | "session_mismatch";
      state: ConversationState;
      turnIndex: 0;
    };

function readEnv(name: string): string {
  return (process.env[name] ?? import.meta.env?.[name] ?? "").trim();
}

export function resolveConversationStateSecret():
  | { ok: true; secret: string }
  | { ok: false; missing: string[] } {
  const secret = readEnv(CONVERSATION_STATE_TOKEN_ENV);
  if (secret.length < 32) return { ok: false, missing: [CONVERSATION_STATE_TOKEN_ENV] };
  return { ok: true, secret };
}

export function emptyConversationState(): ConversationState {
  return {
    activeSituation: null,
    establishedContext: [],
    corrections: [],
    lastDeliveryContext: null,
  };
}

function tokenKey(secret: string): Buffer {
  return createHash("sha256").update(secret, "utf8").digest();
}

function normalizeShortString(value: unknown, maxLength = 320): string {
  return typeof value === "string" ? value.trim().slice(0, maxLength) : "";
}

function normalizeEvidence(value: unknown): UserEvidence | null {
  if (!value || typeof value !== "object") return null;
  const candidate = value as Record<string, unknown>;
  const quote = normalizeShortString(candidate.quote);
  const turnIndex = Number(candidate.turnIndex);
  if (candidate.source !== "user" || !quote || !Number.isInteger(turnIndex) || turnIndex < 1) return null;
  return { source: "user", quote, turnIndex };
}

function normalizeState(value: unknown): ConversationState | null {
  if (!value || typeof value !== "object") return null;
  const candidate = value as Record<string, unknown>;

  let activeSituation: ActiveSituation | null = null;
  if (candidate.activeSituation && typeof candidate.activeSituation === "object") {
    const active = candidate.activeSituation as Record<string, unknown>;
    const summary = normalizeShortString(active.summary);
    const provenance = normalizeEvidence(active.provenance);
    if (summary && provenance) activeSituation = { summary, provenance };
  }

  const establishedContext: EstablishedContext[] = [];
  if (Array.isArray(candidate.establishedContext)) {
    for (const raw of candidate.establishedContext.slice(-6)) {
      if (!raw || typeof raw !== "object") continue;
      const item = raw as Record<string, unknown>;
      const kind = item.kind === "product" ? "product" : item.kind === "general" ? "general" : null;
      const summary = normalizeShortString(item.summary);
      const provenance = normalizeEvidence(item.provenance);
      if (!kind || !summary || !provenance) continue;
      const brand = normalizeShortString(item.brand, 100);
      const model = normalizeShortString(item.model, 140);
      if (kind === "product" && (!brand || !model)) continue;
      establishedContext.push({
        kind,
        summary,
        ...(kind === "product" ? { brand, model } : {}),
        provenance,
      });
    }
  }

  const corrections: ScopedCorrection[] = [];
  if (Array.isArray(candidate.corrections)) {
    for (const raw of candidate.corrections.slice(-4)) {
      if (!raw || typeof raw !== "object") continue;
      const item = raw as Record<string, unknown>;
      const summary = normalizeShortString(item.summary);
      const target = normalizeShortString(item.target);
      const provenance = normalizeEvidence(item.provenance);
      const scopeTurnIndex = item.scopeTurnIndex === null
        ? null
        : Number.isInteger(item.scopeTurnIndex) && Number(item.scopeTurnIndex) >= 1
          ? Number(item.scopeTurnIndex)
          : null;
      if (!summary || !target || item.scope !== "current_situation" || !provenance) continue;
      corrections.push({ summary, target, scope: "current_situation", scopeTurnIndex, provenance });
    }
  }

  const lastDeliveryContext = normalizeShortString(candidate.lastDeliveryContext, MAX_LAST_DELIVERY_LENGTH);
  return {
    activeSituation,
    establishedContext,
    corrections,
    lastDeliveryContext: lastDeliveryContext || null,
  };
}

export function sealConversationStateToken(
  input: { sessionId: string; turnIndex: number; state: ConversationState },
  secret: string,
  options: { now?: number; iv?: Uint8Array } = {},
): string {
  const now = options.now ?? Date.now();
  const iv = Buffer.from(options.iv ?? randomBytes(12));
  if (iv.length !== 12) throw new Error("conversation_state_invalid_iv");
  const envelope: ConversationStateEnvelope = {
    version: 1,
    sessionId: input.sessionId,
    turnIndex: input.turnIndex,
    expiresAt: now + CONVERSATION_STATE_TOKEN_TTL_MS,
    state: input.state,
  };
  const cipher = createCipheriv("aes-256-gcm", tokenKey(secret), iv);
  cipher.setAAD(TOKEN_AAD);
  const ciphertext = Buffer.concat([
    cipher.update(JSON.stringify(envelope), "utf8"),
    cipher.final(),
  ]);
  const tag = cipher.getAuthTag();
  return [TOKEN_VERSION, iv.toString("base64url"), ciphertext.toString("base64url"), tag.toString("base64url")].join(".");
}

export function openConversationStateToken(
  token: string | null | undefined,
  expectedSessionId: string,
  secret: string,
  now = Date.now(),
): ConversationStateTokenResult {
  const empty = emptyConversationState();
  if (!token) return { valid: false, reason: "missing", state: empty, turnIndex: 0 };

  try {
    const [version, ivRaw, ciphertextRaw, tagRaw, extra] = token.split(".");
    if (version !== TOKEN_VERSION || !ivRaw || !ciphertextRaw || !tagRaw || extra) {
      return { valid: false, reason: "invalid", state: empty, turnIndex: 0 };
    }
    const iv = Buffer.from(ivRaw, "base64url");
    const tag = Buffer.from(tagRaw, "base64url");
    if (iv.length !== 12 || tag.length !== 16) {
      return { valid: false, reason: "invalid", state: empty, turnIndex: 0 };
    }
    const decipher = createDecipheriv("aes-256-gcm", tokenKey(secret), iv);
    decipher.setAAD(TOKEN_AAD);
    decipher.setAuthTag(tag);
    const plaintext = Buffer.concat([
      decipher.update(Buffer.from(ciphertextRaw, "base64url")),
      decipher.final(),
    ]).toString("utf8");
    const envelope = JSON.parse(plaintext) as Partial<ConversationStateEnvelope>;
    const state = normalizeState(envelope.state);
    if (
      envelope.version !== 1 ||
      typeof envelope.sessionId !== "string" ||
      typeof envelope.expiresAt !== "number" ||
      !Number.isInteger(envelope.turnIndex) ||
      Number(envelope.turnIndex) < 0 ||
      !state
    ) {
      return { valid: false, reason: "invalid", state: empty, turnIndex: 0 };
    }
    if (envelope.sessionId !== expectedSessionId) {
      return { valid: false, reason: "session_mismatch", state: empty, turnIndex: 0 };
    }
    if (envelope.expiresAt <= now) {
      return { valid: false, reason: "expired", state: empty, turnIndex: 0 };
    }
    return { valid: true, state, turnIndex: Number(envelope.turnIndex) };
  } catch {
    return { valid: false, reason: "invalid", state: empty, turnIndex: 0 };
  }
}

export function withLastDeliveryContext(
  state: ConversationState,
  deliveredText: string,
): ConversationState {
  return {
    ...state,
    lastDeliveryContext: deliveredText.trim().slice(0, MAX_LAST_DELIVERY_LENGTH) || null,
  };
}
