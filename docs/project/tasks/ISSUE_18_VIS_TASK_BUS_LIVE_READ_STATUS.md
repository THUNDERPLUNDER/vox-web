# Issue #18 status update (local fallback)

## Issue reference
- #18 — VIS task-bus live read model – show GitHub task status without deploy dependency

## Hva er gjort i denne leveransen
- Implementert en liten read-only VIS-side for live-ish status:
  - `src/pages/vis/system/task-bus-live.astro`
- Siden henter issues runtime fra GitHub API (ingen deploy-trigget datagenerering nødvendig per statusendring).
- Viser kuratert subset (`#16`, `#17`, `#18`) med:
  - issue number
  - title
  - state (open/closed)
  - label-avledet status/priority/area når tilgjengelig
  - updated time
  - direkte GitHub-link
- Lagt til inngangspunkt fra:
  - `src/pages/vis/system/index.astro`

## Begrensninger i v0.1
- Issues-first modell; GitHub Projects custom fields er ikke inkludert i denne MVP.
- Uten token kan API rate-limit gi fallback-melding.
- VIS er fortsatt read-only visningslag (ingen redigering).
