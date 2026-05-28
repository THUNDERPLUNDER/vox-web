# Decision #125J — Copy, nav and routes CBA v0.3

Status: **CBA / implementation pass**  
Date: 2026-05-20  
Sprint: 2026-W21  
Related: Content / IA CBA v0.3, #125H (nav), #125I-D (hub polish), #125F (editorial hub)

## Kort beslutning

Offentlig IA, synlig copy og norske URL-er er synkronisert med Content / IA CBA v0.3.  
**Hjelp** og **Bedre lyd** er primære innholdsflater; **Spør Viddel** er fast header-CTA til standalone chat.

---

## Topp-IA (MVP)

| Label | Route |
|-------|--------|
| Forside | `/no/` |
| Hjelp | `/no/hjelp/` |
| Bedre lyd | `/no/bedre-lyd/` |
| Ordbok | `/no/ordbok/` |
| Om Viddel | `/no/om/` |
| **Spør Viddel** (header-CTA) | `/no/chat/` |

### Copy-prinsipper

1. **Hjelp** — praktisk, handlingsorientert støtte (`/no/hjelp/`).
2. **Bedre lyd** erstatter **Lyd i hverdagen** som offentlig label.
3. **Spør Viddel** — global header-CTA; ikke dupliseres som standardlabel overalt.
4. **Hørehjelpen** — ut av synlig hovedcopy/hoved-IA (tekniske widget-parametre kan beholdes).
5. **Still et spørsmål** — ikke global standard; bruk lokal kontekstcopy der relevant.

---

## Route-endringer

| Før | Etter |
|-----|--------|
| `/no/hub/` | `/no/hjelp/` |
| `/no/lyd-i-hverdagen/` | `/no/bedre-lyd/` |

### Redirects

Gamle ruter redirectes permanent:

- `/no/hub/` → `/no/hjelp/`
- `/no/lyd-i-hverdagen/` → `/no/bedre-lyd/`

**Implementasjon:** Astro `redirect`-sider (samme mønster som `/` → `/no`) + `vercel.json` 308-redirects for produksjon på Vercel.

---

## Avgrensninger (#125J)

- **Ingen domeneflytt** til viddel.no (DNS, Vercel domain, canonical).
- **Ingen ny UI-polish** utover nav/lenker/copy som kreves av IA-beslutningen.
- **Ingen ikonrunde**, footer-arkitektur-endring eller FOUC-fix i denne passen.
- **Ingen endring** av `tokens.css` / `global.css`.

---

## Known follow-ups (utenfor #125J)

| Tema | Beskrivelse |
|------|-------------|
| **viddel.no domain readiness** | Domeneflytt og canonical når eksplisitt mandat |
| **Ikon-/illustrasjonspass** | Hjelpekategorier og editorial flater |
| **Composer-paritet** | Hub vs. artikkel-composer |
| **Footer / editorial-shell** | Visuell sammenheng på tvers av flater |
| **FOUC / layout shift** | Known technical debt (#125I-B) |
| **Widget-intern copy** | CES `chat-title` og tilsvarende tekniske felt |

---

## Arbeidsregel

Bruk denne beslutningen som gjeldende offentlig IA til eksplisitt nytt mandat.  
VIS-prototyper og historiske beslutningsdokumenter kan referere til gamle ruter som arkiv — produksjonsnav og lenker skal følge tabellen over.
