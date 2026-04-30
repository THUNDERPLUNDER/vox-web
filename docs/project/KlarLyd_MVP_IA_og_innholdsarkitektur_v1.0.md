# KlarLyd MVP IA og innholdsarkitektur v1.0

**Status:** Canonical v1.0  
**Dato:** 2026-04-30  
**Eier:** @navigator  
**Operativ bruk:** @rigger, @knaus, Cursor  
**Kontekst:** Etter lukket #77 og oppdatert #78 til MVP test readiness v0.2

---

## 1. Formål

Dette dokumentet låser den operative IA- og innholdsretningen for første testbare KlarLyd MVP.

MVP-en skal ikke lenger forstås som en enkelt demo. Den skal være en liten, sammenhengende produktopplevelse som kan testes med virkelige brukere:

- forside
- første hub
- første spokes / artikler
- Article AI i artikkelflyt
- standalone chat som egen inngang
- visuelt og redaksjonelt ryddig brukerflate
- første CES/RAG-grunnlag som støtter innholdet

---

## 2. Låste beslutninger

### 2.1 Første MVP-hub

**Første MVP-hub er:**

> Bedre lyd i hverdagen

### 2.2 Hub-mandat

Huben skal hjelpe folk å mestre konkrete hverdagssituasjoner med hørsel, lyd, teknologi og samtaler - med artikler som forklarer, og AI som hjelper videre.

Huben er den operative MVP-versjonen av det bredere mandatet:

> Daglig mestring, teknisk og mentalt

### 2.3 Første tre spokes

| Spoke | Arbeidstittel | Primær testverdi |
|---|---|---|
| R1 | Samtaler hjemme og med familie | Tester relasjon, lytteanstrengelse, konkrete grep og pårørende-behov |
| R2 | Mobil, app og Bluetooth | Tester teknisk problemløsning, visuell instruksjon og RAG-presisjon |
| R3 | Hvorfor blir jeg så sliten av å høre? | Tester forklaring, trygghet, innsikt og emosjonell resonans |

Disse tre dekker første MVP-behov:

```text
menneskelig situasjon
+ teknisk friksjon
+ forklarende innsikt
```

---

## 3. Interne brukerhypoteser

Disse hypotesene brukes internt for å sikre at MVP-en treffer ulike brukssituasjoner. De skal ikke bli synlig IA.

| Intern brukerhypotese | Kjennetegn | Hva de trenger fra KlarLyd |
|---|---|---|
| Lyd-optimisten | Teknologisk interessert, ønsker god lyd og moderne løsninger, lav toleranse for stigma | Kontroll, presisjon, teknisk dybde og mulighet til å optimalisere |
| Den moderne livsnyteren | Aktiv, sosial, estetisk bevisst, vil beholde livskvalitet uten unødig friksjon | Enkle grep, sosial trygghet, god forklaring uten sykdomsspråk |
| Den proaktive partneren | Pårørende eller hjelper, ofte den som driver prosessen videre | Oversikt, konkrete råd, trygg måte å støtte uten å presse |
| Den reaktive tvileren | Utrygg, teknologiske barrierer, høy terskel for å søke hjelp eller bruke apparat. Søker ofte ikke informasjonen selv, men kommer inn via partner eller pårørende | Kognitiv ro, trygghet, små steg og lav terskel |

---

## 4. Tverrgående behovsmoduser

MVP-innholdet skal styres av behov og situasjoner, ikke av personas.

| Behovsmodus | Typisk situasjon | Innholdet må gjøre |
|---|---|---|
| Avklare | “Er dette hørsel, stress, alder eller noe annet?” | Hjelpe brukeren å forstå situasjonen og se mulig neste steg |
| Forstå | “Hvorfor skjer dette med meg?” | Forklare hørsel, lyd, anstrengelse og tilvenning uten å sykeliggjøre |
| Mestre | “Hva kan jeg gjøre i dag?” | Gi konkrete, små og praktiske grep |
| Feilsøke | “Hvorfor virker ikke dette?” | Løse teknisk friksjon raskt og presist |
| Støtte samtalen | “Hvordan snakker vi om dette?” | Gjøre relasjoner lettere og gi pårørende en bedre rolle |

---

## 5. Hub-mandater i porteføljen

### 5.1 Bedre lyd i hverdagen

**Status:** Første MVP-hub  
**Rolle:** Mestrings- og problemløserhub

Mandat:

> Hjelpe brukeren å få mer ut av hørselen i konkrete hverdagssituasjoner, med praktiske råd, forklaringer og rask AI-hjelp når noe stopper opp.

Typiske tema:

- samtaler hjemme
- støy og lytteanstrengelse
- mobil, app og Bluetooth
- tilvenning
- pårørende og kommunikasjon
- “hva gjør jeg nå?”-situasjoner

### 5.2 Veien til høreapparat

**Status:** Neste prioritert hub etter første MVP-slice  
**Rolle:** Avklaringshub

Mandat:

> Senke terskelen for å søke hjelp og forstå veien videre.

Typiske tema:

- tegn på hørselstap
- når bør jeg teste hørselen?
- hvordan ser moderne høreapparater ut?
- hva er første praktiske steg?
- hvordan kan pårørende ta praten?

### 5.3 NAV, rettigheter og økonomi

**Status:** Senere MVP-/veksthub  
**Rolle:** Trygghets- og beslutningshub

Mandat:

> Gjøre regler, kostnader og prosess forståelig nok til at bruker eller pårørende vet hva de skal gjøre videre.

Typiske tema:

- hva dekker NAV?
- hva må man betale selv?
- hva er egenandel / mellomlegg?
- hvordan fungerer søknadsprosessen?
- hva kan pårørende hjelpe med?

### 5.4 Mestring og psykologi

**Status:** Ikke egen første hub  
**Rolle:** Aksent og dybdelag i andre hubber

Mandat:

> Hjelpe brukeren å håndtere skam, tilvenning, sosial slit og mestring uten at hørselstapet blir unødig sykeliggjort.

I første MVP bør dette veves inn i R1 og R3, ikke skilles ut som egen hub.

---

## 6. IA-prinsipper for MVP

### 6.1 Brukeren møter behovsspråk

Synlig IA skal bruke språk som speiler situasjoner og behov:

- samtaler
- støy og slit
- mobil og tilkobling
- tilvenning
- rettigheter
- veien videre

Synlig IA skal ikke bruke interne persona-navn som “Lyd-optimisten” eller “Tvileren”.

### 6.2 Hubber er mandatflater

En hub skal ikke være en tilfeldig artikkelliste. Den skal ha et tydelig mandat:

- hva hjelper denne huben brukeren med?
- hvilken type situasjoner dekker den?
- hvilke spokes leder den til?
- hvordan kan AI hjelpe videre?

### 6.3 Spokes er testflater

Hver spoke skal teste mer enn tekst:

- redaksjonell forklaring
- visuell støtte
- seed-spørsmål
- Article AI-overgang
- CES/RAG-kvalitet

---

## 7. Article AI vs. standalone chat

### 7.1 Article AI

Article AI er kontekstuell hjelp i artikkelen.

Rolle:

> Brukeren leser seg inn i et tema og kan deretter stille spørsmål videre i samme kontekst.

Prinsipp:

- AI skal oppleves som en naturlig forlengelse av innholdet
- ikke som en løs widget utenpå produktet
- seed-spørsmål skal gjøre overgangen fra lesing til handling lavterskel
- composer-from-start er nå hovedmønster for dialog-spokes

### 7.2 Standalone chat

Standalone chat er en egen inngang for brukere som vil spørre først.

Rolle:

> Brukeren kan starte med et spørsmål uten å måtte lese en artikkel først.

Prinsipp:

- standalone chat skal ikke være en ny tjeneste
- den skal bruke samme KlarLyd-stemme, kildegrunnlag og RAG-retning som artiklene
- den bør inngå i forside og navigasjon som “spør først”-inngang
- den skal være egen testflate for agenten

---

## 8. Forside og hub som ruting

### 8.1 Forside

Forsiden skal være en top-task-ruter, ikke en lang avisvegg.

Den bør hjelpe brukeren å velge:

- jeg vil forstå hva som skjer
- jeg trenger hjelp i hverdagen
- jeg har tekniske problemer
- jeg vil vite om rettigheter og økonomi
- jeg vil spørre KlarLyd direkte

### 8.2 Første hub: Bedre lyd i hverdagen

Huben skal være overgangen fra overordnet orientering til konkrete situasjoner.

Den skal gjøre det tydelig at brukeren kan:

- lese om en situasjon
- få konkrete grep
- gå videre til AI-dialog
- finne nærliggende tema

---

## 9. Visuelle anker

Hver av de tre første pilotartiklene skal ha minst ett visuelt anker.

| Spoke | Visuelt behov |
|---|---|
| R1 | Situasjonsnær illustrasjon av samtale / hjem / relasjon |
| R2 | Forenklet diagram eller stegvis figur for mobil, app og Bluetooth |
| R3 | Forklarende visualisering av lytteanstrengelse / energi / støy |

Visuelle anker skal redusere kognitiv friksjon og gjøre artiklene mer testbare.

Etablerte artikkelbyggeklosser brukes etter behov:

- **ArticleCallout** for utheving, handling og konkrete grep
- **ArticleFigure** for visuelt anker, diagram eller illustrasjon
- **ArticleRail** for marginnhold, dypdykk, supplerende forklaring eller sitat

---

## 10. CES/RAG-prinsipp for første MVP

R1-R3 skal også definere første eval-sett for AI-svar.

Hver spoke bør ha:

- 3-5 seed-spørsmål
- 5-10 realistiske oppfølgingsspørsmål
- tydelig forventning til hva KlarLyd skal kunne svare på
- markering av hva som krever kildegrunnlag i CES/RAG
- markering av hva som er utenfor scope eller bør besvares varsomt

PromptGroups / seed-spørsmål skal knyttes til konkrete avsnitt eller tekstområder der det er praktisk mulig, slik at Article AI-opplevelsen blir kontekstuelt relevant og ikke generisk.

Første MVP skal særlig teste:

- samtaler og lytteanstrengelse
- teknisk friksjon med mobil/app/Bluetooth
- forklaring av slitenhet, støy og tilvenning
- overgangen fra artikkel til AI-hjelp
- om standalone chat svarer konsistent med artiklene

---

## 11. Styrende produktregel

KlarLyd bør forstås som tre samvirkende lag:

1. **Chrome / navigasjon** - hjelper brukeren å finne fram
2. **Editorial layer** - gir rolig, troverdig og strukturert innsikt
3. **Action / AI layer** - hjelper brukeren videre fra lesing til konkret handling

Arbeidsregel:

> Chrome bærer orientering. Editorial layer bærer lesing. AI bærer handling videre fra lesing, og skal visuelt og konseptuelt slekte på editorial layer.

---

## 12. Åpne spørsmål

Disse er ikke låst i v1.0:

1. Skal standalone chat være synlig i hovednavigasjon fra første MVP-test, eller først på forsiden?
2. Skal “Veien til høreapparat” bygges som neste hub før “NAV og rettigheter”?
3. Hvor sterkt skal “Mestring og psykologi” navngis, hvis det ikke er egen hub?
4. Hvilke kilder skal inn i CES/RAG først for R2 teknisk feilsøk?
5. Hvilke illustrasjoner skal lages manuelt, og hvilke kan genereres/komponeres først som MVP-assets?

---

## 13. Hva Cursor skal vite ved hub-/spoke-bygging

Når Cursor arbeider med forside, hub, spokes eller chat, skal denne korte blokken være nok:

```text
Canonical IA for MVP:
- Første hub: "Bedre lyd i hverdagen"
- Hub-mandat: hjelpe brukere å mestre konkrete hverdagssituasjoner med hørsel, lyd, teknologi og samtaler.
- Første spokes:
  R1: Samtaler hjemme og med familie (tester ArticleCallout / konkrete grep)
  R2: Mobil, app og Bluetooth (tester ArticleFigure / teknisk veiledning)
  R3: Hvorfor blir jeg så sliten av å høre? (tester ArticleRail / dypdykk og forklaring)
- Synlig IA skal styres av top tasks og behov, aldri interne personas.
- Article AI integreres via seed-spørsmål knyttet til teksten.
- Standalone chat er separat inngang fra forside for dem som vil spørre først.
- Hver pilotartikkel skal ha minst ett visuelt anker.
- R1-R3 danner grunnlaget for første CES/RAG eval-sett.
```

---

## 14. Kildegrunnlag

Dette dokumentet bygger på:

- tidligere KlarLyd-kjernearbeid om hubber, top tasks og “Lydglede”
- @navigator-syntese av brukersegmenter, hub-mandater og operative MVP-komponenter
- Grunnpreso KlarLYD april.pptx
- 00_NAVIGATOR_STRATEGI_LOGG
- GitHub/VIS-runtime etter #77
- rånotatet “Prompt til cursor- status klarlyd”
- produktbeslutningen i #78: MVP test readiness v0.2

---

## 15. Neste operative bruk

Dette dokumentet skal brukes til:

1. GitHub-issues for MVP content architecture
2. Cursor-prompter for hub, forside og spoke-bygging
3. @knaus-brief for R1-R2-R3
4. @navigator-arbeid med CES/RAG-retning
5. review av om nye forslag bygger MVP-reisen eller skaper sidespor
