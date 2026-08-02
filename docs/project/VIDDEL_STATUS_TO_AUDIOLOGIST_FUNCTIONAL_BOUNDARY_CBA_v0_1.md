# Min status til audiograf — funksjonell sannhetsgrense v0.1

Status: Forslag til CBA — til beslutning

Eier: Thomas

Forelder: `VIDDEL_STATUS_TO_AUDIOLOGIST_LAYOUT_CBA_v0_1.md`

Arkitekturport: GitHub #105

Sist oppdatert: 2026-08-02

## 1. Formål

Dette dokumentet setter en liten port mellom den godkjente konseptprototypen
og eventuell backend. Det avgjør hva som kan forbli syntetisk i neste tekniske
bevis, og hva som må være reelt før Viddel kan love funksjonen til brukere.

Dette er en produkt- og arkitekturhypotese. Det er ikke et dokumentert
brukerfunn, en juridisk vurdering eller en beslutning om produksjonsarkitektur.

## 2. Funksjonell kjede

Den godkjente flyten krever i prinsippet denne kjeden:

1. Brukeren velger en periode.
2. Viddel finner samtaler brukeren eier innenfor perioden.
3. Viddel foreslår statuspunkter med sporbarhet til kildesamtalene.
4. Brukeren fjerner, redigerer og godkjenner innholdet.
5. Viddel viser et utkast som ikke er sendt.

Lagring, eksport og deling er ikke nødvendige for å bevise denne kjeden.

## 3. Kan forbli syntetisk i neste tekniske bevis

- innlogging og brukeridentitet
- den viste samtalehistorikken
- genereringen av foreslåtte statuspunkter
- perioden og filtreringen av eksempeldata
- redigeringer og valg, så lenge de bare lever i den lokale økten
- forhåndsvisningen

Prototypen skal fortsatt være tydelig merket som konsept. Den skal ikke gi
inntrykk av at Viddel har lagret, analysert eller sendt reelle samtaler.

## 4. Må være reelt før et produksjonsløfte

Før funksjonen tilbys som en reell brukertjeneste må følgende være på plass:

1. **Eierskap og tilgang** — en autentisert bruker får bare tilgang til egne
   samtaler og egne statusutkast.
2. **Definert samtalekilde** — det er avklart hvilke samtaler som kan brukes,
   hvor de ligger, og hvordan valgt periode faktisk avgrenser dem.
3. **Sporbarhet** — hvert foreslått punkt kan føres tilbake til én eller flere
   kildesamtaler med dato.
4. **Brukerkontroll** — ingenting blir endelig, lagret eller sendt uten en
   tydelig brukerhandling.
5. **Feil- og tomtilstander** — manglende historikk, manglende treff og
   genereringsfeil håndteres uten å dikte innhold.
6. **Personvernramme** — behandlingsgrunnlag, informasjon til brukeren,
   lagringstid, sletting, tilgang og databehandlere er avklart.

## 5. Datagrense

Samtaletekst og avledede statuspunkter kan inneholde personlige og
helserelaterte opplysninger. De skal derfor ikke behandles som vanlig
produkttelemetri.

Kunnskapsdatastore og brukerdata er to forskjellige lag:

- **Kunnskapsdatastore** gir Viddel verifisert faglig grunnlag for svar.
- **Brukerdata** er samtaler, valgte perioder, redigeringer og avledede
  statuspunkter som tilhører en bruker.

Statusfunksjonen skal ikke skrive brukerdata inn i kunnskapsdatastore.
Telemetri skal følge eksisterende privacy-first-regel: ingen fritekst eller
identifiserbar samtalehistorikk som standard.

## 6. Arkitekturport før backend

GitHub #105 må avklare eller delegere følgende før persistens bygges:

- hvor samtaler og eventuelle utkast lagres
- om avledede statuspunkter lagres i det hele tatt
- tilgangs- og eierskapsmodell
- lagringstid og sletting
- hvilke modeller og databehandlere som behandler samtaleinnholdet
- samtykke, informasjonsplikt og nødvendig juridisk vurdering

Dette arbeidet kan spesifisere grensesnitt og testdata før #105, men skal ikke
snike inn en lagringsarkitektur gjennom prototypen.

## 7. Anbefalt første tekniske snitt

Etter denne porten kan det bygges ett avgrenset funksjonsbevis:

- en tydelig merket konseptflate
- et fast, syntetisk samtaledatasett
- deterministisk periodefiltrering
- statuspunkter med synlig kildesamtale og dato
- valg og redigering kun i lokal økt
- forhåndsvisning merket «Utkast · ikke sendt»

Snittet skal ikke ha database, reell brukerhistorikk, lagring, eksport eller
deling. Det validerer sammenhengen og kontrakten, ikke produksjonsarkitekturen.

## 8. Senere, separate beslutninger

Følgende skal ikke følge automatisk av denne CBA-en:

- lagring av utkast
- PDF, utskrift eller e-post
- deling med audiograf
- tilgang for klinikk eller fagsystem
- analyse av statusinnhold
- automatisk handling på vegne av brukeren

## 9. Foreslått beslutning

Godkjenn disse tre grensene samlet:

1. Neste tekniske bevis er ikke-persistent og bruker bare syntetiske data.
2. Sporbarhet fra statuspunkt til samtale og dato er et funksjonskrav.
3. Lagring, eksport og deling venter på egne beslutninger etter arkitekturport
   #105.
