#!/usr/bin/env node
/* CONTRACT: Safe Agent Search direct API probe — metadata only, no prompt/answer logging. */

import { createSign } from "node:crypto";
import { readFileSync, existsSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));

const DEFAULT_COUNT = 5;
const DEFAULT_DELAY_MS = 8_000;
const COLLECTION = "default_collection";
const ANSWER_SERVING = "default_serving_config";

/** Fixed prompts — internal only; never written to output. */
const SEED_PROMPTS = [
  "Hvordan kobler jeg høreapparatet til mobilen?",
  "Hvorfor blir lyden så slitsom på restaurant?",
  "Hva gjør jeg når appen ikke finner høreapparatet?",
  "Hvordan vet jeg om jeg bør kontakte audiograf?",
  "Hva kan jeg prøve hvis lyden fra TV-en blir utydelig?",
];

function loadEnvFile(path) {
  if (!existsSync(path)) return {};
  const env = {};
  for (const line of readFileSync(path, "utf8").split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq);
    let val = trimmed.slice(eq + 1);
    if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
      val = val.slice(1, -1);
    }
    env[key] = val;
  }
  return env;
}

function parseArgs(argv) {
  const args = {
    count: DEFAULT_COUNT,
    delayMs: DEFAULT_DELAY_MS,
    out: "",
    envFile: "",
    location: "",
    engineId: "",
  };
  for (const arg of argv) {
    if (arg.startsWith("--count=")) args.count = Number(arg.slice(8));
    else if (arg.startsWith("--delay-ms=")) args.delayMs = Number(arg.slice(11));
    else if (arg.startsWith("--out=")) args.out = arg.slice(6);
    else if (arg.startsWith("--env-file=")) args.envFile = arg.slice(11);
    else if (arg.startsWith("--location=")) args.location = arg.slice(11);
    else if (arg.startsWith("--engine-id=")) args.engineId = arg.slice(12);
  }
  return args;
}

function durationBucket(ms) {
  if (ms < 1000) return "<1s";
  if (ms < 3000) return "1-3s";
  if (ms < 8000) return "3-8s";
  if (ms < 20000) return "8-20s";
  return ">20s";
}

function discoveryHost(location) {
  const loc = String(location ?? "").trim().toLowerCase();
  if (loc === "eu") return "https://eu-discoveryengine.googleapis.com";
  if (loc === "us") return "https://us-discoveryengine.googleapis.com";
  return "https://discoveryengine.googleapis.com";
}

function readProbeEnv(fileEnv) {
  const merged = { ...fileEnv };
  for (const key of [
    "CES_PROJECT_ID",
    "CES_LOCATION",
    "CES_APP_ID",
    "GOOGLE_SERVICE_ACCOUNT_JSON",
    "AGENT_SEARCH_ENGINE_ID",
    "AGENT_SEARCH_LOCATION",
  ]) {
    if (process.env[key]?.trim()) merged[key] = process.env[key].trim();
  }
  const projectId = merged.CES_PROJECT_ID?.trim() ?? "";
  const location = (merged.AGENT_SEARCH_LOCATION ?? merged.CES_LOCATION ?? "").trim();
  const engineId = (merged.AGENT_SEARCH_ENGINE_ID ?? merged.CES_APP_ID ?? "").trim();
  const saJson = merged.GOOGLE_SERVICE_ACCOUNT_JSON?.trim() ?? "";
  const missing = [];
  if (!projectId) missing.push("CES_PROJECT_ID");
  if (!location) missing.push("CES_LOCATION or AGENT_SEARCH_LOCATION");
  if (!engineId) missing.push("CES_APP_ID or AGENT_SEARCH_ENGINE_ID");
  if (!saJson) missing.push("GOOGLE_SERVICE_ACCOUNT_JSON");
  return { projectId, location, engineId, saJson, missing };
}

async function getGoogleAccessToken(serviceAccountJson) {
  const parsed = JSON.parse(serviceAccountJson);
  const now = Math.floor(Date.now() / 1000);
  const header = Buffer.from(JSON.stringify({ alg: "RS256", typ: "JWT" })).toString("base64url");
  const payload = Buffer.from(
    JSON.stringify({
      iss: parsed.client_email,
      sub: parsed.client_email,
      aud: "https://oauth2.googleapis.com/token",
      iat: now,
      exp: now + 3600,
      scope: "https://www.googleapis.com/auth/cloud-platform",
    }),
  ).toString("base64url");
  const signInput = `${header}.${payload}`;
  const signer = createSign("RSA-SHA256");
  signer.update(signInput);
  signer.end();
  const signature = signer.sign(parsed.private_key, "base64url");
  const assertion = `${signInput}.${signature}`;

  const response = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion,
    }),
  });
  if (!response.ok) throw new Error(`auth_${response.status}`);
  const body = await response.json();
  if (!body.access_token) throw new Error("auth_no_token");
  return body.access_token;
}

function buildAnswerUrl(host, projectId, location, engineId) {
  const resource = `projects/${projectId}/locations/${location}/collections/${COLLECTION}/engines/${engineId}/servingConfigs/${ANSWER_SERVING}`;
  return `${host}/v1/${resource}:answer`;
}

function countCitations(payload) {
  const answer = payload?.answer ?? payload;
  const chunks =
    answer?.groundingMetadata?.groundingChunks ??
    answer?.groundingAttributions ??
    answer?.citations ??
    [];
  return Array.isArray(chunks) ? chunks.length : 0;
}

function extractSupportScore(payload) {
  const answer = payload?.answer ?? payload;
  const candidates = [
    answer?.groundingMetadata?.supportScore,
    answer?.groundingMetadata?.retrievalScore,
    answer?.supportScore,
  ];
  for (const v of candidates) {
    if (typeof v === "number" && Number.isFinite(v)) return v;
  }
  return null;
}

function extractResponseState(payload) {
  const answer = payload?.answer ?? payload;
  const state = answer?.state ?? answer?.answerState ?? null;
  return typeof state === "string" ? state : null;
}

function hasAnswerText(payload) {
  const answer = payload?.answer ?? payload;
  const text = answer?.answerText ?? answer?.text ?? "";
  return typeof text === "string" && text.trim().length > 0;
}

async function callAgentSearchAnswer({ host, projectId, location, engineId, token, message }) {
  const started = performance.now();
  const url = buildAnswerUrl(host, projectId, location, engineId);
  const response = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json; charset=utf-8",
    },
    body: JSON.stringify({
      query: { text: message },
      session: "-",
      groundingSpec: { includeGroundingSupports: true },
      answerGenerationSpec: {
        ignoreAdversarialQuery: true,
        ignoreNonAnswerSeekingQuery: false,
      },
    }),
  });
  const durationMs = Math.round(performance.now() - started);
  let payload = {};
  if (response.ok) {
    payload = await response.json().catch(() => ({}));
  } else {
    const errText = await response.text().catch(() => "");
    const codeMatch = errText.match(/"code"\s*:\s*(\d+)/);
    payload = { _errorSnippet: errText.slice(0, 200) };
    if (codeMatch) payload._parsedCode = Number(codeMatch[1]);
  }

  const ok = response.ok && hasAnswerText(payload);
  return {
    status: ok ? "success" : "error",
    error_code: ok ? null : response.ok ? "empty_response" : "upstream",
    upstream_http_status: response.status,
    duration_ms: durationMs,
    duration_bucket: durationBucket(durationMs),
    response_state: extractResponseState(payload),
    has_answer: hasAnswerText(payload),
    has_citations: countCitations(payload) > 0,
    citation_count: countCitations(payload),
    support_score: extractSupportScore(payload),
  };
}

function summarize(results) {
  const total = results.length;
  const success = results.filter((r) => r.status === "success").length;
  const upstream = results.filter((r) => r.error_code === "upstream").length;
  const empty = results.filter((r) => r.error_code === "empty_response").length;
  return {
    total,
    success,
    upstream,
    empty_response: empty,
    success_rate_pct: total ? Math.round((success / total) * 100) : 0,
    with_citations: results.filter((r) => r.has_citations).length,
  };
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const fileEnv = args.envFile ? loadEnvFile(args.envFile) : {};
  const env = readProbeEnv(fileEnv);
  if (args.location) env.location = args.location;
  if (args.engineId) env.engineId = args.engineId;

  if (env.missing.length) {
    console.error(
      JSON.stringify({
        ok: false,
        reason: "missing_env",
        missing: env.missing,
        hint: "Use --env-file=.env.local or set CES_* + GOOGLE_SERVICE_ACCOUNT_JSON",
      }),
    );
    process.exit(2);
  }

  const host = discoveryHost(env.location);
  const token = await getGoogleAccessToken(env.saJson);
  const results = [];

  for (let i = 0; i < args.count; i += 1) {
    const message = SEED_PROMPTS[i % SEED_PROMPTS.length];
    const row = await callAgentSearchAnswer({
      host,
      projectId: env.projectId,
      location: env.location,
      engineId: env.engineId,
      token,
      message,
    });
    results.push({ n: i + 1, ...row });
    console.log(JSON.stringify({ event: "probe_call", n: i + 1, ...row }));
    if (i < args.count - 1 && args.delayMs > 0) {
      await new Promise((r) => setTimeout(r, args.delayMs));
    }
  }

  const report = {
    ok: true,
    api: "discoveryengine.servingConfigs.answer",
    host,
    project_id: env.projectId,
    location: env.location,
    engine_id: env.engineId,
    serving_config: ANSWER_SERVING,
    count: args.count,
    delay_ms: args.delayMs,
    summary: summarize(results),
    results,
    note: "No prompts or answer text logged. Compare with CES runSession reliability series.",
  };

  if (args.out) {
    mkdirSync(dirname(args.out), { recursive: true });
    writeFileSync(args.out, `${JSON.stringify(report, null, 2)}\n`);
  }
  console.log(JSON.stringify({ event: "probe_summary", ...report.summary }));
}

main().catch((err) => {
  console.error(JSON.stringify({ ok: false, reason: "probe_failed", message: String(err?.message ?? err) }));
  process.exit(1);
});
