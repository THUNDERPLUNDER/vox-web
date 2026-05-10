# VIDDEL Manufacturer Data Matrix — Source QA v0.1

Status: Kilde-QA-metode / arbeidsstandard  
Dato: 2026-05-10  
Koblet til: #115, #116, #114, #99, #102, #103  
Scope: Research- og kvalitetssikringsramme før ekstern bruk  

## 1. Formål

Dette notatet definerer hvordan Viddel skal kilde-QA-e produsentmatrisen for høreapparatdata, datalogging, remote care, app-/skydata, diagnostikk og bruker-/klinikkinnsyn.

Målet er å sikre at funn fra Deep Research og annen research ikke brukes som fakta før de er vurdert mot kilder, usikkerhet og ekstern bruksrisiko.

Dette notatet skal brukes før produsentrelaterte datapåstander tas inn i:

- interessentpresentasjoner
- Core Pack / pitchgrunnlag
- søknader
- ekstern dialog med HLF, audiografer, klinikker, NAV/offentlig sektor eller produsenter
- strategiske notater som kan sirkuleres utenfor arbeidsrommet

## 2. Grunnprinsipp

Produsentmatrisen skal skille tydelig mellom fakta, observasjon, hypotese og uavklart.

Arbeidsregel:

> Ingen produsentpåstand brukes eksternt som fakta uten identifiserbar, relevant og tilstrekkelig sterk kilde.

Det betyr at vi kan bruke hypoteser internt, men vi må merke dem som hypoteser.

## 3. Kildehierarki

Kilder rangeres etter styrke. Sterkere kilder kan brukes til tryggere formuleringer.

### Nivå 1 — Primær juridisk/personvernkilde

Eksempler:

- produsentens offisielle privacy policy
- app privacy notice
- GDPR-/data protection-notat
- terms of service der databruk beskrives

Bruk:

- datakategorier appen/produsenten oppgir at de kan samle
- formål for behandling
- deling med tredjeparter
- brukerrettigheter
- geografisk/markedsmessig avgrensning dersom oppgitt

Styrke:

- sterk for hva produsenten juridisk oppgir
- ikke nødvendigvis sterk for hva funksjonen faktisk viser i appen eller klinikkverktøyet

### Nivå 2 — App store data declarations

Eksempler:

- Google Play Data Safety
- Apple App Store App Privacy

Bruk:

- datatyper knyttet til appen
- om data kan knyttes til bruker
- om data brukes til analytics, app functionality, diagnostics, health/fitness, identifiers osv.

Styrke:

- god indikasjon på appdata
- må kryssjekkes mot privacy policy
- kan være grovkategorisert

### Nivå 3 — Offisiell produkt-/appmanual

Eksempler:

- brukerhåndbok for app
- høreapparatmanual
- supportartikler fra produsent
- offisiell FAQ

Bruk:

- hva brukeren kan se og gjøre
- appfunksjoner
- Bluetooth/tilkobling
- batteri/lading
- fjernsupport
- brukerinnsyn

Styrke:

- sterk for brukeropplevd funksjonalitet
- svakere for bakliggende datainnsamling

### Nivå 4 — Offisiell professional/fitting/remote-care dokumentasjon

Eksempler:

- fitting software documentation
- professional portal documentation
- remote care / teleaudiology documentation
- klinikk-/provider-sider fra produsent

Bruk:

- hva audiograf/klinikk kan se
- datalogging
- remote fitting
- support- og justeringsflyt
- programbruk og brukstid dersom dokumentert

Styrke:

- sterk for klinikk-/audiograffunksjoner
- kan være vanskelig tilgjengelig eller markedsavgrenset

### Nivå 5 — Regulatoriske/offentlige dokumenter

Eksempler:

- CE/FDA-relaterte dokumenter der relevant
- offentlige anskaffelsesdokumenter
- nasjonale helse-/hjelpemiddeldokumenter
- datatilsyns- eller helseregulatoriske kilder

Bruk:

- teknisk og regulatorisk kontekst
- krav og avgrensninger
- markedsspesifikke forhold

Styrke:

- sterk for regulering/klassifisering
- ikke alltid detaljert om produktdata

### Nivå 6 — Fagartikler, konferanser, patentspor

Eksempler:

- peer-reviewed papers
- whitepapers
- konferansepresentasjoner
- patentdokumenter

Bruk:

- trender
- fremtidige datamodeller
- AI/personalisering
- diagnostikk
- prediktiv oppfølging

Styrke:

- nyttig for mulighetsrom
- må ikke forveksles med kommersielt tilgjengelig funksjonalitet

### Nivå 7 — Sekundærkilder og brukerobservasjoner

Eksempler:

- supportforum
- Reddit
- brukerreviews
- YouTube-demonstrasjoner
- teknologiblogger
- uoffisielle guider

Bruk:

- signaler
- hypoteser
- praktiske friksjoner
- spørsmål som bør undersøkes videre

Styrke:

- svak som fakta
- skal ikke brukes alene for eksterne påstander

### Nivå 8 — AI-oppsummeringer

Eksempler:

- ChatGPT/Gemini/Claude-oppsummeringer
- search snippets
- genererte sammendrag uten primærkilder

Bruk:

- idéfase
- søkestrategi
- hjelpe til med å finne kilder

Styrke:

- aldri primærkilde
- skal ikke siteres som dokumentasjon

## 4. Statusmodell per datapunkt

Hvert datapunkt i produsentmatrisen skal ha status.

```text
Ikke undersøkt
Hypotese
Observert i sekundærkilde
Offisiell kilde funnet
Kildebekreftet
Avkreftet
Krever fag-/produsentavklaring
```

### Statusdefinisjoner

#### Ikke undersøkt

Ingen reell research er gjort.

Kan brukes:
- bare som tomt felt / researchbehov

Ekstern bruk:
- nei

#### Hypotese

Plausibel antakelse basert på generell kunnskap eller analogi.

Kan brukes:
- internt
- som researchspørsmål

Ekstern bruk:
- kun som spørsmål, aldri som fakta

Eksempel:

> Vi antar at appen kan sende diagnostikkdata til produsenten, men dette må kildebekreftes.

#### Observert i sekundærkilde

Funnet i forum, brukeromtale, bloggartikkel, video eller annen ikke-offisiell kilde.

Kan brukes:
- som signal
- som grunnlag for videre research

Ekstern bruk:
- normalt nei

#### Offisiell kilde funnet

En relevant primær/offisiell kilde er funnet, men innholdet er ikke ferdig tolket eller kryssjekket.

Kan brukes:
- internt med kilde
- som foreløpig dokumentert observasjon

Ekstern bruk:
- forsiktig, og bare med kilde og usikkerhetsmarkør

#### Kildebekreftet

Påstanden støttes av en relevant, identifiserbar og tilstrekkelig sterk kilde, og formuleringen er avgrenset til det kilden faktisk sier.

Kan brukes:
- internt
- i interessentdialog
- i presentasjon, med kilde eller kildegrunnlag

Ekstern bruk:
- ja, men uten overtolkning

#### Avkreftet

Kilden viser at antakelsen ikke stemmer, eller at funksjonen/datafeltet ikke finnes i den undersøkte konteksten.

Kan brukes:
- internt
- eventuelt eksternt som “vi har ikke funnet støtte for …” hvis relevant

#### Krever fag-/produsentavklaring

Kildene er uklare, motstridende, utilgjengelige eller for tekniske til trygg konklusjon.

Kan brukes:
- som spørsmål i interessentdialog
- som avklaringspunkt mot audiograf/produsent

Ekstern bruk:
- ja, som spørsmål, ikke påstand

## 5. QA-sjekkliste per produsent

For hver produsent skal følgende sjekkes.

```text
Produsent:
Konsern:
Marked/region for kildene:
Dato sjekket:
Researcher:

1. App
- Appnavn:
- Google Play-lenke:
- App Store-lenke:
- Offisiell appside:
- Status:
- Kilder:

2. Privacy / datakategorier
- Privacy policy:
- App privacy notice:
- Google Play Data Safety:
- Apple App Privacy:
- Datakategorier nevnt:
- Formål nevnt:
- Deling/tredjeparter:
- Status:
- Kilder:

3. Brukerinnsyn
- Kan bruker se brukstid?
- Kan bruker se batteri/lading?
- Kan bruker se programbruk?
- Kan bruker se lydmiljøer?
- Kan bruker eksportere data?
- Status:
- Kilder:

4. Fitting software / audiografdata
- Fitting software-navn:
- Datalogging dokumentert?
- Brukstid dokumentert?
- Programbruk dokumentert?
- Lydmiljøklassifisering dokumentert?
- Remote fitting/justering dokumentert?
- Status:
- Kilder:

5. Remote care / support
- Remote care-løsning:
- Hvilke data brukes/sendes?
- Diagnostikk eller connection troubleshooting?
- Supporthistorikk?
- Status:
- Kilder:

6. API / partner / integrasjon
- Åpent API funnet?
- SDK funnet?
- Partnerprogram funnet?
- Klinikk-/enterprise-integrasjoner?
- Status:
- Kilder:

7. Relevans for Viddel
- Kan Viddel samle noe tilsvarende selv?
- Krever dette produsent/klinikkpartner?
- Gir dette individuell hjelp?
- Gir dette aggregert brukerleverage?
- Bør dette vente?
- Risiko/personvern:
- Status:
```

## 6. Tabellmal for produsentmatrise

| Produsent | App | Fitting software | Remote care | Brukerinnsyn | Audiograf-/klinikkdata | App-/skydata | Diagnostikk/datalogging | API/partner | Kildestatus | Viddel-relevans | Kilder |
|---|---|---|---|---|---|---|---|---|---|---|---|
| Phonak / Sonova | Ikke undersøkt | Ikke undersøkt | Ikke undersøkt | Ikke undersøkt | Ikke undersøkt | Ikke undersøkt | Ikke undersøkt | Ikke undersøkt | Ikke undersøkt | Ikke vurdert | |
| Oticon / Demant | Ikke undersøkt | Ikke undersøkt | Ikke undersøkt | Ikke undersøkt | Ikke undersøkt | Ikke undersøkt | Ikke undersøkt | Ikke undersøkt | Ikke undersøkt | Ikke vurdert | |
| ReSound / GN | Ikke undersøkt | Ikke undersøkt | Ikke undersøkt | Ikke undersøkt | Ikke undersøkt | Ikke undersøkt | Ikke undersøkt | Ikke undersøkt | Ikke undersøkt | Ikke vurdert | |
| Widex / WSA | Ikke undersøkt | Ikke undersøkt | Ikke undersøkt | Ikke undersøkt | Ikke undersøkt | Ikke undersøkt | Ikke undersøkt | Ikke undersøkt | Ikke undersøkt | Ikke vurdert | |
| Signia / WSA | Ikke undersøkt | Ikke undersøkt | Ikke undersøkt | Ikke undersøkt | Ikke undersøkt | Ikke undersøkt | Ikke undersøkt | Ikke undersøkt | Ikke undersøkt | Ikke vurdert | |
| Starkey | Ikke undersøkt | Ikke undersøkt | Ikke undersøkt | Ikke undersøkt | Ikke undersøkt | Ikke undersøkt | Ikke undersøkt | Ikke undersøkt | Ikke undersøkt | Ikke vurdert | |
| Unitron / Sonova | Ikke undersøkt | Ikke undersøkt | Ikke undersøkt | Ikke undersøkt | Ikke undersøkt | Ikke undersøkt | Ikke undersøkt | Ikke undersøkt | Ikke undersøkt | Ikke vurdert | |
| Bernafon / Demant | Ikke undersøkt | Ikke undersøkt | Ikke undersøkt | Ikke undersøkt | Ikke undersøkt | Ikke undersøkt | Ikke undersøkt | Ikke undersøkt | Ikke undersøkt | Ikke vurdert | |

## 7. Eksempel på datapunktnivå

Eksempelstruktur, ikke faktisk utfylt produsentfunn:

```text
Datapunkt:
Kan audiograf se daglig brukstid i fitting software?

Produsent:
[Produsentnavn]

Foreløpig formulering:
Kilder indikerer at audiograf kan se datalogging, inkludert brukstid, i fitting software.

Status:
Offisiell kilde funnet / Kildebekreftet / Krever fagavklaring

Kilde:
[Lenke til official professional/fitting documentation]

Ekstern formulering hvis kildebekreftet:
For enkelte produsenter dokumenteres datalogging i audiografens fitting software, blant annet knyttet til bruk og innstillinger. Det konkrete innholdet varierer mellom produsent og system.

Ikke si:
Alle audiografer kan se nøyaktig hvor mye alle høreapparater brukes.
```

## 8. Regler for ekstern bruk

### Trygt å si eksternt når kildebekreftet

- “Produsenten oppgir i sin app-personvernerklæring at appen kan samle [datakategori].”
- “I offisiell dokumentasjon beskrives remote-care-funksjonalitet for [produkt/system].”
- “Det finnes dokumenterte fitting-/dataloggingfunksjoner i enkelte produsenters profesjonelle systemer.”

### Trygt å si som hypotese/spørsmål

- “Vi ønsker å undersøke hvilke datatyper audiografer faktisk ser i praksis.”
- “Vi tror det kan finnes verdifulle mønstre i brukstid, frafall og supportbehov, men dette må undersøkes med fagpersoner og produsenter.”
- “Et viktig spørsmål er hva brukeren selv bør ha innsyn i og kontroll over.”

### Ikke si eksternt uten sterk kilde

- “Produsentene samler X på tvers av alle brukere.”
- “Audiografer kan alltid se Y.”
- “Viddel kan hente apparatdata direkte.”
- “Vi kan integrere med produsentdata.”
- “Denne typen data er enkel å få tilgang til.”

## 9. Kildekrav for presentasjon

Før et funn brukes i presentasjon:

1. Det må ha minst én identifiserbar kilde.
2. Kilden må være relevant for markedet/funksjonen vi omtaler.
3. Påstanden må formuleres smalere enn eller likt med kilden.
4. Kildestatus må være “Kildebekreftet” eller tydelig markert som hypotese/spørsmål.
5. Sensitivitet/personvern må vurderes.
6. Det må være klart om funnet gjelder brukerapp, produsentsky, klinikksoftware eller Viddel selv.

## 10. Hvordan Deep Research-resultater skal behandles

Når Deep Research fra #116 er ferdig:

1. Ikke bruk resultatet direkte eksternt.
2. Trekk ut alle produsentpåstander.
3. Legg dem inn i produsentmatrisen.
4. Merk hvert datapunkt med status.
5. Finn primærkilder der researchen bare har sekundærkilder.
6. Skriv om funn til nøkterne, kildeavgrensede formuleringer.
7. Lag egen liste over spørsmål til audiograf/produsent.

## 11. Kildebibliografi-mal

```text
Kilde-ID:
Produsent:
Tittel:
URL:
Kildetype:
Publisert / sist oppdatert:
Marked/region:
Hva kilden støtter:
Hva kilden ikke støtter:
Relevante sitater / utdrag:
Kildestyrke:
Bruksstatus:
```

Kildestyrke:

```text
Sterk
Middels
Svak
Kun signal
```

Bruksstatus:

```text
Kan brukes eksternt
Kan brukes internt
Kun researchsignal
Ikke bruk
```

## 12. Første anbefalte QA-runde

Første QA-runde bør være liten:

1. Velg tre produsenter:
   - Phonak / Sonova
   - Oticon / Demant
   - ReSound / GN
2. Finn app, privacy policy, Google Play Data Safety og App Store App Privacy.
3. Finn én professional/fitting/remote-care-kilde per produsent hvis mulig.
4. Fyll bare de feltene som har kilder.
5. Marker resten som “Ikke undersøkt” eller “Krever avklaring”.

Mål:

> Lære hvor lett eller vanskelig det er å kildebelegge produsentdata før vi fyller hele matrisen.

## 13. Kobling til Viddel-strategi

Kilde-QA skal støtte Viddels langsiktige posisjon uten å svekke tillit.

Viktig strategisk formulering:

> Viddel skal ikke fremstå som en aktør som vil hente ut data fra brukere. Viddel skal undersøke hvordan data som oppstår gjennom hjelp, og eventuelt senere gjennom partnerskap, kan gi brukerne bedre støtte og større kollektiv synlighet.

## 14. Åpne spørsmål

- Hvilke produsentdata er faktisk tilgjengelige i Norge/EU?
- Hvilke data ser norske audiografer i praksis?
- Hvilke data har brukeren selv rett til innsyn i?
- Hvilke data er teknisk tilgjengelige, men strategisk ukloke å bruke?
- Hvilke datapunkter kan gi mest brukerleverage med lavest personvernrisiko?
- Hvilke påstander må avklares direkte med produsent?
- Hvilke påstander bør valideres med audiograf først?

## 15. Neste steg

1. Kjør Deep Research med prompten i `VIDDEL_DEEP_RESEARCH_PROMPT_MANUFACTURER_DATA_v0_1.md`.
2. Bruk dette notatet til å klassifisere funnene.
3. Lag første kilde-QA-et produsentmatrise for tre produsenter.
4. Lag en kort presentasjonsversjon først etter at status er tydelig.
