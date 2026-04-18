# KlarLyd surface contract (MVP)

**Formål:** Én felles, lett referanse for hvordan **kort**, **leseflater** og **innebygde apper** (f.eks. CES) skal forholde seg til hverandre — uten tung designsystemprosess.

**Relasjoner (issues):**
- Underlag for **#10** — *lightweight design system method* (navngiving, tokens, mønstre i kode).
- Støtter **#5** — *White Paper reading zone* (lesesone = *reading surface*).
- **Ikke** koblet til CES svar-kvalitet eller agentlogikk (**#6**).

---

## De fire flatetypene

### 1. Canvas surface

| | |
|---|---|
| **Bruk** | Side-/viewport-bakgrunn og «rom» rundt alt innhold. Etablerer KlarLyd-rytme og tonal dybde (orb), ikke en boks. |
| **Bakgrunn / tone** | `--bg` (varm papir / studio i dark). Ingen egen «kortfarge» — canvas er alltid «bakom». |
| **Border** | Ingen ramme på canvas. Unngå harde 1px-seksjonslinjer som hovedmønster (jf. `DESIGN.md`). |
| **Skygge** | Ingen skygge på selve canvas. Dybde kommer fra orb og innholdsflater. |
| **Radius** | Ikke relevant for full viewport; underseksjoner bruker andre flater. |
| **Eksempler** | `body` / `BaseLayout`-bakgrunn, hoved-`<main>` uten egen kort-stil. |

### 2. Reading surface (White Paper)

| | |
|---|---|
| **Bruk** | Langform: artikler, white paper, veiledningstekst der **lesbarhet** og **fokus** er hovedjobben. |
| **Bakgrunn / tone** | **Lyst «ark»** på varm canvas: `--reading-paper`, `--reading-ink`, `--reading-ink-secondary` (se `tokens.css`). Canvas (`--bg`) forblir rundt; selve kolonnen er hvit/nesten hvit i lys modus. |
| **Border** | **Ghost-ring** på ark-wrapper (`ring` + lav alfa), ikke tung kort-ramme. |
| **Skygge** | `--shadow-sm` på lesearket for rolig løft fra canvas. |
| **Radius** | `--radius-lg` på hovedark; `--radius-md` på innrykkede blokker (`--reading-inline`). |
| **Eksempler** | `src/pages/no/artikkel/[slug].astro` — `.vox-reading-sheet`; **`.vox-reading-inline`** bare for utvalgte callouts (f.eks. én observasjon + neste steg), ellers ren brødtekst; sidekolonne `.vox-reading-rail-card` (sekundær). |

### 3. Calm card surface

| | |
|---|---|
| **Bruk** | **Kort** med én tydelig idé: smart-spørsmål, korte oppsummeringer, valg-punkter — rolig, ikke «app». |
| **Bakgrunn / tone** | `--surface-elevated` eller lett transparent `surface` med `backdrop-blur` der `DESIGN.md` allerede bruker calm/lifted. |
| **Border** | **Ghost-border** eller `border-0` + ring/skygge; unngå mørk ytterkontur. |
| **Skygge** | `--shadow-sm` (standard) eller `--shadow-md` for tydelig «løft» (`vox-surface-lifted` når CTA/oppsummering). |
| **Radius** | `--radius-lg` for myke, menneskelige kort; `--radius-md` for kompakt grid. |
| **Eksempler** | Smart-spørsmål-kort, «Slik fungerer det»-moduler, diskrete info-kort. Eksisterende hooks: `.vox-surface-calm`, `.vox-surface-lifted`, `.vox-surface-tech`. |

### 4. Embedded app surface

| | |
|---|---|
| **Bruk** | **Tredjeparts- eller «app-lignende» UI** inne i siden: CES chat, fremtidige innebygde verktøy. Skal føles som **ett kontrollert panel**, ikke som resten av redaksjonell UI. |
| **Bakgrunn / tone** | `--surface-subtle` som **ramme** rundt widget; CES-interne farger styres via eksisterende `chat-messenger` CSS-variabler i `global.css` der det trengs. |
| **Border** | **Ingen** tydelig mørk ytterkant på produkt-wrapper; separasjon med **myk skygge** (`--shadow-sm`). Unngå slate/svarte drop-shadows på rammen. |
| **Skygge** | `--shadow-sm` som standard; ikke introduser ekstra «dobbel» skygge som konkurrerer med widgetens egen elevjon. |
| **Radius** | `--radius-lg` på ytre wrapper for å matche KlarLyd; intern CES-radius allerede tematisert. |
| **Eksempler** | `/no/chat` widget-wrapper, eventuelle andre innebygde chatt / demo-paneler. |

---

## Forskjeller (kort)

| Flatetype | Leser du? | Føles som |
|-----------|-----------|-----------|
| **Canvas** | Nei (bakgrunn) | Rom / merkevare |
| **Reading** | Ja, primært | Papir / fokus |
| **Calm card** | Ja, kort | Én idé / valg |
| **Embedded app** | Interaksjon | App-panel i ramme |

**Reading** vs **calm card:** reading = lang sammenhengende kolonne; calm card = avgrenset modul i grid eller liste.  
**Calm card** vs **embedded app:** card = KlarLyd-komponent; embedded app = fremmed UI som **tematis** inn i vår ramme.

---

## Konkret bruk i KlarLyd

### `/no/chat`

- **Canvas:** `main` / seksjon som hviler på `--bg` (som resten av site).
- **Reading (tittel + ingress + seed):** behold vertikal rytme; ingen ekstra «kort» rundt tekst med mindre innholdet eksplisitt skal ligne modulkort.
- **Embedded app:** én wrapper rundt `<chat-messenger>`: `bg-[rgb(var(--surface-subtle))]`, `rounded-[var(--radius-lg)]`, `shadow-[var(--shadow-sm)]`, **ingen** tung border (jf. siste QA).

### Artikkel-lesesone (white paper / #5)

- **Reading surface** som primær: én tydelig kolonne, `max-width` for linjelengde, `text-secondary` for sekundærtekst.
- Valgfritt: én rolig `Section` `tone="band"` eller surface for kapittelskifte uten harde linjer.

### Smart-spørsmål-kort

- **Calm card surface:** `vox-surface-calm` eller `vox-surface-tech` (venstre aksent-stripe) etter innholdstype; samme radius innen én liste.
- Unngå å blande inn **embedded app**-styling på redaksjonelle kort.

---

## Class- og token-konvensjoner (praktisk)

**Implementerte hooks** (`global.css`): `.vox-surface-embedded-app` (CES-/app-ramme), `.vox-surface-calm-tile` (smart-spørsmål-lenker), **`.vox-reading-sheet`** (White Paper-hovedkolonne), **`.vox-reading-inline`** (blokker på arket), **`.vox-reading-rail-card`** (sekundær sidekolonne).

| Intensjon | Tokens / mønster |
|-----------|-------------------|
| Bakgrunn page | `rgb(var(--bg))` |
| Lesesone / artikkel | **`vox-reading-sheet`** + `--reading-paper` / `--reading-ink*`; innholdsblokker **`vox-reading-inline`** |
| Diskret kort | `rgb(var(--surface-elevated))` + `shadow-[var(--shadow-sm)]` + `rounded-[var(--radius-lg)]` |
| CES-ramme | **`vox-surface-embedded-app`** (= `surface-subtle` + `radius-lg` + `shadow-sm`) — **ikke** mørk `border` + **ikke** slate-tunge skygger på wrapper |
| Smart-spørsmål-flis | **`vox-surface-calm-tile`** (ghost-ring, myk skygge) |
| Tekst nivåer | `--text`, `--text-secondary` |
| Kant når nødvendig | `border-[rgb(var(--border))/~0.2–0.35]` — «ghost» |

Eksisterende **hooks** (`global.css`): `.vox-surface-calm`, `.vox-surface-lifted`, `.vox-surface-tech`, `.vox-lead`, `.vox-section-title` — bruk dem før nye ad hoc-kombinasjoner.

---

## Videre (uten å blokkere demo)

1. Ved nye flater: velg én av de fire typene og noter avvik i PR.
2. Utvid tokens kun når MVP trenger finere kontroll (`DESIGN.md`).
3. Storyblok-varianter kan mappes til samme fire typer senere.
