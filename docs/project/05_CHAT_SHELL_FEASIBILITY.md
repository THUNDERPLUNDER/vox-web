# 05_CHAT_SHELL_FEASIBILITY

## Formål
Feasibility-note for en mulig **VOX-eid** frontend chat shell (egen ramme rundt samtale og composer), uten å forutsette backend- eller agent-omstilling i samme sleng.

## Step 1 — status
- **Step 1 er levert på kode-nivå** for prototypen: intern sandbox-side finnes og er siste gang justert i commit **`b2d91050e8b737cbb663f4fd8894a84d68315be7`** (fil: `src/pages/no/sandbox/chat-shell.astro`).
- Prototypen er **ikke produksjonskoblet** (ingen ekte agent, ingen persistert sesjon, ingen CES-widget-erstatning i prod).

## Levert i Step 1
- **Route:** `/no/sandbox/chat-shell` (intern bruk, `noindex`).
- **Visuell tilpasning** til VOX tokens / `data-theme`, samt layout for meldingsområde og **sticky bottom composer** (markup + styling).
- **Mockede meldinger** i UI for å vurdere hierarki, kontrast og rytme — **ingen** ekte dataflyt.
- **Ingen** agentkall, **ingen** auth, **ingen** CES-bridge i denne leveransen.

## Ikke del av Step 1
- Kobling til Google CES som erstatter for produksjonschat på landing.
- Agent-API, streaming, feilformat, persistens av tråd, observability.
- Rich media, opplasting, vedlegg.
- Krav til produksjons-a11y/ytelse utover det som naturlig følger av statisk prototype.
- Endring av produktets **hoved** chat-opplevelse (CES-widget på `/no` m.m.) — uendret baseline; se `DESIGN.md` om landing.

## Neste steg før eventuell produksjonsnær utvikling
- Avklare **API-kontrakt** mot agent (meldingstyper, status, feil, ev. streaming).
- **Manuell / instrumentert** verifikasjon av scroll, sticky composer og mobil tastatur i lang samtale.
- **a11y- og ytelsesgjennomgang** når shell skal ut av ren prototype.
- Eksplisitt beslutning om **grense** mellom VOX shell (frontend) og agent/backend (ansvar, drift).

## Hva vi ønsker å eie i custom shell (målbilde)
- Full visuell kontroll på chat-ramme, meldingsområde, composer/input/send.
- Konsistent light/dark-adferd via eksisterende VOX tokens og `data-theme`.
- Forutsigbar UX for spacing, radius, lagdeling og sticky bottom composer.

## Hva som fortsatt kan eies av Google-agent/backend
- Agentlogikk, svargenerering og verktøykall.
- Sesjon/identitet og eventuell policy/rate-limit på backend-siden.
- Transportlag mot agenten (API-endepunkt) når shell kobles til ekte dataflyt.

## Bevisst utenfor scope inntil videre (produktnivå)
- Full migrering bort fra CES i produksjon uten eget vedtak.
- Ny backend eller ny sesjonsmodell utenom det agentlaget allerede tilbyr.
- Rich media, opplasting, streaming-protokoll, observability og feilhåndtering utover det som avtales for en gitt integrasjon.

## Viktigste risikoer / avklaringer (vedvarende)
- API-kontrakt mot agent må avklares tidlig (meldingstyper, status, feilformat, streaming).
- Scroll/state-håndtering i lang samtale må valideres (sticky composer + mobil keyboard).
- Ytelse og a11y i egen shell før produksjonsbruk.
- Drift: tydelig grense mellom visuell shell (frontend) og agentansvar (backend) må dokumenteres og respekteres i implementasjon.
