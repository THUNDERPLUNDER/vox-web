# 10_ROADMAP_TIMELINE_METADATA_v0_1

## Formål
Etablere minste byggbare metadata-grunnmur for roadmap timeline v0.1 (issue #21), uten UI-bygging.

## Besluttet modell (hybrid)
- Nivå 1 (Spor): repo-manifest
- Nivå 2 (Initiativ): GitHub issue body metadata
- Nivå 3 (Oppgave): GitHub issue body metadata

GitHub er source of truth for initiativ/oppgaver. VIS er read model.

## Foreslått filplassering
- Spor-manifest:
  - `docs/project/roadmap_timeline_lanes.v0.1.json`
- Metadataformat + templates:
  - `docs/project/10_ROADMAP_TIMELINE_METADATA_v0_1.md` (denne filen)

Begrunnelse:
- Ligger sammen med annen operativ prosjektdokumentasjon.
- Liten, lesbar og enkel å utvide senere.
- Ingen ny database eller tung struktur.

## Issue body metadataformat (v0.1)
Metadata legges i issue body som en tydelig YAML-blokk:

~~~md
<!-- KL-META:START -->
```yaml
type: initiative
lane: content
plan_start: 2026-04-22
target: 2026-05-10
parent: ""
summary_no: "Kort oppsummering på norsk for VIS-kort."
explainer_no: "En enkel forklaring på norsk om hvorfor dette er viktig nå."
```
<!-- KL-META:END -->
~~~

### Felt
- `type`: `initiative` eller `task`
- `lane`: id fra lane-manifestet
- `plan_start`: planlagt startdato (`YYYY-MM-DD`)
- `plan_end` eller `target`: planlagt slutt/målpunkt (`YYYY-MM-DD`)
- `parent`: issue-nummer for parent (tom for initiativ)
- `summary_no`: kort visningstekst på norsk
- `explainer_no`: enkel forklaring på norsk for mennesker

### Regler per type
#### Initiative
- `type: initiative`
- `parent` skal være tom
- bør ha `target` (eller `plan_end`)

#### Task
- `type: task`
- `parent` skal peke til initiative-issue (f.eks. `"124"`)
- bør ha `plan_start` og `target`/`plan_end`

## Eksempelutkast: 2 initiativer (for GitHub issues)

### Utkast 1: Etablere innhold til MVP
~~~md
Tittel: Etablere innhold til MVP

<!-- KL-META:START -->
```yaml
type: initiative
lane: content
plan_start: 2026-04-24
target: 2026-05-15
parent: ""
summary_no: "Bygge et minimum av tydelig innhold som forklarer verdien i KlarLyd."
explainer_no: "Initiativet samler innhold for sentrale sider så Thomas og Vibeke kan teste budskap og brukerforståelse."
```
<!-- KL-META:END -->

## Kontekst
Vi trenger et sammenhengende minimum av innhold på norsk for å kunne teste MVP i praksis.

## Ferdig når
- Kjerneinnhold er publiserbart for MVP
- Språk og struktur er konsistent med valgt tone
~~~

### Utkast 2: Artikkelkomponenter til MVP
~~~md
Tittel: Artikkelkomponenter til MVP

<!-- KL-META:START -->
```yaml
type: initiative
lane: ui-design
plan_start: 2026-04-26
target: 2026-05-12
parent: ""
summary_no: "Stabilisere artikkelkomponenter som gjenbrukbar MVP-grunnmur."
explainer_no: "Initiativet sikrer at artikkelsystemet kan brukes pa tvers av nye artikler uten ny designrunde hver gang."
```
<!-- KL-META:END -->

## Kontekst
Article System v0.1 er landet og publisert i VIS. Neste steg er trygg gjenbruk i produksjonsnær flyt.

## Ferdig når
- Definerte komponenter fungerer med dokumentert bruk
- Metadata kan knyttes til roadmap lane og tidsvindu
~~~

## Notat om norsk visningsspråk
Feltene `summary_no` og `explainer_no` er eksplisitt på norsk for enkel VIS-formidling.
