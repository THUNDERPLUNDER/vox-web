# Viddel — privacy-first effektmåling, state og datagrunnlag (v0.1)

## Formål

Dette dokumentet lander arbeidsgrunnlaget fra **GitHub #99** i repoet: en **privacy-first** modell for måling, state og datagrunnlag i Viddel MVP, uten å åpne for database, Mine sider, datalake eller transkript-lagring i denne runden.

**Hovedprinsipp:** Data skal være en konsekvens av hjelp, ikke et uttrekk fra brukeren.

**Arkitektur-port:** Større stack- og lagringsvalg skal forankres i **#105** før tung implementering.

---

## 1. State v0.1 — «current best answer» (klar til intervju / lett prototype)

Følgende felter er **kandidat-modell** (testes før dyp teknisk lagring):

| Dimensjon | Beskrivelse |
|-----------|-------------|
| Apparat | Merke / modell (kontrollert liste + «annet» der nødvendig) |
| Brukerfase | F.eks. ny, etablering, daglig bruk, feilsøking |
| Bruksstatus | Daglig / av og til / ligger mest i skuffen |
| Problemkategori | Kontrollert taksonomi (koblet til innhold/AI-kontekst) |
| Første verdi | Ja / nei |
| Trenger menneskelig hjelp | Ja / nei |
| Samtykke | Eksplisitt samtykke til lagring/måling der det trengs |

**Merk:** Dette er *ikke* implementert som persistens i `vox-web` per nå; det er definisjon klar nok til brukertest og UX-prototype.

---

## 2. Fire datadeler (skilleflate)

### 2.1 Brukerstate

Hva Viddel trenger for å **hjelpe** brukeren bedre i øyeblikket (kontekst om apparat, fase, intensjon, preferanser). Ikke synonymt med markedsføringsprofil.

### 2.2 Mestringsstate

Hva Viddel trenger for å vise **fremgang** (fullførte steg, «prøvd», situasjoner øvd på, enkel mestringsvurdering).

### 2.3 Effektstate

Hva Viddel trenger for å **dokumentere om tjenesten virker** (endring i bruksstatus over tid, om problem oppleves løst, behov for audiograf, målbar «første verdi»). Senere: validerte skjema (f.eks. IOI-HA) kun når riktig klinisk/lovlig grunnlag finnes.

### 2.4 Aggregert kommersiell innsikt

Hva interessenter kan bruke i **lovlig, aggregert og ikke-identifiserende** form (hyppige problemer per merke/modell, frafall, gjentakende spørsmålstyper, innhold/AI vs. menneskelig eskalering).

---

## 3. Event-vokabular v0.1 (kandidat)

Navn er stabile **snare strenger**; implementasjon kan komme via f.eks. `trackViddelEvent(name, payload)`.

### 3.1 Trafikk og innhold

- `page_viewed`
- `hub_viewed`
- `article_viewed`
- `article_section_reached`
- `related_article_clicked`

### 3.2 AI / Hørehjelpen

- `seed_question_shown`
- `seed_question_clicked`
- `ai_answer_started`
- `ai_answer_shown`
- `followup_question_started`
- `followup_question_sent`
- `chat_opened`

### 3.3 Mestring og hjelpeeffekt

- `first_step_clicked`
- `answer_marked_helpful`
- `answer_marked_not_helpful`
- `problem_marked_solved`
- `human_help_needed`
- `guide_completed`
- `tried_step_saved`

### 3.4 Restart / frafall

- `restart_started`
- `dropoff_reason_selected`
- `device_status_reported`

### 3.5 Eskalering

- `support_path_opened`
- `audiologist_contact_suggested`
- `nav_info_opened`
- `manufacturer_help_suggested`

---

## 4. Payload-regler

### 4.1 Tillatte retninger

- Payload skal være **kontrollert og forhåndsdefinert** (kjente nøkler, enums, korte strenger fra whitelist).
- Eksempel (fra #99):

```ts
trackViddelEvent("seed_question_clicked", {
  topic: "bluetooth",
  phase: "daily_use",
  article: "koble-horeapparat-til-mobil",
  seedType: "troubleshooting",
});
```

### 4.2 Skal **ikke** sendes som standard

- Navn, e-post, telefon
- Diagnose, klinikk, sensitive helseopplysninger
- Brukerens fritekst / fulle samtaletranskripter
- Identifiserbar samtalehistorikk
- Rå CES-token eller andre hemmeligheter

### 4.3 Drift og pseudonymitet

- Ved behov for korrelasjon over økter: **kun** kortlevde, roterende eller strengt begrensede pseudonyme id-er, under DPA og DPIA — **ikke** implementert i denne docs-runden.

---

## 5. Hørehjelpen / Google Cloud (CES) — data og avklaring (#99)

Dette avsnittet **avklarer på første tekniske nivå** hvordan Hørehjelpen er koblet i `vox-web`, hva som sannsynligvis behandles i **Google Cloud**, og hvilke **oppgaver som gjenstår** i konsoll, avtaleverk og juridisk vurdering. Det er **ikke** juridisk rådgivning.

### 5.1 Produktnavn og dokumentasjon (offentlig)

Googles kundekontakt-/AI-agentplattform omtales i nyere offentlige kilder blant annet som **Gemini Enterprise for Customer Experience** og **Customer Engagement Suite** (blogg/produkttekster). I kodebasen brukes fortsatt **CES**-SDK og `chatSdk.prebuilts.ces`. Ved avtale og support: bruk **prosjektnummer, faktureringskonto og produktnavn** som står i din GCP-kontrakt, og kryssjekk mot:

- Gemini Enterprise for Customer Experience — *Essentials* terms (oppdatert avtaletekst): [cloud.google.com/terms/gecx](https://cloud.google.com/terms/gecx)
- Rolle- og IAM-oversikt (intern tilgang i *ditt* GCP-prosjekt): [cloud.google.com/iam/docs/roles-permissions/ces](https://cloud.google.com/iam/docs/roles-permissions/ces)
- Produkt-/løsningsside (markedsføring + pekere til sikkerhet/personvern): [cloud.google.com/solutions/customer-engagement-ai](https://cloud.google.com/solutions/customer-engagement-ai)

**Viktig:** Retention, eksport, logger og eksakt databehandlerroller må **bekreftes** mot (1) kontraktsversjon du har signert, (2) aktuelle produktnotater fra Google-konto-team, (3) innstillinger i **din** agent-/deployment-konfigurasjon — dette varierer med SKU og region.

### 5.2 Hva kodebasen faktisk gjør (teknisk grenseflate)

| Komponent | Funksjon | Data som *berører* Google |
|-----------|----------|---------------------------|
| `BaseLayout.astro` (inline script) | Laster widget-API, kaller `chatSdk.registerContext(chatSdk.prebuilts.ces.createContext({ deploymentName, tokenBroker: … }))` | `deploymentName` peker på **EU**-deployment i prosjekt `1088102295663` (jfr. `02_LINKS.md`). **Token broker** er påslått (`enableTokenBroker: true`). Recaptcha av i denne registreringen. |
| `chat-messenger` (web component) | Samtale-UI; lastes fra `gstatic.com/ces-console/fast/chat-messenger/prod/v1.15/` | Brukerens **spørsmål og assistentens svar** går via Googles klient/motor — **ikke** persistert av den statiske Astro-appen som egen database. |
| `ArticleInlineChatShell.astro` | Skjult `chat-messenger` + VOX-eid transcript-lag for artikkelopplevelsen | Samme CES-motor; VOX styrer **presentasjon** og kan lese DOM for UX — **skal ikke** logge fritekst som produkttelemetri (jf. §4). |
| `/no/chat.astro` | Full widget + **debug**-lyttere på `chat-messenger-*`, `vox-ces-register`, `ces-messenger-connected` | Kun **nettleser-konsoll** / kopierbar debug — ikke en definert dataflyt til VOX-backend. |

**Konklusjon for «hvem eier hva» (MVP-nivå):** Samtale**innhold** og agent**kjøring** behandles i **Googles kontrollerte miljø** knyttet til deployment; **VOX-eid kode** sender ikke samtaler til egen server i denne arkitekturen, men **host** (f.eks. Vercel/GitHub Pages) kan likevel ha **tilgangslogger** for HTTP-forespørsler til siden.

### 5.3 Datatyper i praksis (skille for DPIA)

1. **Samtaleinnhold (bruker + modell)** — behandling hos **Google** som del av CES/Agent-tjenesten; omfang og lagring styres av **Google DPA / produktvilkår** og innstillinger i prosjektet.
2. **Drifts- og sikkerhetsdata («Service data»)** — Google beskriver i essentials-avtalen egen behandling av bl.a. konto, fakturering og teknisk driftsinformasjon; dette er **adskilt** fra «Your Content» i avtaleteksten — **verifiser definisjon** i gjeldende versjon.
3. **VOX-first-party** (når `trackViddelEvent` innføres) — kun **forhåndsdefinerte** hendelser uten fritekst (jf. §3–4), under eget samtykke/behandlingsgrunnlag.
4. **Nettverkslogger hos host** — IP, User-Agent, tid; reguleres av host-avtale og informasjonsplikt.

### 5.4 Konkrete avklaringsoppgaver i Google Cloud (sjekkliste)

Disse bør gjøres av noen med **Organization/Project Owner** eller avtalt sikkerhetsrolle på `hearing-aid-mvp` / prosjekt `1088102295663`:

- [ ] **Deployment / Agent Builder:** Finn i konsollen agenten som matcher `deploymentName` i `BaseLayout.astro` — noter **region** (allerede `eu` i stien), **logging/ history**-innstillinger hvis eksponert i UI.
- [ ] **Logging:** Avklar om **Cloud Logging** i prosjektet fanger agent- eller gateway-kall (filtre på relevante API-er), og **hvem** som har lesetilgang. Avklar **retention** på loggbuckets.
- [ ] **Eksport / hendelsesarkiv:** Finnes det støtte for eksport av samtalemetadata eller full historikk for **compliance** — kun gjennom **konto-/supportkanal** hvis ikke synlig i UI.
- [ ] **DPA og underleverandører:** Bekreft signert **Google Cloud Data Processing Addendum** og at **Gemini Enterprise for Customer Experience** / CES er innenfor avtalt bruksområde.
- [ ] **Roller:** Kartlegg IAM-prinsipp «minste privilegium» mot [CES-relaterte roller](https://cloud.google.com/iam/docs/roles-permissions/ces) for teammedlemmer og CI.

### 5.5 Hva som *ikke* kan avklares fra repo alene

- Eksakt **oppbevaringstid** for samtaler og **sletterutiner** i Googles miljø.
- Om **full transkripsjon** lagres som standard i deres SKU, eller kun aggregerte **metrics**.
- Hvilke **under-prosessorer** og **overføringer** som utløses av *deres* konfig (f.eks. bestemte Gemini-modeller eller regioner).

Disse punktene skal innhentes skriftlig (support ticket / Customer Engineer / juridisk) og inn i **DPIA** med referanse til **#99** og **#105**.

### 5.6 Konsekvens for VOX-implementering (uendret mandat)

- **.cursorrules:** Rør ikke `<chat-messenger>` / CES-widget uten eksplisitt mandat.
- **Produkttelemetri:** Bygg på `trackViddelEvent` med whitelist (§4) **uten** samtaletekst; korreler ikke mot CES conversation-id før avtale og grunnlag er på plass.
- **Article AI Bridge:** Fortsett å utlede hendelser fra **UI** (seed-klikk, tilstandsskifte, feilkoder), ikke fra rå meldingspayload.

---

## 6. Safe-read av `vox-web` (2026-05-06)

### 6.1 Artikkel-spokes og hub

- Statiske R1/R2/R3-spokes under `src/pages/no/artikkel/` (f.eks. `r1-spoke-v03.astro`).
- Storyblok-drevet artikkel: `src/pages/no/artikkel/[slug].astro`.

### 6.2 Article AI Bridge (embedded dialog)

- `src/components/article/ArticleInlineChatShell.astro`: moduser (`progressive` / `direct`), **seed-knapper** med `data-inline-chat-seed="{question}"`, skjult `chat-messenger` som teknisk bro, state på `data-inline-chat-state`, `data-inline-chat-conversation`, transcript/compose med `data-inline-chat-*`.
- Naturlige hook-punkter for fremtidige events (uten å endre CES): klikk på seed, åpning av valgt dialog, send av oppfølgingsspm., visning av assistentsvar, feil (`chat-messenger-error-v2`), fallback til `/no/chat`.

### 6.3 Chat-flater

- `/no/chat.astro`: full CES-widget, **debug-lytting** på flere `chat-messenger-*` events (kun konsoll / kopierbar debug — ikke produkt-analytics).
- `/no/index.astro`: CES-panel på landing.
- `src/pages/no/sandbox/chat-shell.astro`: sandbox / feasibility — ikke produksjonskoblet.

### 6.4 Eksisterende «analytics hooks»

- **Ingen** sentral `trackViddelEvent` eller tilsvarende i repoet per nå.
- **Ingen** `@vercel/analytics` eller `gtag` i `package.json` / layouts (kun typografi «tracking» i Tailwind-klasser).
- Nettleser-side logging av CES-livssyklus finnes som **dev-debug** på chat-siden, ikke som samtykkebasert produkttelemetri.

### 6.5 Deploy / drift (OBS)

- `docs/project/00_STATE.md` og `02_LINKS.md` omtaler **Vercel** som deploy-mønster.
- `.github/workflows/deploy.yml` er konfigurert for **GitHub Pages** via `withastro/action`. **Faktisk produksjons-host** mot `vox.raddum.no` bør være én sannhet i drift — påvirker hvor CDN/logs/Analytics knyttes.

---

## 7. Teknisk plan — neste minste steg (anbefaling)

1. **Ikke replatform.** Behold Astro + statisk der det passer.
2. **Innfør én intern wrapper** `trackViddelEvent(name, payload)` (evt. no-op i dev, valgfri batching) — signatur og whitelist i egen liten modul under f.eks. `src/lib/`.
3. **Start med ikke-identifiserende, strukturerte hendelser** på VOX-eide flater (side/artikkel/hub, seed-klikk, «chat åpnet» der det ikke krever innholdslesing).
4. **State v0.1**: prototype i Figma/ly på papir eller lavnivå JSON i brukertest *før* database.
5. **Logg aldri fritekst** fra compose som standard; korreler kun kontekstkoder (artikkel-id, seed-type, enum).
6. **Parkér** datalake / Power BI / full Mine sider til etter #105.

---

## 8. Hva som kan måles før brukertest / pilot vs. hva som bør vente

### 8.1 Kan startes (lav risiko, høy læringsverdi)

- Side- og innholdsnavigasjon (`page_viewed`, `article_viewed`, `hub_viewed`) med pseudonym eller anonym sesjon — etter cookie-banner/samtykke avtale.
- Klikk på **forhåndsdefinerte** startspørsmål / CTA (`seed_question_clicked`, `related_article_clicked`) med **whitelist**-payload (slug, topic, seed-id — ikke fritekst).
- Åpning av full chat (`chat_opened`) fra kjente knapper.

### 8.2 Bør vente til CES/DPA er avklart

- Hendelser knyttet til **svarinnhold**, svartid som identifiserer bruker, eller korrelasjon mot CES conversation id.
- Lagring av **effektstate** på tvers av uker uten eksplisitt produkt- og juridisk ramme.
- Automatisert «helpful / not helpful» som kobles til persondata.

### 8.3 I tråd med #99-avgrensning (eksplisitt ikke nå)

- Full database for brukerstate.
- Full «Min side».
- Standard lagring av transkripter.
- Growth/engasjementsjakt uten produktmessig formål.

---

## 9. Samtykke og personvern (identifiserte spørsmål)

- Hvilket **behandlingsgrunnlag** gjelder for hver event-kategori (samtykke vs. berettiget interesse — må juridisk avklares).
- Hvordan knyttes event til **informasjonsplikt** i persona**vern**/cookie-tekst (`/no/personvern` m.m.).
- **Retention** og sletting for event-lagring.
- **Subprocessors** (Vercel/GCP/Google CES) i DPIA.
- **Barn og sårbar gruppe** — om spesielle hensyn kreves i copy og defaults.

---

## 10. Akseptkriterier fra #99 (innhold i repo)

| Kriterium | Status |
|-----------|--------|
| State v0.1 definert godt nok til testing | Ja — se §1 |
| Event-vokabular dokumentert | Ja — se §3 |
| Payload-regler + «ikke send» | Ja — se §4 |
| CES/Hørehjelpen / Google Cloud dataskille | Ja — teknisk grenseflate og sjekkliste §5; konsoll + avtale må fylle hullene |
| Skille fire statedata-typer | Ja — se §2 |
| Samtykke/personvern identifisert | Ja — se §9 |
| Anbefaling før pilot vs. vent | Ja — se §8 |
| Koblet til #105 | Ja — arkitektur-port i topp + §7 |

---

## 11. Relaterte saker

- #99 (kilde-issue)
- #105 Arkitektur-beslutningsport for State v0.1 og engasjementsloop
- #102, #103, #97 (kontekst i #99)

---

## Sist oppdatert

- Dato: 2026-05-06
- Grunnlag: GitHub issue #99 + safe-read av `vox-web` + offentlige Google Cloud-lenker for GECX/CES (§5.1)
