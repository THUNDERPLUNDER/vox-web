/* CONTRACT: VIS Runtime Feed guard — build-time checks that feed registry is complete and wired to /vis/. */

import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { getVisRuntimeFeed, type VisRuntimeActiveWork } from "../data/vis-runtime-feed.ts";

const srcRoot = join(dirname(fileURLToPath(import.meta.url)), "..");

/** Patterns that indicate internal shorthand — not valid as human headline. */
const INTERNAL_HEADLINE_PATTERNS = [
  /solution assessment/i,
  /thomas vurderer/i,
  /^hybrid v0/i,
  /— thomas/i,
] as const;

const MIN_HEADLINE_LENGTH = 40;
const MIN_WHY_LENGTH = 30;
const MIN_NEXT_DECISION_LENGTH = 15;

function humanLanguageErrors(entry: VisRuntimeActiveWork): string[] {
  const errors: string[] = [];
  const key = entry.id || "?";
  const headline = entry.headline.trim();

  if (headline.length < MIN_HEADLINE_LENGTH) {
    errors.push(
      `activeNow "${key}" headline too short (${headline.length} chars) — use a full human sentence`,
    );
  }

  for (const pattern of INTERNAL_HEADLINE_PATTERNS) {
    if (pattern.test(headline)) {
      errors.push(
        `activeNow "${key}" headline looks like internal shorthand — write for Thomas/Vibeke`,
      );
      break;
    }
  }

  if (entry.why.trim().length < MIN_WHY_LENGTH) {
    errors.push(`activeNow "${key}" why too short — explain why in plain language`);
  }

  if (entry.nextDecision.trim().length < MIN_NEXT_DECISION_LENGTH) {
    errors.push(`activeNow "${key}" nextDecision too short — state the decision clearly`);
  }

  return errors;
}

function activeWorkErrors(entries: VisRuntimeActiveWork[], section: string): string[] {
  const errors: string[] = [];
  if (entries.length === 0) {
    errors.push(`${section} must have at least one entry`);
    return errors;
  }
  for (const entry of entries) {
    const key = entry.id || "?";
    if (!entry.id?.trim()) errors.push(`${section} entry missing id`);
    if (!entry.headline?.trim()) errors.push(`${section} entry "${key}" missing headline`);
    if (!entry.workTitle?.trim()) errors.push(`${section} entry "${key}" missing workTitle`);
    if (!entry.area?.trim()) errors.push(`${section} entry "${key}" missing area`);
    if (!entry.why?.trim()) errors.push(`${section} entry "${key}" missing why`);
    if (!entry.status?.trim()) errors.push(`${section} entry "${key}" missing status`);
    if (!entry.possibleSolution?.trim()) errors.push(`${section} entry "${key}" missing possibleSolution`);
    if (!entry.nextDecision?.trim()) errors.push(`${section} entry "${key}" missing nextDecision`);
    if (!Array.isArray(entry.progressSteps) || entry.progressSteps.length === 0) {
      errors.push(`${section} entry "${key}" missing progressSteps`);
    }
    errors.push(...humanLanguageErrors(entry));
  }
  return errors;
}

/** Fail build if VIS runtime feed registry is incomplete or /vis/ does not import it. */
export function validateVisRuntimeFeedGuard(): string[] {
  const errors: string[] = [];

  const feedData = join(srcRoot, "data/vis-runtime-feed.ts");
  const visIndex = join(srcRoot, "pages/vis/index.astro");

  if (!existsSync(feedData)) {
    errors.push("Missing VIS runtime feed data: src/data/vis-runtime-feed.ts");
    return errors;
  }

  if (!existsSync(visIndex)) {
    errors.push("Missing VIS frontpage: src/pages/vis/index.astro");
    return errors;
  }

  const visSource = readFileSync(visIndex, "utf8");
  if (!visSource.includes("vis-runtime-feed")) {
    errors.push("/vis/ must import vis-runtime-feed (src/data/vis-runtime-feed.ts)");
  }

  const feed = getVisRuntimeFeed();

  if (!feed.updatedAt?.trim()) {
    errors.push("visRuntimeFeed.updatedAt is required");
  }

  if (!feed.recentlyCompletedSummary?.trim()) {
    errors.push("visRuntimeFeed.recentlyCompletedSummary is required");
  }

  if (!feed.lastReturnTicketSummary?.trim()) {
    errors.push("visRuntimeFeed.lastReturnTicketSummary is required");
  }

  errors.push(...activeWorkErrors(feed.activeNow, "activeNow"));

  if (!Array.isArray(feed.links?.primary) || feed.links.primary.length === 0) {
    errors.push("links.primary must have at least one entry");
  } else {
    for (const link of feed.links.primary) {
      if (!link.label?.trim()) errors.push("links.primary entry missing label");
      if (!link.href?.trim()) errors.push(`links.primary entry "${link.label || "?"}" missing href`);
    }
  }

  if (feed.links.secondary) {
    for (const link of feed.links.secondary) {
      if (!link.label?.trim()) errors.push("links.secondary entry missing label");
      if (!link.href?.trim()) errors.push(`links.secondary entry "${link.label || "?"}" missing href`);
    }
  }

  return errors;
}
