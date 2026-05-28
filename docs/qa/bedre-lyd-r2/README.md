# QA — Bedre lyd editorial R2

**Branch:** `feature/bedre-lyd-editorial-r1`  
**PR:** #173 (ikke merget)

## Endringer fra R1 → R2

- Situation-first: 4 situasjonsinnganger rett etter hero
- Utvalgte artikler som text-led rader (ingen bilde-placeholders)
- AI-seeds fjernet fra landingssiden
- Surface-paritet med `/no/hjelp/` (46rem, sentrert hvit flate)
- Hjelp-bro beholdt nederst

## Preview (krever Vercel SSO)

Etter push — sjekk PR #173 checks for oppdatert Preview-lenke.

## Lokal verifisering

```bash
git pull origin feature/bedre-lyd-editorial-r1
npm run build && npm run preview
# → http://localhost:4321/no/bedre-lyd/
```

## Skjermbilder

| Fil | Innhold |
|-----|---------|
| `01-desktop-hero-situasjoner.png` | Hero + 4 situasjonskort |
| `02-desktop-artikler-hjelp.png` | Artikler + Hjelp-bro |
| `03-desktop-full.png` | Full side desktop |
