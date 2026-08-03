# Decision — Viddel canonical naming CBA v0.1

Status: **CBA locked / implementation pass**  
Date: 2026-08-03  
Canonical domain: `https://www.viddel.no/`  
Legacy domain: `https://vox.raddum.no/`

## Kort beslutning

**Viddel** er eneste aktive merkevarenavn. `https://www.viddel.no/` er canonical produksjonsdomene for offentlige flater, produkt-MVP og interne repo-flater.

VOX var et tidlig arbeidsnavn og skal ikke brukes i aktiv copy, operative lenker eller nye dokumenter. `vox.raddum.no` beholdes som en permanent, sti-bevarende redirect til `www.viddel.no`.

Repoet `vox-web`, Vercel-prosjektnavnet og tekniske `.vox-*`-, `data-vox-*`-, event- og lagringsnøkler beholdes foreløpig som legacy tekniske identifikatorer.

---

## Navne- og domenekontrakt

| Lag | Gjeldende sannhet |
|---|---|
| Merkevare | Viddel |
| Selskap | Viddel AS |
| Canonical domene | `https://www.viddel.no/` |
| Apex | `https://viddel.no/` peker til `https://www.viddel.no/` |
| Legacy domene | `https://vox.raddum.no/*` redirecter permanent til samme sti på `https://www.viddel.no/*` |
| Produkt-MVP | `https://www.viddel.no/no/` |
| Aktiv copy | Viddel; ikke VOX |
| Nye operative lenker | `www.viddel.no` |

---

## Hva som oppdateres

- aktive Backstage-, VIS- og produksjonslenker
- standardsadresse i drifts- og reliability-verktøy
- chat-origin-allowlist etter at legacy-domenet redirecter
- synlige VOX-navn i aktive og interne sider
- aktive state-, design- og beslutningsdokumenter
- historiske dokumenter med en tydelig legacy-merknad

---

## Hva som bevares

### Historiske snapshots

Gamle QA-logger, beslutninger og analyser kan beholde VOX og `vox.raddum.no` når dette beskriver hva som faktisk ble testet eller besluttet på det tidspunktet.

De skal merkes slik at leseren ikke tolker dem som gjeldende produksjonssannhet:

> Legacy snapshot: VOX og vox.raddum.no var tidligere arbeidsnavn og produksjonsadresse. Gjeldende navn er Viddel, med www.viddel.no som canonical domene.

### Source inventory

Stier og navn fra Drive-inventory omskrives ikke. De er kildeavtrykk og skal gjengi den historiske kilden korrekt.

### Teknisk namespace

Følgende omdøpes ikke i denne leveransen:

- GitHub-repoet `THUNDERPLUNDER/vox-web`
- Vercel-prosjektnavnet `vox-web`
- package-navnet `vox-web`
- CSS-klasser og tokens med `.vox-*` / `--vox-*`
- DOM-attributter med `data-vox-*`
- eventnavn, localStorage- og sessionStorage-nøkler med `vox-*`
- eksisterende Preview-URL-er som inneholder `vox-web`

Dette er en intern teknisk migrasjon med større bruddflate og krever et eget mandat dersom den skal gjennomføres.

---

## Redirect-kontrakt

Legacy-domenet skal ikke servere parallelle sider.

| Forespørsel | Respons |
|---|---|
| `https://vox.raddum.no/` | Permanent redirect til `https://www.viddel.no/` |
| `https://vox.raddum.no/no/chat/` | Permanent redirect til `https://www.viddel.no/no/chat/` |
| Andre stier | Samme sti beholdes |
| Query-parametre | Beholdes |

Redirecten defineres i `vercel.json` med vilkår på HTTP Host-headeren, slik at samme applikasjon fortsatt kan svare normalt på `www.viddel.no` og Vercel Preview-domener.

---

## Verifikasjon

- `npm run build` skal være grønn.
- Backstage-guard skal kreve `www.viddel.no`, ikke legacy-domenet.
- Aktiv kode skal ikke bruke `vox.raddum.no` som produksjonsbase eller tillatt chat-origin.
- `https://vox.raddum.no/*` skal gi permanent redirect med bevart sti.
- `https://www.viddel.no/*` skal fortsatt svare uten redirect-loop.
- Historiske VOX-referanser skal enten være tekniske identifikatorer, kildeavtrykk eller tydelig merkede snapshots.

---

## Arbeidsregel

Nye brukerrettede tekster, operative dokumenter og produksjonslenker bruker Viddel og `www.viddel.no`.

VOX skal bare forekomme når vi refererer til historikk eller til et eksplisitt legacy teknisk navn.
