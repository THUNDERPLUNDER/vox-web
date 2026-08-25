# Viddel Beta Knowledge Release Policy v0.1

## Formål

Gjøre kunnskapsarbeidet raskt nok til løpende UX-testing uten å blande kildeautentisering, påstandskontroll og produktmodenhet.

`BETA` er en publiseringsmerking. `V0–V4` er verifikasjonsstatus. De skal alltid lagres og vises som separate felt.

## Minimumsregel for troverdige manualer

En aktuell originalmanual fra produsenten autentiseres og avgrenses én gang til `V1_SCOPE_CONFIRMED`:

- produsent og dokumenttype
- modell eller produktfamilie
- versjon, revisjon, dato og relevant firmware/marked når dette finnes
- stabil kilde-ID og kildesignatur

Manualens enkelte utsagn skal ikke overprøves eller registreres punkt for punkt. Ny kontroll utløses bare av endret fil/signatur, utvidet scope, konflikt, alvorlig brukeravvik eller sikkerhetskritisk bruk.

## Beta-sporet

Et svar kan publiseres som `BETA` fra `V1_SCOPE_CONFIRMED` når:

- svaret holder seg innen dokumentert produsent-, modell- og versjonsscope
- originalkilden kan åpnes fra svaret
- merkingen er synlig: «Beta – bygger på en kontrollert produsentkilde, men svaret er ikke kvalitetssikret punkt for punkt av Viddel ennå»
- svaret har et tydelig stoppunkt når videre hjelp bør overtas av fagperson
- claim-ID legges i etterkontrollkø

Beta-sporet skal ikke brukes til diagnose, behandlingsvalg, irreversible handlinger, sikkerhetskritiske råd, kilder i konflikt eller `VX_STALE_OR_CONFLICT`.

## Selektiv etterkontroll

Punktkontroll til `V2–V4` prioriteres for:

1. svar som faktisk brukes eller gir positivt UX-signal
2. svar som får avvik eller negativ tilbakemelding
3. endrede eller motstridende kilder
4. innhold som ønskes promotert til TRUSTED

Manglende fortløpende godkjenning fra produkteier stopper derfor ikke beta-arbeidet. Nye svar kan legges ut i avgrensede mikrobatcher med Return Ticket og etterslep i registeret.

## Presentasjonskontrakt

- `BETA` + `V1`: `Beta · ikke punktkontrollert`
- `BETA` + `V2–V4`: `Beta · kildekontrollert`
- `TRUSTED` krever fortsatt `V4_TRUSTED`

Betamerking skal aldri få et `V1`-svar til å fremstå som `V2`, `V3` eller `V4`.
