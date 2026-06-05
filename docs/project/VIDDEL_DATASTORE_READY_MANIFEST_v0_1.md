# Viddel datastore-ready manifest v0.1

Status: Import gate specification / #228  
Related: [#228](https://github.com/THUNDERPLUNDER/vox-web/issues/228)

---

## Rule

```text
Production Agent Search may only ingest assets listed in an approved datastore-ready manifest.
Raw Drive folders, manuals, transcripts and research notes must not be imported directly into production.
```

---

## Manifest shape (v0.1)

```json
{
  "version": "0.1",
  "rule": "...",
  "entries": [
    {
      "assetId": "asset-app-bluetooth-v01",
      "title": "App og Bluetooth — første feilsøking",
      "status": "datastore_ready",
      "sourceRegistryIds": ["src-..."],
      "approvedBy": "reviewer-id",
      "approvedAt": "2026-06-05T12:00:00.000Z",
      "target": "production_agent_search",
      "notes": "Optional"
    }
  ]
}
```

---

## Import requirements

An entry is importable **only if**:

1. `status` === `datastore_ready`
2. `approvedBy` is non-empty
3. `approvedAt` is non-empty
4. `sourceRegistryIds` is an array (may link registry rows)
5. `target` === `production_agent_search`
6. Notes do not mark entry as placeholder / not approved

Validator: `npm run source:manifest:check`

---

## Samples in repo

| File | Purpose |
|------|---------|
| `datastore-ready-manifest.sample.json` | Intentionally **fails** validation (demo gate) |
| `datastore-ready-manifest.valid.sample.json` | Passes validation (demo only, not prod) |

---

## Fast lane

Not implemented. Any future exception must be explicit, visible and governed — separate issue.

---

*End of document — v0.1*
