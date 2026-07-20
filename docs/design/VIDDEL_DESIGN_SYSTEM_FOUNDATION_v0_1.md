# Viddel Design System Foundation v0.1

Status: Active foundation contract  
Owner issue: #271  
Implementation slice: #274  
Composer verification: #270 and #275

## Purpose

This document defines the minimum source hierarchy and ownership model for Viddel design work. It consolidates current production practice; it does not introduce a new visual direction.

The immediate goal is to stop page-specific duplication from becoming the default implementation method.

## Source hierarchy

Use this order when sources disagree:

1. Verified runtime behavior and computed styles.
2. `src/styles/tokens.css` for existing foundation values.
3. Approved pattern documentation under `docs/design/`.
4. `/designsystem/` as a review and presentation surface derived from the sources above.
5. Historical VIS pages and issues as decision evidence, not current implementation truth.

GitHub Issues and Projects remain the work/status layer. VIS is not the backlog.

## Token ownership layers

### A. Brand primitives

Current examples:

- `--vox-brand-primary`
- `--vox-brand-gradient-start`
- `--vox-brand-gradient-end`
- `--vox-surface-light`
- `--vox-surface-dark`

These are raw inputs. Do not rename them during component cleanup unless brand direction has been explicitly reviewed.

### B. Global semantic roles

Global roles describe purpose, not component or page:

- canvas and background
- surface and elevated surface
- primary and secondary text
- border
- action
- focus
- state
- radius
- elevation

Existing aliases such as `--muted` / `--text-secondary`, `--focus` / `--focus-ring`, and `--primary` / `--accent-primary` must be treated as an explicit compatibility question. Do not add new aliases casually.

### C. Component tokens

Component tokens are allowed when a value forms a reusable contract across multiple instances.

Composer Body is the first pilot because production instances already share most values.

Candidate token family:

```css
--viddel-composer-radius-pill
--viddel-composer-radius-expanded
--viddel-composer-min-height-standard
--viddel-composer-min-height-entry
--viddel-composer-padding-standard
--viddel-composer-padding-entry
--viddel-composer-gap
--viddel-composer-input-font-size
--viddel-composer-input-line-height
--viddel-composer-input-min-height
--viddel-composer-input-padding-y
--viddel-composer-input-max-height
--viddel-composer-control-size
--viddel-composer-surface
--viddel-composer-shadow-rgb
--viddel-composer-shadow
--viddel-composer-shadow-focus
```

Candidate names are not implementation truth until #275 records computed values and #270 accepts the contract.

### D. Variant and environment values

The following remain variant-owned in v0.1:

- halo gradients and opacity
- halo width and height
- entry/contextual/active dramaturgy
- fixed/sticky placement
- safe-area offsets
- scroll clearance and bottom spacers
- article-specific left padding
- attachment layout and menu behavior

Do not force these into one global Composer definition.

## Verified Composer Body values

The safe-read found the following repeated runtime values:

| Property | Repeated value | Status |
| --- | --- | --- |
| one-line radius | `999px` | strong candidate |
| expanded radius | `1.65rem` | strong candidate |
| standard min-height | `3.4rem` | strong candidate |
| entry min-height | `4.25rem` | legitimate variant candidate |
| standard padding | `0.5rem 0.58rem` | strong candidate |
| grid gap | `0.5rem` | strong candidate |
| input font size | `1.02rem` | strong candidate |
| input line height | `1.4` | strong candidate |
| input min-height | `2.75rem` | strong candidate |
| input vertical padding | `0.58rem` | strong candidate |
| input max-height | `min(9rem, 32vh)` | strong candidate |
| shadow RGB | `48 82 120` | strong candidate |
| control size | `2.35rem`, `2.68rem`, or `2.85rem` | unresolved; verify in #275 |

No runtime CSS migration may choose a control size before #275 resolves the actual computed values by route and state.

## Implementation sequence

1. Land this contract and the Cursor guardrail without runtime changes.
2. Complete #275 computed-style verification.
3. Update #270 with the accepted Composer Body contract and instance table.
4. Introduce tokens using current values only.
5. Replace identical repeated values in one small PR.
6. Verify visual parity on desktop and mobile before merge.
7. Only then assess older design issues for superseded closure.

## Runtime verification matrix

Required before token consumption:

### Standalone `/no/chat`

- desktop idle
- desktop active
- desktop multiline
- desktop image attachment
- mobile idle
- mobile active
- mobile multiline
- mobile image attachment

### Article transition

Route: `/no/artikkel/ingen-lyd-svak-lyd/`

- desktop idle
- desktop active
- desktop multiline
- mobile idle
- mobile active
- mobile multiline

Record computed body, input and control values. Also confirm that the final response can scroll above the composer.

## Change rules

- Inspect actual code and rendered state before editing.
- Reuse current values before proposing new values.
- Separate Composer Body from environment and placement.
- Stop after one or two ineffective visual attempts and inspect DOM/computed styles.
- Keep diffs small enough to verify by route and state.
- Do not bundle redesign, cleanup and component extraction in one PR.
- Every meaningful UI task must report Design System impact, VIS/current-state impact, Backstage impact, commit, push status and concrete verification.

## Not scope for v0.1

- broad visual redesign
- replacing all hard-coded values
- new component-library framework
- Storybook migration
- token-generation platform
- halo unification
- large shared Composer component extraction
- changing chat behavior

## Definition of done

Foundation v0.1 is operational when:

- source hierarchy is used in Cursor tasks and reviews
- #275 establishes computed Composer values
- #270 contains an accepted body/variant contract
- one visually neutral token-consumption PR is merged
- `/designsystem/` no longer contradicts current runtime on Composer fundamentals
- Return Tickets consistently identify design-system impact and verification
