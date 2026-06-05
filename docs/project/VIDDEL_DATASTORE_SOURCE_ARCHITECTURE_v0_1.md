# Viddel datastore / source architecture v0.1 — verified insight system

Status: Arbeidsdokument / arkitektur v0.1  
Dato: 2026-06-05  
Koblet til: [#226](https://github.com/THUNDERPLUNDER/vox-web/issues/226), [#217](https://github.com/THUNDERPLUNDER/vox-web/issues/217), [#222](https://github.com/THUNDERPLUNDER/vox-web/issues/222), [#225](https://github.com/THUNDERPLUNDER/vox-web/issues/225)  
Scope: Kilde- og innsiktslag **før** datastore-import eller Drive-reorganisering  

---

## 1. Kort konklusjon

### Anbefaling v0.1

1. **Behold `INSIGHT_HEARING_AID` som rå kildepool** — ikke flytt eller importer filer ennå.
2. **Etabler et menneskelig source registry** (Google Sheet v0.1) som peker på Drive-filer og deres **verifikasjonsstatus**.
3. **Jobb kun gjennom innsiktskjeden** — raw → extracted → reviewed → canonical → datastore-ready — aldri direkte fra lange manualer til Agent Search.
4. **Start med 5–7 små, kuraterte canonical guidance-docs** som første kandidatpakke; importer dem først når metadata og QA-rutine er på plass.
5. **Hold repo-dokumentet her som arkitektur**; bruk repo YAML/JSON kun senere for faktisk `datastore_ready`-assets hvis import krever det.

### Hva bør ikke gjøes nå

- Importere hele `HEARING_AID_MANUALS` eller `01_ORIGINALS` rått til Google Agent Search / Discovery Engine.
- Destruktiv reorganisering av Drive uten registry og eier.
- Endre backend, env, response contract eller PostHog som del av dette arbeidet.
- Behandle Deep Research-notater, transkripsjoner eller produsentmanualer som «ferdig Viddel-veiledning».
- Anta at dagens chat-kvalitet løses av mer råkilde — kvaliteten avhenger av **hva** som er datastore-ready og **hvordan** det er merket.

---

## 2. Dagens observerte kildebilde (safe-read)

Dette avsnittet beskriver kun det som er observert i safe-read — ikke full inventar eller juridisk vurdering av innhold.

### `INSIGHT_HEARING_AID` (root)

**Rolle i v0.1:** Blandet kildepool — nyttig, men uferdig strukturert.

Observert innholdstyper:

- PDF-er og Google Docs
- Høreapparatrelatert stoff
- Aktør-/økosystemmateriale
- Policy- og støttedokumenter
- Researchnotater og arbeidsnotater

**Konsekvens:** Mappen er verdifull som **inntak**, men uegnet som enhetlig «sannhet» uten lagring av status, eier og scope per dokument.

### `HEARING_AID_MANUALS`

**Rolle i v0.1:** Manual- og systemstoff — høy detalj, høy risiko for manualdump hvis brukt rått.

Observert (ikke uttømmende):

- `Hørehjelpen – Instruksjonsprinsipper for Tool-bruk og Hallusinasjonskontroll`
- `Høreomsorg Systemmanual: Phonak, Oticon, ReSound v01`
- `01_ORIGINALS`
- `02_SONIC_KNOWLEDGE`

**Konsekvens:** Inneholder både **metode/prinsipper** (potensielt nyttig for canonical guidance) og **produsentspesifikke manualer** (kun raw eller extracted — ikke canonical uten review).

### `01_ORIGINALS`

**Rolle i v0.1:** Produsentorganiserte originalmanualer / primærkilder.

Observert produsentmapper:

- Oticon
- Phonak
- ReSound

**Konsekvens:** Riktig sted for **raw originals** — feil sted å hente «generell Viddel-veiledning» fra uten uttrekk og review.

### `02_SONIC_KNOWLEDGE`

**Rolle i v0.1:** Tolket / bearbeidet kunnskap (navn antyder Sonic-spor eller bearbeidingslag).

**Konsekvens:** Kan ligne **extracted notes** eller **provisional insight**, men status er uklar uten registry. Skal ikke antas verifisert uten eksplisitt merking.

### Hva safe-read *ikke* bekrefter

- Full filliste, versjoner eller datoer per dokument
- Hvilke dokumenter som faktisk er indeksert i Agent Search i dag
- Juridisk grunnlag for viderebruk av hvert enkelt dokument
- Om innhold er oppdatert i forhold til dagens produktlinjer

---

## 3. Problem med å bruke materialet rått

| Risiko | Hva skjer i chat |
|--------|------------------|
| **Manualdump** | Lange, ufiltrerte avsnitt fra produsentmanualer dominerer svaret |
| **Motstridende produsentråd** | Oticon vs Phonak vs ReSound gir ulike steg uten prioritet |
| **Gamle produktmanualer** | Modellspesifikke steg som ikke matcher brukerens situasjon |
| **Uklar kildeprioritet** | Agent Search finner «noe relevant» uten å vite hva som er kanonisk |
| **Manglende skille rå vs Viddel** | Brukeren får manualtone, ikke Viddel-veiledning |
| **Vanskelig oppdatering** | Nye intervjuer, stakeholderinnsikt eller manualer har ingen definert inngangsport |

**Kobling til #217:** Response contract v0.1 reduserer *form* (korthet, tone, Markdown). Source architecture v0.1 adresserer *innhold* (hva som skal hentes og med hvilken status).

---

## 4. Foreslått kunnskapsmodell

```text
Raw source
  → extracted note
  → reviewed insight
  → canonical Viddel guidance
  → datastore-ready asset
```

Kun **datastore-ready assets** (og i noen tilfeller **canonical guidance** eksportert strukturert) skal inn i Agent Search / Discovery Engine datastore. Alt annet lever i Drive + registry med tydelig status.

---

## 5. Forklaring av hvert lag

### Raw originals

**Hva:** Manualer, PDF-er, policy-docs, transkripsjoner, stakeholder-notater, researchnotater — uendret eller «som mottatt».

**Hvor:** Drive (`INSIGHT_HEARING_AID`, `01_ORIGINALS`, …).

**Regel:** Lesbar referanse og uttrekksgrunnlag — **aldri** direkte chat-svar uten pipeline.

### Extracted notes

**Hva:** Korte claims, prosedyrer, observasjoner eller sitater trukket ut fra raw med peker til kilde (side/avsnitt/Drive-id).

**Format:** Google Doc, Sheet-rad, eller kort markdown-notat i repo — **ikke** datastore ennå.

**Regel:** Én note = ett eller få relaterte utsagn; merkes `extracted` eller `provisional_insight`.

### Verified insight cards

**Hva:** Reviewede innsiktsenheter: «Dette mener vi er sant/nyttig i denne situasjonen», med scope, confidence, kildehenvisning og reviewer.

**Format:** Sheet-rad + ev. kort Doc-mal; kan senere bli YAML/JSON.

**Regel:** Må ha `reviewed_insight` (eller eksplisitt `provisional_insight` med begrenset bruk).

### Canonical Viddel guidance

**Hva:** Viddel-skrevet veiledning basert på reviewed insight — **ikke** kopi av manual.

**Kjennetegn:** Norsk, handlingsrettet, merke-/modell-agnostisk der mulig, i tråd med response contract v0.1, med tydelig «neste steg» og begrenset produsentjargong.

**Regel:** Oppdateres når reviewed insight endres; versjoneres via registry + issue/PR.

### Datastore-ready assets

**Hva:** Korte, strukturerte dokumenter/chunks designet for retrieval: tittel, situasjon, steg, metadata, få nok tekst til å svare uten dump.

**Format:** Strukturert markdown eller JSON/YAML for import; metadata obligatorisk.

**Regel:** Kun `datastore_ready` etter QA-spørsmål mot `/no/chat` (metadata-only reliability der det passer).

---

## 6. Metadata v0.1

Feltnavn på engelsk (datastore-vennlig); forklaring på norsk.

```yaml
id:                    # Unik stabil id, f.eks. viddel-guidance-bluetooth-pair-v01
title:                 # Menneskelig tittel
source_type:           # manual | policy | interview | stakeholder | viddel_authored | research | other
brand:                 # phonak | oticon | resound | generic | unknown | multi
product_or_model:      # Valgfri modell/app — tom hvis generell
situation:             # f.eks. bluetooth_pairing | restaurant_noise | tv_audio | before_audiologist
user_stage:            # new_user | daily_use | troubleshooting | advanced | helper
verification_status:   # se kap. 7
confidence:            # high | medium | low | unknown
last_reviewed:         # ISO-dato
reviewer:              # eier / reviewer (navn eller rolle)
source_url_or_drive_id: # Drive file id eller URL — aldri hemmelighet i repo
related_issue:         # GitHub issue, f.eks. #226
update_trigger:        # Hva skal utløse re-review (ny manual, nytt intervju, QA-feil, …)
notes:                 # Korte interne notater — ikke bruker-svar
```

**v0.1-minimum:** `id`, `title`, `verification_status`, `source_url_or_drive_id`, `last_reviewed`, `reviewer`, `situation`.

**Senere (valgfritt):** `chunk_strategy`, `datastore_import_id`, `deprecated_reason`, `supersedes_id`.

---

## 7. Verifikasjonsstatus

| Status | Betydning | Kan brukes i chat/datastore? |
|--------|-----------|------------------------------|
| `raw_original` | Ubehandlet fil i Drive | **Nei** — kun referanse/uttrekk |
| `extracted` | Uttrekk gjort, ikke vurdert | **Nei** — intern arbeidsflate |
| `provisional_insight` | Hypotese / tidlig innsikt | **Nei** i prod — ev. begrenset intern test |
| `reviewed_insight` | Menneske har reviewet mot kilde | **Nei** direkte — input til canonical |
| `canonical_guidance` | Godkjent Viddel-tekst | **Ja** etter eksport til datastore-ready |
| `datastore_ready` | Importert/klar for Agent Search | **Ja** — eneste anbefalte prod-kilde |
| `deprecated` | Erstattet eller feil | **Nei** — behold i registry for historikk |

**Overgang:** Status endres bare fremover i kjeden + `deprecated`; aldri hopp fra `raw_original` til `datastore_ready`.

---

## 8. Registry-anbefaling

### Alternativer vurdert

| Format | Fordeler | Ulemper |
|--------|----------|---------|
| **Google Sheet** | Lav terskel, delbar med Thomas/Vibeke/@rigger, filtrering på status/brand | Svak versjonering, ingen PR-review |
| **Google Doc** | God for prose og retningslinjer | Dårlig tabell/query for mange assets |
| **Repo YAML/JSON** | Versjonert, PR-review, CI-vennlig | Tungt for ikke-dev; krever commit for hver endring |
| **Hybrid** | Best of both | Krever disiplin om «source of truth» |

### Anbefaling v0.1 (eksplisitt)

**Hybrid — med tydelig ansvar:**

1. **Google Sheet = operativt source registry (menneskelig sannhet)**
   - Én rad per raw file, extracted note, insight card, canonical doc eller datastore asset
   - Kolonner matcher metadata v0.1
   - Eier: Thomas / innhold — med @navigator for prioritering

2. **Dette repo-dokument = arkitektur og regler**
   - Endres via PR (#226, oppfølging)
   - Lenker til Sheet (URL i issue/Backstage når opprettet — ikke hardkode secrets)

3. **Repo YAML/JSON = senere, kun for `datastore_ready`**
   - Når første import-test til Agent Search skal gjøres
   - Én fil per asset eller én manifest — besluttes i oppfølgingsissue

**Hvorfor ikke bare repo:** Registry må være lett å oppdatere når Drive-materiale oppdages uten å vente på deploy. **Hvorfor ikke bare Sheet:** Arkitektur og «hva som ikke skal inn rått» må være versjonert og synlig for Cursor.

---

## 9. Foreslått Drive-modell (uten å flytte filer nå)

**Prinsipp:** Ingen destruktiv reorganisering i v0.1. Eksisterende mapper beholdes; **registry** sier hva som er hva.

### Midlertidig (nå)

- `INSIGHT_HEARING_AID` = blandet intake / raw pool
- `HEARING_AID_MANUALS/01_ORIGINALS/{Oticon,Phonak,ReSound}` = raw originals (merkes i Sheet)
- `02_SONIC_KNOWLEDGE` = antatt extracted/provisional — **må verifiseres og merkes**

### Målstruktur (senere, etter beslutning)

```text
INSIGHT_HEARING_AID/
  00_INTAKE_RAW/           # Nytt usort materiale
  01_ORIGINALS/            # Beholdes / speiler dagens produsentmapper
  02_EXTRACTED_NOTES/
  03_VERIFIED_INSIGHTS/
  04_CANONICAL_GUIDANCE/
  05_DATASTORE_READY/
  99_ARCHIVE/
```

**Migrering:** Flytt kun når registry har fanget eksisterende filer og eier har godkjent — issue for egen oppgave.

---

## 10. Første kandidatpakke for datastore v0.1

**Ikke importer.** Foreslått prioritert sett (5–7 assets) — små, situasjonsbaserte, merke-agnostiske der mulig:

| # | Asset (arbeidstittel) | `situation` | Begrunnelse |
|---|------------------------|-------------|-------------|
| 1 | **Generell Viddel-veiledning — hvordan svaret skal hjelpe** | `general_guidance` | Forankrer tone/handling; speiler response contract v0.1 |
| 2 | **App / Bluetooth — finne og koble høreapparat** | `bluetooth_pairing` | Høy chat-volum; #217 QA-dekning |
| 3 | **TV / lyd / streaming — utydelig eller for høy lyd** | `tv_audio` | Typisk brukerproblem; unngå manualdump |
| 4 | **Restaurant og støy — situasjonsmestring** | `restaurant_noise` | Ikke-produsentspesifikk mestring |
| 5 | **Før audiograf — huskeliste og kort beskrivelse** | `before_audiologist` | Kobler til contract om audiograf kun når relevant |
| 6 | **Usikker bruker — «vet ikke merke/modell»** | `unknown_device` | Dekker #217 oppfølgingsspørsmål |
| 7 | **Pårørende / hjelper — støtte uten å ta over** | `helper_support` | Egen persona; kort og respektfull |

**Rekkefølge:** 1 → 2 → 4 → 6 (rask chat-effekt) → deretter 3, 5, 7.

---

## 11. Update workflow

```text
1. Råkilde legges til (Drive intake / eksisterende mappe)
2. Kilden registreres i Google Sheet (status: raw_original)
3. Relevante claims/instruksjoner trekkes ut → extracted note (status: extracted)
4. Innsikt vurderes → provisional_insight eller reviewed_insight
5. Canonical Viddel guidance skrives/oppdateres (status: canonical_guidance)
6. Datastore-ready asset produseres + metadata full (status: datastore_ready)
7. QA-spørsmål kjøres mot /no/chat (metadata-only der mulig)
8. Return Ticket på GitHub dokumenterer endring + registry-rad
```

**Roller (forslag):**

- **@rigger / Thomas:** registry, Drive-peker, import-test
- **Innhold / Vibeke:** canonical tekst, review
- **@navigator:** prioritering, aksept for prod-import
- **Cursor:** repo-assets, manifest, QA-scripts — ikke innholdsbeslutning alene

---

## 12. Hva som ikke skal inn rått

| Materiale | Hvorfor ikke |
|-----------|--------------|
| Lange produsentmanualer | Manualdump, modell-støy, utdaterte steg |
| Transkripsjoner (intervju/workshop) | Kontekst, persondata, uverifiserte påstander |
| Uferdige researchnotater | Hypoteser uten review |
| Kilder uten dato eller opphav | Kan ikke re-reviewes eller deprecates |
| Motstridende råd uten prioritet | Oticon vs Phonak uten `brand` + status |
| Medisinsk eller juridisk råd uten avklaring | Utenfor Viddel-scope uten ekspert-review |
| `Høreomsorg Systemmanual` som helhet | Kan brukes til **extracted** — ikke som én datastore-fil |
| Policy/støttedokumenter uten situasjonsfilter | For bredt for retrieval |

---

## 13. Anbefalt neste steg (oppfølgingsissues)

| # | Forslag | Formål |
|---|---------|--------|
| **A** | **Source registry v0.1 (Google Sheet)** | Operativ liste over Drive-filer + status; mal-rader for kandidatpakken |
| **B** | **Første 3–5 canonical Viddel guidance docs** | Skriv i `04_CANONICAL_GUIDANCE` (Drive) eller repo `docs/guidance/` — ikke importer |
| **C** | *(Senere)* **Agent Search import-test** | Én `datastore_ready` asset + QA — eget issue etter A+B |

**Issue-titler (forslag):**

- «Source registry v0.1 — Google Sheet for INSIGHT_HEARING_AID»
- «Canonical Viddel guidance v0.1 — first 5 situational assets»

---

## 14. Relasjon til eksisterende docs

| Dokument | Relasjon |
|----------|----------|
| `VIDDEL_HEARING_AID_DATA_ECOSYSTEM_v0_1.md` | Langsiktig økosystem — dette doc er **operativt kilde-lag nå** |
| `VIDDEL_MANUFACTURER_DATA_MATRIX_SOURCE_QA_v0_1.md` | Produsent-kilde-QA — bruk ved **extracted/reviewed** for merke-spesifikke claims |
| `GOOGLE_AGENT_SEARCH_DIRECT_KNOWN_GOOD_v0_1.md` | Transport/backend — **uendret** av dette doc |
| Backstage `/backstage/` AI-chat seksjon | Runtime/config — ikke datastore-innhold |

---

## 15. Åpne spørsmål

1. **Hva er faktisk indeksert i Agent Search datastore i dag?** (krever GCP/console safe-read — eget issue)
2. **Eies `02_SONIC_KNOWLEDGE` som extracted eller provisional?** (avklares i registry)
3. **Skal canonical guidance ligge i Drive, repo, eller begge?** (v0.1: Drive for prose, repo for arkitektur + ev. import-manifest)
4. **Hvem signerer `reviewed_insight` → `canonical_guidance`?** (Thomas + Vibeke? @navigator for prod?)
5. **Chunk-strategi for import** — ett doc per situasjon vs flere chunks (besluttes ved issue C)

---

## 16. @navigator review?

**Ja — anbefalt**, men smalt:

- Bekreft prioritering av kandidatpakke (§10)
- Bekreft hybrid registry (Sheet + repo)
- Avklar om prod-import av datastore skal gates på egen beslutning etter canonical docs finnes

Ikke nødvendig for å merge dette arkitektur-doc; nødvendig **før** første datastore-import.

---

*End of document — v0.1*
