# Viddel Conversation Area Layout — Current Best Answer v0.2

Status: Godkjent strukturell CBA før UX-copy, visuell design og UI-implementering
Eier: Thomas
Forelder: `docs/project/VIDDEL_CONCEPT_PROTOTYPE_CBA_v0_2.md`
Erstatter: `docs/project/VIDDEL_CONVERSATION_AREA_LAYOUT_CBA_v0_1.md`
Relatert GitHub-sak: #283
Interaktivt beslutningsgrunnlag: `public/vis/raw/viddel-conversation-area-cba-v0_1.html`
Sist oppdatert: 2026-07-31

## 1. Dokumentets rolle

Dette dokumentet utvider hoved-CBA v0.2 for én avgrenset designport: det
innloggede samtaleområdet.

Dokumentet er mer spesifikt og senere enn hoved-CBA-en for spørsmål om:

- innholdsprioritet i samtaleområdet
- komponentgrense
- `ConversationItem` i full og kompakt presentasjon
- layoutprinsipp på desktop og mobil
- gruppering, kronologi og informasjonstetthet
- states og overganger mellom samtaleoversikt, ny samtale og aktiv samtale

Hoved-CBA v0.2 styrer fortsatt produktformål, informasjonsarkitektur,
sannhetsgrense og samlet prototypescope.

Dette er en **Current Best Answer**. Det er et byggbart arbeidsgrunnlag med
dagens innsikt, ikke en permanent produksjonsbeslutning.

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
- forstå kronologien
- åpne og fortsette en samtale
- starte en ny samtale

Et samtaleelement kan inneholde:

- forståelig tittel eller tema
- kort innholdsindikasjon når presentasjonsmodusen har plass
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

Samme `ConversationItem` og informasjonsmodell skal støtte full og kompakt
presentasjon. Modusene er ikke to uavhengige komponenter.

Begge modusene beholder:

- samme samtaleidentitet
- samme kronologiske rekkefølge
- samme valgte state
- samme artikkelopprinnelse når den finnes

Nødvendige interaksjonsstates:

- standard
- fokus
- valgt / aktiv

Ulestmarkering, favoritter, arkivering, sletting, mapper, kategorier og
handlingsmeny per samtale er ikke del av v0.2.

### 5.1 Desktop — full oversikt

Full desktopoversikt bruker:

- fast datokolonne til venstre
- samtaletittel til høyre
- maksimalt én kort utdragslinje
- valgfri artikkelopprinnelse som metadata
- klokkeslett per samtale

Datokolonnen utnytter horisontal plass og skaper en stabil skanneakse mellom
tidspunkt og samtaletittel.

### 5.2 Desktop — kompakt ved aktiv samtale

Kompakt desktopvisning bruker:

- dato først
- klokkeslett per samtale
- samtaletittel uten utdragslinje
- valgfri artikkelopprinnelse

Kompaktmodus prioriterer samtaleidentitet og kronologi framfor ekstra
innholdsindikasjon.

### 5.3 Mobil — samtaleoversikt

Mobiloversikten bruker:

- dato først
- klokkeslett per samtale
- samtaletittel uten utdragslinje
- valgfri artikkelopprinnelse

Datokolonne brukes ikke på mobil fordi den tar for mye horisontal plass fra
samtaletittelen. Alle samtaler skal følge samme venstre akse. Det skal ikke
oppstå trinnvis innrykk eller et visuelt hierarki mellom samtaler samme dag.

### 5.4 Flere samtaler samme dag

Når flere samtaler har samme dato:

- dato vises ved den første samtalen den dagen
- dato gjentas ikke ved senere samtaler samme dag
- klokkeslett beholdes for hver samtale
- samtalene beholder synlig tilhørighet til samme dag

Dette gjelder full desktopoversikt, kompakt desktopvisning og mobiloversikt.

### 5.5 Rytme og gruppering

Strukturell CBA for avstandsforhold:

- liten intern avstand mellom dato/klokkeslett, tittel og artikkelopprinnelse
- tydelig større avstand mellom separate samtaler
- enda større avstand før en ny dag
- tilstrekkelig innvendig luft mellom tekstgruppen og flaten for hover eller
  valgt state

Dette beslutter rytme og gruppering, ikke endelige spacing-tokens.

## 6. Layout-CBA

### 6.1 Start

Innlogging viser full samtaleoversikt. «Oversikt først» er en intern
arbeidshypotese, ikke besluttet brukerrettet copy.

### 6.2 Desktop etter åpning

Når brukeren åpner en samtale:

- samtaleoversikten går over i kompakt modus
- samtalevalget beholdes ved siden av aktiv samtale
- valgt samtale forblir synlig og tydelig markert
- brukeren kan bytte samtale uten å forlate arbeidsflaten
- listen beholder samtaleidentitet, kronologi og valgt state gjennom overgangen

Dette kalles **adaptiv delt flate**.

Kontrollvarianten med én state om gangen på desktop er ikke lenger aktiv
prototype-CBA. Den kan tas fram igjen dersom senere visuell design eller
brukervalidering avdekker reell desorientering.

### 6.3 Mobil

Mobil viser én tydelig state om gangen:

- samtaleoversikt
- ny samtale
- aktiv samtale

Aktiv og ny samtale har en tydelig vei tilbake. Tilbake skal bevare plassering
og valgt samtale i oversikten.

### 6.4 Ny og tom samtale

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

## 8. Interaktiv mønsterverifisering

Layouten og `ConversationItem` ble konkretisert gjennom **Interaktiv
mønsterverifisering**: en klikkbar prototype på struktur- og state-nivå før
copy, tokens og implementering.

Følgende ble sammenlignet og justert:

- full oversikt mot adaptiv delt desktopflate
- datokolonne mot dato først og datogrupper
- full og kompakt informasjonstetthet
- flere samtaler samme dag
- stabil valgt state ved åpning og bytte
- mobiloversikt mot aktiv mobilstate
- intern rytme, samtaleavstand og daggruppering
- tittel alene mot tittel med én utdragslinje

Interaktivt, versjonert beslutningsgrunnlag:

- `public/vis/raw/viddel-conversation-area-cba-v0_1.html`

HTML-filen er en repo-native wireframe og reviewartefakt. Dette dokumentet er
autoritativt når artefakten og teksten avviker.

## 9. Resultat av verifiseringen

De fem verifiseringsbetingelsene fra v0.1 er gjennomgått i en konkret skisse.

### 9.1 Overgang til delt desktopflate

Samme liste og valgte samtale beholdes når oversikten komprimeres. Aktiv dialog
kommer inn som den nye hovedflaten uten at samtaleidentiteten byttes ut.

### 9.2 Full og kompakt ConversationItem

Samme komponent fungerer med datokolonne og utdrag i full desktopoversikt, og
med dato først og tittel alene i kompakt visning.

### 9.3 Valgt samtale

Valgt samtale forblir synlig gjennom åpning og bytte. Endelig farge, kant og
hoveruttrykk besluttes i visuell design-/tokenporten.

### 9.4 Ny samtale

Ny samtale er tilgjengelig fra oversikten og i aktiv desktopflate uten å bli
hovedhandlingen foran den aktive dialogen.

### 9.5 Mobil tilbake

Mobil bruker separate states. Tilbakeflyten beholder valgt samtale og skal
bevare listeposisjon.

Resultatet støtter adaptiv delt flate som strukturell prototype-CBA.

## 10. Sannhetsgrense

Verifiseringen er:

- konkret design- og strukturverifisering
- heuristisk og beslutningsstøttende
- gjennomført med syntetiske eksempeldata

Den er ikke:

- brukervalidering
- dokumentasjon på målgruppens preferanser
- produksjonsbevis
- beslutning om auth, lagring eller datamodell

## 11. Fortsatt åpent

Følgende er ikke besluttet i denne CBA-en:

- endelig UX-copy og brukerrettede begreper
- regler og produksjonslogikk for samtaletitler og utdrag
- farger og visuell retning
- hover- og valgt-state-uttrykk
- endelige radius-, spacing-, typografi- og knappetokens
- eksakt desktopfordeling og breakpoint
- bevegelse eller animasjon i layoutovergangen
- endelig navigasjonsmønster og route-struktur
- autentisering, lagring og datamodell
- endelig komponentmarkup

## 12. Implementeringsguardrails

- Ingen UI-kode bygges før UX-copy og visuell retning for flaten er vurdert og
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
- Den interaktive wireframen skal ikke kopieres direkte til produksjonsmarkup;
  den beskriver mønsteret, ikke implementasjonen.

## 13. Neste designporter

1. Beslutte UX-copy og brukerrettede begreper.
2. Beslutte visuell retning, inkludert fargebruk og engasjement.
3. Oversette godkjent struktur og visuell retning til designsystemkontrakt.
4. Lage implementeringsbrief først etter Thomas sin godkjenning av flaten.
