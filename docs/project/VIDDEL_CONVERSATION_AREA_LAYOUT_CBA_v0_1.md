# Viddel Conversation Area Layout — Current Best Answer v0.1

Status: Godkjent strukturgrunnlag før copy, visuell design og UI-implementering
Eier: Thomas
Forelder: `docs/project/VIDDEL_CONCEPT_PROTOTYPE_CBA_v0_2.md`
Relatert GitHub-sak: #283
Sist oppdatert: 2026-07-29

## 1. Dokumentets rolle

Dette dokumentet utvider hoved-CBA v0.2 for én avgrenset designport:
det innloggede samtaleområdet.

Dokumentet er mer spesifikt og senere enn hoved-CBA-en for spørsmål om:

- innholdsprioritet i samtaleområdet
- komponentgrense
- layoutprinsipp på desktop og mobil
- states og overganger mellom samtaleoversikt, ny samtale og aktiv samtale

Hoved-CBA v0.2 er fortsatt styrende for produktformål, informasjonsarkitektur,
sannhetsgrense og samlet prototypescope.

Dette er en **Current Best Answer**. Ny innsikt fra konkret layout, visuell
design eller brukervalidering kan føre til en ny beslutning.

## 2. Brukerbehov og hovedhandling

En innlogget bruker kommer til Viddel for å finne igjen og fortsette en tidligere
samtale, eller starte en ny når behovet er nytt.

Den viktigste handlingen er å komme raskt inn i en relevant samtale og fortsette
dialogen. Å starte en ny samtale er den viktigste alternative handlingen.

Artikkelsamtaler inngår i den ordinære samtalehistorikken. De skal ikke skilles
ut som et eget produktområde.

## 3. Godkjent innholdsprioritet

Flaten skal først gjøre det mulig å:

- se tidligere samtaler
- skille samtalene fra hverandre
- åpne og fortsette en samtale
- starte en ny samtale

Et samtaleelement skal i oversiktsmodus kunne vise:

- forståelig tittel eller tema
- kort innholdsindikasjon
- når samtalen sist var aktiv
- eventuell artikkelopprinnelse

Sekundær orientering om aktiv kontekst, prototypehistorikk og syntetiske data
skal ikke konkurrere med hovedhandlingene.

## 4. Godkjent komponentgrense

Dagens produksjonsflate `/no/chat` er funksjonelt grunnlag for ny og aktiv
samtale.

Følgende eksisterende mønstre gjenbrukes:

- Viddels produktskall og grunnstil
- dagens Composer-uttrykk
- transcript og meldingsmønstre
- pending-, status- og feiltilstander
- eksisterende tilgjengelighetsmønstre

Følgende er nye, små komponentbehov:

1. `ConversationOverview`
2. `ConversationItem`
3. `ConversationContext`
4. `ConversationEmptyState`

`ArticleInlineChatShell` gjenbrukes ikke som hel komponent i det innloggede
området. Artikkelopprinnelse behandles som valgfri metadata på en ordinær
samtale.

`/no/chat-b` og den eldre sandbox-chatten er ikke source of truth for denne
flaten.

## 5. ConversationItem-kontrakt

Samme samtaleelement skal støtte to presentasjonsmoduser.

### Oversiktsmodus

- tittel eller tema
- kort innholdsindikasjon
- sist aktiv
- eventuell artikkelopprinnelse

### Kompakt modus

- tittel eller tema
- sist aktiv
- eventuell artikkelopprinnelse
- innholdsindikasjonen kan forkortes eller utelates når plassen krever det

Begge modusene beholder samme samtaleidentitet, kronologiske rekkefølge og
valgte state.

Nødvendige interaksjonsstates:

- standard
- fokus
- valgt / aktiv

Ulestmarkering, favoritter, arkivering, sletting, mapper, kategorier og
handlingsmeny per samtale er ikke del av v0.1.

## 6. Layout-CBA

### Start

Innlogging viser full samtaleoversikt. «Oversikt først» er en intern
arbeidshypotese, ikke besluttet brukerrettet copy.

### Desktop etter åpning

Når brukeren åpner en samtale:

- samtaleoversikten går over i kompakt modus
- samtalevalget beholdes ved siden av aktiv samtale
- valgt samtale forblir synlig og tydelig markert
- brukeren kan bytte samtale uten å forlate arbeidsflaten

Dette kalles **adaptiv delt flate**.

### Mobil

Mobil viser én tydelig state om gangen:

- samtaleoversikt
- ny samtale
- aktiv samtale

Aktiv og ny samtale har en tydelig vei tilbake. Tilbake skal bevare plassering
og valgt samtale i oversikten.

### Ny og tom samtale

Ny samtale bruker samme grunnflate som aktiv samtale, men i tom startstate.

En bruker uten tidligere samtaler møter en full tomtilstand med tydelig vei til
første samtale. Tom historikk skal ikke utløse en meningsløs delt flate.

## 7. Nødvendige states

Prototypen skal kunne demonstrere:

1. samtaleoversikt med tidligere samtaler
2. aktiv tidligere samtale med bevart trådkontekst
3. ny, tom samtale
4. artikkelsamtale i ordinær historikk
5. tom samtalehistorikk
6. Viddel utarbeider et svar
7. svar kan ikke leveres, med forståelig vei videre

Konseptflatene bruker syntetiske data. De skal ikke framstille innlogging,
lagring, database eller historikk som produksjonsklare funksjoner.

## 8. Heuristisk verifisering

Layouten er gjennomgått mot følgende oppgaver:

- fortsette en relevant samtale
- finne og åpne en artikkelsamtale
- starte en ny samtale
- bytte mellom samtaler på desktop
- finne tilbake til oversikten på mobil
- sammenligne «oversikt først» med «sist aktive samtale først»

Resultat:

- adaptiv delt flate er sterkere enn én state om gangen på desktop når brukeren
  skal bytte mellom samtaler
- én state om gangen er riktig arbeidshypotese på mobil
- «oversikt først» består som prototype-CBA fordi historikk, artikkelsamtaler og
  ny samtale blir synlige før systemet antar brukerens hensikt
- «sist aktive samtale først» beholdes som en mulig senere
  produksjonshypotese

Dette er heuristisk verifisering, ikke brukervalidering.

## 9. Verifiseringsbetingelser

Før layouten regnes som visuelt godkjent skal en mer konkret skisse bekrefte at:

1. overgangen fra full oversikt til delt desktopflate ikke føles rykkete eller
   desorienterende
2. samtaleelementet fungerer både utfyllende i oversikten og kompakt ved siden
   av aktiv dialog
3. aktiv samtale forblir tydelig valgt når brukeren åpner eller bytter samtale
4. «Ny samtale» er tilgjengelig uten å konkurrere med hovedhandlingen i aktiv
   dialog
5. mobil tilbakefører brukeren til samme plassering og valgte samtale

Kontrollvarianten med én state om gangen på desktop beholdes fram til disse
punktene er visuelt verifisert.

## 10. Fortsatt åpent

Følgende er ikke besluttet i denne CBA-en:

- endelig copy og begreper
- farger og visuell retning
- eksakt desktopfordeling og breakpoint
- bevegelse eller animasjon i layoutovergangen
- endelig navigasjonsmønster og route-struktur
- autentisering, lagring og datamodell
- endelig komponentmarkup
- nye eller endrede tokens

Innspill om mer engasjerende fargebruk og bedre brukerrettede begreper tas med
til egne porter for copy og visuell retning.

## 11. Implementeringsguardrails

- Ingen UI-kode bygges før copy og visuell retning for flaten er vurdert og
  Thomas har godkjent den konkrete flaten.
- Composer, tokens og generell chat-CSS skal ikke normaliseres som del av denne
  porten.
- Samtaleoversikt og aktiv samtale skal forbli separate funksjonelle områder,
  slik at startpunkt og desktopplassering kan endres uten nytt komponentsett.
- Full og kompakt samtalevisning skal være moduser av samme komponent, ikke to
  uavhengige informasjonsmodeller.
- Det skal ikke bygges autentisering, database, lagring eller analyse for å
  demonstrere konseptet.
- Endringer skal være små og verifiserbare på desktop og mobil.

## 12. Neste designporter

1. Konkretisere og visuelt verifisere ConversationItem-modusene og
   layoutovergangen.
2. Beslutte copy og brukerrettede begreper.
3. Beslutte visuell retning, inkludert fargebruk og engasjement.
4. Lage implementeringsbrief først etter Thomas sin godkjenning av flaten.
