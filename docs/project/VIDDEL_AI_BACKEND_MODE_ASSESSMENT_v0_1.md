# Viddel AI backend mode assessment v0.1

Status: **Assessment / spec** — no production switch in this document.  
Decision driver: [#198](https://github.com/THUNDERPLUNDER/vox-web/issues/198) — Direct `:answer` **5/5** preview vs CES channel **4/16 (25%)**.  
Known-good: [GOOGLE_AGENT_SEARCH_DIRECT_KNOWN_GOOD_v0_1.md](./GOOGLE_AGENT_SEARCH_DIRECT_KNOWN_GOOD_v0_1.md)  
Spike PR: [#213](https://github.com/THUNDERPLUNDER/vox-web/pull/213) — **do not merge as production backend change**

---

## Recommendation (executive)

| Question | Answer |
|----------|--------|
| Implement `VIDDEL_AI_BACKEND`? | **Yes — small, env-only switch** behind default `ces_channel` |
| Switch production now? | **No** |
| Merge #213 to main as-is? | **No** — close or keep open as spike; land **docs-only** (or cherry-pick `docs/` + `.env.example`) first |
| Next implementation PR | New focused PR: backend router + `runAgentSearchAnswer()` for `/api/chat` only; probe stays preview-only |

**Rationale:** Preview proves direct `:answer` works with documented env/IAM/contract. Channel instability is still the production risk. An env flag allows staged QA and instant rollback without redeploying frontend.

---

## 1. Backend selection model

### Env variable

```bash
VIDDEL_AI_BACKEND=ces_channel | google_agent_search_direct
```

| Rule | Behavior |
|------|----------|
| **Default** | `ces_channel` when unset, empty, or unknown value |
| **Parse location** | Server-only in `/api/chat` (and shared resolver in `src/lib/`) |
| **Invalid value** | Log safe warning (`backend_mode_invalid`), treat as `ces_channel` |
| **Scope** | Only affects `POST /api/chat` — not probe UI, not CES widget `<chat-messenger>` |

### Resolver (proposed)

```text
resolveViddelAiBackend(): "ces_channel" | "google_agent_search_direct"
  → read VIDDEL_AI_BACKEND
  → normalize + validate
  → default ces_channel
```

### Dispatch (proposed)

```text
POST /api/chat
  → guard + rate limit (unchanged)
  → resolve backend mode
  → ces_channel        → runCesSession(...)
  → google_agent_search_direct → runAgentSearchAnswer(...)  // new wrapper, not probe handler
```

Probe path (`/api/agent-search-direct-probe`) remains **preview-only** and **metadata-only** — not wired to `VIDDEL_AI_BACKEND`.

---

## 2. Frontend response contract (preserve)

**Unchanged** JSON for successful chat (`src/pages/api/chat.ts` today):

```json
{
  "text": "<string>",
  "turnCompleted": <boolean>,
  "turnIndex": <number>
}
```

**Unchanged** error shape:

```json
{
  "error": "<code>",
  "message": "<user-facing Norwegian>"
}
```

**Request** unchanged: `{ "message": string, "sessionId": string }`.

No new fields in v0.1 response body (citations/support **not** exposed to client yet — see §9).

---

## 3. Default backend

| Environment | Recommended `VIDDEL_AI_BACKEND` |
|-------------|----------------------------------|
| Production | **unset** or explicit `ces_channel` |
| Preview (spike QA) | `google_agent_search_direct` only after dedicated reliability series |
| Local dev | `ces_channel` unless testing direct |

Production must stay on CES until reliability plan (§7) passes.

---

## 4. Required env per backend

### `ces_channel` (current)

| Variable | Required |
|----------|----------|
| `CES_PROJECT_ID` | yes |
| `CES_LOCATION` | yes |
| `CES_APP_ID` | yes |
| `CES_APP_VERSION_ID` | yes (if used by deployment path) |
| `CES_DEPLOYMENT_ID` | yes |
| `GOOGLE_SERVICE_ACCOUNT_JSON` | yes |

Resolver: existing `resolveCesEnv()` in `src/lib/ces-env.ts`.

### `google_agent_search_direct`

| Variable | Required |
|----------|----------|
| `CES_PROJECT_ID` | yes (project id) |
| `CES_LOCATION` or `AGENT_SEARCH_LOCATION` | yes (`eu`) |
| **`AGENT_SEARCH_ENGINE_ID`** | yes — **not** `CES_APP_ID` |
| `GOOGLE_SERVICE_ACCOUNT_JSON` | yes (same SA; needs `roles/discoveryengine.user`) |
| `AGENT_SEARCH_SERVING_CONFIG` | optional (default `default_serving_config`) |
| `AGENT_SEARCH_ANSWER_SESSION` | optional (`omit` default; `full` for multi-turn later) |

`CES_APP_ID` / `CES_DEPLOYMENT_ID` **not** used for direct `:answer` but may remain set for rollback to channel.

**Config guard:** If mode is `google_agent_search_direct` and `AGENT_SEARCH_ENGINE_ID` missing → `503 configuration_missing` (same UX as today).

---

## 5. Rollback behavior

| Mechanism | Action |
|-----------|--------|
| **Instant** | Set `VIDDEL_AI_BACKEND=ces_channel` or **remove** var in Vercel → redeploy |
| **Code path** | `runCesSession` unchanged; no delete in v0.1 |
| **Failure at runtime** | Map Google errors to same `error` codes as CES where possible (`upstream`, `auth`, `timeout`, `empty_response`) |
| **Partial outage** | No auto-fallback channel→direct or direct→channel in v0.1 (avoid silent dual-path debugging) |

**Operational rule:** One backend per deploy; flip env, do not run A/B in one instance without explicit ops test header.

---

## 6. Reliability test plan (before production switch)

Minimum bar **before** setting `VIDDEL_AI_BACKEND=google_agent_search_direct` in **Production**:

| Phase | Where | What | Pass criteria |
|-------|--------|------|----------------|
| A | Preview | `/api/chat` with mode=direct (not probe) | ≥80% success over **≥20** calls, mixed prompts from reliability seed set |
| B | Preview | Same + guard limits unchanged | 0 rate_limit false positives |
| C | Preview | CES channel baseline re-run | Document delta vs 25% baseline |
| D | Staging/preview | Session/multi-turn if product needs `sessionId` continuity | Define before prod — known-good probe is **single-turn omit session** |
| E | Production | **Only after A–D** | Ops sign-off + known-good env on Production |

Reuse tooling:

- `scripts/chat-reliability-assessment.mjs` — extend or add `--backend=direct` hitting `/api/chat`
- `scripts/agent-search-direct-probe.mjs` — stays probe-only; not a substitute for `/api/chat` path test

**Do not** reset `VIDDEL_CHAT_*` guard limits until backend decision is recorded.

---

## 7. Logging / safety constraints

Same rules as spike + production chat today:

| Never log | OK metadata |
|-----------|-------------|
| User `message` / prompt | `error_code`, `upstream_http_status`, `duration_bucket` |
| Answer `text` / `answerText` | `retry_used`, `attempt_count`, `backend_mode` (enum only) |
| Auth headers / tokens | `session_id_length` (not id value) |
| `GOOGLE_SERVICE_ACCOUNT_JSON` | `layer: google_agent_search_direct` |
| Raw Google JSON body | `has_answer`, `has_citations` (booleans), truncated `google_error_hint` in probe only |

`[api/chat]` logs: extend with `backend_mode` field only — no new content fields.

PostHog: **out of scope** — do not activate for this work.

---

## 8. Citations / support metadata mapping

### Google `:answer` (internal only in v0.1)

From `src/lib/agent-search-direct.ts` probe parsers:

| Google / payload | Internal (probe) | `/api/chat` v0.1 |
|------------------|------------------|------------------|
| `answer.answerText` | `has_answer` | → `text` |
| `groundingMetadata` / chunks | `has_citations`, counts | **not exposed** |
| `supportScore` / retrieval | `support_score` | **not exposed** |
| `answer.state` | `response_state` | **not exposed** |

### CES channel (today)

| CES | `/api/chat` |
|-----|-------------|
| `outputs[0].text` | `text` |
| `turnCompleted`, `turnIndex` | same |
| `diagnosticInfo` | **stripped** — never sent to client |

### v0.1 policy

- **Map** `answerText` → `text`; synthesize `turnCompleted: true`, `turnIndex: 0` (or increment if session mapping added later).
- **Do not** add `citations[]` to public API until product/copy UX is specified.
- **Do** record `has_citations` in server drift metadata only (optional extension to `chat-usage-metrics.ts`).

### Future (v0.2+)

Optional internal-only or VIS-only citation preview; or structured field behind feature flag — separate issue.

---

## 9. #213 reuse vs spike-only

### Reuse in backend-mode PR (from #213 branch)

| File | Reuse |
|------|--------|
| `src/lib/agent-search-direct.ts` | **Yes** — extract `runAgentSearchAnswer(config, { message })` from `runAgentSearchDirectProbeOnce`; shared `buildAnswerRequestBody`, error mapping |
| `src/lib/ces-auth.ts` | **Yes** — same SA token |
| `durationBucket` from `ces-run-session.ts` | **Yes** — shared typing |
| `.env.example` comments | **Yes** — cherry-pick to main |
| `docs/project/GOOGLE_AGENT_SEARCH_*.md` | **Yes** — docs-only merge/cherry-pick |

### Stay spike-only (do not wire to `/api/chat` without review)

| File | Reason |
|------|--------|
| `src/pages/vis/system/agent-search-direct-probe/` | Internal VIS diagnostics |
| `src/scripts/agent-search-direct-probe-client.ts` | Preview UI |
| `src/pages/api/agent-search-direct-probe.ts` | GET `?run=1` probe; Deployment Protection workaround |
| `src/lib/agent-search-probe-handler.ts` | Metadata envelope for probe |
| `src/lib/agent-search-probe-envelope.ts` | Preview diagnostics |
| `src/lib/agent-search-probe-path.ts` | Probe path helper |

### New code (backend PR, not #213 merge)

| File | Purpose |
|------|---------|
| `src/lib/viddel-ai-backend.ts` | `resolveViddelAiBackend()` |
| `src/lib/agent-search-answer.ts` (or extend `agent-search-direct.ts`) | Production-safe `runAgentSearchAnswer` with retry/timeout parity to CES |
| `src/pages/api/chat.ts` | Dispatch on backend mode |
| Tests / scripts | `chat-reliability` with `--backend` |

---

## 10. Files likely affected (implementation PR)

| Path | Change |
|------|--------|
| `src/pages/api/chat.ts` | Backend dispatch |
| `src/lib/viddel-ai-backend.ts` | **New** — mode resolver |
| `src/lib/agent-search-direct.ts` | Refactor: shared answer client for chat |
| `src/lib/ces-run-session.ts` | Unchanged behavior |
| `src/lib/ces-env.ts` | Unchanged |
| `src/lib/chat-usage-metrics.ts` | Optional `backend_mode` on drift signals |
| `.env.example` | `VIDDEL_AI_BACKEND` |
| `docs/project/VIDDEL_AI_BACKEND_MODE_ASSESSMENT_v0_1.md` | This doc |
| `scripts/chat-reliability-assessment.mjs` | Direct mode via `/api/chat` |

**Not in v0.1:** `src/pages/no/chat.astro`, CES widget, PostHog, guard limit env vars.

---

## 11. Risks

| Risk | Mitigation |
|------|------------|
| Preview 5/5 ≠ production stability | Reliability plan §7 before prod env |
| Single-turn omit `session` vs chat `sessionId` | Spike session model ≠ CES session; design mapping before prod direct |
| Wrong engine ID in prod env | Known-good doc + separate `AGENT_SEARCH_ENGINE_ID`; never fallback to `CES_APP_ID` |
| IAM missing on prod SA | Verify `roles/discoveryengine.user` on Production SA before switch |
| Dual debugging paths | No auto-fallback; one mode per deploy |
| #213 merge brings probe to prod | Merge policy: docs-only first; backend PR without VIS probe routes enabled in prod |

---

## 12. #213 disposition

| Option | Recommendation |
|--------|----------------|
| **Merge #213 whole to main** | **No** — includes preview probe routes and spike scope |
| **Close #213 as spike** | **Yes** after docs cherry-pick — link to new implementation issue |
| **Cherry-pick / docs-only PR** | **Yes** — `docs/project/GOOGLE_AGENT_SEARCH_*.md`, `VIDDEL_AI_BACKEND_MODE_ASSESSMENT_v0_1.md`, `.env.example` |
| **Superseded by** | New issue: «Implement VIDDEL_AI_BACKEND v0.1 (default ces_channel)» |

Suggested GitHub flow:

1. Open **docs-only PR** → `main` (known-good + this assessment).
2. Close **#213** with summary + link to implementation issue.
3. Implementation PR from fresh branch off `main`, porting `agent-search-direct.ts` logic only.

---

## 13. Out of scope (explicit)

- Production backend switch in this assessment
- Removing CES channel code
- PostHog activation
- External fallback (OpenAI, pgvector, etc.)
- Resetting `VIDDEL_CHAT_BURST_LIMIT` / `VIDDEL_CHAT_DAILY_LIMIT`
- Public citation fields in chat API
- Merging #213 as production change

---

## References

- [GOOGLE_AGENT_SEARCH_DIRECT_KNOWN_GOOD_v0_1.md](./GOOGLE_AGENT_SEARCH_DIRECT_KNOWN_GOOD_v0_1.md)
- [GOOGLE_AGENT_SEARCH_DIRECT_API_SPIKE_v0_1.md](./GOOGLE_AGENT_SEARCH_DIRECT_API_SPIKE_v0_1.md)
- [AI_CHAT_RELIABILITY_ASSESSMENT_v0_1.md](./AI_CHAT_RELIABILITY_ASSESSMENT_v0_1.md)
- `src/pages/api/chat.ts` — current contract
- `src/lib/agent-search-direct.ts` — probe implementation to refactor
