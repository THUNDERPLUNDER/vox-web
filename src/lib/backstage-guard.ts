/* CONTRACT: Backstage guard — build-time checks that /backstage/ registry stays complete and aligned with chat guard. */

import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import {
  backstageLinks,
  changeRunbooks,
  envVars,
  protectionRules,
  services,
  troubleshootingCases,
} from "../data/backstage-v01.ts";
import { getVisFrontpageHubs } from "../data/vis-frontpage-hubs-v01.ts";
import { CHAT_MAX_MESSAGE_LENGTH } from "./chat-api-guard.ts";

const REQUIRED_ENV_VARS = [
  "UPSTASH_REDIS_REST_URL",
  "UPSTASH_REDIS_REST_TOKEN",
  "CES_PROJECT_ID",
  "CES_LOCATION",
  "CES_APP_ID",
  "CES_APP_VERSION_ID",
  "CES_DEPLOYMENT_ID",
  "GOOGLE_SERVICE_ACCOUNT_JSON",
] as const;

const REQUIRED_ERROR_CODES = [
  "message_too_long",
  "rate_limited",
  "guard_unavailable",
  "configuration_missing",
] as const;

const REQUIRED_RUNBOOK_IDS = [
  "rate-limits",
  "max-length",
  "upstash",
  "ces",
  "disable-ai",
  "access",
  "status",
] as const;

const REQUIRED_SERVICE_IDS = ["vercel", "upstash", "google-ces", "github", "vis"] as const;

const REQUIRED_LINK_PATTERNS = [
  "vercel.com",
  "console.upstash.com",
  "console.cloud.google.com",
  "github.com",
  "vox.raddum.no",
] as const;

const srcRoot = join(dirname(fileURLToPath(import.meta.url)), "..");

/** Fail build if Backstage registry or VIS hub is incomplete or drifted from chat guard. */
export function validateBackstageGuard(): string[] {
  const errors: string[] = [];

  const backstagePage = join(srcRoot, "pages/backstage/index.astro");
  const backstageData = join(srcRoot, "data/backstage-v01.ts");

  if (!existsSync(backstagePage)) {
    errors.push("Missing /backstage/ route: src/pages/backstage/index.astro");
  }
  if (!existsSync(backstageData)) {
    errors.push("Missing Backstage data: src/data/backstage-v01.ts");
  }

  const envNames = new Set(envVars.map((v) => v.name));
  for (const name of REQUIRED_ENV_VARS) {
    if (!envNames.has(name)) {
      errors.push(`Backstage env-vars missing required name: ${name}`);
    }
  }

  const errorCodes = new Set(
    troubleshootingCases.flatMap((c) => c.techCodes ?? []),
  );
  for (const code of REQUIRED_ERROR_CODES) {
    if (!errorCodes.has(code)) {
      errors.push(`Backstage troubleshooting missing error code: ${code}`);
    }
  }

  const runbookIds = new Set(changeRunbooks.map((r) => r.id));
  for (const id of REQUIRED_RUNBOOK_IDS) {
    if (!runbookIds.has(id)) {
      errors.push(`Backstage runbooks missing required id: ${id}`);
    }
  }

  const serviceIds = new Set(services.map((s) => s.id));
  for (const id of REQUIRED_SERVICE_IDS) {
    if (!serviceIds.has(id)) {
      errors.push(`Backstage service map missing required service: ${id}`);
    }
  }

  const allHrefs = [
    ...Object.values(backstageLinks).map((l) => l.href),
    ...services.flatMap((s) => s.actionLinks.map((l) => l.href)),
  ].join(" ");

  for (const pattern of REQUIRED_LINK_PATTERNS) {
    if (!allHrefs.includes(pattern)) {
      errors.push(`Backstage links missing reference to: ${pattern}`);
    }
  }

  const backstageHub = getVisFrontpageHubs("/").find((h) => h.id === "backstage");
  if (!backstageHub?.href) {
    errors.push("VIS hub Backstage must have an active href");
  } else if (backstageHub.availability !== "active") {
    errors.push(`VIS hub Backstage must be active (got: ${backstageHub.availability})`);
  }

  const maxLengthRule = protectionRules.find((r) => r.title === "Maks lengde");
  if (!maxLengthRule?.value.includes(String(CHAT_MAX_MESSAGE_LENGTH))) {
    errors.push(
      `Backstage max length (${maxLengthRule?.value}) must match CHAT_MAX_MESSAGE_LENGTH (${CHAT_MAX_MESSAGE_LENGTH})`,
    );
  }

  const burstRule = protectionRules.find((r) => r.title === "Kort sikt");
  const dailyRule = protectionRules.find((r) => r.title === "Døgn");
  if (!burstRule?.value.includes("10")) {
    errors.push("Backstage burst limit text must reference 10 per 10 minutes");
  }
  if (!dailyRule?.value.includes("50")) {
    errors.push("Backstage daily limit text must reference 50 per day");
  }

  const guardPath = join(srcRoot, "lib/chat-api-guard.ts");
  if (existsSync(guardPath)) {
    const guardSource = readFileSync(guardPath, "utf8");
    if (!guardSource.includes('slidingWindow(10, "10 m")')) {
      errors.push("chat-api-guard.ts burst limit changed — update Backstage protection rules");
    }
    if (!guardSource.includes('slidingWindow(50, "24 h")')) {
      errors.push("chat-api-guard.ts daily limit changed — update Backstage protection rules");
    }
    if (!guardSource.includes(`CHAT_MAX_MESSAGE_LENGTH = ${CHAT_MAX_MESSAGE_LENGTH}`)) {
      errors.push("CHAT_MAX_MESSAGE_LENGTH changed — update Backstage protection rules");
    }
  }

  return errors;
}
