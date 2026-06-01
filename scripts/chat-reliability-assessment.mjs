#!/usr/bin/env node
/* CONTRACT: Safe chat reliability probe — metadata only, no prompt/answer logging. */

import { createSign } from "node:crypto";
import { writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));

const DEFAULT_BASE = "https://vox.raddum.no";
/** Stay under production burst guard (10 / 10 min per IP). */
const DEFAULT_COUNT = 8;
const DEFAULT_DELAY_MS = 8_000;

/** Fixed prompts — used internally only; never written to output. */
const SEED_PROMPTS = [
  "Hvordan kobler jeg høreapparatet til mobilen?",
  "Hvorfor blir lyden så slitsom på restaurant?",
  "Hva gjør jeg når appen ikke finner høreapparatet?",
  "Hvordan vet jeg om jeg bør kontakte audiograf?",
  "Hva kan jeg prøve hvis lyden fra TV-en blir utydelig?",
];

const FREEFORM_PROMPTS = [
  "Hvorfor blir lyd fra høreapparat slitsom i støy?",
  "Hva kan jeg gjøre når musikk høres flatt med høreapparat?",
  "Hvordan justerer jeg volum mellom ulike situasjoner?",
  "Hvorfor hører jeg egen stemme annerledes med apparat?",
  "Hva betyr det når appen sier tilkobling tapt?",
  "Kan vind påvirke lydkvaliteten merkbart?",
  "Hvordan håndterer jeg ekko i store rom?",
  "Hva er normal tilvenningstid for nye innstillinger?",
  "Hvorfor blir tale uklar selv med apparat?",
  "Hvordan vet jeg om batteriet er lavt?",
  "Hva kan jeg prøve før jeg ringer audiograf?",
  "Hvorfor forsvinner lyden kort i telefonsamtaler?",
  "Hvordan reduserer jeg bakgrunnsstøy i kafé?",
  "Er det normalt at ørene føles tette første uke?",
  "Hva gjør jeg hvis bare ett apparat kobler til?",
];

function parseArgs(argv) {
  const args = {
    base: DEFAULT_BASE,
    count: DEFAULT_COUNT,
    out: "",
    direct: false,
    delayMs: DEFAULT_DELAY_MS,
    sessionPerRequest: true,
  };
  for (const arg of argv) {
    if (arg.startsWith("--base=")) args.base = arg.slice(7).replace(/\/$/, "");
    else if (arg.startsWith("--count=")) args.count = Number(arg.slice(8));
    else if (arg.startsWith("--out=")) args.out = arg.slice(6);
    else if (arg === "--direct") args.direct = true;
    else if (arg === "--shared-session") args.sessionPerRequest = false;
    else if (arg.startsWith("--delay-ms=")) args.delayMs = Number(arg.slice(11));
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

/** Classify outcome for reporting — no message content. */
function errorCategory(errorCode, httpStatus) {
  if (errorCode === "rate_limited" || httpStatus === 429) return "rate_limit";
  if (errorCode === "timeout" || httpStatus === 504) return "timeout";
  if (errorCode === "upstream" || errorCode === "empty_response") return "ces_upstream";
  if (
    errorCode === "invalid_message" ||
    errorCode === "invalid_session" ||
    errorCode === "invalid_json" ||
    errorCode === "forbidden_origin" ||
    errorCode === "message_too_long" ||
    errorCode === "configuration_missing" ||
    errorCode === "guard_unavailable" ||
    errorCode === "auth" ||
    errorCode === "internal_error"
  ) {
    return "app_error";
  }
  return "other";
}

function buildPlan(count) {
  const plan = [];
  for (let i = 0; i < count; i += 1) {
    const inputType = i % 3 === 0 ? "seed" : "freeform";
    const pool = inputType === "seed" ? SEED_PROMPTS : FREEFORM_PROMPTS;
    plan.push({ n: i + 1, inputType, message: pool[i % pool.length] });
  }
  return plan;
}

async function callProxy(base, sessionId, message) {
  const started = performance.now();
  const response = await fetch(`${base}/api/chat`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Origin: base,
      Referer: `${base}/no/chat/`,
    },
    body: JSON.stringify({ message, sessionId }),
  });
  const durationMs = Math.round(performance.now() - started);
  const payload = await response.json().catch(() => ({}));
  const errorCode = typeof payload.error === "string" ? payload.error : null;
  const hasText = typeof payload.text === "string" && payload.text.trim().length > 0;
  const category = hasText ? "success" : errorCategory(errorCode, response.status);
  return {
    httpStatus: response.status,
    errorCode,
    category,
    success: response.ok && hasText,
    durationMs,
    durationBucket: durationBucket(durationMs),
  };
}

function readCesEnv() {
  const keys = [
    "CES_PROJECT_ID",
    "CES_LOCATION",
    "CES_APP_ID",
    "CES_APP_VERSION_ID",
    "CES_DEPLOYMENT_ID",
    "GOOGLE_SERVICE_ACCOUNT_JSON",
  ];
  const env = Object.fromEntries(keys.map((k) => [k, (process.env[k] ?? "").trim()]));
  const missing = keys.filter((k) => !env[k]);
  return { env, missing };
}

function cesResourceBase(env) {
  return `projects/${env.CES_PROJECT_ID}/locations/${env.CES_LOCATION}/apps/${env.CES_APP_ID}`;
}

function buildRunSessionUrl(env, sessionId) {
  return `https://ces.googleapis.com/v1beta/${cesResourceBase(env)}/sessions/${encodeURIComponent(sessionId)}:runSession`;
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

async function callDirectCes(env, sessionId, message) {
  const started = performance.now();
  const token = await getGoogleAccessToken(env.GOOGLE_SERVICE_ACCOUNT_JSON);
  const base = cesResourceBase(env);
  const response = await fetch(buildRunSessionUrl(env, sessionId), {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json; charset=utf-8",
    },
    body: JSON.stringify({
      config: {
        session: `${base}/sessions/${sessionId}`,
        deployment: `${base}/deployments/${env.CES_DEPLOYMENT_ID}`,
      },
      inputs: [{ text: message }],
    }),
  });
  const durationMs = Math.round(performance.now() - started);
  let hasText = false;
  if (response.ok) {
    const payload = await response.json().catch(() => ({}));
    const outputs = Array.isArray(payload.outputs) ? payload.outputs : [];
    hasText = outputs.some((o) => typeof o?.text === "string" && o.text.trim());
  }
  return {
    cesHttpStatus: response.status,
    success: response.ok && hasText,
    durationMs,
    durationBucket: durationBucket(durationMs),
    category: hasText ? "success" : response.ok ? "ces_upstream" : "ces_upstream",
  };
}

function summarize(results) {
  const total = results.length;
  const byCategory = {
    success: 0,
    ces_upstream: 0,
    rate_limit: 0,
    timeout: 0,
    app_error: 0,
    other: 0,
  };
  for (const row of results) {
    byCategory[row.category] = (byCategory[row.category] ?? 0) + 1;
  }
  const buckets = {};
  for (const r of results) {
    buckets[r.durationBucket] = (buckets[r.durationBucket] ?? 0) + 1;
  }
  const success = byCategory.success;
  return {
    total,
    success,
    error: total - success,
    successRate: total ? Number(((success / total) * 100).toFixed(1)) : 0,
    byCategory,
    durationBuckets: buckets,
    guardNote:
      "Default 8 calls / 8s spacing stays under 10-per-10min burst. One /api/chat per row (server retry is internal).",
  };
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const sessionId = `viddel-rel-${Date.now().toString(36)}`;
  const plan = buildPlan(args.count);
  const results = [];

  console.log(
    `chat-reliability: ${args.count} calls, ${args.delayMs}ms spacing, sessionPerRequest=${args.sessionPerRequest}`,
  );

  for (const item of plan) {
    const requestSessionId = args.sessionPerRequest
      ? `viddel-rel-${Date.now().toString(36)}-${item.n}`
      : sessionId;
    const proxy = await callProxy(args.base, requestSessionId, item.message);
    const row = {
      request: item.n,
      inputType: item.inputType,
      channel: "proxy",
      httpStatus: proxy.httpStatus,
      errorCode: proxy.errorCode,
      category: proxy.category,
      finalSuccess: proxy.success,
      durationMs: proxy.durationMs,
      durationBucket: proxy.durationBucket,
    };

    if (args.direct) {
      const { env, missing } = readCesEnv();
      if (missing.length === 0) {
        try {
          const direct = await callDirectCes(env, `${requestSessionId}-direct`, item.message);
          row.direct = {
            cesHttpStatus: direct.cesHttpStatus,
            success: direct.success,
            durationBucket: direct.durationBucket,
            category: direct.category,
          };
        } catch (err) {
          row.direct = { error: String(err.message ?? err).slice(0, 40), category: "app_error" };
        }
      } else {
        row.direct = { skipped: true, missingKeys: missing.length, category: "other" };
      }
    }

    results.push(row);
    process.stdout.write(
      `#${row.request} ${row.inputType} ${row.category} http=${row.httpStatus} code=${row.errorCode ?? "none"} ${row.durationBucket}\n`,
    );
    if (args.delayMs > 0 && item.n < plan.length) {
      await new Promise((r) => setTimeout(r, args.delayMs));
    }
  }

  const summary = summarize(results);
  const cesEnv = readCesEnv();
  const report = {
    generatedAt: new Date().toISOString(),
    base: args.base,
    config: {
      count: args.count,
      delayMs: args.delayMs,
      sessionPerRequest: args.sessionPerRequest,
    },
    sessionIdPrefix: sessionId.slice(0, 16),
    directEnvAvailable: cesEnv.missing.length === 0,
    summary,
    results,
  };

  const outPath =
    args.out ||
    join(__dirname, "..", "tmp", "chat-reliability", `run-${new Date().toISOString().replace(/[:.]/g, "-")}.json`);
  mkdirSync(dirname(outPath), { recursive: true });
  writeFileSync(outPath, `${JSON.stringify(report, null, 2)}\n`, "utf8");
  console.log("\n--- summary ---");
  console.log(JSON.stringify(summary, null, 2));
  console.log(`\nWrote ${outPath}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
