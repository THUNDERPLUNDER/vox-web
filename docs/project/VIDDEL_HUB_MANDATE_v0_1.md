# VIDDEL Hub Mandate v0.1

> Canonical mandat for første Viddel-hub, før public hub UI bygges.
> Vedtatt: 2026-05-08 · Status: aktiv · Bygger på: #110 / #111

---

## Kildehierarki

Dette dokumentet bygger på følgende kilder, prioritert i rekkefølge:

1. **Viddel – MVP Core Definition v0.1** (mai 2026) — nyeste strategiske ramme
2. **Viddel – konseptgrunnlag for interessentdialog v0.1** — produktretning og hjelpelag-tenkning
3. **VIDDEL_IA_PRINCIPLES_v0_1.md / #110** — vedtatt IA-grunnmur
4. Eldre IA/hub-spoke-dokumenter — kun som historisk støtte, ikke styrende

Nyere Viddel-strategi fra mai 2026 har høyere vekt enn eldre IA-dokumenter.

---

## IA-prinsipper som gjelder

Låste prinsipper fra #110:

- **Navigasjon og hubstruktur styres av behov / top tasks.**
- **Segmenter brukes til analyse, prioritering og vinkling — ikke til nav.**
- **Hubben er ikke en målgruppeforside.**
- **«For deg som hjelper noen» skal ikke være hub nå.**

---

## Første hub

| Felt | Verdi |
|---|---|
| Strategisk område | Daglig bruk, optimering og restart |
| Brukerrettet hubnavn | **Få høreapparatet til å fungere** |
| Støttetekst | Vanlige problemer og hjelp |
| Engasjementstype | Akutt hjelp |

### Hubbens mandat

Hubben skal hjelpe brukeren å finne riktig guide når noe ikke virker med høreapparat, app, lyd, lading eller vedlikehold.

En Viddel-hub er en behovsstyrt inngang til konkrete hjelpesituasjoner. Den samler top tasks, artikler og AI-overganger slik at brukeren raskt kan:

1. kjenne igjen situasjonen
2. forstå hva som er normalt vs. hva som krever hjelp
3. finne relevant guide
4. gå videre til AI-dialog eller menneskelig hjelp når det trengs

---

## Språkprinsipp

> Tillit skapes gjennom nytte, ikke betryggende adjektiver.

**Unngå:**
- første trygge steg
- på en rolig måte
- trygg og enkel
- skånsom

**Bruk heller:**
Direkte språk som sier hva brukeren konkret kan gjøre.

---

## Top tasks — første MVP-scope

| # | Top task |
|---|---|
| 1 | Stoppe piping |
| 2 | Koble høreapparatet til mobilen |
| 3 | Fikse app eller Bluetooth |
| 4 | Sjekke batteri og lading |
| 5 | Rense filter, propp eller dome |
| 6 | Forstå om lyden er feil eller normal |
| 7 | Vite når audiograf bør kontaktes |

---

## Article/spoke mapping

| Top task | Artikkel | Status |
|---|---|---|
| Stoppe piping | Få slutt på pipingen | Finnes |
| Koble høreapparatet til mobilen | Koble høreapparatet til mobilen | Finnes |
| Fikse app eller Bluetooth | — | Delvis dekket av mobilartikkelen; trenger avklaring |
| Sjekke batteri og lading | — | Content gap |
| Rense filter, propp eller dome | — | Content gap |
| Forstå om lyden er feil eller normal | — | Content gap / mulig delvis i oppstartartikkel |
| Vite når audiograf bør kontaktes | Audiograf når det haster | Finnes / eskaleringskandidat |
| Komme i gang med høreapparat | De første ukene med høreapparat | Finnes; hører sannsynligvis hjemme i egen oppstartshub |
| Samtaler / støy | Når hørselen endrer samtalen | Finnes / referanse; trolig egen samtalehub |

---

## AI-rolle

AI skal støtte ruting og fallback på hubben — ikke dominere siden.

| Nivå | AI-rolle |
|---|---|
| Hub-level | Finn riktig hjelp |
| Mulig prompt | Skriv hva som ikke fungerer |
| Article-level | Skarpere, kontekstbundet opplevelse (per artikkelmandat) |

Hub-AI er inngang og triage. Artikkel-AI er den dype hjelpen.

---

## Design-system guardrails

> Første hub er sannsynligvis en **Editorial-led surface**, ikke en Chrome-/dashboardflate.

### Arbeidshypotese

- Header/nav kan ha Chrome-rolle (glass/elevated)
- Hovedflaten bør være Editorial (reading-paper, rolig, ikke branded bakgrunn)
- Artikkel- og task-innganger bruker hvite/reading-paper flater
- Unngå dashboardpreg, bokser-i-bokser og Sonic/orb/gradient-dominans
- Ikke bygg hubben som generisk kortgrid
- AI skal være tilgjengelig, men ikke dominere

### Sannsynlige nye patterns

- Editorial top task entry
- Editorial article card
- Task-to-article mapping row/card
- Escalation area
- AI fallback entry

Når public hub bygges, skal nye hub-patterns dokumenteres i `/vis/system/design-system-v01`.

---

## Kjernemodell

| Felt | Verdi |
|---|---|
| Brukeroppgave | Få høreapparatet til å fungere |
| Innganger | Søk, forside, artikkel, delt lenke, Hørehjelpen |
| Sideløfte | Finne relevant problem og riktig hjelp |
| Hovedinnhold | Top task-innganger + utvalgte artikler |
| Videre | Artikkel, Article AI, Hørehjelpen, audiograf ved behov |
| Produktmål | Teste om behovsstyrt navigasjon gir raskere første handling |
| Målesignal | Task-klikk, artikkelklikk, AI-open/start, seed-klikk, oppfølgingsspørsmål, escalation-klikk |

---

## Ikke-mål

- ~~Public hub UI i denne oppgaven~~
- ~~Målgruppebasert navigasjon~~
- ~~Full hjelpermodus~~
- ~~Full «Mine sider»~~
- ~~Analytics-dashboard~~
- ~~Storyblok schema-refaktor~~
- ~~Forside-redesign~~
- ~~Nye claims eller pitchspråk~~

---

## Neste byggesak

Når dette mandatet er godkjent, kan neste sak skrives som en konkret hub build-issue med:
- Godkjent hubnavn og mandat
- Avklarte top tasks
- Valgte artikler fra mapping-tabellen
- Avklart pattern-valg (task-liste vs. kortgrid vs. hybrid)
- Avklart AI-overgang fra hub
- Akseptkriterier for QA

---

*Vedlikeholdes som del av Viddel IA-kanon. Oppdater ved hub-beslutninger.*
