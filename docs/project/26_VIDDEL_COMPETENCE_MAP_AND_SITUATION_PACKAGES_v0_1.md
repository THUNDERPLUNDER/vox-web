# Viddel competence map and situation packages v0.1

Canonical working document in the protected Drive knowledge workspace: `VDL_KOMPETANSEKART_OG_SITUASJONSPAKKER_v0.1`.

Status: active canonical working definition for LAB → TRUSTED.

## Purpose

This map separates two concepts:

- **Competence areas** define what Viddel may help with over time.
- **Situation packages** are bounded questions that can be sourced, verified and released incrementally.

The map defines domain and answer boundaries. Source Fitness Review defines source and claim status. The staging plan and GitHub task layer define implementation order.

## Priority map

### MVP — build and test now

- Practical hearing-aid mastery: no/weak sound, charging, restart, filter, app and routing.
- Listening situations: noise, conversation and listening fatigue.
- Before the audiologist: describe the problem, record what was tried and create a user-owned note.

### NEXT — extend after the first flows stabilize

- First weeks, adaptation and safe restart.
- Insertion, fit and physical comfort, with a strict boundary against clinical fitting.
- System, rights and service navigation based on dated official sources.
- Communication between user, conversation partner, relatives and other helpers.

### LATER — preserve in the domain map

- Music, sound quality, sound presence and orientation.
- Institution and service-helper flows with distinct roles and responsibilities.
- Image-based troubleshooting after privacy, accuracy and medical stop points are validated.

## Situation-package contract

Every new package must record:

- situation ID, competence area, priority, audience and scope
- source IDs plus version or freshness requirements
- allowed answer space and explicit stop boundary
- verification status separately from release label
- staging-plan and GitHub task-layer placement before implementation

## Fixed competence boundary

Viddel is a mastery, preparation and navigation layer between everyday life and professional follow-up. It may explain mechanisms, ask clarifying questions, offer bounded checklists and route the user to the right next actor.

Viddel must not diagnose, provide medical treatment, instruct individual hearing-aid fitting or override clinicians. Model-specific advice requires explicit product/version scope. Local and time-sensitive facts require dated official sources. Conflicts, uncertain models, possible damage, pain, acute change or medical uncertainty must stop the self-help path.

## Verification and release

- MVP/NEXT/LATER expresses product priority, not evidence maturity.
- V0–V4 expresses verification maturity.
- Manual authenticity and scope are checked once at V1; every statement is not re-audited.
- BETA is a separate release label and may be used for low-risk V1+ answers with visible limitation, source, scope, claim ID and stop point.
- V2–V4 is selective for winners, discrepancies, higher-risk content and answers promoted beyond beta.

## Current execution slice — 2026-08-25

- `SIT-006 Før audiografen` is `P0 / V1_SCOPE_CONFIRMED`. The first bounded deliverable is a short, user-owned preparation note: situation, goal, what was tried, outcome and questions. It may be released as a visibly labelled BETA candidate because it structures the user's own observations; it must not infer diagnosis, cause or clinical recommendation.
- `SIT-007 Første uker / trygg gjenstart` is `P1 / V0_MAPPED`. The need is supported by the canonical qualitative syntheses, but concrete progression or adaptation advice remains on hold until one suitable primary or official non-clinical source is authenticated and the medical stop points are explicit.
- `SRC-029` (the deep-research technical synthesis) and `SRC-030` (the listening-quality master plan) are discovery inputs. They preserve the value of the collected material for domain mapping and source discovery, but are not direct fact sources for published RAG answers.
- The Source Fitness Review records the operational claim decisions. `STG-5` limits the next competence expansion to one `SIT-006` UX question while keeping `SIT-007` on hold.

## Evidence basis

- `VDL_RESEARCH_CANONICAL_INDEX_CURRENT_STATE_v0.1`
- `VDL_HYPOTESEMATRISE_SYNTESE_v0.2`
- `VDL_STAKEHOLDER_SYNTESE_v0.1`
- authenticated manufacturer manuals for exact product instructions
- dated official sources for rights and service navigation

The qualitative research supports needs, patterns and product implications. It is not statistically representative and does not prove willingness to pay. INT-006 remains dyad/interaction data and must not be described as an individual interview.
