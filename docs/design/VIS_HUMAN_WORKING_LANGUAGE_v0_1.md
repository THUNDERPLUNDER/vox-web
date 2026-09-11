# VIS Human Working Language v0.1

Status: Active VIS language contract  
Owner: Thomas  
Scope: Human-facing copy in `/vis` and adjacent VIS orientation surfaces  
Implementation: separate GitHub issue; this document owns the language contract and copy map

## Purpose

VIS skal gjøre Viddel raskere å forstå, diskutere og beslutte.

Dette er **ikke** offentlig Viddel-TOV og ikke en generell regel om å skrive «enklest mulig norsk». VIS er et arbeidsverktøy for Thomas, Vibeke og samarbeidspartnere. Språket skal derfor være naturlig, presist og effektivt, samtidig som fagbegreper beholdes når de faktisk gjør arbeidet lettere.

Hovedregel:

> **VIS bruker vanlige ord når de er presise, og fagbegreper når de faktisk gjør arbeidet lettere. Systemterminologi skal aldri være inngangsbilletten til å forstå hva Viddel gjør.**

Praktisk test:

> **Kan en menneskelig leser forstå overskriften og første setning uten å kjenne issue-et, arkitekturen eller governance-modellen?**

Hvis ja, fungerer første nivå.

---

## 1. Tre språklag

### A. Orienteringsspråk — alltid først

Det leseren møter uten å åpne detaljer.

Det skal svare på spørsmål som:

- Hvor er vi nå?
- Hva prøver vi å få til?
- Hva prioriterer vi?
- Hva gjør vi videre?
- Hva vet vi ikke ennå?
- Hva avhenger dette av?
- Hva følger vi med på?

Bruk konkrete verb: **avklar, test, bygg, lær, velg, mål, forbedre, følg**.

### B. Arbeidsspråk — ved ett nivå mer detalj

Her kan produkt- og prosjektbegreper brukes når de gir presisjon.

Eksempel:

**Gjør AI-hjelpen klar for begrenset beta**  
Bestem hva Viddel må forstå og holde fast ved fra samtalen, og verifiser løsningen før brukertest.

Sekundært:
`state + policy · security · owner-QA · #384/#370/#361`

Meningen kommer først. Systemnavnet kommer etterpå.

### C. Kilde- og governance-språk — behold presisjon

Disse begrepene skal ikke humaniseres bort der de faktisk beskriver kilder, styring eller teknisk sannhet:

- Project Brain
- canonical
- source revision
- GitHub issue / PR
- runtime status
- LEASE / OWN / ECOSYSTEM
- projection owner
- conversation state / policy layer / retrieval når teknisk presisjon er selve poenget

De skal normalt ligge i kildekart, metadata, utvidet detalj, Backstage eller tekniske arbeidsflater, ikke som eneste forklaring på hovednivå.

---

## 2. Språkprinsipper

1. **Mening først, systemnavn etterpå.**
2. **Bruk konkrete verb.** Avklar, test, bygg, lær, velg, mål, forbedre.
3. **Behold gode fagord.** Et kjent begrep skal ikke forenkles bare fordi det er teknisk.
4. **Ett begrep, én jobb.** Ikke varier unødvendig mellom flere navn på samme ting.
5. **Usikkerhet sies naturlig og presist.** Vi vet, tror, antar, tester, følger med på.
6. **Overskriften skal kunne brukes muntlig.** Hvis den fungerer i en faktisk prosjektprat, er det et godt tegn.
7. **Teknisk presisjon flyttes ned, ikke fjernes.**

---

## 3. Kjente begreper vi beholder

Disse kan brukes direkte når de passer konteksten:

| Begrep | Regel |
| --- | --- |
| North Star | Behold som strategisk begrep. |
| Roadmap | Behold. Mer presist enn «plan» her. |
| NOW / NEXT / LATER | Behold som roadmapets orienteringsmodell. |
| WATCH | Behold som eget navn; forklar med vanlig språk. |
| Hypotese | Behold. Viktig skille mellom det vi tror og det vi vet. |
| Beta / MVP | Behold. Forklar bare når målgruppen trenger det. |
| QA | Behold i arbeidsspråk. |
| GitHub / issue / PR | Behold i arbeidsspråk og detaljnivå. |
| Project Brain | Behold som egennavn. |
| LEASE / OWN / ECOSYSTEM | Behold som Operating Model-begreper, men sekundært på VIS. |
| Evidens | Behold når vi faktisk mener evidens. |
| Milepæl | Behold. |
| Avhengighet | Behold. |
| Benchmark | Kan beholdes når benchmark faktisk er det operative begrepet. |
| Inventory | Behold som konseptnavn når Viddel Inventory omtales. |

Dette er ikke en uttømmende ordliste. Nye begreper vurderes etter samme test: **gjør ordet arbeidet lettere og mer presist for de faktiske leserne?**

---

## 4. Begreper som normalt flyttes ned ett nivå

Disse kan være korrekte, men bør sjelden være eneste hovedforklaring:

- read model
- source of truth / task truth
- projection
- canonical
- runtime
- drill-down
- readiness
- gate / trigger
- scope
- policy layer
- retrieval
- owner-QA
- execution likelihood
- timing confidence
- strategic function

Foretrukket mønster:

**Først:** hva betyr dette for arbeidet?  
**Deretter:** hva heter systembegrepet / issue-et / den tekniske mekanismen?

---

# 5. Copy map — `/vis` Project State

Denne delen er den operative copy-mapen for hovedflaten. Endringer skal bevare Project Brain/GitHub-kildegrensene.

## Hero

### Systemlabel
Behold:
`VIS · Project State v0.1`

### Hovedoverskrift
Fra:
`Viddel Project State`

Til:
**Viddel akkurat nå**

### Intro
Fra omtrent:
`Hva Viddel bygger, hva som betyr mest nå, og hvor den underliggende sannheten bor. VIS er en leseflate — ikke backlog eller ny source of truth.`

Til:
**Hva vi bygger, hva som betyr mest nå og hva vi gjør videre. VIS gir et samlet bilde av prosjektet; oppgaver og faktisk status ligger fortsatt i GitHub.**

## Project State-kildeblokk

Fra:
`Hva er sant og viktig nå?`

Til:
**Hva er viktig nå?**

Behold kildeinformasjon om Project Brain og dato sekundært.

## North Star

**KEEP** som begrep og seksjon.

Ikke forenkle North Star-innhold slik at strategisk mening går tapt. Språkvask kan gjøres separat hvis setningene blir unødvendig tunge.

## Fase nå

**KEEP**.

Beskriv faktisk arbeidsfase med vanlig språk og behold grensene mellom prototype, Preview, pre-beta og eksplisitt limited-beta-beslutning. Parkert arbeid skal beskrives som parkert, ikke som neste automatiske handling.

## Veien videre

**KEEP** den nye menneskelige retningen:

`Hva vi arbeider med nå, hva som trolig kommer etter, og hva vi foreløpig holder åpent.`

Roadmap-begrepene NOW / NEXT / LATER / WATCH beholdes.

## Prioriteringer

Eyebrow:
`Prioriteringer` — **KEEP**

Overskrift fra:
`Det vi holder fokus på`

Til:
**Dette prioriterer vi nå**

## Siste beslutninger

Eyebrow:
`Siste beslutninger` — **KEEP**

Overskrift:
`Slik styres retningen` — **KEEP**

## Åpent / hypoteser

Eyebrow:
`Åpent / hypoteser` — **KEEP**

Overskrift:
`Det vi fortsatt må lære` — **KEEP**

Ikke erstatt `hypotese` med vagere formuleringer.

## Neste handlinger

Eyebrow fra:
`Neste 1–3 handlinger`

Kan beholdes dersom antallet faktisk er 1–3. Ellers bruk:
**Neste handlinger**

Overskrift fra:
`Neste kontrollerte steg`

Til:
**Dette gjør vi videre**

Kontrollmekanismen beskrives i handlingene der den er relevant.

---

# 6. Copy map — Grunnmur → Design → Kode

Selve modellen **Grunnmur → Design → Kode** beholdes.

## Seksjonsintro

Fra:
`Viddels varige system`

Til:
**Slik henger Viddel sammen**

Forslag til forklaring:

**Tre lag hjelper oss å skille retning, design og det som faktisk er bygget. Det gjør det lettere å vite hvor en beslutning hører hjemme og hvor vi finner detaljene.**

## Grunnmur

Spørsmål:
`Hva styrer Viddel?` — **KEEP**

Første forklaring:

**Her bestemmer vi hva Viddel skal være og hvem vi bygger for. North Star, brukerinnsikt, innhold, språk og grunnleggende prinsipper hører hjemme her.**

Sekundært kan det stå at varige beslutninger peker til sine canonical kilder.

## Design

Spørsmål:
`Hvordan skal Viddel oppleves?` — **KEEP**

Første forklaring:

**Her bestemmer vi hvordan Viddel skal oppleves og fungere for brukeren. Designsystem, komponenter, mønstre, brand og anvendte flater hører hjemme her.**

`tokens`, `primitives`, `canonical` og lignende beholdes i lenker/detaljer når de er operative begreper.

## Kode / produkt

Spørsmål:
`Hva er implementert og verifisert?` — **KEEP**

Første forklaring:

**Her ser vi det som faktisk er bygget. Produktet, Backstage og GitHub viser implementasjon og teknisk status.**

---

# 7. Copy map — detaljer og arbeidsflater

Seksjon fra:
`Operativ drill-down`

Til:
**Detaljer og arbeidsflater**

Overskrift fra:
`Gå dypere når du trenger det`

Til:
**Gå til detaljene**

Forslag til korte beskrivelser:

### Roadmap
**Se hva vi gjør nå, hva som trolig kommer etter og hvilke muligheter vi holder åpne.**

### GitHub-status
**Se issues, PR-er og faktisk arbeidsstatus.**

### Backstage
**Se hvordan AI, API-er, guards, miljø og produksjon faktisk er satt opp.**

### Review
**Se kandidater og QA før mønstre eller flater blir godkjent.**

### Redaksjonelle bilder
**Se kuraterte bilder og valg for innhold.**

Tekniske ord som `runtime` og `canonical` kan ligge på de respektive tekniske flatene.

---

# 8. Copy map — kildekart

Eyebrow fra:
`Kildekart`

Til:
**Hvor informasjonen kommer fra**

Kildegrensene skal fortsatt være eksplisitte:

- Project Brain eier overordnet syntese og retning.
- GitHub eier oppgaver og faktisk arbeidsstatus.
- `/designsystem/` eier designpresentasjon / designreferanse slik gjeldende designkontrakt definerer.
- Backstage eier teknisk systemreferanse.
- VIS gir den menneskelige, kuraterte oversikten.

Her er `canonical`, revisions-ID-er og eiermetadata lov og ønskelig når de trengs for sporbarhet.

---

# 9. Copy map — Horizon Roadmap

Roadmapet skal fortsatt bruke `NOW → NEXT → LATER` som struktur og `WATCH` som separat lag.

Roadmap-spesifikk display-copy og kompakt initiatividentitet ferdigstilles mot den dynamiske, godkjente projeksjonen som eies av #414; ikke opprett en parallell statisk roadmap-språkkilde.

## Hero

Behold den menneskelige forklaringen:

**Dette er et arbeidskart, ikke en fast plan. Det viser hva vi arbeider med nå, hva vi tror kommer etter, og hvilke muligheter vi holder åpne. WATCH viser ting vi følger med på fordi de kan endre rekkefølgen.**

## Horizon-forklaringer

NOW:
**Det vi arbeider med eller må avklare nå.**

NEXT:
**Det vi tror kommer etter, hvis dagens avklaringer går som forventet.**

LATER:
**Muligheter vi vil huske, men ikke har planlagt å gjøre ennå.**

WATCH:
**Ting vi følger med på fordi de kan flytte, endre eller stoppe noe i planen.**

## Initiative titles — human-facing layer

Canonical roadmap metadata kan fortsatt ha presise tekniske felt, men synlig tittel bør normalt brukes muntlig uten oversettelse.

### `beta-gate`
Fra:
`Minimum state + policy + security → beta gate`

Synlig tittel:
**Gjør AI-hjelpen klar for begrenset beta**

Synlig forklaring:
**Bestem hva Viddel må forstå og holde fast ved fra samtalen, og gå gjennom sikkerhet og QA før brukertest.**

Teknisk detalj kan fortsatt vise:
`state + policy · security · owner-QA · #384/#370/#361`

### `funding-scope`
Fra:
`Avklar IN / DOGA-finansiert scope`

Synlig tittel:
**Avklar finansiering og rammer med IN/DOGA**

### `clinic-value`
Fra:
`Klinikkverdi + første betalende-kunde-hypotese`

Synlig tittel:
**Test hypotesen om klinikkverdi og første betalende kunde**

`hypotese` beholdes.

### `user-relationships`
Fra:
`Brukerrelasjoner + feltlæring før beta`

Synlig tittel:
**Lær fra brukere og Hørselsforbundet før beta**

### `delivery-partner`
Fra:
`Velg + onboard utviklingspartner`

Synlig tittel:
**Velg og få utviklingspartneren i gang**

`onboard` kan beholdes sekundært i teknisk/operativ detalj hvis det er nyttig.

### `doga-markedsklar`
Fra:
`DOGA-partner + Markedsklar`

Synlig tittel:
**Gjennomfør DOGA Markedsklar med riktig designpartner**

Ikke antyd at løpet er lineært eller allerede besluttet hvis det fortsatt er conditional.

### `funded-round-one`
Fra:
`Finansiert teknisk baseline + MVP Round 1`

Synlig tittel:
**Bygg første finansierte MVP-runde**

### `first-user-loop`
Fra:
`Første begrensede ekte brukerloop`

Synlig tittel:
**Test Viddel med de første brukerne**

### `round-two`
Fra:
`Round 2 — evidens → fixes → regression`

Synlig tittel:
**Forbedre Viddel etter det vi lærer i brukertesten**

Sekundært:
`evidens → fixes → regresjonstest`

### `retrieval-benchmark`
Fra:
`Viddel Retrieval Benchmark + evalueringskapabilitet`

Synlig tittel:
**Bygg en Viddel-benchmark for retrieval**

Forklaring bør si hva benchmarken skal brukes til, ikke bare at kapabiliteten finnes.

### `inventory`
Fra:
`Inventory / varig brukereid kontekst`

Synlig tittel:
**Inventory: brukerens egen kontekst**

Inventory beholdes som konseptnavn.

### `research-collaboration`
Fra:
`Research & Ecosystem Partnerships`

Synlig tittel:
**Bygg forsknings- og økosystempartnerskap**

Hvis den engelske issue-tittelen fortsatt er ønskelig som canonical execution-navn, kan den ligge sekundært.

---

# 10. Roadmap-detaljer

Human-facing labels:

| Systemlabel / dagens label | Synlig arbeidsspråk |
| --- | --- |
| Gjennomføringssignal | Visualisering + `Besluttet / Sannsynlig / Avhenger av / Mulighet` |
| Timing | **Når?** |
| Strategisk funksjon | **Strategisk rolle** |
| Gate / trigger | **Avhenger av** |
| Betydning | **Hvor viktig?** |
| Live GitHub-status | **Status i GitHub** |

Underliggende enum- og metadatafelt skal ikke omdøpes bare for copyens skyld dersom det øker teknisk risiko. Dette er et presentasjonslag.

---

# 11. WATCH copy

WATCH som begrep beholdes.

Når et signal har en teknisk tittel, bruk gjerne mønsteret:

**Menneskelig signal først**  
*teknisk presisering under*

Eksempel:

Fra:
`Modell-, retrieval- og agentkapabilitet / kost`

Til:
**Hva standard AI blir bedre og billigere på**

Sekundært:
`modeller · retrieval · agenter · kostnad`

---

# 12. Oppdateringsregel

Dette dokumentet er canonical for **human-facing VIS language**, ikke for offentlig Viddel-copy og ikke for teknisk runtime-terminologi.

Når en ny VIS-flate eller et nytt roadmap-initiativ lages:

1. Skriv først den menneskelige overskriften og første forklaringen.
2. Test dem mot den praktiske lesertesten i toppen av dokumentet.
3. Legg teknisk/systemmessig presisjon under, hvis den trengs.
4. Nye viktige begreper vurderes og kan legges til i seksjon 3 eller 4.
5. Hvis et mønster gjentas på flere VIS-flater, oppdater dette dokumentet i samme PR som copyendringen.
6. Ikke kopier hele denne kontrakten inn i issues, Project Brain eller kodekommentarer. Lenke hit.

## Endringsansvar

- Thomas eier endelig språkretning og godkjenning.
- Shaping kan foreslås av ChatGPT/@rigger, @navigator eller andre verktøy.
- Codex/Work implementerer bare copy som er eksplisitt godkjent i issue/task contract eller denne copy-mapen.
- Hvis korrekthet krever teknisk språk som strider mot et copy-forslag her, stopp og løft avviket; ikke skjul presisjon.

---

# 13. QA-checklist for VIS-copy

Før merge av en meningsfull VIS-copyendring:

- [ ] Forstår en menneskelig leser overskriften uten issue-/arkitekturkunnskap?
- [ ] Sier første setning hva dette betyr for arbeidet?
- [ ] Er konkrete verb brukt der de passer?
- [ ] Er gode fagord beholdt fremfor å bli unødvendig omskrevet?
- [ ] Er systemterminologi flyttet ned når den ikke trengs for første forståelse?
- [ ] Er hypoteser fortsatt tydelig skilt fra fakta?
- [ ] Er Project Brain / GitHub / Backstage / VIS-kildegrensene bevart?
- [ ] Fungerer teksten muntlig i en faktisk prosjektgjennomgang?
- [ ] Er mobil/kompakt copy fortsatt forståelig uten ekstra forklaring?

---

# 14. Scope boundary

Dette dokumentet styrer ikke:

- offentlig TOV på `viddel.no`
- artikkelredaksjonens tone og stil
- AI-svar til sluttbrukere
- teknisk dokumentasjon i Backstage
- GitHub execution contracts der teknisk presisjon er hovedformålet
- kodeidentifikatorer, enum-navn eller API-kontrakter

Disse kan bruke andre språkregler, men bør peke hit når de lager en menneskelig VIS-presentasjon av samme informasjon.
