# Editorial Image Library v0.2

## Hva dette er

Editorial Image Library v0.2 er en enkel, webklar kandidatbank for Viddel MVP-artikler. Den gjør Thomas' sorterte Midjourney-bilder tilgjengelige i repoet uten å være et fullverdig DAM, upload-system eller VIS Asset Registry.

## Prinsipp

- Google Drive / lokal arbeidsmappe er kilde for originaler og arbeidsmateriale.
- Repoet inneholder bare optimaliserte, webklare kandidatbilder.
- Originaler slettes ikke og endres ikke av importen.
- Eksisterende publiserte bilder på `/no/bedre-lyd/` er ikke rekomprimert eller byttet.
- Senere VIS Asset Registry v0.1 kan lese manifestet i `src/data/assets/editorial-image-library.ts`.

## Kilde

Bildene i v0.2 er importert fra Thomas' sorterte lokale Drive-synkede mappe:

```text
/Users/thomas26/Library/CloudStorage/GoogleDrive-raddum@gmail.com/My Drive/[@OMNI_OS]/80_JOBB_PROSJEKTER /2026.02.15 business model hørsel/Bilder/viddel-kontaktark/inbox
```

Kun disse sorterte undermappene er importert:


| Gruppe            | Antall |
| ----------------- | ------ |
| `car`               | 5      |
| `city-life-cafe`    | 73     |
| `hearing-aid-box`   | 6      |
| `listening-music`   | 9      |
| `quiet-home`        | 24     |
| `social`            | 15     |
| `tv`                | 55     |


## Mappestruktur i repo

```text
public/images/editorial/library/
  car/
  city-life-cafe/
  hearing-aid-box/
  listening-music/
  quiet-home/
  social/
  tv/
```

## Naming convention

Filer navngis per gruppe med tre sifre:

```text
viddel-car-001.webp
viddel-city-life-cafe-001.webp
viddel-hearing-aid-box-001.webp
viddel-listening-music-001.webp
viddel-quiet-home-001.webp
viddel-social-001.webp
viddel-tv-001.webp
```

Tallene er løpenummer innenfor sortert kildegruppe. Filnavnet er stabilt nok for MVP-kandidatbruk, men ikke en endelig asset-ID-strategi.

## v0.2 import

- Nye bilder importert: 14.
- Totalt i biblioteket etter import: 187.
- Kun sorterte undermapper er importert. Løse filer direkte fra inbox er fortsatt ikke importert.
- Duplikater er filtrert bort med `sourceFilename` fra manifestet.
- Ingen public pages er endret.

| Gruppe | Nye | Totalt |
| ------ | --- | ------ |
| `car` | 0 | 5 |
| `city-life-cafe` | 0 | 73 |
| `hearing-aid-box` | 0 | 6 |
| `listening-music` | 5 | 9 |
| `quiet-home` | 0 | 24 |
| `social` | 9 | 15 |
| `tv` | 0 | 55 |

## Manifest

Manifestet ligger her:

```text
src/data/assets/editorial-image-library.ts
```

VIS Asset Browser v0.1 finnes på `/vis/assets/editorial/` og leser manifestet.
VIS-forsiden er oppdatert med inngang til browseren og dagens MVP-flater. Senere bør `/vis/` genereres fra et lite registry i stedet for manuelt kuraterte kort.

Hver entry har:

- `id`
- `group`
- `title`
- `status`
- `webPath`
- `sourceFilename`
- `possibleUses`
- `notes`
- `alt`

## Statusverdier

Foreløpig finnes bare én status:


| Status      | Betydning                                                                        |
| ----------- | -------------------------------------------------------------------------------- |
| `candidate` | Webklart kandidatbilde. Må QA-es visuelt før publisering i artikkel eller flate. |


## Importregler v0.2

- Importer kun sorterte mapper, ikke usortert inbox-innhold.
- Ikke importer kontaktark.
- Ikke importer åpenbare systemfiler.
- Konverter til WebP.
- Maks bredde ca. 1600 px.
- Behold aspect ratio.
- Bruk trygg WebP-kvalitet (`quality=84`).
- Ikke slett eller endre originaler.
- Ikke rekomprimer eksisterende production-bilder uten grunn.

## Hvordan nye bilder legges inn

1. Thomas sorterer nye originaler i riktig lokal/Drive-mappe.
2. Importer bare godkjente sorterte mapper, ikke usortert inbox.
3. Konverter nye bilder til WebP under riktig `public/images/editorial/library/<gruppe>/`.
4. Bruk neste ledige løpenummer i gruppen.
5. Legg én ny entry per bilde i `src/data/assets/editorial-image-library.ts`.
6. Sett `status: "candidate"` til bildet er valgt og QA-et for konkret bruk.
7. Oppdater antall og eventuelle notater i dette dokumentet.

## Senere

VIS Asset Registry v0.1 kan bygges senere på manifestet med original, prompt, rolle, artikkel, crop og faktisk bruk. Det er bevisst ikke gjort i denne v0.1-importen.
