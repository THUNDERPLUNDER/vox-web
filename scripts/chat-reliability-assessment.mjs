#!/usr/bin/env node
/* CONTRACT: Safe chat reliability probe — metadata only, no prompt/answer logging. */

import { createSign } from "node:crypto";
import { writeFileSync, mkdirSync, readFileSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));

const OPS_TEST_HEADER = "x-viddel-ops-test-token";
const DEFAULT_BASE = "https://vox.raddum.no";
const DEFAULT_PREVIEW_BASE =
  "https://vox-web-git-main-raddum-5965s-projects.vercel.app";
/** Default spacing — production limits are server-side (VIDDEL_CHAT_* in Vercel). */
const DEFAULT_COUNT = 8;
const DEFAULT_DELAY_MS = 8_000;
const OPS_META_BACKEND = "x-viddel-ops-meta-backend-mode";
const OPS_META_ERROR = "x-viddel-ops-meta-error-code";
const OPS_META_UPSTREAM = "x-viddel-ops-meta-upstream-http-status";
const OPS_META_DURATION = "x-viddel-ops-meta-duration-bucket";
const OPS_META_RETRY = "x-viddel-ops-meta-retry-used";
const OPS_META_ATTEMPTS = "x-viddel-ops-meta-attempt-count";
const OPS_META_CITATIONS = "x-viddel-ops-meta-has-citations";
const DEFAULT_BURST_LIMIT = 10;
const DEFAULT_DAILY_LIMIT = 50;

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
    base: DEFAULT_BASE,
    count: DEFAULT_COUNT,
    out: "",
    direct: false,
    delayMs: DEFAULT_DELAY_MS,
    sessionPerRequest: true,
    envFile: "",
    expectBackend: "",
    label: "",
  };
  for (const arg of argv) {
    if (arg.startsWith("--base=")) args.base = arg.slice(7).replace(/\/$/, "");
    else if (arg === "--preview") args.base = DEFAULT_PREVIEW_BASE;
    else if (arg.startsWith("--count=")) args.count = Number(arg.slice(8));
    else if (arg.startsWith("--out=")) args.out = arg.slice(6);
    else if (arg === "--direct") args.direct = true;
    else if (arg === "--shared-session") args.sessionPerRequest = false;
    else if (arg.startsWith("--delay-ms=")) args.delayMs = Number(arg.slice(11));
    else if (arg.startsWith("--env-file=")) args.envFile = arg.slice(11);
    else if (arg.startsWith("--expect-backend=")) args.expectBackend = arg.slice(17).trim();
    else if (arg.startsWith("--label=")) args.label = arg.slice(8).trim();
  }
  return args;
}

function parsePositiveInt(raw, fallback) {
  const trimmed = String(raw ?? "").trim();
  if (!trimmed) return fallback;
  const n = Number.parseInt(trimmed, 10);
  if (!Number.isFinite(n) || n < 1) return fallback;
  return n;
}

/** Server limits live in Vercel — script only reports defaults + optional local hints. */
function buildPublicLimitContext(fileEnv) {
  const burstRaw = process.env.VIDDEL_CHAT_BURST_LIMIT ?? fileEnv.VIDDEL_CHAT_BURST_LIMIT ?? "";
  const dailyRaw = process.env.VIDDEL_CHAT_DAILY_LIMIT ?? fileEnv.VIDDEL_CHAT_DAILY_LIMIT ?? "";
  const burstLimit = parsePositiveInt(burstRaw, DEFAULT_BURST_LIMIT);
  const dailyLimit = parsePositiveInt(dailyRaw, DEFAULT_DAILY_LIMIT);
  return {
    serverControlled: true,
    envVars: ["VIDDEL_CHAT_BURST_LIMIT", "VIDDEL_CHAT_DAILY_LIMIT"],
    defaults: { burst: DEFAULT_BURST_LIMIT, daily: DEFAULT_DAILY_LIMIT, burstWindow: "10 m", dailyWindow: "24 h" },
    localHints: {
      burstConfigured: Boolean(String(burstRaw).trim()),
      dailyConfigured: Boolean(String(dailyRaw).trim()),
      burstLimit,
      dailyLimit,
    },
    prePilotSuggestion: "Set 100 / 500 in Vercel Production, redeploy, then run this script.",
    note: "Production limits apply on server after redeploy — local env hints do not change production.",
  };
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
  if (errorCode === "upstream" || errorCode === "empty_response") return "upstream";
  if (httpStatus === 401 && !errorCode) return "deployment_protection";
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

function checkResponseContract(payload) {
  if (typeof payload.text !== "string" || !payload.text.trim()) return false;
  if (typeof payload.turnCompleted !== "boolean") return false;
  if (typeof payload.turnIndex !== "number" || !Number.isFinite(payload.turnIndex)) return false;
  const extra = Object.keys(payload).filter((k) => !["text", "turnCompleted", "turnIndex"].includes(k));
  return extra.length === 0;
}

function readOpsHeader(response, name) {
  return response.headers.get(name)?.trim() ?? null;
}

async function callProxy(base, sessionId, message, opsToken, protectionBypass) {
  const started = performance.now();
  const headers = {
    "Content-Type": "application/json",
    Origin: base,
    Referer: `${base}/no/chat/`,
  };
  if (opsToken) {
    headers[OPS_TEST_HEADER] = opsToken;
  }
  if (protectionBypass) {
    headers["x-vercel-protection-bypass"] = protectionBypass;
  }
  const response = await fetch(`${base}/api/chat`, {
    method: "POST",
    headers,
    body: JSON.stringify({ message, sessionId }),
  });
  const durationMs = Math.round(performance.now() - started);
  const contentType = response.headers.get("content-type") ?? "";
  const payload =
    contentType.includes("application/json") ? await response.json().catch(() => ({})) : {};
  const deploymentBlocked =
    response.status === 401 && !contentType.includes("application/json");
  const errorCode = deploymentBlocked
    ? "deployment_protection"
    : typeof payload.error === "string"
      ? payload.error
      : null;
  const hasText = typeof payload.text === "string" && payload.text.trim().length > 0;
  const responseContractOk = hasText && checkResponseContract(payload);
  const category = deploymentBlocked
    ? "deployment_protection"
    : hasText
      ? "success"
      : errorCategory(errorCode, response.status);
  const serverDuration = readOpsHeader(response, OPS_META_DURATION);
  const backendMode = readOpsHeader(response, OPS_META_BACKEND);
  return {
    httpStatus: response.status,
    errorCode,
    category,
    success: response.ok && hasText,
    durationMs,
    durationBucket: serverDuration ?? durationBucket(durationMs),
    backendMode,
    upstreamHttpStatus: readOpsHeader(response, OPS_META_UPSTREAM),
    retryUsed: readOpsHeader(response, OPS_META_RETRY) === "1",
    attemptCount: Number.parseInt(readOpsHeader(response, OPS_META_ATTEMPTS) ?? "1", 10) || 1,
    hasCitations: readOpsHeader(response, OPS_META_CITATIONS) === "1",
    responseContractOk,
    deploymentBlocked,
    opsMetaErrorCode: readOpsHeader(response, OPS_META_ERROR),
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

function summarize(results, opsConfig, publicLimitContext, expectBackend) {
  const total = results.length;
  const byCategory = {
    success: 0,
    upstream: 0,
    ces_upstream: 0,
    rate_limit: 0,
    timeout: 0,
    app_error: 0,
    deployment_protection: 0,
    other: 0,
  };
  let beforeRateLimitTotal = 0;
  let beforeRateLimitSuccess = 0;
  for (const row of results) {
    const key = row.category === "ces_upstream" ? "upstream" : row.category;
    byCategory[key] = (byCategory[key] ?? 0) + 1;
  }
  for (const row of results) {
    if (row.category === "rate_limit") break;
    beforeRateLimitTotal += 1;
    if (row.finalSuccess) beforeRateLimitSuccess += 1;
  }
  const buckets = {};
  for (const r of results) {
    buckets[r.durationBucket] = (buckets[r.durationBucket] ?? 0) + 1;
  }
  const success = byCategory.success;
  const backendModeCounts = {};
  let contractOk = 0;
  let backendMismatch = 0;
  for (const r of results) {
    if (r.backendMode) {
      backendModeCounts[r.backendMode] = (backendModeCounts[r.backendMode] ?? 0) + 1;
    }
    if (r.responseContractOk) contractOk += 1;
    if (expectBackend && r.backendMode && r.backendMode !== expectBackend) backendMismatch += 1;
  }
  const passThreshold = 80;
  const successRatePct = total ? Number(((success / total) * 100).toFixed(1)) : 0;
  return {
    total,
    success,
    error: total - success,
    successRate: successRatePct,
    passThreshold,
    passed: successRatePct >= passThreshold && backendMismatch === 0,
    successBeforeRateLimit: beforeRateLimitSuccess,
    callsBeforeRateLimit: beforeRateLimitTotal,
    successRateBeforeRateLimit: beforeRateLimitTotal
      ? Number(((beforeRateLimitSuccess / beforeRateLimitTotal) * 100).toFixed(1))
      : 0,
    byCategory,
    durationBuckets: buckets,
    backendModeCounts,
    responseContractOkCount: contractOk,
    backendMismatchCount: backendMismatch,
    expectBackend: expectBackend || null,
    opsMode: opsConfig,
    publicLimitContext,
    retryUsedNote: "retry_used/attempt_count from ops meta headers when token configured",
    guardNote: opsConfig.publicGuardBypassed
      ? "Ops token bypassed public IP limits (optional path — not required for pre-pilot test)."
      : `Public guard active — server limits from Vercel env (default ${DEFAULT_BURST_LIMIT}/10m, ${DEFAULT_DAILY_LIMIT}/day).`,
  };
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const fileEnv = args.envFile ? loadEnvFile(args.envFile) : {};
  const opsToken = (process.env.VIDDEL_OPS_TEST_TOKEN ?? fileEnv.VIDDEL_OPS_TEST_TOKEN ?? "").trim();
  const protectionBypass = (
    process.env.VERCEL_AUTOMATION_BYPASS_SECRET ??
    fileEnv.VERCEL_AUTOMATION_BYPASS_SECRET ??
    ""
  ).trim();
  const opsConfig = {
    tokenConfiguredLocally: Boolean(opsToken),
    publicGuardBypassed: Boolean(opsToken),
    protectionBypassConfigured: Boolean(protectionBypass),
    header: OPS_TEST_HEADER,
  };
  const publicLimitContext = buildPublicLimitContext(fileEnv);

  const sessionId = `viddel-rel-${Date.now().toString(36)}`;
  const plan = buildPlan(args.count);
  const results = [];

  console.log(
    `chat-reliability: ${args.count} calls, ${args.delayMs}ms spacing, sessionPerRequest=${args.sessionPerRequest}, base=${args.base}`,
  );
  if (args.label) console.log(`label: ${args.label}`);
  if (args.expectBackend) console.log(`expectBackend: ${args.expectBackend}`);
  if (opsConfig.protectionBypassConfigured) {
    console.log("vercelProtectionBypass: configured (x-vercel-protection-bypass)");
  }
  console.log(
    `publicGuard: active (server limits — default ${DEFAULT_BURST_LIMIT}/10m ${DEFAULT_DAILY_LIMIT}/day; set VIDDEL_CHAT_* in Vercel + redeploy for pre-pilot)`,
  );
  if (opsConfig.tokenConfiguredLocally) {
    console.log("opsToken: yes (optional bypass — not required for standard pre-pilot flow)");
  }

  for (const item of plan) {
    const requestSessionId = args.sessionPerRequest
      ? `viddel-rel-${Date.now().toString(36)}-${item.n}`
      : sessionId;
    const proxy = await callProxy(
      args.base,
      requestSessionId,
      item.message,
      opsToken || undefined,
      protectionBypass || undefined,
    );
    const row = {
      call: item.n,
      inputType: item.inputType,
      channel: "api_chat",
      opsTest: opsConfig.tokenConfiguredLocally,
      httpStatus: proxy.httpStatus,
      result: proxy.success ? "success" : "error",
      errorCode: proxy.errorCode ?? proxy.opsMetaErrorCode,
      category: proxy.category,
      finalSuccess: proxy.success,
      durationMs: proxy.durationMs,
      durationBucket: proxy.durationBucket,
      backendMode: proxy.backendMode,
      upstreamHttpStatus: proxy.upstreamHttpStatus,
      retryUsed: proxy.retryUsed,
      attemptCount: proxy.attemptCount,
      hasCitations: proxy.hasCitations,
      responseContractOk: proxy.responseContractOk,
      deploymentBlocked: proxy.deploymentBlocked,
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
      `#${row.call} ${row.result} http=${row.httpStatus} backend=${row.backendMode ?? "n/a"} code=${row.errorCode ?? "none"} ${row.durationBucket} contract=${row.responseContractOk ? "ok" : "fail"}\n`,
    );
    if (args.delayMs > 0 && item.n < plan.length) {
      await new Promise((r) => setTimeout(r, args.delayMs));
    }
  }

  const summary = summarize(results, opsConfig, publicLimitContext, args.expectBackend);
  const cesEnv = readCesEnv();
  const report = {
    generatedAt: new Date().toISOString(),
    label: args.label || null,
    base: args.base,
    config: {
      count: args.count,
      delayMs: args.delayMs,
      sessionPerRequest: args.sessionPerRequest,
      expectBackend: args.expectBackend || null,
      opsTest: opsConfig,
      publicLimitContext,
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
