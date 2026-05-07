# Viddel MVP Content Pack v0.1

Status: MVP content population source  
Eier: @knaus  
Operativ issue: #89  
Strukturert importkilde: `content/viddel/articles/viddel-mvp-content-pack-v0-1.mjs`

## Formål

Dette dokumentet er den menneskelig lesbare masteren for første komplette artikkelpakke til Viddel MVP.

Pakken er laget for å gi nok reelt innhold til:

- Storyblok-import
- reelle hubber
- forsidearbeid med faktisk innhold
- Article AI-overgang
- tidlig test av Hørehjelpen/RAG-gap

Dette er **ikke** endelig publiseringskvalitet for bred offentlig lansering.

## Publiseringsmodell

- **Repo** er versjonert arbeidsgrunnlag og importkilde.
- **Storyblok** er publiserings- og CMS-lag.
- **GitHub issue #89** er operativ oppfølging.
- **Google Drive** kan brukes som lesbar reviewflate ved behov, men bør ikke være teknisk importkilde.

## Filer

```text
content/viddel/articles/viddel-mvp-content-pack-v0-1.mjs
```

Strukturert content pack med:

- 5 hubber
- 12 artikler
- seksjoner
- next steps
- AI-seedspørsmål
- RAG-/kildenotater
- kvalitetsporter før offentlig publisering

```text
docs/content/viddel-mvp-content-pack-v0-1.md
```

Denne lesbare oversikten.

## Hubber

### Feilsøking og teknikk

Slug: `feilsoking-og-teknikk`

Artikler:

- `koble-horeapparatet-til-mobilen`
- `fa-slutt-pa-pipingen`
- `appen-finner-ikke-horeapparatet`
- `bare-lyd-i-ett-ore`
- `bytte-filter-uten-stress`

### Ny med høreapparat

Slug: `ny-med-horeapparat`

Artikler:

- `de-forste-ukene-med-horeapparat`
- `egen-stemme-hores-annerledes-ut`

### Bedre lyd i hverdagen

Slug: `bedre-lyd-i-hverdagen`

Artikler:

- `lyden-blir-slitsom-utpa-dagen`
- `for-restaurant-eller-stort-selskap`
- `audiograf-nar-det-haster`

### Pårørende og hjelpere

Slug: `parorende-og-hjelpere`

Artikler:

- `stotte-uten-a-ta-over-samtalen`

### Restart og mestring

Slug: `restart-og-mestring`

Artikler:

- `fra-skuff-til-daglig-bruk`

## Artikler

| Nr | Slug | Tittel | Hub |
|---:|------|--------|-----|
| 01 | `koble-horeapparatet-til-mobilen` | Koble høreapparatet til mobilen: steg som løser det meste | Feilsøking og teknikk |
| 02 | `fa-slutt-pa-pipingen` | Få slutt på pipingen: vanlige årsaker og raske grep | Feilsøking og teknikk |
| 03 | `de-forste-ukene-med-horeapparat` | De første ukene med høreapparat: dette er normalt | Ny med høreapparat |
| 04 | `lyden-blir-slitsom-utpa-dagen` | Prøv dette når lyden blir slitsom utpå dagen | Bedre lyd i hverdagen |
| 05 | `stotte-uten-a-ta-over-samtalen` | Slik støtter du uten å ta over samtalen | Pårørende og hjelpere |
| 06 | `appen-finner-ikke-horeapparatet` | Appen finner ikke høreapparatet: sjekkliste du kan gå gjennom nå | Feilsøking og teknikk |
| 07 | `bare-lyd-i-ett-ore` | Bare lyd i ett øre: før du ringer audiograf | Feilsøking og teknikk |
| 08 | `bytte-filter-uten-stress` | Bytte filter uten stress: en enkel rekkefølge | Feilsøking og teknikk |
| 09 | `egen-stemme-hores-annerledes-ut` | Egen stemme høres annerledes ut: hva som ofte ligger bak | Ny med høreapparat |
| 10 | `for-restaurant-eller-stort-selskap` | Før restaurant eller stort selskap: små grep som hjelper | Bedre lyd i hverdagen |
| 11 | `fra-skuff-til-daglig-bruk` | Fra skuff til daglig bruk: ett lite løfte du klarer | Restart og mestring |
| 12 | `audiograf-nar-det-haster` | Audiograf: når det haster, og hva du kan forberede | Bedre lyd i hverdagen |

## Kvalitetsstatus

Vurdert som godt nok for:

- Storyblok MVP content population
- IA-test
- hubbygging
- forsidearbeid
- Article AI-test
- tidlig RAG-gap-identifisering

Ikke vurdert som ferdig for bred offentlig publisering.

## Må følges opp før reell publisering

### 1. Fag-/sikkerhetssjekk

Sjekk spesielt formuleringer om:

- plutselig endret hørsel
- ensidig problem
- smerte
- trykk
- svimmelhet
- væske/fukt/fall
- grense mellom teknisk feilsøking og helsehjelp

### 2. Merke-/modellspesifikk kildekobling

Trenger kildegrunnlag for:

- appnavn og appflyt per merke
- iPhone/Android-paring
- Bluetooth/streaming-forskjeller
- filtertyper
- produsentvideoer
- dome, receiver, filter og lading

### 3. Hørehjelpen/RAG-klargjøring

Hørehjelpen må kunne svare presist når bruker oppgir:

- merke
- modell
- mobiltype
- app
- problemtype

Generiske artikkelråd må skilles fra modellspesifikk prosedyre.

### 4. Redaksjonell språkvask etter faktisk visning

Etter Storyblok-import bør tekstene vurderes i faktisk artikkeldesign:

- lesbarhet på mobil
- gjentakelser mellom artikler
- seksjonslengde
- rytme
- om hver artikkel har tydelig nok egen rolle i huben

### 5. Kildestatus

Avklar hvor kilder skal ligge:

- synlig i artikkel
- som intern redaksjonell note
- kun i Hørehjelpen/RAG

## Neste operative steg

1. Be Cursor lage Storyblok-importscript basert på `content/viddel/articles/viddel-mvp-content-pack-v0-1.mjs`.
2. Importer 5 hubber, 12 artikler og AI-seedspørsmål.
3. Verifiser at nye `/no/artikkel/<slug>`-ruter bygges.
4. Verifiser at hub-lenker peker til faktiske artikler.
5. Verifiser at seedspørsmål filtreres riktig per `related_article`.
6. QA mobilvisning og feltlengder i Storyblok.

## Avgrensning

Ikke bruk dette som signal om at tekstene er endelig publisert eller faglig ferdigstilt. Dette er en bevisst MVP-pakke for struktur, IA og testbarhet.
