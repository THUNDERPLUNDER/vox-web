# Viddel source inventory automation v0.1

Status: Operativ grunnmur / #228  
Dato: 2026-06-05  
Koblet til: [#228](https://github.com/THUNDERPLUNDER/vox-web/issues/228), [#226](https://github.com/THUNDERPLUNDER/vox-web/issues/226), [#227](https://github.com/THUNDERPLUNDER/vox-web/pull/227), [#232](https://github.com/THUNDERPLUNDER/vox-web/issues/232), [#250](https://github.com/THUNDERPLUNDER/vox-web/issues/250)
Scope: Inventory scaffold + manifest gate — **ingen** datastore-import  

> **Note:** Architecture doc `VIDDEL_DATASTORE_SOURCE_ARCHITECTURE_v0_1.md` (#227) may land on `main` separately. This doc implements the operational v0.1 scaffold.

---

## 1. Production rule (locked)

```text
Production Agent Search may only ingest assets listed in an approved datastore-ready manifest.
Raw Drive folders, manuals, transcripts and research notes must not be imported directly into production.
```

Enforcement v0.1: **manifest validator script** (repo gate before future import tooling). Not wired to production runtime yet.

---

## 2. What is automated now

| Step | Automated? | How |
|------|------------|-----|
| Drive metadata → registry scaffold | **Yes** | `npm run source:inventory` |
| sourceType / brand heuristic | **Yes** | `src/lib/source-registry.ts` |
| verificationStatus (`machine_classified`) | **Yes** | Same |
| reviewNeed suggestion | **Yes** | Same |
| Knowledge status counts | **Yes** | `knowledge-status.full.v0.1.json` |
| Manifest validation | **Yes** | `npm run source:manifest:check` |
| Live Drive API inventory | **No** | Snapshot JSON contract only |
| Google Sheet registry | **No** | Follow-up |
| Production import | **No** | Blocked until manifest + import issue |

---

## 3. What still requires human promotion (HITL gates)

- `machine_classified` → `provisional_insight` / `reviewed_insight`
- `reviewed_insight` → `canonical_guidance`
- `canonical_guidance` → `datastore_ready`
- Manifest `approvedBy` / `approvedAt` for production import
- Deprecation (`deprecated`)

NO-HITL gjelder repetitivt scaffold-arbeid — ikke ansvar eller synlighet.

---

## 4. Inventory snapshot input

**Default path:** `data/source-inventory/drive-inventory.full.v0.1.json`

Inventory levels retained in repo:

- Narrow 10-source sample: early scaffold fixture only.
- Expanded 81-entry sample: #232 fixture from screenshots / Drive safe-read.
- Full Drive inventory snapshot: #250 baseline mirrored from Google Sheet `FULL_Inventory_v0.1`.

Original 10-source sample retained:

- `data/source-inventory/drive-snapshot.sample.json`
- `data/source-inventory/source-registry.generated.sample.json`
- `data/source-inventory/knowledge-status.sample.json`

Export Drive metadata (manual or future script) to a JSON array, or to an object with a `rows` array:

- `driveId`, `title`, `mimeType`, `url`, `createdTime`, `modifiedTime`, `pathHint`

Expanded sample reflects safe-read from screenshots / Drive safe-read across:

- `INSIGHT_HEARING_AID`
- `HEARING_AID_MANUALS`
- `HEARING_AID_MANUALS/01_ORIGINALS/{Oticon,Phonak,ReSound}`
- `HEARING_AID_MANUALS/02_SONIC_KNOWLEDGE/{Oticon,Phonak,ReSound}`
- `Markedsvalidering 2026`
- `Inspirasjon helsevesen`

It is broader than the original 10-source sample, but still **not** a complete live Drive inventory.

Full snapshot is the current baseline for VIS/source-status work:

- `data/source-inventory/drive-inventory.full.v0.1.json`
- 490 rows total
- 414 files
- 76 folders
- 17 empty folders

The full snapshot was exported mechanically from the source Google Sheet tab `FULL_Inventory_v0.1`. It is not a live Drive API dashboard, does not move or import Drive files, and does not imply datastore readiness.

---

## 5. Scaffold command

```bash
npm run source:inventory
```

Or explicitly:

```bash
node --experimental-strip-types scripts/source-inventory-scaffold.mjs \
  --input=data/source-inventory/drive-inventory.full.v0.1.json \
  --out=data/source-inventory/source-registry.generated.full.v0.1.json \
  --status-out=data/source-inventory/knowledge-status.full.v0.1.json
```

**Outputs:**

- `source-registry.generated.full.v0.1.json` — registry scaffold
- `knowledge-status.full.v0.1.json` — VIS-readable status counts

---

## 6. Registry format (v0.1)

JSON file:

```json
{
  "version": "0.1",
  "generatedAt": "...",
  "snapshotSource": "data/source-inventory/drive-inventory.full.v0.1.json",
  "classifierVersion": "v0.3-full-inventory-heuristic",
  "entries": [ /* SourceRegistryEntry */ ]
}
```

Types: `src/data/source-registry/source-types.ts`  
Logic: `src/lib/source-registry.ts`

---

## 7. Manifest gate

**Sample (fails validation):** `data/source-inventory/datastore-ready-manifest.sample.json`  
**Valid demo:** `data/source-inventory/datastore-ready-manifest.valid.sample.json`

```bash
npm run source:manifest:check
# validates data/source-inventory/datastore-ready-manifest.valid.sample.json

node --experimental-strip-types scripts/validate-datastore-manifest.mjs \
  --manifest=data/source-inventory/datastore-ready-manifest.sample.json
# expect failure — placeholder manifest demo
```

See also: `docs/project/VIDDEL_DATASTORE_READY_MANIFEST_v0_1.md`

---

## 8. VIS status model

`knowledge-status.full.v0.1.json` exposes:

- `totalSources`, `rawOriginal`, `machineClassified`, `needsReview`
- `provisionalInsight`, `reviewedInsight`, `canonicalGuidance`, `datastoreReady`, `deprecated`
- `staleOrOutdated`
- `directProductionImport`
- `files`, `folders`, `emptyFolders`

VIS knowledge status panel v0.1 reads the full snapshot baseline. It must not be described as live Drive inventory or production datastore state.

## 8.1 Classification additions in #232

Classifier v0.2 adds explicit buckets for:

- `market_validation` / `strategic_research` — strategy, market, value-chain, competitor and partner insight. Not direct user-answer material unless rewritten as canonical Viddel guidance and manifest-approved.
- `inspiration_context` — contextual/inspiration material. Not a default datastore candidate.
- `audio` — raw audio material. Requires `needs_transcript`.
- duplicate/derived hints — simple normalized-title detection for PDF + Google Doc pairs. This is not a full dedupe system.

All generated entries set `directProductionImport: false`.

## 8.2 Full inventory additions in #250

Classifier v0.3 accepts the full Sheet export shape:

- `rows` wrapper with spreadsheet metadata
- `name` / `path` fields from `FULL_Inventory_v0.1`
- file/folder metadata: `type`, `parentPath`, `fileCountDirect`, `folderCountDirect`, `recursiveFileCount`, `isEmptyFolder`
- source-pool hints including `user_guidance_candidate`

The previous 10-source and 81-entry files remain in repo as samples/archive fixtures, but they are no longer the current VIS/source-status baseline.

---

## 9. Why raw Drive does not go to production

Manuals and mixed folders cause manualdump, conflicting brand advice, and unclear priority. Manifest gate ensures only explicit `datastore_ready` assets with approval metadata can be imported later.

---

## 10. Live Drive inventory (deferred)

No live Drive API integration in v0.1. Next step: export script or scheduled snapshot → same JSON contract → `source:inventory`.

---

*End of document — v0.1*
