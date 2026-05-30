# Decision #125M-C — Standalone AI custom chat R1

Status: **Implemented — pending Thomas QA on Vercel Preview**  
Date: 2026-05-29  
Route: `/no/chat/`  
Branch: `feature/125m-c-standalone-ai-custom-r1`  
Related: [DECISION_125M_B_CES_HEADLESS_SANDBOX_POC.md](./DECISION_125M_B_CES_HEADLESS_SANDBOX_POC.md), [#157](https://github.com/THUNDERPLUNDER/vox-web/issues/157)

---

## Kort beslutning

`/no/chat/` er erstattet med **Viddel-eid standalone AI-flate** som kaller **`POST /api/chat`** → CES `runSession` server-side.

Ingen CES-widget, skjult bridge, `sendQuery()`, Debug eller synlig «Hørehjelpen»-copy.

Bygger på QA-verifisert fundament fra #125M-B (`spike/125m-b-ces-headless-poc`).

---

## Arkitektur

```
Bruker → /no/chat/ (Viddel UI)
       → POST /api/chat
       → ces-run-session (server)
       → CES runSession v1beta
       → normalisert tekst til transcript
```

---

## UX (R1)

| State | Atferd |
|-------|--------|
| **Idle** | H1, intro, eksempelspørsmål, trygghetsnote, composer |
| **Active** | Intro/eksempler skjult; transcript + composer |
| **Loading** | «Viddel svarer …» |
| **Error** | Trygg feilmelding, ingen tekniske detaljer |

**Desktop:** sentrert native AI-layout (~42rem).  
**Mobil:** full viewport, intern transcript-scroll, composer fast nederst.

**Handoff:** `?seed=` og `?q=` auto-sender første spørsmål (artikkel/hjelp/forside).

---

## Filer

| Fil | Endring |
|-----|---------|
| `src/pages/no/chat.astro` | Ny headless standalone UI |
| `src/layouts/BaseLayout.astro` | `shellVariant="standalone-chat"` for mobil viewport |
| `src/pages/api/chat.ts` | Portert fra PoC |
| `src/lib/ces-*.ts` | Portert fra PoC |
| `astro.config.mjs` | `@astrojs/vercel` adapter |
| `.env.example` | CES env-var-navn |

**Ikke endret:** `/no/`, `/no/hjelp/`, `/no/bedre-lyd/`

---

## Rate limit

**Ikke implementert i R1.** Serverless stateless deploy gjør enkel in-memory rate limit utilstrekkelig.  
Anbefaling før offentlig prod: Vercel KV / edge rate limit på `/api/chat`.

---

## Neste steg (etter QA)

- Thomas QA desktop + mobil (390px)
- Vurder rate limit før prod-merge
- Eventuell R2: multi-turn polish, seed-UX, layout finpuss
