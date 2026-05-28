# QA — Bedre lyd editorial R4

**Branch:** `feature/bedre-lyd-editorial-r1`  
**PR:** #173 (ikke merget)

## Endringer fra R3 → R4

- Dempet synlig hero: H1 beholdes semantisk, men forklarende intro er fjernet
- Hovedsak åpner siden sterkere
- Layout er image-ready uten faktiske bilder
- Nøytrale image slots er små/rolige og dokumenterer forventet bildebehov
- AI-seeds er fortsatt fjernet fra landing
- Ingen endringer i nav/footer/routes/Hjelp/forside

## Forventede editorial image slots

- lead image
- small sounds
- social listening
- music
- TV/mobile/car
- first weeks

## Skjermbilder

| Fil | Viewport | Innhold |
|-----|----------|---------|
| `01-desktop-magazine-image-ready.png` | 1440px desktop | Dempet hero + lead image slot + aktuelle saker |
| `02-tablet-magazine-image-ready.png` | 820px tablet-ish | Tablet-layout |
| `03-mobile-magazine-image-ready.png` | 390px mobil | Mobil én-kolonne |

## QA-sjekkliste

1. Siden starter mer som magasin enn produktside
2. Hovedsaken bærer åpningen
3. Hero-intro er fjernet/dempet nok
4. Image slots føles klare for ekte editorial bilder uten å dominere som tomme dekorfelt
5. Aktuelle saker føles redaksjonelle
6. Tema-chips er sekundære
7. Ingen AI-seeds høyt på siden
8. Desktop/tablet/mobil har ingen horisontal overflow
9. Hjelp-bro nederst finnes
