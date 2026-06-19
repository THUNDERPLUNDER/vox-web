# Viddel Composer Pattern v0.1

Status: Draft / operational pattern note  
Scope: Documentation and inventory only. No runtime or visual changes.

Pattern page: `/designsystem/composer`

## Formål

Viddel Composer er input-mønsteret som lar brukeren starte eller fortsette dialog med Viddel. Mønsteret finnes allerede i flere flater, men er ennå ikke trukket ut som en felles komponent eller token-familie.

Målet med v0.1 er å gjøre dagens praksis tydelig nok til at videre arbeid kan være smått, trygt og reviewbart. Composer-kroppen bør over tid standardiseres mer enn i dag. Halo, dramaturgi og plassering kan fortsatt variere etter kontekst, men bare når variasjonen følger av brukerens situasjon, funksjonell rolle eller nødvendig interaksjonslogikk. Variantstyring skal ikke brukes som rent visuelt avvik uten begrunnelse.

## Nåværende instanser

| Kontekst | Rute/flate | Komponenter/filer | Visuell rolle | Funksjonell rolle | Status |
| --- | --- | --- | --- | --- | --- |
| Standalone idle composer | `/no/chat` før første spørsmål | `src/pages/no/chat.astro`, `src/styles/viddel-standalone-chat.css`, `src/styles/viddel-chat-attachment.css`, `src/styles/viddel-chat-scroll.css` | Primær inngang til Viddel AI. Stor hvit pill med halo/entry-følelse. | Starter headless `/api/chat`-dialog; støtter tekst og bildeinput. | Production, QA-godkjent i #259/#260. |
| Standalone active/sticky composer | `/no/chat` etter første spørsmål | Samme som standalone idle, styrt av `data-viddel-chat-active`, `data-inline-chat-conversation="active"` og scroll-styles. | Mer nøktern sticky kontrollflate nederst. | Fortsetter samtale, bevarer add-button/bildeinput, håndterer multiline og scroll-clearance. | Production, QA-godkjent i #259/#260. |
| Article transition composer | `/no/artikkel/ingen-lyd-svak-lyd/` | `src/components/article/ArticleInlineChatShell.astro`, `src/styles/article-chat-transition-v01.css`, `src/styles/r1-dialog-article.css` | Kontekstuell overgang fra artikkel til handling. Hvit pill med full-bleed contextual halo. | Starter progressive artikkeldialog fra seed eller fritekst; ingen add-button i transition-v01. | Production, QA-godkjent i #257/#258. |
| Generic article inline composer | Storyblok/artikkel-flater via `ArticleInlineChatShell` | `src/components/article/ArticleInlineChatShell.astro`, `src/styles/r1-dialog-article.css`, enkelte artikkelruter som importerer komponenten | Lavmælt artikkel-AI bridge inne i editorial flow. | Progressive eller inline dialog via skjult CES bridge; fritekst og seed-spørsmål. | Applied pattern, eldre enn transition-v01. |
| Attachment composer layer | Standalone `/no/chat` | `src/styles/viddel-chat-attachment.css`, `src/lib/chat-image-attachment-menu-v01.ts`, markup i `/no/chat.astro` | Venstre add-button, bilde-thumbnail og mobil sheet/desktop menu. | Kamera/filvalg, attachment strip, remove, bildepayload til chat. | Production, standalone-only. |
| Lab image QA composer | `/lab/image-qa` | `src/pages/lab/image-qa.astro`, `src/styles/lab-image-qa.css` | Intern QA-variant som låner compose-klasser. | Tester bilde-/vision-flyt i lab. | Lab-only; skal ikke styre product pattern direkte. |
| Designsystem references | `/designsystem/`, `/designsystem/composer` og VIS previews | `src/components/designsystem/PatternPreview.astro`, `src/styles/designsystem-catalog.css`, `src/data/design-system-source-of-truth-v01.ts` | Tekstlig pattern-dokumentasjon og generelle mønsterreferanser. | Dokumentasjon og review, ikke runtime dialog eller canonical visual rendering. | Applied reference, bør oppdateres når pattern v0.1 blir canonical. |
| Legacy/variant chat shell | `/no/chat-b` | `src/pages/no/chat-b.astro`, samme standalone CSS-filer | Variant/eksperimentell chatflate. | Parallell standalone-implementasjon med attachment og chatlogikk. | Variant; bør ikke bli ny source of truth uten beslutning. |

## Felles anatomi

**Composer shell / stack**  
Kjernen er `inline-chat-shell__compose-stack` rundt status, error, attachment layer og selve form-elementet. Standalone bruker `data-viddel-chat-compose-stack`; article bruker `data-inline-chat-compose-stack`. Active state gjør stacken sticky/fixed nederst og gir scroll-clearance.

**Form / surface**  
Selve kontrollflaten er `inline-chat-shell__compose`. Standalone legger i tillegg på `viddel-chat-attach__compose` fordi den har add-button, attachment strip og bilde-meny. Article transition bruker samme baseklasse, men variant-styles i `article-chat-transition-v01.css`.

**Input/textarea**  
Textarea heter `inline-chat-shell__compose-input` i både standalone og article. Standalone bruker `data-viddel-chat-input`; article bruker `data-inline-chat-compose-input`. Begge bruker auto-resize-logikk og expanded state når innholdet blir multiline.

**Send-knapp**  
Send er `inline-chat-shell__compose-send`, rund, mørk/ink-basert og plassert til høyre. Knappen skal være visuelt sentrert i one-line state og forankret lavere i expanded/multiline state.

**Add-button / bildeinput**  
Finnes i standalone `/no/chat`, ikke i article transition. Markup og behavior ligger i `/no/chat.astro`, `viddel-chat-attachment.css` og `chat-image-attachment-menu-v01.ts`. Dette er en funksjonell forskjell, ikke et avvik som skal rettes uten egen beslutning.

**Halo/environment layer**  
Standalone tegner halo primært via `body.vox-shell--standalone-chat [data-viddel-chat] .inline-chat-shell__compose-stack::before` i `viddel-standalone-chat.css`. Article transition tegner halo via et portaled full-bleed environment-lag: `article-chat-transition-v01__compose-environment` og `article-chat-transition-v01__compose-halo`.

**Shadow/elevation**  
Composer-kroppen bruker hvit surface og shadow for å skille seg fra hvit bakgrunn. Active state bør være tydelig nok til å leses som kontrollflate, men ikke så tung at den konkurrerer med svarinnhold.

**Multiline/expanded state**  
Standalone bruker `data-chat-input-expanded`; article transition bruker `data-transition-compose-expanded` i JS/CSS. Prinsippet er likt: one-line er full pill, multiline blir kapsel/rounded surface, knappene forankres nederst, og textarea får intern scroll etter maks-høyde.

**Sticky/active state**  
Standalone active bruker fixed composer-stack nederst med scroll viewport og bottom-spacer. Article transition active bruker fixed composer og egen answer-clearance/bottom-spacer slik at siste svarlinje ikke havner bak composer.

**Mobile behavior**  
Mobile må håndtere safe area, browser chrome og tastatur. Composer skal ha stabil width mellom idle, pending, active og multiline. Standalone mobile har add-button/bilde-flow; article transition mobile har full-bleed article surface og contextual halo.

## Felles designregler

- One-line composer skal lese som ekte pill (`999px`-logikk) når høyden er normal.
- Multiline composer kan skifte til kapselradius, omtrent `1.65rem`, når innhold eller attachment krever mer høyde.
- Composer skal vokse kontrollert oppover; bottom offset skal ikke hoppe.
- Width skal være stabil mellom idle, pending, active og multiline.
- Send-knappen skal ha konsistent størrelse, være rund og ligge optisk sentrert i one-line state.
- Add-button skal matche send-knappens optiske størrelse/plassering der funksjonen finnes.
- Input-typografi, placeholder, line-height og vertical padding bør være likere på tvers av standalone og article.
- Surface/shadow bør gi tydelig kontrollflate uten border som primært virkemiddel.
- Keyboard/safe-area bottom må speiles i JS-clearance når sticky composer flyttes.
- Siste assistant-svar og user bubble skal kunne scrolle over composer; ingen tekst skal ligge bak kontrollflaten.
- Header-CTA-regelen gjelder standalone chat: global `Spør Viddel` CTA skal ikke lenke til seg selv på `/no/chat`, men skal finnes på andre ruter.

## Kontekstuelle varianter

### Standalone idle /no/chat

Standalone composer er hovedinngang. Brukeren kommer uten artikkelkontekst og skal inviteres inn i dialog. Derfor kan idle-halo være mer hero/entry/open-ended enn i artikkel. Den skal støtte composer som primærobjekt, ikke fungere som artikkelovergang.

Dette betyr at standalone default/idle halo ikke trenger å være identisk med article halo. Forskjellen bør forstås som dramaturgi, ikke automatisk som inkonsistens.

### Article idle

Article composer er en kontekstuell videreføring av lesing. Brukeren har allerede tema og friksjonen bør være lav. Haloen skal støtte overgangen fra artikkel til handling uten å bryte flyten eller vaske over artikkelinnholdet.

Her bør composer-kroppen ligne standalone nok til at brukeren kjenner mønsteret igjen, mens halo og plassering kan være mer dempet og kontekstbundet.

### Active/sticky

Etter første spørsmål bør composer være mer funksjonell og mindre hero fordi dialogen allerede er i gang. Halo kan dempes, og composer skal primært støtte videre arbeid, multiline og scroll. Active state bør aldri dominere transcript eller svarinnhold.

### Mobile

Mobile er ikke bare en mindre desktop. Safe area, keyboard, browser chrome og touch-targets styrer opplevelsen. Composer bør sitte nært nok bunnen til å føles native, men fortsatt ha clearance for siste svarlinje. Width må være stabil, særlig ved overgang fra idle til active.

### Future variants

Fremtidige composer-varianter kan oppstå i hub, lab, backstage, onboarding eller andre Viddel-flater. De bør bruke samme composer-kropp og interaction rules der det er mulig, men halo/dramaturgi bør velges etter brukerens mentale kontekst: start, videreføring, arbeid, QA eller intern lab.

## Tokens og primitives som bør etableres

Ikke implementer full token-refaktor nå. Foreslått navngivning for senere:

- `--viddel-composer-radius-pill`
- `--viddel-composer-radius-expanded`
- `--viddel-composer-height-idle`
- `--viddel-composer-height-compact`
- `--viddel-composer-height-active`
- `--viddel-composer-button-size`
- `--viddel-composer-input-line-height`
- `--viddel-composer-input-padding-y`
- `--viddel-composer-shadow`
- `--viddel-composer-shadow-focus`
- `--viddel-composer-surface`
- `--viddel-composer-user-bubble-surface`
- `--viddel-composer-halo-idle`
- `--viddel-composer-halo-contextual`
- `--viddel-composer-halo-active`
- `--viddel-composer-halo-width`
- `--viddel-composer-halo-height`
- `--viddel-composer-safe-area-bottom`
- `--viddel-composer-active-bottom`
- `--viddel-composer-scroll-clearance`

Token-familien bør skille mellom:

- **Core body tokens:** radius, height, padding, button size, input typography, shadow.
- **Behavior tokens:** active bottom inset, scroll clearance, max textarea height.
- **Halo tokens:** idle, contextual/article, active. Disse bør ikke tvinges til én felles gradient.

## Refaktor-anbefaling

### Behold lokalt inntil videre

- `viddel-standalone-chat.css` bør fortsatt eie standalone dramaturgi, scroll og `/no/chat`-spesifikke active states.
- `article-chat-transition-v01.css` bør fortsatt eie article transition halo, article surface og sticky clearance.
- `viddel-chat-attachment.css` bør fortsatt eie add-button/bildeinput til standalone.
- `ArticleInlineChatShell.astro` bør ikke trekkes ut eller generaliseres mer før article contract er dokumentert.

### Trekk ut senere

- Delte composer-body tokens for pill, expanded shape, button size, input typography og shadow.
- En liten shared CSS-seksjon eller component-level class contract for `inline-chat-shell__compose`, `__compose-input`, `__compose-send`.
- En felles JS-helper for textarea auto-resize/expanded-state hvis article og standalone fortsetter å divergere.
- Et tydelig variantnavn for halo/dramaturgi: `entry`, `contextual`, `active`.

### Risiko ved for tidlig refaktor

- Standalone og article løser ulike mentale oppgaver. En for hard felles halo kan gjøre begge dårligere.
- Article transition bruker portaled full-bleed environment; standalone bruker local pseudo-layer. Å standardisere for tidlig kan skape clipping, stacking og safe-area-regresjoner.
- Standalone har add-button/bildeinput; article transition har tekst-only. En global component kan fort skjule funksjonelle forskjeller.
- Active scroll-clearance er skjør. Små endringer i bottom offset, stack height eller textarea max-height kan legge siste svarlinje bak composer.

### Neste smale tekniske steg

Bruk Composer Pattern-siden i `/designsystem/composer` som tekstlig arbeidsnotat, ikke som canonical visual rendering.
Visuell QA skal fortsatt gjøres på runtime-sidene:

1. Standalone idle og active: `/no/chat`
2. Article transition idle og active: `/no/artikkel/ingen-lyd-svak-lyd/`

Neste tekniske steg bør være å trekke ut bare de trygge body-tokenene: radius, expanded radius, button size, input line-height og shadow. Halo bør fortsatt være variantstyrt.

## QA-sjekkliste

### /no/chat desktop idle

- Composer er tydelig white pill og hovedinngang.
- Header har ikke redundant `Spør Viddel` CTA til seg selv.
- Halo støtter composer uten hard kant.
- Add-button og send-knapp er optisk sentrert.
- Width og height er stabile før typing.

### /no/chat desktop active

- Composer er fixed/sticky nederst og tydelig som kontrollflate.
- User bubble har lett grå surface og skiller seg fra bakgrunn.
- Add-button/bildeinput finnes fortsatt.
- Assistant-svar kan scrolle over composer.
- Siste svarlinje ligger ikke bak composer.

### /no/chat mobile idle

- Composer sitter nær bunnen med safe-area-hensyn.
- Width er stabil og bred nok med trygge sidegutter.
- Mobilmeny har ikke redundant `Spør Viddel`-rad på `/no/chat`.
- Halo gir kontrast uten å dominere intro.

### /no/chat mobile active

- Composer holder samme width etter første spørsmål.
- Bottom offset føles native med browser chrome.
- Add-button og send-knapp er trygge touch targets.
- Multiline vokser oppover uten å flytte bottom-posisjon.

### Article desktop idle

- Composer er kontekstuell videreføring av artikkelen, ikke ny hero.
- Halo ligger bak/rundt composer og leses ikke som separat bunnseksjon.
- Article shell width er uendret.
- Header CTA finnes fortsatt.

### Article desktop active

- Composer ligger bak transcript-flowen med riktig answer-clearance.
- Svar kan scrolle opp over composer.
- Halo er nøktern nok til at svartekst prioriteres.
- Ingen add-button i article composer.

### Article mobile idle

- Article surface er hvit/full-bleed der transition-v01 krever det.
- Composer width er stabil.
- Halo følger composer og starter ikke for høyt.
- Top background bak glass-header er hvit.

### Article mobile active

- Composer bottom og JS-clearance stemmer overens.
- Siste svarlinje ligger ikke bak composer.
- Halo og composer henger sammen etter keyboard/browser chrome.
- Article text og seeds er uendret.

### Multiline

- One-line er full pill.
- Expanded state bruker capsule/rounded form.
- Composer vokser oppover.
- Input får intern scroll etter max-height.
- Send-knapp forankres nederst til høyre.
- Add-button forankres nederst til venstre der den finnes.

### Add-button/bildeinput

- Finnes på standalone `/no/chat`.
- Finnes ikke i article transition uten eksplisitt beslutning.
- Desktop menu og mobile sheet åpner/lukker.
- Attachment strip endrer radius uten å sprenge layout.
- Remove-knapp er tilgjengelig.

### Safe-area / mobile browser chrome

- Sticky bottom bruker safe-area.
- JS-clearance må speile CSS bottom/height når disse endres.
- Ingen svartekst havner bak composer.
- Composer forblir tilgjengelig når tastatur åpnes.

### Header CTA-regler

- `/no/chat`: global header CTA `Spør Viddel` skal ikke vises eller være klikkbar.
- `/no/chat` mobile menu: ingen redundant `Spør Viddel`-rad.
- Andre ruter: header CTA skal fortsatt vises.
- Route-scoped balancing skal ikke legge igjen usynlig klikkbar knapp.
