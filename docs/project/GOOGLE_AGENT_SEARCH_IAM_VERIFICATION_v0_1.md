# Google Agent Search IAM / resource verification v0.1

Status: **Operator GCP-oppgave** — probe OK, Google svarer **403 PERMISSION_DENIED**.  
Related: [#198](https://github.com/THUNDERPLUNDER/vox-web/issues/198), [#213](https://github.com/THUNDERPLUNDER/vox-web/pull/213)

---

## 1. Konklusjon (etter QA `e4401c11`)

| Lag | Status |
|-----|--------|
| Preview route / GET readiness | OK |
| Payload contract (400) | **Løst** — Google svarer nå **403**, ikke 400 |
| **Aktuell blokkering** | **IAM:** `discoveryengine.servingConfigs.answer` denied |
| Reliability / UI-probe | **Stopp** — ikke videre arbeid her |

**Tolkning:** Samme service account som headless CES (`GOOGLE_SERVICE_ACCOUNT_JSON`) har sannsynligvis **`roles/ces.client`** (eller tilsvarende) for `runSession`, men **mangler Discovery Engine answer-tillatelse** for direct `:answer`.

---

## 2. Hvilken service account preview bruker

| Felt | Verdi |
|------|--------|
| Vercel env (Preview + Production) | `GOOGLE_SERVICE_ACCOUNT_JSON` |
| Samme SA som | `/api/chat` → `runCesSession` (`src/lib/ces-auth.ts`) |
| Secret | **Aldri** i repo, logger eller probe-output |

### Identifisere `client_email` (uten å dele nøkkel)

**Metode A — lokal checklist (anbefalt):**

```bash
npm run verify:ces-env -- --env-file=.env.local
```

Skriver kun: `client_email=<name>@<project>.iam.gserviceaccount.com` (ikke private_key).

**Metode B — Vercel:**

1. [Vercel → vox-web → Settings → Environment Variables](https://vercel.com/raddum-5965s-projects/vox-web/settings/environment-variables)
2. Filter **Preview** (og Production når relevant)
3. `GOOGLE_SERVICE_ACCOUNT_JSON` — **ikke** åpne/lim inn i issue; noter kun **client_email** fra JSON-feltet i Vercel UI

**Metode C — GCP IAM:**

1. [IAM → Service Accounts](https://console.cloud.google.com/iam-admin/serviceaccounts?project=hearing-aid-mvp)
2. Finn kontoen som brukes til CES headless (samme som i Vercel)

**Dokumenter i issue:** kun e-postadressen, f.eks. `viddel-headless@hearing-aid-mvp.iam.gserviceaccount.com` (eksempel — erstatt med faktisk fra steg over).

---

## 3. Eksakt Google resource path (`:answer`)

Fra `src/lib/agent-search-direct.ts` (preview QA `e4401c11`):

| Segment | Verdi |
|---------|--------|
| Host | `https://eu-discoveryengine.googleapis.com` |
| Method | `POST …:answer` |
| Project | `hearing-aid-mvp` |
| Location | `eu` |
| Collection | `default_collection` |
| Engine ID | **`AGENT_SEARCH_ENGINE_ID` påkrevd** — `CES_APP_ID` er **ikke** engine (se [engine verification](./GOOGLE_AGENT_SEARCH_ENGINE_RESOURCE_VERIFICATION_v0_1.md)) |
| Serving config | `default_serving_config` (overstyr med `AGENT_SEARCH_SERVING_CONFIG`) |

**Full resource name (servingConfig i path + IAM-feilmelding):**

```
projects/hearing-aid-mvp/locations/eu/collections/default_collection/engines/1741e68d-0528-4625-8b83-99a0dbb5298f/servingConfigs/default_serving_config
```

**HTTP:**

```
POST https://eu-discoveryengine.googleapis.com/v1/projects/hearing-aid-mvp/locations/eu/collections/default_collection/engines/1741e68d-0528-4625-8b83-99a0dbb5298f/servingConfigs/default_serving_config:answer
```

**Merk:** 403 (ikke 404) tyder på at **ressurs-stien gjenkjennes** — primær fix er IAM på SA, ikke path-typo.

---

## 4. IAM — hva som trengs

### Påkrevd permission (fra Google)

- `discoveryengine.servingConfigs.answer` på **servingConfig**-ressursen over  
- Dokumentasjon: [servingConfigs.answer](https://cloud.google.com/generative-ai-app-builder/docs/reference/rest/v1/projects.locations.collections.engines.servingConfigs/answer)

### Hva CES-SA sannsynligvis har i dag

| API | Rolle (typisk) | Permission |
|-----|----------------|------------|
| CES `runSession` | `roles/ces.client` | `ces.sessions.runSession` |
| Discovery `:answer` | **Mangler** | `discoveryengine.servingConfigs.answer` |

Se [CES IAM](https://cloud.google.com/iam/docs/roles-permissions/ces) vs [Discovery Engine IAM](https://cloud.google.com/iam/docs/roles-permissions/discoveryengine).

### Verifisere eksisterende roller (Thomas / gcloud)

Erstatt `SA_EMAIL` med faktisk `client_email`:

```bash
gcloud projects get-iam-policy hearing-aid-mvp \
  --flatten="bindings[].members" \
  --filter="bindings.members:serviceAccount:SA_EMAIL" \
  --format="table(bindings.role)"
```

Forventet funn i dag: f.eks. `roles/ces.client` — **uten** `roles/discoveryengine.user` / `roles/discoveryengine.editor`.

Test permission (valgfritt):

```bash
gcloud auth activate-service-account --key-file=/path/to/key.json   # kun lokalt, ikke del
gcloud projects get-iam-policy hearing-aid-mvp \
  --flatten="bindings[].members" \
  --filter="bindings.members:serviceAccount:SA_EMAIL"
```

---

## 5. Minste nødvendige IAM-endring (anbefaling)

### Anbefalt (minste forhåndsdefinerte rolle med `:answer`)

Gi **samme service account** som `GOOGLE_SERVICE_ACCOUNT_JSON`:

| Rolle | ID | Inneholder |
|-------|-----|------------|
| **Discovery Engine User** | `roles/discoveryengine.user` | `discoveryengine.servingConfigs.answer`, `.search`, `.recommend` |

**Scope:** prosjekt `hearing-aid-mvp` (samme som CES).

```bash
gcloud projects add-iam-policy-binding hearing-aid-mvp \
  --member="serviceAccount:SA_EMAIL" \
  --role="roles/discoveryengine.user" \
  --condition=None
```

**Hvorfor ikke bare utvide `roles/ces.client`?** CES-rolle dekker ikke Discovery Engine API — separate produkt-API.

### Strammere alternativ (custom role)

Hvis dere vil unngå bred `discoveryengine.user`:

1. Opprett custom role med kun:
   - `discoveryengine.servingConfigs.answer`
   - (ev.) `discoveryengine.servingConfigs.get`
2. Bind til `SA_EMAIL` på prosjekt eller engine-resource.

Dette krever mer IAM-arbeid; `roles/discoveryengine.user` er raskest for spike/QA.

### Ikke nødvendig for denne feilen

- Ny service account (med mindre dere vil splitte CES vs Discovery)
- Endre Vercel `CES_APP_ID` kun for IAM — 403 er permission, ikke unknown resource
- PostHog, backend-bytt, eller ekstern fallback

---

## 6. Engine / servingConfig (etter IAM-fix — bekreftet preview QA)

Etter `roles/discoveryengine.user`: **403 → 400** `INVALID_ARGUMENT` — *Cannot fetch Engine for: 1741e68d-…*

| Sjekk | Konklusjon |
|-------|------------|
| IAM på SA | **OK** |
| `1741e68d-…` som engine | **Feil** — det er `CES_APP_ID` (`apps/…`), ikke `engines/…` |
| Neste steg | Finn engine-ID i GCP → `AGENT_SEARCH_ENGINE_ID` i Vercel Preview |

Full guide: [GOOGLE_AGENT_SEARCH_ENGINE_RESOURCE_VERIFICATION_v0_1.md](./GOOGLE_AGENT_SEARCH_ENGINE_RESOURCE_VERIFICATION_v0_1.md)

| Videre test | Handling |
|-------------|----------|
| Feil serving config | `AGENT_SEARCH_SERVING_CONFIG=default_search` |
| LLM add-on / edition | `LLM_ADDON_NOT_ENABLED` / FailedPrecondition — GCP produkt |

---

## 7. Acceptance etter GCP-fix

1. Sett **`AGENT_SEARCH_ENGINE_ID`** (ekte engine fra GCP) i Vercel Preview
2. Preview probe → minst **ett** kall: Google **200**, `has_answer: ja`
3. Eller konklusjon: ingen engine for denne agenten → direct `:answer` passer ikke CES-only oppsett

**Ikke merge #213** før 200 **eller** skriftlig engine/GCP-konklusjon.

**Oppdatert:** Preview 5/5 success med IAM + riktig engine — se [known-good](./GOOGLE_AGENT_SEARCH_DIRECT_KNOWN_GOOD_v0_1.md).

---

## 8. Referanser

- [Discovery Engine IAM roles](https://cloud.google.com/iam/docs/roles-permissions/discoveryengine)
- [Agent Search access control](https://cloud.google.com/generative-ai-app-builder/docs/access-control)
- [Contract audit](./GOOGLE_AGENT_SEARCH_ANSWER_CONTRACT_AUDIT_v0_1.md)
- [CES env checklist](./CES_ENV_VERIFICATION_CHECKLIST_v0_1.md)
