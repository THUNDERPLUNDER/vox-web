# 19_EPIC_46_IMPLEMENTATION_CHECKLIST

Operativ sjekkliste for aa loefte lokale justeringer fra `#61` til systemnivaa i epic `#46`:
- blokkbibliotek
- preset-regler
- AI-seeds
- mapping mot pilotartikler

Dette dokumentet er laget for praktisk gjennomfoering i issues/child tasks, ikke strategi-presentasjon.

## 0) Maal for epicen (laases)

- `#61`-laering skal vaere gjenbrukbar uten lokale CSS-hacks i enkeltfiler.
- Samme primitive/blokk skal fungere likt paa minst 3 pilotsider (R1, R2, R3).
- Preset-bytte skal gi forutsigbar effekt via regler, ikke ad hoc-overrides.

## 1) Freeze decisions fra #61

- [ ] Opprett "decisions freeze" under `docs/project/03_DECISIONS.md` med 10-15 konkrete UI-beslutninger.
- [ ] Merk hver beslutning med: `why`, `scope`, `token/primitiv`, `avvik tillatt?`.
- [ ] Flytt side-spesifikke stylingvalg til "midlertidig avvik"-liste med utfasingsdato.

Utfall:
- Ingen kritiske designvalg skal kun ligge i `src/pages/no/artikkel/r1-spoke-v01.astro`.

## 2) Blokkbibliotek -> primitives (fra 11_*)

- [ ] Del `ArticleTemplateV01` i stabile primitives:
  - [ ] `ArticleHeader`
  - [ ] `ArticleTrustBlock`
  - [ ] `ArticleFigure`
  - [ ] `ArticleIngress`
  - [ ] `PromptBridge`
  - [ ] `ArticleSummary`
- [ ] Definer tillatte props/slots per primitive (kontrakt foerst, styling etterpaa).
- [ ] Fjern dupliserte lokale overrides som kan erstattes av primitive-props.

Utfall:
- Blokker er composable og kan brukes i flere sidetyper uten copy/paste-CSS.

## 3) Preset-regler -> kjorebare regler (fra 12_*)

- [ ] Innfoer en enkel preset-resolver (config/funksjon) for:
  - [ ] blokkrekkefolge
  - [ ] synlighet (f.eks. trust/testinfo/cta)
  - [ ] spacing-profile
- [ ] Koble `standard`, `faglig-fokus`, `minimal` til samme primitive-sett.
- [ ] Verifiser at preset-bytte ikke krever manuell side-CSS.

Utfall:
- Preset er layout/styring, ikke ny blokkfamilie.

## 4) Fields og data-kontrakt (fra 13_*)

- [ ] Utvid feltkontrakten med systemfelter brukt i #61-laering:
  - [ ] trust-meta (authors, published, updated, source_trust_type)
  - [ ] visual ordering (f.eks. `figure_after_trust`, `ingress_after_figure`)
  - [ ] prompt bridge policy (show/hide cta, seed source)
- [ ] Dokumenter fallback-regler for manglende felt.
- [ ] Sikre at feltkontrakt ikke lekker presentasjons-hacks.

Utfall:
- Data kan mappe til alle primitives uten side-spesiallogikk.

## 5) AI-seeds registry og policy

- [ ] Opprett et sentralt seed-registry (en fil/konfig) med:
  - [ ] `seed_group`
  - [ ] `seed_items`
  - [ ] `seed_from`
  - [ ] visningspolicy per preset
- [ ] Flytt hardcodede seed-sporsmaal ut av enkeltsider der mulig.
- [ ] La PromptBridge lese fra samme registry i pilotsider.

Utfall:
- Samme seed-logikk paa hub/spoke/pilot uten drift.

## 6) Pilot-mapping (R1/R2/R3)

- [ ] Lag en enkel mapping-tabell i docs:
  - [ ] pilot -> preset
  - [ ] primitive-sett
  - [ ] seed_group
  - [ ] eventuelle avvik (med dato for utfasning)
- [ ] Verifiser at R2/R3 kan bruke samme primitives som R1 med kun config-bytt.

Utfall:
- Pilotartikler er konfigurasjon av samme system, ikke tre separate implementasjoner.

## 7) Done-kriterier for #46

- [ ] Minst 3 sider bruker samme primitives uten lokale style-overrides for kjerneflyt.
- [ ] Preset bytte gir forventet strukturendring uten manuell DOM-flytting.
- [ ] AI-seeds hentes fra registry, ikke hardcoded per side.
- [ ] Mapping-dokument finnes og er oppdatert.
- [ ] Midlertidige avvik er eksplisitt listet med owner + utfasingsplan.

## 8) Foreslaatte child tasks (issue-klare)

- [ ] `#46-A` Freeze #61 decisions og avviksliste
- [ ] `#46-B` Refaktor ArticleTemplate til primitives
- [ ] `#46-C` Implementer preset-resolver (standard/faglig-fokus/minimal)
- [ ] `#46-D` Seed-registry + PromptBridge-integrasjon
- [ ] `#46-E` Pilot-mapping R1/R2/R3 + QA-pass

---

Kort regel:
Hvis en justering maa inn i en sidefil for aa virke, skal den enten
1) loeftes til primitive/token/resolver, eller
2) registreres som midlertidig avvik med utfasingsdato.
