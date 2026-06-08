#!/usr/bin/env node
/* CONTRACT: Scaffold source registry from Drive metadata snapshot — heuristic v0.1 (#228). */

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import {
  CLASSIFIER_VERSION,
  scaffoldRegistryFromSnapshot,
  summarizeKnowledgeStatus,
} from "../src/lib/source-registry.ts";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");

function parseArgs(argv) {
  const args = {
    input: "data/source-inventory/drive-inventory.full.v0.1.json",
    out: "data/source-inventory/source-registry.generated.full.v0.1.json",
    statusOut: "data/source-inventory/knowledge-status.full.v0.1.json",
    summaryOut: "",
  };
  for (let i = 2; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg.startsWith("--input=")) args.input = arg.slice("--input=".length);
    else if (arg.startsWith("--out=")) args.out = arg.slice("--out=".length);
    else if (arg.startsWith("--status-out=")) args.statusOut = arg.slice("--status-out=".length);
    else if (arg.startsWith("--summary-out=")) args.summaryOut = arg.slice("--summary-out=".length);
  }
  return args;
}

function writeJson(path, data) {
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, `${JSON.stringify(data, null, 2)}\n`, "utf8");
}

function buildMarkdownSummary(status, registryPath) {
  return `# Source inventory scaffold summary

Generated: ${status.generatedAt}
Registry: \`${registryPath}\`
Classifier: ${CLASSIFIER_VERSION}

| Metric | Count |
|--------|------:|
| Total sources | ${status.totalSources} |
| files | ${status.files} |
| folders | ${status.folders} |
| empty folders | ${status.emptyFolders} |
| raw_original | ${status.rawOriginal} |
| machine_classified | ${status.machineClassified} |
| needs review | ${status.needsReview} |
| provisional_insight | ${status.provisionalInsight} |
| reviewed_insight | ${status.reviewedInsight} |
| canonical_guidance | ${status.canonicalGuidance} |
| datastore_ready | ${status.datastoreReady} |
| deprecated | ${status.deprecated} |
| stale/outdated | ${status.staleOrOutdated} |

> Full Drive inventory snapshot baseline — generated from Sheet export, not a live Drive dashboard.
`;
}

const args = parseArgs(process.argv);
const inputPath = resolve(ROOT, args.input);
const outPath = resolve(ROOT, args.out);
const statusPath = resolve(ROOT, args.statusOut);

const snapshotFile = JSON.parse(readFileSync(inputPath, "utf8"));
const snapshotRows = Array.isArray(snapshotFile) ? snapshotFile : snapshotFile.rows;
if (!Array.isArray(snapshotRows)) {
  console.error("Input must be a JSON array or an object with a rows array.");
  process.exit(1);
}

const { entries, generatedAt } = scaffoldRegistryFromSnapshot(snapshotFile, {
  snapshotSource: args.input,
});

const registry = {
  version: "0.1",
  generatedAt,
  snapshotSource: args.input,
  snapshotKind: Array.isArray(snapshotFile) ? "drive_snapshot" : snapshotFile.snapshotKind,
  snapshotSummary: Array.isArray(snapshotFile) ? undefined : snapshotFile.summary,
  classifierVersion: CLASSIFIER_VERSION,
  entries,
};

writeJson(outPath, registry);

const status = summarizeKnowledgeStatus(entries, { now: generatedAt });
writeJson(statusPath, status);

if (args.summaryOut) {
  const summaryPath = resolve(ROOT, args.summaryOut);
  writeFileSync(summaryPath, buildMarkdownSummary(status, args.out), "utf8");
  console.log(`Wrote ${summaryPath}`);
}

console.log(`Wrote ${outPath}`);
console.log(`Wrote ${statusPath}`);
console.log(
  JSON.stringify({
    totalSources: status.totalSources,
    machineClassified: status.machineClassified,
    needsReview: status.needsReview,
    datastoreReady: status.datastoreReady,
  }),
);
