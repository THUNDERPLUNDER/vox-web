#!/usr/bin/env node
/* CONTRACT: Validate production datastore-ready manifest — gate before import (#228). */

import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { validateDatastoreManifest } from "../src/lib/source-registry.ts";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");

function parseArgs(argv) {
  let manifestPath = "data/source-inventory/datastore-ready-manifest.sample.json";
  for (let i = 2; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg.startsWith("--manifest=")) manifestPath = arg.slice("--manifest=".length);
  }
  return resolve(ROOT, manifestPath);
}

const manifestPath = parseArgs(process.argv);
const manifest = JSON.parse(readFileSync(manifestPath, "utf8"));
const issues = validateDatastoreManifest(manifest);

if (issues.length === 0) {
  console.log(`Manifest OK: ${manifestPath}`);
  console.log(`Importable entries: ${manifest.entries?.length ?? 0}`);
  process.exit(0);
}

console.error(`Manifest validation failed: ${manifestPath}`);
for (const issue of issues) {
  const id = issue.assetId ? ` [${issue.assetId}]` : "";
  console.error(`  - ${issue.code}${id}: ${issue.message}`);
}
process.exit(1);
