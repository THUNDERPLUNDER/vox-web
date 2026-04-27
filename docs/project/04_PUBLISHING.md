# 04_PUBLISHING

## Formål
Kort operativ avklaring av publiseringsflyt for Storyblok-innhold i VOX MVP.

## Valgt modell (MVP)
- Frontend kjører fortsatt som **statisk Astro-build** på Vercel.
- Storyblok-innhold blir synlig i produksjon først etter **ny deploy**.
- Vi bruker derfor denne kjeden:
  1) Storyblok publish
  2) Storyblok webhook
  3) Vercel deploy hook
  4) Ny production build

Dette er valgt bevisst for lav kompleksitet og stabil drift i MVP, uten on-demand rendering.

Status: Flyten er testet og verifisert i praksis for glossary-sporet.

## Operativ sjekkliste (utenfor repo)
1. Opprett en **Deploy Hook** i Vercel for prosjektet (target: `production`, branch: `main`).
2. Kopier deploy hook-URL.
3. Legg URL-en inn som **Webhook** i Storyblok-space.
4. Sett webhook til å trigge på **publish**.
5. Publiser en liten endring i en glossary-story under `no/ordbok/` (f.eks. `tilkobling`).
6. Verifiser at ny deploy starter i Vercel.
7. Verifiser etter ferdig deploy at `/no/ordbok` og `/no/ordbok/[term]` viser oppdatert innhold.

## Feilsøk kort
- Hvis Storyblok er oppdatert, men prod ikke endres: sjekk at deploy faktisk ble trigget.
- Hvis deploy kjører, men term mangler: sjekk at story er **published** og ligger under `no/ordbok/`.
