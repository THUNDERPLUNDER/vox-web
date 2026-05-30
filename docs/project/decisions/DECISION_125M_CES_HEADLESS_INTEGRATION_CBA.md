# Decision #125M-A — CES Headless Integration CBA

Status: **CBA locked — Fase 1 PoC (#125M-B) QA verified; Fase 2 = #125M-C**  
Date: 2026-05-29 (updated 2026-05-29, QA verified)  
Sprint: 2026-W21 (Viddel Lab)  
Route (target): `/no/chat/`  
Related: #125 Reskin MVP Surfaces, #125I Cross-surface polish ([#157](https://github.com/THUNDERPLUNDER/vox-web/issues/157)), #125J (Spør Viddel CTA → `/no/chat/`)

**Stopped branch (do not merge):** `feature/125m-standalone-ai-polish-r1`

---

## Kort beslutning

Standalone AI på `/no/chat/` skal **ikke** bruke CES-widget (`<chat-messenger>`) — verken synlig, skjult, innpakket eller som pseudo-backend via `sendQuery()`.

Riktig retning: **Viddel-eid UI** → **server-side API** → **CES `runSession`**.

**Fase 0 (GCP)** er fullført. **Fase 1 (#125M-B)** er **QA-verifisert** på Vercel Preview — se [DECISION_125M_B_CES_HEADLESS_SANDBOX_POC.md](./DECISION_125M_B_CES_HEADLESS_SANDBOX_POC.md). **Fase 2 (#125M-C)** erstatter `/no/chat/` med Viddel-eid headless UI — ikke startet.

---

## Hva som ble forsøkt (#125M R1) — og hvorfor det var feil

Branch `feature/125m-standalone-ai-polish-r1` polerte `/no/chat/` med:

- Viddel editorial shell (H1, intro, eksempelchips, trygghetsnote)
- **Synlig** `<chat-messenger id="ces-demo-widget">` som hoved-UI
- Widget innpakket i Viddel-kort / `vox-surface-embedded-app`
- Debug-panel og toggle beholdt
- Mobil full-viewport CSS rundt fortsatt synlig widget

**Hvorfor feil:**

1. Brukeropplevelsen var fortsatt **embedded CES-widget** — grå widgetflate, widget-chrome, «Hørehjelpen»-følelse.
2. Viddel-dekor rundt widget er **widget-wrapper**, ikke eid dialogflate.
3. Thomas QA (2026-05): `/no/chat/` skal **ikke** bruke CES-widget i det hele tatt.
4. Retningen forsterket feil mental modell (style widget) i stedet for å erstatte den.

**`main` hadde allerede samme grunnproblem** (synlig widget); R1 forverret retningen med mer Viddel-dekor rundt widget.

---

## Absolutt krav

| Krav | Status etter denne CBA |
|------|------------------------|
| Ingen CES-widget på `/no/chat/` | **Påkrevd** — ikke implementert ennå |
| Ingen `<chat-messenger>` i DOM på `/no/chat/` | **Påkrevd** |
| Ingen skjult widget-bridge (`inline-chat-shell__ces-bridge--hidden`) | **Påkrevd** for standalone |
| Ingen `sendQuery()` fra `/no/chat/` | **Påkrevd** |
| Ingen client-side credentials / tokenBroker på chat-flaten | **Påkrevd** |
| Viddel-eid composer + transcript + loading/error | **Målbilde** |
| Backend kun server-side | **Påkrevd** |

**Merk:** Artikkel-inline AI (`ArticleInlineChatShell`) bruker fortsatt skjult CES-bridge — det er **ikke** målbildet for `/no/chat/` etter denne CBA.

---

## Riktig arkitektur

```
Bruker → Viddel UI (composer, transcript, seeds)
       → POST /api/chat (Vercel serverless)
       → CES runSession (server-side OAuth / service account)
       → normalisert tekst-svar til frontend
```

### Anbefalt Google API

**Primær:** CES `runSession` — matcher eksisterende deployment IDs i repo.

```http
POST https://ces.googleapis.com/v1/projects/1088102295663/locations/eu/apps/1741e68d-0528-4625-8b83-99a0dbb5298f/sessions/{SESSION_ID}:runSession
```

Body (minimal):

```json
{
  "config": {
    "session": "projects/1088102295663/locations/eu/apps/1741e68d-0528-4625-8b83-99a0dbb5298f/sessions/{SESSION_ID}",
    "deployment": "projects/1088102295663/locations/eu/apps/1741e68d-0528-4625-8b83-99a0dbb5298f/deployments/dc1619d0-44a1-401b-92a6-1357c29274ea"
  },
  "inputs": [{ "text": "brukerens melding" }]
}
```

Dokumentasjon:

- https://docs.cloud.google.com/customer-engagement-ai/conversational-agents/ps/deploy/api-access
- https://docs.cloud.google.com/customer-engagement-ai/conversational-agents/ps/reference/rest/v1/projects.locations.apps.sessions/runSession

### Hvorfor ikke Dialogflow CX `detectIntent` som primær kanal

Repoet har **CES App/Deployment IDs** (fra `BaseLayout.astro` / `02_LINKS.md`), ikke Dialogflow CX **Agent ID** i session-path-format:

`projects/{p}/locations/{l}/agents/{agent}/sessions/{s}:detectIntent`

CES `runSession` er riktig abstraksjonslag for dagens oppsett. Under panseret kan CES delegere til remote Dialogflow — uten at frontend trenger agent-ID.

`detectIntent` kan være relevant senere hvis underliggende CX agent-ID er eksplisitt kartlagt og avtalt, men er **ikke** førstevalg for dette repoet nå.

---

## Hva repoet mangler i dag

| Mangler | Beskrivelse |
|---------|-------------|
| **Astro/Vercel adapter** | `@astrojs/vercel` + `output: 'hybrid'` eller `'server'` — dagens build er statisk |
| **Server-side API endpoint** | f.eks. `src/pages/api/chat.ts` — finnes ikke |
| **Service account / secrets** | Kun `STORYBLOK_DELIVERY_API_TOKEN` i `.env.example`; ingen GCP SA |
| **Bekreftet API access deployment** | Dagens `deploymentName` kan være Messenger-kanal; API access-kanal må verifiseres i GCP |
| **Headless PoC** | Ingen sandbox med live `runSession`-kobling |

Eksisterende CES bootstrap i `BaseLayout.astro` (widget script + `tokenBroker`) skal **ikke** gjenbrukes for `/no/chat/` headless-løsning.

---

## Fase 0 — GCP-sjekkliste (Thomas / Owner, ingen kode)

- [ ] Verifiser at CES Agent Studio har **«Set up API access»**-kanal (Deploy → New channel)
- [ ] Bekreft at `dc1619d0-44a1-401b-92a6-1357c29274ea` er riktig deployment for `runSession`, eller noter ny API access deployment ID
- [ ] Opprett service account med `roles/ces.client` (`ces.sessions.runSession`)
- [ ] Test manuelt med `curl` + `gcloud auth print-access-token` mot `runSession`
- [ ] Lagre SA JSON som Vercel encrypted env (aldri i repo)
- [ ] Avklar språkkode (sannsynlig `nb-NO` / `no`) i curl-test
- [ ] Bekreft DPA / bruksområde uendret (ingen agent-config-endring i denne CBA)

Referanse IAM: https://cloud.google.com/iam/docs/roles-permissions/ces

---

## Fase 1 — Sandbox PoC-plan (etter Fase 0)

**Branch:** ny spike-branch (f.eks. `spike/125m-a-ces-headless-poc`) — **ikke** `feature/125m-standalone-ai-polish-r1`

1. `npx astro add vercel` → `output: 'hybrid'`
2. Env vars i `.env.example` (uten secrets): `CES_PROJECT_ID`, `CES_LOCATION`, `CES_APP_ID`, `CES_DEPLOYMENT_ID`
3. `src/lib/ces-run-session.ts` — server-only helper
4. `src/pages/api/chat.ts` — proxy (`prerender = false`)
5. `src/pages/no/sandbox/ces-headless-spike.astro` — `noindex`, custom UI, **ingen widget**
6. Ett live kall til `/api/chat`, vis plain text response
7. `npm run build` grønn
8. Thomas QA på Vercel preview

**Målbilde for senere `/no/chat/` (Fase 2, etter PoC QA):**

- Desktop: H1 «Spør Viddel», intro, composer, eksempelspørsmål, dialog/svarflate
- Mobil: full viewport, header, fast composer, intern scroll, ingen footer som stjeler plass
- Copy per #125M brief (H1, intro, chips, trygghetsnote)

---

## Hva som ikke skal gjøres

| Forbudt | Grunn |
|---------|-------|
| Merge `feature/125m-standalone-ai-polish-r1` | Feil retning — widget-wrapper |
| Widget-wrapper / synlig `<chat-messenger>` på `/no/chat/` | Brudd på absolutt krav |
| Skjult widget-bridge på `/no/chat/` | Pseudo-backend — ikke akseptert for standalone |
| `sendQuery()` fra `/no/chat/` | Widget-API — ikke headless |
| Client-side credentials / tokenBroker på chat-flaten | Sikkerhetskrav |
| Endre Google/CES agentoppsett | Utenfor mandat |
| Produksjonsendring av `/no/chat/` før sandbox PoC QA | Risiko |
| Endre `/no/`, `/no/hjelp/`, `/no/bedre-lyd/` i headless-spor | Scope |

---

## Status etter spike (#125M-A)

| Punkt | Status |
|-------|--------|
| #125M-A spike (audit + plattformkartlegging) | **Completed** |
| Feil branch stoppet | **Ja** — ikke merge |
| Implementation | **Blocked** — pending GCP / API access setup |
| Produksjon `/no/chat/` | **Uendret** (fortsatt synlig widget på `main`) |

---

## Arbeidsregel

Bruk dette dokumentet som gjeldende retning for standalone AI på `/no/chat/` til eksplisitt nytt mandat.

All implementasjon starter med Fase 0 i GCP, deretter beskyttet Fase 1 PoC. Produksjonsflate endres **ikke** før PoC er QA-godkjent.

Feil branch `feature/125m-standalone-ai-polish-r1` skal **ikke** merges, rebases eller gjenbrukes som utgangspunkt.
