# Viddel Execution Economy v0.1

**Status:** Canonical execution-economy rule  
**Date:** 2026-09-09  
**Purpose:** Keep AI-assisted work low-friction for Thomas and low-cost in time/tokens without reducing useful autonomy.

## Core principle

**FAST limits the breadth of autonomy, not the degree of human involvement.**

Reversible work should be routed agentically between the right executors. Thomas is used for real decision gates, not as a manual bridge between tools.

## Default execution mode

`FAST / NO-HITL` is the default.

FAST means:

- solve only the bounded task
- inspect only what is necessary
- reuse existing patterns
- no broad architecture or best-practice audit unless explicitly required
- no adjacent cleanup or opportunistic refactor
- no external-system administration inside a repo task unless explicitly delegated
- use proportional verification: targeted verifier → build → diff-check, plus actual browser/runtime QA where user behavior requires it

NO-HITL means:

- reversible, low-risk steps should complete without Thomas becoming the tool operator
- tool boundaries are routed to the appropriate executor rather than automatically escalated to Thomas
- repo/code/test/PR work stays with Codex
- GitHub/Drive/Vercel/admin steps are handled by @rigger or the appropriate connected tool/Work flow when available
- Thomas and Vibeke are used for human product QA and decisions, not routine tool handoffs

## Execution modes

1. **FAST / NO-HITL** — default for small, reversible, bounded tasks.
2. **DEEP / NO-HITL** — only when complexity or consequence genuinely requires deeper analysis, while execution can still be delegated.
3. **HITL GATE** — only when Thomas must make a real decision or approve a consequential action.

Typical HITL gates:

- product or architecture choices with multiple defensible options
- irreversible or destructive actions
- material spend or contractual commitment
- access/secrets not already delegated
- external communication or commitment on behalf of Viddel
- production release/merge when consequence warrants explicit owner approval

## HANDOFF_REQUIRED

When an executor reaches a system/tool boundary outside its mandate, it must not broaden its own investigation and must not automatically ask Thomas to perform manual tool work.

Return exactly one bounded handoff:

```text
HANDOFF_REQUIRED
target: [GitHub / Vercel / Drive / @rigger / Work / other]
action: [one concrete action]
reason: [why this is required]
blocks: [which acceptance criterion is blocked]
```

The orchestrating layer routes or performs the next reversible step. Escalate to Thomas only if the handoff also creates a real HITL GATE.

## Stop-loss

Do not autonomously expand scope when the task unexpectedly requires:

- a new subsystem
- a new architecture decision
- more than one unexpected dependency
- materially broader system scope than the execution contract

Route to the appropriate executor or return one explicit blocker.

## Security proportionality

Security and privacy controls must be proportional to actual exposure and product phase. Before limited beta, protect real high-consequence risks, but do not add access/security infrastructure merely because it is generic best practice if that infrastructure creates more testing and operational friction than the current exposure justifies.

## Return Ticket

The Return Ticket should summarize the completed agentic chain. Thomas should normally receive:

- what was done
- what was verified
- what, if anything, requires an owner decision
- the next natural step

Do not surface intermediate tool handoffs that can be completed without him.

## Default Codex header

Use this in bounded Codex execution contracts unless a documented reason requires DEEP:

```text
EXECUTION MODE: FAST / NO-HITL

Solve only the bounded task below.
- inspect only what is necessary
- reuse existing patterns
- no architecture redesign
- no adjacent cleanup
- no best-practice research unless required by the task
- no external-system administration unless explicitly assigned
- if a tool/system boundary is reached, return HANDOFF_REQUIRED instead of expanding scope or asking Thomas to operate the tool
- if scope expands materially, STOP and return one blocker

Verification: targeted verifier → build → diff-check, plus exact runtime/browser QA only where required by the acceptance criteria.

Commit, push, commit hash, push status, exact QA, Return Ticket. STOP.
```

## Relationship to existing rules

This rule complements `docs/project/AI_DEVELOPMENT_CONTRACT.md`, `AGENTS.md`, and `docs/project/OPERATING_RULES.md`.

The AI Development Contract still governs product understanding and implementation quality. Execution Economy governs how much autonomous breadth, research, verification and human tool involvement are justified for a task.
