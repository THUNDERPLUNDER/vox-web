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
Codex is an implementation agent.
Use GitHub and the repository as source of truth for code, project docs, issues, branches and PRs.
Do not assume access to ChatGPT project memory. Read repo context before coding.

## Before coding
For non-trivial tasks, first inspect relevant project docs and files.
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
- Do not introduce new dependencies without approval.
- Do not rewrite working areas unnecessarily.
- Avoid broad refactors unless the task explicitly asks for it.
- Do not make visual redesigns without a clear brief.
- Commit messages, branch names, code and filenames may be in English.
- User-facing summaries and QA should be in Norwegian.

## Operating rules v0.1

Full doc: `docs/project/OPERATING_RULES.md`

**Designsystem:** Before UI changes, read `/designsystem/`. Reuse patterns; update `/designsystem/` or explain in Return Ticket if changing patterns.

**Current state:** When MVP status, surfaces, patterns, AI status or risks change, update `src/data/mvp-current-state.ts`. VIS frontpage reads from this file.

**Source of truth:** `/designsystem/` = design patterns · `src/data/mvp-current-state.ts` = operativ MVP-status · `/vis/sprints/...` = historikk.

**Return Ticket extras (when relevant):** Designsystem impact · Current-state / VIS impact · Applied surfaces · Follow-up. If N/A: `Current-state update: Ikke nødvendig — ingen endring i MVP-status, designmønstre eller applied surfaces.`

## Verification
Run relevant checks before finishing.
Default check:
- npm run build

If a check cannot be run, explain why.

## Return ticket
End every task with a Norwegian return ticket:

- Status
- Hva ble gjort
- Filer endret
- Tester kjørt
- Hva Thomas bør verifisere
- Eventuelle risikoer eller åpne punkter
- Designsystem impact (when relevant)
- Current-state / VIS frontpage impact (when relevant)
- Applied surfaces impacted (when relevant)

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

4. **Les før endring**
   - Les relevante filer i berørt filscope før du gjør endringer.
   - Bruk eksisterende mønstre, struktur og navngiving i repoet.

5. **Verifisering før ferdigmelding**
   - Kjør relevante repo-sjekker for endringen.
   - Minimum: `npm run build` (eller forklar konkret hvorfor den ikke kan kjøres).

6. **Feilhåndtering ved funn etterpå**
   - Forklar kort hvorfor feilen ikke ble fanget tidligere.
   - Foreslå ett konkret QA-punkt eller én instruks som kan hindre samme feiltype.

7. **Avslutning**
   - Avslutt med Return Ticket ved ferdig arbeid.
