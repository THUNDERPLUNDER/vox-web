# Tech spike: Image vision bridge probe v0.1

Status: **Dev-only probe validated — not production**  
Follows: [TECH_SPIKE_IMAGE_INPUT_HEARING_AID_TROUBLESHOOTING_v0_1.md](./TECH_SPIKE_IMAGE_INPUT_HEARING_AID_TROUBLESHOOTING_v0_1.md)  
Context: INT-009 — hybrid bilde → tekst → Agent Search `:answer`

---

## Executive summary

**Provider choice:** **Vertex AI Gemini** (`generateContent`) via existing **`GOOGLE_SERVICE_ACCOUNT_JSON`** and **`CES_PROJECT_ID`** — same GCP project (`hearing-aid-mvp`) and auth path as Agent Search direct.

**Code added:** Dev-only library + CLI script. **No** changes to `/no/chat`, `/api/chat` contract, or production env.

**Probe status (2026-06-05, post-IAM):** Vision A–E return valid JSON. Full hybrid chain (bilde → JSON → `rag_query_text` → local `/api/chat`) validated for **B, C, D**. Production chat flow unchanged.

**Recommendation:** **Intern prototype / test mer** — do not build public upload UI; DPIA before any production feature.

---

## Provider choice

| Option | Verdict | Reason |
|--------|---------|--------|
| **Vertex AI Gemini** (`generateContent`) | **Selected** | Reuses `getGoogleAccessToken()` + `cloud-platform` scope; no new npm deps; EU location aligns with `CES_LOCATION=eu` |
| Google AI Studio API key | Not used | Would add separate secret surface; not in repo today |
| Discovery `:search` `imageQuery` | Not used | Wrong API — website/image search, not equipment interpretation |
| Assistant `addContextFile` | Not used | Separate integration spike; session file upload on Google side |

### Model status

| Model | Status in `europe-west1` / `hearing-aid-mvp` |
|-------|-----------------------------------------------|
| **`gemini-2.5-flash`** | **Works** — used for all successful probe runs |
| `gemini-2.0-flash-001` | **404 NOT_FOUND** — project has no access or model not available in region |

**Probe default:** `gemini-2.5-flash` (code default in `image-vision-bridge-v01.ts`). Override with `IMAGE_VISION_PROBE_MODEL` if a newer model is verified later.

**Why default changed:** `gemini-2.0-flash-001` fails on every run without env override (404). Dev-only probe code — no production surface. Lowest-risk fix: align default with what actually works in the project.

### IAM status

| Item | Status |
|------|--------|
| Service account | `viddel-ces-run-session@hearing-aid-mvp.iam.gserviceaccount.com` (local file — **not in repo**) |
| Required role | **`roles/aiplatform.user`** (`aiplatform.endpoints.predict`) |
| Before IAM fix | **403 PERMISSION_DENIED** on all scenarios |
| After IAM fix | **200** — vision JSON returned for A–E |

Same SA retains `discoveryengine.user` for `:answer` / CES channel.

---

## Required environment variables

| Variable | Required | Default / fallback |
|----------|----------|-------------------|
| `GOOGLE_SERVICE_ACCOUNT_JSON` | Yes | Same SA as CES / Agent Search |
| `CES_PROJECT_ID` | Yes | e.g. `hearing-aid-mvp` |
| `IMAGE_VISION_PROBE_LOCATION` | No | Falls back to `AGENT_SEARCH_LOCATION` → `CES_LOCATION`; **`eu` maps to `europe-west1`** for Vertex |
| `IMAGE_VISION_PROBE_MODEL` | No | **`gemini-2.5-flash`** |

**Not required for vision-only probe:** `AGENT_SEARCH_ENGINE_ID`, `VIDDEL_AI_BACKEND`.

**Optional chain to RAG (dev):** local Astro dev server with CES env + `--call-chat-url=http://localhost:4321/api/chat`.

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

# Vision + dev /api/chat chain (optional — start dev with CES env first)
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
  "model": "gemini-2.5-flash",
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
5. resolveViddelAiBackend() → CES channel or Agent Search (unchanged production path)
6. :answer with query.text + preamble + citations
```

**Important:** Production `/api/chat` accepts **text only**. The bridge **composes text from vision** — it does not send image bytes to `:answer`.

---

## Test scenarios

Use **stock/manufacturer/synthetic** images only — never real user photos in repo or commits. Images under `tmp/probe/` (gitignored).

| ID | Image | Scenario hint |
|----|-------|---------------|
| A | `scenario-a-charger-led-photo.png` | Ladeboks / statuslys |
| B | `scenario-b-dome-filter-photo.png` | Dome/filter ved svak lyd |
| C | `scenario-c-bluetooth-screen-photo.png` | Appskjerm / Bluetooth |
| D | `scenario-d-unclear-photo.png` | Uklart bilde |
| E | `scenario-e-device-label-photo.png` | Etikett / modell |

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

## Manual probe run — 2026-06-05 (post-IAM)

### Setup

| Item | Value |
|------|-------|
| Test images | `tmp/probe/scenario-{a..e}-*.png` (5 synthetic stock images, **gitignored**) |
| SA | `viddel-ces-run-session@hearing-aid-mvp.iam.gserviceaccount.com` (local — **not in repo**) |
| `CES_PROJECT_ID` | `hearing-aid-mvp` |
| `CES_LOCATION` | `eu` → **`europe-west1`** for Vertex |
| Model | **`gemini-2.5-flash`** |
| Dev chat chain | `http://localhost:4321/api/chat`, backend `ces_channel`, CES env on dev server |

### Vision result: **OK (all scenarios)**

| Scenario | Image | Duration | Vision JSON |
|----------|-------|----------|-------------|
| A — lader/LED | `scenario-a-charger-led-photo.png` | ~6.7 s | Received |
| B — dome/filter | `scenario-b-dome-filter-photo.png` | ~8.6 s | Received |
| C — appskjerm/BT | `scenario-c-bluetooth-screen-photo.png` | ~9–11 s | Received |
| D — uklart | `scenario-d-unclear-photo.png` | ~4.6–5.2 s | Received |
| E — etikett | `scenario-e-device-label-photo.png` | ~5.3 s | Received |

### Per-scenario evaluation (vision JSON)

| # | Criterion | A | B | C | D | E |
|---|-----------|---|---|---|---|---|
| 1 | Correct equipment type | ✅ ladeboks | ✅ tilbehør | ✅ appskjerm | ✅ tom (uklart) | ✅ høreapparat |
| 2 | Component / LED / screen | ✅ gult lys, PHONAK | ✅ dome + voksfilter | ✅ BT, «Not Connected» | ✅ avvist | ✅ dome, knapp, lys |
| 3 | Confidence calibrated | ✅ high | ✅ high | ✅ high | ✅ **low** (riktig) | ✅ high |
| 4 | Useful follow-up questions | ✅ 3 | ✅ 3–4 | ✅ 4 | ⚠️ 0–2 | ✅ 2 |
| 5 | Schema validity | ✅ | ✅ | ✅ | ✅ | ✅ |
| 6 | Good `rag_query_text` | ✅ | ✅ | ✅ | ✅ meta | ⚠️ generisk |
| 7 | Safety: equipment only | ✅ | ✅ | ✅ | ✅ | ✅ |
| 8 | Brand/model hallucination | ⚠️ Phonak (sannsynlig riktig på syntetisk bilde) | ✅ ingen merke | ⚠️ ReSound Nexia 9 RIE fra skjermtekst | ✅ ingen gjetting | ⚠️ Oticon ja, ikke full modell fra etikett |

**Scenario notes:**

- **A:** Phonak ladeboks, gult lys, `readable_text: "PHONAK"`.
- **B:** Dome/voksfilter, ingen merke, god feilsøkingskontekst.
- **C:** Leser skjerm: «ReSound Nexia 9 RIE, Not Connected» (+ Settings på re-run).
- **D:** Korrekt avvisning — ber om nytt bilde, tomme komponentfelt, `confidence: low`.
- **E:** Oticon + grønt lys; leser «oticon» men ikke full modell (f.eks. Real 1 miniRITE) fra etikett.

### `rag_query_text` assessment (A–E)

| Scen. | `rag_query_text` (typisk) | Vurdering |
|-------|---------------------------|-----------|
| **A** | «Hva betyr gult lys på Phonak ladeboks?» | ✅ Kort, norsk, RAG-vennlig. ⚠️ Corpus-gap på lader/LED (se nedenfor) |
| **B** | «Hvordan bytte voksfilter…? Hvordan feste dome…?» | ✅ Sterk — konkret how-to, bedre enn ren brukertekst |
| **C** | «ReSound Nexia 9 RIE Bluetooth tilkobling feilsøking iPhone» | ✅ Merke+modell+problem; god for RAG |
| **D** | «Vennligst ta et nytt, klart bilde av høreapparatutstyret…» | ✅ Meta-spørring — riktig når vision ikke kan identifisere |
| **E** | «Hvilken modell er dette Oticon høreapparatet…?» | ⚠️ OK, men kunne vært mer spesifikk (etikett-OCR uutnyttet) |

### `/api/chat` hybrid chain (local dev, B/C/D)

Dev server with CES env. **No changes to `/api/chat` or `/no/chat`.** Compare to simulated baseline/enriched lengths from prior ops run (production `/api/chat`, hand-crafted queries):

| Scenario | Hybrid HTTP | Answer len | Baseline len (sim) | Enriched len (sim) | Better than baseline? | Notes |
|----------|-------------|------------|--------------------|--------------------|-----------------------|-------|
| **B** | **200** | **277** | 583 | 1108 | **Yes** (277 > 0; shorter than sim-enriched but substantive) | Full hybrid chain OK |
| **C** (1st burst) | 502 | 0 | 650 | 859 | — | CES **429** rate limit |
| **C** (retry / final) | **200** | **754** | 650 | 859 | **Yes** (754 > 650) | 60 s pause; good BT troubleshooting answer |
| **D** (1st burst) | 502 | 0 | 78 | 1050 | — | CES **429** rate limit |
| **D** (final) | **200** | **256** | 78 | 1050 | **Yes** (256 >> 78; baseline often empty summary) | Rate limit cleared with pause |

**Rate limit:** Burst of vision+chat calls triggers CES **429**. Use **≥60 s pause** between hybrid probes. Does not block vision-only A–E.

**Quality (metadata only — no answer text logged):**

- **B:** Concrete dome/wax filter guidance expected from corpus; chain works end-to-end.
- **C:** Final run 754 chars — comparable to simulated enriched (859); Bluetooth reconnect content.
- **D:** Final run 256 chars — much better than baseline empty summary (78); appropriate “retake photo” guidance.

### Simulated RAG chain (reference — pre-vision, hand-crafted `rag_query_text`)

| Scenario | Baseline len | Enriched len | Better? | Notes |
|----------|-------------|--------------|---------|-------|
| A | 527 | 491 | No | Corpus gap: lader/LED weak in HearingNorwaystore |
| B | 583 | 1108 | **Yes** | Concrete dome/wax filter steps |
| C | 650 | 859 | **Yes** | Bluetooth reconnect / pairing |
| D | 78 | 1050 | **Yes** | Baseline empty summary; enriched asks for clearer equipment photo |
| E | 78 | 575 | **Yes** | Baseline empty; enriched Oticon model + manual pointer |

Real vision `rag_query_text` for B/C/D aligns with simulated enriched hypothesis.

### Safety assessment

| Aspect | Status |
|--------|--------|
| Utstyr-only scope | ✅ Ingen øre/hud/kropp-analyse i noen scenario |
| Uklart bilde (D) | ✅ `confidence: low`, avvisning + oppfordring om nytt bilde |
| Medisinsk innhold | ✅ `safety_notes` er praktisk utstyrshjelp |
| Hallusinasjon / over-tillit | ⚠️ A/C/E kan gi merke/modell med `high` — må valideres mot faktisk bilde i prototype |
| Personvern | ✅ Ingen bilder lagret/commitet; kun metadata i stdout |

### Corpus gap (lader/LED)

Scenario A: even enriched Phonak charger query did not outperform baseline in simulated RAG; sources weak on charging cases and indicator lights. Vision helps user **describe** the device, but **RAG stays weak until manual/content covers lader/LED**.

---

## Risks

| Risk | Mitigation |
|------|------------|
| Wrong model default (404) | Default **`gemini-2.5-flash`** in dev probe code |
| Missing Vertex IAM | `roles/aiplatform.user` documented; verified working |
| CES 429 on hybrid burst | ≥60 s between `--call-chat-url` runs |
| Wrong LED/model guess | `confidence` field; human review in prototype |
| Accidental prod deploy | Probe not called from `/api/chat` or pages |
| Public upload without DPIA | Explicit **no** — intern prototype only |

---

## Recommendation

| Action | Verdict |
|--------|---------|
| **Intern prototype** | **Yes** — next issue: Lab-only flow, no public upload |
| Merge probe code to main | **Yes** — dev-only, no prod surface |
| Enable upload in `/no/chat` | **No** |
| Public upload route | **No** |
| Bildelagring | **No** |
| DPIA before production | **Required** |
| Park? | **No** — vision + hybrid chain validated; proceed to controlled prototype |

**To @rigger/@navigator:**

1. IAM + `gemini-2.5-flash` are unblocked — probe runs out of the box on `hearing-aid-mvp`.
2. Open **intern prototype issue**: Lab-only image → vision → `rag_query_text` → `/api/chat`, with rate-limit spacing and QA matrix A–E.
3. Content: prioritize lader/LED corpus if scenario A matters in product.
4. Do **not** ship public upload until DPIA + safety review on D (unclear image) and brand/model overconfidence.

---

## Verification checklist

| Check | Status |
|-------|--------|
| Production `/no/chat` unchanged | Yes |
| `/api/chat` contract unchanged | Yes — probe is external caller |
| No image storage | Yes — in-memory only |
| No public upload route | Yes |
| No secrets/images in git | Yes — `tmp/probe/` gitignored |
| `npm run build` | Run before merge |
| Production `/lab/image-qa` uten flagg | **404** (default — `VIDDEL_LAB_PUBLIC_ENABLED` unset) |
| Production `/lab/image-qa` med flagg + auth | Login → **200** (option B, #237) |
| Preview `/lab/image-qa` | Lab login when `VIDDEL_LAB_PASSWORD` + `VIDDEL_LAB_COOKIE_SECRET` set |

---

## Mobile QA via Vercel Preview / Production Lab (#236 / #237)

Intern mobilkamera-QA: **Vercel Preview** (default) eller **Production med eksplisitt flagg** (option B).

**Canonical routes:** `/lab/image-qa`, `/api/lab/image-vision` (legacy `/dev/*` removed).

### Gate

| Miljø | Lab env | `/lab/image-qa` | `/api/lab/image-vision` |
|-------|---------|-----------------|-------------------------|
| Vercel **Production** | unset / no flag | **404** | **404** |
| Vercel **Production** | `VIDDEL_LAB_PUBLIC_ENABLED=true` + password + secret | Login → **200** | **401** uten cookie / **200** med cookie |
| Vercel **Preview** | unset | **404** | **404** |
| Vercel **Preview** | password + secret | Login → **200** | **401** uten cookie / **200** med cookie |
| Lokal dev | password + secret i `.env.local` | Same | Same |

Production er **404 by default**. Krever **`VIDDEL_LAB_PUBLIC_ENABLED=true`** + passord + cookie-secret for å åpne Lab. Image QA krever **Lab login** (HTTP-only HMAC cookie).

### Vercel Preview Environment — vars

Sett under **Project → Settings → Environment Variables → Preview**:

| Variable | Value / notes |
|----------|----------------|
| `VIDDEL_LAB_PASSWORD` | Delt intern passord (velg sterkt, unikt) |
| `VIDDEL_LAB_COOKIE_SECRET` | Tilfeldig lang hemmelighet for cookie-signering |
| `GOOGLE_SERVICE_ACCOUNT_JSON` | Same SA as CES (JSON string) |
| `CES_PROJECT_ID` | e.g. `hearing-aid-mvp` |
| `CES_LOCATION` | `eu` |
| `CES_APP_ID` | CES channel app ID |
| `CES_APP_VERSION_ID` | CES app version |
| `CES_DEPLOYMENT_ID` | CES deployment |
| `IMAGE_VISION_PROBE_MODEL` | `gemini-2.5-flash` (optional — default in code) |

Preview trenger **ikke** `VIDDEL_LAB_PUBLIC_ENABLED`.

**For optional `/api/chat` chain:** add `UPSTASH_REDIS_REST_URL` + `UPSTASH_REDIS_REST_TOKEN` if rate limits block chat.

### Vercel Production Lab setup (option B — eksplisitt opt-in)

Kun når Thomas bevisst vil teste Lab på `www.viddel.no`:

Sett under **Environment Variables → Production**:

| Variable | Value / notes |
|----------|----------------|
| `VIDDEL_LAB_PUBLIC_ENABLED` | **`true`** (påkrevd — uten denne: **404**) |
| `VIDDEL_LAB_PASSWORD` | Delt intern passord |
| `VIDDEL_LAB_COOKIE_SECRET` | Cookie-signering (annen verdi enn Preview anbefales) |
| `GOOGLE_SERVICE_ACCOUNT_JSON` | Same SA as CES |
| `CES_PROJECT_ID` | `hearing-aid-mvp` |
| `CES_LOCATION` | `eu` |
| `CES_APP_ID` | CES channel app ID |
| `CES_APP_VERSION_ID` | CES app version |
| `CES_DEPLOYMENT_ID` | CES deployment |
| `UPSTASH_REDIS_REST_URL` | For `/api/chat` chain on production |
| `UPSTASH_REDIS_REST_TOKEN` | For `/api/chat` chain on production |

**Fjern eller sett `VIDDEL_LAB_PUBLIC_ENABLED` tom** for å lukke Production Lab igjen (404) uten redeploy av kode.

### Test from mobile (Thomas)

**Preview (anbefalt):**

1. Push branch / open Preview deploy.
2. Confirm Lab + CES env vars in **Preview**.
3. On phone: `https://<preview-host>/lab/image-qa`
4. Enter Lab password → Bilde-QA UI.

**Production (option B):**

1. Set Production vars above including `VIDDEL_LAB_PUBLIC_ENABLED=true`.
2. Redeploy production.
3. On phone: `https://www.viddel.no/lab/image-qa`
4. Enter Lab password → test utstyr-bilde flow.
5. **Logg ut** when done.

Wait ~60 s between chat runs if CES 429.

### Confirm production default is closed

Without `VIDDEL_LAB_PUBLIC_ENABLED=true`:

- `https://www.viddel.no/lab/image-qa` → **404**
- `POST https://www.viddel.no/api/lab/image-vision` → **404**

---

*Probe v0.1 · INT-009 follow-up · manual run logged 2026-06-05 (post-IAM)*
