# KlarLyd Core Evidence Pack v1.0

**Status:** Draft / Canonical candidate  
**Dato:** 2026-05-01  
**Eier:** @navigator  
**Operativ bruk:** @rigger, @knaus, Cursor, Vibeke  
**Tilhører epic:** #84

---

## 0. Hvordan denne pakken brukes

- **Core Pack** er den canonical kilden for deck, VIS-underlag (jf. §19; inkl. repoets `/vis/`-flater der relevant), øvrige søknader og ekstern dialog der KlarLyd skal forklares konsekvent.
- **Slidedeck er ikke eneste kilde til sannhet.** Tekst og tall i presentasjoner skal kunne spores til denne pakken eller til eksplisitt merkede kilder.
- **Claims må klassifiseres** (jfr. §11 og §12) før de brukes eksternt. Bruk status i Claim Bank — ikke anta at alt som “hører bra ut” er dokumentert fakta.
- **Sterke retoriske formuleringer kan beholdes** for pathos og pitch, men skal merkes i Rhetorical Claim Bank med anbefalt bruksarena og risiko. Målet er å bevare overbevisningskraft uten å svekke etterrettelighet.

**Klassifiseringsetiketter (arbeidsverktøy):**

| Etikett | Betydning |
| --- | --- |
| Dokumentert fakta | Verifiserbar, med kilde og grønn/gul status |
| Trygg formulering | Formulering som holder seg innenfor dokumentert grunnlag |
| Retorisk formulering | Overbevisning; må ikke presenteres som ren fakta uten merking |
| Illustrativ formulering | Metafor eller eksempel; ikke tall eller juridisk/politisk presisjon |
| Arbeidshypotese | Internt resonnement; ikke ekstern claim uten gjennomgang |
| Påstand som trenger kilde | Må løftes til kilde eller tones ned / parkeres |
| Kun muntlig / pitch | OK i muntlig eller dedikert pitch-slide; ikke som hardt faktum i trykk |

### Kilde- og relevansregel

- En claim er ikke klar for ekstern bruk før den har Claim Bank-ID, trygg formulering, kilde, direktelenke, datagrunnlagets år, begrensning, relevansstatus og sist verifisert dato.
- Gamle tall skal ikke forkastes automatisk. De skal merkes som historiske, og vurderes etter om de fortsatt er relevante for argumentet.
- Et historisk tall kan brukes hvis det er tydelig datert og ikke presenteres som nåsituasjon.
- Samfunnsøkonomiske beregninger, QALY og sykdomsbyrde er anerkjente metoder når de brukes innenfor riktig kategori, men skal ikke blandes med budsjett- eller regnskapstall.
- Retoriske formuleringer skal kobles til underliggende Claim Bank-ID-er eller merkes som illustrativ/pathos.

---

## 1. Kort pitch

### Én-linjes posisjonering

_[Plassholder — én setning som plasserer KlarLyd vs. status quo.]_

### 30 sekunders pitch

_[Plassholder — 3–5 setninger: problem, løsning, hvem, hvorfor nå.]_

### 2 minutters pitch

_[Plassholder — utvidet narrativ med hook, innsikt, produkt, neste steg.]_

---

## 2. Hva KlarLyd er

### Produktdefinisjon

_[Plassholder — hva produktet *er*: tjeneste, plattform, AI-støttet innhold, osv.]_

### Hvem det hjelper

_[Plassholder — primær og sekundær målgruppe.]_

### Hvilket gap det fyller

_[Plassholder — mellom utstyr, oppfølging og daglig mestring.]_

### Hva det ikke er

_[Plassholder — f.eks. ikke erstatning for audiograf, ikke medisinsk diagnose, osv.]_

---

## 3. Problemet

### Brukerproblem

_[Plassholder — konkret smerte, friksjon, skam, utmattelse.]_

### Systemproblem

_[Plassholder — finansiering, organisering, prioritering i helsetjenesten.]_

### Kapasitetsproblem

_[Plassholder — tid hos audiograf, oppfølging, geografisk ulikhet.]_

### Teknologigap

_[Plassholder — avansert apparatur vs. brukerens faktiske mestring.]_

### Hverdagsmestring etter utlevering

_[Plassholder — hva skjer etter at apparatet er “levert”; analog opplevelse av digital løsning.]_

---

## 4. Hvorfor nå

### Demografi

_[Plassholder — aldring, behov for støtte, osv.]_

### Mer avanserte høreapparater

_[Plassholder — økt kompleksitet for bruker.]_

### Kapasitetsutfordringer

_[Plassholder — knappe ressurser i fagfeltet.]_

### AI/RAG-modning

_[Plassholder — teknologi som kan gi trygg, kildebasert veiledning.]_

### Behov for digital selvhjelp

_[Plassholder — forventning og etterspørsel etter 24/7-tilgang.]_

---

## 5. Brukere og behov

### Brukeren selv

_[Plassholder.]_

### Pårørende og hjelpere

_[Plassholder.]_

### Likepersoner / hørselshjelpere

_[Plassholder.]_

### Audiografer / fagmiljø

_[Plassholder — samarbeid, ikke konkurranse, avlastning.]_

### Produsenter

_[Plassholder.]_

### Stat / kommune / NAV

_[Plassholder.]_

---

## 6. Behovsmoduser og top tasks

Struktur hentet fra canonical IA-dokument (`KlarLyd_MVP_IA_og_innholdsarkitektur_v1.0.md` §4).

MVP-innholdet skal styres av behov og situasjoner, ikke av interne persona-navn synlig i UI.

| Behovsmodus | Typisk situasjon | Innholdet må gjøre |
| --- | --- | --- |
| Avklare | «Er dette hørsel, stress, alder eller noe annet?» | Hjelpe brukeren å forstå situasjonen og se mulig neste steg |
| Forstå | «Hvorfor skjer dette med meg?» | Forklare hørsel, lyd, anstrengelse og tilvenning uten å sykeliggjøre |
| Mestre | «Hva kan jeg gjøre i dag?» | Gi konkrete, små og praktiske grep |
| Feilsøke | «Hvorfor virker ikke dette?» | Løse teknisk friksjon raskt og presist |
| Støtte samtalen | «Hvordan snakker vi om dette?» | Gjøre relasjoner lettere og gi pårørende en bedre rolle |

_[Utvid plassholder: top tasks per modus for første hub.]_

---

## 7. Første MVP-scope

Canonical retning (jf. IA v1.0, lukket/oppdatert kontekst #77 / #78).

### Første hub

**Bedre lyd i hverdagen** — mestrings- og problemløserhub; hjelper brukeren å få mer ut av hørselen i konkrete hverdagssituasjoner med praktiske råd, forklaringer og rask AI-hjelp når noe stopper opp.

### Første tre spokes (R1–R3)

| Spoke | Arbeidstittel | Primær testverdi |
| --- | --- | --- |
| R1 | Samtaler hjemme og med familie | Relasjon, lytteanstrengelse, konkrete grep, pårørende-behov |
| R2 | Mobil, app og Bluetooth | Teknisk problemløsning, visuell instruksjon, RAG-presisjon |
| R3 | Hvorfor blir jeg så sliten av å høre? | Forklaring, trygghet, innsikt, emosjonell resonans |

### Øvrige MVP-elementer

- **Article AI** — kontekstuell hjelp i artikkelflyt.
- **Standalone chat** — egen inngang for åpen dialog (operativ definisjon videre i §8–9).
- **CES/RAG-grunnlag** — kunnskapsmotor som støtter innhold og svar med kildekrav og evalueringsgrenser (jf. §9).

_[Plassholder: MVP test readiness-kriterier og lenke til operative issues.]_

---

## 8. Produktmodell

### Hub & spoke

_[Plassholder — mandat per hub; spokes som testflater.]_

### Innhold + AI-dialog

_[Plassholder — redaksjonelt lag + samtale.]_

### Article AI vs standalone chat

_[Plassholder — når hvilken modus; jfr. IA §7 i innholdsarkitekturen.]_

### CES/RAG som kunnskapsmotor

_[Plassholder — rolle, ikke “hallusinasjonsmotor”.]_

### Chrome / editorial layer / action layer

_[Plassholder — UI-lag, redaksjonell kvalitet, handlinger brukeren kan ta.]_

---

## 9. AI / CES / RAG

### Hva agenten skal kunne

_[Plassholder — forklare, foreslå grep, henvise til innhold/kilder.]_

### Hva den ikke skal gjøre

_[Plassholder — diagnostikk, medisinske anbefalinger uten rammer, osv.]_

### Kildegrunnlag

_[Plassholder — RAG-korpus, redaksjonell policy.]_

### Eval-spørsmål

_[Plassholder — presisjon, trygghet, nyttighet, tone.]_

### Kvalitetsgrenser

_[Plassholder — eskalering til fag, disclaimers, logging/review.]_

---

## 10. Marked, tall og samfunnsøkonomi

> **Krav:** Alle tall som brukes i deck eller ekstern søknad skal ha **claim-status** i §11 før publisering. Ingen “lånte” tall uten verifikasjon.

### Omfang av hørselstap

_[Plassholder + status: Trenger kilde / Gul.]_

### Antall høreapparatbrukere

_[Plassholder + status.]_

### Underbruk

_[Plassholder + status.]_

### Ventetid

_[Plassholder + status.]_

### Audiografkapasitet

_[Plassholder + status.]_

### Demens / isolasjon / livskvalitet

_[Plassholder — forsiktig med kausalitet; klassifiser claims.]_

### Offentlig kostnadsbilde

_[Plassholder + status.]_

---

## 11. Claim Bank — evidence layer

Claim Bank er referanseregisteret for alle tall, fakta og påstander som kan brukes i deck, VIS, søknader og ekstern dialog. Ingen eksterne claims skal brukes uten at de finnes her eller er eksplisitt merket som retorisk formulering i §12.

**Status:**

- Grønn
- Gul
- Rød
- Trenger kilde
- Parkert

**Dokumentasjonsgrad:**

- Direkte dokumentert
- Delvis dokumentert
- Estimat
- Samfunnsøkonomisk beregning
- Faglig tolkning
- Motstridende kilder
- Ikke funnet dokumentasjon
- Krever videre undersøkelse

**Relevansstatus:**

- Aktuell
- Historisk, fortsatt relevant
- Historisk, bør oppdateres
- Utdatert
- Uavklart

**Bruksstatus:**

- Draft
- Verifisert internt
- Klar for deck
- Klar for søknad
- Kun muntlig pitch
- Kun appendix
- Parkert
- Utdatert

| ID | Claim | Status | Dokumentasjonsgrad | Trygg formulering | Kilde-ID | Kilde | Kildetype | Datagrunnlagets år | Direktelenke | Sitat / datapunkt | Begrensning | Relevansstatus | Relevansnotat | Sist verifisert | Eier | Bruksstatus | Brukes i | Kommentar |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| CB-001 | NAV/staten brukte over 1 mrd kroner på høreapparatposten i 2024 | Gul | Direkte dokumentert | Offisielle budsjett-/regnskapstall for post 78 Høreapparat var 1 084 mill. kroner i 2024. | SRC-005 | Prop. 1 S (2025–2026) | Primær offentlig | 2024 | https://www.regjeringen.no/no/dokumenter/prop.-1-s-20252026/id3123398/?ch=2 | 1 084 mill. kr på post 78 Høreapparat | Gjelder post 78 Høreapparat. Kilden bryter ikke konsekvent ut apparater, tinnitusmaskerere, reparasjoner og andre delkomponenter hvert år. | Aktuell | Brukes som 2024-regnskapstall for post 78, ikke som total kostnad for hele hørselsomsorgen. | 2026-05-01 | @navigator | Draft | Deck problem/samfunnsnytte, appendix | Avventer manuell QA før Grønn/Klar for deck. Primær dokumentasjon: Prop. 1 S; jfr. SRC-001 for NAV-regnskapskontekst. |
| CB-002 | NAVs prisgrense for digitale høreapparater er 7 515 kr per enhet i 2025, videreført nominelt i 2026 | Gul | Direkte dokumentert | NAVs prisgrense for digitalt høreapparat er 7 515 kroner per enhet i 2025, og 2026-budsjettet legger opp til nominell videreføring. | SRC-002, SRC-005 | NAV Høreapparat; Prop. 1 S (2025–2026) | Primær offentlig | 2025–2026 | https://www.nav.no/horeapparat | 7 515 kr per digitalt høreapparat; nominell videreføring i 2026 | Dette er prisgrense/støttetak, ikke faktisk gjennomsnittspris eller total kostnad. NAV-siden er løpende og må sjekkes ved ekstern bruk. | Aktuell | 6 605 kr skal bare brukes som historisk sats for 2024, ikke som gjeldende 2025–2026-sats. | 2026-05-01 | @navigator | Draft | Appendix / kostnadsforklaring | Korrigert etter smalresearch. Må ikke forveksles med gjennomsnittskostnad. |
| CB-003 | En betydelig andel høreapparateiere bruker apparatet svært lite | Gul | Delvis dokumentert | EuroTrak Norway 2019 viste at 22 % av høreapparateiere oppga 0–1 time bruk per dag, og 7 % oppga 0 timer per dag. | SRC-003 | EuroTrak Norway 2019 | Sekundær / bransjeundersøkelse | 2019 | https://www.ehima.com/wp-content/uploads/2019/05/EuroTrak_2019_NORWAY.pdf | 22 % 0–1 time/dag; 7 % 0 timer/dag | Surveydata; selvrapportert; gjelder eiere/respondenter, ikke nødvendigvis alle utleverte apparater. | Historisk, fortsatt relevant | Brukes som dokumentert surveyfunn fra 2019 inntil nyere norsk brukstidsdata finnes. Må ikke formuleres som nåtidsregistertall. | 2026-05-01 | @navigator | Draft | Problem / underbruk / appendix | Godt pitchpoeng, men må formuleres presist. |
| CB-004 | Utgiftene på post 78 Høreapparat har økt betydelig siden 2018 | Gul | Direkte dokumentert | Offentlige tall for post 78 Høreapparat økte fra 683,2 mill. kroner i 2018 til 1 084 mill. kroner i 2024, med 1 210,2 mill. kroner foreslått for 2026. | SRC-004, SRC-005 | Prop. 1 S (2019–2020); Prop. 1 S (2025–2026) | Primær offentlig | 2018–2026 | https://www.regjeringen.no/no/dokumenter/prop.-1-s-20252026/id3123398/?ch=2 | 683,2 mill. kr i 2018; 1 084 mill. kr i 2024; 1 210,2 mill. kr foreslått for 2026 | 2026 er budsjettforslag, ikke regnskap. Posten brytes ikke konsekvent ned i alle delkomponenter hvert år. | Aktuell | Brukes som trend for offentlig høreapparatpost, ikke som total hørselsomsorgskostnad. | 2026-05-01 | @navigator | Draft | Deck problem/samfunnsnytte, appendix | Kandidat for deck etter manuell QA. |
| CB-005 | Det finnes ikke primær dokumentasjon for at staten bruker ca. 1,4 mrd årlig på høreapparater som budsjett-/regnskapstall | Rød | Ikke funnet dokumentasjon | I gjennomgåtte primærkilder er det ikke funnet dokumentasjon for «ca. 1,4 mrd kroner årlig på høreapparater» som offisielt budsjett- eller regnskapstall. | SRC-004, SRC-005, SRC-007 | Prop. 1 S-serien; Oslo Economics | Primær offentlig / samfunnsøkonomisk analyse | 2018–2026 | https://www.regjeringen.no/no/dokumenter/prop.-1-s-20252026/id3123398/?ch=2 | Nærmeste offisielle budsjett-/regnskapstall er 1 084 mill. kr for post 78 Høreapparat i 2024 | 1,4 mrd kan være forvekslet med andre samfunnsøkonomiske kostnadsestimater. | Aktuell | Brukes til å hindre at gammelt deck viderefører feil/misvisende tall. | 2026-05-01 | @navigator | Parkert | Intern QA / ikke deck | Ikke bruk 1,4 mrd som høreapparatbudsjett uten ny primærkilde. |
| CB-006 | 1 415 mill. kroner finnes som samfunnsøkonomisk estimat for helsetjenestekostnader ved hørselstap | Gul | Samfunnsøkonomisk beregning | Oslo Economics anslo helsetjenestekostnader ved nedsatt hørsel til 1 415 mill. kroner, som del av direkte kostnader i sin samfunnsøkonomiske analyse. | SRC-007 | Nedsatt hørsel i arbeidsfør alder | Samfunnsøkonomisk analyse | 2018-estimat / rapport 2020 | https://cdn.sanity.io/files/ajniw4rx/production/9f76044e33ceba4c95c8ff24d993a9f1d8bb9495.pdf | 1 415 mill. kr helsetjenestekostnader | Ikke NAVs høreapparatbudsjett og ikke et offentlig regnskapstall. | Historisk, fortsatt relevant | Kan brukes som samfunnsøkonomisk estimat med tydelig kategori. | 2026-05-01 | @navigator | Draft | Appendix / samfunnsøkonomi | Mulig forklaring på tidligere 1,4 mrd-forveksling. |
| CB-007 | Det best dokumenterte nasjonale apparatvolumtallet er 95 601 høreapparater kjøpt inn i 2018 | Gul | Direkte dokumentert | I 2018 ble det kjøpt inn 95 601 høreapparater gjennom folketrygden. | SRC-004 | Prop. 1 S (2019–2020) | Primær offentlig | 2018 | https://www.regjeringen.no/no/dokumenter/prop.-1-s-20192020/id2671373/?ch=2 | 95 601 høreapparater kjøpt inn gjennom folketrygden | Historisk apparattall fra 2018. Ikke nyere årlig volum og ikke antall personer. | Historisk, fortsatt relevant | Brukes som best dokumenterte apparattelling inntil nyere primærkilde finnes. | 2026-05-01 | @navigator | Draft | Appendix / volumforklaring | Ikke bruk som nåtidsvolum uten årstall. |
| CB-008 | Nyere offentlige volumtall rapporterer søknader, ikke apparater | Gul | Direkte dokumentert | Nyere offentlige budsjettomtaler rapporterer søknader om stønad til høreapparat, ikke antall apparater. I 2024 var tallet 63 113 søknader. | SRC-005 | Prop. 1 S (2025–2026) | Primær offentlig | 2024 | https://www.regjeringen.no/no/dokumenter/prop.-1-s-20252026/id3123398/?ch=2 | 63 113 søknader om stønad til høreapparat i 2024 | Søknader kan ikke likestilles med apparater eller personer. | Aktuell | Brukes til å forklare hvorfor volumclaims må defineres presist. | 2026-05-01 | @navigator | Draft | Appendix / intern QA | Viktig for å unngå tallblanding. |
| CB-009 | Det finnes ikke primær dokumentasjon for ca. 140 000 høreapparater årlig | Rød | Ikke funnet dokumentasjon | I gjennomgåtte primærkilder er det ikke funnet dokumentasjon for at ca. 140 000 høreapparater deles ut årlig i Norge. | SRC-004, SRC-005 | Prop. 1 S-serien | Primær offentlig | 2018–2024 | https://www.regjeringen.no/no/dokumenter/prop.-1-s-20252026/id3123398/?ch=2 | 95 601 apparater i 2018; 63 113 søknader i 2024 | Tallet kan eventuelt bygge på annen definisjon, men dette er ikke dokumentert i gjennomgåtte primærkilder. | Aktuell | Brukes til å parkere et usikkert deck-tall. | 2026-05-01 | @navigator | Parkert | Intern QA / ikke deck | Ikke bruk 140 000 som hardt volumclaim uten ny primærkilde. |
| CB-010 | Antall personer med høreapparattilpasning økte fra 35 000 per år i 2010 til 53 000 per år i 2018 | Gul | Direkte dokumentert | Helsedirektoratet oppgir at antall personer med høreapparattilpasning økte fra 35 000 per år i 2010 til 53 000 per år i 2018. | SRC-006 | Utredning av tilbud til hørselshemmede | Primær offentlig | 2010–2018 | https://www.helsedirektoratet.no/rapporter/utredning-av-tilbud-til-horselshemmede/vedlegg/Utredning%20av%20tilbud%20til%20h%C3%B8rselshemmede%20.pdf | 35 000 personer per år i 2010; 53 000 personer per år i 2018 | Personer med tilpasning, ikke antall apparater. | Historisk, fortsatt relevant | Brukes som historisk utvikling i tilpasningsvolum. | 2026-05-01 | @navigator | Draft | Appendix / volumforklaring | Krever tydelig skille fra apparatvolum. |
| CB-011 | Helsedirektoratet anslo rundt 230 000 høreapparatbrukere i Norge i 2018 | Gul | Estimat | Helsedirektoratet anslo rundt 230 000 høreapparatbrukere i Norge i 2018, dersom HUNT-data var representative for landet. | SRC-006 | Utredning av tilbud til hørselshemmede | Primær offentlig | 2018 | https://www.helsedirektoratet.no/rapporter/utredning-av-tilbud-til-horselshemmede/vedlegg/Utredning%20av%20tilbud%20til%20h%C3%B8rselshemmede%20.pdf | ca. 230 000 høreapparatbrukere ved HUNT-ekstrapolasjon | Estimat basert på representativitetsantakelse, ikke registertelling. | Historisk, fortsatt relevant | Kan brukes som historisk anslag inntil nyere primærkilde finnes. | 2026-05-01 | @navigator | Draft | Appendix / marked | Ikke bland med HLFs nyere 300 000 uten egen kilde og definisjon. |
| CB-012 | Oslo Economics anslo direkte kostnader ved nedsatt hørsel til om lag 2 023 mill. kroner | Gul | Samfunnsøkonomisk beregning | Oslo Economics anslo direkte kostnader ved nedsatt hørsel til om lag 2 023 mill. kroner, hvorav 1 415 mill. kroner var helsetjenestekostnader og 608 mill. kroner gjaldt høreapparater og hørselstekniske hjelpemidler. | SRC-007 | Nedsatt hørsel i arbeidsfør alder | Samfunnsøkonomisk analyse | 2018-estimat / rapport 2020 | https://cdn.sanity.io/files/ajniw4rx/production/9f76044e33ceba4c95c8ff24d993a9f1d8bb9495.pdf | 2 023 mill. kr direkte kostnader; 1 415 mill. helsetjenester; 608 mill. hjelpemidler | Modellbasert analyse, ikke offentlig budsjett/regnskap. | Historisk, fortsatt relevant | Brukes som samfunnsøkonomisk kostnadsestimat med tydelig kategori. | 2026-05-01 | @navigator | Draft | Samfunnsøkonomi / appendix | Kandidat for deck etter QA. |
| CB-013 | Oslo Economics anslo produksjonstap ved nedsatt hørsel til 1 956 mill. kroner | Gul | Samfunnsøkonomisk beregning | Oslo Economics anslo produksjonstap ved nedsatt hørsel til 1 956 mill. kroner. | SRC-007 | Nedsatt hørsel i arbeidsfør alder | Samfunnsøkonomisk analyse | 2018-estimat / rapport 2020 | https://cdn.sanity.io/files/ajniw4rx/production/9f76044e33ceba4c95c8ff24d993a9f1d8bb9495.pdf | 1 956 mill. kr produksjonstap | Modellbasert samfunnsøkonomisk beregning, ikke budsjett/regnskap. | Historisk, fortsatt relevant | Brukes som samfunnsøkonomisk estimat med tydelig kategori. | 2026-05-01 | @navigator | Draft | Samfunnsøkonomi / appendix | Kan brukes sammen med CB-012, men unngå dobbelttelling i samlet argumentasjon. |
| CB-014 | 36 mrd. kroner er dokumentert som økonomisk verdsatt helsetap/sykdomsbyrde | Gul | Samfunnsøkonomisk beregning | 36 mrd. kroner er dokumentert som økonomisk verdsetting av helsetap/sykdomsbyrde knyttet til nedsatt hørsel, ikke som offentlig budsjettkostnad. | SRC-007, SRC-008 | Nedsatt hørsel i arbeidsfør alder; Helsedirektoratets samfunnsøkonomiske vurdering | Samfunnsøkonomisk analyse / primær offentlig omtale | 2018-estimat / rapport 2020 | https://www.helsedirektoratet.no/rapporter/utredning-av-tilbud-til-horselshemmede/samfunnsokonomisk-vurdering | 27 600 kvalitetsjusterte leveår; 36 mrd. kr verdsatt helsetap | Ikke statens faktiske utgift og ikke alene samlet regnskapskostnad. | Historisk, fortsatt relevant | QALY-/sykdomsbyrdeberegning er legitim som samfunnsøkonomisk kategori, men må merkes presist. | 2026-05-01 | @navigator | Draft | Samfunnsøkonomi / appendix / mulig deck | Ikke nedton QALY-metodikk; presiser kategori. |
| CB-015 | QALY/DALY er anerkjent metodikk i norsk samfunnsøkonomisk analyse | Gul | Direkte dokumentert | Helsedirektoratet anbefaler QALY eller DALY som indikatorer for å måle virkninger på liv og helse i samfunnsøkonomiske analyser. | SRC-009 | Virkninger på helse og livskvalitet i utredninger og samfunnsøkonomiske analyser | Primær offentlig / metodeveileder | 2024 | https://www.helsedirektoratet.no/veiledere/virkninger-pa-helse-og-livskvalitet-i-utredninger-og-samfunnsokonomiske-analyser/helse-og-livskvalitetseffekter-i-samfunnsokonomiske-analyser/kvalitetsjusterte-levear-qaly-eller-helsetapsjusterte-levear-daly-er-enhetene-som-fortrinnsvis-anbefales-anvendt-som-indikatorer-for-a-male-virkninger-pa-liv-og-helse-i-samfunnsokonomiske-analyser | QALY/DALY anbefales som indikatorer for liv og helse i samfunnsøkonomiske analyser | Metodikken gjør ikke beregningen til budsjett-/regnskapstall. | Aktuell | Brukes for å legitimere QALY/sykdomsbyrde som metodekategori. | 2026-05-01 | @navigator | Draft | Appendix / metodeforklaring | Viktig for å bruke 36 mrd korrekt uten å svekke verdien av metodegrunnlaget. |
| CB-016 | Utlevering av høreapparat er ikke det samme som realisert rehabiliteringsgevinst | Gul | Faglig tolkning | Utlevering av høreapparat er ikke det samme som realisert rehabiliteringsgevinst; offentlige kilder peker på behov for tilvenning, opplæring og etterkontroll. | SRC-006, SRC-010 | Helsedirektoratet; Helsenorge | Primær offentlig | 2019–2024 | https://www.helsenorge.no/horsel/horeapparat/ | Tilvenning beskrives som en prosess; etterkontroll omtales som viktig for kvalitetssikring og videre behov | Dette er en faglig tolkning av kilder, ikke ett direkte sitat eller regnskapstall. | Aktuell | Brukes som bro mellom offentlig investering, faktisk bruk og mestring. | 2026-05-01 | @navigator | Draft | Problem / kjerneinnsikt / deck | Kandidat for sentral deckformulering etter Vibeke-review. |

Neste ledige ID: **CB-017**. Utvid tabellen etter hvert som claims låses; ikke bruk tomme celler som fakta.

---

## 12. Rhetorical Claim Bank — logos / ethos / pathos

> **Merk:** Radene under er **foreløpige retoriske formuleringer**, ikke dokumenterte fakta. De skal mappees til underliggende støtteclaims (§11) før bruk som «hard» tekst.

Retorisk rolle: **Logos** | **Ethos** | **Pathos** | **Logos + Pathos** | **Ethos + Pathos**

| ID | Retorisk formulering | Retorisk rolle | Underliggende støtteclaim | Bruksarena | Risiko | Anbefalt bruk |
| --- | --- | --- | --- | --- | --- | --- |
| R-001 | «Dagens modell finansierer maskinvaren, men ikke resultatet.» | Logos + Pathos | Retorikk; spor/sekundærstøtte: **CB-001**, **CB-004**, **CB-014**, **CB-016** — ikke én dokumentert enkeltfakta | Muntlig pitch; søknad (etter review) | Overgeneralisering | Kun etter fag/juridisk avklaring; ellers illustrativ; ikke som budsjett- eller registertall |
| R-002 | «Vi holder brukerne fast i et analogt oppsett rundt digital teknologi.» | Pathos + Logos | _[C-xxx brukeropplevelse]_ | Deck narrativ; ikke som statistikk | Kan oppleves polariserende | Merkes som retorikk; koble til konkrete observasjoner |
| R-003 | «KlarLyd flytter fokus fra utstyr til mestring.» | Ethos + Pathos | Produkttese; jfr. hub-mandat | Pitch, VIS «Hva er KlarLyd?» | Konkurranse mot apparatfokus | Trygg som posisjonering; presiser ikke erstatning for apparat |
| R-004 | «Ingen skal måtte vente på hjelp til å forstå teknologien de allerede har fått.» | Pathos | _[C-xxx kapasitet/kø]_ | Søknad, emosjonell slide | Absolutt «ingen» er sterkt | Behold med Etikett *Kun muntlig / pitch* eller myk form i trykk |
| R-005 | «Fra høreapparat i skuffen til lydglede i hverdagen.» | Pathos | Illustrativ; tall om underbruk jfr. **CB-003** (presis formulering) | Illustrativ slide; ikke som prevalens | Metafor tatt for bokstavelig | Illustrativ formulering; ikke rapporter som studie |

_[Legg til flere R-ID etter behov; hold logikk: hver sterk setning har støtte-ID eller er eksplisitt illustrativ.]_

---

## 13. Funding- og stipendargumenter

### Samfunnsnytte

_[Plassholder.]_

### Innovasjonshøyde

_[Plassholder — RAG, tilgjengelighet, hybrid innhold/AI.]_

### Skalerbarhet

_[Plassholder.]_

### Forebygging

_[Plassholder — isolasjon, helseøkonomi med forsiktighet.]_

### Avlastning av fagmiljø

_[Plassholder — align med etisk posisjon §0.]_

### Tilgjengelighet / likeverdig hjelp

_[Plassholder.]_

---

## 14. Go-to-market og interessenter

### Brukere

_[Plassholder.]_

### Pårørende

_[Plassholder.]_

### HLF

_[Plassholder.]_

### Kommuner

_[Plassholder.]_

### Audiografer

_[Plassholder.]_

### Produsenter

_[Plassholder.]_

### NAV / offentlige aktører

_[Plassholder.]_

### Mulige piloter

_[Plassholder.]_

---

## 15. Roadmap

### MVP test readiness

_[Plassholder — kriterier, #78.]_

### Første brukertester

_[Plassholder.]_

### Første innholdsslice

_[Plassholder — hub + R1–R3.]_

### AI/RAG-kvalitet

_[Plassholder — eval, logging, review.]_

### Partner-/pilotspor

_[Plassholder.]_

### Funding-/stipendspor

_[Plassholder.]_

---

## 16. Team og troverdighet

### Thomas

_[Plassholder — rolle, erfaring, hvorfor KlarLyd.]_

### Vibeke

_[Plassholder.]_

### Faglige medspillere

_[Plassholder.]_

### Hvorfor dette teamet kan bygge dette

_[Plassholder — kompetanse + verdigrunnlag.]_

### Etisk posisjon og uavhengighet

_[Plassholder — ingen skjulte bindinger; respekt for brukere og fagmiljø; jfr. §0 Ethos.]_

---

## 17. Screenshots og demo-assets

Sjekkliste for innhenting (ingen filer i denne pakkens v1.0 — kun plan).

- [ ] Forside
- [ ] Hub («Bedre lyd i hverdagen»)
- [ ] R1 — Samtaler hjemme og med familie
- [ ] R2 — Mobil, app og Bluetooth
- [ ] R3 — Hvorfor blir jeg så sliten av å høre?
- [ ] Article AI før klikk
- [ ] Article AI etter seed
- [ ] Compose / oppfølgingsspørsmål
- [ ] Standalone chat
- [ ] Mobilvisning (representativ breakpoint)

---

## 18. Deck mapping

Base deck referanse (ekstern): *Grunnpreso KlarLYD april.pptx* (Drive) — **ikke endret av denne oppgaven**.

| Deckmodul | Henter fra Core Pack-seksjon | Status | Kommentar |
| --- | --- | --- | --- |
| Cover / tittel | §1, §2 | Draft | — |
| Problem | §3, §10 (med claim-status), §12 | Draft | Skill logos vs pathos |
| Hvorfor nå | §4 | Draft | — |
| Brukere | §5, §6 | Draft | — |
| Løsning / produkt | §2, §7, §8 | Draft | — |
| AI | §9, §11–12 | Draft | Kvalitet og grenser |
| Marked / samfunn | §10, §13 | Draft | Tall kun med Grønn/Gul |
| GTM | §14 | Draft | — |
| Roadmap | §15 | Draft | — |
| Team | §16 | Draft | Ethos |
| Appendiks / kilder | §11, §20 | Draft | — |

---

## 19. VIS mapping

Forslag til VIS-seksjoner (ingen endring i eksisterende VIS-dokument utført her).

1. Hva er KlarLyd?
2. Kjerneinnsikt
3. MVP-status
4. Produktmodell
5. Første hub og spokes
6. Article AI
7. Screenshots
8. Tall og claim-status
9. Pitch slides
10. Roadmap

_[Kryssreferanser til faktiske VIS-dokument-IDer når de finnes.]_

---

## 20. Kildebank

Kildebanken er registeret over kilder som brukes i Claim Bank. Hver kilde får en Kilde-ID, slik at claims kan peke til kilder uten å kopiere full referanse hver gang.

| Kilde-ID | Tittel | Utgiver | År | URL | Kildetype | Brukes av claims | Sist åpnet/verifisert | Arkivert kopi | Kommentar |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| SRC-001 | Årsrapport 2024 NAV | Arbeids- og velferdsdirektoratet / NAV | 2025 / datagrunnlag 2024 | https://www.nav.no/_/en/attachment/inline/e89e93e3-3056-47ce-b374-de424818be8a%3A88d6d362b3654d28c3661c2c23c520251b9d2e47/%C3%85rsrapport%202024%20NAV.pdf | Regnskap/statistikk | CB-001 | 2026-05-01 | Ikke avklart | Støttekontekst til NAV hjelpemiddelregnskap; primær post 78-dokumentasjon for CB-001 er SRC-005. |
| SRC-002 | Høreapparat | NAV | Løpende nettside / satser 2022, 2024, 2025–2026 | https://www.nav.no/horeapparat | Primær offentlig | CB-002 | 2026-05-01 | Ikke avklart | Brukes for prisgrenser/stønadsgrenser og mellomlegg. Sjekkes ved større søknad/deckrevisjon fordi NAV-siden er løpende. |
| SRC-003 | EuroTrak Norway 2019 | EHIMA / Anovum | 2019 | https://www.ehima.com/wp-content/uploads/2019/05/EuroTrak_2019_NORWAY.pdf | Sekundær / bransjeundersøkelse | CB-003 | 2026-05-01 | Ikke avklart | Brukes for surveydata om brukstid, adopsjon og tilfredshet. Må merkes som selvrapportert og bransjeinitiert. |
| SRC-004 | Prop. 1 S (2019–2020) | Arbeids- og sosialdepartementet / regjeringen.no | 2019 / datagrunnlag 2018 | https://www.regjeringen.no/no/dokumenter/prop.-1-s-20192020/id2671373/?ch=2 | Primær offentlig | CB-004, CB-005, CB-007, CB-009 | 2026-05-01 | Ikke avklart | Brukes for 2018-utgifter, antall innkjøpte høreapparater, tinnitusmaskerere og reparasjoner. |
| SRC-005 | Prop. 1 S (2025–2026) | Arbeids- og inkluderingsdepartementet / regjeringen.no | 2025 / datagrunnlag 2024 og budsjettforslag 2026 | https://www.regjeringen.no/no/dokumenter/prop.-1-s-20252026/id3123398/?ch=2 | Primær offentlig | CB-001, CB-002, CB-004, CB-005, CB-008, CB-009 | 2026-05-01 | Ikke avklart | Brukes for 2024-utgifter, 2024-søknader og foreslått 2026-bevilgning for post 78 Høreapparat. |
| SRC-006 | Utredning av tilbud til hørselshemmede | Helsedirektoratet | 2019 | https://www.helsedirektoratet.no/rapporter/utredning-av-tilbud-til-horselshemmede/vedlegg/Utredning%20av%20tilbud%20til%20h%C3%B8rselshemmede%20.pdf | Primær offentlig | CB-010, CB-011, CB-016 | 2026-05-01 | Ikke avklart | Brukes for antall personer med tilpasning, kontroller, estimert antall høreapparatbrukere og etterkontroll/oppfølging. |
| SRC-007 | Nedsatt hørsel i arbeidsfør alder | Oslo Economics på oppdrag fra HLF | 2020 / 2018-estimater | https://cdn.sanity.io/files/ajniw4rx/production/9f76044e33ceba4c95c8ff24d993a9f1d8bb9495.pdf | Samfunnsøkonomisk analyse | CB-005, CB-006, CB-012, CB-013, CB-014 | 2026-05-01 | Ikke avklart | Brukes for direkte kostnader, helsetjenestekostnader, produksjonstap, QALY og verdsatt helsetap. Ikke offentlig regnskap. |
| SRC-008 | Samfunnsøkonomisk vurdering | Helsedirektoratet | 2019 | https://www.helsedirektoratet.no/rapporter/utredning-av-tilbud-til-horselshemmede/samfunnsokonomisk-vurdering | Primær offentlig / omtale av samfunnsøkonomisk analyse | CB-014 | 2026-05-01 | Ikke avklart | Offentlig omtale av samfunnsøkonomiske beregninger og usikkerhet. |
| SRC-009 | Virkninger på helse og livskvalitet i utredninger og samfunnsøkonomiske analyser | Helsedirektoratet | 2024 | https://www.helsedirektoratet.no/veiledere/virkninger-pa-helse-og-livskvalitet-i-utredninger-og-samfunnsokonomiske-analyser/helse-og-livskvalitetseffekter-i-samfunnsokonomiske-analyser/kvalitetsjusterte-levear-qaly-eller-helsetapsjusterte-levear-daly-er-enhetene-som-fortrinnsvis-anbefales-anvendt-som-indikatorer-for-a-male-virkninger-pa-liv-og-helse-i-samfunnsokonomiske-analyser | Primær offentlig / metodeveileder | CB-015 | 2026-05-01 | Ikke avklart | Brukes for QALY/DALY som anbefalt metodikk i samfunnsøkonomiske analyser. |
| SRC-010 | Høreapparat | Helsenorge | 2023/2024 oppdatert side | https://www.helsenorge.no/horsel/horeapparat/ | Primær offentlig | CB-016 | 2026-05-01 | Ikke avklart | Brukes for tilvenning, motivasjon, arbeid/livskvalitet og oppfølging. |

Neste ledige ID: **SRC-011**. *Tag*-struktur for kildetype eller «usikker kilde» kan fortsatt noteres i Kommentar-feltet eller som egne rader.

---

## 21. Åpne spørsmål

Startliste (utvid underveis):

1. Hvilke tall må verifiseres før deck v1?
2. Hvilke retoriske formuleringer skal brukes i hoveddeck vs muntlig pitch?
3. Hvordan dokumenterer vi ethos (uavhengighet, etikk, faglig rådgivning)?
4. Hvilke claims bør Vibeke reviewe kommersielt?
5. Hvilke claims bør fagpersoner (audiologi/klinikk) reviewe?
6. Hvilke screenshots trengs før deckoppdatering?
7. Hvordan synker vi denne filen med `Grunnpreso KlarLYD april.pptx` uten at deck blir sannhetskilde?
8. Hvilke referanser fra #77 og #78 skal limes inn som canonical tekst vs kun lenke?

---

## Vedlegg: Relaterte repo- og sporingskilder

| Kilde | Bruk |
| --- | --- |
| `docs/project/KlarLyd_MVP_IA_og_innholdsarkitektur_v1.0.md` | IA, hub, spokes, behovsmoduser, Article AI |
| GitHub #77, #78 | MVP / test readiness (oppdater med presise lenker i drift) |
| Epic #84 | Core Pack + canonical pitch deck spor |
| Drive: Grunnpreso KlarLYD april.pptx | Historisk deck — mappes via §18 |
