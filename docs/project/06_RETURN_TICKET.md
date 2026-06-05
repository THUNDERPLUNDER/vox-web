# 06_RETURN_TICKET

## Formål
Gi en kort, fast retur fra utførelse tilbake til strategi, arkiv og prosjektstatus.

## Når brukes den
Bruk Return Ticket når:
- Cursor har implementert noe
- Codex har implementert noe
- en GitHub-oppgave er flyttet vesentlig
- et viktig design-, innholds- eller arbeidsgrep er landet
- resultatet påvirker arbeidsarkitektur, roadmap, VIS eller prosjektstatus

## Mal v1.1

```text
Status:
Hva ble gjort:
Filer endret:
Tester kjørt:
Commit:
Push-status:
PR:
Preview/deploy:
Hva Thomas bør verifisere:
Risiko / åpne punkter:
VIS/current-state impact:
Backstage impact:
Navigation/page-contract impact:
Follow-up issue if deferred:
```

## Operative presiseringer

`Commit` skal inneholde commit hash. `Push-status` skal si om branchen er pushet. `PR` skal lenke til PR, med mindre Thomas eksplisitt har bedt om noe annet.

`Preview/deploy` skal inneholde exact Preview URL når relevant. Ikke skriv at noe finnes i production før exact production URL er deployet og verifisert.

`VIS/current-state impact` skal si om `src/data/mvp-current-state.ts`, VIS frontpage eller VIS Runtime Feed må oppdateres. Hvis ikke relevant: `VIS/current-state impact: none`.

`Backstage impact` skal si om systemflyt, API, guard, env-vars, monitoring eller production-status påvirkes.

`Navigation/page-contract impact` skal si om routes, IA, sidekontrakter eller navigasjon påvirkes.

Ved større eller VIS-relevante endringer kan Return Ticket også utvides med:
- Designsystem impact
- Applied surfaces impacted
- VIS runtime update

**Presisering:** Intern shorthand er ikke nok. Return Ticket skal gi nok språk til at VIS kan forstås dagen etter, også uten muntlig kontekst.

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
