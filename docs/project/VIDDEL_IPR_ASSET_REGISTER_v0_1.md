# Viddel IPR Asset Register v0.1

Status: Første inventory / ikke juridisk klassifisering  
Dato: 17. august 2026  
Parent: [#311](https://github.com/THUNDERPLUNDER/vox-web/issues/311)

## Bruk

Registeret brukes til å dokumentere hva verdien er, hvor den finnes, hvem som har bidratt, hvilke rettigheter som kan være relevante og hva som mangler før den kan behandles som kontrollert.

Statusverdier:

- **Kontrollert:** eierskap, kilde og håndtering er dokumentert.
- **Delvis:** hovedbildet er kjent, men ett eller flere bevis/avtaler mangler.
- **Åpen:** ikke tilstrekkelig kartlagt.
- **Parkert:** ikke verdt videre arbeid nå.

## Første inventory

| Verdi | Mulig vern/kontroll | Faktisk status | Viktigste åpne punkt | Anker |
|---|---|---|---|---|
| Navnet VIDDEL | Varemerke, foretaksnavn, domene, markedsføringsloven | Delvis | Likhetssøk, varer/tjenester og søker | [#312](https://github.com/THUNDERPLUNDER/vox-web/issues/312) |
| Viddel-domener | Domeneregistrering og avtaler | Delvis | Samlet eier-/fornyelsesoversikt | [#311](https://github.com/THUNDERPLUNDER/vox-web/issues/311) |
| Wordmark og lydstolper | Opphavsrett, figur-/kombinert merke, eventuelt design | Delvis; master ikke låst | Godkjent geometri, opphav, varianter og kommersiell bruk | [#121](https://github.com/THUNDERPLUNDER/vox-web/issues/121) |
| UI, ikoner og skjermbilder | Opphavsrett, eventuelt design, markedsføringsloven | Åpen | Kandidater og første offentliggjøringsdato | [#314](https://github.com/THUNDERPLUNDER/vox-web/issues/314) |
| Kildekode | Opphavsrett, avtaler, tilgangsstyring | Delvis | Bidrags-/leverandørrettigheter og lisensinventory | [#313](https://github.com/THUNDERPLUNDER/vox-web/issues/313) |
| Teknisk arkitektur og implementasjonsmåte | Know-how, forretningshemmeligheter, dokumentasjon og avtaler | Åpen | Hva er faktisk ikke-offentlig og kommersielt verdifullt? | [#313](https://github.com/THUNDERPLUNDER/vox-web/issues/313) |
| RAG-/kunnskapsoppsett og kvalitetsarbeid | Know-how, opphavsrett, avtaler, mulig hemmelighold | Åpen | Skill generisk teknikk fra Viddel-spesifikk metode | [#313](https://github.com/THUNDERPLUNDER/vox-web/issues/313) |
| Artikler, guider og redaksjonelle modeller | Opphavsrett, kilde- og lisensdokumentasjon | Delvis | Opphav, kildebruk og rettigheter per innholdsenhet | [#311](https://github.com/THUNDERPLUNDER/vox-web/issues/311) |
| Illustrasjoner, foto og grafiske assets | Opphavsrett og lisens | Åpen | Kilde, genereringsmåte, lisens, bruksområde og master | [#311](https://github.com/THUNDERPLUNDER/vox-web/issues/311) |
| Kunnskapsbase/databasestruktur | Mulig databasevern, opphavsrett, avtaler | Åpen | Dokumenter investering, struktur, verifisering og kilder | [#311](https://github.com/THUNDERPLUNDER/vox-web/issues/311) |
| Brukerprofil, historikk og aggregerte signaler | Avtaler, databasekontroll, personvern/governance | Åpen / fremtidig | Ikke bland databasevern med rett til persondata | [#311](https://github.com/THUNDERPLUNDER/vox-web/issues/311) |
| Brukerinnsikt og research-synteser | Opphavsrett, tilgang og avtalekontroll | Delvis | Kilde-/samtykkegrenser og riktig lagring | [#311](https://github.com/THUNDERPLUNDER/vox-web/issues/311) |
| Leverandør- og partneravtaler | Kontraktsrett og dokumentert IP-eierskap | Åpen | Mal og review før ekstern utvikling | [#313](https://github.com/THUNDERPLUNDER/vox-web/issues/313) |
| Merkevareomdømme og relasjoner | Faktisk markedsposisjon, avtaler og markedsføringsloven | Tidlig | Ikke overdriv etablert vern eller markedsposisjon | [#311](https://github.com/THUNDERPLUNDER/vox-web/issues/311) |

## Felt som skal fylles ved senere oppdateringer

For en konkret asset eller asset-gruppe:

```text
Asset-ID:
Navn:
Beskrivelse:
Forretningsverdi:
Repo-/Drive-/systemplassering:
Opphavere/bidragsytere:
Eier/rettighetshaver:
Tredjepartsmateriale og lisens:
Første opprettelsesdato:
Første offentliggjøringsdato:
Konfidensialitetsnivå:
Tilgangsgruppe:
Mulig vern:
Bevis/dokumentasjon:
Risiko/uklarhet:
Beslutning:
Neste reviewdato:
Relatert issue:
```

## Dokumentasjonsprinsipper

- Behold versjonshistorikk og originalfiler der det er relevant.
- Dokumenter bidragsytere og rettighetsoverdragelse, også for underleverandører.
- Dokumenter tredjepartskilder og lisensvilkår før gjenbruk.
- Dokumenter vesentlig arbeid med innsamling, verifisering og strukturering av databaser.
- Ikke merk informasjon som forretningshemmelighet uten å håndtere den deretter.
- Ikke legg personopplysninger eller rå brukerdata i dette registeret.

