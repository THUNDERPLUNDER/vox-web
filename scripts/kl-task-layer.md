# Minimal KlarLyd Task Layer v0

Dette er en liten, bevisbar grunnmur der GitHub Projects v2 er sannhetskilde.

## Forutsetninger

- Sett `GITHUB_TOKEN` i shell (må ha tilgang til repo + projects).
- Repo: `THUNDERPLUNDER/vox-web`

## 1) Fase 1: Opprett foundation

```bash
GITHUB_TOKEN=... npm run kl:tasks -- setup-foundation --owner THUNDERPLUNDER --repo vox-web --project "Minimal KlarLyd Task Layer v0"
```

Dette oppretter (eller gjenbruker) prosjektet, og sikrer:

- Status: Backlog, Neste, I arbeid, Review, Ferdig, Senere
- Priority: P1, P2, P3
- Area: Content UI, AI UI, IA, CMS, Tech, Ops, Strategy
- Text-felt: Owner, Notes, Link

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

## Videreføring (senere, ikke nå)

- Evt. weekly summary som separat kommando.
- Evt. tynn MCP-wrapper rundt disse fire operasjonene.
