# DESIGN

## Formål
Nøktern oppsummering av dagens designgrunnmur i kodebasen, samt retning fra designstrategien.

## Hva som finnes i kode i dag
- `src/styles/tokens.css` definerer CSS-variabler for farger, tekst, border, radius, skygger og grunnleggende typografi (`--font-sans`, `--leading`).
- `src/styles/global.css` importerer både `tokens.css` og Tailwind v4 (`@import "tailwindcss"`), og setter global font/linjehøyde og basis bakgrunn/tekstfarge.
- `src/layouts/BaseLayout.astro` bruker en orb-basert bakgrunn (flere blur-lag) over tokenfarger og laster CES widget assets (script + stylesheet) i `<head>`.

## Hva som kommer fra designstrategien
- Retning: **Sonic Architect**.
- Posisjonering: **tech/livsstil + omsorg**.
- Visuell metode: **tonal lagdeling** og bruk av **gradienter**.
- Typografi: **Epilogue + Inter**.
- Form: **medium rundhet**.

## Gap mellom dagens kode og ønsket retning
- Dagens kode bruker en funksjonell tokenbase, men mangler enda et fullt eksplisitt tokensystem knyttet til Sonic Architect-prinsippene.
- Typografien i kode er foreløpig systemfont via `--font-sans`, ikke tydelig implementert som Epilogue + Inter.
- Gradient- og tonal-lagstrategi finnes delvis i bakgrunn/orb-bruk, men ikke dokumentert som helhetlig mønsterbibliotek i komponentene.
- Ingen samlet design-kontrakt i kode som binder navngivning, komponentnivå og visuelle regler til strategien.

## Neste designsteg
- Oversette Stitch-beslutninger til eksplisitte kode-tokens (inkl. typografi, lagdeling og gradientbruk).
- Etablere en kort komponentnær designkontrakt for hvordan tokens brukes i layout, seksjoner og interaktive elementer.
- Sikre at Epilogue + Inter og medium rundhet blir konsekvent implementert i Astro/Tailwind-strukturen.
