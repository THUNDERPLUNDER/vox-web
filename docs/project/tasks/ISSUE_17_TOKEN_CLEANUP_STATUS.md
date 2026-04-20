# Issue #17 status update (local fallback)

## Issue reference
- #17 — Token cleanup – Article System v0.1 semantic mapping and state tokens

## Hva er gjort i denne leveransen
- Ryddet semantisk tokenkart for artikkelsystemet i `src/styles/tokens.css`.
- Flyttet dark prompt-pill state-logikk til tydelige state-tokens (`*-rgb` + `*-alpha`) i tokenlaget.
- Klargjort CTA dark-state mapping via semantiske tokens og eksplisitt konsum i `src/styles/article-system.css`.
- Redusert `--ams-*` som mellomlag for systemverdier; beholdt kun lokal avledet helper der det er hensiktsmessig.
- Oppdatert kort recipe-notat med tokenansvar.

## Merknad
Denne filen er en repo-lokal synk hvis direkte issue-oppdatering via CLI/API ikke er tilgjengelig i kjøringsmiljøet.
