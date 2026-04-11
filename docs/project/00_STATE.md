# 00_STATE

## Prosjekt
- Arbeidsnavn: [midlertidig]
- Formål: Etablere en MVP for å teste om en varm og teknisk sterk AI-tjeneste for høreapparatbrukere og lydinteresserte kan skape tydelig verdi ved å hjelpe dem å forstå, bruke og optimalisere lyttekjeden i hverdagen, og om dette kan bære en levedyktig forretningsmodell.
- Fase: MVP-oppbygging

## Mål akkurat nå
- Hovedmål for nåværende periode: Få på plass en enkel, testbar MVP med agent, innhold og nettside nok til å kunne prøve ut om løsningen oppleves nyttig for reelle brukere.
- Hva vi prøver å få til i MVP: Bygge en første versjon der en bruker kan få praktisk hjelp via AI-agenten, forstå hva tjenesten hjelper med via nettsiden, og møte en første mengde søkbart innhold i artikler og ordbok som kan gi trafikk fra Google og AI-baserte søk, slik at vi kan teste nytte, tillit og teknisk gjennomførbarhet.

## Nå står vi her (baseline for neste tråd)
- **Stack:** Astro 5, Tailwind CSS v4 via `@tailwindcss/vite`, **ingen** `tailwind.config.*`.
- **Styling:** `tokens.css` = designverdier / semantiske tokens; `global.css` = wiring, base, hooks (`.sonic-pulse-cta`, `.vox-surface-*`); utilities i `.astro`.
- **Tema:** `data-theme` (system / light / dark), `localStorage`, `ThemeControl` i footer — **landet og i bruk**.
- **Sonic Resonance:** Eksplisitt token-baseline i `tokens.css` (brand + gradient + surface light/dark); ref. commit **`4d5fd53`**. `.sonic-pulse-cta` og gradientaksen er koblet til `--accent-gradient-start/end`.
- **Flater:** Content surfaces og **`Section` `tone="band"`** — band bruker **tonal gradient-separasjon**, ikke hard 1px divider mellom seksjoner.
- **Landing:** `/no` og `/no/info` er **visuelt oppdatert i samme familie** (gradient tydeligere, inkrementelt — ikke full redesign). `/no`-layout: desktop innhold venstre + sticky chat høyre; mobil innhold først, chat senere (uendret prinsipp).
- **Dokumentasjon:** `DESIGN.md`, `00_STATE.md`, `03_DECISIONS.md` skal speile denne baseline; videre arbeid bygger oppå, ikke forutsetter gammel «kun lys palett»-tilstand.

## Status (repo, faktisk landet)
- **Frontend:** Astro **5** med statisk output der det passer.
- **Styling:** **Tailwind CSS v4** via `@tailwindcss/vite` (**ingen** `tailwind.config.*`). Hybridmodell som over; se `01_STACK.md` og `DESIGN.md`.
- **Designvariabler:** `src/styles/tokens.css` inkl. **Sonic Resonance**-primitives og semantisk mapping.
- **Content surfaces:** `.vox-surface-calm`, `.vox-surface-lifted`, `.vox-surface-tech`, `.vox-section-title`, `.vox-lead` i `global.css`; `Section` med `tone="band"` (tonal band).
- **Shell:** `BaseLayout.astro` er felles ramme: orb-bakgrunn, fast header med glass/surface, **global navigasjon**, CES-widget (script + stylesheet) uendret i funksjon.
- **Landing `/no`:** Desktop: innhold venstre, **sticky** chat høyre. Mobil: **innhold først**, chat som egen blokk senere (`DESIGN.md`, `03_DECISIONS.md`).
- **Navigasjon:** Én global toppflate; innholdssider sender `currentPath` til layout.
- **Mobilmeny:** `MobileMenuTrigger` + `MobileMenuSheet` (drawer montert utenfor `backdrop-blur`-wrapper).
- **Typografi:** **Epilogue + Inter** via Google Fonts i `BaseLayout` og `--font-display` / `--font-sans` i `global.css`.
- **Ordbok (Storyblok):** `src/pages/no/ordbok` og `src/pages/no/ordbok/[term].astro` henter publisert innhold fra Storyblok under `no/ordbok/` i statisk build.
- **Custom chat shell (feasibility, intern):** Rute **`/no/sandbox/chat-shell`** — aktiv **feasibility-spike** for en eventuell VOX-eid samtaleflate. **Step 1** på kodenivå er **visuell tilpasning / shell-prototype** med mockede meldinger og **uten** backend, agentkall, auth eller CES-bridge; **ikke produksjonskoblet**. Siste commit som rørte selve siden: **`b2d91050e8b737cbb663f4fd8894a84d68315be7`** (`src/pages/no/sandbox/chat-shell.astro`). Full definisjon: `docs/project/05_CHAT_SHELL_FEASIBILITY.md`.
- **VIS (backstage):** Eget **landet** verktøy for HTML-wireframes under **`/vis`** (internt, `noindex`). **Ikke** hovedsporet for MVP-produkt eller chat-shell; holdes adskilt i arbeid og dokumentasjon.
- **Øvrig:** AI-agent i Google CES; manualer i Cloud stores; Stitch som visuell referanse.

## Det som fortsatt er under arbeid
- Mer innhold og ferdige sider (artikler, ordbok med reelle termer).
- Flere dokumenter og innsikt inn i kunnskapsgrunnlaget til AI-agenten.
- Finjustering av tokens og innhold der MVP trenger det.

## Det som ikke er avklart ennå
- Første testgruppe for MVP-en.
- Videre finansiering etter første MVP-fase.

## Aktivt spor
- Utvide innhold og testbarhet i tråd med MVP-målene, med stabil shell og hybrid styling som utgangspunkt.

## Neste konkrete steg (forslag)
- Holde `docs/project/*` synket ved endringer i tokens eller layout-prinsipper.
- Fylle ordbok med reell `getStaticPaths()`-kilde når termliste finnes.
- Flere sider med samme surface-mønstre etter behov.

## Risiko / blokkere
- Kjente hindringer: arbeid spenner over agent, innhold, nettside og design samtidig; kunnskapsgrunnlag kan fortsatt være tynt.
- Deploy: dynamiske ruter må ha gyldig statisk strategi så lenge bygget er statisk (ordbok er sikret med minimal `getStaticPaths()`).

## Arbeidsmåte
- Strategi og logg: Strategisk arbeid, roadmap og løpende logg føres primært av @Navigator i Gemini.
- Kode og implementering: ChatGPT/@rigger bryter arbeid ned i konkrete steg, og Cursor utfører i kodebasen.
- Hosting / drift: Nettsiden bygges i Astro, versjoneres i Git/GitHub og deployes via Vercel. AI-agenten kjøres i Google CES.
- Publiseringsflyt CMS (MVP): Storyblok publish -> webhook -> Vercel deploy hook -> ny production build (`docs/project/04_PUBLISHING.md`) — testet og verifisert i praksis.

## Sist oppdatert
- Dato: 2026-04-11
- Oppdatert av: docs-lukking chat shell Step 1 + eksisterende baseline (Sonic Resonance ref. fortsatt `4d5fd53` der relevant)
