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

export const CLASSIFIER_VERSION = "v0.3-full-inventory-heuristic";

const STALE_MS = 180 * 24 * 60 * 60 * 1000; // ~6 months

const REVIEW_NEED_RANK: Record<ReviewNeed, number> = {
  none: 0,
  needs_metadata: 1,
  needs_source_check: 2,
  needs_freshness_check: 3,
  needs_human_review: 4,
  needs_canonical_rewrite: 5,
  needs_transcript: 6,
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

  if (mimeType.startsWith("audio/") || /\.(m4a|mp3|wav)$/i.test(title)) return "audio";
  if (/inspirasjon helsevesen|dokumentar|psykisk sykdom/.test(hay)) return "inspiration_context";
  if (/markedsvalidering|konkurrentanalyse|verdikjede|strategisk analyse|strategi-kartlegging|benchmarking|teknisk integrator/.test(hay)) {
    return "market_validation";
  }
  if (/økosystem|ecosystem|aktør|partner|positioning|business model/.test(hay)) return "strategic_research";
  if (/transkrips|intervju|interview/.test(hay)) return "user_interview";
  if (/audiograf|stakeholder|ekspert|høreomsorg systemmanual/.test(hay)) return "stakeholder_expert";
  if (/crpd|nav\b|støtteordning|policy|personvern|budsjett|menneskerettigheter/.test(hay)) return "public_policy";
  if (/instruksjonsprinsip|hallusinasjonskontroll|masterplan|optimal lyttekvalitet/.test(hay)) {
    return "viddel_canonical";
  }
  if (/app\b|bluetooth|companion|roger|smart3d|tvadapter|tv adapter|tvconnector|tv connector|pairing/.test(hay)) return "app_guide";
  if (/manual|systemmanual|handbok|guide|userguide|user guide|instructions-for-use|ifu|01_originals|02_sonic_knowledge/.test(hay)) return "manufacturer_manual";
  if (mimeType.includes("folder") && /originals|manuals/.test(hay)) return "manufacturer_manual";
  if (/editorial|artikkel/.test(hay)) return "editorial";
  return "unknown";
}

function detectSourceTypeFromPool(sourcePool?: string): SourceType | null {
  if (!sourcePool || sourcePool === "unknown") return null;
  if (sourcePool === "raw_audio") return "audio";
  if (sourcePool === "user_guidance_candidate") return "user_guidance_candidate";
  if (sourcePool === "manufacturer_manual") return "manufacturer_manual";
  if (sourcePool === "public_policy") return "public_policy";
  if (sourcePool === "stakeholder_expert") return "stakeholder_expert";
  if (sourcePool === "market_validation") return "market_validation";
  if (sourcePool === "strategic_research") return "strategic_research";
  if (sourcePool === "inspiration_context") return "inspiration_context";
  if (sourcePool === "viddel_canonical") return "viddel_canonical";
  return null;
}

function entryTitle(entry: DriveSnapshotEntry): string {
  return entry.title ?? entry.name ?? "";
}

function entryPathHint(entry: DriveSnapshotEntry): string {
  return entry.pathHint ?? entry.path ?? "";
}

function coerceReviewNeed(value: DriveSnapshotEntry["reviewNeed"]): ReviewNeed | null {
  if (
    value === "none" ||
    value === "needs_metadata" ||
    value === "needs_source_check" ||
    value === "needs_freshness_check" ||
    value === "needs_human_review" ||
    value === "needs_canonical_rewrite" ||
    value === "needs_transcript"
  ) {
    return value;
  }
  return null;
}

function pickReviewNeed(
  entry: DriveSnapshotEntry,
  sourceType: SourceType,
  brand: Brand,
): ReviewNeed {
  const needs: ReviewNeed[] = [];

  if (!entry.driveId?.trim()) needs.push("needs_metadata");
  if (!entry.url?.trim()) needs.push("needs_metadata");
  const sheetReviewNeed = coerceReviewNeed(entry.reviewNeed);
  if (sheetReviewNeed) needs.push(sheetReviewNeed);
  if (sourceType === "unknown" || brand === "unknown") needs.push("needs_human_review");
  if (sourceType === "manufacturer_manual") needs.push("needs_canonical_rewrite");
  if (sourceType === "app_guide") needs.push("needs_canonical_rewrite");
  if (sourceType === "user_guidance_candidate") needs.push("needs_human_review");
  if (sourceType === "market_validation" || sourceType === "strategic_research") {
    needs.push("needs_source_check");
  }
  if (sourceType === "inspiration_context") needs.push("needs_human_review");
  if (sourceType === "audio") needs.push("needs_transcript");
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
  if (sourceType === "market_validation" || sourceType === "strategic_research") return "medium";
  if (sourceType === "inspiration_context" || sourceType === "audio") return "medium";
  return "high";
}

function notesFor(sourceType: SourceType, classified: boolean, entryNotes?: string | null): string {
  const suffix = entryNotes?.trim() ? ` Sheet notes: ${entryNotes.trim()}` : "";
  if (!classified) return "Unclassified raw snapshot entry.";
  if (sourceType === "market_validation" || sourceType === "strategic_research") {
    return `Auto-classified by source-inventory-scaffold (${CLASSIFIER_VERSION}). Strategy/market material only; not direct user-answer material unless rewritten as canonical Viddel guidance and manifest-approved.${suffix}`;
  }
  if (sourceType === "inspiration_context") {
    return `Auto-classified by source-inventory-scaffold (${CLASSIFIER_VERSION}). Context/inspiration material; not a default datastore candidate.${suffix}`;
  }
  if (sourceType === "audio") {
    return `Auto-classified by source-inventory-scaffold (${CLASSIFIER_VERSION}). Raw audio requires transcript and human review before downstream use.${suffix}`;
  }
  return `Auto-classified by source-inventory-scaffold (${CLASSIFIER_VERSION}).${suffix}`;
}

/** Deterministic scaffold: Drive snapshot → registry entry. */
export function classifyDriveEntry(
  entry: DriveSnapshotEntry,
  options: { now?: string; classifierVersion?: string } = {},
): SourceRegistryEntry {
  const now = options.now ?? new Date().toISOString();
  const title = entryTitle(entry);
  const pathHint = entryPathHint(entry);
  const sourceType =
    detectSourceTypeFromPool(entry.sourcePool) ?? detectSourceType(title, pathHint, entry.mimeType);
  const brand = detectBrand(title, pathHint);
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
    title,
    mimeType: entry.mimeType,
    url: entry.url,
    pathHint,
    inventoryType: entry.type,
    parentPath: entry.parentPath,
    fileCountDirect: entry.fileCountDirect,
    folderCountDirect: entry.folderCountDirect,
    recursiveFileCount: entry.recursiveFileCount,
    isEmptyFolder: entry.isEmptyFolder,
    sourcePool: entry.sourcePool,
    suggestedUse: entry.suggestedUse,
    sourceType,
    brand,
    verificationStatus,
    reviewNeed,
    directProductionImport: false,
    confidence: confidenceFor(sourceType, brand),
    createdTime: entry.createdTime,
    modifiedTime: entry.modifiedTime,
    lastSeenAt: now,
    classifierVersion: options.classifierVersion ?? CLASSIFIER_VERSION,
    notes: notesFor(sourceType, classified, entry.notes),
  };
}

function normalizedTitleKey(title: string): string {
  return slugify(
    title
      .replace(/\.(pdf|gdoc|docx?|m4a|mp3|wav)$/i, "")
      .replace(/\s+-\s+google docs$/i, "")
      .replace(/_/g, " "),
  );
}

function withDuplicateHints(entries: SourceRegistryEntry[]): SourceRegistryEntry[] {
  const byTitle = new Map<string, SourceRegistryEntry[]>();

  for (const entry of entries) {
    const key = normalizedTitleKey(entry.title);
    const group = byTitle.get(key) ?? [];
    group.push(entry);
    byTitle.set(key, group);
  }

  return entries.map((entry) => {
    const group = byTitle.get(normalizedTitleKey(entry.title)) ?? [];
    const hasDerivedPair = group.length > 1 && group.some((e) => e.mimeType !== entry.mimeType);
    if (!hasDerivedPair) return entry;

    const derivedNote =
      "Possible duplicate/derived pair detected by normalized title and mixed MIME types; verify source-of-truth before canonical rewrite.";
    return {
      ...entry,
      reviewNeed:
        REVIEW_NEED_RANK[entry.reviewNeed] >= REVIEW_NEED_RANK.needs_source_check
          ? entry.reviewNeed
          : "needs_source_check",
      notes: `${entry.notes} ${derivedNote}`,
    };
  });
}

export function scaffoldRegistryFromSnapshot(
  snapshot: DriveSnapshotEntry[] | { rows?: DriveSnapshotEntry[] },
  options: { snapshotSource?: string; now?: string } = {},
): { entries: SourceRegistryEntry[]; generatedAt: string } {
  const generatedAt = options.now ?? new Date().toISOString();
  const snapshotRows = extractSnapshotRows(snapshot);
  const entries = withDuplicateHints(
    snapshotRows.map((row) =>
      classifyDriveEntry(row, { now: generatedAt, classifierVersion: CLASSIFIER_VERSION }),
    ),
  );
  return { entries, generatedAt };
}

function extractSnapshotRows(snapshot: DriveSnapshotEntry[] | { rows?: DriveSnapshotEntry[] }): DriveSnapshotEntry[] {
  return Array.isArray(snapshot) ? snapshot : snapshot.rows ?? [];
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
    files: entries.filter((e) => e.inventoryType === "file").length,
    folders: entries.filter((e) => e.inventoryType === "folder").length,
    emptyFolders: entries.filter((e) => e.isEmptyFolder === true).length,
    rawOriginal: countStatus("raw_original"),
    machineClassified: countStatus("machine_classified"),
    needsReview,
    provisionalInsight: countStatus("provisional_insight"),
    reviewedInsight: countStatus("reviewed_insight"),
    canonicalGuidance: countStatus("canonical_guidance"),
    datastoreReady: countStatus("datastore_ready"),
    deprecated: countStatus("deprecated"),
    staleOrOutdated,
    directProductionImport: entries.filter((e) => e.directProductionImport).length,
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
