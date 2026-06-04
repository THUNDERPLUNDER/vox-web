# Google Agent Search direct `:answer` — known-good configuration v0.1

Status: **Validated in Vercel Preview** (2026-06) — do not lose this setup.  
Related: [#198](https://github.com/THUNDERPLUNDER/vox-web/issues/198), [#213](https://github.com/THUNDERPLUNDER/vox-web/pull/213) (spike PR — **not merged**)

---

## 1. Purpose

Spike whether Viddel can call Google **Discovery Engine** `servingConfigs.answer` directly instead of unstable **CES channel** `runSession` (`/api/chat` → `ces.googleapis.com`).

**Outcome:** Direct `:answer` is **technically viable** in preview when env, IAM, engine ID, and request contract are correct. This doc records the working configuration so we do not repeat the debugging chain (403 IAM → 400 wrong engine → 400 invalid session).

---

## 2. Final working preview result

Observed on preview probe after full fix chain (`/vis/system/agent-search-direct-probe/` → **GET `?run=1`**, 5 calls):

| Metric | Value |
|--------|--------|
| Total calls | 5 |
| Success | 5 |
| Google errors | 0 |
| Success rate | **100%** |
| API HTTP | 200 |
| `has_answer` | yes |
| `has_citations` | yes |
| Note | Google `:answer` OK (GET `?run=1`) |

**Channel baseline (unchanged):** CES `runSession` reliability test **4/16 success (25%)** — [#188](https://github.com/THUNDERPLUNDER/vox-web/issues/188).

---

## 3. Known-good environment (Vercel Preview)

| Variable | Value / rule |
|----------|----------------|
| `CES_PROJECT_ID` | `hearing-aid-mvp` |
| `CES_LOCATION` | `eu` |
| **`AGENT_SEARCH_ENGINE_ID`** | **`h-rehjelpen-v1-2_1771939983615`** |
| `CES_APP_ID` | `1741e68d-0528-4625-8b83-99a0dbb5298f` — **CES only**, **not** engine ID |
| `AGENT_SEARCH_ANSWER_SESSION` | **omitted / default** (`omit`) — single-turn probe |
| `AGENT_SEARCH_SERVING_CONFIG` | default `default_serving_config` (unset) |
| `GOOGLE_SERVICE_ACCOUNT_JSON` | same SA as CES (`viddel-ces-run-session@…`) |

**Do not conflate:**

- `CES_APP_ID` → `ces.googleapis.com/.../apps/{id}` + `runSession`
- `AGENT_SEARCH_ENGINE_ID` → `eu-discoveryengine.googleapis.com/.../engines/{id}/...:answer`

---

## 4. GCP context

| Item | Value |
|------|--------|
| Project | `hearing-aid-mvp` |
| Location | `eu` |
| AI Applications app | **Hørehjelpen v1.2** |
| App type | **Search** |
| Connected data store | **HearingNorwaystore** |
| Discovery Engine engine ID | `h-rehjelpen-v1-2_1771939983615` |

---

## 5. IAM

| Item | Value |
|------|--------|
| Service account | `viddel-ces-run-session@hearing-aid-mvp.iam.gserviceaccount.com` |
| CES (existing) | `roles/ces.client` (or equivalent for `runSession`) |
| **Added for `:answer`** | **`roles/discoveryengine.user`** |

Permission required: `discoveryengine.servingConfigs.answer` on the serving config resource.

See [GOOGLE_AGENT_SEARCH_IAM_VERIFICATION_v0_1.md](./GOOGLE_AGENT_SEARCH_IAM_VERIFICATION_v0_1.md).

---

## 6. Request contract (`:answer`)

**Endpoint (EU):**

```
POST https://eu-discoveryengine.googleapis.com/v1/projects/hearing-aid-mvp/locations/eu/collections/default_collection/engines/h-rehjelpen-v1-2_1771939983615/servingConfigs/default_serving_config:answer
```

**Body (known-good):**

- `query.text` — user message (probe uses fixed test prompt server-side)
- `groundingSpec.includeGroundingSupports: true`
- `answerGenerationSpec` — `includeCitations: true`, adversarial/non-answer flags per spike
- **`session` — omitted** for single-turn probe (default in code)
- **Do not use** `session: "-"` (Google returns `Invalid session name: -`)

**Fallback if session required later:** set `AGENT_SEARCH_ANSWER_SESSION=full` → full resource:

```
projects/hearing-aid-mvp/locations/eu/collections/default_collection/engines/h-rehjelpen-v1-2_1771939983615/sessions/-
```

Implementation: `src/lib/agent-search-direct.ts` — `buildAnswerRequestBody()`.

Contract audit: [GOOGLE_AGENT_SEARCH_ANSWER_CONTRACT_AUDIT_v0_1.md](./GOOGLE_AGENT_SEARCH_ANSWER_CONTRACT_AUDIT_v0_1.md).

---

## 7. Preview constraint (Vercel)

| Issue | Mitigation |
|-------|------------|
| Deployment Protection blocks **POST** to `/api/agent-search-direct-probe` on preview | Probe runs via **GET `?run=1`** (same JSON envelope, server-side Google call) |

UI: `/vis/system/agent-search-direct-probe/`  
API: `/api/agent-search-direct-probe` and `/api/agent-search-direct-probe?run=1`

---

## 8. Safe logging rule (mandatory)

Never log or return to clients:

- Prompt / query text (beyond fixed internal probe seed)
- Answer body / `answerText`
- Authorization headers or tokens
- `GOOGLE_SERVICE_ACCOUNT_JSON` or private keys
- Raw Google response JSON in UI or application logs

Probe and API return **metadata only** (`has_answer`, `has_citations`, `error_code`, `google_error_hint` truncated, duration buckets, etc.).

---

## 9. Troubleshooting

| Symptom / `error_code` | Cause | Fix |
|------------------------|-------|-----|
| `google_403` / `PERMISSION_DENIED` … `discoveryengine.servingConfigs.answer` | Missing IAM on SA | Add `roles/discoveryengine.user` on `hearing-aid-mvp` for `viddel-ces-run-session@…` |
| `google_engine_not_found` / *Cannot fetch Engine for 1741e68d…* | Using **`CES_APP_ID`** as engine ID | Set **`AGENT_SEARCH_ENGINE_ID`** = Discovery Engine `engines/…` ID |
| `google_invalid_session_name` / *Invalid session name: -* | Bare `"-"` as session | Omit `session` (default) or `AGENT_SEARCH_ANSWER_SESSION=full` |
| `google_400_bad_request` (other) | Payload field typo | See [contract audit](./GOOGLE_AGENT_SEARCH_ANSWER_CONTRACT_AUDIT_v0_1.md) |
| `configuration_missing` | Missing `AGENT_SEARCH_ENGINE_ID` in Vercel | Set engine ID; redeploy preview |
| Route 404 | Wrong probe API path | Use `/api/agent-search-direct-probe` (see `agent-search-probe-path.ts`) |
| POST 403 HTML / non-JSON | Vercel Deployment Protection | Use **GET `?run=1`** from probe UI |

---

## 10. What is **not** decided yet

- **Do not merge #213** until product/backend decision.
- **Do not switch production** `/api/chat` to direct `:answer` yet.
- **Do not remove** CES channel backend yet.
- **Do not activate PostHog** for this spike.
- **Do not reset** public guard limits until next decision.

**Recommended next step:** Small assessment for optional backend mode:

```bash
VIDDEL_AI_BACKEND=ces_channel | google_agent_search_direct
```

Default remains `ces_channel` until QA and ops sign off on stability, session/multi-turn, and production env parity.

Spike overview: [GOOGLE_AGENT_SEARCH_DIRECT_API_SPIKE_v0_1.md](./GOOGLE_AGENT_SEARCH_DIRECT_API_SPIKE_v0_1.md).

---

## 11. Debug chain (historical — avoid repeating)

1. Probe route / client bundling → API path fix  
2. Vercel POST blocked → GET `?run=1`  
3. `includeGrounding` → `includeGroundingSupports`  
4. 403 IAM → `roles/discoveryengine.user`  
5. 400 wrong engine → `AGENT_SEARCH_ENGINE_ID` ≠ `CES_APP_ID`  
6. 400 invalid session → omit `session`  
7. **5/5 success** — this document
