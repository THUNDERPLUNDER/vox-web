# Viddel Conversation Area UX Copy — Current Best Answer v0.1

Status: Godkjent UX-copy-CBA før visuell retning og UI-implementering
Eier: Thomas
Forelder: `docs/project/VIDDEL_CONVERSATION_AREA_LAYOUT_CBA_v0_2.md`
Relatert GitHub-sak: #283
Copy-review: `docs/design/prototypes/viddel-conversation-area-copy-review-v0_1.html`
Sist oppdatert: 2026-07-31

## 1. Dokumentets rolle

Dette dokumentet beslutter brukerrettede begreper og UX-copy for det
innloggede samtaleområdet.

Det gjelder:

- full samtaleoversikt
- kompakt samtalevalg på desktop
- mobiloversikt og mobil tilbake
- aktiv og ny samtale
- tom samtalehistorikk
- samtaletitler, utdrag, kronologi og artikkelopprinnelse
- Composer- og systemcopy som skal gjenbrukes fra `/no/chat`

Layout-CBA v0.2 styrer fortsatt struktur, komponentgrense og responsive states.
Denne copy-CBA-en beslutter ikke produksjonslogikk, visuelle tokens eller UI-kode.

## 2. Språkretning

Copyen skal være kort, direkte og menneskelig. Den skal ikke forklare handlinger
som allerede er synlige i flaten.

Arbeidsregler:

- én tekstlinje gjør helst én jobb
- unngå oppramsing av hele Viddel-domenet
- unngå symmetriske formuleringer som bare gjentar to synlige handlinger
- bruk «eller» når et reelt valg må forklares, ikke som standard setningsbygning
- behold naturlige småord når alternativet blir telegramspråk
- foretrekk gjenkjennelig brukerspråk framfor polerte emneknagger
- hjelpetekst skal løse et faktisk orienteringsproblem

Eksempel på copy som utelates:

> Finn igjen eller fortsett en tidligere samtale.

Overskrift, liste og handling gjør allerede denne jobben.

## 3. Begrepsmodell

| Funksjon | Brukerrettet begrep |
| --- | --- |
| Hele området | Samtaler |
| Full overskrift | Samtalene dine |
| Ny tråd | Ny samtale |
| Eksisterende tråd | Samtale |
| Mobil tilbake | Samtaler |
| Artikkelopprinnelse | Fra artikkelen «…» |

«Historikk», «chat», «dialog» og «tråd» skal ikke brukes som parallelle
hovedbegreper i denne flaten. Ordene kan fortsatt forekomme internt eller i
etablert tilgjengelighetscopy der de har en presis funksjon.

## 4. Copy per state

### 4.1 Full samtaleoversikt

- overskrift: `Samtalene dine`
- forklarende tekst: ingen
- handling: `Ny samtale`

Hvis senere brukervalidering avdekker behov for støttetekst, er første
kontrollvariant `Fortsett der du slapp.` Den er ikke del av v0.1-CBA-en.

### 4.2 Kompakt desktop

- områdeoverskrift: `Samtaler`
- handling: `Ny samtale`

Samtalelisten beholder de samme titlene og samme kronologi som full oversikt.

### 4.3 Mobiloversikt

- overskrift: `Samtalene dine`
- ny samtale: plussikon med tilgjengelig navn `Ny samtale`

Ikonet sparer plass i mobilhodet. Det tilgjengelige navnet skal ikke forkortes.

### 4.4 Mobil tilbake

- synlig label: `Samtaler`
- tilgjengelig navn: `Tilbake til samtaler`

### 4.5 Ny samtale

- overskrift: `Ny samtale`
- forklarende tekst: ingen
- Composer-placeholder: `Hva lurer du på?`
- skjult input-label: `Skriv spørsmål til Viddel`
- send-handling: `Send spørsmål`

Det skal ikke stå en ekstra invitasjon over Composer når overskrift og
placeholder allerede gjør oppgaven.

### 4.6 Tom samtalehistorikk

- områdeoverskrift: `Samtalene dine`
- tomtilstandsoverskrift: `Start en samtale med Viddel`
- forklarende tekst: ingen
- handling: `Start samtale`

Tomtilstanden beskriver neste handling. Den leder ikke med at systemet mangler
innhold.

### 4.7 Aktiv samtale

Samtalehodet viser:

- samtaletittel
- eventuell artikkelopprinnelse

`Sist aktiv …` utelates. På desktop gjentar det informasjon fra listen. På
mobil gir det normalt ikke hjelp til neste handling.

## 5. Samtaletitler

Tittelen skal først og fremst hjelpe brukeren å kjenne igjen sin egen samtale.

Prinsipper:

- ta utgangspunkt i brukerens egen formulering
- rediger minst mulig
- tillat spørsmål, førsteperson og setningsfragmenter
- ikke gjør alle titler om til pene substantivfraser
- ikke legg til «Samtale om …»
- ikke krev samme grammatikk eller lengde i alle titler
- bruk `Samtale` som nøktern fallback når meningsbærende tekst mangler
- bruk ikke `Uten tittel`

Eksempler:

- `Appen finner ikke høreapparatet`
- `Lyden blir skarp på restaurant`
- `Hva skjer på hørselstesten?`
- `Hva bør jeg ta opp med audiografen?`
- `Musikk låter flatt med de nye apparatene`
- `Jeg hører en lyd som andre ikke hører`

Titler kan bruke inntil to linjer i full oversikt, kompakt desktop og mobil.
Visuell avkorting kan brukes etter to linjer. Det skal ikke innføres en streng
ordgrense som presser språket mot genererte emneknagger.

Dette er et prototypeprinsipp. Produksjonslogikk for tittelgenerering besluttes
ikke her og skal revideres når Viddel har erfaring fra faktisk bruk.

## 6. Utdragslinje

Utdraget representerer brukerens siste meningsbærende melding.

Det skal:

- vises i maksimalt én linje i full desktopoversikt
- utelates i kompakt desktop og på mobil
- utelates når det bare gjentar tittelen
- utelates når samtalen mangler meningsbærende tekst
- ikke hentes fra et langt AI-svar

Utdraget er en innholdsindikasjon, ikke et automatisk sammendrag.

## 7. Artikkelopprinnelse

Standardform:

> Fra artikkelen «Lydømfintlighet»

Artikkelopprinnelsen er valgfri metadata på en ordinær samtale. Den skal ikke
navngi en egen samtaletype. Metadataen vises på én linje; artikkeltittelen kan
avkortes visuelt når plassen krever det. Det fulle navnet beholdes i
tilgjengelighetsnavnet.

## 8. Kronologi

Anbefalt hybridformat:

- `I dag`
- `I går`
- ukedag for øvrige dager i inneværende uke
- `24. juli` for eldre samtaler samme år
- `24. juli 2025` når årstall trengs
- klokkeslett per samtale, for eksempel `14:35`

Dato vises ved første samtale i hver daggruppe. Klokkeslett beholdes for hver
samtale, i tråd med layout-CBA v0.2.

## 9. Composer og systemtilstander

Fungerende produksjonsmønstre fra `/no/chat` beholdes:

- `Hva lurer du på?`
- `Skriv spørsmål til Viddel`
- `Send spørsmål`
- `Viddel svarer …`
- `Viddel analyserer …`
- `Legg til bilde`
- dagens feiltekster og konkrete veier videre

Den lange startteksten som ramser opp lyd, hørsel, hjelpemidler og hverdagsbruk
tas ikke inn i det innloggede samtaleområdet. Den er ikke nødvendig når state og
Composer allerede gir kontekst.

## 10. Sannhetsgrense

Copyen er:

- godkjent Current Best Answer for konseptprototypen
- kontrollert mot godkjent layout og eksisterende produksjonscopy
- en designhypotese som kan revideres

Copyen er ikke:

- dokumentert brukerpreferanse
- resultat av brukervalidering
- produksjonsregel for tittelgenerering eller utdrag
- beslutning om visuelle tokens eller implementasjon

## 11. Copy-review og resultat

Den separate copy-reviewvarianten kontrollerer:

- oversikt uten forklarende tekst
- naturlige titler med ulik grammatikk og lengde
- to linjer for lange titler
- utdrag i full desktop og tittel alene i kompakte states
- `Ny samtale` i desktophandlinger
- mobilens ikonhandling med tilgjengelig navn
- mobil tilbake med `Samtaler`
- aktivt samtalehode uten `Sist aktiv …`
- ny samtale uten ekstra invitasjonstekst
- full tomtilstand med `Start en samtale med Viddel`

Reviewartefakten er beslutningsstøtte, ikke produksjonsmarkup.

## 12. Neste port

Når copy-reviewen er kontrollert uten plass- eller orienteringsproblemer, kan
UX-copy-porten lukkes. Neste port er visuell retning og designsystem/tokens.
