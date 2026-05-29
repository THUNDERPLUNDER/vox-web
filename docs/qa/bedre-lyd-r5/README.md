# QA — Bedre lyd editorial R5

**Branch:** `feature/bedre-lyd-editorial-r5`  
**Scope:** `/no/bedre-lyd/` + VIS/copy-rule docs. Ikke merget.

## R5-endringer

- Magazine top: liten uppercase seksjonstittel og tynn linje, ikke produkt-hero
- Lead story: image øverst, tekst under, hele kortet klikkbart
- Lead image: bredere 16:9 crop
- Secondary cards: image øverst helt til kortkant, tekst under
- Labels: nøytral grå editorial label, ikke lilla
- Fjernet synlig `Les saken`
- Synlig copy ryddet for lange tankestreker

## Screenshots

| Fil | Viewport |
|-----|----------|
| `01-desktop-r5.png` | 1440px desktop |
| `02-mobile-r5.png` | 390px mobil |

## QA-sjekkliste

1. Toppen føles som magasinkategori, ikke produktside-hero
2. Lead story har fullbredde bilde øverst og tekst under
3. Bilder går til kortkant uten nested image-radius
4. Labels er nøytral grå
5. `Les saken` er borte
6. Ingen lange tankestreker i synlig copy
7. `/no/hjelp/`, `/no/`, header/nav/footer er uendret
