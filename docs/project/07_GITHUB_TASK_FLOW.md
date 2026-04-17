# 07_GITHUB_TASK_FLOW

## Formål
Gjøre GitHub Projects til KlarLyds delte oppgavebuss på tvers av Thomas, Vibeke, @navigator, @rigger, Cursor og senere @knaus.

## Prinsipp
Vi bruker ett felles GitHub Project med flere views, ikke flere parallelle prosjekter.

GitHub Projects er:
- delt statuslag
- delt oppgavebuss
- felles operativ sannhet for arbeid som faktisk er i flyt

VIS er:
- visnings- og samhandlingsflate
- kuratert inngang til viktige artefakter
- ikke backlog
- ikke source of truth for task-status

## Kanonisk modell v1

### Flytfelt
`KL Status`
- Backlog
- Neste
- I arbeid
- Review
- Ferdig
- Senere

### Arbeidsspor
`Workstream`
- Content
- IA
- AI Agent
- AI Training
- UI Design
- Ops / Architecture

### Nivå
`Level`
- Track
- Task

### Øvrige felt
- `Priority` = P1 / P2 / P3
- `Area` = sekundær faglig klassifisering
- `Owner`
- `Notes`
- `Link`
- `Start date`
- `Target date`

## Hva feltene betyr
- `KL Status` styrer faktisk flyt
- `Workstream` gir oversikt per arbeidsspor
- `Level` skiller overordnet tidslinje fra konkrete oppgaver
- `Area` brukes som sekundær sortering ved behov
- `Start date` og `Target date` brukes i roadmap

## Kanoniske views

### 1. Master table
Full sannhet for @navigator og @rigger.

Vis felter:
- Title
- KL Status
- Workstream
- Level
- Priority
- Owner
- Start date
- Target date
- Link

### 2. Board — Workstreams
Formål:
Lett tavleoversikt for Thomas og Vibeke.

Oppsett:
- layout: Board
- columns: Workstream
- filter: Level = Task og KL Status != Ferdig

Kort bør vise:
- KL Status
- Priority
- Owner

### 3. Board — Execution
Formål:
Operativ flyt for @rigger og Cursor.

Oppsett:
- layout: Board
- columns: KL Status
- filter: Level = Task

### 4. Roadmap — Tracks
Formål:
Enkel overordnet tidslinje for arbeidsspor og større løft.

Oppsett:
- layout: Roadmap
- filter: Level = Track
- start date: Start date
- target date: Target date
- group by: Workstream

### 5. Content testing
Formål:
Gi et eget, ryddig view for content-produksjon og testing.

Oppsett:
- filter: Workstream = Content

## Operativ flyt

### @navigator
- oppretter eller prioriterer Track-items
- setter Workstream, Priority og Target date
- holder roadmap og overordnet status oppdatert

### @rigger
- bryter Track ned til Task ved behov
- gjør oppgaven byggbar
- sikrer riktig statusflyt
- sikrer at handoff og Return Ticket henger sammen med kortet

### Cursor
- utfører kun på grunnlag av konkret Task / issue
- leverer commit, push, commit hash, push-status og verifikasjon
- returnerer med Return Ticket

### Thomas og Vibeke
- følger primært Roadmap — Tracks og Board — Workstreams
- bruker disse viewene som lett delt oversikt

### @knaus senere
- bruker samme prosjekt, filtrert på Content-sporet

## Handoff og Return Ticket
- issue body = oppgavekort / operativ brief
- project card = status og metadata
- Return Ticket = issue comment eller lenket artefakt
- `Link`-feltet peker til viktigste artefakt når relevant

## Backlog intake v0.1
Formål:
Fange nye ideer raskt fra Thomas, Vibeke og @navigator uten nytt prosjekt, ny persona eller ny automasjon.

Flyt:
- Inbox: Alle nye ideer kan opprettes direkte som issue og legges i prosjektet med `KL Status = Backlog`.
- Triage: Kort avklaring av hva ideen er, hvilket arbeidsspor den hører til (`Workstream`), og om den er byggbar nå.
- Neste: Kun byggbare ideer flyttes til `KL Status = Neste` og kan brytes videre ned til konkret Task ved behov.

Minimum for intake-kort:
- kort tittel med tydelig problem eller mulighet
- 2-4 linjer kontekst i issue body
- foreløpig `Workstream`
- `Level` settes til Track eller Task etter enkel triage

Avgrensning:
- ingen ny backlog-løsning utenfor GitHub task bus
- ingen VIS-endringer for intake
- ingen utvidelse av statusmodellen i denne versjonen

## Definition of done for GitHub task bus v1
GitHub Projects regnes ikke som levert før:
- kanoniske felt er definert
- views er definert
- minst én reell oppgave har gått gjennom normal statusflyt
- Return Ticket er koblet til oppgaven
- roadmap viser overordnet spor på track-nivå

## Ikke nå
- ikke flere GitHub Projects
- ikke full automasjon
- ikke egen @ops-rolle
- ikke nytt content-prosjekt
- ikke utvidet statusflora før nåværende modell er testet i praksis
