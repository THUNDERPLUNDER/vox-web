# Issue #131A — VIS inventory & access map

**Epic:** #131 VIS as Review Surface v1  
**Dato:** 2026-05-21  
**Status:** Safe-read / kartlegging — ingen flytting, sletting eller domeneendring i denne runden

---

## Formål

Gi Thomas (og senere Vibeke) et klart bilde av **hva som finnes i VIS**, **hvordan det åpnes**, og **hva som er trygt å vise** — før #131B–E rydder access, entry og navngiving.

---

## Nåværende VIS access model

| Kanal | URL-mønster | Tilgang i praksis | Anbefalt for QA |
|-------|-------------|-------------------|-----------------|
| **Produksjon (main deploy)** | `https://vox.raddum.no/vis/...` | Offentlig HTTP 200 (ingen SSO) | **Ja — primær i dag** |
| **Branch preview (Vercel)** | `https://vox-web-git-<branch>-raddum-5965s-projects.vercel.app/vis/...` | **401** — Vercel Deployment Protection / team SSO | Nei uten Vercel-innlogging |
| **Lokal dev** | `http://localhost:4321/vis/...` | Alltid tilgjengelig for utvikler | Ja (agent/dev) |
| **GitHub Pages workflow** | Nevnt i `docs/project/20_*` | Ikke bekreftet som aktiv prod-host; **faktisk prod = vox.raddum.no** | Avklares i #131D |

### Læring fra #125C (2026-05-21)

- Cursor-leveranser uten merge til `main` er **ikke** synlige for Thomas på `vox.raddum.no`.
- Branch preview-URL fra Vercel-bot i PR **ser riktig ut**, men returnerer **401** uten innlogging i Vercel-team `raddum-5965s-projects`.
- **Minste trygge QA-løp i dag:** merge til `main` → verifiser `https://vox.raddum.no/vis/...` (som #124D, #125C).

### Robots / synlighet

- VIS bruker `PrototypeLayout` med `<meta name="robots" content="noindex, nofollow">`.
- VIS er ment som intern review — ikke SEO-produkt.

---

## Hvor VIS bygges i repoet

| Ansvar | Fil(er) |
|--------|---------|
| **VIS-index (operativ oversikt)** | `src/pages/vis/index.astro` |
| **Raw wireframe-liste / metadata** | `src/lib/vis-wireframes.ts` |
| **Raw HTML-artefakter** | `public/vis/raw/*.html` |
| **Wireframe viewer (iframe)** | `src/pages/vis/[slug].astro` |
| **VIS shell (chrome, «VIS»-label)** | `src/layouts/PrototypeLayout.astro` |
| **Sprint preview W21** | `src/pages/vis/sprints/2026-w21/index.astro` |
| **Primitives lab** | `src/pages/vis/sprints/2026-w21/primitives/` + `_data.ts` |
| **Systemreferanse** | `src/pages/vis/system/` |
| **Runtime markdown (ikke Astro-side)** | `public/vis/runtime/00_GITHUB_RUNTIME_STATUS.md` |

---

## Anbefalt ny URL-struktur (forslag — ikke implementert)

Mål: én forutsigbar inngang, skilt active/reference/archive.

| Lag | Forslag domene | Forslag path | Merknad |
|-----|----------------|--------------|---------|
| **Primær review** | `vis.viddel.no` | `/` | Stakeholder-safe entry (#131B) |
| **Aktiv sprint** | `vis.viddel.no` | `/sprints/2026-w21/` | Erstatter lang `/vis/sprints/...` i kommunikasjon |
| **System/reference** | `vis.viddel.no` | `/system/` | Design lock, article system, roadmap |
| **Archive** | `vis.viddel.no` | `/archive/` | Raw KlarLyd-wireframes, pensjonerte ruter |
| **Redirect legacy** | `vox.raddum.no/vis/*` | 301 → `vis.viddel.no` | Overgangsfase (#131D) |

Inntil domene er klart: **`https://vox.raddum.no/vis/sprints/2026-w21/`** er canonical entry for W21-design review.

---

## Domene- og navneproblem

| Problem | Eksempler | Risiko for Vibeke |
|---------|-----------|-------------------|
| **VOX-produksjonsdomene hoster VIS** | `vox.raddum.no/vis/` | Forvirring: «er dette produktet?» |
| **KlarLyd i URL-slugs** | `/vis/KlarLyd_Forside_Variant_A` | Historisk merke, ikke Viddel |
| **KlarLyd i filnavn/titler** | `public/vis/raw/KlarLyd_*.html` | Vises i index og wireframe chrome |
| **VOX CSS-klasser i system-doc** | `.vox-surface-*`, `--vox-brand-*` i design-system VIS | OK som teknisk referanse; ikke stakeholder-entry |
| **Repo-navn vox-web** | GitHub, Vercel preview URLs | `vox-web-git-...vercel.app` signal |
| **PrototypeLayout tittel** | `VIS Wireframe - {title}` | Greit internt; kan forenkles i #131B |
| **Blandet kuratering** | `/vis/` lister alle raw HTML + lenker til system | Mye støy uten «safe entry» |

---

## VIS-ruter — full liste

**Base URL i prod:** `https://vox.raddum.no`  
**Path-prefix:** `/vis`

### A. Entry & navigasjon

| Route | Kilde | Status | Stakeholder-safe | Merknad |
|-------|-------|--------|------------------|---------|
| `/vis/` | `index.astro` | **Active** | **Needs cleanup** | Kuratert oversikt, men lister også all raw HTML |
| `/vis/hub` | `hub.astro` | Deprecated | No | Placeholder — peker til index |
| `/vis/artikkel` | `artikkel.astro` | Deprecated | No | Placeholder |

### B. Sprint 2026-W21 (MVP Design Lock — aktiv review)

| Route | Status | Stakeholder-safe | Merknad |
|-------|--------|------------------|---------|
| `/vis/sprints/2026-w21/` | **Active** | **Yes** | **Primær inngang W21** — lenker til labs |
| `/vis/sprints/2026-w21/color/` | **Active** | Yes | #122 color tokens lab |
| `/vis/sprints/2026-w21/typography/` | **Active** | Yes | #123 typography lab |
| `/vis/sprints/2026-w21/hub-types/` | **Active** | Yes | #125C utility vs editorial |
| `/vis/sprints/2026-w21/primitives/` | **Active** | Yes | #124 primitives catalog |
| `/vis/sprints/2026-w21/primitives/surfaces/` | **Active** | Yes | #127 candidate |
| `/vis/sprints/2026-w21/primitives/radius/` | Reference | Yes | Primitive slice |
| `/vis/sprints/2026-w21/primitives/strokes/` | Reference | Yes | Primitive slice |
| `/vis/sprints/2026-w21/primitives/elevation/` | Reference | Yes | Primitive slice |
| `/vis/sprints/2026-w21/primitives/layering/` | Reference | Yes | Primitive slice |
| `/vis/sprints/2026-w21/primitives/buttons/` | **Active** | Yes | #128 — lenke til context |
| `/vis/sprints/2026-w21/primitives/buttons/context/` | **Active** | Yes | #128 decision surface |
| `/vis/sprints/2026-w21/primitives/cards/` | **Active** | Yes | #129 |
| `/vis/sprints/2026-w21/primitives/cards/context/` | **Active** | Yes | #129 decision surface |
| `/vis/sprints/2026-w21/primitives/interaction-states/` | **Active** | Yes | #124D |
| `/vis/sprints/2026-w21/primitives/inputs/` | Reference | Yes | Catalog entry |
| `/vis/sprints/2026-w21/primitives/pills/` | Reference | Yes | Catalog entry |
| `/vis/sprints/2026-w21/primitives/focus/` | Reference | Yes | Catalog entry |
| `/vis/sprints/2026-w21/primitives/glass/` | Reference | Yes | Catalog entry |
| `/vis/sprints/2026-w21/primitives/signals/` | Reference | Yes | Catalog entry |
| `/vis/sprints/2026-w21/primitives/ai-action/` | Reference | Yes | Catalog entry |

### C. System / reference (canonical docs i VIS)

| Route | Status | Stakeholder-safe | Merknad |
|-------|--------|------------------|---------|
| `/vis/system/` | **Active** | **Needs cleanup** | God struktur, men bred |
| `/vis/system/control-center` | **Active** | Yes | Viddel Control Center — agent entry |
| `/vis/system/design-system-v01` | Reference | Needs cleanup | VOX token-klassenavn i UI |
| `/vis/system/ia-principles-v01` | Reference | Yes | IA v0.1 |
| `/vis/system/hub-mandate-v01` | Reference | Yes | Hub mandate |
| `/vis/system/article-system` | Reference | Needs cleanup | «KlarLyd-artikler» i tekst |
| `/vis/system/article/` | Reference | Yes | Article system hub |
| `/vis/system/article/foundations` | Reference | Yes | |
| `/vis/system/article/components` | Reference | Yes | |
| `/vis/system/article/templates` | Reference | Yes | |
| `/vis/system/article/changelog` | Reference | Yes | |
| `/vis/system/roadmap-timeline-v01` | **Active** | Yes | Canonical roadmap (erstatter live board) |
| `/vis/system/github-runtime-status` | **Active** | **No** | Operativ agent-feed — ikke design review |
| `/vis/system/task-bus-live` | **Deprecated** | No | Pensjonert — redirect notice |

### D. Raw HTML wireframes (`/vis/[slug]`)

Generert fra `public/vis/raw/*.html` via `[slug].astro`.

| Slug / route | Status | Stakeholder-safe | Navn-problem |
|--------------|--------|------------------|--------------|
| `/vis/Kjernebeskrivelser_V2.0` | Archive | No | Pre-Viddel dokument |
| `/vis/KlarLyd_Forside_Variant_A` | Archive | No | KlarLyd + wireframe |
| `/vis/KlarLyd_Forside_Variant_B_AI_v01` | Archive | No | KlarLyd |
| `/vis/KlarLyd_Hub_NAV` | Archive | No | KlarLyd |
| `/vis/KlarLyd_Spoke_Artikkel` | Archive | No | KlarLyd |
| `/vis/KlarLyd_Merkevaregrunnlag_VIS_v0_2_1` | Reference | Needs cleanup | KlarLyd i slug |
| `/vis/KlarLyd_Strategi_Notion_v05` | Archive | No | KlarLyd strategi |
| `/vis/KlarLyd_Sprint_Roadmap_v08` | Archive | No | Superseded by roadmap-timeline |
| `/vis/KlarLyd_Sprint_01_Foundation_Archive_v09` | Archive | No | Eksplisitt archive i navn |
| `/vis/KlarLyd_Live_Board_Roadmap_v01` | **Deprecated** | No | Pensjonert — banner til roadmap-timeline |

**Static assets (ikke Astro-ruter):** `public/vis/raw/*.png`, `*.github-state.json`

---

## Hva er trygt å vise Vibeke nå

**Anbefalt «safe set» (design / retning):**

1. `https://vox.raddum.no/vis/sprints/2026-w21/` — sprint preview
2. `https://vox.raddum.no/vis/sprints/2026-w21/hub-types/` — hub type split
3. `https://vox.raddum.no/vis/sprints/2026-w21/primitives/cards/context/`
4. `https://vox.raddum.no/vis/sprints/2026-w21/primitives/buttons/context/`
5. `https://vox.raddum.no/vis/sprints/2026-w21/primitives/interaction-states/`
6. `https://vox.raddum.no/vis/sprints/2026-w21/color/`
7. `https://vox.raddum.no/vis/sprints/2026-w21/typography/`

**Unngå i stakeholder-review:**

- `/vis/` full index (for mye historikk)
- Alle `/vis/KlarLyd_*` raw wireframes
- `/vis/system/github-runtime-status`
- `/vis/system/task-bus-live`
- Branch `*.vercel.app` previews (SSO)

---

## Krav for flytting til viddel.no / vis.viddel.no

Ikke gjort i #131A — kartlegging only.

| Steg | Eier | Beskrivelse |
|------|------|-------------|
| 1 | Drift/DNS | `vis.viddel.no` CNAME → Vercel (eller subdomain-prosjekt) |
| 2 | Vercel | Legg domene på `vox-web`-prosjekt eller eget VIS-prosjekt |
| 3 | Vercel | Avklar Deployment Protection: preview vs production policy |
| 4 | Repo | Oppdater `docs/project/02_LINKS.md` canonical URLs |
| 5 | Repo | Valgfritt: path rewrite `/vis` → root på vis-subdomain (#131D) |
| 6 | Repo | 301 fra `vox.raddum.no/vis/*` i overgangsfase |
| 7 | Kommunikasjon | Fast mal for Cursor Return Ticket: **alltid prod-URL etter merge** |
| 8 | #131B | Stakeholder entry på ny URL uten raw-index-støy |

**Merk:** Produksjon `/no/*` (app) og VIS bør skilles tydelig på domene — Vibeke skal ikke lande i MVP-app når hun skal reviewe design.

---

## Foreslåtte deloppgaver (#131B–#131E)

| Issue | Tittel | Scope | Avhenger av |
|-------|--------|-------|-------------|
| **#131B** | Stakeholder-safe VIS entry | Ny `/vis/review/` eller erstatte topp av `/vis/` med «safe set» + tydelig Viddel-branding; skjul/archive-lenker | #131A |
| **#131C** | Route taxonomy & labeling | Metadata (`vis:status`, badges Active/Reference/Archive/Deprecated) i index; ingen sletting | #131A |
| **#131D** | Domain & access model | `vis.viddel.no`, redirect-plan, Vercel protection policy, Return Ticket URL-mal | #131A, drift |
| **#131E** | Current-facing naming cleanup | Fjern KlarLyd/VOX fra titler brukere ser først; behold filer; rename display only der trygt | #131B |

**Minste trygge neste steg etter #131A:** **#131B** — én kuratert inngang med direkte lenker til W21 safe set + «Do not share» for archive.

---

## No-delete-before-review guardrails

Gjelder hele epic #131:

1. **Ikke slett** filer under `public/vis/raw/` uten eksplisitt godkjenning og archive-backup.
2. **Ikke slett** Astro-ruter — deprecate med notice-sider (mønster: `task-bus-live`, `KlarLyd_Live_Board_Roadmap_v01`).
3. **Ikke flytt** paths uten redirect og oppdatert inventar.
4. **Ikke endre domener** uten DNS + Vercel verifikasjon og dokumentert rollback.
5. **Ikke skjul** historikk for agenter — archive skal fortsatt være reachable via direkte URL eller `/archive/`.
6. **Alltid lever** merge + `vox.raddum.no` URL (inntil `vis.viddel.no` er live) i Return Ticket for VIS-arbeid.

---

## Oppsummering for Thomas

- **~40+ VIS-ruter** (27 Astro-filer + 10 raw slugs + static assets).
- **Aktiv review nå:** ` /vis/sprints/2026-w21/*` (spesielt primitives context + hub-types).
- **Trygg QA-URL:** `https://vox.raddum.no/vis/...` etter merge — **ikke** branch preview uten Vercel SSO.
- **Største forvirring:** én `/vis/`-index med historisk KlarLyd-støy + VOX-domene.
- **Neste:** #131B stakeholder entry, deretter domene (#131D) og naming (#131E).
