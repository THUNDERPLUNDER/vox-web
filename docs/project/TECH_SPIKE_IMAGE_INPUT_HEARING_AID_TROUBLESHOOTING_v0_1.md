# Tech spike: Image input for hearing-aid troubleshooting v0.1

Status: **Spike complete — no production changes**  
Context: INT-009 (Per-Arne) — bildebasert hjelp for høreapparatfeilsøking  
Related: [#217](https://github.com/THUNDERPLUNDER/vox-web/issues/217) response contract, [#228](https://github.com/THUNDERPLUNDER/vox-web/pull/229) source trust, `VIDDEL_AI_BACKEND=google_agent_search_direct`

---

## Executive summary

**Recommendation: test manually first — do not build image upload in production chat now.**

Today's Viddel production chat path is **text-only** end-to-end: browser → `POST /api/chat` `{ message, sessionId }` → Google Agent Search `:answer` with `query.text`. There is **no image field** in our request contract, no multipart API route, and no server-side image handling.

Google Discovery Engine **`AnswerQueryRequest.Query`** (used by `:answer`) exposes a content union of **`text` only** — not `imageQuery` / `imageBytes`. Image bytes appear on the separate **`SearchRequest`** API (`imageQuery.imageBytes` + `params.search_type=1`), which we do not call and which targets image/website search — not our grounded Q&A troubleshooting flow.

A **hybrid architecture** is the realistic path: a multimodal model interprets an equipment photo **first**, emits **structured JSON + short text**, and that enriched text is sent to existing Agent Search RAG. This keeps datastore/manual grounding on the current stack while adding vision only as a pre-step.

**Next step:** a dev-only manual probe (script or sandbox page behind no production wiring) with synthetic/stock device photos — not user uploads in prod.

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

### Answer: **No** (for our integrated `:answer` path)

| Evidence | Detail |
|----------|--------|
| **Repo code** | Only `query: { text: message }` is sent |
| **TypeScript contract** | `AgentSearchAnswerInput = { message: string }` |
| **Google `AnswerQueryRequest.Query`** | Content union = **`text` only** (Conversational Search / `:answer` reference) |
| **Known-good doc** | `GOOGLE_AGENT_SEARCH_DIRECT_KNOWN_GOOD_v0_1.md` documents `query.text` as the user message field |
| **Operational validation** | Direct backend reliability tests used text prompts only |

### Unclear / adjacent (not a shortcut for INT-009)

| API surface | Image support | Relevance to Viddel |
|-------------|---------------|-------------------|
| `SearchRequest.imageQuery.imageBytes` | Yes (JPEG/PNG/BMP base64) | **Different API** (`:search`, not `:answer`); geared to image/website search; not wired; would not reuse our preamble/RAG answer path as-is |
| `answerGenerationSpec.multimodalSpec` | Output-side | Docs describe **source of images returned in the answer**, not user image input |
| CES widget `enable-file-upload` | Unknown / widget-internal | Not connected to Agent Search direct; not in prod standalone chat |
| Multi-turn `/search` + `/answer` coordination | Private GA / allowlist | Would add complexity; still not “send photo in `:answer` body” in current contract |

**Conclusion:** Do not assume Agent Search direct accepts photos in today's Viddel integration. Any image feature requires a **new step** (hybrid vision pre-processor or a separate Google API experiment).

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

## References (in repo)

- `src/lib/agent-search-answer.ts` — `:answer` body builder
- `src/pages/api/chat.ts` — public chat API
- `src/pages/no/chat.astro` — standalone production UI
- `src/lib/viddel-response-contract.ts` — answer preamble
- `docs/project/GOOGLE_AGENT_SEARCH_DIRECT_KNOWN_GOOD_v0_1.md` — validated text `:answer` setup
- `docs/project/VIDDEL_DATASTORE_SOURCE_ARCHITECTURE_v0_1.md` — verified insight pipeline
- Google Agent Search — `AnswerQueryRequest.Query` (text-only content union); `SearchRequest.imageQuery` (separate search API)

---

*Spike author: Cursor · v0.1 · 2026-06-05*
