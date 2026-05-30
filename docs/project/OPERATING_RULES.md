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

## C. VIS frontpage-regel

- VIS-forsiden viser gjeldende MVP-status fra `getVisFrontpageEntries()` / `mvpCurrentState`.
- GitHub Projects er fortsatt oppgavebuss.
- `/designsystem/` er canonical designreferanse.

## D. Return Ticket-regel

Alle relevante Return Tickets skal inneholde:

1. **Designsystem impact** — mønstre brukt / nye / `/designsystem/` oppdatert?
2. **Current-state / VIS frontpage impact** — skal `mvp-current-state.ts` oppdateres?
3. **Backstage impact** — skal `/backstage/` oppdateres? (Se under.)
4. **Applied surfaces impacted** — hvilke routes?
5. **Follow-up needed** — åpne risiko eller neste steg?

**Backstage impact** — forventet innhold:

- `Oppdatert: ...` (hva i runbooks, tjenestekart, feilstater eller lenker)
- `Ikke relevant: ingen endring i systemflyt, API, guard, env-vars, monitoring eller production-status.`
- `Må følges opp: ...`

Hvis ikke relevant, skriv eksplisitt:

> Backstage impact: Ikke relevant — ingen endring i systemflyt, API, guard, env-vars, monitoring eller production-status.

Hvis current-state ikke endres:

> Current-state update: Ikke nødvendig — ingen endring i MVP-status, designmønstre eller applied surfaces.

## E. Agent-sjekkliste (kort)

1. Les issue/prompt og relevante docs.
2. Les `/designsystem/` ved UI-arbeid.
3. Les `src/data/mvp-current-state.ts` ved status-/VIS-arbeid.
4. Vurder Backstage (`/backstage/`) ved endringer i API, guard, env-vars eller production.
5. Hold endringer små; `npm run build` før ferdig.
6. Return Ticket på relevant issue.

## Filer

- Registry: `src/data/mvp-current-state.ts`
- Agent entry: `AGENTS.md`
- Cursor: `.cursor/rules/viddel-operating-rules.mdc`
- Return Ticket-mal: `docs/project/06_RETURN_TICKET.md`
