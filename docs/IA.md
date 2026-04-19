# IA-kontrakt (NO) — hub & spoke (demo v1)

## Produktmodell (forenklet)
- **Forside** (`/no`): Innhold + innebygd chat som rask inngang.
- **Emnehuber** (`/no/hubs`): Oversikt over tre tema-hubber (én live fra CMS, to merket «kommer»).
- **Hub** (`/no/hub`): Primær emnehub fra Storyblok; lenker til artikler og smarte spørsmål.
- **Spoke / artikkel** (`/no/artikkel/[slug]`): White Paper reading surface; nederst **Fortsett i Hørehjelpen** med klikkbare spørsmål → `/no/chat?seed=…&from=article`.
- **Hørehjelpen fri modus** (`/no/chat`): Egen samtaleflate uten å måtte starte fra innhold.

## Global navigasjon (header)
Forside · Emnehuber · Kom i gang · Ordbok · Hørehjelpen · Om — aktiv tilstand for hub-stranden (`/no/hubs`, `/no/hub`, `/no/artikkel/…`) slås sammen visuelt. Personvern m.m. i footer.

## Mobilmeny
Samme rekkefølge som header (se `src/lib/no-nav-links.ts`).

## Desktop-prinsipp
- Chat på forsiden ligger i eget panel der layout tillater det.
- Artikler: to kolonner med leseark + sekundær rail (metadata, tillit).
