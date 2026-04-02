# 00_STATE

## Prosjekt
- Arbeidsnavn: [midlertidig]
- Formål: Etablere en MVP for å teste om en varm og teknisk sterk AI-tjeneste for høreapparatbrukere og lydinteresserte kan skape tydelig verdi ved å hjelpe dem å forstå, bruke og optimalisere lyttekjeden i hverdagen, og om dette kan bære en levedyktig forretningsmodell.
- Fase: MVP-oppbygging

## Mål akkurat nå
- Hovedmål for nåværende periode: Få på plass en enkel, testbar MVP med agent, innhold og nettside nok til å kunne prøve ut om løsningen oppleves nyttig for reelle brukere.
- Hva vi prøver å få til i MVP: Bygge en første versjon der en bruker kan få praktisk hjelp via AI-agenten, forstå hva tjenesten hjelper med via nettsiden, og møte en første mengde søkbart innhold i artikler og ordbok som kan gi trafikk fra Google og AI-baserte søk, slik at vi kan teste nytte, tillit og teknisk gjennomførbarhet.

## Status (repo, faktisk landet)
- **Frontend:** Astro **5** med statisk output der det passer.
- **Styling:** **Tailwind CSS v4** via `@tailwindcss/vite` (ingen `tailwind.config.*` i repoet). Hybridmodell: `tokens.css` som designvariabler, `global.css` som kobler tokens + Tailwind og global base, utilities i `.astro`-komponenter (se `01_STACK.md` og `DESIGN.md`).
- **Designvariabler:** `src/styles/tokens.css` er i bruk i Git/deploy-flyten (ikke «kun Stitch ved siden av»).
- **Shell:** `BaseLayout.astro` er felles ramme: orb-bakgrunn, fast header med glass/surface, **global navigasjon**, CES-widget (script + stylesheet) uendret i funksjon.
- **Navigasjon:** Én global toppflate; innholdssider sender `currentPath` til layout. Lokal duplikat-header er fjernet der den ga dobbel meny.
- **Mobilmeny:** `MobileMenuTrigger` + `MobileMenuSheet` (drawer montert utenfor `backdrop-blur`-wrapper slik at `position: fixed` dekker viewport).
- **Typografi:** **Epilogue + Inter** lastes via Google Fonts i `BaseLayout` og brukes via `--font-display` / `--font-sans` i `global.css`.
- **Dark mode / tema:** Ikke implementert (kun lys palett i `:root`; ingen `dark:`-strategi eller toggle).
- **Ordbok (dynamisk route):** `src/pages/no/ordbok/[term].astro` har minimal `getStaticPaths()` (tom liste inntil term-data finnes) for at **produksjonsbuild** skal passere.
- **Øvrig:** AI-agent i Google CES; manualer i Cloud stores; Stitch som visuell referanse.

## Det som fortsatt er under arbeid
- Mer innhold og ferdige sider (artikler, ordbok med reelle termer).
- Flere dokumenter og innsikt inn i kunnskapsgrunnlaget til AI-agenten.
- Utdyping av tokens og komponentmønstre (designstrategi vs. dagens v0.2-tokens).

## Det som ikke er avklart ennå
- Første testgruppe for MVP-en.
- Videre finansiering etter første MVP-fase.
- Eventuell fremtidig dark mode / systemvalg (ikke startet i kode).

## Aktivt spor
- Utvide innhold og testbarhet i tråd med MVP-målene, med stabil shell og hybrid styling som utgangspunkt.

## Neste konkrete steg (forslag)
- Holde `docs/project/*` synket med kode (denne runden).
- Fylle ordbok med reell `getStaticPaths()`-kilde når termliste finnes.
- Vurdere bevisst neste steg for tema (dark) når MVP-kjernen er stabil — ikke påkrevd nå.

## Risiko / blokkere
- Kjente hindringer: arbeid spenner over agent, innhold, nettside og design samtidig; kunnskapsgrunnlag kan fortsatt være tynt.
- Deploy: dynamiske ruter må ha gyldig statisk strategi så lenge bygget er statisk (ordbok er sikret med minimal `getStaticPaths()`).

## Arbeidsmåte
- Strategi og logg: Strategisk arbeid, roadmap og løpende logg føres primært av @Navigator i Gemini.
- Kode og implementering: ChatGPT/@rigger bryter arbeid ned i konkrete steg, og Cursor utfører i kodebasen.
- Hosting / drift: Nettsiden bygges i Astro, versjoneres i Git/GitHub og deployes via Vercel. AI-agenten kjøres i Google CES.

## Sist oppdatert
- Dato: 2026-04-02
- Oppdatert av: dokumentasjon synket med repo (Cursor)
