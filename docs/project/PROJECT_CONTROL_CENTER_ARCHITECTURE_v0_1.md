# Project Control Center Architecture v0.1

Status: Architecture pattern  
Date: 2026-05-10  
Applies to: Viddel now, reusable for similar projects later  
Origin issue: #118  

## 1. Purpose

A Project Control Center is a single front door into a project's canonical knowledge, active standards, agent roles and operating rules.

It exists because important project knowledge should not live in one person's memory, scattered chat threads or isolated issue numbers.

The pattern is designed for projects that use several agents and surfaces:

- ChatGPT / @rigger
- Cursor
- Gemini / @navigator
- GitHub issues and repo docs
- VIS as operational display layer
- Google Workspace as shared human/assistant surface

## 2. Problem it solves

Without a Control Center:

- each new thread starts with partial context
- Thomas must remember issue numbers and file names
- important standards can be forgotten
- Gemini, ChatGPT and Cursor may operate from different context
- research findings can accidentally become external claims before source QA
- VIS can become a set of pages without a clear front door

A Control Center reduces this by giving all agents and humans one canonical starting point.

## 3. Core principle

> If a rule, decision, standard or reference matters across threads and agents, it must be registered in the Project Control Center.

The Control Center does not replace detailed documents. It points to them and explains how they should be used.

## 4. Three-layer model

### Layer 1 — Control Center

One short index document per project.

Examples:

- `docs/project/VIDDEL_PROJECT_CONTROL_CENTER_v0_1.md`
- `/vis/system/control-center`

Role:

- front door
- canonical map
- active guardrails
- agent instructions
- what Thomas should not need to remember

### Layer 2 — Canonical documents

Specialized documents that contain real detail.

Examples:

- MVP definition
- data ecosystem note
- source QA standard
- deep research prompts
- stakeholder presentation brief
- IA principles
- design system references

Role:

- source material
- working standards
- research prompts
- reusable project knowledge

### Layer 3 — Execution and runtime

Operational sources of truth.

Examples:

- GitHub issues
- GitHub runtime status
- roadmap timeline
- Return Tickets
- commits
- VIS runtime pages

Role:

- active work state
- implementation history
- current status

## 5. What belongs in a Control Center

Each project Control Center should include:

1. Project identity
2. Current phase
3. Current focus
4. Canonical documents
5. Active strategic tracks
6. Standards and guardrails
7. Agent roles
8. What to check before external use
9. How to start new threads/tasks
10. What should be mirrored to Workspace
11. What the human project owner should not need to remember

## 6. What does not belong

The Control Center should not become:

- a full roadmap
- a backlog
- a replacement for GitHub issues
- a long strategy document
- a dumping ground for every note
- a status feed that must be constantly rewritten manually

It should stay short enough to be read first.

## 7. Agent usage contract

### ChatGPT / @rigger

Should read or reference the Control Center when working on:

- project status
- strategy
- research synthesis
- presentations
- repo orientation
- canonical summaries
- cross-thread continuity

### Cursor

Should safe-read the Control Center before larger repo work.

Cursor prompts can say:

```text
Safe-read the Project Control Center first, then follow the relevant linked docs.
```

### Gemini / @navigator

Gemini may not reliably read repo URLs. Therefore each active Control Center should have a Google Workspace mirror when Gemini is expected to use it.

Recommended model:

```text
GitHub = master
Google Doc = assistant/human mirror
```

### Deep Research

Deep Research prompts should use the Control Center as project context, then follow the relevant research prompt and source QA standard.

## 8. VIS usage

VIS should surface the Control Center centrally.

Minimum:

- visible on `/vis`
- visible on `/vis/system`
- route such as `/vis/system/control-center`

VIS is the operational display layer, not the source of truth. It should make canonical knowledge easy to find.

## 9. Workspace mirror

For projects that use Gemini or meeting collaboration, mirror the Control Center to a Google Doc.

The Google Doc should be:

- clearly named
- linked from the repo document
- treated as a mirror, not separate source of truth
- updated when major standards or active tracks change

Suggested name pattern:

```text
[Project] – Project Control Center
```

## 10. Update rule

Update the Control Center when:

- a new canonical document is created
- a new cross-agent standard is created
- a research or presentation track becomes active
- a rule should not depend on Thomas remembering it
- a project phase changes
- a new agent role or workflow is introduced

Do not update it for every minor issue.

## 11. Reusable naming pattern

Recommended files:

```text
docs/project/PROJECT_CONTROL_CENTER_ARCHITECTURE_v0_1.md
docs/project/[PROJECT]_PROJECT_CONTROL_CENTER_v0_1.md
```

Recommended VIS route:

```text
/vis/system/control-center
```

## 12. First implementation

The first implementation is Viddel:

- `docs/project/VIDDEL_PROJECT_CONTROL_CENTER_v0_1.md`
- `/vis/system/control-center`
- visible on `/vis`
- visible on `/vis/system`

## 13. Success criteria

This pattern works if Thomas can say:

> Start from the Control Center.

…and the agent understands where to look, which standards apply, and which claims need caution.
