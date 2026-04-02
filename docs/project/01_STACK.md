# 01_STACK

## Formål
Dette dokumentet beskriver den operative stacken for MVP-en: hva vi bygger med, hva verktøyene brukes til, og hvordan de henger sammen.

## Kjerneverktøy
- AI-agent: Google CES
- Frontend: **Astro 5**
- Hosting: Vercel
- Kodeverktøy: Cursor
- Versjonskontroll: Git / GitHub

## Frontend og styling (faktisk)
- **Tailwind CSS v4** integrert via **`@tailwindcss/vite`** i `astro.config.mjs`.
- **Ingen** `tailwind.config.*` i repoet — ingen separat Tailwind-config som kilde for farger/spacing.
- **Hybrid stylingmotor:**
  - **`src/styles/tokens.css`** — designvariabler (CSS custom properties).
  - **`src/styles/global.css`** — importerer `tokens.css` + `@import "tailwindcss"`; global typografi og base for `html`/`body`/overskrifter; felles utilities (f.eks. CTA-klasse).
  - **Astro-komponenter** — Tailwind utility-klasser aktivt brukt for layout, spacing, responsivitet, synlighet (flex, grid, `hidden`/`lg:flex`, z-index, osv.); farger ofte via `rgb(var(--…))` mot tokens.

## Design og innhold
- Designkilde: Google Stitch (referanse); **tokens og shell er implementert i repo** (`tokens.css`, `BaseLayout`, navigasjon).
- Typografi på nett: **Google Fonts** (Epilogue + Inter) lastet i `BaseLayout`.
- Innholdskilder: Artikler, ordbok, hjelpetekster og produktnær dokumentasjon
- Kunnskapsgrunnlag for agent: Dokumenter og manualer i Google Cloud stores

## Arbeidsflyt
- Strategi: Thomas + @Navigator
- Implementering: @rigger bryter ned arbeid, Cursor utfører i kodebasen
- Deploy: Endringer pushes via Git/GitHub og deployes til Vercel
- Logging / dokumentasjon: Løpende logg og roadmap føres av @Navigator, source-of-truth-filer holdes oppdatert i prosjektet

## Status
- **I aktiv bruk nå:**
  - Google CES
  - Astro 5
  - Tailwind v4 (Vite-plugin)
  - `tokens.css` + `global.css` + utilities i komponenter
  - Global shell (header + mobil drawer) i `BaseLayout`
  - Vercel, Cursor, Git/GitHub
  - Google Stitch (referanse)
- **På vei inn / videre:**
  - Mer innhold og ferdige sider
  - Ordbok med reell termliste (`getStaticPaths()` utover minimal tom liste)
  - Flere dokumenter i kunnskapsgrunnlaget
  - Eventuell utvidelse av tema (f.eks. dark mode) — **ikke implementert**
- **Senere / ikke prioritert ennå:**
  - Endelig brandnavn
  - Mer avansert SEO-struktur
  - Eventuelle flere distribusjons- eller innholdssystemer
  - Valgfri fremtidig konsolidering av design i Tailwind `@theme` eller config — avklares ved behov

## Sist oppdatert
- 2026-04-02 (synket med repo)
