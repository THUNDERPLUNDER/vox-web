# 06_RETURN_TICKET

## Formål
Gi en kort, fast retur fra utførelse tilbake til strategi, arkiv og prosjektstatus.

## Når brukes den
Bruk Return Ticket når:
- Cursor har implementert noe
- en GitHub-oppgave er flyttet vesentlig
- et viktig design-, innholds- eller arbeidsgrep er landet
- resultatet påvirker arbeidsarkitektur, roadmap, VIS eller prosjektstatus

## Mal v1

Oppgave
- 

Hva ble gjort
- 

Hva ble faktisk landet
- 

Avvik fra plan
- 

Designsystem impact
- 

Current-state / VIS frontpage impact
- (Hvis ikke relevant: «Current-state update: Ikke nødvendig — ingen endring i MVP-status, designmønstre eller applied surfaces.»)

Backstage impact
- `Oppdatert: ...` / `Ikke relevant: ingen endring i systemflyt, API, guard, env-vars, monitoring eller production-status.` / `Må følges opp: ...`

VIS runtime update
- Oppdatert: ja / nei
- Hva skjer nå? (én menneskelig setning)
- Hvorfor gjør vi det?
- Område
- Status / fremdrift
- Neste beslutning
- Sist ferdigstilt
- Siste retur
- Lenker (primary + secondary)

**Presisering:** Intern shorthand er ikke nok. Return Ticket skal gi nok språk til at VIS kan forstås dagen etter, også uten muntlig kontekst.

Hvis ikke relevant: `VIS runtime update: Ikke nødvendig — ingen endring i hva Cursor/rigger jobber med akkurat nå.`

Applied surfaces impacted
- 

Follow-up needed
- 

Hva må oppdateres
- [ ] VIS (`src/data/mvp-current-state.ts` ved MVP-statusendring)
- [ ] VIS Runtime Feed (`src/data/vis-runtime-feed.ts` ved viktig Return Ticket)
- [ ] `/backstage/` (ved endring i systemflyt, API, guard, env-vars, monitoring eller production)
- [ ] `/designsystem/` (ved mønsterendring)
- [ ] roadmap
- [ ] Google Doc
- [ ] GitHub-kort
- [ ] prosjektstatus

Lenker / artefakter
- issue:
- commit:
- PR:
- preview:
- doc:

## Pilot 001 – Return Ticket for etablering av mal

Oppgave
- Etablere en enkel og gjenbrukbar Return Ticket-mal i repoet og bruke den på denne oppgaven som første eksempel.

Hva ble gjort
- Opprettet `docs/project/06_RETURN_TICKET.md`.
- Etablerte kort mal for daglig bruk.
- La inn første pilot-eksempel i samme fil.
- Oppdaterte beslutningslogg med at Return Ticket nå er etablert i repo.

Hva ble faktisk landet
- Return Ticket finnes nå som eget operativt artefakt i repoet.
- Malen er kort nok til daglig bruk.
- Første eksempel følger samme struktur som malen.

Avvik fra plan
- Ingen / [fyll inn hvis relevant]

Hva må oppdateres
- [ ] VIS
- [ ] roadmap
- [ ] Google Doc
- [ ] GitHub-kort
- [ ] prosjektstatus

Lenker / artefakter
- issue:
- commit:
- PR:
- preview:
- doc: `docs/project/06_RETURN_TICKET.md`
