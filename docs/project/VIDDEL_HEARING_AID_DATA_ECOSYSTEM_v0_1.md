# VIDDEL Hearing Aid Data Ecosystem v0.1

Status: Strategisk notat / research-ramme  
Dato: 2026-05-10  
Koblet til: #114, #99, #102, #103  
Scope: Post-MVP / langsiktig økosystemspor  

## 1. Formål

Dette notatet beskriver det langsiktige mulighetsrommet for Viddel som et brukerorientert innsiktslag på tvers av høreapparat-økosystemet.

MVP-en skal ikke bygge produsentintegrasjoner eller samle omfattende apparatdata. MVP-en skal først teste om Viddel hjelper brukere i konkrete situasjoner, og om en enkel, samtykkebasert state kan gi bedre hjelp.

Det langsiktige spørsmålet er større:

> Hvordan kan Viddel bidra til at hørselshemmede, på tvers av produsenter, apparater, apper, klinikker og offentlige løp, får samlet innsikt nok til å skape bedre hjelp, bedre produkter, bedre oppfølging og større påvirkningskraft?

Dette notatet skal brukes som grunnlag for videre research, interessentdialog og strategisk posisjonering.

## 2. Strategisk tese

Viddel kan på sikt bli et brukerorientert innsiktslag i høreapparat-økosystemet.

Det betyr ikke at Viddel skal hente ut mest mulig data. Det betyr at Viddel skal undersøke hvilke data som kan samles, med samtykke og tydelig brukerformål, slik at hørselshemmede som gruppe får mer synlighet og større innflytelse.

Arbeidsformulering:

> Data samles fordi det hjelper brukeren, og fordi aggregerte mønstre kan gi brukergruppen større innflytelse i økosystemet.

Dette gir Viddel en mulig rolle mellom:

- brukere og pårørende
- audiografer og klinikker
- produsenter
- NAV/stat/offentlig sektor
- HLF og interesseorganisasjoner
- forsknings- og innovasjonsmiljøer
- funding- og støtteordninger

## 3. Hvorfor dette er viktig

Høreapparatmarkedet er fragmentert.

Brukeren møter ofte:

- ett apparat fra én produsent
- én app
- én klinikk eller audiograf
- ett offentlig støtteforløp
- én individuell opplevelse av mestring eller frafall

Mye innsikt finnes, men den ligger spredt:

- hos produsentene
- i klinikk- og fitting-systemer
- i appdata
- hos audiografer
- i NAV/statlige ordninger
- i brukerens egen erfaring
- i pårørendes observasjoner
- i interesseorganisasjonenes kontakt med brukergruppen

Viddel kan starte med hjelp i konkrete situasjoner og gradvis bygge et strukturert, samtykkebasert innsiktsgrunnlag.

Langsiktig verdi:

```text
Individuell hjelp
→ strukturert mestringsdata
→ aggregerte mønstre
→ bedre produkter, bedre oppfølging og større brukerleverage
```

## 4. Økosystemkart v0.1

### Bruker

Har den faktiske hverdagsopplevelsen:

- fungerer apparatet i dag?
- brukes det daglig, av og til eller nesten ikke?
- hvilke situasjoner skaper friksjon?
- hva gjør at apparatet havner i skuffen?
- hva gir mestring og lydglede?

### Pårørende / hjelper

Ser ofte mønstre brukeren selv ikke formulerer:

- sosial tilbaketrekning
- samtaler som glipper
- frustrasjon rundt teknologi
- behov for støtte uten press

### Audiograf / klinikk

Har faglig oppfølging og ofte tilgang til mer teknisk informasjon:

- fitting-data
- datalogging
- programbruk
- justeringshistorikk
- kliniske vurderinger
- servicehistorikk

### Produsent

Eier apparat, app, firmware, skyplattform og ofte remote-care-løsninger.

Kan potensielt ha innsikt i:

- apparatmodell og firmware
- appbruk
- tilkoblingsproblemer
- remote support
- produktfeil og friksjon
- aggregerte mønstre på tvers av brukere

### NAV / offentlig sektor

Har ansvar for ordninger, innkjøp, støtte og rammevilkår.

Mulig interesse:

- effekt av støtteordninger
- frafall/underbruk
- samfunnsøkonomisk effekt
- behov for bedre oppfølging
- prioritering av tiltak

### Interesseorganisasjoner

Kan bruke aggregerte mønstre til:

- politisk påvirkning
- dokumentasjon av behov
- bedre rådgivning
- kampanjer
- samarbeid med produsenter og offentlig sektor

### Viddel

Kan bli et brukerorientert bindeledd:

- hjelper brukeren i øyeblikket
- strukturerer erfaringer
- måler hva som hjelper
- viser aggregerte mønstre
- styrker brukergruppens stemme

## 5. Teknisk datatilgang: hovedhypotese

Moderne høreapparater er normalt ikke direkte på nett som en telefon eller bil.

Sannsynlig hovedmodell:

```text
Høreapparat
→ Bluetooth / Bluetooth LE
→ mobilapp
→ produsentens sky / remote-care-plattform
→ eventuell klinikk-/audiografflate
```

Andre relevante spor:

- fitting software hos audiograf
- remote care / teleaudiology
- appens personvernerklæring og datainnsamling
- klinikkens dokumentasjon og journal-/oppfølgingssystem
- produsentens partnerprogrammer eller API-er, hvis de finnes

Direkte IoT via Wi‑Fi eller mobilnett i selve høreapparatet bør ikke antas som standardmodell uten kilde.

## 6. Produsentmatrise for research

Denne matrisen skal brukes for å kartlegge hvordan produsentene arbeider med data.

Aktuelle produsenter:

- Phonak / Sonova
- Oticon / Demant
- ReSound / GN
- Widex / WSA
- Signia / WSA
- Starkey
- Unitron
- Bernafon
- eventuelt flere relevante aktører

Research-mal:

```text
Produsent:
App-navn:
Fitting software:
Remote care-løsning:
Kan bruker se bruksdata?
Kan audiograf se datalogging?
Synkes data til sky?
Hvilke datakategorier nevnes i privacy policy?
Finnes brukerdata-eksport?
Finnes API / partnerprogram?
Finnes klinikk-/dashboard-løsning?
Relevans for Viddel:
Risiko / personvern:
Kilder:
Status: ukjent / observert / kildebekreftet / verifisert
```

Viktig: Denne matrisen må kilde-QA-es før den brukes eksternt.

## 7. Mulige datakategorier

### 7.1 Apparat- og teknisk data

Mulige datapunkter:

- apparatmerke
- modell
- serienummer
- firmwareversjon
- app-versjon
- telefonmodell / OS
- batterinivå
- lading / ladehistorikk
- tilkoblingsstatus
- Bluetooth-feil
- service-/supporthendelser

Relevans:

- teknisk feilsøking
- identifisere kjente problemer
- se mønstre per merke/modell
- redusere tid til riktig hjelp

### 7.2 Bruksdata

Mulige datapunkter:

- daglig brukstid
- antall dager brukt siste uke/måned
- programbruk
- volumjusteringer
- streamingbruk
- hvor ofte apparatet er i lader/etui
- tegn på lav eller avbrutt bruk

Relevans:

- oppdage frafall
- forstå underbruk
- se om tiltak øker faktisk bruk
- skille mellom teknisk problem og mestringsproblem

### 7.3 Lydmiljø og situasjonsdata

Mulige datapunkter:

- stille miljø
- tale i støy
- musikk
- vind
- transport
- restaurant/støy
- streaming
- endringer mellom miljøer

Relevans:

- forstå hvor apparatet fungerer eller ikke fungerer
- knytte problemer til situasjoner
- forbedre guider og AI-svar
- synliggjøre hverdagsfriksjon

Risiko:

- kan nærme seg livsmønsterdata
- bør behandles som sensitivt i praksis
- bør bare brukes aggregert eller med tydelig brukerformål

### 7.4 Klinikk-/fitting-data

Mulige datapunkter:

- datalogging fra apparatet
- tilpasningshistorikk
- programoppsett
- gain/innstillinger
- audiografnotater
- justeringer over tid
- remote-care-hendelser

Relevans:

- bedre overgang mellom digital hjelp og menneskelig hjelp
- mer presis oppfølging
- bedre dokumentasjon før audiografkontakt

Risiko:

- høyere personvern- og helsedatakrav
- krever partnerskap og juridisk avklaring
- ikke MVP-scope

### 7.5 Viddel-hjelpedata

Dette er datapunkter Viddel kan samle selv, med samtykke og klart formål:

- merke/modell valgt av bruker
- brukerfase
- bruksstatus: daglig / av og til / ligger mest i skuffen
- problemkategori
- valgt guide
- seed-spørsmål klikket
- AI-svar vist
- prøvd steg
- hjalp / hjalp ikke
- problem løst
- menneskelig hjelp trengs
- frafallsårsak
- opplevd mestring

Dette er det mest realistiske første datagrunnlaget.

## 8. Tre nivåer av datamulighet

### Nivå A — MVP-data: Viddel kan samle selv

Kjennetegn:

- direkte knyttet til hjelpesituasjonen
- brukeren forstår hvorfor vi spør
- kan forklares i enkelt språk
- krever ikke produsentintegrasjon

Eksempler:

- hvilket apparat brukeren har
- hva de prøver å løse
- hvilken guide de bruker
- om rådet hjalp
- om de trenger audiograf
- hva de allerede har prøvd

Bruk:

- bedre hjelp til samme bruker
- enkle mestringsloop
- første effektmåling
- prioritere innhold og AI-svar

### Nivå B — Post-MVP-data: strukturert brukerstate og mestring

Kjennetegn:

- mer kontinuitet over tid
- mulig “Mine sider light”
- sterkere samtykke- og forklaringsbehov

Eksempler:

- lagret apparatmodell
- prøvde guider
- tilbakevendende problemer
- bruksstatus over tid
- mestringssteg
- restart-/frafallsreise

Bruk:

- bedre personlig oppfølging
- enklere rapport til audiograf
- måle hva som faktisk hjelper
- dokumentere mønstre i frafall og mestring

### Nivå C — Partner-/produsentdata

Kjennetegn:

- krever produsent, klinikk, app eller remote-care-integrasjon
- må ha tydelig juridisk og teknisk ramme
- bør først vurderes etter validering av MVP og brukerbehov

Eksempler:

- faktisk apparatbrukstid
- programbruk
- lydmiljøklassifisering
- firmware-/diagnostikkdata
- audiografens datalogging
- remote-care-historikk

Bruk:

- bedre økosysteminnsikt
- mer presis feilsøking
- produsentfeedback
- klinikkoppfølging
- forskning og samfunnsinnsikt

## 9. Brukerleverage: strategisk posisjon

Viddel bør formulere datarollen som en brukerinteresse, ikke som datainnsamling.

Mulig posisjon:

> Viddel hjelper enkeltbrukere i konkrete situasjoner. Når mange brukere får hjelp, kan aggregerte mønstre vise hvor systemet fungerer, hvor det svikter, og hva som bør forbedres.

Dette kan gi brukergruppen mer leverage:

- overfor produsenter: hvilke problemer gjentar seg?
- overfor klinikker: hvor trenger brukerne mer oppfølging?
- overfor NAV/stat: hvor virker støtteordningen ikke godt nok i praksis?
- overfor interesseorganisasjoner: hvilke behov bør løftes politisk?
- overfor forskning: hvilke mønstre bør undersøkes videre?

Viktig premiss:

> Brukerens tillit er viktigere enn datamengden.

## 10. Personvern- og samtykkeprinsipper

Følgende prinsipper bør gjelde:

1. Data skal samles fordi det hjelper brukeren.
2. Brukeren skal forstå hvorfor et datapunkt spørres om.
3. Frivillighet må være reell.
4. Sensitive mønstre skal ikke brukes uten tydelig formål.
5. Fritekst og samtalelogger skal ikke lagres som standard.
6. Aggregerte mønstre skal ikke kunne føres tilbake til enkeltpersoner.
7. Produsent-/klinikkdata krever egen juridisk og teknisk vurdering.
8. Brukeren bør kunne se, rette og slette egne data der det er relevant.
9. Det skal være tydelig hva som er individuell hjelp og hva som er aggregert innsikt.
10. Innsiktsverdien skal komme brukergruppen til gode.

## 11. Bruk i interessentdialog

Dette sporet bør brukes som langsiktig mulighetsrom, ikke som MVP-løfte.

### Overfor interesseorganisasjoner

Vektlegg:

- kollektiv brukerinnsikt
- dokumentasjon av behov
- frafall/underbruk
- brukerens stemme i økosystemet

### Overfor audiografer / klinikker

Vektlegg:

- bedre forberedte brukere
- tydeligere problemhistorikk
- færre diffuse henvendelser
- bedre overgang mellom digital hjelp og menneskelig hjelp

### Overfor produsenter

Vektlegg:

- mønstre i brukerfriksjon
- bedre innsikt i hverdagsbruk
- tidlig signal om app-/Bluetooth-/komfortproblemer
- brukeropplevelse på tvers av apparat og support

### Overfor NAV/stat/offentlig sektor

Vektlegg:

- underbruk og frafall
- effekt av oppfølging
- samfunnsøkonomisk relevans
- bedre beslutningsgrunnlag for støtteordninger

### Overfor fundingaktører

Vektlegg:

- skalerbar innsikt
- samfunnsverdi
- datagrunnlag som springer ut av hjelp
- personvern som premiss

## 12. Anbefalt rekkefølge etter MVP

### Fase 1 — MVP: hjelp og første state

- samle bare Viddel-hjelpedata
- teste problemkategorier
- teste “hjalp / hjalp ikke”
- teste bruksstatus-språk
- teste enkel mestringsstate

### Fase 2 — Post-MVP: personlig nytte

- Mine sider light
- lagret apparatmodell
- prøvde guider
- enkel rapport til audiograf
- tydelig samtykke

### Fase 3 — Aggregert innsikt

- problemkart
- frafallsmønstre
- hvilke guider som hjelper
- hvilke problemer som krever menneskelig hjelp
- anonymisert innsiktsrapport

### Fase 4 — Partnerdialog

- produsenter
- klinikker
- HLF/interesseorganisasjoner
- NAV/stat
- forskningsmiljøer

### Fase 5 — Integrasjoner

- vurdere API/partnerprogram
- vurdere klinikk-/remote-care-data
- vurdere apparatdata bare der brukerformål, samtykke og nytte er tydelig

## 13. Åpne spørsmål

1. Hvilke produsenter gir brukeren innsyn i egen bruksdata?
2. Hvilke data ser audiograf i fitting software?
3. Finnes det eksport eller API for brukerdata?
4. Hvordan håndterer produsentene samtykke i remote-care-løsninger?
5. Hvilke data er realistisk tilgjengelig i Norge?
6. Hva vil HLF eller andre interesseorganisasjoner se som legitim databruk?
7. Hva vil NAV/stat ha nytte av uten at Viddel blir et kontrollsystem?
8. Hva er minste datasett som kan gi brukergruppen mer kollektiv synlighet?
9. Hva bør aldri samles av Viddel, selv om det teknisk er mulig?
10. Hvordan forklarer vi dette slik at det bygger tillit?

## 14. Første research-oppgave

Lag en produsentmatrise basert på offentlige kilder:

- app-personvernerklæringer
- Google Play / App Store data safety
- appmanualer
- fitting software-dokumentasjon
- remote-care-sider
- produsentenes privacy portals
- eventuelle API-/partnerprogrammer

Første output bør være en kilde-QA-et tabell, ikke en ekstern påstand.

## 15. Kort formulering til samtale

> Viddel starter med å hjelpe enkeltbrukere i konkrete situasjoner. På sikt kan de samme hjelpesituasjonene, med samtykke og aggregert på riktig måte, gi et innsiktsgrunnlag som viser hvor høreapparat-økosystemet faktisk fungerer og hvor brukerne faller fra. Det kan gi hørselshemmede som gruppe mer synlighet og større påvirkningskraft overfor produsenter, klinikker og offentlige aktører.

## 16. Ikke-mål

Dette notatet betyr ikke at Viddel skal:

- samle apparatdata i MVP
- bygge produsentintegrasjoner nå
- lage API-prototype nå
- love tilgang til produsentdata
- lagre helsedata uten samtykke
- selge individuelle brukerdata
- bygge dashboard før brukerbehov og datagrunnlag er validert

## 17. Kobling til eksisterende arbeid

Dette notatet bør kobles til:

- #99 Privacy-first effektmåling, state og datagrunnlag
- #102 Lavterskel interessentdialog
- #103 Seksukersplan
- #105 Arkitektur-beslutningsport
- #114 Long-term hearing aid data ecosystem and user leverage
- Core Pack / pitchgrunnlag
- fremtidig interessentdialog med HLF, audiografer, produsenter og offentlig sektor
