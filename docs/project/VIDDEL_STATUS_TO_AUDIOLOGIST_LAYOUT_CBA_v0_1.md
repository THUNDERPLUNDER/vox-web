# Min status til audiograf — Current Best Answer v0.1

Status: Godkjent strukturell CBA før UX-copy, visuell design og UI-implementering  
Eier: Thomas  
Forelder: `docs/project/VIDDEL_CONCEPT_PROTOTYPE_CBA_v0_2.md`  
Relatert GitHub-sak: #293  
Interaktivt beslutningsgrunnlag: `public/vis/raw/viddel-status-to-audiologist-cba-v0_1.html`  
Sist oppdatert: 2026-07-31

## 1. Dokumentets rolle

Dette dokumentet avgrenser én designport: hvordan en bruker kan lage et eget
statusutkast til en audiograftime med utgangspunkt i tidligere samtaler.

Løsningen er en **produkthypotese og Current Best Answer**, ikke et dokumentert
brukerfunn eller en ferdig beslutning om lagring, analyse eller deling.

## 2. Hovedutfall og sannhetsgrense

Brukeren skal kunne velge en periode, se gjennom et foreslått utkast og sitte
igjen med en rolig forhåndsvisning som brukeren selv eier.

Flaten er ikke en pasientjournal, klinisk oppsummering eller meldingstjeneste.
Den skal ikke antyde at:

- innholdet er medisinsk vurdert
- audiografen har tilgang
- noe lagres eller sendes automatisk
- Viddel har valgt endelig innhold på vegne av brukeren

## 3. Inngang

«Min status til audiograf» er en sekundær handling fra den fulle
samtaleoversikten. Den ligger ikke inne i én enkelt samtale og skal ikke
konkurrere med «Ny samtale» som hovedhandling.

Endelig plassering og visuell vekt avgjøres i en senere designport.

## 4. Godkjent arbeidsflyt

Arbeidet skjer i én progressiv flate med tre states:

1. **Periode** — velg en foreslått eller egendefinert periode.
2. **Utkast** — se gjennom, fjern og rediger foreslåtte punkter.
3. **Forhåndsvisning** — les det valgte innholdet samlet.

Dette er ikke en veiviser med separate sider og ikke et dashboard. Tilbake skal
bevare valgt periode, utvalg og redigeringer lokalt i arbeidsflaten.

## 5. Utkast og brukerkontroll

Viddel foreslår et syntetisert utkast fra samtalene i valgt periode.

- foreslåtte punkter er valgt som utgangspunkt
- brukeren kan fjerne hvert punkt
- brukeren kan redigere formuleringen
- punktene grupperes i få, forståelige deler
- kilde til punktet vises i gjennomgangen som samtaletittel og dato
- et punkt kan vise at det bygger på flere samtaler

Kildemarkeringen gir sporbarhet under gjennomgangen. Om den også skal vises i
den endelige teksten avgjøres senere.

## 6. Forhåndsvisning

Forhåndsvisningen er et lesbart, brukerkontrollert utkast og merkes tydelig med
«Utkast · ikke sendt» eller tilsvarende godkjent copy.

Denne porten beslutter ikke eksport, utskrift, e-post, deling eller innsending.
Audiografen får ikke tilgang gjennom denne prototypen.

## 7. Minste komponentbehov

Den strukturelle CBA-en kan bygges med fem små ansvar:

1. `StatusPeriodSelector`
2. `StatusDraftSection`
3. `StatusPoint`
4. `StatusPreview`
5. `ConceptBoundaryNote`

Komponentnavnene beskriver ansvar, ikke endelig kodearkitektur.

## 8. Responsiv struktur

Desktop og mobil bruker samme lineære stateflyt.

- innholdet holder en lesbar hovedkolonne
- kontroller kan stables på smale flater
- redigering og forhåndsvisning vises ikke side om side i denne versjonen
- dashboardkort og parallelle paneler skal ikke introduseres uten ny beslutning

## 9. Nødvendige states

Mønsteret skal kunne demonstrere:

1. standardperiode
2. egendefinert periode
3. utkast med alle punkter valgt
4. fjernet punkt
5. redigert punkt
6. forhåndsvisning med valgt innhold
7. tom forhåndsvisning når ingen punkter er valgt
8. tilbake uten tap av lokale valg

## 10. Ikke besluttet i denne porten

- endelig UX-copy og kategorinavn
- visuell retning og tokens
- generering, lagring og personvernarkitektur
- innlogging og tilgangsstyring
- eksport-, utskrifts- eller delingsformat
- integrasjon med audiograf eller klinikksystem
- produktkode og produksjonsrute

Neste port er en liten UX-copy-gjennomgang i den godkjente strukturen.

## 11. Godkjenning

Thomas godkjente 2026-07-31:

- inngang fra full samtaleoversikt
- én progressiv flate framfor veiviser eller dashboard
- Viddel-generert utkast med foreslåtte punkter valgt som utgangspunkt, med
  kontroll for å fjerne, redigere og forhåndsvise

