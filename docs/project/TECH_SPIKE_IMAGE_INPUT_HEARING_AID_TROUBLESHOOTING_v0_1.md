# Tech spike: Image input for hearing-aid troubleshooting v0.1

Status: **Spike complete — no production changes**  
Context: INT-009 (Per-Arne) — bildebasert hjelp for høreapparatfeilsøking  
Related: [#217](https://github.com/THUNDERPLUNDER/vox-web/issues/217) response contract, [#228](https://github.com/THUNDERPLUNDER/vox-web/pull/229) source trust, `VIDDEL_AI_BACKEND=google_agent_search_direct`

---

## Executive summary

**Recommendation: test manually first — do not build image upload in production chat now.**

Today's Viddel production chat path is **text-only** end-to-end: browser → `POST /api/chat` `{ message, sessionId }` → Google Agent Search `:answer` with `query.text`. There is **no image field** in our request contract, no multipart API route, and no server-side image handling.

Google Discovery Engine **`servingConfigs.answer`** (`AnswerQueryRequest`) accepts **`query.text` only** — not `imageQuery`. Image bytes are supported on a **different endpoint**: **`servingConfigs.search`** (`SearchRequest.imageQuery`). Google also exposes **Assistant** APIs (`sessions.addContextFile`, `assistants.assist` / `streamAssist` with `fileIds`) that can attach files to a session — but Viddel does **not** use these today.

**Precise conclusion:** **Dagens `:answer`-flow støtter ikke bildeinput direkte.** That does **not** mean “Google Agent Search has no image/file APIs” — other endpoints exist, but they are not our current production grounded Q&A path.

A **hybrid architecture** remains the realistic path for INT-009 on today's stack: multimodal pre-step → structured text → existing `:answer` RAG.

**Next step:** dev-only manual probe with synthetic/stock device photos — not user uploads in prod.

---

## Primary evidence from Google Cloud documentation

This section is the **authoritative API evidence** for the spike. Repo code confirms what we actually call; Google REST/RPC reference defines what each endpoint accepts.

### 1. Offisielle Google Cloud-sider sjekket

| # | Dokument | URL | Hva vi hentet derfra |
|---|----------|-----|----------------------|
| 1 | **`servingConfigs.answer` (REST v1)** | https://cloud.google.com/generative-ai-app-builder/docs/reference/rest/v1/projects.locations.collections.engines.servingConfigs/answer | Full `AnswerQueryRequest` body fields; IAM `discoveryengine.servingConfigs.answer` |
| 2 | **`servingConfigs.search` (REST v1)** | https://cloud.google.com/generative-ai-app-builder/docs/reference/rest/v1/projects.locations.collections.engines.servingConfigs/search | `SearchRequest` incl. `imageQuery`; IAM `discoveryengine.servingConfigs.search` |
| 3 | **Image search guide** | https://cloud.google.com/generative-ai-app-builder/docs/image-search | `imageQuery.imageBytes` + `params.search_type=1`; website image search use case |
| 4 | **Conversational search MCP reference** (`AnswerQueryRequest.Query`) | https://cloud.google.com/generative-ai-app-builder/docs/reference/mcp/conversational_search | `Query` content union = `text` only |
| 5 | **Discovery Engine RPC overview** | https://cloud.google.com/generative-ai-app-builder/docs/reference/rpc | Service map: `ConversationalSearchService` vs `SearchService` vs `AssistantService` |
| 6 | **RPC `google.cloud.discoveryengine.v1`** | https://cloud.google.com/generative-ai-app-builder/docs/reference/rpc/google.cloud.discoveryengine.v1 | `Query`, `ImageQuery`, `AddContextFileRequest`, `AssistRequest` message defs |
| 7 | **Gemini Enterprise — upload file + streamAssist (Preview)** | https://cloud.google.com/gemini/enterprise/docs/get-answers-from-streamassist | `sessions/{session}:addContextFile` + `assistants/...:streamAssist` with `fileIds` |

**Also checked (repo, secondary):** `GOOGLE_AGENT_SEARCH_DIRECT_KNOWN_GOOD_v0_1.md`, `src/lib/agent-search-answer.ts`.

---

### 2. Request-felter i `servingConfigs.answer` (`AnswerQueryRequest`)

Official REST body for `POST …/servingConfigs/*:answer`:

| Field | Type | Notes |
|-------|------|-------|
| `query` | `Query` | **Required.** Current user query |
| `session` | `string` | Optional; sessionless if omitted |
| `safetySpec` | `SafetySpec` | Optional |
| `relatedQuestionsSpec` | `RelatedQuestionsSpec` | Optional |
| `groundingSpec` | `GroundingSpec` | Optional — Viddel sets `includeGroundingSupports: true` |
| `answerGenerationSpec` | `AnswerGenerationSpec` | Optional — Viddel sets citations + `promptSpec.preamble` |
| `searchSpec` | `SearchSpec` | Optional — nested search configuration for answer path |
| `queryUnderstandingSpec` | `QueryUnderstandingSpec` | Optional |
| `asynchronousMode` | `boolean` | Deprecated |
| `userPseudoId` | `string` | Optional |
| `userLabels` | `map` | Optional |
| `endUserSpec` | `EndUserSpec` | Optional |

**Not present at top level:** `imageQuery`, `imageBytes`, `fileIds`, `fileContents`, multipart upload.

Nested **`Query`** (used by `:answer` and Assistant APIs):

```json
{
  "queryId": "string",
  "text": "string"
}
```

Official docs: content union for `Query` is **`text` only** — no `imageQuery` branch.

---

### 3. Finnes `imageQuery` i `servingConfigs.answer`?

**Nei.**

- `AnswerQueryRequest` REST reference lists no `imageQuery` field.
- Nested `Query` object accepts **`text` only** (MCP conversational search reference + RPC `google.cloud.discoveryengine.v1.Query`).

Viddel code matches this: `query: { text: message }` in `buildAnswerRequestBody()`.

---

### 4. Hvor finnes `imageQuery`?

**I `servingConfigs.search` (`SearchRequest`), ikke i `:answer`.**

Official `SearchRequest` fields include:

| Relevant field | Purpose |
|----------------|---------|
| `query` | Raw **text** search query |
| `imageQuery` | Raw **image** query (`ImageQuery`) |
| `params.searchType` | Doc: value `1` enables **image searching** (non-webpage mode) |
| `session` | Optional — multi-turn search or coordination with `:answer` |
| `contentSearchSpec`, `summarySpec`, … | Search/summary configuration |

**`ImageQuery`** (RPC v1):

- Union field `image` → `image_bytes` (base64)
- Formats: **JPEG, PNG, BMP**

Guide: https://cloud.google.com/generative-ai-app-builder/docs/image-search

---

### 5. Hvorfor dekker ikke `servingConfigs.search` vårt nåværende grounded Q&A-behov?

Viddel production bruker **`servingConfigs.answer`** mot engine `h-rehjelpen-v1-2_…` med HearingNorwaystore — for **grounded conversational answers** med citations (`answerText`, `groundingMetadata`), Viddel response preamble (#217), og stabil `/api/chat`-kontrakt.

`:search` — også med `imageQuery` — er et **annet produktlag**:

| | **`servingConfigs.answer` (Viddel i dag)** | **`servingConfigs.search` (+ imageQuery)** |
|---|---------------------------------------------|--------------------------------------------|
| **Primary output** | Generated **answer** + grounding/citations | **Search results** (documents / website images) |
| **Input** | `Query.text` | `query` (text) **or** `imageQuery.imageBytes` |
| **Documented image use** | None on `:answer` | **Website image search** — find images on indexed websites matching text or image query |
| **Our datastore** | HearingNorwaystore manuals/articles via answer grounding | Not wired; image search guide targets **website** apps with Enterprise image search |
| **Our code path** | `runAgentSearchAnswer()` → `:answer` | **Not implemented** |
| **INT-009 need** | “What does this LED mean — next troubleshooting step from manuals” | “Find similar images on the web” — wrong abstraction |

Google docs describe optional **session coordination** (call `:search` first, then `:answer` with same session so answer uses search results). That is still **not** “pass user photo into `:answer`”; it adds a second API, different IAM (`discoveryengine.servingConfigs.search`), and is **Private GA / allowlist** for multi-turn search in some doc versions — not validated in Viddel.

**Bottom line:** `:search` + `imageQuery` does **not** drop into our existing grounded Q&A flow without a new integration design and likely wrong semantics for equipment troubleshooting against manual corpora.

---

### 6. Andre relevante Google Agent Search / Assistant-veier (filer / kontekst)

Google Discovery Engine exposes **AssistantService** methods separate from our `:answer` integration:

| API | Endpoint pattern | File / image relevance | Viddel status |
|-----|------------------|------------------------|---------------|
| **`sessions.addContextFile`** | `POST …/sessions/{session}:addContextFile` | Upload **file contents inline** (`fileName`, `mimeType`, base64 `fileContents`); returns `file_id` | **Not used** |
| **`assistants.assist`** | `POST …/assistants/{assistant}:assist` | Accepts `query` + optional `file_ids[]`; empty query allowed if files provided | **Not used** |
| **`assistants.streamAssist`** | `POST …/assistants/{assistant}:streamAssist` | Same pattern; streaming; Gemini Enterprise guide shows file upload flow | **Not used** |
| **`sessions.removeContextFile` / `selectContextFiles`** | Session file management | v1alpha extras | **Not used** |

**Evidence (RPC v1 `AssistRequest`):**

- `file_ids[]` — “IDs of the files to be used for answering the request” (from `AddContextFileResponse.file_id`)
- `query` — optional; **empty query supported if `file_ids` are provided**

**Evidence (RPC v1 `AddContextFileRequest`):**

- `file_contents` (bytes) inline upload to session
- IAM: `discoveryengine.sessions.addContextFile`

**Gemini Enterprise guide (Preview):** upload file → `addContextFile` → `streamAssist` with `fileIds` + text query.

**Implications for INT-009:**

- These are **real Google file-context paths**, distinct from `:answer` `query.text`.
- They would require **new backend** (Assistant API, session file storage on Google side, new IAM, new response parsing) — not a field addition to current `runAgentSearchAnswer()`.
- Preview/Enterprise tier assumptions may differ from our Search engine + `:answer` setup.
- **Privacy:** uploads go to Google session context — needs DPIA before product use; conflicts with “do not store images” unless carefully scoped.

**CES widget `enable-file-upload`** (article shell) is a **third** path — widget-internal to Google CES, not Agent Search direct — and not present on `/no/chat`.

---

### 7. Presis konklusjon (API-nivå vs produkt-nivå)

| Statement | Valid? |
|-----------|--------|
| **“Dagens `:answer`-flow støtter ikke bildeinput direkte.”** | **Ja** — documented `Query.text` only; Viddel sends text only |
| **“Google Agent Search støtter ikke bilde.”** | **Nei (for bred)** — `SearchRequest.imageQuery` exists on `:search`; Assistant APIs accept session files |
| **“Viddel kan legge til bilde i production chat uten ny integrasjon.”** | **Nei** |
| **“Hybrid vision → text → `:answer` er fortsatt riktig første vei.”** | **Ja** — minste endring mot validated production path |

**`answerGenerationSpec.multimodalSpec`** on `:answer` refers to **images returned in the answer** (output source), not user photo input — do not misread as upload support.

---

## Current architecture findings

### Production chat flow (unchanged by this spike)

| Layer | Finding |
|-------|---------|
| UI `/no/chat` | Textarea + example seeds; `fetch("/api/chat", { message, sessionId })` — JSON only |
| `src/pages/api/chat.ts` | Parses JSON; rejects empty/non-string `message`; max 2000 chars; **no multipart** |
| Backend router | `resolveViddelAiBackend()` → `google_agent_search_direct` or `ces_channel` |
| Agent Search direct | `runAgentSearchAnswer()` → `buildAnswerRequestBody()` |
| CES fallback | `runCesSession()` → `inputs: [{ text: message }]` |

### Agent Search direct request (actual code)

```103:124:src/lib/agent-search-answer.ts
function buildAnswerRequestBody(config: AgentSearchEnvConfig, message: string): Record<string, unknown> {
  const body: Record<string, unknown> = {
    query: { text: message },
    groundingSpec: {
      includeGroundingSupports: true,
    },
    answerGenerationSpec: {
      ignoreAdversarialQuery: true,
      ignoreNonAnswerSeekingQuery: false,
      includeCitations: true,
      promptSpec: {
        preamble: VIDDEL_RESPONSE_PREAMBLE,
      },
    },
  };
  // ...
}
```

- Endpoint: `POST …/servingConfigs/{config}:answer`
- Content-Type: `application/json`
- Input type: `AgentSearchAnswerInput = { message: string }`

### CES widget file upload (not production standalone chat)

- `ArticleInlineChatShell.astro` and `/no/sandbox/chat-shell` use `<chat-messenger-container enable-file-upload>` — **Google CES widget**, not `/api/chat`.
- Standalone `/no/chat` (production path validated post-#217) does **not** expose file upload.
- CES `runSession` body is text-only in our wrapper.

### Observability / privacy (relevant if images are added later)

- `src/lib/chat-usage-metrics.ts` — drift signals only; **no message content**
- `src/pages/api/chat.ts` — logs metadata buckets on error/success; **no prompt/answer text**
- Backstage operating rules: **no prompt/answer logging**
- Adding images would require explicit DPIA/consent review (new data category, retention, processor mapping)

### Existing codebase inventory

| Capability | Present? | Notes |
|------------|----------|-------|
| Upload UI in prod chat | **No** | Text only on `/no/chat` |
| Upload in CES article shell | **Yes** | Widget-owned; out of scope unless CES path revived |
| Multipart `/api/*` route | **No** | Only `src/pages/api/chat.ts` |
| Server image processing | **No** | No sharp, no vision SDK in repo |
| Multimodal provider layer | **No** | Only Discovery Engine + CES auth (`ces-auth.ts`) |
| Feature flag | **Partial** | `VIDDEL_AI_BACKEND` only — no image flag |
| Dev-only probe pattern | **Yes** | Prior Agent Search probe docs/scripts pattern (metadata-only) |

---

## Does current Agent Search direct support image input?

### Answer: **No — on our integrated `:answer` path only**

See **Primary evidence from Google Cloud documentation** above for official field lists and URLs.

| Evidence layer | Detail |
|----------------|--------|
| **Google REST `:answer`** | No `imageQuery`; `Query` = `text` only |
| **Google REST `:search`** | `imageQuery.imageBytes` exists — **different endpoint** |
| **Google Assistant RPC** | `addContextFile` + `assist`/`streamAssist` + `file_ids[]` — **different endpoint, not wired** |
| **Repo code** | Only `query: { text: message }` sent to `:answer` |
| **TypeScript contract** | `AgentSearchAnswerInput = { message: string }` |
| **Known-good doc** | `GOOGLE_AGENT_SEARCH_DIRECT_KNOWN_GOOD_v0_1.md` — text `query.text` only |
| **Operational validation** | Direct backend reliability tests — text prompts only |

### Adjacent Google capabilities (not our production path)

| API surface | Image / file support | Why not a shortcut for INT-009 on today's Viddel |
|-------------|---------------------|--------------------------------------------------|
| `servingConfigs.search` + `imageQuery` | Yes (JPEG/PNG/BMP) | Website/image **search results**, not our `:answer` + manual grounding flow |
| `sessions.addContextFile` + `assistants.assist` | Yes (session files) | New Assistant integration; session file upload to Google; not validated in our engine setup |
| `answerGenerationSpec.multimodalSpec` | Output-side | Images **in** the answer, not user photo **into** the query |
| CES widget `enable-file-upload` | Widget-internal | Not Agent Search direct; not on `/no/chat` |
| Multi-turn `:search` → `:answer` session | Documented coordination | Still no photo in `:answer` body; extra API + allowlist complexity |

**Conclusion:** Do not assume our **current `:answer` integration** accepts photos. Image/file features require a **new step or new Google API surface** — hybrid vision→text→`:answer` remains the lowest-risk path on validated production code.

---

## Recommended architecture (hybrid)

```text
User photo (equipment only)
    ↓
[Vision pre-step]  Gemini (or equivalent) — dev/staging only initially
    ↓
Structured JSON + short natural language summary
    e.g. { device_class, visible_parts, indicator_guess, brand_hint, confidence, safety_flags }
    ↓
Text composer: user question + vision summary (no raw image forwarded to Agent Search)
    ↓
Existing POST /api/chat → runAgentSearchAnswer({ message: enrichedText })
    ↓
Grounded answer + citations from HearingNorwaystore / manifest-approved sources
    ↓
UI: Viddel response + uncertainty + equipment-only disclaimer
```

### Design rules

1. **Never send raw image bytes to Agent Search** in v0.1 — only derived text/JSON.
2. **Scope vision to equipment surfaces:** hearing aid body, charger case, dome/filter, app screenshot, status LED — **not** ear canal, skin, wounds, or body parts.
3. **Always show confidence** and offer text-only fallback (“beskriv med ord i stedet”).
4. **Do not store images** in spike/prototype; process in memory; discard after request.
5. **Keep RAG/manifest gate** — vision may suggest labels; manuals/articles still come from Agent Search + approved sources.
6. **Extend response preamble** (future) with vision-specific uncertainty — do not change production preamble in this spike.

### Optional later: `:search` image experiment

Separate spike could test `imageQuery` on `:search` against website/manual indexes — likely poor fit for “what does this LED mean on my Phonak charger” vs hybrid vision→text→`:answer`.

---

## Minimal prototype path

**Goal:** learn if vision→JSON→RAG improves troubleshooting UX — **not** ship upload.

| Step | Action | Risk |
|------|--------|------|
| 1 | Add **dev-only** Node script e.g. `scripts/image-troubleshoot-probe.mjs` | Low if not deployed |
| 2 | Input: local **stock/synthetic** PNG path + user text scenario | No PII |
| 3 | Call **Gemini multimodal** (Vertex or AI Studio) with strict JSON schema prompt | New env var; preview only |
| 4 | Compose enriched text; optionally call `runAgentSearchAnswer` locally with `.env` | Reuses prod backend code path without UI change |
| 5 | Print **metadata only** to stdout (device_class, confidence, citation yes/no) | Align with probe logging rules |
| 6 | **No** changes to `/no/chat`, `/api/chat` contract, or Vercel production env | — |

### Fallback

If image omitted or vision fails → existing text-only chat (current behavior).

### Disclaimer copy (prototype + future product)

> Viddel kan hjelpe med praktisk utstyr og feilsøking ut fra bildet ditt, men dette er ikke medisinsk vurdering. Vi analyserer utstyr (apparat, lader, filter, appskjerm) — ikke kropp eller øre. Ved smerte, blødning eller plutselig hørselstap: kontakt helsepersonell.

---

## Test scenarios (manual QA matrix)

Use **synthetic or manufacturer stock photos** — never real user submissions in spike.

### A. Ladeboks / statuslys

| Input | Vision should extract | RAG should answer |
|-------|----------------------|-------------------|
| Photo of charging case + LED | `device_class: charger`, `indicator: amber solid` (low confidence OK) | “Hva betyr amber lys på [merke] ladeetui?” steps from manual |
| User text | “Laderen blinker gult — hva betyr det?” | Combined query |

**Success:** plausible next steps + citation; explicit uncertainty if brand unknown.

### B. Dome/filter ved svak eller ingen lyd

| Input | Vision should extract | RAG should answer |
|-------|----------------------|-------------------|
| Close-up dome/filter on aid | `part: wax filter / dome`, `condition: discolored / blocked` (careful wording) | Cleaning/replacement steps |
| User text | “Hører nesten ingenting i dag” | Merge with filter check |

**Success:** suggests inspect/replace filter as **first** step; asks brand/model if missing.

### C. Telefon / handsfree + appskjerm

| Input | Vision should extract | RAG should answer |
|-------|----------------------|-------------------|
| App screenshot Bluetooth disconnected | `screen: iOS Bluetooth settings`, `state: not connected` | Pairing troubleshooting |
| Photo of aid near phone | `device_class: hearing_aid` + phone context | Connection reset steps |

**Success:** platform-aware steps; no hallucinated menu paths without citation.

---

## Privacy and safety constraints

| Constraint | Requirement |
|------------|-------------|
| Data minimization | No image persistence in v0.1 |
| Scope | Equipment/screens only — **reject** ear/body/skin images in vision prompt + server guard |
| Logging | No image bytes, no vision raw output, no enriched prompt in production logs |
| Medical boundary | Practical device help only; escalate pain/sudden hearing loss to professional care |
| Processors | Vision API adds a processor — document in privacy pack before prod |
| User consent | Explicit opt-in before upload if productized |
| Manifest gate | Vision labels do **not** bypass `datastore_ready` import rules (#228) |

---

## Risks

| Risk | Severity | Mitigation |
|------|----------|------------|
| Wrong LED/model identification | High | Confidence scores; ask brand/model; cite manuals |
| Vision hallucination on small hardware details | High | Hybrid only; never answer from vision alone |
| Scope creep to medical image analysis | High | Hard prompt + UI rejection of body photos |
| Privacy/regulatory | Medium | No storage; DPIA before prod |
| Latency (vision + RAG) | Medium | Two-step; show progress; timeout budgets |
| Cost | Medium | Dev-only first; cap probe runs |
| False confidence from “AI saw it in the photo” | Medium | Preamble + UI copy on uncertainty |
| CES widget upload confusion | Low | Document that article widget upload ≠ prod chat |

---

## Open questions

1. **Which vision model** in GCP (`gemini-2.x` via Vertex vs AI Studio) matches existing `GOOGLE_SERVICE_ACCOUNT_JSON` / project `hearing-aid-mvp`?
2. Does **HearingNorwaystore** content cover charger LED semantics well enough for scenario A?
3. Should brand/model detection be **required** before RAG call when confidence &lt; threshold?
4. Is CES widget file upload behavior documented anywhere for comparison / deprecation?
5. Product: photo **per turn** or **once per session**?
6. Legal: is app screenshot considered personal data if notifications visible?
7. Do we need **on-device** preprocessing (crop/blur) before upload in a future version?

---

## Recommendation

| Option | Verdict |
|--------|---------|
| **Build full feature now** | **No** |
| **Test manually first** | **Yes** — dev-only vision probe + 3 scenario matrix with stock images |
| **Park entirely** | No — product signal from INT-009 is strong; spike de-risks |

### Suggested next GitHub issue

**Title:** `Dev-only image vision bridge for hearing-aid troubleshooting probe (INT-009 follow-up)`

**Scope:**

- `scripts/image-troubleshoot-probe.mjs` (or preview-only API behind `ENABLE_IMAGE_PROBE=1`)
- JSON schema for vision output
- 3 stock-image scenarios (A/B/C)
- Optional chained call to `runAgentSearchAnswer` in local/preview env
- No `/no/chat` UI change
- Return ticket with latency, accuracy notes, privacy checklist

**Out of scope:** production upload, image storage, body-part analysis, datastore import changes.

---

## Verification (this spike)

| Check | Result |
|-------|--------|
| `npm run build` | Not required — **no code changes** in this commit |
| Production chat flow changed | **No** |
| Images stored/processed in production | **No** |
| New API routes | **No** |
| Docs-only spike | **Yes** |

---

## References (in repo + Google)

**Google Cloud (primary):**

- https://cloud.google.com/generative-ai-app-builder/docs/reference/rest/v1/projects.locations.collections.engines.servingConfigs/answer
- https://cloud.google.com/generative-ai-app-builder/docs/reference/rest/v1/projects.locations.collections.engines.servingConfigs/search
- https://cloud.google.com/generative-ai-app-builder/docs/image-search
- https://cloud.google.com/generative-ai-app-builder/docs/reference/mcp/conversational_search
- https://cloud.google.com/generative-ai-app-builder/docs/reference/rpc
- https://cloud.google.com/generative-ai-app-builder/docs/reference/rpc/google.cloud.discoveryengine.v1
- https://cloud.google.com/gemini/enterprise/docs/get-answers-from-streamassist

**Repo:**

- `src/lib/agent-search-answer.ts` — `:answer` body builder
- `src/pages/api/chat.ts` — public chat API
- `src/pages/no/chat.astro` — standalone production UI
- `src/lib/viddel-response-contract.ts` — answer preamble
- `docs/project/GOOGLE_AGENT_SEARCH_DIRECT_KNOWN_GOOD_v0_1.md` — validated text `:answer` setup
- `docs/project/VIDDEL_DATASTORE_SOURCE_ARCHITECTURE_v0_1.md` — verified insight pipeline

---

*Spike author: Cursor · v0.1 · 2026-06-05*
