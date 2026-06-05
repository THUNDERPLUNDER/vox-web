# Operating Rules v0.1

Operative regler for Cursor, Codex og menneskelig HITL i Viddel Lab.

## Source of truth

| Flate | Rolle |
|-------|--------|
| `/designsystem/` | Gjeldende designsystem-sannhet (mønstre, primitives, applied surfaces) |
| `/backstage/` | Gjeldende systemreferanse (AI-flow, API, guards, env-vars, production) |
| `src/data/mvp-current-state.ts` | Gjeldende operativ MVP-status og `currentSprint` |
| `/vis/sprints/...` | Aktiv sprint (control room) eller historikk (arkiv) — avhenger av `currentSprint.status` |
| GitHub Projects / issues | Oppgavebuss |
| VIS (`/vis/`) | Intern reviewflate — leser MVP-status fra registry |

## A. Designsystem-regel

Før UI-endringer skal `/designsystem/` og relevante mønstre leses.

- Finnes mønsteret → gjenbruk det.
- Nytt mønster eller vesentlig endring → oppdater `/designsystem/` **eller** forklar i Return Ticket hvorfor det ikke trengs.

## B. VIS current-state-regel

Hvis en oppgave endrer **MVP-status**, public flater, designmønstre, AI-status, applied surfaces eller neste risiko:

→ oppdater `src/data/mvp-current-state.ts`

VIS-forsiden (`/vis/`) henter «MVP nå» fra denne filen. Ikke hardkod statuskort i VIS-forsiden.

## B2. VIS sprint guard (maskinlesbar)

Aktiv sprint styres av `mvpCurrentState.currentSprint` i `src/data/mvp-current-state.ts`:

- `status: "active"` → vises som **Denne sprinten** i kontrollrom og som primær hub. **Ikke** i «Historikk / arkiv».
- `status: "closed"` → flytt til `closedSprints[]` og vis kun i arkiv.

Ved sprintskifte:

1. Sett gammel sprint til `closed` og legg den i `closedSprints`.
2. Oppdater `currentSprint` med ny id, route, label og `status: "active"`.
3. Kjør `npm run verify:vis-sprint-guard` (kjøres automatisk før `npm run build`).

Validering: `src/lib/vis-sprint-guard.ts` — aktiv sprint kan ikke ligge i `closedSprints` eller eksponeres som `historikk`-hub.

## B3. Backstage-regel (systemreferanse)

Backstage impact skal vurderes ved alle endringer i AI/API/system/production.

Hvis en oppgave endrer systemflyt, API, guard, limits, env-vars, Vercel/Upstash/CES-kobling, monitoring, access/login eller production-aktivering:

→ oppdater `/backstage/` (`src/data/backstage-v01.ts` + `src/pages/backstage/index.astro`) **eller** forklar eksplisitt i Return Ticket hvorfor Backstage ikke påvirkes.

Ved endring i `src/lib/chat-api-guard.ts` (limits, max length): oppdater Backstage protection rules og runbooks i samme PR.

Validering: `npm run verify:backstage-guard` (kjøres automatisk før `npm run build`).

## B4. VIS Runtime Feed — kommunikasjonsregel

`src/data/vis-runtime-feed.ts` vises øverst på `/vis/` som kort kontrollrom-sammendrag.

**Skriv for Thomas og Vibeke** — ikke som intern teknisk status.

- Første setning (`headline`) skal forklare arbeidet **uten forkunnskap**.
- Teknisk status kan stå sekundært (Arbeid, Status, lenker), men **ikke** være hovedbudskap.
- Tekniske ord (Hybrid, PostHog, Upstash, CES) i hovedbudskap skal forklares med vanlige ord.

**God retning:**

> «Vi vurderer hvordan Viddel skal måle bruk av AI-chatten før vi deler den med flere.»

**For intern — ikke bruk som headline/hovedtekst:**

> «Solution assessment ferdig — Thomas vurderer Hybrid v0.1.»

Etter viktig Return Ticket: oppdater feed **eller** forklar i Return Ticket hvorfor VIS runtime ikke påvirkes.

Validering: `npm run verify:vis-runtime-feed` (kjøres automatisk før `npm run build`).

## C. VIS frontpage-regel

- VIS-forsiden viser gjeldende MVP-status fra `getVisFrontpageEntries()` / `mvpCurrentState`.
- GitHub Projects er fortsatt oppgavebuss.
- `/designsystem/` er canonical designreferanse.

## D. Return Ticket-regel

Alle relevante Return Tickets skal inneholde:

1. **Status** — ferdig / delvis / blokkert.
2. **Hva ble gjort** — kort faktisk leveranse.
3. **Filer endret** — relevante filer.
4. **Tester kjørt** — inkludert `npm run build`, eller konkret hvorfor ikke.
5. **Commit** — commit hash.
6. **Push-status** — om branch er pushet.
7. **PR** — PR-lenke, med mindre annet er eksplisitt avtalt.
8. **Preview/deploy** — exact Preview/deploy URL når relevant.
9. **VIS/current-state impact** — skal `mvp-current-state.ts`, VIS frontpage eller VIS Runtime Feed oppdateres?
10. **Backstage impact** — skal `/backstage/` oppdateres? (Se under.)
11. **Navigation/page-contract impact** — påvirkes routes, IA, page contract eller navigasjon?
12. **Follow-up issue if deferred** — opprett/lenk issue hvis nødvendig oppdatering utsettes.

**Backstage impact** — forventet innhold:

- `Oppdatert: ...` (hva i runbooks, tjenestekart, feilstater eller lenker)
- `Ikke relevant: ingen endring i systemflyt, API, guard, env-vars, monitoring eller production-status.`
- `Må følges opp: ...`

Hvis ikke relevant, skriv eksplisitt:

> Backstage impact: Ikke relevant — ingen endring i systemflyt, API, guard, env-vars, monitoring eller production-status.

Hvis VIS/current-state ikke endres:

> VIS/current-state impact: none

**VIS runtime update** — forventet format:

- Oppdatert: ja / nei
- Hva skjer nå? (én menneskelig setning)
- Hvorfor gjør vi det?
- Område
- Status / fremdrift
- Neste beslutning
- Sist ferdigstilt
- Lenker

Intern shorthand er **ikke nok**. Return Ticket skal gi nok språk til at VIS kan forstås dagen etter, også uten muntlig kontekst.

## E. Agent-sjekkliste (kort)

1. Les issue/prompt og relevante docs.
2. Les `/designsystem/` ved UI-arbeid.
3. Les `src/data/mvp-current-state.ts` ved status-/VIS-arbeid.
4. Vurder Backstage (`/backstage/`) ved endringer i API, guard, env-vars eller production.
5. Vurder VIS Runtime Feed (`vis-runtime-feed.ts`) ved viktig Return Ticket — skriv for Thomas/Vibeke.
6. Hold endringer små; `npm run build` før ferdig.
7. Commit ferdig arbeid, push branch og opprett PR.
8. Return Ticket på relevant issue.

## Filer

- Registry: `src/data/mvp-current-state.ts`
- VIS Runtime Feed: `src/data/vis-runtime-feed.ts`, `src/lib/vis-runtime-feed-guard.ts`
- Backstage: `src/data/backstage-v01.ts`, `src/lib/backstage-guard.ts`
- Agent entry: `AGENTS.md`
- Codex onboarding: `docs/project/CODEX_OPERATING_SETUP_v0_1.md`
- Cursor: `.cursor/rules/viddel-operating-rules.mdc`
- Return Ticket-mal: `docs/project/06_RETURN_TICKET.md`
