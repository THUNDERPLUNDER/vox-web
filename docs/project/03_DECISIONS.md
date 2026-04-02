# 03_DECISIONS

## Formål
Dette dokumentet samler bevisste valg som styrer prosjektet, slik at vi unngår å diskutere de samme grunnpremissene på nytt.

## 2026-03-27 - MVP først
- Beslutning: Vi bygger en enkel og testbar MVP før vi utvider scope.
- Begrunnelse: Målet nå er å teste verdi, nytte og gjennomførbarhet med minst mulig friksjon.
- Konsekvens: Arbeid som ikke støtter MVP direkte nedprioriteres.

## 2026-03-27 - Source of truth-filer etableres
- Beslutning: Prosjektet skal bruke en liten kjerne av operative filer som grunnmur.
- Begrunnelse: Vi trenger stabil kontekst på tvers av chatter, verktøy og arbeidsøkter.
- Konsekvens: `00_STATE.md`, `01_STACK.md`, `02_LINKS.md` og `03_DECISIONS.md` opprettes og holdes oppdatert.

## 2026-03-27 - CES + Astro + Vercel + Cursor + Git/GitHub er aktiv stack
- Beslutning: Dette er operativ stack for MVP-fasen.
- Begrunnelse: Stacken er allerede valgt og delvis i bruk.
- Konsekvens: Nye forslag vurderes opp mot denne grunnmuren, ikke som frie alternativer.

## 2026-03-27 - Design skal inn i kodebasen
- Beslutning: Designretning og tokens skal flyttes fra Stitch til Astro-kodebasen.
- Begrunnelse: Designet må bli en faktisk del av bygge- og deploy-flyten, ikke ligge ved siden av.
- Konsekvens: Første operative designjobb er å implementere tokens og dokumentere dem i repoet.

## 2026-03-27 - Posisjonering: tech/livsstil + omsorg
- Beslutning: Prosjektet skal ikke bygge videre på et rent klinisk narrativ.
- Begrunnelse: Vi ønsker en varm, teknisk sterk og premium orientert posisjon i skjæringspunktet mellom tech/livsstil og omsorg.
- Konsekvens: Språk, design, innhold og produktretning skal støtte lydglede, mestring og optimalisering av lyttekjeden, ikke bare kompensasjon for hørselstap.

## 2026-04-02 - Hybrid styling: tokens + Tailwind utilities
- Beslutning: MVP bruker en **hybridmodell**: **CSS-variabler** i `tokens.css` som designverdier (farger, radius, skygger, font-stack-variabler), og **Tailwind CSS v4** (via `@tailwindcss/vite`) for **layout, struktur og utilities** i Astro-komponenter. Det finnes **ingen** `tailwind.config.*` som primær token-kilde; tema i praksis kommer fra tokens + utilities.
- Begrunnelse: Gir rask UI-iterasjon med Tailwind samtidig som palett og semantiske pekere kan holdes i én CSS-fil uten full migrasjon til Tailwind-theme ennå.
- Konsekvens: Nye farger/semantikk legges helst inn i `tokens.css` (eller utvidelser derav); spacing/breakpoints/layout fortsetter med Tailwind-klasser med mindre annet avtales. **Tema (lys / mørk / system)** er implementert med `data-theme` + tokens — videre utvidelse av palett fortsatt via `tokens.css`.

## 2026-04-02 - Innholdsflater: vox-surface-* og Section `band`
- Beslutning: MVP bruker et **lite, dokumentert sett** gjenbrukbare CSS-klasser i `global.css` (`.vox-surface-calm`, `.vox-surface-lifted`, `.vox-surface-tech`, pluss `.vox-section-title` og `.vox-lead`) og **`Section` `tone="band"`** for seksjonsbånd — ikke et eget komponentbibliotek i denne omgangen.
- Begrunnelse: Gir visuell konsistens på forsiden, info og om uten å låse oss til mange nye Astro-komponenter før Storyblok og innhold skaleres.
- Konsekvens: Nye informasjonssider bør i utgangspunktet gjenbruke disse mønstrene; avvik dokumenteres bevisst.

## 2026-04-02 - Landing `/no`: desktop- og mobil-komposisjon (MVP)
- Beslutning: **Desktop:** to kolonner — **innholdsstolpe venstre** (hero + etterfølgende blokker i samme kolonne), **CES-chat høyre** med **sticky** plassering og avtalt høyde. **Mobil:** **innhold og hero først** i scroll; **chat som egen blokk senere** i stacken, med begrenset høyde og tydelig ramme rundt widget-host for å unngå overlap med VOX-innhold (bl.a. pga. CES’ bruk av fast composer).
- Begrunnelse: Gir lesbar helhet på desktop uten «hull» under hero ved siden av chat, og trygg vertikal flyt på mobil uten at tekst oppleves under chat-UI.
- Konsekvens: Dette er **bevisste produkt- og layoutvalg** for MVP, ikke tilfeldige workarounds. Endringer i rekkefølge eller chat-høyde skal vurderes opp mot samme prinsipper og oppdateres i `DESIGN.md`.
