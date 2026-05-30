# Operating Rules v0.1

Operative regler for Cursor, Codex og menneskelig HITL i Viddel Lab.

## Source of truth

| Flate | Rolle |
|-------|--------|
| `/designsystem/` | Gjeldende designsystem-sannhet (mønstre, primitives, applied surfaces) |
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

## C. VIS frontpage-regel

- VIS-forsiden viser gjeldende MVP-status fra `getVisFrontpageEntries()` / `mvpCurrentState`.
- GitHub Projects er fortsatt oppgavebuss.
- `/designsystem/` er canonical designreferanse.

## D. Return Ticket-regel

Alle relevante Return Tickets skal inneholde:

1. **Designsystem impact** — mønstre brukt / nye / `/designsystem/` oppdatert?
2. **Current-state / VIS frontpage impact** — skal `mvp-current-state.ts` oppdateres?
3. **Applied surfaces impacted** — hvilke routes?
4. **Follow-up needed** — åpne risiko eller neste steg?

Hvis ikke relevant, skriv eksplisitt:

> Current-state update: Ikke nødvendig — ingen endring i MVP-status, designmønstre eller applied surfaces.

## E. Agent-sjekkliste (kort)

1. Les issue/prompt og relevante docs.
2. Les `/designsystem/` ved UI-arbeid.
3. Les `src/data/mvp-current-state.ts` ved status-/VIS-arbeid.
4. Hold endringer små; `npm run build` før ferdig.
5. Return Ticket på relevant issue.

## Filer

- Registry: `src/data/mvp-current-state.ts`
- Agent entry: `AGENTS.md`
- Cursor: `.cursor/rules/viddel-operating-rules.mdc`
- Return Ticket-mal: `docs/project/06_RETURN_TICKET.md`
