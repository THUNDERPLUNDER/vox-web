# 12_ARTICLE_SYSTEM_PRESET_RULES_v0_1

Kort operativ preset-kontrakt for article system v0.1 (child task #51 under epic #46).

## 1) Prinsipp som laases i v0.1
- Grammar er source of truth.
- Preset er en snarvei oppaa grammar (ikke egen grammar).
- AI-drevet behandles som modus/lag oppaa grammar, ikke primar artikkeltype i foerste sprint.

## 2) Presetdefinisjoner (kort)
- **Standard:** Default redaksjonell artikkelstruktur for normal spoke-publisering.
- **Faglig Fokus:** Faglig tyngre variant med mer stoetteinnhold og kontekst rundt kjerneinnholdet.
- **Minimal:** Kortformat med redusert blokkbruk, men fortsatt innenfor samme grammar.
- **AI-drevet:** Produksjonsmodus som bruker AI-seeds/AI-forslag i arbeidsflyt; ikke egen blokkfamilie.

## 3) Blokkbruk per preset

Kildegrunnlag: `11_ARTICLE_SYSTEM_BLOCK_LIBRARY_v0_1.md`.

| Blokk | Standard | Faglig Fokus | Minimal | AI-drevet |
|---|---|---|---|---|
| Hodeseksjon | **Standardvalg** | **Standardvalg** | **Standardvalg** (kompakt) | **Standardvalg** |
| Tillitsboks | Anbefalt ved behov | **Anbefalt valg** (ofte) | Ikke normalt brukt | Anbefalt ved behov |
| Broedtekst | **Standardvalg** | **Standardvalg** | **Standardvalg** (kort) | **Standardvalg** |
| Figur / illustrasjon | Anbefalt ved behov | **Anbefalt valg** | Ikke normalt brukt | Anbefalt ved behov |
| Sidespalte / rail | Valgfri | **Anbefalt valg** | Ikke normalt brukt | Valgfri |
| Bunnseksjon | **Standardvalg** | **Standardvalg** | **Standardvalg** (kompakt) | **Standardvalg** |
| AI-forslag (AI-lag) | Ikke normalt brukt synlig | Ikke normalt brukt synlig | Ikke normalt brukt synlig | **Anbefalt i arbeidsflyt** |

Merk: AI-forslag er AI-lag, ikke ordinær innholdsblokk.

## 4) Minstekrav som laases naa

- **Standard (minstekrav):** Hodeseksjon + Broedtekst + Bunnseksjon.
- **Faglig Fokus (minstekrav):** Hodeseksjon + Broedtekst + Bunnseksjon + minst ett stoetteelement (Tillitsboks eller Figur eller Sidespalte).
- **Minimal (minstekrav):** Hodeseksjon + kort Broedtekst + kompakt Bunnseksjon.
- **AI-drevet (minstekrav):** Samme blokk-minstekrav som valgt base-preset (Standard/Faglig Fokus/Minimal), pluss dokumentert bruk av AI-seed-relasjon i arbeidsflyt.

## 5) Tydelig plassering av Minimal og AI-drevet

- **Minimal:** Egen kortformat-variant innenfor samme grammar. Ikke ny artikkeltype.
- **AI-drevet:** Modus/lag for produksjon og forslag. Ikke egen preset-familie med egne blokker.

## 6) Aapne spoersmaal som staar igjen

1. Skal Faglig Fokus kreve et bestemt stoetteelement (f.eks. alltid tillitsboks), eller holder "minst ett" i v0.1?
2. Naar skal tillitsboks vaere obligatorisk av hensyn til tema/risiko/compliance?
3. Hva er terskel for at figur skal anses noedvendig i Faglig Fokus?
4. Hvilket innhold er tillatt i sidespalte vs hva maa ligge i broedtekst?
5. Hvilket minimum av metadata maa registreres for stabil preset-kjoering i spoke-template?
6. Hvordan spores og eventuelt eksponeres AI-bidrag uten aa blande AI-lag med ordinare innholdsblokker?

## 7) Konsekvens for #47 Spoke template v1

Spoke-template kan anta foelgende fast grunnlag i v0.1:
- Grammar-styrt blokksett er overordnet.
- Preset velger bruksmoenster, ikke nye blokker.
- Minstekrav per preset over er operative.
- AI-drevet implementeres som modus oppaa valgt base-preset.
