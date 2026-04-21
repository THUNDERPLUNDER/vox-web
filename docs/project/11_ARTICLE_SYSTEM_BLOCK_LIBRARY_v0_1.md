# 11_ARTICLE_SYSTEM_BLOCK_LIBRARY_v0_1

Kort kontraktutkast for blokkbibliotek i article system v0.1 (child task #50 under epic #46).

## Scope i denne leveransen
- Definerer foreslaatte blokker og status (obligatorisk/valgfri/eksperimentell).
- Skiller tydelig mellom innholdsblokk, metadatafelt og AI-lag.
- Gir foreloepig preset-fit (Standard, Faglig Fokus, Minimal).
- Lister aapne spoersmaal foer preset-regler laases.

Ikke i scope: UI-redesign, ferdig metadata-kontrakt, artikkelskriving, template-kode.

## A. Innholdsblokker (editorielt synlig lag)

| Blokk | Funksjon (kort) | Status v0.1 | Standard | Faglig Fokus | Minimal |
|---|---|---|---|---|---|
| Hodeseksjon | Setter kontekst, tittel og ingress for artikkelen. | **Obligatorisk** | Ja | Ja | Ja (kompakt) |
| Tillitsboks | Tydeliggjoer kilde/trygghet/forbehold i leseflaten. | **Valgfri** | Ja (naar relevant) | Ja (anbefalt) | Nei (som hovedregel) |
| Broedtekst | Kjerneinnhold i loepende seksjoner/avsnitt. | **Obligatorisk** | Ja | Ja | Ja (kort) |
| Figur / illustrasjon | Visuell stoette (forklaring, forenkling, eksempel). | **Valgfri** | Ja | Ja (anbefalt) | Nei (som hovedregel) |
| Sidespalte / rail | Supplerende kontekst, definisjoner, lenker, fakta. | **Valgfri** | Valgfri | Ja (hyppig) | Nei |
| Bunnseksjon | Avslutning med oppsummering/videre steg/henvisning. | **Obligatorisk** | Ja | Ja | Ja (kort) |

## B. Metadatafelt (ikke innholdsblokk)

Disse er felt for styring/indeksering og skal ikke behandles som layoutblokker:
- Identifikasjon: slug/id, versjon, publiseringsstatus.
- Redaksjonelt: forfatter, dato, revisjon, tema/taksonomi.
- Presentasjon: preset-maal, eventuell visningsmodus.
- Kilde-/compliance-felt: kildehenvisning, forbehold, sporbarhet.

Status v0.1: **Foreloepig** (ikke laast i denne oppgaven).

## C. AI-lag / AI-seed-relasjon (ikke vanlig innholdsblokk)

| Element | Rolle | Status v0.1 | Notat |
|---|---|---|---|
| AI-forslag | Kandidatinnhold fra AI (tekstforslag, vinkling, varianter). | **Eksperimentell** | Skal ligge i AI-lag, ikke som standard synlig artikkelblokk. |
| AI-seed-relasjon | Kobling mellom seed/promptgruppe og blokkutfall. | **Eksperimentell** | Brukes til styring/sporbarhet, ikke som erstatning for redaksjonell blokkstruktur. |

Prinsipp: AI-laget er et hjelpelag over grammar, ikke en egen primar artikkeltype i v0.1.

## D. Foreloepig preset-fit (operativ lesing)

- **Standard:** hodeseksjon, broedtekst, bunnseksjon; tillitsboks/figur/sidespalte ved behov.
- **Faglig Fokus:** samme kjerne som Standard, men oftere tillitsboks + figur + sidespalte.
- **Minimal:** hodeseksjon, kort broedtekst, kompakt bunnseksjon; normalt uten sidespalte og med faerre ekstra moduler.

## E. Aapne spoersmaal foer preset-regler kan laases

1. Minstekrav per preset: eksakt obligatorisk blokksett per preset (særlig Minimal).
2. Tillitsboks-regel: naar er den krav vs anbefaling (tema- eller risikobasert)?
3. Figur-regel: naer skal figur kreves i Faglig Fokus?
4. Rail-regel: hvilken informasjon er tillatt i sidespalte vs hovedbroedtekst?
5. AI-lag synlighet: hvilke AI-resultater kan vises for bruker, og under hvilke vilkaar?
6. Metadata minimum: hvilket minste metadata-sett maa til for stabil preset-kjoering?
