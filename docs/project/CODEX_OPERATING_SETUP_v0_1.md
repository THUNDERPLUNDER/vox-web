# Codex Operating Setup v0.1

Kort onboarding for å bruke Codex som standard executor i Viddel Lab / vox-web.

## Når bruke Codex

Bruk Codex først for rutinearbeid som har tydelig issue, akseptkriterier og lav runtime-risiko:

- docs
- data/source inventory
- scripts
- validators
- små Astro/VIS-sider
- strukturert GitHub issue-arbeid
- PR-arbeid med klare akseptkriterier

## Når bruke Cursor

Bruk Cursor som reserve eller spesialist når arbeidet krever:

- visuell debugging
- CSS/layout-finjustering
- live dev-server-iterasjon
- lokal IDE-tung filnavigering
- situasjoner der Codex står fast

## Standard arbeidsflyt

1. Start fra GitHub issue eller tydelig prompt.
2. Gjør safe-read av relevante repo-filer før endring.
3. Hold scope lite og reviewbart.
4. Bruk eksisterende mønstre, tokens, routes og VIS-struktur.
5. Ikke endre backend, env, datastore, import-rutiner eller PostHog uten eksplisitt beslutning.
6. Ikke logg prompt, AI-svar eller privat samtaleinnhold.
7. Kjør relevante tester, minimum `npm run build` hvis repo-endringer er gjort.
8. Commit, push branch og opprett PR.
9. Legg Return Ticket på issue.

## Return Ticket-mal

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

## Preview og deploy-verifisering

Oppgi exact Preview URL når en PR har relevant visuell eller sidebasert effekt.

Ikke skriv at noe finnes i production før det faktisk er deployet og verifisert på exact production URL. Hvis Preview ikke er relevant for en docs/data/script-endring, skriv det eksplisitt i Return Ticket.

## Første Codex-pilot

Anbefalt første praktiske pilot er #232: `Expand source inventory coverage across Drive source pools v0.1`.

Formålet er å teste Codex på en strukturert docs/data/script-oppgave uten production-runtime-risiko. Ikke start #232 som del av Codex operating setup v0.1.

## Uten eksplisitt beslutning skal Codex ikke

- gjøre runtime-endringer
- endre backend/env
- importere datastore-data
- gjøre Drive-endringer
- endre PostHog
- logge prompt eller AI-svar
- redesigne VIS
