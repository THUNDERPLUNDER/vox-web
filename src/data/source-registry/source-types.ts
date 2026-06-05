/* CONTRACT: Source registry types v0.1 — inventory, classification and manifest gate (#228). */

export const VERIFICATION_STATUSES = [
  "raw_original",
  "machine_classified",
  "provisional_insight",
  "reviewed_insight",
  "canonical_guidance",
  "datastore_ready",
  "deprecated",
] as const;

export type VerificationStatus = (typeof VERIFICATION_STATUSES)[number];

export const SOURCE_TYPES = [
  "manufacturer_manual",
  "app_guide",
  "user_interview",
  "stakeholder_expert",
  "public_policy",
  "editorial",
  "viddel_canonical",
  "market_validation",
  "strategic_research",
  "inspiration_context",
  "audio",
  "unknown",
] as const;

export type SourceType = (typeof SOURCE_TYPES)[number];

export const BRANDS = ["Oticon", "Phonak", "ReSound", "general", "unknown"] as const;

export type Brand = (typeof BRANDS)[number];

export const REVIEW_NEEDS = [
  "none",
  "needs_metadata",
  "needs_source_check",
  "needs_freshness_check",
  "needs_human_review",
  "needs_canonical_rewrite",
  "needs_transcript",
] as const;

export type ReviewNeed = (typeof REVIEW_NEEDS)[number];

/** Drive metadata snapshot row — input to scaffold script. */
export type DriveSnapshotEntry = {
  driveId: string;
  title: string;
  mimeType: string;
  url: string;
  createdTime: string;
  modifiedTime: string;
  pathHint: string;
};

/** Registry row after scaffold / human promotion. */
export type SourceRegistryEntry = {
  id: string;
  driveId: string;
  title: string;
  mimeType: string;
  url: string;
  pathHint: string;
  sourceType: SourceType;
  brand: Brand;
  verificationStatus: VerificationStatus;
  reviewNeed: ReviewNeed;
  directProductionImport: boolean;
  confidence: "high" | "medium" | "low";
  createdTime: string;
  modifiedTime: string;
  lastSeenAt: string;
  classifierVersion: string;
  notes: string;
};

export type SourceRegistryFile = {
  version: "0.1";
  generatedAt: string;
  snapshotSource: string;
  classifierVersion: string;
  entries: SourceRegistryEntry[];
};

export const MANIFEST_TARGETS = ["production_agent_search"] as const;

export type ManifestTarget = (typeof MANIFEST_TARGETS)[number];

/** Production import manifest entry — only approved datastore_ready assets. */
export type DatastoreReadyManifestEntry = {
  assetId: string;
  title: string;
  status: VerificationStatus;
  sourceRegistryIds: string[];
  approvedBy: string;
  approvedAt: string;
  target: ManifestTarget;
  notes: string;
};

export type DatastoreReadyManifest = {
  version: "0.1";
  rule: string;
  entries: DatastoreReadyManifestEntry[];
};

/** VIS-readable knowledge status summary. */
export type KnowledgeStatusSummary = {
  generatedAt: string;
  totalSources: number;
  rawOriginal: number;
  machineClassified: number;
  needsReview: number;
  provisionalInsight: number;
  reviewedInsight: number;
  canonicalGuidance: number;
  datastoreReady: number;
  deprecated: number;
  staleOrOutdated: number;
  directProductionImport: number;
};
