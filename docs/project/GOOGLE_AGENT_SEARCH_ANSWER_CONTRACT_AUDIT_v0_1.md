# Google Agent Search `:answer` contract audit v0.1

Status: **Audit + contract fix** (ikke UI, ikke merge #213 ennå).  
Related: [#198](https://github.com/THUNDERPLUNDER/vox-web/issues/198), [#213](https://github.com/THUNDERPLUNDER/vox-web/pull/213)

---

## Observasjon (preview QA `0c29802a`)

| Signal | Verdi |
|--------|--------|
| Route / Vercel | OK — GET readiness 200, `route_reached: yes` |
| Google upstream | **HTTP 400** på alle 5 kall |
| Vår wrapper | HTTP 502 (viderefører Google-feil) |
| Varighet | `<1s` — rask avvisning, ikke timeout |

**Tolkning:** Deterministisk **request contract**-feil, ikke reliability og ikke route/auth.

---

## 1. Endpoint og metode

| Sjekk | Status | Detalj |
|-------|--------|--------|
| Host EU | OK | `https://eu-discoveryengine.googleapis.com` for `location=eu` |
| Metode | OK | `POST …/servingConfigs/{id}:answer` (REST `servingConfigs.answer`) |
| Collection | OK | `default_collection` (standard) |
| Ikke blandet med `:search` | OK | Vi kaller `:answer`, ikke `:search` |

**URL vi bygger:**

```
POST https://eu-discoveryengine.googleapis.com/v1/projects/hearing-aid-mvp/locations/eu/collections/default_collection/engines/{engine_id}/servingConfigs/default_serving_config:answer
```

**Dokumentasjon:** [servingConfigs.answer](https://cloud.google.com/generative-ai-app-builder/docs/reference/rest/v1/projects.locations.collections.engines.servingConfigs/answer)

**Merk:** Noen curl-eksempler bruker `default_search:answer`; SDK-eksempler bruker `default_serving_config`. Begge kan være gyldige avhengig av app-type — verifiser i GCP om appen forventer `default_search` vs `default_serving_config`.

---

## 2. Engine / app ID

| ID | Kilde | API-ressurs |
|----|--------|-------------|
| `1741e68d-0528-4625-8b83-99a0dbb5298f` | `CES_APP_ID` / env | `…/engines/{id}/…` |

| Hypotese | Bevis |
|----------|--------|
| Samme UUID for Agent Search app og CES app | Google docs kaller engine path `APP_ID`; CES checklist bekrefter samme UUID i `apps/` |
| **Ikke** bevist at `engines/{CES_APP_ID}` finnes | **404** ville vært typisk for feil engine — vi får **400** |
| CES channel kan fungere uten at raw `:answer` er aktivert på samme app | 25% runSession vs 0% direct kan bety at channel bruker annet runtime |

**Neste operator-sjekk (GCP):**

1. Agent Builder / Discovery Engine → Apps → finn app → noter **Engine ID** i resource name.
2. Sammenlign med `CES_APP_ID`. Hvis ulik → sett `AGENT_SEARCH_ENGINE_ID` i Vercel.
3. Sjekk at app har **Answer / conversational search** (Enterprise / LLM add-on) — 400 kan også skyldes `LLM_ADDON_NOT_ENABLED` (FailedPrecondition, ikke alltid 400).

---

## 3. Payload vs dokumentert schema

### Query

| Felt | Vår kode | Dokumentasjon | Status |
|------|----------|---------------|--------|
| `query.text` | Ja | `Query.text` required | OK |

### Session

| Felt | Vår kode | Dokumentasjon | Status |
|------|----------|---------------|--------|
| `session: "-"` | Ja | Auto session wildcard | OK |

### GroundingSpec — **FEIL FUNNET**

| Felt | Vår kode (før fix) | Dokumentasjon | Status |
|------|-------------------|---------------|--------|
| `includeGrounding` | `true` | **Finnes ikke** | **INVALID** |
| `includeGroundingSupports` | manglet | [GroundingSpec](https://cloud.google.com/generative-ai-app-builder/docs/reference/rest/v1/GroundingSpec) | Skal brukes |

Protobuf/JSON med ukjent felt → typisk **`INVALID_ARGUMENT` (HTTP 400)**.

### AnswerGenerationSpec

| Felt | Vår kode | Status |
|------|----------|--------|
| `ignoreAdversarialQuery` | true | Sannsynlig OK (camelCase i REST JSON) |
| `ignoreNonAnswerSeekingQuery` | false | Sannsynlig OK |

**Fix:** Minimal kontrakt først: `query` + `session` + valgfri korrekt `groundingSpec`.

---

## 4. Auth

| Sjekk | Status |
|-------|--------|
| Scope `cloud-platform` | OK (samme SA som CES) |
| IAM `discoveryengine.servingConfigs.answer` | Må verifiseres i GCP — **403** ville vært typisk; vi får **400** |
| Token nås | OK (ellers auth-feil før Google) |

---

## 5. Konklusjon

| Spørsmål | Svar |
|----------|------|
| Er route/Vercel/UI fortsatt problemet? | **Nei** — løst i `0c29802a` |
| Er dette reliability? | **Nei** — 100% deterministisk 400 |
| Primær sannsynlig årsak | **`groundingSpec.includeGrounding`** (ugyldig felt) |
| Sekundære risikoer | Feil `servingConfig` navn; engine ID ≠ CES app; LLM add-on / app edition |
| Passer direct `:answer` denne agenten? | **Ja, trolig** — samme GCP-prosjekt/app, men contract må rettes og verifiseres i GCP |

---

## 6. Kodeendring (v0.1 fix)

- Fjern `includeGrounding`; bruk `includeGroundingSupports` eller dropp `groundingSpec` i minimal variant.
- `error_code`: `google_400_bad_request` ved upstream 400.
- Safe metadata: `google_rpc_status`, `google_error_hint` (kort, fra `error.status` / `error.message` — ikke logget server-side).

---

## 7. Neste steg

1. **Redeploy preview** etter contract-fix commit — forvent enten Google 200 + `has_answer`, eller mer spesifikk `google_error_hint`.
2. Hvis fortsatt 400: prøv `AGENT_SEARCH_SERVING_CONFIG=default_search` (env).
3. Hvis `LLM_ADDON_NOT_ENABLED` / edition: direct API passer ikke uten GCP endring — da CES channel fortsatt riktig vei.
4. **Ikke** merge #213 før ett gyldig 200 eller presis GCP-blokker.
