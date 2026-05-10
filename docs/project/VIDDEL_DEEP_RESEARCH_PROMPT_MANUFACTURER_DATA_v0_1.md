# VIDDEL Deep Research Prompt — Manufacturer Data & Diagnostics Landscape v0.1

Status: Copy-ready Deep Research prompt  
Dato: 2026-05-10  
Koblet til: #116, #115, #114, #99, #102, #103  
Bruk: Start en egen Deep Research-tråd og lim inn prompten under.  

---

## Kopiklar prompt

```text
Du skal gjennomføre en grundig, kildebasert Deep Research-analyse for Viddel.

Kontekst:
Viddel er en norsk hjelpetjeneste under utvikling for høreapparatbrukere. MVP-en handler først om innhold, AI-hjelp, mestringsloop, Mine sider light og samtykkebasert brukerstate. Denne researchen handler ikke om MVP-funksjonalitet, men om det langsiktige mulighetsrommet etter MVP.

Strategisk tese:
Viddel kan på sikt bli et brukerorientert innsiktslag på tvers av høreapparat-økosystemet. Data skal forstås som en kollektiv brukerressurs, ikke som råvare. Målet er å undersøke hvordan aggregerte, samtykkebaserte mønstre kan gi hørselshemmede større synlighet og påvirkningskraft overfor produsenter, audiografer, klinikker, NAV/offentlig sektor, interesseorganisasjoner og forskningsmiljøer.

Viktig avgrensning:
Ikke anta at Viddel har tilgang til produsentdata. Skill strengt mellom:
1. Data Viddel kan samle selv gjennom brukerens hjelpesituasjon.
2. Data som kan finnes i produsentens app/sky.
3. Data som kan finnes i audiografens fitting software eller klinikksystem.
4. Data som bare kan nås gjennom partnerskap, API, remote-care-løsninger eller direkte produsentavtaler.
5. Data som teknisk kan finnes, men som ikke bør brukes uten sterk samtykke-, personvern- og nyttevurdering.

Hovedspørsmål:
Hvordan arbeider moderne høreapparatprodusenter med datainnsamling, apparatdiagnostikk, remote care, app-/skydata, datalogging og videreutvikling av digital oppfølging — og hvilke muligheter, begrensninger og risikoer gir dette for Viddel på lengre sikt?

Produsenter som skal undersøkes:
- Phonak / Sonova
- Oticon / Demant
- ReSound / GN Hearing
- Widex / WS Audiology
- Signia / WS Audiology
- Starkey
- Unitron / Sonova
- Bernafon / Demant
- Andre relevante produsenter dersom de fremstår viktige i kildene

Research-spørsmål:

1. Teknisk arkitektur og dataflyt
- Hvordan kobler moderne høreapparater seg til digitale systemer?
- Går data primært via Bluetooth/BLE til mobilapp og derfra til sky?
- Finnes eksempler på direkte IoT/Wi‑Fi/cellular i høreapparater, eller er dette unntak?
- Hvordan skiller dataflyten seg mellom brukerapp, produsentsky, remote-care-løsning og audiografens fitting software?

2. App- og skydata
- Hvilke data oppgir produsentene at appene samler?
- Hvilke datakategorier fremgår av privacy policies, app privacy notices, Google Play Data Safety og App Store App Privacy?
- Samles appaktivitet, enhets-ID-er, diagnostikk, helse-/wellnessdata, lokasjon, brukerinnhold, lydrelaterte data eller tekniske logger?
- Hvordan beskrives formålene: support, produktforbedring, personalisering, remote care, analytics, research, marketing?

3. Fitting software og klinikkdata
- Hvilke produsenter tilbyr fitting software, datalogging eller professional dashboards?
- Hvilke data kan audiograf/klinikk typisk se?
- Finnes dokumentasjon på brukstid, programbruk, lydmiljøklassifisering, justeringshistorikk, feilkoder, firmware eller remote-care-hendelser?
- Hva er offentlig dokumentert, og hva krever direkte fag-/produsentavklaring?

4. Remote care og diagnostikk
- Hvilke produsenter tilbyr remote care / teleaudiology / remote fitting?
- Hvilke data sendes eller brukes i slike løsninger?
- Finnes det dokumentert apparatdiagnostikk, connection diagnostics, firmware health, troubleshooting logs eller supportdata?
- Hvordan brukes data til oppfølging, feilsøking eller justering?

5. Brukerinnsyn og brukerdata
- Hvilke data kan brukeren selv se i appen?
- Kan brukeren se brukstid, batteri, programbruk, lydmiljøer, helse-/wellnessindikatorer eller tilkoblingsstatus?
- Finnes det eksport av egne data?
- Hvordan håndteres samtykke, sletting, retting og innsyn?

6. AI, personalisering og fremtidige datamodeller
- Hvordan bruker produsentene AI, maskinlæring eller automatisert personalisering i dag?
- Finnes signaler om videreutvikling innen predictive maintenance, selvdiagnostikk, appbasert veiledning, automatisk miljøtilpasning, digital phenotyping, health tracking eller datadrevet hearing care?
- Skill mellom produktmarkedsføring, kildebekreftet funksjonalitet og forsknings-/patentspor.

7. Åpne API-er og partnerprogrammer
- Finnes åpne API-er, SDK-er, partnerprogrammer eller integrationsspor?
- Finnes dokumentasjon for tredjepartsutviklere?
- Er integrasjon primært rettet mot klinikk/enterprise, eller også mot forbruker-/helseapper?
- Hva virker realistisk for en aktør som Viddel etter MVP?

8. Personvern, samtykke og regulatoriske rammer
- Hvilke personvernrisikoer følger av de ulike datakategoriene?
- Hvilke data kan være særlig sensitive, selv om de ikke alltid beskrives som helseopplysninger?
- Hva bør behandles ekstra varsomt i EU/Norge/GDPR-kontekst?
- Hvilke datatyper bør Viddel ikke samle selv i tidlig fase?

9. Viddel-relevans
Vurder for hver datakategori:
- Kan Viddel samle dette selv uten produsentintegrasjon?
- Krever det produsent/app/klinikk-partnerskap?
- Krever det eksplisitt samtykke og sterk brukerforklaring?
- Kan det gi individuell hjelp?
- Kan det gi aggregert brukerleverage?
- Bør det vente til etter MVP?

Kildekrav:
Bruk primærkilder først. Prioriter:
1. Produsentens offisielle privacy policy / app privacy notice
2. Google Play Data Safety og Apple App Store App Privacy
3. Offisielle appmanualer og brukermanualer
4. Offisiell fitting software-, professional- eller remote-care-dokumentasjon
5. Produsentens professional/clinic-sider
6. Regulatoriske dokumenter og offentlige dokumenter
7. Fagartikler, konferansepresentasjoner og patentspor når relevant
8. Brukerforum, Reddit, supporttråder og anmeldelser kun som signaler, ikke som fakta
9. AI-oppsummeringer skal aldri brukes som primærkilde

Kildehåndtering:
- Oppgi kilde for hver viktig påstand.
- Skil tydelig mellom “kildebekreftet”, “indikasjon”, “hypotese”, “uklart” og “krever produsent-/fagavklaring”.
- Ikke fyll hull med antakelser.
- Når kildene er uklare, skriv hva som må undersøkes videre.
- Ta med publiseringsdato eller sist oppdatert dato der det finnes.
- Vurder om kilden gjelder globalt, EU, USA, Norge eller spesifikt marked.

Output-format:

Start med en kort executive summary på maks 10 punkter:
- hva er mest sikkert?
- hva er mest strategisk viktig?
- hva bør Viddel ikke anta?
- hva bør undersøkes videre?

Deretter lever følgende seksjoner:

1. Oversikt: hvordan data typisk flyter i moderne høreapparat-økosystemer
Lag gjerne enkel tekstmodell:
Høreapparat → Bluetooth/BLE → mobilapp → produsentsky / remote care → klinikk/fitting software.
Marker hva som er hovedmodell og hva som er usikkert.

2. Produsentmatrise
Lag en tabell med én rad per produsent og følgende felt:
- Produsent / konsern
- App(er)
- Fitting software
- Remote care-løsning
- Brukerinnsyn i data
- Audiograf-/klinikkdata
- Sky/app-data nevnt i privacy policy
- Diagnostikk / datalogging / supportdata
- API / partnerprogram
- Kildestatus
- Relevans for Viddel
- Kilder

3. Datakategorimatrise
Lag tabell:
- Datakategori
- Eksempler
- Hvor data kan oppstå
- Hvem kan typisk se den
- Kildegrunnlag
- Personvernrisiko
- Viddel-relevans
- MVP / post-MVP / partnernivå

4. Produsentprofiler
Kort profil per produsent:
- hva er dokumentert?
- hva virker strategisk interessant?
- hva er uklart?
- hva bør avklares direkte med produsent eller fagperson?

5. Trender og mulighetsrom
Beskriv trender innen:
- appbasert support
- remote fitting / remote care
- datalogging
- diagnostikk
- AI/personalisering
- prediktiv support / maintenance
- aggregerte innsikter og brukerleverage

6. Relevans for Viddel
Skill mellom:
A. Viddel kan gjøre selv etter MVP
B. Krever brukerens manuelle input
C. Krever produsent-/klinikkpartnerskap
D. Bør bare brukes aggregert
E. Bør unngås eller vente

7. Personvern og tillit
Gi anbefalte prinsipper for Viddel:
- data som konsekvens av hjelp
- samtykke
- dataminimering
- brukerinnsyn
- aggregert innsikt
- unngå fritekst/samtalelogger som standard
- ikke love mer datatilgang enn vi har

8. Interessentdialog
Gi forslag til hvordan funnene kan brukes i samtaler med:
- lokale Hørselsforbundet-lag
- audiografer
- ØNH / hørselsrehabilitering
- hjelpemiddeltjeneste/NAV/offentlig sektor
- produsenter
- fundingaktører

9. Uavklarte spørsmål og neste research-steg
List opp hva som bør sjekkes manuelt, med produsent, med audiograf eller gjennom praktisk app-test.

10. Kildebibliografi
Samle alle kilder med lenker og kort notat om hva hver kilde støtter.

Viktig stil:
Skriv nøkternt og etterrettelig. Ikke overdriv. Ikke skriv pitch. Skill mellom nåsituasjon, plausibel utvikling og strategisk mulighetsrom.

Sluttproduktet skal kunne brukes til:
- oppdatering av produsentmatrise
- kilde-QA før ekstern presentasjon
- Viddel Core Pack / pitchgrunnlag
- interessentdialog
- videre strategiarbeid etter MVP
```

---

## Bruksnotat

Når researchen er ferdig, bør resultatet ikke brukes direkte eksternt. Først bør det kondenseres inn i:

1. produsentmatrisen med kildestatus
2. en kort intern strategisyntese
3. en forsiktig presentasjonsversjon for norske interessenter
4. eventuelle oppdateringer til Core Pack / pitchgrunnlag

Relevant GitHub-spor:

- #114 — Long-term hearing aid data ecosystem and user leverage v0.1
- #115 — Source QA for hearing aid manufacturer data matrix v0.1
- #116 — Deep research prompt for manufacturer data and diagnostics landscape v0.1
- #117 — Stakeholder validation presentation for Norwegian hearing ecosystem v0.1
