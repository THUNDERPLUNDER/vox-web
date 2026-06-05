# Tech spike: Image vision bridge probe v0.1

Status: **Dev-only probe added — not production**  
Follows: [TECH_SPIKE_IMAGE_INPUT_HEARING_AID_TROUBLESHOOTING_v0_1.md](./TECH_SPIKE_IMAGE_INPUT_HEARING_AID_TROUBLESHOOTING_v0_1.md)  
Context: INT-009 — hybrid bilde → tekst → Agent Search `:answer`

---

## Executive summary

**Provider choice:** **Vertex AI Gemini** (`generateContent`) via existing **`GOOGLE_SERVICE_ACCOUNT_JSON`** and **`CES_PROJECT_ID`** — same GCP project (`hearing-aid-mvp`) and auth path as Agent Search direct.

**Code added:** Yes — dev-only library + CLI script. **No** changes to `/no/chat`, `/api/chat` contract, or production env.

**Recommendation:** Run manual probe locally with **stock/synthetic equipment photos** for scenarios A/B/C; if JSON quality is good, chain with `--call-chat-url=http://localhost:4321/api/chat` in dev only. Do **not** expose upload UI until privacy review.

---

## Provider choice

| Option | Verdict | Reason |
|--------|---------|--------|
| **Vertex AI Gemini** (`generateContent`) | **Selected** | Reuses `getGoogleAccessToken()` + `cloud-platform` scope; no new npm deps; EU location aligns with `CES_LOCATION=eu` |
| Google AI Studio API key | Not used | Would add separate secret surface; not in repo today |
| Discovery `:search` `imageQuery` | Not used | Wrong API — website/image search, not equipment interpretation |
| Assistant `addContextFile` | Not used | Separate integration spike; session file upload on Google side |

**Default model:** `gemini-2.0-flash-001` (override with `IMAGE_VISION_PROBE_MODEL`).

**IAM note:** Service account needs **`roles/aiplatform.user`** on `hearing-aid-mvp` for Vertex `generateContent` (`aiplatform.endpoints.predict`). Verified 2026-06-05: `viddel-ces-run-session@…` returns **403 PERMISSION_DENIED** without this role. Same SA has `discoveryengine.user` for `:answer`.

---

## Required environment variables

| Variable | Required | Default / fallback |
|----------|----------|-------------------|
| `GOOGLE_SERVICE_ACCOUNT_JSON` | Yes | Same SA as CES / Agent Search |
| `CES_PROJECT_ID` | Yes | e.g. `hearing-aid-mvp` |
| `IMAGE_VISION_PROBE_LOCATION` | No | Falls back to `AGENT_SEARCH_LOCATION` → `CES_LOCATION`; **`eu` maps to `europe-west1`** for Vertex |
| `IMAGE_VISION_PROBE_MODEL` | No | `gemini-2.0-flash-001` |

**Not required for vision-only probe:** `AGENT_SEARCH_ENGINE_ID`, `VIDDEL_AI_BACKEND`.

**Optional chain to RAG (dev):** local Astro dev server + `VIDDEL_AI_BACKEND=google_agent_search_direct` when using `--call-chat-url`.

---

## Code added

| File | Role |
|------|------|
| `src/lib/image-vision-bridge-v01.ts` | Prompt, JSON schema parse, Vertex `generateContent` call |
| `scripts/image-vision-bridge-probe.mjs` | CLI — read local image, print JSON, optional `/api/chat` POST |
| `package.json` | Script `image:vision-probe` |

**Not added:** public upload route, UI, image storage, production env vars.

### Run locally

```bash
# Validate env + args (no API call)
npm run image:vision-probe -- --dry-run --image=/path/to/stock-charger.jpg

# Vision only → stdout JSON
npm run image:vision-probe -- \
  --image=/path/to/stock-charger.jpg \
  --scenario=A \
  --user-problem="Laderen blinker gult"

# Vision + dev /api/chat chain (optional)
npm run dev
# separate terminal:
npm run image:vision-probe -- \
  --image=/path/to/stock-charger.jpg \
  --scenario=A \
  --call-chat-url=http://localhost:4321/api/chat
```

---

## JSON output shape

Vision step returns (and CLI prints under `vision`):

```json
{
  "visible_device_type": "charging_case",
  "possible_brand": "Phonak",
  "visible_component": "status LED on charging case",
  "visible_status_light": "solid amber",
  "readable_text": "Phonak",
  "confidence": "medium",
  "likely_user_problem": "User unsure what amber LED on charger means",
  "suggested_followup_questions": [
    "Vet du hvilket merke ladeetuiet er?",
    "Blinker lyset eller lyser det fast?"
  ],
  "safety_notes": [
    "Praktisk utstyrshjelp — ikke medisinsk vurdering."
  ],
  "rag_query_text": "Phonak ladeetui: hva betyr fast amber statuslys, og hva er neste feilsøkingstrinn?"
}
```

CLI envelope:

```json
{
  "probeVersion": "v0.1",
  "model": "gemini-2.0-flash-001",
  "durationMs": 1234,
  "scenario": "A",
  "vision": { "...": "..." },
  "chatProbe": {
    "message": "<rag_query_text>",
    "sessionId": "probe-vision-bridge-v01"
  },
  "chatResult": {
    "httpStatus": 200,
    "ok": true,
    "error": null,
    "answerTextLength": 842
  }
}
```

`chatResult` only when `--call-chat-url` is set. **Never log full answer text** in probe logs beyond length metadata in structured output.

---

## How output feeds existing `/api/chat` → `:answer`

```text
1. User takes equipment photo (future UI — not built)
2. Vision probe / service: analyzeEquipmentImage() → ImageVisionBridgeResult
3. Take result.rag_query_text (Norwegian, RAG-oriented)
4. POST /api/chat { message: rag_query_text, sessionId }
5. resolveViddelAiBackend() → runAgentSearchAnswer({ message })
6. :answer with query.text + preamble + citations (unchanged production path)
```

**Important:** Production `/api/chat` accepts **text only**. The bridge **composes text from vision** — it does not send image bytes to `:answer`.

Optional enrichment (future): prepend `userProblem` or append structured fields as bullet context inside `message` — keep under `CHAT_MAX_MESSAGE_LENGTH` (2000).

---

## Test scenarios

Use **stock/manufacturer/synthetic** images only — never real user photos in repo or commits.

### A — Ladeboks / statuslys

```bash
npm run image:vision-probe -- --image=./tmp/probe/scenario-a-charger.jpg --scenario=A \
  --user-problem="Hva betyr det gule lyset på laderen?"
```

**Expect:** `visible_device_type` ≈ charger/case; `visible_status_light` populated; `rag_query_text` asks about LED meaning.

### B — Dome/filter ved svak lyd

```bash
npm run image:vision-probe -- --image=./tmp/probe/scenario-b-dome.jpg --scenario=B \
  --user-problem="Hører veldig dårlig, kan det være filteret?"
```

**Expect:** `visible_component` mentions dome/wax filter; follow-up questions on replacement/cleaning.

### C — Appskjerm / telefon + apparat

```bash
npm run image:vision-probe -- --image=./tmp/probe/scenario-c-bluetooth.jpg --scenario=C \
  --user-problem="Appen finner ikke høreapparatet"
```

**Expect:** `readable_text` from screen if legible; `rag_query_text` about Bluetooth pairing troubleshooting.

---

## Privacy and safety constraints

| Rule | Implementation |
|------|----------------|
| No image storage | Script reads file once, base64 in memory, discarded after request |
| No production route | CLI only; not imported by Astro pages |
| Equipment only | Prompt rejects body/ear/skin; `safety_notes` on misuse |
| No medisinsk analyse | Explicit in prompt + `safety_notes` |
| No prompt/answer logging | Script prints JSON to stdout; do not pipe to logs in CI |
| No secrets in output | Never print `GOOGLE_SERVICE_ACCOUNT_JSON` |
| DPIA before product | Required before any user-facing upload |

---

## Risks

| Risk | Mitigation |
|------|------------|
| Missing Vertex IAM | Document `aiplatform.user`; fail fast with HTTP status in error |
| Wrong LED/model guess | `confidence` field; human review before trusting RAG query |
| WebP support | Prefer JPEG/PNG for probes; WebP may vary by model |
| Accidental prod deploy | Script not in build guards; not called from `/api/chat` |
| `--call-chat-url` to production | Operator responsibility — use localhost only in spike |

---

## Recommendation

| Action | Verdict |
|--------|---------|
| Merge probe code to main | **Yes** — dev-only, no prod surface |
| Enable upload in `/no/chat` | **No** |
| Next issue | Manual QA matrix A/B/C + compare RAG answers with/without vision-enriched query |
| Alternative spike | Assistant `addContextFile` only if Vertex vision quality insufficient |

**To @rigger/@navigator:** Run `npm run image:vision-probe -- --dry-run --image=…` after setting env locally. Confirm Vertex IAM on `viddel-ces-run-session@…`. First real run should use stock photos under `tmp/probe/` (gitignored). If `rag_query_text` quality is good, test `--call-chat-url` against local dev with direct backend — still no production change.

---

## Verification checklist

| Check | Status |
|-------|--------|
| Production `/no/chat` unchanged | Yes — no edits |
| `/api/chat` contract unchanged | Yes — probe is external caller |
| No image storage | Yes — in-memory only |
| No public upload route | Yes |
| `npm run build` | Run after merge |

---

## Manual probe run — 2026-06-05

### Setup

| Item | Value |
|------|-------|
| Test images | `tmp/probe/scenario-{a..e}-*.png` (5 synthetic stock images, gitignored) |
| SA used locally | `viddel-ces-run-session@hearing-aid-mvp.iam.gserviceaccount.com` (from local file — **not in repo**) |
| `CES_PROJECT_ID` | `hearing-aid-mvp` |
| `CES_LOCATION` | `eu` → mapped to **`europe-west1`** for Vertex (`eu-aiplatform` returns **404**) |

### Vertex result: **BLOCKED (403 IAM)**

All five scenarios failed before vision JSON was returned:

```text
vertex_generate_content_failed:403
Permission 'aiplatform.endpoints.predict' denied on resource
'//aiplatform.googleapis.com/projects/hearing-aid-mvp/locations/europe-west1/publishers/google/models/gemini-2.0-flash-001'
```

| Scenario | Image | Probe exit | Vision JSON |
|----------|-------|------------|-------------|
| A — lader/LED | `scenario-a-charger-led-photo.png` | 403 | Not received |
| B — dome/filter | `scenario-b-dome-filter-photo.png` | 403 | Not received |
| C — appskjerm/BT | `scenario-c-bluetooth-screen-photo.png` | 403 | Not received |
| D — uklart | `scenario-d-unclear-photo.png` | 403 | Not received |
| E — etikett | `scenario-e-device-label-photo.png` | 403 | Not received |

**IAM fix required:** grant `roles/aiplatform.user` (includes `aiplatform.endpoints.predict`) to `viddel-ces-run-session@hearing-aid-mvp.iam.gserviceaccount.com` on project `hearing-aid-mvp`. Re-run probe after IAM propagate (~few minutes).

**Note:** Using Discovery location `eu` directly against `eu-aiplatform.googleapis.com` yields **404 HTML** — not a model error. Probe maps `eu` → `europe-west1` for Vertex.

### `--call-chat-url` (B, C, D)

**Not run** — requires successful vision step to produce real `rag_query_text`. Dev server chain deferred until IAM unblocks Vertex.

### Simulated RAG chain (prior run — production `/api/chat`, hand-crafted `rag_query_text`)

Baseline user text vs. enriched query **as if** vision succeeded (ops token, no content logging):

| Scenario | Baseline len | Enriched len | Better? | Notes |
|----------|-------------|--------------|---------|-------|
| A | 527 | 491 | No | Corpus gap: lader/LED weak in HearingNorwaystore |
| B | 583 | 1108 | **Yes** | Concrete dome/wax filter steps |
| C | 650 | 859 | **Yes** | Bluetooth reconnect / pairing |
| D | 78 | 1050 | **Yes** | Baseline empty summary; enriched asks for clearer equipment photo |
| E | 78 | 575 | **Yes** | Baseline empty; enriched Oticon model + manual pointer |

This supports the **hybrid architecture** hypothesis but is **not** a substitute for real vision JSON quality/safety review.

### Per-scenario evaluation template (fill after IAM fix)

| # | Criterion | A | B | C | D | E |
|---|-----------|---|---|---|---|---|
| 1 | Correct equipment type | — | — | — | — | — |
| 2 | Component / LED / screen | — | — | — | — | — |
| 3 | Confidence calibrated | — | — | — | — | — |
| 4 | Useful follow-up questions | — | — | — | — | — |
| 5 | Good `rag_query_text` | — | — | — | — | — |
| 6 | `/api/chat` better than baseline | partial (sim) | partial (sim) | partial (sim) | partial (sim) | partial (sim) |
| 7 | Safety: equipment only | — | — | — | — | — |
| 8 | Brand/model hallucination | — | — | — | — | — |

### Corpus gap (lader/LED)

Scenario A (simulated RAG): even enriched Phonak charger query did not outperform baseline; baseline explicitly stated charger LEDs are **not in sources**. Vision may help user describe the device, but **RAG will stay weak until manual/content covers charging cases and indicator lights**.

### Recommendation (post-run)

| Verdict | **Test mer** — do not build UI yet |
|---------|-------------------------------------|
| Blocker | `roles/aiplatform.user` on probe SA |
| Next | IAM fix → re-run 5 vision probes → B/C/D with `--call-chat-url=http://localhost:4321/api/chat` |
| Then | Compare real `rag_query_text` vs. baseline; review safety on D (unclear image) |
| Park? | No — simulated RAG shows value; only Vertex IAM blocks completion |

---

*Probe v0.1 · INT-009 follow-up · manual run logged 2026-06-05*
