# 13_ARTICLE_TEMPLATE_FIELDS_v0_1

Kort felt-kontrakt for spoke-template v0.1 (task #52 under epic #46).

## Scope i denne leveransen
- Definerer et lite og realistisk feltsett for v0.1.
- Skiller mellom malvisning, hub-kobling og AI-lag.
- Lister hva som er maa-felt vs anbefalte felt.

Ikke i scope: template-kode, full taksonomi, full CMS-modell.

## 1) Prinsipp som laases naa
- Feltsettet skal vaere lite nok til at template-skjelett kan bygges uten ny strategirunde.
- Grammar/preset-regler fra #46/#51 er overordnet; feltene stoetter disse.
- AI-relaterte felt er hjelpelag, ikke egen innholdsstruktur.

## 2) Maa-felt i v0.1

| Felt | Brukes til | Kategori |
|---|---|---|
| `title` | Vise artikkelens hovedtittel i mal/hub. | Malvisning |
| `ingress` | Kort innledning under tittel og i oversikter. | Malvisning |
| `preset` | Velge preset-regler (Standard/Faglig Fokus/Minimal). | Malvisning |
| `article_type` | Enkel typekontroll for riktig maloppfoersel i v0.1. | Malvisning |
| `hub` | Koble artikkel til riktig hubflate (f.eks. Bedre lyd i hverdagen). | Hub/relasjon |
| `source_trust_type` | Vise grunnleggende trygghets-/kildeprofil i artikkelen. | Malvisning + trygghet |

## 3) Anbefalte felt i v0.1

| Felt | Brukes til | Kategori |
|---|---|---|
| `related_topics` | Relaterte lenker/tema i hub eller sideseksjon. | Hub/relasjon |
| `ai_seed_group` | Koble artikkel til seed-gruppe for AI-hjelp i arbeidsflyt. | AI-lag |

## 4) Kan vente (ikke laast naa)
- Utvidet taksonomi utover `hub` + `related_topics`.
- Detaljert AI-sporbarhet per blokk/avsnitt.
- Full metadata-kontrakt for alle redaksjonelle felter.

## 5) Lite minimumssett som er realistisk i v0.1

Obligatorisk minimum for template-skjelett:
- `title`
- `ingress`
- `preset`
- `article_type`
- `hub`
- `source_trust_type`

Anbefalt tillegg tidlig:
- `related_topics`
- `ai_seed_group`

## 6) Hva spoke-template v1 kan anta som fast grunnlag
- Alle artikler har minimumssettet over.
- `preset` finnes og matcher laaste preset-regler fra `12_ARTICLE_SYSTEM_PRESET_RULES_v0_1.md`.
- `hub` finnes for kobling mot hub-visning.
- `source_trust_type` finnes for enkel trygghetsvisning i v0.1.
- `ai_seed_group` kan mangle uten at malen bryter (anbefalt, ikke krav).

## 7) Aapne spoersmaal foer template-koding laases helt
1. Hvilke gyldige verdier tillates for `article_type` i v0.1?
2. Skal `source_trust_type` vises som tekst, badge eller enkel boks i template?
3. Skal `related_topics` vaere fritekst, tags eller referanse-ID-er i foerste iterasjon?
4. Hvilke gyldige verdier tillates for `ai_seed_group`, og hvem eier listen?
