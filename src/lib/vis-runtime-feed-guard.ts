/* CONTRACT: VIS Runtime Feed guard — build-time checks that feed registry is complete and wired to /vis/. */

import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import {
  getVisRuntimeFeed,
  type VisRuntimeActiveEntry,
  type VisRuntimeFeedEntry,
} from "../data/vis-runtime-feed.ts";

const srcRoot = join(dirname(fileURLToPath(import.meta.url)), "..");

function activeEntryErrors(entries: VisRuntimeActiveEntry[], section: string): string[] {
  const errors: string[] = [];
  if (entries.length === 0) {
    errors.push(`${section} must have at least one entry`);
    return errors;
  }
  for (const entry of entries) {
    if (!entry.id?.trim()) errors.push(`${section} entry missing id`);
    if (!entry.title?.trim()) errors.push(`${section} entry "${entry.id || "?"}" missing title`);
    if (!entry.area?.trim()) errors.push(`${section} entry "${entry.id || "?"}" missing area`);
    if (!entry.status?.trim()) errors.push(`${section} entry "${entry.id || "?"}" missing status`);
    if (!entry.goal?.trim()) errors.push(`${section} entry "${entry.id || "?"}" missing goal`);
    if (!entry.progress?.trim()) errors.push(`${section} entry "${entry.id || "?"}" missing progress`);
    if (!entry.next?.trim()) errors.push(`${section} entry "${entry.id || "?"}" missing next`);
  }
  return errors;
}

function entryErrors(entries: VisRuntimeFeedEntry[], section: string): string[] {
  const errors: string[] = [];
  if (entries.length === 0) {
    errors.push(`${section} must have at least one entry`);
    return errors;
  }
  for (const entry of entries) {
    if (!entry.id?.trim()) {
      errors.push(`${section} entry missing id`);
    }
    if (!entry.title?.trim()) {
      errors.push(`${section} entry "${entry.id || "?"}" missing title`);
    }
    if (!entry.status?.trim()) {
      errors.push(`${section} entry "${entry.id || "?"}" missing status`);
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

  if (!feed.statusLine?.trim()) {
    errors.push("visRuntimeFeed.statusLine is required");
  }

  if (!feed.lastReturnTicketSummary?.trim()) {
    errors.push("visRuntimeFeed.lastReturnTicketSummary is required");
  }

  errors.push(...activeEntryErrors(feed.activeNow, "activeNow"));
  errors.push(...entryErrors(feed.recentlyCompleted, "recentlyCompleted"));

  if (!feed.nextDecision?.title?.trim()) {
    errors.push("nextDecision.title is required");
  }
  if (!feed.nextDecision?.detail?.trim()) {
    errors.push("nextDecision.detail is required");
  }

  if (!Array.isArray(feed.links) || feed.links.length === 0) {
    errors.push("links must have at least one entry");
  } else {
    for (const link of feed.links) {
      if (!link.label?.trim()) {
        errors.push("links entry missing label");
      }
      if (!link.href?.trim()) {
        errors.push(`links entry "${link.label || "?"}" missing href`);
      }
    }
  }

  return errors;
}
