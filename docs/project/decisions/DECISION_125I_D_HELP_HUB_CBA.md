# Decision #125I-D — Help hub CBA v0.1

Status: **QA accepted / CBA v0.1 / closed**  
Sprint: 2026-W21  
Route: `/no/hub/`  
Related: #125D (Hjelp A3), #125I Cross-surface polish (#157), #125I-B (FOUC)

## Kort beslutning

`/no/hub/` er en **praktisk hjelpehub** (utility / problemløsning), ikke en magasin- eller redaksjonell hub.  
Etter polish R1–R8 og Thomas QA (2026-05) er flaten **god nok for nå** som **CBA v0.1** — current best answer, ikke endelig design lock.

---

## Informasjonsarkitektur

| Element | Rolle |
|--------|--------|
| **H1** — «Hva trenger du hjelp med?» | Primær orientering |
| **Composer** | Primær inngang (AI-spørsmål først i DOM) |
| **Kategori-kort** | Sekundær inngang til problemområder |
| **«Hjelp meg med»-liste** | Tertiær, kompakt problemliste |
| **Eskalering** | Audiograf / «Still et spørsmål» |

Hub-innhold skal **ikke** inneholde «Hørehjelpen» som egen hub-tittel eller redaksjonell framing.

---

## Visuell retning (CBA v0.1)

### Kategori-kort

- **Hvite flater** (`--reading-paper`) — tekststerke, uten endelig ikonsett
- **Store korttitler** som visuelle anker
- **Editorial card-hover:** hvit flate beholdes; hover via soft shadow + lett lift (`translateY(-2px)`)
- **Ingen fersken/offwhite** som interactive card surface
- Mønster tett på editorial cards i Lyd i hverdagen — uten magasinhub-følelse

### Liste-rader

- **Nøytral row-hover** (`#F5F6F5`) på «Hjelp meg med» og tilsvarende rader
- `#F5F6F5` er **ikke** category card hover — kun row/list IXD

### Surface

- Article-paritet: 46rem lesebredde, `--radius-md`, hvit hub-surface på canvas
- Ingen offwhite/peach på kort som interaktive flater

---

## Hva CBA betyr

**CBA = current best answer** — god nok retning for videre arbeid og produksjon, ikke endelig design lock.  
Endringer krever nytt mandat eller eget issue; ikke ad hoc polish i lukket slice.

---

## Known issue (utenfor denne beslutningen)

**FOUC / layout shift** ved lasting av hub (og enkelte andre ruter) forblir **known technical debt** (#125I-B).  
Ingen fix er del av #125I-D.

---

## Follow-ups (ikke i #125I-D)

| Tema | Beskrivelse |
|------|-------------|
| **Ikon-/illustrasjonspass** | Eget pass for hjelpekategorier — ikonsett er bevisst utelatt i CBA v0.1 |
| **Composer-paritet** | Hub-composer vs. artikkel-/editorial-composer — felles oppførsel senere |
| **Footer / editorial-shell** | Visuell og strukturell sammenheng mellom hub og redaksjonelle flater |
| **FOUC / layout shift** | Teknisk spike eller felles page shell (#125I-B) |
| **Copy / nav naming** | Senere pass (#125J) — navnetiketter, microcopy, IA-ordlyd |

---

## QA-lås (Thomas, R8)

Godkjent som **godt nok for nå**:

- H1 + composer som primær inngang
- Hvite kategori-kort uten ikoner, tekststerke titler
- Editorial card-hover (ikke grå fill på kort)
- Row-hover beholdt på liste
- Ingen «Hørehjelpen» i hub-innhold
- `/no/` uendret av denne slicen

---

## Arbeidsregel

Bruk denne beslutningen som gjeldende retning for `/no/hub/` til eksplisitt nytt mandat.  
Follow-ups startes som egne issues — ikke som utvidelse av lukket #125I-D.
