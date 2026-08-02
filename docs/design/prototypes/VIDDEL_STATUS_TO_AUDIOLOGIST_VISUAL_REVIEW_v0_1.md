# Min status til audiograf — visuell kontroll v0.1

Status: Godkjent visuell retning; kontrollgrunnlag før eventuell implementeringsport  
Eier: Thomas  
Strukturgrunnlag: `docs/project/VIDDEL_STATUS_TO_AUDIOLOGIST_LAYOUT_CBA_v0_1.md`  
Copygrunnlag: `docs/project/VIDDEL_STATUS_TO_AUDIOLOGIST_UX_COPY_CBA_v0_1.md`  
Relatert GitHub-sak: #297  
Dato: 2026-08-02

## Formål

Denne kontrollen legger eksisterende Viddel-roller på godkjent struktur og
copy. Den verifiserer hierarki og interaksjonsstates uten å starte en ny
design- eller tokenrunde.

Primær kontrollflate:

- `/no/samtaler` — «Lag status til audiograf» fra full samtaleoversikt

Separat beslutningsgrunnlag:

- `public/vis/raw/viddel-status-to-audiologist-cba-v0_1.html`

## Visuell retning

- varm, rolig sideflate
- én lesbar hovedkolonne
- tydelig aktivt steg uten dashboardpreg
- arbeids- og redigeringsflater skilles svakt fra sideflaten
- kildetekst og konseptgrense er sekundære
- primær handling har tydelig, men avgrenset vekt
- ingen halo, dekorativ gradient eller ny kortfamilie
- samme produktskall, hovedflate og responsive ramme som samtaleområdet

## Kobling til eksisterende semantiske tokens

| Rolle | Eksisterende token | Bruk i mønsteret |
|---|---|---|
| Sideflate | `--bg` | Bakgrunn rundt arbeidsflyten |
| Arbeidsflate | `--surface` | Seksjoner, redigeringsfelt og forhåndsvisning |
| Rolig/valgt flate | `--surface-subtle` | Sekundære kontroller og aktiv orientering |
| Primær tekst | `--text` | Overskrifter og statuspunkter |
| Sekundær tekst | `--text-secondary` | Kilder, periode og konseptgrense |
| Aktiv markør | `--accent-primary` | Aktivt steg, valg og primær handling |
| Fokus | `--focus-ring` | Tastaturfokus |
| Svak avgrensning | `--border` | Felt og nødvendige skiller |
| Handlingskontrast | `--primary-contrast` | Tekst på sterk handling |

Mønsteret speiler disse rollene lokalt i den frittstående VIS-referansen.
`src/styles/tokens.css` er fortsatt autoritativ for verdiene.

## Semantisk kontroll

- Aktivt steg har både farge og `aria-pressed`.
- Fokus bruker en egen ring og er ikke samme signal som valgt state.
- Valgte statuspunkter bruker native checkbox-semantikk.
- Gruppeoverskrifter og felt beholder programmatisk tilknytning.
- Lys og mørk modus bruker de samme semantiske rollene.
- Ingen globale tokenverdier er lagt til eller endret.

## Resultat

Eksisterende tokenlag dekker mønsteret. Det er ikke grunnlag for en ny global
tokenfamilie. En senere produktimplementering kan bruke lokale state-oppskrifter
av eksisterende tokens og løfte et nytt tokenbehov først dersom mønsteret blir
gjentatt flere steder.

Den integrerte konseptflaten er kontrollert på desktop, 390 px og 320 px.
Periode, utkast og forhåndsvisning fungerer uten horisontal scrolling, og
nettleserkontrollen viser ingen konsollfeil.

## Sannhetsgrense

Artefakten er en visuell mønsterkontroll, ikke produksjonskode. Kontrollen
beslutter ikke dataflyt, lagring, deling, eksport eller audiograftilgang.
