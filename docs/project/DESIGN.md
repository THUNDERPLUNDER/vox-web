# DESIGN

## Formål
Nøktern oppsummering av dagens designgrunnmur i kodebasen, samt retning fra designstrategien.

## Stylingmodell (faktisk i bruk)
- **Hybrid:** CSS-variabler for designverdier + **Tailwind CSS v4** for layout og komponentstruktur.
- **`src/styles/tokens.css`:** Designverdier og semantiske tokens (farger, tekst, border, radius, skygger, typografi-variabler som `--font-sans`, `--font-display`, `--leading`, osv.) inkl. semantisk lag. **Lys og mørk palett** via `html[data-theme]` og system-preferanse for `data-theme="system"`.
- **`src/styles/global.css`:** Global wiring: importerer `tokens.css` og `tailwindcss` (`@import "tailwindcss"`); base (`html`, `body`, `h1–h3`), **`.sonic-pulse-cta`**, og **hooks** for innholdsflater (`.vox-surface-*`, osv.).
- **Tailwind:** Aktivert via `@tailwindcss/vite` i Astro; **Tailwind v4**, **ingen** `tailwind.config.*` — utilities brukes aktivt i `.astro`; tema kommer fra tokens + klasser i komponenter.
- **Komponenter:** Bruker typisk `rgb(var(--…))` for farger og Tailwind-klasser for spacing, flex/grid, responsivitet, z-index, osv.

## Sonic Resonance token-baseline (landet)
Eksplisitte primitive brand-verdier ligger i `tokens.css` og mappes inn i semantiske pekere (`--primary`, `--accent-gradient-start`, `--accent-gradient-end`, `--bg` / `--vox-surface-*`, osv.). Ref. commit `4d5fd53`.

| Token (primitiv) | Hex |
|------------------|-----|
| Brand primary | `#0EA5E9` |
| Gradient start | `#60A5FA` |
| Gradient end | `#F472B6` |
| Surface light | `#FAF9F6` |
| Surface dark | `#020617` |

- **Sonic radius i dagens system:** `--radius-md` er satt til **0.5rem** (øvrige radius-tokens uendret der de fortsatt gir mening, f.eks. større kort/hjørner).
- **Gradient i UI:** `.sonic-pulse-cta` bruker semantiske **`--accent-gradient-start`** → **`--accent-gradient-end`** (ikke ad hoc hex i komponenter).
- **Landing:** `/no` og `/no/info` bruker samme gradient-akse tydeligere i hero/calm (wash/glow) — **inkrementelt**, ikke redesign av layout eller struktur.

## Premium-regler (operativt nå)
- **Ingen harde 1px-seksjonslinjer** som hovedmønster mellom blokker.
- **Tonal lagdeling** og **surface-skift** (`--bg`, `--surface`, `--surface-subtle`, `--surface-elevated`).
- **Ghost-border** der kant trengs: svak border-alfa i surface-klassene, ikke «kontor-grå» full styrke.
- **Light og dark** skal oppleves som **én produktfamilie** (samme brand-akse og gradientlogikk; ulike flater, ikke to ulike merkevarer).

## Content surfaces og seksjoner (MVP-mønstre)
Operative hooks i `global.css` — **ikke** et eget komponentbibliotek; brukes sammen med `Section.astro` der det passer.

| Klasse | Bruk |
|--------|------|
| **`.vox-surface-calm`** | Rollig informasjonsflate: diskret border, lett glass (`backdrop-blur`), god til intro/lead. |
| **`.vox-surface-lifted`** | Løftet modul: `surface` + `shadow-md` — oppsummering, CTA-blokk. |
| **`.vox-surface-tech`** | Teknisk/informasjonskort: `radius-md`, venstre **gradient-akse** (accent-start), egnet i grid. |
| **`.vox-section-title`** | `font-display`, konsistent h2/h3-nivå på innholdssider. |
| **`.vox-lead`** | Lead-avsnitt (`text-secondary`, `text-lg`). |

**`Section` (`src/components/layout/Section.astro`):**
- `tone="default"` — vanlig vertikal seksjon med standard `py`.
- `tone="surface"` — innrammet kortflate (border + radius + lett skygge).
- **`tone="band"`** — fullbredde **tonal stripe** uten hard linje-divider: vertikal **gradient** på `surface-subtle` for separasjon (f.eks. på `/no/info`, `/no/om`).

## Layout og shell
- **`src/layouts/BaseLayout.astro`:** Felles shell med orb-basert bakgrunn (blur-lag over tokenfarger), **fast header** (glass/surface), innhold i begrenset bredde med topp-padding under header.
- **Global navigasjon:** Rendres fra layout; sider sender `currentPath` for aktiv tilstand. Ingen duplikat lokal header på relevante innholdssider.
- **CES:** Widget lastes i `<head>` (script + tema-CSS); funksjonell integrasjon skal ikke endres uten eget mandat.
- **Typografi:** **Epilogue + Inter** via Google Fonts i `BaseLayout` og bruk av `--font-display` / `--font-sans` i `global.css`.
- **Sandbox custom shell (ikke CES-baseline):** `/no/sandbox/chat-shell` er en **separat intern feasibility-route** for en eventuell **VOX-eid** chatflate (mock, ingen produksjonskobling til agent). Produktets referanse for innebygd chat på landing forblir **CES-widget** som over. Se `docs/project/05_CHAT_SHELL_FEASIBILITY.md`.

## Landing `/no` — bevisst layout (MVP)
Dette er **produktvalg** dokumentert for konsistens mellom design og kode — ikke ad hoc-workarounds.

**Desktop (`lg`+):**
- **To kolonner:** innholdsstolpe **venstre** (hero, deretter «Slik fungerer det» og øvrige blokker i samme kolonne).
- **Høyre:** CES **chat** i eget panel med **`sticky`** + avtalt høyde — chat følger ikke som egen rad under hele venstresiden.

**Mobil / smal skjerm:**
- **Innhold først** i scroll: hero og forklarende blokker øverst.
- **Chat som egen blokk senere** i stacken (lavere på siden), med **moderat høyde** og tydelig ramme (`overflow-hidden`, bakgrunn) slik at VOX-innhold og CES-UI ikke oppleves overlappende (CES bruker ofte fast composer mot viewport).

**Rekkefølge i DOM/grid:** CSS `order` skiller mobil vs. desktop uten duplikat innhold.

## Mobilmeny
- **Trigger** i header-raden (`MobileMenuTrigger`); **sheet** (`MobileMenuSheet`) monteres som søsken etter `</header>` slik at fullskjerm `fixed` ikke begrenses av `backdrop-filter` på header-wrapper.

## Tema / dark mode (implementert)
- **`data-theme`** på `<html>`: `system` | `light` | `dark` (standard `system` til `localStorage`-nøkkel er satt).
- **Tidlig inline script** i `BaseLayout` setter tema og `colorScheme` før tung head-innlasting.
- **`ThemeControl`** i footer: tre knapper (system / lys / mørk).
- **Tokens:** `html[data-theme="light"]`, `html[data-theme="dark"]`, og `@media (prefers-color-scheme: dark)` for `html[data-theme="system"]` dupliserer palettsett i `tokens.css`.
- **Retning:** Lys = varm papiraktig flate; mørk = rolig «studio / high-end audio» — samme **Sonic Resonance**-akse (cyan → magenta gradient, brand primary) på tvers av tema.

## Hva som kommer fra designstrategien
- Retning: **Sonic Architect**.
- Posisjonering: **tech/livsstil + omsorg**.
- Visuell metode: **tonal lagdeling** og bruk av **gradienter**.
- Typografi: **Epilogue + Inter** (landet i laste-mekanisme + CSS-variabler).
- Form: **medium rundhet** (radius-tokens i bruk).

## Gap mellom dagens kode og ønsket retning
- Finjustering av tokens der MVP trenger finere kontroll (baseline er nå eksplisitt Sonic Resonance).
- Helhetlig mønsterbibliotek utover de dokumenterte flatene — kan utvides etter behov.
- Eventuell sentral Tailwind-`@theme` / config-fil — ikke valgt; dagens kilde er primært `tokens.css` (ingen `tailwind.config.*`).

## Tokens v0.2
- `src/styles/tokens.css` har et lite semantisk lag over primitive tokens:
  - Primitives: `--vox-brand-primary`, `--vox-brand-gradient-start`, `--vox-brand-gradient-end`, `--vox-surface-light`, `--vox-surface-dark`
  - Semantikk: `--surface-subtle`, `--surface-elevated`, `--accent-gradient-start`, `--accent-gradient-end`
  - `--text-secondary`, `--focus-ring`, `--accent-primary`
- Mappes til hverandre for trygg videre utvidelse; nye sider skal helst bruke semantiske pekere, ikke duplisere hex.

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
- Koble Storyblok til eksisterende flater (varianter for calm / lifted / tech / band) når CMS-innhold skaleres.
