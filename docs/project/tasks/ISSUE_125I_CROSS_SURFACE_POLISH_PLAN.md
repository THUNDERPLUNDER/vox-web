# Issue #125I-A — Cross-surface polish audit & plan

**Epic:** #125 Reskin MVP Surfaces / #120 MVP Design Lock v0.1  
**Sprint:** 2026-W21  
**GitHub:** [#157](https://github.com/THUNDERPLUNDER/vox-web/issues/157)  
**Dato:** 2026-05-26  
**Status:** Plan godkjent som arbeidsgrunnlag — ingen produksjonsendringer i denne runden

**Canonical hub model:** [DECISION_130_HUB_MODEL_V0_1.md](../decisions/DECISION_130_HUB_MODEL_V0_1.md)

---

## 1. Status

### Godkjent funksjonelt / strategisk

| Område | Status | Referanse |
|--------|--------|-----------|
| Hub-modell (Hjelp + Lyd i hverdagen) | Beslutningskandidat / MVP-retning | #130 |
| Hjelp A3 på `/no/hub/` | QA-godkjent, closed | #125D |
| Lyd i hverdagen production slice | QA-godkjent, closed | #125F |
| Forside som avklaringsflate / triage | QA-godkjent, closed | #125G / #125G-R3 |
| IA / nav-sync (Forside, Hjelp, Lyd i hverdagen, Ordbok, Om + Start samtale CTA) | QA-godkjent, closed | #125H |
| Footer-nav synket til hubmodellen | Del av #125H | — |
| Hørehjelpen som egen rute, ikke duplisert i primærnav | Del av #125H | `/no/chat/` |
| Tokens / primitives / typography lab | Under #120 / #122–#124 | VIS sprint W21 |

### Ikke visuelt modent ennå

- **Forsiden** — strategisk riktig mandat, men visuelt umoden (rytme, hierarki, «MVP-app»-følelse).
- **Hjelp** — fungerer som utility-hub, trenger senere polish i sammenheng med resten av flatene.
- **Lyd i hverdagen** — fungerer som editorial hub, trenger senere bilde-/kort-/redaksjonell polish.
- **Artikkelsider** — må vurderes i sammenheng med hubbene og AI-seeds, ikke isolert.
- **Global shell** — synlig layout jump / FOUC ved refresh og globalnav (R7: fantes også pre-#125H).
- **Dark mode** — kjent svakhet; parkert, ikke del av første polish-pass med mindre kritisk.

---

## 2. Flater som inngår

| Flate | Rute | Rolle i polish-pass |
|-------|------|---------------------|
| Forside | `/no/` | Triage / routing — mandat låst, visuell stramming |
| Hjelp | `/no/hub/` | Utility-hub — kort, spacing, hierarki |
| Lyd i hverdagen | `/no/lyd-i-hverdagen/` | Editorial hub — kort, bilder, redaksjonell ro |
| Hørehjelpen | `/no/chat/` | AI-dialogflate — kun hvis polish krever shell-justering; ellers utenfor første pass |
| Artikler | `/no/artikkel/*` | Surface alignment med editorial hub + seeds |
| Header / nav | Global shell | Layout-stabilitet (#125I-B); labels låst av #125H |
| Footer | Global shell | Kun hvis spacing/rytme henger sammen med øvrige flater |

**Utenfor første pass (med mindre eksplisitt mandat):** Ordbok, Om, sandbox, VIS, Storyblok schema, nye hubtyper.

---

## 3. Kjente problemer

### P1 — Layout jump / FOUC (kritisk, systemnivå)

- **Symptom:** Vertikal «snap» ved hard refresh og globalnav-klikk. Innhold under fixed header tegnes først med feil offset, deretter på plass.
- **Diagnose (R7):** Identisk FOUC-signatur i pre-#125H (`284037aa`) og #125H initial (`73b17e25`). **Ikke introdusert av #125H.**
- **Hypotese:** Fixed header, nav-layout og content `padding-top` (`pt-28` / `sm:pt-30`) avhenger av Tailwind-bundle i `/_astro/*.css` som laster etter first paint.
- **Behandles som:** Layout-systemproblem i `BaseLayout` / shell — **ikke** nav-label- eller IA-problem.

### P2 — Forsiden visuelt umoden

- Strategisk riktig (Hjelp, Lyd i hverdagen, Hørehjelpen fast-track).
- Trenger strammere rytme, tydeligere hierarki, mindre «tomme showcase-kort», mer redaksjonell ro.

### P3 — Hjelp trenger kontekstuell polish

- Fungerer som problemløser.
- Senere: kort, spacing, visual hierarchy, surface-bruk — i sammenheng med forside og editorial hub.

### P4 — Lyd i hverdagen trenger redaksjonell polish

- Fungerer som situasjons-/erfaringhub.
- Senere: bildebruk, kort, featured story, redaksjonell tyngde — ikke FAQ/support-følelse.

### P5 — Artikkelsider ikke fullt alignet

- Article System v0.1 / Spoke R1–R3 må henge visuelt sammen med Lyd i hverdagen og AI-seeds etter lesing.
- Ikke egen redesign — alignment og rytme.

### P6 — Dark mode svakhet (parkert)

- Kjent, ikke del av #125I første pass med mindre kritisk for QA.

---

## 4. Visuell retning for polish

Overordnede prinsipper (ingen ny brandrunde):

| Gjør | Unngå |
|------|-------|
| Mer autoritet og soliditet | MVP-appfølelse, generiske UI-showcase-kort |
| Mer redaksjonell ro | Tung kampanjeside |
| Tydeligere rytme mellom flater | Moduloverlast |
| Mer levende og oppdatert der relevant | Akademisk / institusjonell kopi |
| Tech/livsstil + omsorg (jf. #03_DECISIONS) | Klinisk eller distansert tone |

**Per hubtype (jf. #130):**

- **Hjelp** — rask, presis, utility; ikke magasin.
- **Lyd i hverdagen** — redaksjonell, rolig, innholdsorientert; ikke FAQ-liste.
- **Forside** — trafikkdirigent med tyngde, ikke landing page med tomme flater.

Polish = **stramming og sammenheng** innen eksisterende mandat og tokens — ikke ny wireframe-runde.

---

## 5. Referanse — FNI (inspirasjon, ikke stilkopi)

[Folkehelseinstituttet (FHI)](https://www.fhi.no/) — bruk som **inspirasjon**, ikke visuell kopi:

| Ta med | Ikke ta med |
|--------|-------------|
| Autoritet og faglig trygghet | Tung institusjonell hero |
| «Aktuelt»-følelse — levende, oppdatert tjeneste | Akademisk distanse |
| Redaksjonell tyngde i innholdsrytme | Moduloverlast / portal-følelse |
| Tydelig hierarki mellom nyheter, tema og dypdykk | Direkte layout-/fargekopi |

Målet er at Viddel føles **trygg, aktuell og redaksjonelt moden** — ikke som et offentlig forvaltningsportal-clone.

---

## 6. Foreslått arbeidsdeling (slices)

### #125I-A Cross-surface polish audit & plan ← *denne filen*

- Audit, plan, rekkefølge, guardrails.
- Ingen produksjonskode.

### #125I-B Layout stability / FOUC

- Undersøk og fiks eller avgrens transient content/header jump.
- Behandles som **layout-systemproblem** (`BaseLayout`, shell, CSS-load-rekkefølge).
- Verifiser **visuelt** (ikke bare bounding-box metrics).
- Ikke endre nav labels / IA fra #125H.

### #125I-C Frontpage polish

- Stramme rytme, hierarki, hovedvalg og Hørehjelpen fast-track på `/no/`.
- **Ikke endre mandat** (#125G-R3 triage).
- Tokens/primitives som allerede finnes — ingen nye.

### #125I-D Hub polish

- Samlet polish for **Hjelp** + **Lyd i hverdagen**.
- Kort, spacing, visual hierarchy, surface-bruk — sett i sammenheng, ikke isolert per side.

### #125I-E Article surface alignment

- Artikkelsider (`/no/artikkel/*`) i sammenheng med Lyd i hverdagen og AI-seeds.
- Article System v0.1 — alignment, ikke ny artikkelmal fra scratch.

### #125I-F Sprint close / design lock note

- Dokumenter hva som er landet etter #125I.
- Oppdater VIS review / sprint registry.
- Avklar hva som gjenstår til post-MVP eller #120 closure.

---

## 7. Guardrails

| Guardrail | Merknad |
|-----------|---------|
| Ikke ny brandrunde | Polish innen Viddel-retning |
| Ikke nye tokens uten eksplisitt mandat | Bruk #122 / `tokens.css` |
| Ikke domain cleanup | Eget spor |
| Ikke darkmode-sweep | Med mindre kritisk |
| Ikke Storyblok schema | Med mindre eksplisitt |
| Ikke nye hubtyper / emnehub | Jf. #130 — parkert |
| Ikke endre strategisk IA uten ny beslutning | #125H låst |
| Ikke nye primitives | Bruk #124 lab |
| Små, reviewbare PR-er per slice | Unngå ukontrollert redesign |

---

## 8. Anbefalt rekkefølge

```
#125I-A Plan (denne) 
    ↓
#125I-B Layout stability / FOUC     ← FØRST (blokkerer tillit til alt annet polish)
    ↓
#125I-C Frontpage polish            ← DERETTER (høy synlighet, mandat låst)
    ↓
#125I-D Hub polish                  ← Samlet pass Hjelp + Lyd i hverdagen
    ↓
#125I-E Article surface alignment
    ↓
#125I-F Sprint close / design lock note
```

### Begrunnelse for #125I-B først

- Thomas QA: jump er synlig og undergraver opplevd kvalitet på **alle** flater.
- R1–R6 i #125H løste ikke problemet; R7 viste at det er underliggende FOUC, ikke IA.
- Polish på forside/hub uten stabil shell risikerer dobbeltarbeid og «hoppet ble verre»-rapporter.

### Begrunnelse for #125I-C som nr. 2

- Forsiden er inngang til hele hubmodellen.
- Mandat er godkjent — kun visuell stramming, lav strategisk risiko.
- Gir rask synlig effekt etter layout-fix.

---

## 9. Akseptkriterier per slice (utkast)

| Slice | Ferdig når |
|-------|------------|
| **125I-B** | Ingen synlig vertikal jump ved refresh + globalnav (desktop + mobil ~390px); Thomas QA |
| **125I-C** | Forside føles strammere uten mandatendring; QA på `/no/` |
| **125I-D** | Hjelp + Lyd i hverdagen henger visuelt sammen; hubtyper fortsatt tydelige |
| **125I-E** | Artikkel → hub → AI-flyt føles som én tjeneste |
| **125I-F** | VIS/docs oppdatert; #125I lukket eller tydelig delvis |

---

## 10. Åpne spørsmål (til Thomas / neste planpass)

1. Skal `/no/chat/` (Hørehjelpen) polishes i #125I-D eller eget spor etter hub-pass?
2. Er dark mode «kritisk nok» til å inkludere i #125I-B hvis FOUC kun reproduseres i light?
3. Skal #125I-F coincides med #120 MVP Design Lock closure, eller egen avslutning?
4. FNI-referanse — er retningen riktig, eller finnes bedre intern referanse?

---

## Relatert arbeid

| Issue | Rolle |
|-------|-------|
| #125H | Closed — IA/nav-sync |
| #125G | Closed — forside mandat |
| #125D / #125F | Closed — hub production slices |
| #130 | Hub model decision |
| #157 | GitHub issue for #125I |
| R7 diagnose | Pre-#125H baseline `284037aa` — FOUC ikke introdusert av #125H |
