# Viddel Conversation Area — visuell kontroll v0.1

Status: Godkjent visuell retning; kontrollgrunnlag for implementeringsport
Eier: Thomas
Strukturgrunnlag: `docs/project/VIDDEL_CONVERSATION_AREA_LAYOUT_CBA_v0_2.md`
Copygrunnlag: `docs/project/VIDDEL_CONVERSATION_AREA_UX_COPY_CBA_v0_1.md`
Relatert GitHub-sak: #283
Dato: 2026-07-31

## Formål

Denne varianten legger en lett visuell retning på godkjent struktur og copy.
Den skal verifisere hierarki og tilstander før implementering, uten å starte en
ny design- eller tokenrunde.

Artefakt:

- `public/vis/raw/viddel-conversation-area-visual-review-v0_1.html`

De godkjente struktur- og copy-referansene er ikke endret.

## Visuell retning

- varm, åpen grunnflate uten kort rundt hvert samtaleelement
- svak tonal forskjell mellom kompakt oversikt og aktiv dialog
- valgt samtale markeres med rolig toning og en diskret markør
- metadata holdes sekundært
- tydelig «Ny samtale» i oversikt og tomtilstand, roligere i aktiv dialog
- eksisterende dialog- og composer-hierarki videreføres
- ingen ny halo, illustrasjon eller dekorativ tokenfamilie

## Kobling til eksisterende semantiske tokens

| Rolle | Eksisterende token | Bruk i mønsteret |
|---|---|---|
| Sideflate | `--bg` | Åpen bakgrunn rundt samtalene |
| Hovedflate | `--surface` | Aktiv dialog og produktflate |
| Tonal separasjon | `--surface-subtle` | Kompakt oversikt, hover og grunnlag for valgt state |
| Primær tekst | `--text` | Titler og samtaleinnhold |
| Sekundær tekst | `--text-secondary` | Dato, klokkeslett og artikkelopprinnelse |
| Aktiv markør | `--accent-primary` | Diskret markør og svak innblanding i valgt state |
| Fokus | `--focus-ring` | Tastaturfokus |
| Svak avgrensning | `--border` | Kun ved nødvendig skille mellom flater |
| Handlingskontrast | `--primary-contrast` | Innhold på sterk primær handling |

Den valgte flaten i prototypen er en avledet kombinasjon av
`--surface-subtle` og `--accent-primary`. Det er en state-oppskrift, ikke et nytt
kanonisk token.

## Semantisk kontroll

- Mønsteret bruker semantiske tokens, ikke brand-primitiver eller faste farger.
- Lys og mørk modus arver samme roller fra `tokens.css`.
- Farge står ikke alene: valgt samtale har også `aria-pressed` og en synlig
  markør; fokus har egen ring.
- Tokenverdier og globale tokens er ikke endret i denne porten.

Hvis valgt state senere blir et gjentatt mønster på tvers av komponenter, kan
et eget semantisk state-token vurderes. Det skal ikke opprettes før behovet er
bekreftet i implementering.

## Sannhetsgrense

Artefakten er en visuell mønsterkontroll, ikke produksjonskode eller en ny
kanonisk tokenkilde. `src/styles/tokens.css` er fortsatt autoritativ for tokens.
