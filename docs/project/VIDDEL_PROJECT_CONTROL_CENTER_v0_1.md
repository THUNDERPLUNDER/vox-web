# VIDDEL Project Control Center v0.1

Status: Canonical front door  
Date: 2026-05-10  
Architecture: `PROJECT_CONTROL_CENTER_ARCHITECTURE_v0_1.md`  
Origin issue: #118  

## 1. What this is

This is the front door for Viddel project knowledge.

Start here when working on Viddel status, strategy, research, presentations, agent prompts, stakeholder dialogue or cross-thread continuity.

The Control Center points to the right source documents and standards so Thomas does not need to remember issue numbers, file names or hidden rules.

## 2. Current project identity

Viddel is a Norwegian help service for hearing aid users.

Current MVP direction:

> Content + AI/RAG + mastery loop + Mine sider light + consent-based data foundation.

Viddel starts with practical help in concrete situations. The longer-term opportunity is to build consent-based, aggregated insight that gives hearing aid users more visibility and leverage across the ecosystem.

## 3. Current phase

Phase: MVP shaping and early validation.

Current priorities:

1. Make first public hub and article/AI journey testable.
2. Validate problem understanding and language with a few close, relevant people.
3. Define realistic six-week plan before heavier building.
4. Prepare cautious stakeholder dialogue.
5. Research long-term hearing-aid data ecosystem without overclaiming.

## 4. Source of truth model

```text
GitHub issues = work and decisions
Repo docs = canonical written knowledge
VIS = operational display layer
Google Workspace = mirror/collaboration layer, especially for Gemini
ChatGPT/@rigger = synthesis and repo-aware strategy
Cursor = repo execution
Gemini/@navigator = calendar, Gmail, Workspace and inspiration
```

GitHub remains source of truth for project tracks and technical work.

VIS is not the backlog. VIS makes key project knowledge visible.

## 5. Canonical documents

### Project architecture

- `docs/project/PROJECT_CONTROL_CENTER_ARCHITECTURE_v0_1.md`  
  Reusable architecture for project control centers.

### Viddel control

- `docs/project/VIDDEL_PROJECT_CONTROL_CENTER_v0_1.md`  
  This document.

### Data ecosystem / long-term leverage

- `docs/project/VIDDEL_HEARING_AID_DATA_ECOSYSTEM_v0_1.md`  
  Long-term strategy note: Viddel as user-oriented insight layer across the hearing-aid ecosystem.

### Manufacturer data source QA

- `docs/project/VIDDEL_MANUFACTURER_DATA_MATRIX_SOURCE_QA_v0_1.md`  
  Standard for classifying manufacturer data claims as fact, hypothesis, signal or unresolved.

Use this whenever manufacturer data, app data, fitting software, remote care or diagnostics claims might be used externally.

### Manufacturer data deep research prompt

- `docs/project/VIDDEL_DEEP_RESEARCH_PROMPT_MANUFACTURER_DATA_v0_1.md`  
  Copy-ready Deep Research prompt for manufacturer data, diagnostics, remote care and long-term data models.

### Stakeholder presentation track

- #117 — Stakeholder validation presentation for Norwegian hearing ecosystem v0.1  
  Presentation structure for early local / user-near stakeholder validation before higher-level dialogue.

## 6. Active strategic tracks

### #114 — Long-term hearing aid data ecosystem and user leverage

Purpose:
Explore how Viddel can, after MVP, help users gain collective visibility and leverage through consent-based aggregated insight.

Use when:
- discussing long-term data strategy
- preparing stakeholder conversations
- thinking beyond MVP

### #115 — Source QA for manufacturer data matrix

Purpose:
Prevent unsupported claims about manufacturer/app/device data.

Plain rule:

> Do not use manufacturer data claims as facts before they are source-QAed.

Thomas should not need to remember the issue number. If the topic is manufacturer data, this standard applies.

### #116 — Deep Research prompt for manufacturer data and diagnostics

Purpose:
Run a separate Deep Research thread on how manufacturers collect and use data, diagnostics, remote care and AI/personalization.

Use when:
- starting the research thread
- asking for producer landscape evidence

### #117 — Stakeholder validation presentation

Purpose:
Create a careful presentation for Norwegian hearing ecosystem stakeholders.

Target first level:
- Hørselsforbundet local chapter / Asker
- audiograf / ØNH / local practitioners
- Hørselsrehabilitering AS
- Hjelpemiddeltjenesten in Asker
- other user-near actors

Reason:
Start at a level where we can learn, correct errors and build ambassadors before moving upward.

## 7. Core guardrails

### 7.1 Data as consequence of help

Viddel should collect data because it helps the user, not because data is interesting.

### 7.2 MVP must not overclaim

Do not imply that MVP has:

- manufacturer integrations
- direct hearing-aid data access
- API access
- clinical dashboard
- full Mine sider
- validated effect data

### 7.3 Manufacturer claims need source QA

Any claim about what Phonak, Oticon, ReSound, Widex, Signia, Starkey, Unitron, Bernafon or others collect/see/share must be classified through the source-QA standard before external use.

Allowed before QA:

- as hypothesis
- as research question
- as potential future opportunity

Not allowed before QA:

- as fact in presentation
- as pitch claim
- as funding claim

### 7.4 Distinguish levels of data

Always separate:

1. Viddel can collect itself through user help journeys.
2. User can manually provide.
3. Manufacturer/app/cloud may hold.
4. Audiologist/clinic/fitting software may hold.
5. Partner/API integration would be required.
6. Data should be avoided or only used aggregated.

### 7.5 Start locally before moving upward

For stakeholder dialogue, start with user-near and local actors to validate language and assumptions before national leadership, producer leadership or formal funding submissions.

## 8. Agent roles

### ChatGPT / @rigger

Role:
- strategy
- structure
- synthesis
- repo-aware project work
- GitHub issue shaping
- presentation drafting
- research synthesis

Instruction:
Read this Control Center for Viddel work that involves status, strategy, research, presentations or cross-thread continuity.

### Cursor

Role:
- execute repo changes
- update docs
- build VIS pages
- implement workflows

Instruction:
Safe-read this Control Center before larger Viddel tasks.

Cursor prompts should still require:

- commit
- push
- commit hash
- push status
- verification items

### Gemini / @navigator

Role:
- Gmail
- Calendar
- Workspace
- meeting preparation
- inspiration radar
- practical weekly context

Constraint:
Gemini may not reliably read GitHub/repo URLs.

Needed:
Mirror this Control Center to a Google Doc when Gemini should use it.

Suggested Google Doc:

```text
Viddel – Project Control Center
```

### Deep Research

Role:
- evidence gathering
- landscape research
- source-based synthesis

Instruction:
Use this Control Center for project framing, then use the specific Deep Research prompt and source-QA standard.

## 9. What Thomas should not need to remember

Thomas should not need to remember:

- issue numbers for key rules
- exact file names
- which document controls manufacturer data claims
- which agent reads what
- whether Gemini can read GitHub directly
- where long-term data strategy lives
- why stakeholder validation should start locally

The operational phrase should be enough:

```text
Start from Viddel Control Center.
```

## 10. New thread / task starter

Use this in new ChatGPT/Cursor threads:

```text
Context: This is Viddel. Start from `docs/project/VIDDEL_PROJECT_CONTROL_CENTER_v0_1.md` and follow the linked canonical docs relevant to the task. GitHub issues are source of truth for work state. VIS is the operational display layer.
```

For manufacturer data:

```text
Use the Viddel Control Center and apply the manufacturer data source-QA standard before treating any producer/app/device data claim as fact.
```

For stakeholder presentation:

```text
Use the Viddel Control Center. Keep a clear distinction between MVP, hypothesis, source-QAed facts and long-term vision.
```

For Gemini:

```text
Use the Google Doc mirror of Viddel Project Control Center as your project orientation. You own Calendar, Gmail, Workspace and meeting preparation, not GitHub source of truth.
```

## 11. VIS front doors

VIS routes:

- `/vis` — operational overview
- `/vis/system` — system reference
- `/vis/system/control-center` — Viddel Control Center
- `/vis/system/github-runtime-status` — GitHub runtime feed
- `/vis/system/roadmap-timeline-v01` — roadmap read model

## 12. Workspace mirror need

Create a Google Doc mirror when possible:

```text
Viddel – Project Control Center
```

Purpose:
- Gemini access
- meeting preparation
- shared human-readable context

Rule:
GitHub/repo doc remains master until a sync process is defined.

## 13. Update rule

Update this Control Center when:

- a new cross-agent rule is created
- a new canonical doc matters across threads
- a major phase changes
- a new research/presentation track becomes active
- Thomas would otherwise need to remember something important

Do not update for every small issue.

## 14. Current next steps

1. Run Deep Research using #116 prompt.
2. Use #115 source-QA to classify findings.
3. Build first stakeholder validation presentation structure (#117).
4. Mirror this Control Center to Google Workspace for Gemini.
5. Keep VIS front door updated.
