# Viddel IPR External Development Gate v0.1

Status: Kontrakts- og tilgangssjekkliste / krever juridisk tilpasning  
Dato: 17. august 2026  
Operativt anker: [GitHub issue #313](https://github.com/THUNDERPLUNDER/vox-web/issues/313)

## Portregel

Et eksternt team skal ikke få tilgang til ikke-offentlig kode, modeller, data, arkitektur eller forretningssensitiv dokumentasjon før denne porten er gjennomgått og avvik er eksplisitt godkjent av Thomas og Vibeke.

Dette dokumentet er en bestillings- og review-sjekkliste, ikke en ferdig kontrakt.

## A. Partene og leveransen

- [ ] Juridisk selskapsnavn, organisasjonsnummer, adresse og signaturmyndighet er bekreftet.
- [ ] Alle faktiske underleverandører er oppgitt.
- [ ] Leveransen, milepælene og akseptkriteriene er presise.
- [ ] Det er tydelig hva som er kundens eksisterende materiale og leverandørens eksisterende materiale.
- [ ] Leverandøren kan ikke endre team eller underleverandører uten avklart prosess.

## B. Eierskap og rettigheter

- [ ] Viddel AS får nødvendige, dokumenterte rettigheter til all betalt leveranse.
- [ ] Omfanget dekker kildekode, dokumentasjon, design, tester, konfigurasjon, scripts, modeller, prompts og datastrukturer når relevant.
- [ ] Retten inkluderer bruk, endring, videreutvikling, drift, overføring og bruk av annen leverandør.
- [ ] Rettighetene fra ansatte og underleverandører flyter videre til Viddel AS.
- [ ] Eventuelle unntak fra full overdragelse er listet eksplisitt.
- [ ] Tidspunktet for rettighetsovergang og sammenheng med betaling er tydelig.
- [ ] Leverandøren garanterer at leveransen ikke bevisst krenker tredjepartsrettigheter.

## C. Tredjepartssoftware og open source

- [ ] Alle tredjepartskomponenter registreres med navn, versjon, kilde og lisens.
- [ ] Komponenter med copyleft eller andre videreføringskrav er eksplisitt vurdert.
- [ ] Betalte tjenester/API-er har dokumenterte vilkår, konto-eier og kostnad.
- [ ] Ingen kritisk komponent er bundet til leverandørens private konto.
- [ ] Software bill of materials eller tilsvarende inventory leveres når omfanget tilsier det.

## D. Konfidensialitet og forretningshemmeligheter

- [ ] Konfidensiell informasjon er definert bredt nok, men praktisk forståelig.
- [ ] Tilgang gis etter need-to-know.
- [ ] Deling med underleverandører krever tilsvarende konfidensialitetsforpliktelse.
- [ ] Repo, dokumenter, hemmeligheter og produksjonsdata ligger i Viddel-kontrollerte systemer når mulig.
- [ ] Logging og tilgangshistorikk er mulig der risikoen tilsier det.
- [ ] Retur/sletting ved avslutning er regulert og kan bekreftes.
- [ ] Unntak for offentlig, tidligere kjent eller lovlig mottatt informasjon er håndtert.

## E. Data og personvern

- [ ] Det er avklart om leverandøren behandler personopplysninger.
- [ ] Databehandleravtale og instruks finnes før behandling starter når nødvendig.
- [ ] Datakategorier, behandlingssted og eventuelle overføringer ut av EØS er dokumentert.
- [ ] Reelle brukerdata brukes ikke i utvikling/test uten eksplisitt godkjenning og rett grunnlag.
- [ ] Syntetiske eller anonymiserte testdata brukes der det er mulig.
- [ ] Leverandøren kan ikke bruke Viddels data til egne modeller, trening eller produktforbedring uten eksplisitt avtale.

## F. Repo, drift og sikkerhet

- [ ] Canonical repo og branch-regler eies/kontrolleres av Viddel.
- [ ] Minst mulig tilgang gis, med navngitte personkontoer og MFA.
- [ ] Secrets deles gjennom godkjent mekanisme, ikke i chat, e-post eller kode.
- [ ] Produksjonstilgang er separat, tidsavgrenset og eksplisitt godkjent.
- [ ] Sikkerhetshendelser og varslingsfrister er regulert.
- [ ] Backup, gjenoppretting og avhengigheter er dokumentert.

## G. Kvalitet, aksept og overlevering

- [ ] Definition of done inkluderer tester, dokumentasjon og byggbar kode.
- [ ] Viddel kan kjøre, bygge og videreutvikle løsningen uten leverandørens private miljø.
- [ ] Hver milepæl har akseptfrist og rett til feilretting.
- [ ] Åpne feil, teknisk gjeld og avvik leveres skriftlig.
- [ ] Sluttoverlevering inkluderer repo, dokumentasjon, kontoer, nøkler, lisensinventory og kjente risikoer.
- [ ] Exit kan gjennomføres uten urimelig leverandørlås.

## H. Kommersielle og juridiske vilkår

- [ ] Pris, valuta, skatt, fakturering og milepæler er entydige.
- [ ] Endringsordre krever skriftlig godkjenning.
- [ ] Forsinkelse, vesentlig mislighold og avslutning er regulert.
- [ ] Ansvar, begrensninger og eventuelle forsikringer er vurdert.
- [ ] Lovvalg, verneting/tvist og kontraktsspråk er forstått.
- [ ] Juridisk review er gjennomført eller eksplisitt vurdert som unødvendig av ansvarlig beslutningstaker.

## I. Beslutning før tilgang

```text
Leverandør:
Leveranse:
Avtaleversjon/dato:
Åpne avvik:
Akseptert risiko:
Tilgang som kan gis:
Tilgang som ikke kan gis:
Databehandleravtale nødvendig: ja/nei/uavklart
Juridisk review: gjennomført/planlagt/ikke bestilt
Godkjent av Thomas:
Godkjent av Vibeke:
Godkjenningsdato:
Relatert GitHub issue/PR:
```

## Avgrensning

- Denne porten avgjør ikke produkt-scope eller leverandørvalg.
- Den erstatter ikke sikkerhets-, personvern- eller arkitekturreview.
- Den skal tilpasses leveransens faktiske risiko; ikke alle punkter krever samme tyngde.
- Ingen signering eller tilgangsgivning utføres fra GitHub-issuen alene.

