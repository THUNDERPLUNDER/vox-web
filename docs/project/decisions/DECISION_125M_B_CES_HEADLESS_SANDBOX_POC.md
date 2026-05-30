# Decision #125M-B — CES Headless Sandbox PoC

Status: **Technically verified (Thomas QA) — not for public prod merge as standalone feature**  
Date: 2026-05-29 (QA verified 2026-05-29)  
Sprint: 2026-W21 (Viddel Lab)  
Route: `/no/sandbox/ces-headless-spike/`  
Preview (verified): https://vox-web-git-spike-125m-b-ces-headless-poc-raddum-5965s-projects.vercel.app/no/sandbox/ces-headless-spike/  
Related: [DECISION_125M_CES_HEADLESS_INTEGRATION_CBA.md](./DECISION_125M_CES_HEADLESS_INTEGRATION_CBA.md), [#157](https://github.com/THUNDERPLUNDER/vox-web/issues/157)

**Branch:** `spike/125m-b-ces-headless-poc` — QA verified; **do not merge to prod as public feature**; `/no/chat/` unchanged

---

## Kort beslutning

Fase 0 (GCP) er **fullført**: Thomas opprettet API access channel og verifiserte `runSession` manuelt i Cloud Shell.

Fase 1 leverer **beskyttet sandbox PoC**:

- Viddel-eid UI på `/no/sandbox/ces-headless-spike/`
- Server proxy `POST /api/chat` → CES `runSession` (v1beta)
- **Ingen** CES-widget, skjult bridge eller `sendQuery()`
- **`/no/chat/` uendret**

Produksjon `/no/chat/` endres **ikke** i #125M-B. Neste steg: **#125M-C Standalone AI custom chat R1** (egen branch, eget mandat).

---

## Thomas QA (Vercel Preview, 2026-05-29)

| Sjekk | Resultat |
|-------|----------|
| Custom Viddel UI | ✅ |
| `POST /api/chat` → CES `runSession` | ✅ Live |
| Norsk tekstsvar i custom UI | ✅ |
| Ingen CES-widget / `<chat-messenger>` | ✅ |
| Ingen skjult bridge / `sendQuery()` | ✅ |
| `diagnosticInfo` ikke vist | ✅ |

**Testspørsmål:** «Hei, hvordan kobler jeg høreapparatet til mobilen?»  
**Observasjon:** CES spurte om merke/modell på høreapparat — bekrefter live agent-respons, ikke mock.

---

## Cloud Shell-test (bekreftet)

| Felt | Verdi |
|------|--------|
| Testspørsmål | «Hei, hvordan kobler jeg høreapparatet til mobilen?» |
| Resultat | CES returnerte tekstsvar |
| Endpoint | `https://ces.googleapis.com/v1beta/projects/hearing-aid-mvp/locations/eu/apps/1741e68d-0528-4625-8b83-99a0dbb5298f/sessions/{SESSION_ID}:runSession` |

### API access deployment

| Felt | Verdi |
|------|--------|
| Project ID | `hearing-aid-mvp` |
| Project number | `1088102295663` |
| Location | `eu` |
| App ID | `1741e68d-0528-4625-8b83-99a0dbb5298f` |
| App version | `91cc4831-f020-4bb1-a17c-650859401cb1` |
| Deployment ID | `edb2938a-a2bf-4555-b4c9-d54963531db4` |

Full deployment path:

`projects/hearing-aid-mvp/locations/eu/apps/1741e68d-0528-4625-8b83-99a0dbb5298f/deployments/edb2938a-a2bf-4555-b4c9-d54963531db4`

---

## Hvorfor sandbox før `/no/chat/`

1. **Isolert risiko** — ny server-side integrasjon testes uten å endre public chatflate.
2. **Secrets** — service account kan verifiseres på Vercel preview før prod.
3. **Kontrakt** — normalisert API-respons og feilhåndtering avklares før produksjons-UI.
4. **CBA #125M-A** — absolutt krav: ingen widget på `/no/chat/` før headless er bevist.

---

## Implementasjon i repo

| Fil | Rolle |
|-----|--------|
| `astro.config.mjs` | `@astrojs/vercel`, static default + `prerender = false` on API |
| `src/lib/ces-env.ts` | Server env resolution |
| `src/lib/ces-auth.ts` | Service account → OAuth token (server-only) |
| `src/lib/ces-run-session.ts` | CES `runSession` call + normalisering |
| `src/pages/api/chat.ts` | `POST /api/chat` proxy |
| `src/pages/no/sandbox/ces-headless-spike.astro` | Viddel-eid sandbox UI |

### API-kontrakt

**Request:**

```json
{ "message": "...", "sessionId": "..." }
```

**Response (suksess):**

```json
{ "text": "...", "turnCompleted": true, "turnIndex": 1 }
```

**Response (manglende config):**

```json
{
  "error": "configuration_missing",
  "message": "Server-side CES credentials or config are not configured.",
  "missing": ["GOOGLE_SERVICE_ACCOUNT_JSON"]
}
```

`diagnosticInfo` fra CES **filtreres bort** og sendes aldri til frontend.

---

## Env vars i Vercel (Production + Preview)

| Variabel | Eksempel / merknad |
|----------|-------------------|
| `CES_PROJECT_ID` | `hearing-aid-mvp` |
| `CES_LOCATION` | `eu` |
| `CES_APP_ID` | `1741e68d-0528-4625-8b83-99a0dbb5298f` |
| `CES_APP_VERSION_ID` | `91cc4831-f020-4bb1-a17c-650859401cb1` (dokumentert; deployment peiler versjon) |
| `CES_DEPLOYMENT_ID` | `edb2938a-a2bf-4555-b4c9-d54963531db4` |
| `GOOGLE_SERVICE_ACCOUNT_JSON` | Full SA JSON — **Encrypted**, server-only |

Lokal utvikling: kopier til `.env` (gitignored), aldri commit.

---

## Astro/Vercel config — konsekvenser

| Endring | Konsekvens |
|---------|------------|
| `output: 'static'` (default) + `@astrojs/vercel` | Statiske sider pre-renderes; `/api/chat` (`prerender = false`) blir Vercel serverless |
| `@astrojs/vercel` | Kreves for API routes på Vercel |
| GitHub Pages CI | Bygger fortsatt statiske sider; **`/api/chat` fungerer ikke på GitHub Pages** |
| Prod chat-API | Kun på Vercel (https://vox.raddum.no) |

---

## Sikkerhetsnotater

- Service account JSON **kun** server-side (`process.env` / Vercel encrypted env).
- **Ingen** access tokens hardkodet eller i client bundle.
- **Ingen** logging av brukerens meldingstekst (kun feilkoder / sessionId-lengde ved feil).
- **`diagnosticInfo`** returneres ikke til frontend.
- Sandbox har `noindex` — ikke ment for indeksering.
- Rate limiting / auth på `/api/chat` er **ikke** implementert i PoC — vurder før public `/no/chat/`.

---

## Uten secrets

Sandbox-siden **kan lastes**, men `/api/chat` returnerer `503 configuration_missing` med liste over manglende env vars. **Ingen fake success.**

Live CES-svar krever at alle env vars + `GOOGLE_SERVICE_ACCOUNT_JSON` er satt på Vercel preview/prod.

---

## Akseptkriterier (PoC)

| Kriterium | Status |
|-----------|--------|
| `/no/sandbox/ces-headless-spike/` finnes | Levert |
| Viddel-eid UI, ingen `<chat-messenger>` | Levert |
| `POST /api/chat` | Levert |
| Normalisert respons, ingen `diagnosticInfo` | Levert |
| `/no/chat/` uendret | Ja |
| Public pages uendret | Ja |
| `npm run build` grønn | ✅ |
| Thomas QA på Vercel Preview | ✅ (2026-05-29) |

---

## Neste steg — #125M-C (ikke startet)

**#125M-C Standalone AI custom chat R1** — bruk sandbox PoC som teknisk grunnlag, design `/no/chat/` ordentlig:

| Krav | Beskrivelse |
|------|-------------|
| Teknisk | Gjenbruk `/api/chat` + headless mønster fra sandbox |
| Mobil | Full viewport chat, header øverst, composer fast nederst, intern scroll |
| Desktop | Viddel standalone AI-flate (H1, intro, composer, eksempelspørsmål, transcript) |
| Copy | «Spør Viddel» — ingen «Hørehjelpen» i synlig copy |
| Forbudt | CES-widget, skjult bridge, `sendQuery()`, Debug |
| Scope | Kun `/no/chat/` — ikke `/no/`, `/no/hjelp/`, `/no/bedre-lyd/` |
| Anbefalt branch | `feature/125m-c-standalone-ai-custom-r1` |

Før public prod: vurder rate limit / abuse-beskyttelse på `/api/chat`.
