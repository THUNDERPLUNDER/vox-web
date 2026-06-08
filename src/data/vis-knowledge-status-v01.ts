/* CONTRACT: VIS read model for source inventory / knowledge status v0.1 (#230). */

import knowledgeStatusSnapshot from "../../data/source-inventory/knowledge-status.full.v0.1.json";
import sourceRegistrySnapshot from "../../data/source-inventory/source-registry.generated.full.v0.1.json";
import manifestPlaceholder from "../../data/source-inventory/datastore-ready-manifest.sample.json";
import manifestValid from "../../data/source-inventory/datastore-ready-manifest.valid.sample.json";
import { validateDatastoreManifest } from "../lib/source-registry.ts";
import type { ReviewNeed, SourceRegistryEntry } from "./source-registry/source-types.ts";

export const visKnowledgeStatusMeta = {
  version: "v0.1",
  pageRoute: "/vis/system/knowledge-status-v01",
  dataSource: "data/source-inventory/drive-inventory.full.v0.1.json",
  updatedAt: knowledgeStatusSnapshot.generatedAt.slice(0, 10),
  classifierVersion: sourceRegistrySnapshot.classifierVersion,
  snapshotSource: sourceRegistrySnapshot.snapshotSource,
  sampleLabel: "full Drive inventory snapshot",
} as const;

export const productionManifestRule =
  "Production Agent Search kan bare bruke manifest-godkjente datastore_ready assets. Rå Drive-mapper, manualer, transkripsjoner og researchnotater skal ikke importeres direkte i production." as const;

export const knowledgeFlowSteps = [
  "Raw source",
  "machine classified",
  "reviewed insight",
  "canonical guidance",
  "datastore_ready manifest",
  "production Agent Search",
] as const;

export type StatusCount = {
  id: string;
  label: string;
  value: number;
  hint?: string;
};

export type ReviewNeedSummary = {
  need: ReviewNeed;
  label: string;
  count: number;
  examples: { id: string; title: string }[];
};

export type ManifestGateSummary = {
  id: string;
  label: string;
  filePath: string;
  status: "ok" | "blocked";
  importableEntries: number;
  issueCount: number;
  note: string;
};

const REVIEW_NEED_LABELS: Record<ReviewNeed, string> = {
  none: "Ingen review",
  needs_metadata: "Trenger metadata",
  needs_source_check: "Trenger kilde-sjekk",
  needs_freshness_check: "Trenger ferskhets-sjekk",
  needs_human_review: "Trenger menneskelig review",
  needs_canonical_rewrite: "Trenger canonical omskriving",
  needs_transcript: "Trenger transkripsjon",
};

function countByReviewNeed(entries: SourceRegistryEntry[]): ReviewNeedSummary[] {
  const order: ReviewNeed[] = [
    "needs_human_review",
    "needs_transcript",
    "needs_canonical_rewrite",
    "needs_freshness_check",
    "needs_source_check",
    "needs_metadata",
    "none",
  ];

  return order
    .map((need) => {
      const matched = entries.filter((e) => e.reviewNeed === need);
      return {
        need,
        label: REVIEW_NEED_LABELS[need],
        count: matched.length,
        examples: matched.slice(0, 3).map((e) => ({ id: e.id, title: e.title })),
      };
    })
    .filter((row) => row.count > 0);
}

function manifestSummary(
  id: string,
  label: string,
  filePath: string,
  manifest: typeof manifestValid,
  note: string,
): ManifestGateSummary {
  const issues = validateDatastoreManifest(manifest);
  return {
    id,
    label,
    filePath,
    status: issues.length === 0 ? "ok" : "blocked",
    importableEntries: manifest.entries?.length ?? 0,
    issueCount: issues.length,
    note,
  };
}

export function getVisKnowledgeStatusModel() {
  const entries = sourceRegistrySnapshot.entries as SourceRegistryEntry[];
  const reviewNeeds = countByReviewNeed(entries);

  const statusCounts: StatusCount[] = [
    { id: "totalSources", label: "Totalt inventory-rader", value: knowledgeStatusSnapshot.totalSources },
    { id: "files", label: "Filer", value: knowledgeStatusSnapshot.files ?? 0 },
    { id: "folders", label: "Mapper", value: knowledgeStatusSnapshot.folders ?? 0 },
    { id: "emptyFolders", label: "Tomme mapper", value: knowledgeStatusSnapshot.emptyFolders ?? 0 },
    { id: "rawOriginal", label: "Raw originals", value: knowledgeStatusSnapshot.rawOriginal },
    {
      id: "machineClassified",
      label: "Machine classified",
      value: knowledgeStatusSnapshot.machineClassified,
    },
    {
      id: "needsReview",
      label: "Trenger review",
      value: knowledgeStatusSnapshot.needsReview,
      hint: "Full snapshot er maskinklassifisert og trenger human review før eventuell promotering.",
    },
    {
      id: "directProductionImport",
      label: "Direkte production-import",
      value: knowledgeStatusSnapshot.directProductionImport ?? 0,
      hint: "Skal være 0. Production krever datastore_ready manifest.",
    },
    {
      id: "provisionalInsight",
      label: "Provisional insight",
      value: knowledgeStatusSnapshot.provisionalInsight,
    },
    {
      id: "reviewedInsight",
      label: "Reviewed insight",
      value: knowledgeStatusSnapshot.reviewedInsight,
    },
    {
      id: "canonicalGuidance",
      label: "Canonical guidance",
      value: knowledgeStatusSnapshot.canonicalGuidance,
    },
    {
      id: "datastoreReady",
      label: "Datastore-ready",
      value: knowledgeStatusSnapshot.datastoreReady,
      hint: "Eneste tillatte status for production-import via manifest.",
    },
    { id: "deprecated", label: "Deprecated", value: knowledgeStatusSnapshot.deprecated },
    {
      id: "staleOrOutdated",
      label: "Stale / outdated",
      value: knowledgeStatusSnapshot.staleOrOutdated,
    },
  ];

  const manifestGates: ManifestGateSummary[] = [
    manifestSummary(
      "valid-sample",
      "Valid manifest (demo)",
      "data/source-inventory/datastore-ready-manifest.valid.sample.json",
      manifestValid,
      "Passerer manifest-gate — eksempel på godkjent import-rad, ikke deployet.",
    ),
    manifestSummary(
      "placeholder-sample",
      "Placeholder manifest (blokkert)",
      "data/source-inventory/datastore-ready-manifest.sample.json",
      manifestPlaceholder,
      "Bevisst ugyldig — viser hva som blokkeres før production-import.",
    ),
  ];

  const docLinks = [
    {
      label: "Datastore/source architecture v0.1",
      path: "docs/project/VIDDEL_DATASTORE_SOURCE_ARCHITECTURE_v0_1.md",
    },
    {
      label: "Source inventory automation v0.1",
      path: "docs/project/VIDDEL_SOURCE_INVENTORY_AUTOMATION_v0_1.md",
    },
    {
      label: "Datastore-ready manifest v0.1",
      path: "docs/project/VIDDEL_DATASTORE_READY_MANIFEST_v0_1.md",
    },
    {
      label: "Generated full registry snapshot",
      path: "data/source-inventory/source-registry.generated.full.v0.1.json",
    },
    {
      label: "Knowledge status full snapshot",
      path: "data/source-inventory/knowledge-status.full.v0.1.json",
    },
    {
      label: "Full Drive inventory snapshot",
      path: "data/source-inventory/drive-inventory.full.v0.1.json",
    },
    {
      label: "Expanded Drive snapshot sample (archive)",
      path: "data/source-inventory/drive-snapshot.expanded.sample.json",
    },
    {
      label: "Original 10-source snapshot sample (archive)",
      path: "data/source-inventory/drive-snapshot.sample.json",
    },
    {
      label: "Manifest placeholder sample",
      path: "data/source-inventory/datastore-ready-manifest.sample.json",
    },
    {
      label: "Manifest valid sample",
      path: "data/source-inventory/datastore-ready-manifest.valid.sample.json",
    },
  ];

  return {
    meta: visKnowledgeStatusMeta,
    statusCounts,
    reviewNeeds,
    manifestGates,
    docLinks,
    registryEntryCount: entries.length,
  };
}
