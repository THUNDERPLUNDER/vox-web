# Viddel MVP Design Lock v0.1

Dato: 2026-05-15  
Status: Aktiv arbeidsbeslutning  
Eier: Thomas / Viddel Lab  
Scope: MVP-design for forside, hub, artikkel, standalone AI og mine sider light

## Formål

Dette dokumentet etablerer tydelig nok designretning for Viddel MVP.

Det er ikke en full brand manual. Det er en lett beslutningslogg og arbeidsramme som skal hjelpe teamet å ta raske, konsistente valg uten å låse merkevaren for langt frem i tid.

Målet er et profesjonelt, tydelig og byggbart MVP-design med rom for revisjon etter reell læring, bruk og traction.

## Prinsipp for denne fasen

Designet skal låses nok til at det kan bygges og testes.

Det skal ikke dokumenteres mer enn det som hjelper oss å:

- ta raske beslutninger
- unngå gjentatte diskusjoner
- gi Cursor presist scope
- holde GitHub som oppgavebuss
- bruke VIS som reviewflate
- bevare handoff til strategi og arkiv

## Låste beslutninger for MVP

Disse kan bygges inn nå.

### Navn

- Produktnavn: **Viddel**
- Tidligere navn skal ikke brukes i ny merkevare- eller UI-dokumentasjon.

### Overordnet retning

- Hovedretning: **Hverdagslyd / aktiv hverdagsklarhet**
- Kjerne: Viddel hjelper mennesker å få en tydeligere, levende hverdag tilbake gjennom bedre hørsel, orientering, mestring og deltakelse.
- Uttrykket skal være klart, nøkternt, menneskelig og aktivt.

### Bakgrunn og flater

- Primær bakgrunn skal være **hvit** eller **helt lys, ren grå**.
- Varm beige, krem, retro-papir og stofflige bakgrunnsflater forkastes for MVP.
- Varme skal komme fra foto, innhold, menneskelige situasjoner og enkelte aksenter - ikke fra baseflaten.

### UI-retning

- Monokrome knapper fungerer som retning for MVP.
- Primær handling: mørk fyll + lys tekst.
- Sekundær handling: lys grå fyll + mørk tekst.
- Ghost: transparent / outline.
- Klar blå brukes som signal og aksent, ikke som dekor overalt.

### Lydbuen

- Lydbuen som bredt UI- og behavior-språk parkeres.
- Buen kan fortsatt være inspirasjon i logoarbeid eller motion senere, men skal ikke styre MVP-komponentene nå.

### Logo decision v0.1

Status: **Låst for MVP**

Viddel MVP-logo bruker wordmark med integrert femstolpers lydsignal mellom og inn i de to d-ene.

Logoen skal leses som **VIDDEL**, ikke **VID DEL**. Lydsignalet skal inngå i dobbel-d-strukturen og ikke skape ordbrudd.

AI-genererte bilder er beslutningsgrunnlag, ikke masterfiler. Endelig MVP-logo må produseres som ren vektor-master og eksporteres som kontrollerte assets før implementering.

Primærvariant:

- `VDL-BLU-PRM`: mørk wordmark + blått femstolpers signalmerke på hvit / lys bakgrunn

Godkjente varianter:

- `VDL-BLK-PRM`: monokrom sort / mørk på hvit eller lys grå
- `VDL-GRY-PRM`: grå nøytralvariant på hvit / lys bakgrunn
- `VDL-WHT-INV`: hvit variant på mørk bakgrunn
- `VDL-YEL-INV`: gul signalvariant på mørk bakgrunn
- `VDL-GRN-INV`: grønn signalvariant på mørk bakgrunn

Godkjenningskrav før implementering:

- ren vektor-master skal produseres
- bitmap-eksporter skal produseres fra samme vektor-master
- Thomas skal ha en egen godkjenningsrunde på asset pack før Cursor implementerer
- små logostørrelser skal testes med litt fetere vekt / optisk justering for lesbarhet

Ikke godkjent:

- logo der lydsignalet deler ordet som `VID DEL`
- seks stolper i signalmerket
- løs equalizer-dekor uten integrasjon i dobbel-d
- bue som primært logoelement i MVP
- at Cursor eller AI-verktøy improviserer ny logoform ved implementering

## Arbeidsbeslutninger

Disse brukes nå, men kan justeres etter test og implementering.

### Logo

- Arbeidsretning: Viddel wordmark med integrert femstolpers lydstolpe-/signal-motiv.
- Dobbel-d-området er låst som primært integrasjonspunkt.
- Symbolet kan trekkes ut til favicon/appikon/AI-status dersom det fungerer etter småstørrelse-test.
- Logoen må fungere monokromt.
- Ren vektor-master og bitmap-eksporter skal godkjennes før implementering.

### Farger / tokens

Foreløpig rollemodell:

- `background.primary`: hvit
- `background.secondary`: svært lys ren grå
- `text.primary`: dyp blå / nesten sort
- `accent.primary`: klar blå
- `accent.support`: avklares, brukes sparsomt
- `button.primary`: mørk fyll + lys tekst
- `button.secondary`: lys grå fyll + mørk tekst
- `button.ghost`: transparent / outline

Tilleggskrav:

- Alle tekst- og knappkombinasjoner skal sjekkes mot **WCAG AA**.
- Kontrast er kritisk for målgruppen.

### Typografi

Arbeidsnavn:

- **Viddel Display**
- **Viddel Sans**

Retning:

- Viddel Display skal bære identitet, overskrifter og større budskap.
- Viddel Sans skal bære brødtekst, UI, labels og navigasjon.
- Typografien skal støtte norsk språk og æ, ø, å.

Redaksjonell arv:

- Viddel skal ha et **Audiophile Editorial** preg: klart, presist, lesbart og med nok autoritet.
- Display-retningen kan teste stram serif eller serif-inspirert autoritet i overskrifter, men må ikke bli kosmetisk eller retreat-preget.
- Brødtekst og UI skal være svært lesbar sans-serif.

### Foto og varme

- Bildene skal gi varme, relasjon og hverdagsnærhet.
- Motiver: mennesker i kontakt, hverdagslyder, by/fjord, regn, trikk, fottrinn, kaffe, fugl, samtale.
- Unngå generisk senior-stock, klinikk, spa, passiv omsorg og høreapparat som hovedmotiv.

## Åpne beslutninger

Disse skal ikke overbygges før de er modne.

- Endelig produksjonsasset for logo
- Endelig symbol / favicon
- Eksakt displayfont
- Eksakt sans-font
- Endelig farge-token-sett
- Om aksent utover blå trengs i MVP
- Bildestil / bilde-DNA
- Motion / animasjonsprinsipper
- Full mine sider-konsept
- Dark mode

## Parkert

Skal ikke prioriteres i denne fasen.

- Full brand manual
- Full motion language
- Omfattende bildeguide
- Avansert symbolbibliotek
- Komplett dark mode redesign
- Komplett designsystem fra bunnen
- Ny IA utover MVP-scope
- Nye flater utenfor forside, hub, artikkel, standalone AI og mine sider light

## MVP-designkrav

Designet skal være:

- profesjonelt nok for demo, samarbeid og test
- tydelig nok til å gi tillit
- fleksibelt nok til videre justering
- redaksjonelt og lesbart
- produktnært uten å bli kaldt
- menneskelig uten å bli mykt eller spa-preget

Designet skal unngå:

- spa / retreat
- klinikk
- bank / finans
- generisk AI-startup
- høreapparatbrosjyre
- retro-stofflig bakgrunn
- unødvendig dekor

## MVP-flater som skal reskinnes

Denne fasen handler om å applisere ny retning på eksisterende MVP-flater.

Ingen nye flater eller wireframes skal finnes opp uten egen beslutning.

Scope:

1. Forside
2. Hub
3. Artikkel / Article System v0.1 / Spoke R1-R3
4. Standalone AI
5. Mine sider light

## GitHub-arbeidsstruktur

Én epic:

- **MVP Design Lock v0.1**

Maks seks issues:

1. Logo refinement
2. Color tokens v0.1
3. Typography v0.1
4. Primitives v0.1
5. Reskin MVP Surfaces
6. VIS design preview

## Issue-scope

### 1. Logo refinement

Mål:
Lande operativ MVP-logo.

Aksept:

- én primær wordmark
- én monokrom variant
- én liten header-variant
- én favicon/appikon-hypotese
- testet på hvit og lys grå
- femstolpers lydstolpe-/signal-motiv integrert i dobbel-d
- logoen leses som VIDDEL, ikke VID DEL
- operativ eksport klar for implementering
- godkjenningsrunde gjennomført etter produksjon av vektor-master og bitmap-eksporter

Avgrensning:

- Ikke full logo-manual
- Ikke endelig juridisk varemerkearbeid
- Ikke bred symbolutforskning

### 2. Color tokens v0.1

Mål:
Oversette valgt retning til MVP-tokenroller.

Aksept:

- hvit og lys ren grå som base
- dyp blå / nesten sort som tekst/logo
- klar blå som sparsom aksent
- monokrome knappetokens
- WCAG AA-sjekk for sentrale kombinasjoner
- ingen varme baseflater

Avgrensning:

- Ikke komplett fargesystem
- Ikke dark mode

### 3. Typography v0.1

Mål:
Velge nok typografisk retning for MVP.

Aksept:

- Viddel Display arbeidsretning
- Viddel Sans arbeidsretning
- fallback-fonts
- norske tegn sjekket
- heading/body/UI label-bruk definert
- Audiophile Editorial-arv tydeliggjort

Avgrensning:

- Ikke full fontanalyse
- Ikke endelig spesialtegnet wordmark

### 4. Primitives v0.1

Mål:
Definere små byggesteiner som kan reskinne MVP.

Aksept:

- button
- card
- article surface
- hub tile
- AI prompt chip
- input/chat surface
- nav/header

Avgrensning:

- Ikke komplett komponentbibliotek
- Ikke ny IA

### 5. Reskin MVP Surfaces

Mål:
Applisere nye tokens/primitives på eksisterende MVP-flater.

Aksept:

- forside reskinnet
- hub reskinnet
- artikkel / Article System v0.1 / Spoke R1-R3 justert
- standalone AI reskinnet
- mine sider light reskinnet
- ingen nye wireframes funnet opp

Avgrensning:

- Ikke redesign fra bunnen
- Ikke nye flater
- Ikke ny contentstruktur

### 6. VIS design preview

Mål:
Lage én reviewflate for designretningen.

Aksept:

- viser logo
- viser farger
- viser typografi
- viser primitives
- viser MVP-flater
- kan brukes til review med Thomas, Vibeke og @navigator

Avgrensning:

- VIS er visningsflate, ikke backlog
- Ikke full brand manual

## Revisit

Denne design locken bør vurderes igjen etter:

- første reelle MVP-test
- partner-/brukerfeedback
- teknisk implementeringserfaring
- 6-12 måneder med mer faktisk læring

## Kort beslutningsformat fremover

Bruk tre nivåer:

### Låst for MVP

Kan bygges inn nå.

### Arbeidsbeslutning

Brukes nå, kan endres senere.

### Åpent / parkert

Ikke bygg tungt ennå.

## Return Ticket-krav

Viktig utførelse skal returneres med:

- hva som ble gjort
- endrede filer
- beslutninger / antakelser
- commit
- push
- commit hash
- push-status
- hva som konkret skal verifiseres
- preview / deploy-lenke hvis relevant
