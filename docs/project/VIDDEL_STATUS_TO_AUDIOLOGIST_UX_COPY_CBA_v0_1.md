# Min status til audiograf — UX-copy CBA v0.1

Status: Godkjent UX-copy-CBA i strukturen fra layout-CBA v0.1  
Eier: Thomas  
Forelder: `docs/project/VIDDEL_STATUS_TO_AUDIOLOGIST_LAYOUT_CBA_v0_1.md`  
Relatert GitHub-sak: #295  
Copy-review: `public/vis/raw/viddel-status-to-audiologist-cba-v0_1.html`  
Sist oppdatert: 2026-08-02

## 1. Dokumentets rolle

Dette dokumentet beslutter brukerrettede begreper og UX-copy for den godkjente
strukturen i «Min status til audiograf».

Layout-CBA v0.1 styrer fortsatt inngang, stateflyt, komponentansvar og
sannhetsgrense. Copy-CBA-en beslutter ikke visuell design, produktlogikk,
lagring eller deling.

## 2. Språkretning

Copyen skal være kort, direkte og menneskelig.

- forklar bare det brukeren trenger for neste handling
- bruk aktivt språk og korte setninger
- bruk «eller» når reelle alternativer må skilles
- unngå systemforklaringer om hvordan Viddel arbeider
- unngå formuleringer som antyder medisinsk vurdering
- skill tydelig mellom forslag, brukerens valg og ferdig utkast

## 3. Begrepsmodell

| Funksjon | Brukerrettet begrep |
| --- | --- |
| Inngang fra samtaleoversikten | `Lag status til audiograf` |
| Flate og forhåndsvisning | `Min status til audiograf` |
| Systemets forslag | `Utkast` eller `foreslåtte punkter` |
| Inkluderingskontroll | `Ta med` |
| Endelig state i konseptet | `Utkast · ikke sendt` |

«Oppsummering», «rapport», «journal» og «deling» brukes ikke som parallelle
hovedbegreper i denne porten.

## 4. Copy per state

### 4.1 Inngang

- handling: `Lag status til audiograf`
- tilgjengelig navn: `Lag status til audiograf`

Handlingen beskriver hva brukeren lager. Selve flaten bruker førsteperson for å
markere eierskap.

### 4.2 Periode

- steg: `1. Periode`
- overskrift: `Velg periode`
- hjelpetekst: `Vi foreslår punkter fra samtalene dine. Du velger hva som blir med.`
- standardvalg: `Siste 30 dager`
- alternativ: `Siste 3 måneder`
- egendefinert: `Velg datoer`
- datofelt: `Fra` og `Til`
- handling: `Lag utkast`

### 4.3 Utkast

- steg: `2. Utkast`
- overskrift: `Se gjennom utkastet`
- omfang: `[periode] · [antall] foreslåtte punkter`
- hjelpetekst: `Alt er valgt nå. Fjern det som ikke passer, og skriv om resten.`
- kontroll per punkt: `Ta med`
- tilbake: `Tilbake`
- neste: `Forhåndsvis`

Godkjente gruppeoverskrifter:

- `Dette har vært vanskelig`
- `Dette har jeg prøvd`
- `Dette vil jeg ta opp`

### 4.4 Sporbarhet

Standardform:

> Fra «Lyden blir skarp av bestikk og tallerkener» · 31. juli

Når et punkt bygger på flere samtaler:

> Fra to samtaler · 18. og 31. juli

Kildeteksten viser hvor forslaget kommer fra. Den sier ikke at Viddel eller
helsepersonell har vurdert innholdet.

### 4.5 Forhåndsvisning

- steg: `3. Forhåndsvis`
- overskrift: `Min status til audiograf`
- status: `Utkast · ikke sendt`
- tilbake: `Tilbake til utkastet`
- tom state: `Ingen punkter er valgt ennå.`

Statuslinjen beholder «eller» i konseptgrensen `Ingenting lagres eller sendes`
fordi lagring og sending er to ulike forhold brukeren må kunne skille.

## 5. Tekst i syntetiske eksempler

Eksempelpunktene skrives som konkrete observasjoner i førsteperson eller som
direkte tema brukeren vil ta opp. De skal ikke omskrives til kliniske funn.

Eksempler:

- `Bestikk og tallerkener oppleves skarpe og ubehagelige.`
- `Møter blir krevende når flere snakker samtidig.`
- `Jeg har forsøkt å sitte nærmere dem som snakker i møter.`
- `Hva jeg bør følge med på før neste time.`

## 6. Sannhetsgrense

Copyen er en godkjent designhypotese for konseptprototypen. Den er ikke et
dokumentert brukerfunn eller en beslutning om analyse, lagring, deling,
audiograftilgang eller produksjonsimplementering.

## 7. Portstatus

Thomas godkjente 2026-08-02 navn, periodetekst og gjennomgangstekst som første
copy-pass. Copyen er kontrollert i den eksisterende interaktive strukturen.

UX-copy-porten er lukket. Neste port er en lett visuell kontroll mot eksisterende
semantiske tokens, uten ny global tokenfamilie.

