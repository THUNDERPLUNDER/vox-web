# 00_STATE

## Prosjekt
- Arbeidsnavn: [midlertidig]
- Formål: Etablere en MVP for å teste om en varm og teknisk sterk AI-tjeneste for høreapparatbrukere og lydinteresserte kan skape tydelig verdi ved å hjelpe dem å forstå, bruke og optimalisere lyttekjeden i hverdagen, og om dette kan bære en levedyktig forretningsmodell.
- Fase: MVP-oppbygging

## Mål akkurat nå
- Hovedmål for nåværende periode: Få på plass en enkel, testbar MVP med agent, innhold og nettside nok til å kunne prøve ut om løsningen oppleves nyttig for reelle brukere.
- Hva vi prøver å få til i MVP: Bygge en første versjon der en bruker kan få praktisk hjelp via AI-agenten, forstå hva tjenesten hjelper med via nettsiden, og møte en første mengde søkbart innhold i artikler og ordbok som kan gi trafikk fra Google og AI-baserte søk, slik at vi kan teste nytte, tillit og teknisk gjennomførbarhet.

## Status
- Det som er på plass:
  - Teknisk stack er valgt.
  - AI-agent fungerer i Google CES.
  - Forside og noen sider er påbegynt i Astro og Vercel.
  - Et første visuelt designspor finnes i Google Stitch.
  - Brukermanualer for flere av de mest brukte høreapparatene er lagt inn i stores i Google Cloud.
- Det som er under arbeid:
  - Designtokens og stilretning skal flyttes fra Stitch til kodebasen i Cursor, slik at de blir del av Astro, Git og deploy-flyten.
  - Nettsiden trenger mer innhold og flere ferdige sider.
  - Flere dokumenter og mer innsikt skal legges inn i kunnskapsgrunnlaget til AI-agenten.
- Det som ikke er avklart ennå:
  - Første testgruppe for MVP-en.
  - Videre finansiering etter første MVP-fase.

## Aktivt spor
- Nåværende fokus: Etablere source-of-truth-filer og klargjøre første design/token-overføring til Cursor.
- Neste konkrete steg:
  - Ferdigstille `00_STATE.md` v0.1.
  - Opprette `01_STACK.md`, `02_LINKS.md` og `03_DECISIONS.md` i enkel v0.1.
  - Lage første presise Cursor-oppgave for å flytte tokens fra Stitch-markdown til Astro-kodebasen.

## Risiko / blokkere
- Kjente hindringer:
  - Arbeidet spenner over flere spor samtidig: agent, innhold, nettside og designoverføring.
  - Viktig innsikt og flere dokumenter er fortsatt ikke lagt inn i kunnskapsgrunnlaget.
- Avhengigheter:
  - Overføring av tokens/design fra Stitch til kodebasen.
  - Videre innlegging av dokumentasjon i Google Cloud stores.

## Arbeidsmåte
- Strategi og logg: Strategisk arbeid, roadmap og løpende logg føres primært av @Navigator i Gemini.
- Kode og implementering: ChatGPT/@rigger bryter arbeid ned i konkrete steg, og Cursor utfører i kodebasen.
- Hosting / drift: Nettsiden bygges i Astro, versjoneres i Git/GitHub og deployes via Vercel. AI-agenten kjøres i Google CES.

## Sist oppdatert
- Dato: 2026-03-27
- Oppdatert av: Thomas / @rigger
