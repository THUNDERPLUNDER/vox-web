/* CONTRACT: VIS Runtime Feed guard — build-time checks that feed registry is complete and wired to /vis/. */

import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { getVisRuntimeFeed, type VisRuntimeActiveWork } from "../data/vis-runtime-feed.ts";

const srcRoot = join(dirname(fileURLToPath(import.meta.url)), "..");

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
