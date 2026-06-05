# AGENTS.md

## Project
This repository is the KlarLyd / VOX web MVP.
KlarLyd is an AI-assisted service for hearing-aid users, built around helpful content, hub-and-spoke IA, and a CES/RAG-based assistant.
The product should feel warm, premium, technically strong, and useful in everyday life. Avoid clinical or hospital-like expression unless explicitly requested.

## Stack
- Astro 5
- Tailwind CSS v4
- CSS tokens/custom properties
- Storyblok for selected content flows
- Vercel deployment
- GitHub issues/PRs as task bus

## Working role
Codex and Cursor are implementation agents.
Use GitHub and the repository as source of truth for code, project docs, issues, branches and PRs.
Do not assume access to ChatGPT project memory. Read repo context before coding.

Codex is the default executor for routine repo work:
- docs
- data/source inventory
- scripts
- validators
- small Astro/VIS pages
- structured GitHub issue work
- PR work with clear acceptance criteria

Cursor is reserve/specialist for:
- visual debugging
- CSS/layout fine tuning
- live dev-server iteration
- local IDE-heavy file navigation
- cases where Codex gets stuck

## Before coding
Every task starts from a GitHub issue or a clear prompt. If the task is ambiguous, clarify scope before changing files.

For non-trivial tasks, first do safe-read: inspect relevant project docs and files before editing.
Prefer reading:
- README.md
- docs/project/OPERATING_RULES.md
- docs/project/00_STATE.md
- src/data/mvp-current-state.ts
- `/designsystem/` (for UI/pattern work)
- docs/project/03_DECISIONS.md
- docs/project/07_GITHUB_TASK_FLOW.md
- files directly related to the requested route/component

For ambiguous or larger tasks:
- propose a short plan first
- wait for approval before large changes

## Rules
- Keep changes small and reviewable.
- Prefer existing components, tokens, CSS patterns and Astro structure.
- Preserve IA, routes and content model unless explicitly asked.
- Use existing VIS structure, page contracts and navigation patterns.
- Do not introduce new dependencies without approval.
- Do not rewrite working areas unnecessarily.
- Avoid broad refactors unless the task explicitly asks for it.
- Do not make visual redesigns without a clear brief.
- Do not change backend, env, datastore, import routines or PostHog without an explicit decision.
- Do not log prompts, AI answers or private conversation content.
- Do not claim something exists in production before it is deployed and verified on the exact production URL.
- Commit messages, branch names, code and filenames may be in English.
- User-facing summaries and QA should be in Norwegian.

## Operating rules v0.1

Full doc: `docs/project/OPERATING_RULES.md`

**Designsystem:** Before UI changes, read `/designsystem/`. Reuse patterns; update `/designsystem/` or explain in Return Ticket if changing patterns.

**Current state:** When MVP status, surfaces, patterns, AI status or risks change, update `src/data/mvp-current-state.ts`. VIS frontpage reads from this file.

**Source of truth:** `/designsystem/` = design patterns · `src/data/mvp-current-state.ts` = operativ MVP-status · `/vis/sprints/...` = historikk.

**Return Ticket extras:** VIS/current-state impact · Backstage impact · Navigation/page-contract impact · Follow-up if deferred. If N/A, say so explicitly.

## Verification
Run relevant checks before finishing.
Default check:
- npm run build

If a check cannot be run, explain why.

For UI/page changes, also provide the exact Preview URL when relevant. Do not describe a Preview or production state as verified unless the exact URL has been opened and checked.

## Return ticket
End every completed issue task with a Norwegian Return Ticket on the issue. Use this template:

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

The Return Ticket must include commit hash, push status, PR link, tests run and exact Preview/deploy URL when relevant.

## Agent Workflow v0.1
Dette er operativ minimumsflyt for Codex og Cursor i dette repoet.

1. **Startgrunnlag**
   - Arbeid starter fra en GitHub issue eller en tydelig prompt.
   - Hvis oppgaven er uklar, avklar scope før kodeendring.

2. **Rolle**
   - Codex/Cursor er utførende kodeagenter.
   - Agenten implementerer bestilt arbeid, ikke ny strategi.

3. **Scope og endringer**
   - Hold endringer små, avgrensede og reviewbare.
   - Unngå brede refaktorer og sideeffekter uten eksplisitt bestilling.
   - Ikke endre strategi, roadmap eller arkitektur uten eksplisitt mandat.
   - Ikke endre backend/env/datastore/PostHog uten eksplisitt beslutning.
   - Ikke logg prompt eller AI-svar.

4. **Les før endring**
   - Les relevante filer i berørt filscope før du gjør endringer.
   - Bruk eksisterende mønstre, struktur og navngiving i repoet.

5. **Verifisering før ferdigmelding**
   - Kjør relevante repo-sjekker for endringen.
   - Minimum: `npm run build` (eller forklar konkret hvorfor den ikke kan kjøres).
   - Ved Preview/deploy: oppgi exact URL og hva som faktisk er verifisert.
   - Ikke si at noe finnes i production før production URL er deployet og verifisert.

6. **Feilhåndtering ved funn etterpå**
   - Forklar kort hvorfor feilen ikke ble fanget tidligere.
   - Foreslå ett konkret QA-punkt eller én instruks som kan hindre samme feiltype.

7. **Avslutning**
   - Avslutt med Return Ticket ved ferdig arbeid.
   - Commit ferdig arbeid.
   - Push branch.
   - Opprett PR, med mindre Thomas eksplisitt har bedt om noe annet.
   - Oppgi commit hash, push-status og PR-lenke.
   - Legg Return Ticket på issue når ferdig.

8. **Obligatorisk impact-sjekk**
   - VIS/current-state impact: vurder om `src/data/mvp-current-state.ts`, VIS frontpage eller VIS Runtime Feed må oppdateres. Hvis ikke: skriv `VIS/current-state impact: none`.
   - Backstage impact: vurder om `/backstage/` påvirkes av system/API/guard/env/monitoring/production-endringer.
   - Navigation/page-contract impact: vurder om routes, IA, sidekontrakter eller navigasjon påvirkes.
   - Hvis en nødvendig oppdatering utsettes, opprett eller lenk follow-up issue.
