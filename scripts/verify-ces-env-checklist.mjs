#!/usr/bin/env node
/* CONTRACT: Safe CES env checklist — compares Vercel/local env to repo expectations. Never prints SA JSON. */

import { readFileSync, existsSync } from "node:fs";

/** Repo source of truth — matches .env.example + DECISION_125M-B */
const EXPECTED = {
  CES_PROJECT_ID: "hearing-aid-mvp",
  CES_LOCATION: "eu",
  CES_APP_ID: "1741e68d-0528-4625-8b83-99a0dbb5298f",
  CES_APP_VERSION_ID: "91cc4831-f020-4bb1-a17c-650859401cb1",
  CES_DEPLOYMENT_ID: "edb2938a-a2bf-4555-b4c9-d54963531db4",
};

const WIDGET_DEPLOYMENT_ID = "dc1619d0-44a1-401b-92a6-1357c29274ea";

const RED_FLAG_LOCATION = /^(europe-west|europe-north|northamerica|asia-|us-central|us-east|us-west|finland)/i;

const KEYS = [
  "CES_PROJECT_ID",
  "CES_LOCATION",
  "CES_APP_ID",
  "CES_APP_VERSION_ID",
  "CES_DEPLOYMENT_ID",
  "GOOGLE_SERVICE_ACCOUNT_JSON",
];

function parseArgs(argv) {
  let envFile = "";
  for (const arg of argv) {
    if (arg.startsWith("--env-file=")) envFile = arg.slice(11);
  }
  return { envFile };
}

function loadEnvFile(path) {
  if (!existsSync(path)) {
    console.error(`Env file not found: ${path}`);
    process.exit(1);
  }
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

function saPresenceOnly(raw) {
  if (!raw?.trim()) return { present: false, clientEmail: null };
  try {
    const parsed = JSON.parse(raw);
    const email = typeof parsed.client_email === "string" ? parsed.client_email : null;
    return { present: true, clientEmail: email };
  } catch {
    return { present: true, clientEmail: "(unparseable — check JSON manually)" };
  }
}

function statusLine(key, value, expected) {
  if (!value?.trim()) return { key, state: "MISSING", detail: "not set" };
  if (key === "GOOGLE_SERVICE_ACCOUNT_JSON") {
    const sa = saPresenceOnly(value);
    return {
      key,
      state: sa.present ? "SET" : "MISSING",
      detail: sa.clientEmail ? `client_email=${sa.clientEmail}` : "invalid or empty",
    };
  }
  const match = expected && value.trim() === expected;
  return {
    key,
    state: match ? "MATCH" : "MISMATCH",
    detail: match ? "matches repo" : `got "${value.trim()}" expected "${expected}"`,
  };
}

function redFlags(env) {
  const flags = [];
  const loc = (env.CES_LOCATION ?? "").trim();
  if (loc && loc !== "eu") {
    flags.push(`CES_LOCATION is "${loc}" — repo expects "eu" (UI labels like Finland/EU-west are not API values)`);
  }
  if (RED_FLAG_LOCATION.test(loc)) {
    flags.push(`CES_LOCATION looks like a compute region (${loc}) — likely wrong for CES runSession path`);
  }
  const dep = (env.CES_DEPLOYMENT_ID ?? "").trim();
  if (dep === WIDGET_DEPLOYMENT_ID) {
    flags.push("CES_DEPLOYMENT_ID is Messenger/widget deployment (dc1619d0…) — headless needs edb2938a…");
  }
  if (dep && dep !== EXPECTED.CES_DEPLOYMENT_ID) {
    flags.push(`CES_DEPLOYMENT_ID differs from repo API access deployment (${EXPECTED.CES_DEPLOYMENT_ID.slice(0, 8)}…)`);
  }
  return flags;
}

function main() {
  const { envFile } = parseArgs(process.argv.slice(2));
  const env = envFile ? loadEnvFile(envFile) : process.env;

  console.log("CES env verification (safe — no SA JSON content)\n");
  console.log("Repo expected headless path:");
  console.log(
    `  projects/${EXPECTED.CES_PROJECT_ID}/locations/${EXPECTED.CES_LOCATION}/apps/${EXPECTED.CES_APP_ID}/deployments/${EXPECTED.CES_DEPLOYMENT_ID}`,
  );
  console.log("");

  for (const key of KEYS) {
    const expected = key === "GOOGLE_SERVICE_ACCOUNT_JSON" ? null : EXPECTED[key];
    const line = statusLine(key, env[key] ?? "", expected);
    console.log(`${line.state.padEnd(8)} ${line.key}: ${line.detail}`);
  }

  const flags = redFlags(env);
  console.log("");
  if (flags.length === 0) {
    console.log("Red flags: none detected (compare manually with GCP resource name anyway)");
    console.log("Next: if GCP matches → option B (CES escalation or backend spike)");
  } else {
    console.log("Red flags:");
    for (const f of flags) console.log(`  🚩 ${f}`);
    console.log("Next: option A — fix Vercel Production env, redeploy, then one chat test");
  }

  console.log("\nSee docs/project/CES_ENV_VERIFICATION_CHECKLIST_v0_1.md");
}

main();
