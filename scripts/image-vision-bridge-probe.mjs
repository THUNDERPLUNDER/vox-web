#!/usr/bin/env node
/* CONTRACT: Dev-only hybrid image vision bridge probe — INT-009. Not wired to production /no/chat. */

import { readFileSync } from "node:fs";
import { extname, resolve } from "node:path";
import {
  analyzeEquipmentImage,
  buildChatProbePayload,
  resolveImageVisionProbeConfig,
} from "../src/lib/image-vision-bridge-v01.ts";

const MIME_BY_EXT = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
  ".bmp": "image/bmp",
};

function parseArgs(argv) {
  const args = {
    image: "",
    userProblem: "",
    scenario: "",
    callChatUrl: "",
    sessionId: "probe-vision-bridge-v01",
    dryRun: false,
  };
  for (let i = 2; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === "--dry-run") args.dryRun = true;
    else if (arg.startsWith("--image=")) args.image = arg.slice("--image=".length);
    else if (arg.startsWith("--user-problem=")) args.userProblem = arg.slice("--user-problem=".length);
    else if (arg.startsWith("--scenario=")) args.scenario = arg.slice("--scenario=".length).toUpperCase();
    else if (arg.startsWith("--call-chat-url=")) args.callChatUrl = arg.slice("--call-chat-url=".length);
    else if (arg.startsWith("--session-id=")) args.sessionId = arg.slice("--session-id=".length);
    else if (arg === "--help" || arg === "-h") {
      printHelp();
      process.exit(0);
    }
  }
  return args;
}

function printHelp() {
  console.log(`Usage: npm run image:vision-probe -- --image=PATH [options]

Dev-only probe: equipment photo → structured JSON → optional local /api/chat.

Options:
  --image=PATH           Local image file (JPEG/PNG/WebP/BMP). Not stored by script.
  --user-problem=TEXT    Optional user problem description
  --scenario=A|B|C       A=charger/LED, B=dome/filter, C=app/phone
  --call-chat-url=URL    Optional POST rag_query_text to /api/chat (e.g. http://localhost:4321/api/chat)
  --session-id=ID        Session for --call-chat-url (default probe-vision-bridge-v01)
  --dry-run              Validate env and args without calling Vertex

Required env: CES_PROJECT_ID, GOOGLE_SERVICE_ACCOUNT_JSON, CES_LOCATION or IMAGE_VISION_PROBE_LOCATION
Optional env: IMAGE_VISION_PROBE_MODEL (default gemini-2.5-flash)
`);
}

function mimeForPath(filePath) {
  const ext = extname(filePath).toLowerCase();
  return MIME_BY_EXT[ext] || "";
}

async function maybeCallChat(url, payload) {
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const body = await response.json().catch(() => ({}));
  return {
    httpStatus: response.status,
    ok: response.ok,
    error: typeof body.error === "string" ? body.error : null,
    textLength: typeof body.text === "string" ? body.text.length : 0,
    hasCitations: body.text ? undefined : undefined,
  };
}

async function main() {
  const args = parseArgs(process.argv);

  if (!args.image) {
    console.error("Missing --image=PATH");
    printHelp();
    process.exit(1);
  }

  const imagePath = resolve(args.image);
  const mimeType = mimeForPath(imagePath);
  if (!mimeType) {
    console.error("Unsupported image extension. Use JPEG, PNG, WebP, or BMP.");
    process.exit(1);
  }

  const env = resolveImageVisionProbeConfig();
  if (!env.ok) {
    console.error("Missing env:", env.missing.join(", "));
    process.exit(1);
  }

  if (args.dryRun) {
    console.log(
      JSON.stringify(
        {
          ok: true,
          dryRun: true,
          imagePath,
          mimeType,
          projectId: env.config.projectId,
          location: env.config.location,
          model: env.config.model,
          scenario: args.scenario || null,
        },
        null,
        2,
      ),
    );
    process.exit(0);
  }

  const imageBase64 = readFileSync(imagePath).toString("base64");
  const scenario = ["A", "B", "C"].includes(args.scenario) ? args.scenario : undefined;

  const { result, model, durationMs } = await analyzeEquipmentImage(env.config, {
    imageBase64,
    mimeType,
    userProblem: args.userProblem,
    scenario,
  });

  const output = {
    probeVersion: "v0.1",
    model,
    durationMs,
    scenario: scenario || null,
    vision: result,
    chatProbe: buildChatProbePayload(result.rag_query_text, args.sessionId),
  };

  if (args.callChatUrl && result.rag_query_text) {
    const chatMeta = await maybeCallChat(args.callChatUrl, output.chatProbe);
    output.chatResult = {
      httpStatus: chatMeta.httpStatus,
      ok: chatMeta.ok,
      error: chatMeta.error,
      answerTextLength: chatMeta.textLength,
    };
  }

  console.log(JSON.stringify(output, null, 2));
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
});
