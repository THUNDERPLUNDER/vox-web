# QA — Bedre lyd editorial R1

**Commit:** `38ce36a81418c952ad696962baec736d43c7cea9`  
**Branch:** `feature/bedre-lyd-editorial-r1`  
**PR:** #173 (ikke merget — ikke synlig på production)

## Vercel Preview (krever SSO)

**URL:** https://vox-web-git-feature-bedre-lyd-edit-b6305b-raddum-5965s-projects.vercel.app/no/bedre-lyd/

- HTTP 401 uten innlogging → redirect til Vercel login (GitHub/Google/SAML SSO)
- Thomas må være innlogget på Vercel-teamet for å se preview
- **Production** (`vox.raddum.no/no/bedre-lyd/`) har **ikke** R1 før merge av #173

## Lokal verifisering (samme commit)

```bash
git checkout feature/bedre-lyd-editorial-r1
npm run build && npm run preview
# → http://localhost:4321/no/bedre-lyd/
```

## Skjermbilder (lokal preview av commit 38ce36a8)

| Fil | Innhold |
|-----|---------|
| `01-desktop-hero-aktuelt.png` | Desktop: hero + Aktuelt (featured + 3 kort) |
| `02-desktop-seeds-tema.png` | Desktop: AI-seeds + start Utforsk etter tema |
| `03-desktop-hjelp-bro.png` | Desktop: temagrupper + Hjelp-bro + footer |
| `04-mobile-topp.png` | Mobil viewport (390px) — topp/hero (hvis tilgjengelig) |
| `05-mobile-kort-tema.png` | Mobil — kort/tema-seksjon |

## QA-sjekkliste

1. Hero: H1 «Bedre lyd» + kort intro
2. **Aktuelt** kommer før temakategorier
3. Editorial følelse — ikke forveksles med `/no/hjelp/`
4. **Utforsk etter tema** som sekundær utforsking
5. Bro nederst: «Trenger du konkret hjelp nå? Gå til Hjelp»
6. Header/nav/footer uendret
