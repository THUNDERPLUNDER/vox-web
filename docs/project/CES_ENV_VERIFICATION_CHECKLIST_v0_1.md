# CES env verification checklist v0.1

Status: **Operator checklist** — etter PR #197, før ny reliability-test eller backend-spike.  
Related: [#188](https://github.com/THUNDERPLUNDER/vox-web/issues/188), [AI_CHAT_RELIABILITY_ASSESSMENT_v0_1.md](./AI_CHAT_RELIABILITY_ASSESSMENT_v0_1.md)

---

## Formål

Avklare om **Vercel Production env** peker på samme CES app / location / deployment som **GCP resource name** — uten å dele secrets.

**Repo-forventning (headless `/api/chat`):**

| Felt | Forventet verdi (repo) |
|------|------------------------|
| Project | `hearing-aid-mvp` (eller project number `1088102295663` — samme prosjekt) |
| Location | **`eu`** (CES multi-region — ikke compute-region) |
| App ID | `1741e68d-0528-4625-8b83-99a0dbb5298f` |
| API deployment | **`edb2938a-a2bf-4555-b4c9-d54963531db4`** (API access) |
| Widget deployment (separat) | `dc1619d0-44a1-401b-92a6-1357c29274ea` (Messenger — **ikke** bruk i Vercel headless env) |

Full headless resource path (fra kode):

```
projects/hearing-aid-mvp/locations/eu/apps/1741e68d-0528-4625-8b83-99a0dbb5298f/deployments/edb2938a-a2bf-4555-b4c9-d54963531db4
```

---

## Steg 1 — Google Cloud / CES (5–10 min)

**Thomas åpner:**

1. [Google Cloud Console](https://console.cloud.google.com/) → prosjekt **`hearing-aid-mvp`**
2. **CX Agent Studio** / **Customer Engagement AI** → Apps
3. Velg Viddel-appen → kopier **Resource name** (eller App ID fra detaljside)

**Noter fra resource name:**

```
projects/{PROJECT}/locations/{LOCATION}/apps/{APP_ID}
```

| Segment | Skriv ned | Eksempel (repo) |
|---------|-----------|-----------------|
| `{PROJECT}` | | `hearing-aid-mvp` |
| `{LOCATION}` | **API-streng, ikke UI-etikett** | `eu` |
| `{APP_ID}` | | `1741e68d-0528-4625-8b83-99a0dbb5298f` |

**Deployments:**

4. I samme app → **Deployments** (eller Channels)
5. Finn deployment merket **API access** / headless (PoC: `edb2938a-…`)
6. Noter **deployment ID** (UUID etter `deployments/`)

**Widget (referanse — skal ikke brukes i headless env):**

- Messenger deployment: `dc1619d0-44a1-401b-92a6-1357c29274ea` (hardkodet i `BaseLayout.astro`)

**UI vs API — viktig:**

- Konsollen kan vise **«EU (Finland)»** eller **«EU west»** som *visningsnavn*
- Det som teller er **strengen i resource name**: `locations/eu` vs `locations/europe-west4` osv.
- Datastore kan ligge i `eu` multi-region selv om agent vises med vest-europeisk label — det er normalt

---

## Steg 2 — Vercel Production env (5 min)

**Thomas åpner:**

1. [Vercel → vox-web → Settings → Environment Variables](https://vercel.com/raddum-5965s-projects/vox-web/settings/environment-variables)
2. Filter: **Production**
3. Sammenlign **visuelt** (ID-er er OK å sammenligne side om side — **ikke** lim inn i Slack/issue):

| Vercel variabel | Skal matche GCP |
|-----------------|-----------------|
| `CES_PROJECT_ID` | `{PROJECT}` fra steg 1 |
| `CES_LOCATION` | `{LOCATION}` fra steg 1 — forvent **`eu`** |
| `CES_APP_ID` | `{APP_ID}` fra steg 1 |
| `CES_DEPLOYMENT_ID` | API access deployment ID — **ikke** `dc1619d0-…` |
| `CES_APP_VERSION_ID` | Dokumentert i repo; brukes ikke direkte i API-kall, men bør være satt |
| `GOOGLE_SERVICE_ACCOUNT_JSON` | **Kun sjekk at den finnes** — ikke del, ikke lim inn, ikke screenshot med innhold |

**Etter endring:** Redeploy Production (Deployments → … → Redeploy).

---

## Steg 3 — Trygg lokal sammenligning (valgfritt)

Uten å skrive secrets til disk permanent:

```bash
# Engangs: hent Production env til lokal .env (gitignored)
vercel env pull .env.vercel.production --environment=production

# Kjør sjekk — skriver kun match/mismatch for ID-felt, aldri SA JSON-innhold
node scripts/verify-ces-env-checklist.mjs --env-file=.env.vercel.production

# Slett fil etterpå hvis ønskelig
rm .env.vercel.production
```

Eller med npm:

```bash
npm run verify:ces-env -- --env-file=.env.vercel.production
```

---

## Hva skal være identisk

| Sjekk | Identisk = OK |
|-------|----------------|
| Project | `CES_PROJECT_ID` = GCP `{PROJECT}` |
| Location | `CES_LOCATION` = GCP `locations/{LOCATION}` segment |
| App | `CES_APP_ID` = GCP `{APP_ID}` |
| Deployment | `CES_DEPLOYMENT_ID` = API access deployment UUID |
| SA | `GOOGLE_SERVICE_ACCOUNT_JSON` satt i Production (presence only) |

---

## Røde flagg 🚩

| Flag | Betydning |
|------|-----------|
| `CES_LOCATION` = `europe-west1`, `europe-west4`, `europe-north1`, `finland`, … | **Sannsynlig mismatch** — repo/CES API forventer sannsynligvis `eu` for denne appen |
| `CES_LOCATION` ≠ segment i GCP app resource name | **Config fix nødvendig** |
| `CES_DEPLOYMENT_ID` = `dc1619d0-44a1-401b-92a6-1357c29274ea` | **Feil kanal** — Messenger, ikke headless API |
| `CES_APP_ID` ≠ app i GCP | Feil app |
| `CES_PROJECT_ID` peker på annet prosjekt enn appen | Feil prosjekt |
| `GOOGLE_SERVICE_ACCOUNT_JSON` mangler | `configuration_missing` / auth-feil |
| Alt matcher, fortsatt ~20 % success | **Ikke env** — eskalér CES upstream eller start backend-spike |

---

## Widget vs API deployment — med vilje?

**Ja.** To kanaler, samme app/location:

| Kanal | Deployment | Brukes av |
|-------|------------|-----------|
| API access (headless) | `edb2938a-…` | `/api/chat`, Vercel `CES_DEPLOYMENT_ID` |
| Messenger (widget) | `dc1619d0-…` | `BaseLayout.astro` `<chat-messenger>` |

Headless og widget skal **ikke** dele samme deployment ID i env.

---

## Anbefaling etter sjekk

| Utfall | Neste steg |
|--------|------------|
| **A) Env mismatch** | Oppdater Vercel Production env → redeploy → **én** manuell chat-test → deretter `npm run chat:reliability` |
| **B) Env matcher** | Eskalér CES/GCP upstream **eller** start **AI backend fallback spike v0.1** (se #196) |

**Ikke før env er verifisert:**

- Ny reliability-testserie som «bevis»
- PostHog activation
- Ekstern pilot

---

## Backstage senere?

**Ja, anbefalt v0.2:** Kort «CES env check»-seksjon i Backstage med:

- Forventede ID-er (fra repo)
- Lenker til Vercel env + GCP console
- «Kjør `npm run verify:ces-env` lokalt»
- Røde flagg som over

**Ikke nå:** Ingen server-side env-lesing i prod uten guard — unngå å eksponere config via API.
