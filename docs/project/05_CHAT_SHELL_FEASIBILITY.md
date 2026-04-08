# 05_CHAT_SHELL_FEASIBILITY

## Formål
Kort feasibility-note for en mulig VOX-eid frontend chat shell, uten backend-omstilling i denne fasen.

## Hva vi ønsker å eie i custom shell
- Full visuell kontroll på chat-ramme, meldingsområde, composer/input/send.
- Konsistent light/dark-adferd via eksisterende VOX tokens og `data-theme`.
- Forutsigbar UX for spacing, radius, lagdeling og sticky bottom composer.

## Hva som fortsatt kan eies av Google-agent/backend
- Agentlogikk, svargenerering og verktøykall.
- Sesjon/identitet og eventuell policy/rate-limit på backend-siden.
- Transportlag mot agenten (API-endepunkt) når vi senere kobler shellen til ekte dataflyt.

## MVP-scope (frontend-spor)
- Én intern prototype-route med mockede meldinger.
- Responsiv chat-shell i VOX-stil med sticky composer.
- Ingen agentkall, ingen auth, ingen CES-bridge i denne runden.

## Bevisst utenfor scope nå
- Full migrering bort fra CES i produksjon.
- Ny backend eller ny sesjonsmodell.
- Rich media, opplasting, streaming-protokoll, observability og feilhåndtering utover enkel mock.

## Viktigste risikoer / avklaringer
- API-kontrakt mot agent må avklares tidlig (meldingstyper, status, feilformat, streaming).
- Scroll/state-håndtering i lang samtale må testes tidlig (sticky composer + mobil keyboard).
- Ytelse og a11y i egen shell må valideres før produksjonsbruk.
- Drift: tydelig grense mellom visuell shell (frontend) og agentansvar (backend) må dokumenteres.
