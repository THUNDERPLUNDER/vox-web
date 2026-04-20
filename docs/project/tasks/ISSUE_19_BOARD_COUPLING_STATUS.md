# Issue #19 status update (local fallback)

## Issue reference
- #19 — Board coupling v0.2 – show live GitHub issue state inside VIS Live Board/Roadmap

## Hva er gjort i denne leveransen
- Oppdatert `KlarLyd_Live_Board_Roadmap_v01.html` til runtime GitHub Issues-read model.
- Board-kolonner fylles nå av live issues basert på bus-status (label/state-mapping), ikke håndplasserte kort.
- Hvert live kort viser status, sist oppdatert, GitHub-lenke samt priority/area ved tilgjengelig label-data.
- Beholdt `/vis/system/task-bus-live` som sekundær kontrollside.
- Justert VIS-inngang slik at boardet er naturlig operativ front.

## Datakilde og mapping
- Datakilde: GitHub Issues REST API (issues-first read model).
- Kolonnelogikk: status-/state-labels først, med minimal fallback til issue state (open -> Neste, closed -> Ferdig).
