# DESIGN

## Formål
Nøktern oppsummering av dagens designgrunnmur i kodebasen, samt retning fra designstrategien.

## Stylingmodell (faktisk i bruk)
- **Hybrid:** CSS-variabler for designverdier + **Tailwind CSS v4** for layout og komponentstruktur.
- **`src/styles/tokens.css`:** Kilde for farger, tekst, border, radius, skygger og typografi-variabler (`--font-sans`, `--font-display`, `--leading`, osv.) inkl. et lite semantisk lag (v0.2). **Lys og mørk palett** via `html[data-theme]` og system-preferanse for `data-theme="system"`.
- **`src/styles/global.css`:** Importerer `tokens.css` og `tailwindcss` (`@import "tailwindcss"`); setter global typografi/base (`html`, `body`, `h1–h3`), **`.sonic-pulse-cta`**, og **gjenbrukbare innholdsflater** (se under).
- **Tailwind:** Aktivert via `@tailwindcss/vite` i Astro; **ingen** `tailwind.config.*` — tema kommer primært fra tokens + utilities i komponenter.
- **Komponenter:** Bruker typisk `rgb(var(--…))` for farger og Tailwind-klasser for spacing, flex/grid, responsivitet, z-index, osv.

## Content surfaces og seksjoner (MVP-mønstre)
Operative hooks i `global.css` — **ikke** et eget komponentbibliotek; brukes sammen med `Section.astro` der det passer.

| Klasse | Bruk |
|--------|------|
| **`.vox-surface-calm`** | Rollig informasjonsflate: diskret border, lett glass (`backdrop-blur`), god til intro/lead. |
| **`.vox-surface-lifted`** | Løftet modul: `surface` + `shadow-md` — oppsummering, CTA-blokk. |
| **`.vox-surface-tech`** | Teknisk/informasjonskort: `radius-md`, venstre **primær-stripe**, egnet i grid. |
| **`.vox-section-title`** | `font-display`, konsistent h2/h3-nivå på innholdssider. |
| **`.vox-lead`** | Lead-avsnitt (`text-secondary`, `text-lg`). |

**`Section` (`src/components/layout/Section.astro`):**
- `tone="default"` — vanlig vertikal seksjon med standard `py`.
- `tone="surface"` — innrammet kortflate (border + radius + lett skygge).
- **`tone="band"`** — fullbredde **tonal stripe**: `surface-subtle` + diskret `border-y` for rytme mellom blokker (f.eks. på `/no/info`, `/no/om`).

## Layout og shell
- **`src/layouts/BaseLayout.astro`:** Felles shell med orb-basert bakgrunn (blur-lag over tokenfarger), **fast header** (glass/surface), innhold i begrenset bredde med topp-padding under header.
- **Global navigasjon:** Rendres fra layout; sider sender `currentPath` for aktiv tilstand. Ingen duplikat lokal header på relevante innholdssider.
- **CES:** Widget lastes i `<head>` (script + tema-CSS); funksjonell integrasjon skal ikke endres uten eget mandat.
- **Typografi:** **Epilogue + Inter** via Google Fonts i `BaseLayout` og bruk av `--font-display` / `--font-sans` i `global.css`.

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
- **Retning:** Lys = varm papiraktig flate; mørk = rolig «studio / high-end audio» — samme primær+magenta-akse (Sonic Architect) på tvers av tema.

## Hva som kommer fra designstrategien
- Retning: **Sonic Architect**.
- Posisjonering: **tech/livsstil + omsorg**.
- Visuell metode: **tonal lagdeling** og bruk av **gradienter**.
- Typografi: **Epilogue + Inter** (landet i laste-mekanisme + CSS-variabler).
- Form: **medium rundhet** (radius-tokens i bruk).

## Gap mellom dagens kode og ønsket retning
- Fullt eksplisitt tokensystem knyttet til alle Sonic Architect-prinsipper (fortsatt rom for presisering).
- Helhetlig mønsterbibliotek utover de dokumenterte flatene — kan utvides etter behov.
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
- Koble Storyblok til eksisterende flater (varianter for calm / lifted / tech / band) når CMS-innhold skaleres.
