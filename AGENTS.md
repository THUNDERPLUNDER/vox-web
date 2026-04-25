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
- docs/project/00_STATE.md
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
