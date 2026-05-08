# VIDDEL IA-prinsipper v0.1

> Canonical grunnmur for informasjonsarkitektur før videre hub-bygging.
> Vedtatt: 2026-05-08 · Status: aktiv

---

## 1. Need-led IA / top tasks

Strukturen på Viddel er bygget rundt **faktiske brukerbehov og top tasks** — ikke rundt produktkategorier, organisasjonslogikk eller målgrupper.

Prinsippet følger Gerry McGoverns need-led IA-tradisjon:
- Brukerne kommer med en oppgave de vil løse.
- Navigasjonen speiler disse oppgavene, ikke hvem brukerne er.
- "Stoppe piping" er et behov og potensielt en top task, ikke en målgruppe.

Top task og behov kan overlappe. Eksempel: "Kjøpe mobil" på Telenor er både et behov og en top task. I Viddel gjelder det samme: "Stoppe piping" er den faktiske oppgaven brukeren kommer for å løse.

---

## 2. Navigasjon = behov, ikke segmenter

**Navigasjon og hubstruktur skal IKKE speile målgrupper eller segmenter.**

Feil tilnærming:
- Hub: "For deg som er ny bruker"
- Hub: "For deg som hjelper noen"
- Hub: "For pensjonister"

Riktig tilnærming:
- Hub: "Lyd og hverdagssituasjoner" (behov)
- Hub: "Feilsøking og tekniske problemer" (behov)
- Hub: "Starte med høreapparat" (behov)

Segmenter er IKKE nav-noder. De er analyseverktøy.

---

## 3. Segmenter: analyse og vinkling

Segmenter brukes internt til å:
- Forstå **hvem som eier behovet sterkest**
- Avgjøre **vinkel og tone** for artikkelen
- Identifisere om ett behov krever **flere artikler** fordi det arter seg vesentlig forskjellig mellom segmenter

Kjente segmenter i Viddel:
- **Daglig bruker** — den som bærer høreapparatet
- **Ny bruker** — nettopp fått/startet med høreapparat
- **Hjelper** — pårørende/ledsager som bistår

Bruken av segmenter: artikkelmandat, innholdsstrategi, prioritering.
Ikke brukt til: navigasjon, URL-struktur, kategorier.

---

## 4. Hubber: hva de er

En hub er et **tematisk samlingspunkt for beslektede behov og top tasks**.

Hubber er:
- Organisert rundt brukerbehov, ikke produkter
- Inngangspunkter til spoke-artikler
- Ikke segmentert (alle segmenter kan finne sin vei via hubben)

Eksempel: Hubb "Feilsøking" kan inneholde artikler for daglig bruker og artikler primært for hjelper, men de er søsterartikler under samme behovsdimensjon — ikke separate kategorier.

---

## 5. Artikkelmandat: kjernemodell per side

Hver artikkel skal ha et kort **artikkelmandat** som beskriver:

| Felt | Beskrivelse |
|---|---|
| Behov / top task | Den konkrete oppgaven artikkelen løser |
| Primærsegment | Hvem som eier behovet sterkest |
| Sekundærsegment | Andre segmenter som artikkelen er relevant for |
| Stadium | Hvor brukeren er i sin reise (f.eks. Feilsøking, Tilvenning, Avklaring) |
| Modus | Hva brukeren prøver å gjøre (f.eks. Mestre, Gjøre, Forstå, Beslutte) |
| AI-rolle | Hva AI-broen bør bidra med for denne artikkelen |
| Videre | Neste naturlige destinasjon etter artikkelen |

Mandatet er synlig i dev/inspect-kontekst per artikkel. Det er **ikke** offentlig brukerinnhold.

### Eksempel: "Stoppe piping"

```
Behov / top task:  Stoppe piping
Primærsegment:     Daglig bruker
Sekundærsegment:   Hjelper
Stadium:           Feilsøking
Modus:             Mestre
AI-rolle:          Første steg + når be om hjelp
Videre:            Audiograf hvis vedvarer
```

---

## 6. "For deg som hjelper noen" er ikke hub nå

"Hjelper" er foreløpig:
- Et **segment** (vinklingsverktøy)
- En mulig **artikkelvinkel** (f.eks. "Slik hjelper du noen med ny høringsapparat")
- Et potensielt fremtidig **produktspor** (eget onboarding eller brukerflyt)

Det er **ikke** en egen nav-hub eller kategori nå.

Begrunnelse:
- Hub-struktur styres av behov, ikke av hvem personen er
- En hjelper har samme top tasks som en daglig bruker (feilsøking, tilvenning, teknisk hjelp)
- Separering ville fragmentere innholdet uten å tilføre navigasjonsverdi

---

## 7. Bruk i Cursor / agentarbeid

Når Cursor eller en annen agent jobber med:

**Navigasjon og hubstruktur:**
- Ikke opprett segmentbaserte nav-noder
- Spør alltid: "Hva er brukerens behov/top task?" — ikke "Hvem er brukeren?"

**Artikkelarbeid:**
- Hver ny artikkel bør ha et artikkelmandat-forslag
- Mandatfelter bør ligge i Storyblok-content-modellen (felt som `need_top_task`, `primary_segment`, `secondary_segment`, `stadium`, `mode`, `ai_role`, `onward`)
- Fallback-data brukes i dev/inspect inntil Storyblok er oppdatert

**Hubbygging:**
- Les `14_FIRST_HUB_MANDATE_AND_TOP_TASKS_v0_1.md` for konkret første hub
- Hubbens navn skal reflektere behovet, ikke målgruppen

**Inspect/dev-modus:**
- Artikkelmandat vises automatisk når `html[data-vox-inspect-drawer-active="true"]`
- Toggle finnes i headeren (desktoptoggle + mobilmeny) på alle sider som bruker `BaseLayout`
- For VIS-sider (PrototypeLayout): inspectdrawer er ikke tilkoblet — dev-info leses direkte fra kildekode

---

*Dette dokumentet vedlikeholdes som en del av Viddel IA-kanon. Oppdater ved store IA-beslutninger.*
