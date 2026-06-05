/* CONTRACT: Source registry classification, status summary and manifest validation (#228). */

import type {
  Brand,
  DatastoreReadyManifest,
  DriveSnapshotEntry,
  KnowledgeStatusSummary,
  ReviewNeed,
  SourceRegistryEntry,
  SourceType,
  VerificationStatus,
} from "../data/source-registry/source-types.ts";

export const CLASSIFIER_VERSION = "v0.1-heuristic";

const STALE_MS = 180 * 24 * 60 * 60 * 1000; // ~6 months

const REVIEW_NEED_RANK: Record<ReviewNeed, number> = {
  none: 0,
  needs_metadata: 1,
  needs_source_check: 2,
  needs_freshness_check: 3,
  needs_human_review: 4,
  needs_canonical_rewrite: 5,
};

function slugify(value: string): string {
  return value
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 48);
}

function detectBrand(title: string, pathHint: string): Brand {
  const hay = `${title} ${pathHint}`.toLowerCase();
  if (/\bphonak\b/.test(hay)) return "Phonak";
  if (/\boticon\b/.test(hay)) return "Oticon";
  if (/\bresound\b/.test(hay)) return "ReSound";
  if (/\bgeneral\b/.test(hay)) return "general";
  return "unknown";
}

function detectSourceType(title: string, pathHint: string, mimeType: string): SourceType {
  const hay = `${title} ${pathHint}`.toLowerCase();

  if (/transkrips|intervju|interview/.test(hay)) return "user_interview";
  if (/audiograf|stakeholder|ekspert|høreomsorg systemmanual/.test(hay)) return "stakeholder_expert";
  if (/crpd|nav\b|støtteordning|policy|personvern/.test(hay)) return "public_policy";
  if (/instruksjonsprinsip|hallusinasjonskontroll|masterplan|optimal lyttekvalitet/.test(hay)) {
    return "viddel_canonical";
  }
  if (/manual|systemmanual|handbok|guide|01_originals/.test(hay)) return "manufacturer_manual";
  if (/app\b|bluetooth|sonic_knowledge/.test(hay)) return "app_guide";
  if (mimeType.includes("folder") && /originals|manuals/.test(hay)) return "manufacturer_manual";
  if (/editorial|artikkel/.test(hay)) return "editorial";
  return "unknown";
}

function pickReviewNeed(
  entry: DriveSnapshotEntry,
  sourceType: SourceType,
  brand: Brand,
): ReviewNeed {
  const needs: ReviewNeed[] = [];

  if (!entry.driveId?.trim()) needs.push("needs_metadata");
  if (!entry.url?.trim()) needs.push("needs_metadata");
  if (sourceType === "unknown" || brand === "unknown") needs.push("needs_human_review");
  if (sourceType === "manufacturer_manual") needs.push("needs_canonical_rewrite");
  if (sourceType === "user_interview" || sourceType === "stakeholder_expert") {
    needs.push("needs_source_check");
  }

  const modified = Date.parse(entry.modifiedTime);
  if (!Number.isNaN(modified) && Date.now() - modified > STALE_MS) {
    needs.push("needs_freshness_check");
  }

  if (needs.length === 0) return "none";
  return needs.sort((a, b) => REVIEW_NEED_RANK[b] - REVIEW_NEED_RANK[a])[0];
}

function confidenceFor(sourceType: SourceType, brand: Brand): "high" | "medium" | "low" {
  if (sourceType === "unknown" || brand === "unknown") return "low";
  if (sourceType === "manufacturer_manual") return "medium";
  return "high";
}

/** Deterministic scaffold: Drive snapshot → registry entry. */
export function classifyDriveEntry(
  entry: DriveSnapshotEntry,
  options: { now?: string; classifierVersion?: string } = {},
): SourceRegistryEntry {
  const now = options.now ?? new Date().toISOString();
  const sourceType = detectSourceType(entry.title, entry.pathHint, entry.mimeType);
  const brand = detectBrand(entry.title, entry.pathHint);
  const reviewNeed = pickReviewNeed(entry, sourceType, brand);
  const classified = sourceType !== "unknown" || brand !== "unknown";

  const verificationStatus: VerificationStatus = classified
    ? "machine_classified"
    : "raw_original";

  const idBase = entry.driveId || slugify(entry.title) || "source";
  const id = `src-${slugify(idBase).slice(0, 32)}`;

  return {
    id,
    driveId: entry.driveId,
    title: entry.title,
    mimeType: entry.mimeType,
    url: entry.url,
    pathHint: entry.pathHint,
    sourceType,
    brand,
    verificationStatus,
    reviewNeed,
    confidence: confidenceFor(sourceType, brand),
    createdTime: entry.createdTime,
    modifiedTime: entry.modifiedTime,
    lastSeenAt: now,
    classifierVersion: options.classifierVersion ?? CLASSIFIER_VERSION,
    notes: classified
      ? "Auto-classified by source-inventory-scaffold (heuristic v0.1)."
      : "Unclassified raw snapshot entry.",
  };
}

export function scaffoldRegistryFromSnapshot(
  snapshot: DriveSnapshotEntry[],
  options: { snapshotSource?: string; now?: string } = {},
): { entries: SourceRegistryEntry[]; generatedAt: string } {
  const generatedAt = options.now ?? new Date().toISOString();
  const entries = snapshot.map((row) =>
    classifyDriveEntry(row, { now: generatedAt, classifierVersion: CLASSIFIER_VERSION }),
  );
  return { entries, generatedAt };
}

export function summarizeKnowledgeStatus(
  entries: SourceRegistryEntry[],
  options: { now?: string } = {},
): KnowledgeStatusSummary {
  const now = options.now ?? new Date().toISOString();
  const needsReview = entries.filter((e) => e.reviewNeed !== "none").length;
  const staleOrOutdated = entries.filter((e) => {
    const modified = Date.parse(e.modifiedTime);
    return !Number.isNaN(modified) && Date.now() - modified > STALE_MS;
  }).length;

  const countStatus = (status: VerificationStatus) =>
    entries.filter((e) => e.verificationStatus === status).length;

  return {
    generatedAt: now,
    totalSources: entries.length,
    rawOriginal: countStatus("raw_original"),
    machineClassified: countStatus("machine_classified"),
    needsReview,
    provisionalInsight: countStatus("provisional_insight"),
    reviewedInsight: countStatus("reviewed_insight"),
    canonicalGuidance: countStatus("canonical_guidance"),
    datastoreReady: countStatus("datastore_ready"),
    deprecated: countStatus("deprecated"),
    staleOrOutdated,
  };
}

export type ManifestValidationIssue = {
  code: string;
  message: string;
  assetId?: string;
};

const IMPORTABLE_STATUSES = new Set<VerificationStatus>(["datastore_ready"]);

/** Validate production manifest — fails on raw/unapproved entries. */
export function validateDatastoreManifest(manifest: DatastoreReadyManifest): ManifestValidationIssue[] {
  const issues: ManifestValidationIssue[] = [];

  if (manifest.version !== "0.1") {
    issues.push({ code: "invalid_version", message: "Manifest version must be 0.1." });
  }

  for (const entry of manifest.entries) {
    const prefix = entry.assetId || "(missing assetId)";

    if (!entry.assetId?.trim()) {
      issues.push({ code: "missing_asset_id", message: "assetId is required.", assetId: prefix });
    }
    if (!IMPORTABLE_STATUSES.has(entry.status)) {
      issues.push({
        code: "invalid_status",
        message: `Status must be datastore_ready (got ${entry.status}).`,
        assetId: entry.assetId,
      });
    }
    if (!entry.approvedBy?.trim()) {
      issues.push({
        code: "missing_approved_by",
        message: "approvedBy is required for production import.",
        assetId: entry.assetId,
      });
    }
    if (!entry.approvedAt?.trim()) {
      issues.push({
        code: "missing_approved_at",
        message: "approvedAt is required for production import.",
        assetId: entry.assetId,
      });
    }
    if (!Array.isArray(entry.sourceRegistryIds)) {
      issues.push({
        code: "missing_source_registry_ids",
        message: "sourceRegistryIds must be an array.",
        assetId: entry.assetId,
      });
    }
    if (entry.target !== "production_agent_search") {
      issues.push({
        code: "invalid_target",
        message: `target must be production_agent_search (got ${entry.target}).`,
        assetId: entry.assetId,
      });
    }
    if (/placeholder|not approved/i.test(entry.notes ?? "")) {
      issues.push({
        code: "placeholder_not_importable",
        message: "Placeholder entries are not importable until approved.",
        assetId: entry.assetId,
      });
    }
  }

  return issues;
}
