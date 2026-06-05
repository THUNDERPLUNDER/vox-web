/* CONTRACT: Dev-only equipment image → structured JSON for hybrid vision→RAG bridge (INT-009). Not used in production /api/chat. */

import { getGoogleAccessToken } from "./ces-auth.ts";

export const IMAGE_VISION_BRIDGE_VERSION = "v0.1";

/** Structured output from vision pre-step — fed as text into Agent Search :answer via rag_query_text. */
export type ImageVisionBridgeResult = {
  visible_device_type: string;
  possible_brand: string;
  visible_component: string;
  visible_status_light: string;
  readable_text: string;
  confidence: "low" | "medium" | "high";
  likely_user_problem: string;
  suggested_followup_questions: string[];
  safety_notes: string[];
  rag_query_text: string;
};

export type ImageVisionProbeConfig = {
  projectId: string;
  location: string;
  model: string;
  serviceAccountJson: string;
};

export type ImageVisionAnalyzeInput = {
  imageBase64: string;
  mimeType: string;
  userProblem?: string;
  scenario?: "A" | "B" | "C";
};

const RESULT_KEYS: (keyof ImageVisionBridgeResult)[] = [
  "visible_device_type",
  "possible_brand",
  "visible_component",
  "visible_status_light",
  "readable_text",
  "confidence",
  "likely_user_problem",
  "suggested_followup_questions",
  "safety_notes",
  "rag_query_text",
];

const SCENARIO_HINTS: Record<"A" | "B" | "C", string> = {
  A: "Scenario A: charging case / status light — user may not know what the LED means.",
  B: "Scenario B: dome/filter when sound is weak or missing — check wax filter / dome condition.",
  C: "Scenario C: phone/handsfree — hearing aid or app screen showing Bluetooth/connection state.",
};

export function emptyImageVisionBridgeResult(): ImageVisionBridgeResult {
  return {
    visible_device_type: "",
    possible_brand: "",
    visible_component: "",
    visible_status_light: "",
    readable_text: "",
    confidence: "low",
    likely_user_problem: "",
    suggested_followup_questions: [],
    safety_notes: [],
    rag_query_text: "",
  };
}

function readEnv(name: string): string {
  const fromProcess = (process.env[name] ?? "").trim();
  if (fromProcess) return fromProcess;
  return (import.meta.env?.[name] ?? "").trim();
}

export function resolveImageVisionProbeConfig(): { ok: true; config: ImageVisionProbeConfig } | { ok: false; missing: string[] } {
  const projectId = readEnv("CES_PROJECT_ID");
  const location =
    readEnv("IMAGE_VISION_PROBE_LOCATION") || readEnv("AGENT_SEARCH_LOCATION") || readEnv("CES_LOCATION");
  const serviceAccountJson = readEnv("GOOGLE_SERVICE_ACCOUNT_JSON");
  const model = readEnv("IMAGE_VISION_PROBE_MODEL") || "gemini-2.0-flash-001";

  const missing: string[] = [];
  if (!projectId) missing.push("CES_PROJECT_ID");
  if (!location) missing.push("IMAGE_VISION_PROBE_LOCATION (or AGENT_SEARCH_LOCATION / CES_LOCATION)");
  if (!serviceAccountJson) missing.push("GOOGLE_SERVICE_ACCOUNT_JSON");

  if (missing.length > 0) return { ok: false, missing };
  return { ok: true, config: { projectId, location, model, serviceAccountJson } };
}

function buildVisionPrompt(input: ImageVisionAnalyzeInput): string {
  const lines = [
    "Du analyserer ETT bilde av høreapparat-UTSTYR for feilsøking i Viddel Lab (dev probe).",
    "Kun utstyr: høreapparat, ladeboks/ladeetui, dome/filter, statuslys, appskjerm med høreapparat-innstillinger.",
    "IKKE analyser øre, hud, kropp, ansikt eller medisinske forhold.",
    "Hvis bildet viser kropp/øre/hud: sett confidence=low, safety_notes med avvisning, og rag_query_text som ber brukeren ta nytt bilde av utstyr alene.",
    "Svar KUN med ett JSON-objekt (ingen markdown) med nøyaktig disse feltene:",
    JSON.stringify(Object.fromEntries(RESULT_KEYS.map((k) => [k, k.includes("questions") || k.includes("notes") ? [] : ""])), null, 0),
    "confidence må være low, medium eller high.",
    "rag_query_text: norsk, kort, klar tekstspørring til RAG/manualer (inkluder merke/modell hvis synlig, hva brukeren ser, og hva de trenger hjelp med).",
    "safety_notes: praktisk utstyrshjelp — ikke medisinsk vurdering.",
  ];
  if (input.scenario && SCENARIO_HINTS[input.scenario]) {
    lines.push(SCENARIO_HINTS[input.scenario]);
  }
  if (input.userProblem?.trim()) {
    lines.push(`Brukerens problem (tekst): ${input.userProblem.trim()}`);
  }
  return lines.join("\n");
}

function vertexGenerateContentUrl(config: ImageVisionProbeConfig): string {
  const host = `https://${config.location}-aiplatform.googleapis.com`;
  return `${host}/v1/projects/${config.projectId}/locations/${config.location}/publishers/google/models/${config.model}:generateContent`;
}

function asString(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function asStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value.map((item) => (typeof item === "string" ? item.trim() : "")).filter(Boolean);
}

function normalizeConfidence(value: unknown): ImageVisionBridgeResult["confidence"] {
  const raw = asString(value).toLowerCase();
  if (raw === "medium" || raw === "high") return raw;
  return "low";
}

/** Parse and validate model JSON output. */
export function parseImageVisionBridgeResult(raw: unknown): ImageVisionBridgeResult {
  const base = emptyImageVisionBridgeResult();
  if (!raw || typeof raw !== "object") return base;
  const obj = raw as Record<string, unknown>;
  return {
    visible_device_type: asString(obj.visible_device_type),
    possible_brand: asString(obj.possible_brand),
    visible_component: asString(obj.visible_component),
    visible_status_light: asString(obj.visible_status_light),
    readable_text: asString(obj.readable_text),
    confidence: normalizeConfidence(obj.confidence),
    likely_user_problem: asString(obj.likely_user_problem),
    suggested_followup_questions: asStringArray(obj.suggested_followup_questions),
    safety_notes: asStringArray(obj.safety_notes),
    rag_query_text: asString(obj.rag_query_text),
  };
}

function extractModelText(payload: Record<string, unknown>): string {
  const candidates = payload.candidates;
  if (!Array.isArray(candidates) || candidates.length === 0) return "";
  const first = candidates[0] as Record<string, unknown>;
  const content = first.content as Record<string, unknown> | undefined;
  const parts = content?.parts;
  if (!Array.isArray(parts)) return "";
  for (const part of parts) {
    if (part && typeof part === "object" && typeof (part as { text?: string }).text === "string") {
      return ((part as { text: string }).text || "").trim();
    }
  }
  return "";
}

/** Call Vertex Gemini generateContent with inline image — dev probe only; never log image bytes. */
export async function analyzeEquipmentImage(
  config: ImageVisionProbeConfig,
  input: ImageVisionAnalyzeInput,
): Promise<{ result: ImageVisionBridgeResult; model: string; durationMs: number }> {
  const started = performance.now();
  const accessToken = await getGoogleAccessToken(config.serviceAccountJson);
  const prompt = buildVisionPrompt(input);

  const response = await fetch(vertexGenerateContentUrl(config), {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json; charset=utf-8",
    },
    body: JSON.stringify({
      contents: [
        {
          role: "user",
          parts: [
            { text: prompt },
            {
              inlineData: {
                mimeType: input.mimeType,
                data: input.imageBase64,
              },
            },
          ],
        },
      ],
      generationConfig: {
        temperature: 0.2,
        responseMimeType: "application/json",
      },
    }),
  });

  const responseText = await response.text().catch(() => "");

  if (!response.ok) {
    const hint = responseText.slice(0, 200);
    throw new Error(`vertex_generate_content_failed:${response.status}:${hint}`);
  }

  let payload: Record<string, unknown> = {};
  try {
    payload = JSON.parse(responseText) as Record<string, unknown>;
  } catch {
    throw new Error("vertex_response_invalid_json");
  }

  const modelText = extractModelText(payload);
  if (!modelText) {
    throw new Error("vertex_empty_model_text");
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(modelText);
  } catch {
    throw new Error("vision_result_not_json");
  }

  const durationMs = Math.round(performance.now() - started);
  return {
    result: parseImageVisionBridgeResult(parsed),
    model: config.model,
    durationMs,
  };
}

/** Shape for optional POST /api/chat after vision step. */
export function buildChatProbePayload(ragQueryText: string, sessionId = "probe-vision-bridge-v01"): {
  message: string;
  sessionId: string;
} {
  return {
    message: ragQueryText.trim(),
    sessionId,
  };
}
