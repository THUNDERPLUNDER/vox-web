# Viddel source inventory automation v0.1

Status: Operativ grunnmur / #228  
Dato: 2026-06-05  
Koblet til: [#228](https://github.com/THUNDERPLUNDER/vox-web/issues/228), [#226](https://github.com/THUNDERPLUNDER/vox-web/issues/226), [#227](https://github.com/THUNDERPLUNDER/vox-web/pull/227)  
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
| Knowledge status counts | **Yes** | `knowledge-status.sample.json` |
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

**Path:** `data/source-inventory/drive-snapshot.sample.json`

Export Drive metadata (manual or future script) to JSON array:

- `driveId`, `title`, `mimeType`, `url`, `createdTime`, `modifiedTime`, `pathHint`

Sample reflects safe-read from `INSIGHT_HEARING_AID` — **not** complete inventory.

---

## 5. Scaffold command

```bash
npm run source:inventory
```

Or explicitly:

```bash
node --experimental-strip-types scripts/source-inventory-scaffold.mjs \
  --input=data/source-inventory/drive-snapshot.sample.json \
  --out=data/source-inventory/source-registry.generated.sample.json \
  --status-out=data/source-inventory/knowledge-status.sample.json
```

**Outputs:**

- `source-registry.generated.sample.json` — registry scaffold
- `knowledge-status.sample.json` — VIS-readable status counts

---

## 6. Registry format (v0.1)

JSON file:

```json
{
  "version": "0.1",
  "generatedAt": "...",
  "snapshotSource": "data/source-inventory/drive-snapshot.sample.json",
  "classifierVersion": "v0.1-heuristic",
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

## 8. VIS status model (future)

`knowledge-status.sample.json` exposes:

- `totalSources`, `rawOriginal`, `machineClassified`, `needsReview`
- `provisionalInsight`, `reviewedInsight`, `canonicalGuidance`, `datastoreReady`, `deprecated`
- `staleOrOutdated`

**Follow-up:** VIS knowledge status panel v0.1 — read this JSON or regenerate on build.

---

## 9. Why raw Drive does not go to production

Manuals and mixed folders cause manualdump, conflicting brand advice, and unclear priority. Manifest gate ensures only explicit `datastore_ready` assets with approval metadata can be imported later.

---

## 10. Live Drive inventory (deferred)

No Drive API integration in v0.1. Next step: export script or scheduled snapshot → same JSON contract → `source:inventory`.

---

*End of document — v0.1*
