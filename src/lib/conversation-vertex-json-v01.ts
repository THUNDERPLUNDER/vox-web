/* CONTRACT: Structured Vertex JSON helper for #384. Never logs prompts, answers, or model payloads. */

import { getGoogleAccessToken } from "./ces-auth.ts";

export const CONVERSATION_POLICY_MODEL = "gemini-2.5-flash";

export type ConversationVertexConfig = {
  projectId: string;
  location: string;
  serviceAccountJson: string;
};

function resolveVertexLocation(location: string): string {
  return location.trim().toLowerCase() === "eu" ? "europe-west1" : location.trim();
}

function vertexUrl(config: ConversationVertexConfig): string {
  const location = resolveVertexLocation(config.location);
  return `https://${location}-aiplatform.googleapis.com/v1/projects/${config.projectId}/locations/${location}/publishers/google/models/${CONVERSATION_POLICY_MODEL}:generateContent`;
}

function extractModelText(payload: Record<string, unknown>): string {
  const candidates = payload.candidates;
  if (!Array.isArray(candidates) || candidates.length === 0) return "";
  const content = (candidates[0] as Record<string, unknown>).content as Record<string, unknown> | undefined;
  const parts = content?.parts;
  if (!Array.isArray(parts)) return "";
  for (const part of parts) {
    if (part && typeof part === "object" && typeof (part as { text?: unknown }).text === "string") {
      return ((part as { text: string }).text || "").trim();
    }
  }
  return "";
}

export async function runConversationVertexJson(
  config: ConversationVertexConfig,
  prompt: string,
): Promise<unknown> {
  const accessToken = await getGoogleAccessToken(config.serviceAccountJson);
  const response = await fetch(vertexUrl(config), {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json; charset=utf-8",
    },
    body: JSON.stringify({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0,
        responseMimeType: "application/json",
      },
    }),
  });
  if (!response.ok) throw new Error(`conversation_vertex_failed:${response.status}`);
  const payload = (await response.json()) as Record<string, unknown>;
  const text = extractModelText(payload);
  if (!text) throw new Error("conversation_vertex_empty");
  try {
    return JSON.parse(text) as unknown;
  } catch {
    throw new Error("conversation_vertex_invalid_json");
  }
}
