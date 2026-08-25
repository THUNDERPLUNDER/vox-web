# Viddel Lab Knowledge UX · STG-0 v0.1

## Formål

Teste om ett kildekontrollert Viddel-svar oppleves tydelig og nyttig, før en større mengde materiale behandles. Dette er en isolert LAB-test knyttet til GitHub #336 og gjenåpner ikke full chat-shell i #323.

## Innhold som er tillatt i testen

- Påstand: `CLM-SIT-001-OTI-001`
- Status: `V3_EDITORIAL_APPROVED`
- Situasjon: Oticon Intent miniRITE gir ingen vanlig omgivelseslyd
- Gyldighet: Oticon Intent 1–4 miniRITE, FW 1.0/1.1
- Originalkilde: Oticon Intent Instructions for Use, s. 80–81, med støtte fra s. 20 og 28
- Kildesignatur og kontrollhistorikk ligger i `VDL_SOURCE_FITNESS_REVIEW_LAB_v0.1`.

## Guardrails

- Ruten `/lab/knowledge-ux` er passordbeskyttet med eksisterende LAB-port.
- Ruten er `noindex, nofollow` og gjør ingen agent-, CES-, GCP- eller produksjonskall.
- Mobil-/TV-streaming skilles ut før svaret vises, fordi den kontrollerte påstanden ikke dekker dette.
- Tilbakemelding lagres ikke sentralt i STG-0; den bekreftes bare i den aktive nettleserøkten.
- Ny oppgave skal ikke kreve ny generell originalkontroll for denne påstanden når claim-ID, scope, locator og kildesignatur fortsatt matcher registeret.

## UX-spørsmål

1. Forstår brukeren avgrensningen mellom all lyd og streaming?
2. Er rekkefølgen lett å følge på mobil?
3. Skaper kildevisningen tillit uten å forstyrre førstehjelpen?
4. Vet brukeren når fagperson skal kontaktes?

## Promoteringsregel

STG-0 kan flyttes fra `LAB_UX_READY` til `LAB_UX_LIVE` når byggekontroll, innloggingsport og mobilvisning er verifisert på en tilgjengelig preview. Det gir ikke status `V4_TRUSTED` og autoriserer ikke produksjonspublisering.
