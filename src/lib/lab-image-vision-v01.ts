/* CONTRACT: Shared POST handler for /api/lab/image-vision — equipment photo → Vertex JSON. No storage. */
import { buildImageQaWarnings } from "./image-qa-warnings.ts";
import {
  analyzeEquipmentImage,
  resolveImageVisionProbeConfig,
  type ImageVisionScenario,
} from "./image-vision-bridge-v01.ts";
import { hasValidLabSession, isLabRouteAvailable } from "./lab-auth-v01.ts";

const MAX_IMAGE_BYTES = 5 * 1024 * 1024;
const ALLOWED_MIME = new Set(["image/jpeg", "image/png", "image/webp", "image/bmp"]);
const SCENARIOS = new Set(["A", "B", "C", "D", "E"]);

type RequestBody = {
  imageBase64?: unknown;
  mimeType?: unknown;
  userProblem?: unknown;
  scenario?: unknown;
};

function json(body: Record<string, unknown>, status: number): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json; charset=utf-8" },
  });
}

function estimateBase64Bytes(base64: string): number {
  const padding = base64.endsWith("==") ? 2 : base64.endsWith("=") ? 1 : 0;
  return Math.floor((base64.length * 3) / 4) - padding;
}

/** Lab-gated image vision POST — requires valid Lab session cookie. */
export async function handleLabImageVisionPost(request: Request): Promise<Response> {
  if (!isLabRouteAvailable()) {
    return json({ error: "not_available", message: "Lab image QA is not available." }, 404);
  }

  if (!hasValidLabSession(request)) {
    return json({ error: "unauthorized", message: "Lab login required." }, 401);
  }

  let body: RequestBody;
  try {
    body = (await request.json()) as RequestBody;
  } catch {
    return json({ error: "invalid_json" }, 400);
  }

  const imageBase64 = typeof body.imageBase64 === "string" ? body.imageBase64.trim() : "";
  const mimeType = typeof body.mimeType === "string" ? body.mimeType.trim().toLowerCase() : "";
  const userProblem = typeof body.userProblem === "string" ? body.userProblem.trim() : "";
  const scenarioRaw = typeof body.scenario === "string" ? body.scenario.trim().toUpperCase() : "";
  const scenario = SCENARIOS.has(scenarioRaw) ? (scenarioRaw as ImageVisionScenario) : undefined;

  if (!imageBase64 || !mimeType) {
    return json({ error: "missing_image", message: "imageBase64 and mimeType are required." }, 400);
  }

  if (!ALLOWED_MIME.has(mimeType)) {
    return json({ error: "unsupported_mime", message: "Use JPEG, PNG, WebP, or BMP." }, 400);
  }

  if (estimateBase64Bytes(imageBase64) > MAX_IMAGE_BYTES) {
    return json({ error: "image_too_large", message: "Max image size is 5 MB." }, 400);
  }

  const env = resolveImageVisionProbeConfig();
  if (!env.ok) {
    return json(
      {
        error: "configuration_missing",
        message: "Missing Vertex/CES env for vision probe.",
        missing: env.missing,
      },
      503,
    );
  }

  try {
    const visionScenario =
      scenario && ["A", "B", "C", "D", "E"].includes(scenario) ? scenario : undefined;
    const { result, model, durationMs } = await analyzeEquipmentImage(env.config, {
      imageBase64,
      mimeType,
      userProblem: userProblem || undefined,
      scenario: visionScenario,
    });

    const warnings = buildImageQaWarnings(result, scenario);

    return json(
      {
        ok: true,
        probeVersion: "v0.1",
        model,
        durationMs,
        scenario: scenario ?? null,
        vision: result,
        warnings,
      },
      200,
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "vision_failed";
    return json({ error: "vision_failed", message }, 502);
  }
}
