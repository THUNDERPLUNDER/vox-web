# Viddel Conversation Area — repo-native mønsterpakke v0.1

Status: Godkjent strukturelt beslutningsgrunnlag
Eier: Thomas
Relatert CBA: `docs/project/VIDDEL_CONVERSATION_AREA_LAYOUT_CBA_v0_2.md`
Relatert GitHub-sak: #283
Dato: 2026-07-31

## Formål

Denne pakken bevarer det klikkbare beslutningsgrunnlaget fra den interaktive
mønsterverifiseringen av Viddels innloggede samtaleområde.

Den erstatter funksjonen en versjonert Figma-wireframe ellers kunne hatt i denne
arbeidsfasen:

- konkret og klikkbar romlig referanse
- sammenheng mellom desktop- og mobilstates
- varig versjonshistorikk i Git
- reviewbart grunnlag før UX-copy, tokens og implementering

## Innhold

- `viddel-conversation-area-cba-v0_1.html` — selvstendig, klikkbar wireframe
- `VIDDEL_CONVERSATION_AREA_CBA_v0_1.md` — rolle, sannhetsgrense og bruk

v0.1 prioriterer den interaktive referansen. Eventuelle stillbilder skal senere
eksporteres fra denne eksakte versjonen, slik at de ikke blir en parallell eller
avvikende designkilde.

## Bruk

Åpne HTML-filen lokalt i en nettleser.

Kontrollene øverst lar reviewer bytte mellom:

- desktop og mobil
- samtaleoversikt og aktiv samtale

Samtaleelementene kan åpnes og byttes. «Ny samtale» viser tom startstate.

## Hva artefakten viser

- full desktopoversikt med datokolonne
- adaptiv delt desktopflate med kompakt samtalevalg
- én state om gangen på mobil
- flere samtaler samme dag uten gjentatt dato
- tittel og én utdragslinje i desktopoversikten
- tittel alene i kompakt desktopvisning og på mobil
- artikkelopprinnelse som valgfri metadata
- valgt samtale og tilbakeflyt mellom states

## Sannhetsgrense

Artefakten er en repo-native wireframe og en frosset reviewreferanse. Den er
ikke produksjonskode, komponentmarkup eller designsystemimplementasjon.

Den beslutter ikke:

- brukerrettet copy
- farger, typografi eller endelige tokens
- endelig hover- eller valgt-state-uttrykk
- auth, lagring, routes eller datamodell

Ved avvik er
`docs/project/VIDDEL_CONVERSATION_AREA_LAYOUT_CBA_v0_2.md` autoritativ.

## Arbeidsmetode

**Interaktiv mønsterverifisering** er en klikkbar prototype på struktur- og
state-nivå, brukt til å undersøke informasjonsmønstre, responsive regler og
overganger før copy, visuelle tokens og implementering.

Metoden gir design- og strukturverifisering. Den er ikke brukervalidering.

## Versjonering

Denne v0.1-filen skal beholdes som beslutningshistorikk. Vesentlige senere
endringer opprettes som en ny versjon i stedet for å gjøre den opprinnelige
reviewreferansen uleselig.
