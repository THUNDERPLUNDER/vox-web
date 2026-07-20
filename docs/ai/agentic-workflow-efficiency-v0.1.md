# Agentic workflow efficiency v0.1

Status: Active operating reference  
Owner issue: #113

## Purpose

Make AI-assisted repository work smaller, faster to verify and less dependent on repeated context discovery.

This document supplements `AGENTS.md` and `docs/project/OPERATING_RULES.md`. It does not replace GitHub Issues, the Return Ticket contract or domain-specific rules.

## When this applies

Use this method for non-trivial Codex, Cursor or other repository-agent tasks.

A task is non-trivial when it touches several files, requires investigation, changes behavior, or needs a PR and explicit verification.

## Core principles

### 1. Issue and scope first

Start from one GitHub issue or one explicit work order.

Before editing, identify:

- the requested outcome
- files and surfaces likely to be affected
- acceptance criteria
- explicit non-goals
- the evidence required before completion

Do not turn implementation work into new strategy.

### 2. Deterministic context before reasoning

Collect fixed facts with repository tools before asking an agent to interpret them.

A useful context package can include:

```text
issue-summary.md
changed-files.txt
pr-diff.patch
check-results.txt
relevant-docs.md
runtime-evidence.md
```

Generate only what the task needs. Do not create permanent context artifacts unless they have lasting project value.

### 3. Use one narrow mode

Choose one primary mode per task:

| Mode | Minimum context | Expected output |
| --- | --- | --- |
| Review | issue, diff, changed files, checks | findings, risk and recommendation |
| Implementation | issue, relevant files, contracts | small code change, checks and PR |
| Design | runtime evidence, tokens, patterns, affected CSS | bounded visual change and route/state QA |
| Content | source material, content contract, target surface | reviewed content change |
| Release | commit/PR, checks, deploy status, exact URL | release decision and verification |
| Docs | source references, current implementation | concise updated reference |

If a task requires several modes, split it or state the handoff between them.

### 4. Script before agent

Use deterministic tools for deterministic work.

Examples:

- changed files: `git diff --name-only`
- patch: `git diff` or PR diff
- build: `npm run build`
- known text lookup: repository search
- issue and PR state: GitHub connector or CLI
- computed CSS values: browser computed styles

Use agents for synthesis, trade-offs, implementation and review—not as a substitute for basic retrieval.

### 5. Trigger only relevant checks

Match verification to the change:

- docs-only: Markdown/source review and repository checks when required by the repo
- UI/CSS: build plus exact route/state/browser verification
- API/system: build, contract checks and Backstage impact
- VIS/current-state: relevant registry/feed guards
- deploy: exact preview or production URL

Do not claim a route or deployment is verified unless the exact URL was opened and checked.

### 6. Stop conditions

Stop and report rather than widening scope when:

- the requested outcome is met
- evidence contradicts the proposed approach
- the task depends on a human visual or product decision
- two implementation attempts fail for the same reason
- a required source or credential is unavailable

Create or link a follow-up issue when necessary. Do not hide deferred work inside the current PR.

## Pre-agent context checklist

Before implementation, gather only the relevant items:

- [ ] issue/work order and latest comments
- [ ] relevant operating and domain rules
- [ ] current implementation files
- [ ] current branch/diff state
- [ ] previous Return Tickets or decisions that constrain the change
- [ ] runtime or visual evidence when source inspection is insufficient
- [ ] required checks and exact verification target

## Run log and Return Ticket

The existing Return Ticket fields remain mandatory. For non-trivial agent work, also record:

```text
Primary mode:
Deterministic context used:
What was verified by tools rather than inferred:
What scripting or fixed retrieval avoided:
Remaining assumptions:
```

Always retain the existing requirements for status, changed files, tests, commit hash, push status, PR, deploy/preview, VIS/current-state impact, Backstage impact, navigation/page-contract impact and deferred follow-up.

## Relationship to other rules

- Entry point: `AGENTS.md`
- Full operating rules: `docs/project/OPERATING_RULES.md`
- General Cursor operating rule: `.cursor/rules/viddel-operating-rules.mdc`
- Design work: `docs/design/VIDDEL_DESIGN_SYSTEM_FOUNDATION_v0_1.md` and `.cursor/rules/design-system-foundation.mdc`

## Explicit non-goals

Do not use this standard to introduce:

- token auditing infrastructure
- new agent platforms
- MCP infrastructure
- broad CI automation
- permanent generated context files
- AI review on every change regardless of relevance

Add automation only through a separate, explicit decision and issue.
