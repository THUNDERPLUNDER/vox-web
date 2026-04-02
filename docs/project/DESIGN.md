# DESIGN

## Formål
Nøktern oppsummering av dagens designgrunnmur i kodebasen, samt retning fra designstrategien.

## Stylingmodell (faktisk i bruk)
- **Hybrid:** CSS-variabler for designverdier + **Tailwind CSS v4** for layout og komponentstruktur.
- **`src/styles/tokens.css`:** Kilde for farger, tekst, border, radius, skygger og typografi-variabler (`--font-sans`, `--font-display`, `--leading`, osv.) inkl. et lite semantisk lag (v0.2).
- **`src/styles/global.css`:** Importerer `tokens.css` og `tailwindcss` (`@import "tailwindcss"`); setter global typografi/base (`html`, `body`, `h1–h3`) og utility-klasser som `.sonic-pulse-cta`.
- **Tailwind:** Aktivert via `@tailwindcss/vite` i Astro; **ingen** `tailwind.config.*` — tema kommer primært fra tokens + utilities i komponenter.
- **Komponenter:** Bruker typisk `rgb(var(--…))` for farger og Tailwind-klasser for spacing, flex/grid, responsivitet, z-index, osv.

## Layout og shell
- **`src/layouts/BaseLayout.astro`:** Felles shell med orb-basert bakgrunn (blur-lag over tokenfarger), **fast header** (glass/surface), innhold i begrenset bredde med topp-padding under header.
- **Global navigasjon:** Rendres fra layout; sider sender `currentPath` for aktiv tilstand. Ingen duplikat lokal header på relevante innholdssider.
- **CES:** Widget lastes i `<head>` (script + tema-CSS); funksjonell integrasjon skal ikke endres uten eget mandat.
- **Typografi:** **Epilogue + Inter** via Google Fonts i `BaseLayout` og bruk av `--font-display` / `--font-sans` i `global.css`.

## Mobilmeny
- **Trigger** i header-raden (`MobileMenuTrigger`); **sheet** (`MobileMenuSheet`) monteres som søsken etter `</header>` slik at fullskjerm `fixed` ikke begrenses av `backdrop-filter` på header-wrapper.

## Tema / dark mode
- **Ikke implementert.** Én lys palett i `:root`. Ingen `dark:`-klasser, ingen `class`-strategi på `<html>`, ingen system-/brukervalg — dette er bevisst hull inntil videre.

## Hva som kommer fra designstrategien
- Retning: **Sonic Architect**.
- Posisjonering: **tech/livsstil + omsorg**.
- Visuell metode: **tonal lagdeling** og bruk av **gradienter**.
- Typografi: **Epilogue + Inter** (landet i laste-mekanisme + CSS-variabler).
- Form: **medium rundhet** (radius-tokens i bruk).

## Gap mellom dagens kode og ønsket retning
- Fullt eksplisitt tokensystem knyttet til alle Sonic Architect-prinsipper (fortsatt rom for presisering).
- Helhetlig mønsterbibliotek for seksjoner, kort og interaksjon (delvis; shell og noen mønstre finnes).
- **Dark mode / flere temaer** — ikke startet.
- Eventuell sentral Tailwind-`@theme` / config-fil — ikke valgt; dagens kilde er primært `tokens.css`.

## Tokens v0.2
- `src/styles/tokens.css` har et lite semantisk lag over primitive tokens:
  - `--surface-subtle`, `--surface-elevated`
  - `--text-secondary`
  - `--focus-ring`
  - `--accent-primary`
- Mappes til primitive verdier for trygg videre utvidelse.

## Operativ bruk av semantiske tokens
- Bruk `--surface` for standard innholdsflater/kort der flaten skal oppleves nøytral og «default».
- Bruk `--surface-subtle` for lav-emfase flater (sekundære paneler, diskrete bakgrunner, svak visuell separasjon).
- Bruk `--surface-elevated` for flater som skal føles mer fremhevet enn bakgrunnen, uten å introdusere ny farge.
- Foretrekk semantiske tokens i komponenter (`--text-secondary`, `--focus-ring`, `--surface-*`) fremfor primitive tokens (`--muted`, `--focus`, `--bg`) når hensikten er kjent.
- Bruk primitive tokens direkte kun når du definerer nye semantiske tokens eller gjør svært lavnivå grunnmurarbeid.

## Ordbok (bygg / statikk)
- Dynamisk route `src/pages/no/ordbok/[term].astro` har **minimal `getStaticPaths()`** (tom liste) inntil termkilde finnes — sikrer statisk build. Oppdater når ekte termliste er klar.

## Neste designsteg (naturlig rekkefølge)
- Utvide tokens og mønstre der MVP trenger det (uten å innføre unødig kompleksitet).
- Etablere kort komponentnær kontrakt for layout/seksjoner når innhold vokser.
- **Hvis** dark mode ønskes senere: avklar strategi (klasser vs. `prefers-color-scheme`) og dupliserte eller overstyrende token-sett — ikke påbegynt nå.
