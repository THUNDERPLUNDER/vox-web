# Viddel Conversation Area — implementeringsbrief v0.1

Status: Klar for implementeringsport etter merge av visuell kontroll
Eier: Thomas
Utfører: Cursor
Relatert GitHub-sak: #283
Dato: 2026-07-31

## 1. Mål

Bygg en isolert konseptflate der en bruker kan:

- se syntetiske tidligere samtaler
- åpne og bytte mellom samtaler
- starte en ny samtale
- gå tilbake til oversikten på mobil
- se en ordinær samtale med valgfri artikkelopprinnelse

Flaten skal demonstrere godkjent struktur, copy og visuell retning. Den skal
ikke framstille innlogging, lagring eller historikk som produksjonsklar.

## 2. Autoritative grunnlag

1. `docs/project/VIDDEL_CONVERSATION_AREA_LAYOUT_CBA_v0_2.md`
2. `docs/project/VIDDEL_CONVERSATION_AREA_UX_COPY_CBA_v0_1.md`
3. `docs/design/prototypes/VIDDEL_CONVERSATION_AREA_VISUAL_REVIEW_v0_1.md`
4. `src/styles/tokens.css`
5. fungerende mønstre på `/no/chat`

Wireframene er kontrollflater, ikke produksjonsmarkup.

## 3. Avgrenset implementering

Opprett en egen prototype-route, anbefalt `/no/samtaler`, med syntetiske data og
lokal UI-state. Ingen data skal persisteres.

Nye små komponentbehov:

- `ConversationOverview`
- `ConversationItem`
- `ConversationContext`
- `ConversationEmptyState`

En liten områdeshell kan koordinere responsive states. Full og kompakt visning
skal være moduser av samme `ConversationItem` og samme datamodell.

## 4. Gjenbruk og vern

Gjenbruk uttrykk og tilgjengelighetskontrakter fra `/no/chat` for transcript,
Composer, pending, feil og bildehandling.

Ikke i dette bygget:

- refaktorere eller normalisere `/no/chat`
- endre `ArticleInlineChatShell`
- endre eksisterende Composer-kontrakt eller chat-CSS globalt
- bygge auth, database, lagring, analyse eller samtykke
- bygge sletting, arkivering, favoritter, mapper eller ulestmarkering
- etablere produksjonslogikk for titler eller utdrag

## 5. Semantisk tokenkontrakt

| Rolle | Token |
|---|---|
| Sideflate | `--bg` |
| Dialogflate | `--surface` |
| Kompakt/rolig flate og hover | `--surface-subtle` |
| Primær tekst | `--text` |
| Metadata | `--text-secondary` |
| Valgt markør | `--accent-primary` |
| Fokus | `--focus-ring` |
| Nødvendig svak avgrensning | `--border` |
| Kontrast på sterk handling | `--primary-contrast` |

Valgt state kan avledes av `--surface-subtle` og `--accent-primary` i lokal CSS.
Ikke opprett et nytt globalt token i første byggesnitt. Hvis samme state-oppskrift
senere trengs flere steder, løftes tokenbehovet som egen beslutning.

## 6. Datastruktur for prototypen

Bruk én liten, typet datastruktur med minst:

- `id`
- `title`
- `updatedAt`
- valgfri `excerpt`
- valgfri `articleOrigin`
- syntetiske meldinger

Datoformatering og daggruppering skal ligge utenfor presentasjonsmarkup. Flere
samtaler samme dag viser dato én gang, men klokkeslett på hvert element.

## 7. Nødvendige states

Første byggesnitt skal dekke:

1. full desktopoversikt
2. adaptiv delt desktopflate med valgt samtale
3. mobiloversikt
4. aktiv mobilsamtale med «Tilbake til samtaler»
5. ny, tom samtale
6. tom samtalehistorikk
7. artikkelopprinnelse som valgfri metadata

Pending og feil kan i første snitt demonstreres som kontrollerte prototypestates.
Reell API-integrasjon er ikke nødvendig for å godkjenne områdemønsteret.

## 8. Interaksjon og tilgjengelighet

- Samtalevalg skal være tastaturbetjent og eksponere valgt state semantisk.
- Synlig valgt markør og fokusring skal ikke være samme signal.
- Mobil tilbake skal bevare valgt samtale og listeposisjon.
- Lange titler kan bruke to linjer; full tekst beholdes tilgjengelig.
- Artikkelopprinnelse kan avkortes visuelt, men fullt navn beholdes tilgjengelig.
- Layoutovergang skal respektere `prefers-reduced-motion`.
- Ingen horisontal scrolling ved 320 px bredde.

## 9. Byggerekkefølge

### Snitt A — områdemønster

- route og syntetiske data
- fire små komponenter
- desktop- og mobilstates
- semantisk tokenkobling
- lokal state for åpne, bytte, ny og tilbake

Stopp for visuell kontroll etter Snitt A.

### Snitt B — dialogkobling

- koble inn nødvendig eksisterende chatatferd uten bred Composer-refaktor
- verifisere pending, feil og eventuelt bildehandling

Snitt B startes først når Snitt A står seg.

## 10. Verifikasjon

Krav før Return Ticket:

- `npm run build`
- desktop: full oversikt og delt flate
- mobil: oversikt, aktiv, ny og tilbake ved 390 px og 320 px
- lys og mørk modus
- tastaturfokus og valgt state
- flere samtaler samme dag
- lang tittel og lang artikkelopprinnelse
- tom historikk
- ingen regresjon på `/no/chat` eller artikkelchat
- ingen nye globale tokenverdier

## 11. Ferdigkriterium for Snitt A

- Godkjent struktur og copy er implementert uten nye produktfunksjoner.
- Samme `ConversationItem` støtter full og kompakt modus.
- Semantisk tokenlag er bevart i lys og mørk modus.
- Alle nødvendige prototype-states kan demonstreres.
- Produksjonschat, auth og datalag er urørt.
- Commit og push er gjort, med commit hash og push-status i Return Ticket.
