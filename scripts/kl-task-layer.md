# Minimal KlarLyd Task Layer v0

Dette er en liten, bevisbar grunnmur der GitHub Projects v2 er sannhetskilde.

## Forutsetninger

- Sett `GITHUB_TOKEN` i shell (må ha tilgang til repo + projects).
- Repo: `THUNDERPLUNDER/vox-web`
- `--owner` kan være både personlig konto (User) og Organization.

### Token-scope (minimum)

- Classic PAT: `repo` + `project`
- Fine-grained token: repository access til `vox-web` + Projects write/read

### Trygg lokal token-bruk (uten commit)

Bruk kun shell-variabler, ikke legg token i repo-filer:

```bash
read -s GITHUB_TOKEN
export GITHUB_TOKEN
```

Etter testing:

```bash
unset GITHUB_TOKEN
```

## 1) Fase 1: Opprett foundation

```bash
GITHUB_TOKEN=... npm run kl:tasks -- setup-foundation --owner THUNDERPLUNDER --repo vox-web --project "Minimal KlarLyd Task Layer v0"
```

Dette oppretter (eller gjenbruker) prosjektet, og sikrer:

- KL Status: Backlog, Neste, I arbeid, Review, Ferdig, Senere
- Priority: P1, P2, P3
- Area: Content UI, AI UI, IA, CMS, Tech, Ops, Strategy
- Text-felt: Owner, Notes, Link

## Modellvalg (v1.1)

`create_task` oppretter en **GitHub Issue** og legger den inn i Project.

Fordeler:
- enkel sporbarhet (issue-url, assignees, PR-linking)
- repo-native arbeidsflyt
- Projects forblir sannhetskilde for status/prioritet/område

Ulemper:
- alt blir issues (også små interne notater)
- mer støy i issue-listen hvis brukt til alt

Senere vurdering:
- draft items i Project kan være nyttig for “notat først, issue senere”.

## 2) Fase 2: Basisoperasjoner

### list_tasks

```bash
GITHUB_TOKEN=... npm run kl:tasks -- list_tasks --owner THUNDERPLUNDER --project "Minimal KlarLyd Task Layer v0"
```

### create_task

```bash
GITHUB_TOKEN=... npm run kl:tasks -- create_task \
  --owner THUNDERPLUNDER \
  --repo vox-web \
  --project "Minimal KlarLyd Task Layer v0" \
  --title "Polish publishing trust block" \
  --status "Neste" \
  --priority P2 \
  --area "Content UI" \
  --ownerText "Thomas" \
  --notes "Small readability pass" \
  --link "https://github.com/THUNDERPLUNDER/vox-web"
```

### move_task

```bash
GITHUB_TOKEN=... npm run kl:tasks -- move_task \
  --owner THUNDERPLUNDER \
  --project "Minimal KlarLyd Task Layer v0" \
  --issue 123 \
  --status "I arbeid"
```

### set_priority

```bash
GITHUB_TOKEN=... npm run kl:tasks -- set_priority \
  --owner THUNDERPLUNDER \
  --project "Minimal KlarLyd Task Layer v0" \
  --issue 123 \
  --priority P1
```

## Smoke test (nøyaktig rekkefølge)

1. Sett token i shell (ikke i fil).
2. Kjør foundation:

```bash
npm run kl:tasks -- setup-foundation --owner THUNDERPLUNDER --repo vox-web --project "Minimal KlarLyd Task Layer v0"
```

3. Opprett én testoppgave:

```bash
npm run kl:tasks -- create_task \
  --owner THUNDERPLUNDER \
  --repo vox-web \
  --project "Minimal KlarLyd Task Layer v0" \
  --title "Smoke test task layer v1.1" \
  --status "Neste" \
  --priority P2 \
  --area Tech \
  --ownerText "Thomas" \
  --notes "Created in smoke test" \
  --link "https://github.com/THUNDERPLUNDER/vox-web"
```

4. Kjør `list_tasks` og noter issue-nummeret.
5. Kjør `move_task` til `I arbeid`.
6. Kjør `set_priority` til `P1`.
7. Kjør `list_tasks` på nytt og bekreft oppdatert status/prioritet.
8. `unset GITHUB_TOKEN`.

Alle kommandoer skriver også én maskinvennlig linje:
- `RESULT {...}`
Dette gjør output enklere å parse senere for AI/automatisering.

## Videreføring (senere, ikke nå)

- Evt. weekly summary som separat kommando.
- Evt. tynn MCP-wrapper rundt disse fire operasjonene.
