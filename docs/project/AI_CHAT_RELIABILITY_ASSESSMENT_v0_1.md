# AI Chat Reliability Assessment v0.1

Status: **Complete (analysis)**  
Date: 2026-06-01  
Related: [#188](https://github.com/THUNDERPLUNDER/vox-web/issues/188), [#195](https://github.com/THUNDERPLUNDER/vox-web/pull/195)  
Script: `scripts/chat-reliability-assessment.mjs`

---

## Executive summary

Intermittent chat-feil skyldes **primært CES upstream-feil**, ikke metrics (#194) og ikke Vercel-proxy timeout i de observerte tilfellene.

| Hypotese | Konklusjon |
|----------|------------|
| CES upstream | **Sannsynlig hovedårsak** — raske 502 `<1s`, retry hjelper sjelden |
| Region/endpoint mismatch | **Ingen indikasjon** — headless bruker `eu` + dokumentert API access deployment |
| Vercel function/proxy | **Usannsynlig som rotårsak** — feil er raske; ingen timeout-mønster (8–20s+) |
| Vår API/UI-håndtering | **Delvis** — mapper alle CES-feil til HTTP 502; mangler upstream HTTP-status i logger |
| Rate limit (#180) | **Sekundær** — bulk-test fra én IP treffer 10/10 min burst; ikke brukerens hovedproblem |

**#195 er nok for intern test** (retry + clearError), men **ikke nok for ekstern pilot** hvis CES upstream fortsatt ~20–80% feil.

**Anbefalt reliability-strategi (kort):** CES reliability envelope (timeout, circuit breaker, bedre upstream-status logging) + repo-basert driftcheck — **ikke** plattformbytte ennå.

---

## Sjekk 1 — CES region og endpoint

### Konfigurasjon (fra kode + `.env.example` + beslutningsdok)

| Variabel | Dokumentert verdi | Kilde |
|----------|-------------------|--------|
| `CES_PROJECT_ID` | `hearing-aid-mvp` | `.env.example`, DECISION_125M-B |
| `CES_LOCATION` | `eu` | `.env.example` |
| `CES_APP_ID` | `1741e68d-0528-4625-8b83-99a0dbb5298f` | `.env.example` |
| `CES_APP_VERSION_ID` | `91cc4831-f020-4bb1-a17c-650859401cb1` | `.env.example` |
| `CES_DEPLOYMENT_ID` | `edb2938a-a2bf-4555-b4c9-d54963531db4` | `.env.example` (API access) |

### Faktisk endpoint (fra `ces-run-session.ts`)

```
POST https://ces.googleapis.com/v1beta/projects/{projectId}/locations/{location}/apps/{appId}/sessions/{sessionId}:runSession
```

Eksempel (headless prod):

```
https://ces.googleapis.com/v1beta/projects/hearing-aid-mvp/locations/eu/apps/1741e68d-0528-4625-8b83-99a0dbb5298f/sessions/{sessionId}:runSession
```

### Service account scopes

`ces-auth.ts` bruker scope `https://www.googleapis.com/auth/cloud-platform` — tilstrekkelig for CES API med SA JSON.

### Mulig mismatch? (viktig å skille kanaler)

| Kanal | Deployment ID | Merknad |
|-------|---------------|---------|
| **Headless `/api/chat`** | `edb2938a-…` | API access channel — korrekt for `runSession` |
| **CES-widget (`BaseLayout`)** | `dc1619d0-…` | Messenger channel — **annen** deployment, samme app/region |

Widget-stien bruker **project number** (`1088102295663`) i hardkodet `deploymentName`; headless bruker **project ID** (`hearing-aid-mvp`). Dette er normalt i GCP (ID vs nummer), ikke nødvendigvis feil.

**Konklusjon region:** `eu` er konsistent. Ingen tegn til feil `global` vs `eu`. Regionvalg kan påvirke latency, men observerte feil er **raske avslag**, ikke trege timeouts.

**Agent har ikke lest Vercel Production env direkte** — verdiene over er fra repo-dokumentasjon. Avvik i Vercel ville være operativ risiko, ikke observert i kode.

---

## Sjekk 2 — Vercel / runtime

| Tema | Funn |
|------|------|
| Function region | **Ikke satt** i `vercel.json` / `astro.config.mjs` → Vercel default (typisk nærmeste region til klient, ikke eksplisitt EU-pinning) |
| `maxDuration` | **Ikke satt** → platform default (ofte 10–60s avhengig av plan) |
| CES fetch timeout | **Ingen** — `fetch()` uten `AbortController` i `ces-run-session.ts` |
| AbortController | **Nei** |
| Opprinnelse av HTTP 502 | **Vår kode** mapper `!response.ok` fra CES til `CesRunSessionError(..., "upstream", 502)` — klient ser nesten alltid **502**, uavhengig av CES HTTP-status (429/503/500) |
| Diagnostisk tap | `error.message` inneholder `ces_upstream_{status}`, men **logges ikke** — `[api/chat] ces_run_session_failed` logger `code`, `status` (alltid 502), `sessionIdLength` |
| Guardrekkefølge | Uendret: validate → origin → rate limit → metrics request → CES → success/error metrics |

**Latency-mønster:** Upstream-feil kommer typisk **<1s** (CES avslår raskt). Suksess ~2–8s. Dette peker **mot CES**, ikke Vercel function timeout.

---

## Sjekk 3 — Controlled test (production)

Kjørt med `scripts/chat-reliability-assessment.mjs` mot `https://vox.raddum.no` — **ingen prompt/svar i output**.

### Serie A — 20 kall, 600 ms mellomrom, client-retry simulert

| Metrikk | Verdi |
|---------|-------|
| Totalt | 20 |
| Suksess | 1 (5%) |
| Upstream 502 | 4 (før rate limit dominerte) |
| empty_response | 0 |
| Retry forsøkt | 5 |
| Retry hjalp | **0** |
| Latency suksess | 3–8s |
| Latency upstream-feil | <1s |

**Request 1–5 (før IP rate limit):**

| # | Type | Resultat | Retry |
|---|------|----------|-------|
| 1 | seed | ✅ success | — |
| 2 | freeform | ❌ upstream | ja, hjalp ikke |
| 3 | freeform | ❌ upstream | ja, hjalp ikke |
| 4 | seed | ❌ upstream | ja, hjalp ikke |
| 5 | freeform | ❌ upstream | ja, hjalp ikke |

**Request 6–20:** `rate_limited` (429) — forventet etter bulk-test fra én IP mot 10/10 min burst guard (#180). **Ikke** CES upstream.

Raw metadata: `tmp/chat-reliability/assessment-v01-prod.json` (gitignored tmp — kjør script på nytt for repro).

### Serie B — enkeltverifisering

Etter Serie A: enkelt `POST /api/chat` → **HTTP 200**, ~2s (bekrefter at tjenesten fortsatt kan svare).

### Konklusjon test

- **Success rate (ren upstream-vindu):** ~20% (1/5 før rate limit)
- **Upstream 502:** konsistent, rask
- **Retry (#195):** 0/4 recovery i denne serien
- **Rate limit:** må tas med i fremtidige testserier (bruk `--delay-ms=65000` eller færre kall)

---

## Sjekk 4 — Direkte vs proxy

| Test | Status |
|------|--------|
| Via `/api/chat` | ✅ Kjørt (Serie A/B) |
| Direkte CES fra agent | ❌ **Ikke kjørt** — ingen `CES_*` / SA i lokal `.env` |

**Anbefaling:** Kjør lokalt med Vercel env eller Cloud Shell:

```bash
# Etter env er satt (aldri commit):
node scripts/chat-reliability-assessment.mjs --count=10 --direct --delay-ms=12000 --session-per-request
```

Sammenlign `row.direct.cesHttpStatus` vs `row.httpStatus`. Hvis 502 kun via proxy → undersøk proxy; hvis begge → CES.

---

## Sjekk 5 — Enklere driftverifisering (forslag, ikke implementert)

### Problem

Thomas skal ikke manuelt grave i Vercel Runtime Logs og Upstash Console som hovedflyt.

### Anbefalt måte

| Lag | Forslag |
|-----|---------|
| **Repo-script** | `npm run chat:reliability` → wrapper rundt `scripts/chat-reliability-assessment.mjs` — metadata JSON + stdout summary |
| **Backstage runbook** | Seksjon «Chat driftcheck» med 3 trinn: kjør script → les success rate → eskalér hvis `<80%` |
| **Intern diagnostics-route** (senere) | `GET /api/ops/chat-drift` bak backstage-guard — returnerer Upstash tellere + siste time (ingen innhold) |
| **Return Ticket-format** | Tydelige badges: `verified-by-code` / `verified-by-browser` / `requires-console` |

### Return Ticket-verifikasjonsnivåer (forslag)

```
verified-by-code       → build + unit + script grønn
verified-by-production → browser/API smoke uten console
requires-console       → kun når agent mangler credentials (CES direkte, Vercel log export)
```

---

## Alternativarkitektur (vurdering, ikke implementert)

| # | Alternativ | Når | Risiko |
|---|------------|-----|--------|
| 1 | **CES + reliability envelope** | **Anbefalt nå** — timeout, retry/backoff, circuit breaker, log upstream HTTP status | Lav |
| 2 | **CES + statisk fallback for seed** | Kjente seed-spørsmål ved upstream — bedre UX, ikke rotfix | Medium (vedlikehold) |
| 3 | **Direkte Vertex AI / Gemini** | Hvis CES ikke stabiliseres etter GCP-eskalering | Høy (mandat) |
| 4 | **Vercel AI Gateway + fallback** | Multi-modell senere | Medium |
| 5 | **OpenAI/RAG** | Senere fase | Høy |

---

## Anbefalinger (prioritert)

1. **Eskalér CES upstream** til GCP/CES med tidspunkt + feilrate (metadata fra script) — ikke prompt/svar.
2. **Logg `upstreamHttpStatus`** i `ces_run_session_failed` (liten kodeendring, neste PR).
3. **Legg til fetch timeout** (f.eks. 25s AbortController) — skille timeout vs rask CES-feil.
4. **Pin Vercel function region** til EU hvis mulig (latency).
5. **Adopter repo-script** som standard driftcheck — Thomas kjører én kommando, leser summary.
6. **Hold PostHog av** til reliability er akseptabel.
7. **Utsett ekstern pilot** til success rate stabil >80% over 20+ spaced kall.

---

## #188 status

**Landet teknisk, verification remaining** — console-verifisering erstattes av script-basert driftcheck som hovedflyt.
