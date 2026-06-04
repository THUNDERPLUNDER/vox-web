# Google Agent Search direct API spike v0.1

Status: **Assessment + optional probe** — ikke production-bytt.  
Related: [#198](https://github.com/THUNDERPLUNDER/vox-web/issues/198), [#188](https://github.com/THUNDERPLUNDER/vox-web/issues/188)

---

## Beslutning

Etter to rene reliability-serier (guard 100/500): **25% success, 75% upstream (502), 0 rate_limit**.  
Public guard er ikke problemet. Thomas vil **først** teste Googles dokumenterte **Agent Search answer/search API** direkte før ekstern fallback (OpenAI, Vercel AI Gateway, pgvector).

**Hypotese:** Ustabilitet kan ligge i **CES channel / deployment / runSession-laget**, ikke nødvendigvis i Agent Search/RAG-kjernen.

---

## A. Dagens implementasjon (`/api/chat`)

| Lag | Detalj |
|-----|--------|
| Entry | `POST /api/chat` → `src/pages/api/chat.ts` |
| Backend | `runCesSession()` i `src/lib/ces-run-session.ts` |
| API | **CES Conversational Agents** — `ces.googleapis.com/v1beta` |
| Metode | `projects/.../apps/.../sessions/{id}:runSession` |
| Auth | Service account JWT → `cloud-platform` scope (`src/lib/ces-auth.ts`) |
| Deployment | `CES_DEPLOYMENT_ID` (API access channel, f.eks. `edb2938a-…`) |
| Location | `CES_LOCATION=eu` (multi-region, **ikke** compute-region) |
| Payload | `{ config: { session, deployment }, inputs: [{ text }] }` |
| Upstream 502 | Kastes i `runCesSessionOnce` når `!response.ok` → `error_code=upstream` |

**Gjenbruk ved alternativ backend:**

- Public guard (`chat-api-guard.ts`, `chat-guard-limits.ts`)
- Timeout/retry-mønster (`CES_FETCH_TIMEOUT_MS`, 2 forsøk)
- Safe metadata (`chat-usage-metrics.ts`, `[chat-drift]`)
- Frontend-kontrakt: `{ message, sessionId }` → `{ text, turnCompleted, turnIndex }`
- Viddel-svarformat (ren tekst, ingen `diagnosticInfo` til klient)

**Ikke gjenbruk direkte:** CES session/deployment resource paths, `runSession` payload.

---

## B. Google Agent Search direct API (Discovery Engine)

Offisiell dokumentasjon: [Agent Search REST](https://cloud.google.com/generative-ai-app-builder/docs/reference/rest/v1/projects.locations.collections.engines.servingConfigs)

| Metode | Formål | Serving config (typisk) |
|--------|--------|-------------------------|
| **`:search`** | Dokumentsøk / retrieval | `default_search` |
| **`:answer`** | Generert svar + grounding | `default_serving_config` |
| **`:streamAnswer`** | Streaming svar | `default_search` |

**EU endpoint (viktig):** bruk host **`eu-discoveryengine.googleapis.com`**, ikke global default.

```
https://eu-discoveryengine.googleapis.com/v1/projects/{PROJECT}/locations/eu/collections/default_collection/engines/{ENGINE_ID}/servingConfigs/{SERVING_CONFIG}:{method}
```

**Vår app (fra env):**

| Felt | Verdi |
|------|-------|
| project | `hearing-aid-mvp` |
| location | `eu` |
| engine/app id | `1741e68d-0528-4625-8b83-99a0dbb5298f` (må verifiseres som **engine** i Discovery Engine, ikke bare CES app) |

**Auth / IAM:**

- OAuth scope: `https://www.googleapis.com/auth/cloud-platform` (samme som i dag)
- Permission: `discoveryengine.servingConfigs.answer` / `.search` (i tillegg til evt. `ces.sessions.runSession`)

**Response-felt (answer) — kun metadata i probe:**

- `answer.state` (f.eks. SUCCEEDED)
- `answer.answerText` — **ikke logget** i probe
- Grounding / citations via `groundingSpec` og svar-struktur
- `relatedQuestions`, support scores avhengig av spec

**Forskjell default_search vs default_serving_config:**

- `default_search` — søk/retrieval + streamAnswer
- `default_serving_config` — answer query (anbefalt for chat-lignende svar)

**Multi-turn:** `session` felt i answer request (auto session med `-` eller eksplisitt session resource).

---

## C. Sammenligning (vurdering)

| Spørsmål | Channel/runSession (A) | Direct answer API (B) |
|----------|------------------------|------------------------|
| Stabilitet (observasjon) | **25%** (16 kall, 2 serier) | **TBD** — kjør probe |
| Svar med kvalitet | Ja når 200 | TBD |
| Citations/grounding | Via CES/agent (ikke eksponert) | `groundingSpec` i API |
| Beholde `/api/chat`-kontrakt? | Ja (nåværende) | Ja — map `answerText` → `text` |
| Vi mister | — | CES deployment/channel, runSession tools |
| Vi vinner (hvis stabilt) | — | Færre lag, tydeligere API, EU host eksplisitt |

---

## D. Probe (preview-first)

**Anbefalt for Thomas:** Vercel Preview → `/vis/system/agent-search-direct-probe/` → «Kjør 5 direct API-kall».  
Bruker `POST /api/agent-search-direct-probe` (ett kall per request, deaktivert når `VERCEL_ENV=production`).

Valgfritt CLI (utviklere): `npm run agent-search:probe -- --count=5 --delay-ms=8000`

Logger kun safe metadata — ingen prompt/svar.

---

## E. Beslutningspunkt

**Hvis direct API er stabilt (f.eks. ≥80% has_answer over probe-serie):**

- Anbefal liten PR: `VIDDEL_AI_BACKEND=ces_channel | google_agent_search_direct`
- Default `ces_channel` til QA er ferdig
- Ingen frontend-endring

**Hvis direct API også er ustabilt:**

- Anbefal videre fallback-assessment: OpenAI File Search, Vercel AI Gateway, Supabase pgvector / Pinecone, Anthropic citations
- **Ikke** implementer ekstern fallback i samme PR

---

## Out of scope

- Production backend-bytt
- Fjerne CES channel-kode
- PostHog
- Innholdslogging
- Flere channel-reliability-serier
