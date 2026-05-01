# KlarLyd Core Evidence Pack v1.0

**Status:** Draft / Canonical candidate  
**Dato:** 2026-05-01  
**Eier:** @navigator  
**Operativ bruk:** @rigger, @knaus, Cursor, Vibeke  
**Tilhører epic:** #84

---

## 0. Hvordan denne pakken brukes

- **Core Pack** er den canonical kilden for deck, VIS-underlag (jf. §19; inkl. repoets `/vis/`-flater der relevant), øvrige søknader og ekstern dialog der KlarLyd skal forklares konsekvent.
- **Slidedeck er ikke eneste kilde til sannhet.** Tekst og tall i presentasjoner skal kunne spores til denne pakken eller til eksplisitt merkede kilder.
- **Claims må klassifiseres** (jfr. §11 og §12) før de brukes eksternt. Bruk status i Claim Bank — ikke anta at alt som “hører bra ut” er dokumentert fakta.
- **Sterke retoriske formuleringer kan beholdes** for pathos og pitch, men skal merkes i Rhetorical Claim Bank med anbefalt bruksarena og risiko. Målet er å bevare overbevisningskraft uten å svekke etterrettelighet.

**Klassifiseringsetiketter (arbeidsverktøy):**

| Etikett | Betydning |
| --- | --- |
| Dokumentert fakta | Verifiserbar, med kilde og grønn/gul status |
| Trygg formulering | Formulering som holder seg innenfor dokumentert grunnlag |
| Retorisk formulering | Overbevisning; må ikke presenteres som ren fakta uten merking |
| Illustrativ formulering | Metafor eller eksempel; ikke tall eller juridisk/politisk presisjon |
| Arbeidshypotese | Internt resonnement; ikke ekstern claim uten gjennomgang |
| Påstand som trenger kilde | Må løftes til kilde eller tones ned / parkeres |
| Kun muntlig / pitch | OK i muntlig eller dedikert pitch-slide; ikke som hardt faktum i trykk |

---

## 1. Kort pitch

### Én-linjes posisjonering

_[Plassholder — én setning som plasserer KlarLyd vs. status quo.]_

### 30 sekunders pitch

_[Plassholder — 3–5 setninger: problem, løsning, hvem, hvorfor nå.]_

### 2 minutters pitch

_[Plassholder — utvidet narrativ med hook, innsikt, produkt, neste steg.]_

---

## 2. Hva KlarLyd er

### Produktdefinisjon

_[Plassholder — hva produktet *er*: tjeneste, plattform, AI-støttet innhold, osv.]_

### Hvem det hjelper

_[Plassholder — primær og sekundær målgruppe.]_

### Hvilket gap det fyller

_[Plassholder — mellom utstyr, oppfølging og daglig mestring.]_

### Hva det ikke er

_[Plassholder — f.eks. ikke erstatning for audiograf, ikke medisinsk diagnose, osv.]_

---

## 3. Problemet

### Brukerproblem

_[Plassholder — konkret smerte, friksjon, skam, utmattelse.]_

### Systemproblem

_[Plassholder — finansiering, organisering, prioritering i helsetjenesten.]_

### Kapasitetsproblem

_[Plassholder — tid hos audiograf, oppfølging, geografisk ulikhet.]_

### Teknologigap

_[Plassholder — avansert apparatur vs. brukerens faktiske mestring.]_

### Hverdagsmestring etter utlevering

_[Plassholder — hva skjer etter at apparatet er “levert”; analog opplevelse av digital løsning.]_

---

## 4. Hvorfor nå

### Demografi

_[Plassholder — aldring, behov for støtte, osv.]_

### Mer avanserte høreapparater

_[Plassholder — økt kompleksitet for bruker.]_

### Kapasitetsutfordringer

_[Plassholder — knappe ressurser i fagfeltet.]_

### AI/RAG-modning

_[Plassholder — teknologi som kan gi trygg, kildebasert veiledning.]_

### Behov for digital selvhjelp

_[Plassholder — forventning og etterspørsel etter 24/7-tilgang.]_

---

## 5. Brukere og behov

### Brukeren selv

_[Plassholder.]_

### Pårørende og hjelpere

_[Plassholder.]_

### Likepersoner / hørselshjelpere

_[Plassholder.]_

### Audiografer / fagmiljø

_[Plassholder — samarbeid, ikke konkurranse, avlastning.]_

### Produsenter

_[Plassholder.]_

### Stat / kommune / NAV

_[Plassholder.]_

---

## 6. Behovsmoduser og top tasks

Struktur hentet fra canonical IA-dokument (`KlarLyd_MVP_IA_og_innholdsarkitektur_v1.0.md` §4).

MVP-innholdet skal styres av behov og situasjoner, ikke av interne persona-navn synlig i UI.

| Behovsmodus | Typisk situasjon | Innholdet må gjøre |
| --- | --- | --- |
| Avklare | «Er dette hørsel, stress, alder eller noe annet?» | Hjelpe brukeren å forstå situasjonen og se mulig neste steg |
| Forstå | «Hvorfor skjer dette med meg?» | Forklare hørsel, lyd, anstrengelse og tilvenning uten å sykeliggjøre |
| Mestre | «Hva kan jeg gjøre i dag?» | Gi konkrete, små og praktiske grep |
| Feilsøke | «Hvorfor virker ikke dette?» | Løse teknisk friksjon raskt og presist |
| Støtte samtalen | «Hvordan snakker vi om dette?» | Gjøre relasjoner lettere og gi pårørende en bedre rolle |

_[Utvid plassholder: top tasks per modus for første hub.]_

---

## 7. Første MVP-scope

Canonical retning (jf. IA v1.0, lukket/oppdatert kontekst #77 / #78).

### Første hub

**Bedre lyd i hverdagen** — mestrings- og problemløserhub; hjelper brukeren å få mer ut av hørselen i konkrete hverdagssituasjoner med praktiske råd, forklaringer og rask AI-hjelp når noe stopper opp.

### Første tre spokes (R1–R3)

| Spoke | Arbeidstittel | Primær testverdi |
| --- | --- | --- |
| R1 | Samtaler hjemme og med familie | Relasjon, lytteanstrengelse, konkrete grep, pårørende-behov |
| R2 | Mobil, app og Bluetooth | Teknisk problemløsning, visuell instruksjon, RAG-presisjon |
| R3 | Hvorfor blir jeg så sliten av å høre? | Forklaring, trygghet, innsikt, emosjonell resonans |

### Øvrige MVP-elementer

- **Article AI** — kontekstuell hjelp i artikkelflyt.
- **Standalone chat** — egen inngang for åpen dialog (operativ definisjon videre i §8–9).
- **CES/RAG-grunnlag** — kunnskapsmotor som støtter innhold og svar med kildekrav og evalueringsgrenser (jf. §9).

_[Plassholder: MVP test readiness-kriterier og lenke til operative issues.]_

---

## 8. Produktmodell

### Hub & spoke

_[Plassholder — mandat per hub; spokes som testflater.]_

### Innhold + AI-dialog

_[Plassholder — redaksjonelt lag + samtale.]_

### Article AI vs standalone chat

_[Plassholder — når hvilken modus; jfr. IA §7 i innholdsarkitekturen.]_

### CES/RAG som kunnskapsmotor

_[Plassholder — rolle, ikke “hallusinasjonsmotor”.]_

### Chrome / editorial layer / action layer

_[Plassholder — UI-lag, redaksjonell kvalitet, handlinger brukeren kan ta.]_

---

## 9. AI / CES / RAG

### Hva agenten skal kunne

_[Plassholder — forklare, foreslå grep, henvise til innhold/kilder.]_

### Hva den ikke skal gjøre

_[Plassholder — diagnostikk, medisinske anbefalinger uten rammer, osv.]_

### Kildegrunnlag

_[Plassholder — RAG-korpus, redaksjonell policy.]_

### Eval-spørsmål

_[Plassholder — presisjon, trygghet, nyttighet, tone.]_

### Kvalitetsgrenser

_[Plassholder — eskalering til fag, disclaimers, logging/review.]_

---

## 10. Marked, tall og samfunnsøkonomi

> **Krav:** Alle tall som brukes i deck eller ekstern søknad skal ha **claim-status** i §11 før publisering. Ingen “lånte” tall uten verifikasjon.

### Omfang av hørselstap

_[Plassholder + status: Trenger kilde / Gul.]_

### Antall høreapparatbrukere

_[Plassholder + status.]_

### Underbruk

_[Plassholder + status.]_

### Ventetid

_[Plassholder + status.]_

### Audiografkapasitet

_[Plassholder + status.]_

### Demens / isolasjon / livskvalitet

_[Plassholder — forsiktig med kausalitet; klassifiser claims.]_

### Offentlig kostnadsbilde

_[Plassholder + status.]_

---

## 11. Claim Bank — evidence layer

Statusverdier: **Grønn** | **Gul** | **Rød** | **Trenger kilde** | **Parkert**

| ID | Claim | Evidence status | Trygg formulering | Kilde | Brukes i slide | Kommentar |
| --- | --- | --- | --- | --- | --- | --- |
| C-001 | _[Eksempel]_ Første hub i MVP er «Bedre lyd i hverdagen». | Grønn | Som i IA v1.0 | `KlarLyd_MVP_IA_og_innholdsarkitektur_v1.0.md` | _[slide-ID]_ | Canonical produktbeslutning |
| C-002 | _[Plassholder]_ | Trenger kilde | _[etter verifikasjon]_ | _[TBD]_ | — | — |
| C-003 | _[Plassholder]_ | Parkert | — | — | — | — |

_[Utvid tabellen etter hvert som claims låses — ikke bruk tomme celler som fakta.]_

---

## 12. Rhetorical Claim Bank — logos / ethos / pathos

> **Merk:** Radene under er **foreløpige retoriske formuleringer**, ikke dokumenterte fakta. De skal mappees til underliggende støtteclaims (§11) før bruk som «hard» tekst.

Retorisk rolle: **Logos** | **Ethos** | **Pathos** | **Logos + Pathos** | **Ethos + Pathos**

| ID | Retorisk formulering | Retorisk rolle | Underliggende støtteclaim | Bruksarena | Risiko | Anbefalt bruk |
| --- | --- | --- | --- | --- | --- | --- |
| R-001 | «Dagens modell finansierer maskinvaren, men ikke resultatet.» | Logos + Pathos | _[C-xxx system-/økonomi — Trenger kilde]_ | Muntlig pitch; søknad (etter review) | Overgeneralisering | Kun etter fag/juridisk avklaring; ellers illustrativ |
| R-002 | «Vi holder brukerne fast i et analogt oppsett rundt digital teknologi.» | Pathos + Logos | _[C-xxx brukeropplevelse]_ | Deck narrativ; ikke som statistikk | Kan oppleves polariserende | Merkes som retorikk; koble til konkrete observasjoner |
| R-003 | «KlarLyd flytter fokus fra utstyr til mestring.» | Ethos + Pathos | Produkttese; jfr. hub-mandat | Pitch, VIS «Hva er KlarLyd?» | Konkurranse mot apparatfokus | Trygg som posisjonering; presiser ikke erstatning for apparat |
| R-004 | «Ingen skal måtte vente på hjelp til å forstå teknologien de allerede har fått.» | Pathos | _[C-xxx kapasitet/kø]_ | Søknad, emosjonell slide | Absolutt «ingen» er sterkt | Behold med Etikett *Kun muntlig / pitch* eller myk form i trykk |
| R-005 | «Fra høreapparat i skuffen til lydglede i hverdagen.» | Pathos | Underbruk / motivasjon — **Trenger kilde** for tall | Illustrativ slide; ikke som prevalens | Metafor tatt for bokstavelig | Illustrativ formulering; ikke rapporter som studie |

_[Legg til flere R-ID etter behov; hold logikk: hver sterk setning har støtte-ID eller er eksplisitt illustrativ.]_

---

## 13. Funding- og stipendargumenter

### Samfunnsnytte

_[Plassholder.]_

### Innovasjonshøyde

_[Plassholder — RAG, tilgjengelighet, hybrid innhold/AI.]_

### Skalerbarhet

_[Plassholder.]_

### Forebygging

_[Plassholder — isolasjon, helseøkonomi med forsiktighet.]_

### Avlastning av fagmiljø

_[Plassholder — align med etisk posisjon §0.]_

### Tilgjengelighet / likeverdig hjelp

_[Plassholder.]_

---

## 14. Go-to-market og interessenter

### Brukere

_[Plassholder.]_

### Pårørende

_[Plassholder.]_

### HLF

_[Plassholder.]_

### Kommuner

_[Plassholder.]_

### Audiografer

_[Plassholder.]_

### Produsenter

_[Plassholder.]_

### NAV / offentlige aktører

_[Plassholder.]_

### Mulige piloter

_[Plassholder.]_

---

## 15. Roadmap

### MVP test readiness

_[Plassholder — kriterier, #78.]_

### Første brukertester

_[Plassholder.]_

### Første innholdsslice

_[Plassholder — hub + R1–R3.]_

### AI/RAG-kvalitet

_[Plassholder — eval, logging, review.]_

### Partner-/pilotspor

_[Plassholder.]_

### Funding-/stipendspor

_[Plassholder.]_

---

## 16. Team og troverdighet

### Thomas

_[Plassholder — rolle, erfaring, hvorfor KlarLyd.]_

### Vibeke

_[Plassholder.]_

### Faglige medspillere

_[Plassholder.]_

### Hvorfor dette teamet kan bygge dette

_[Plassholder — kompetanse + verdigrunnlag.]_

### Etisk posisjon og uavhengighet

_[Plassholder — ingen skjulte bindinger; respekt for brukere og fagmiljø; jfr. §0 Ethos.]_

---

## 17. Screenshots og demo-assets

Sjekkliste for innhenting (ingen filer i denne pakkens v1.0 — kun plan).

- [ ] Forside
- [ ] Hub («Bedre lyd i hverdagen»)
- [ ] R1 — Samtaler hjemme og med familie
- [ ] R2 — Mobil, app og Bluetooth
- [ ] R3 — Hvorfor blir jeg så sliten av å høre?
- [ ] Article AI før klikk
- [ ] Article AI etter seed
- [ ] Compose / oppfølgingsspørsmål
- [ ] Standalone chat
- [ ] Mobilvisning (representativ breakpoint)

---

## 18. Deck mapping

Base deck referanse (ekstern): *Grunnpreso KlarLYD april.pptx* (Drive) — **ikke endret av denne oppgaven**.

| Deckmodul | Henter fra Core Pack-seksjon | Status | Kommentar |
| --- | --- | --- | --- |
| Cover / tittel | §1, §2 | Draft | — |
| Problem | §3, §10 (med claim-status), §12 | Draft | Skill logos vs pathos |
| Hvorfor nå | §4 | Draft | — |
| Brukere | §5, §6 | Draft | — |
| Løsning / produkt | §2, §7, §8 | Draft | — |
| AI | §9, §11–12 | Draft | Kvalitet og grenser |
| Marked / samfunn | §10, §13 | Draft | Tall kun med Grønn/Gul |
| GTM | §14 | Draft | — |
| Roadmap | §15 | Draft | — |
| Team | §16 | Draft | Ethos |
| Appendiks / kilder | §11, §20 | Draft | — |

---

## 19. VIS mapping

Forslag til VIS-seksjoner (ingen endring i eksisterende VIS-dokument utført her).

1. Hva er KlarLyd?
2. Kjerneinnsikt
3. MVP-status
4. Produktmodell
5. Første hub og spokes
6. Article AI
7. Screenshots
8. Tall og claim-status
9. Pitch slides
10. Roadmap

_[Kryssreferanser til faktiske VIS-dokument-IDer når de finnes.]_

---

## 20. Kildebank

### Offentlige kilder

_[Plassholder — liste med URL/referanse.]_

### Bransjekilder

_[Plassholder.]_

### Forskning

_[Plassholder.]_

### Egne intervjuer

_[Plassholder — dato, metode, samtykke.]_

### Egne tester

_[Plassholder — hypotese, metode, resultat.]_

### Usikre kilder

_[Plassholder — bruk kun med merking; ikke til eksterne hard claims.]_

---

## 21. Åpne spørsmål

Startliste (utvid underveis):

1. Hvilke tall må verifiseres før deck v1?
2. Hvilke retoriske formuleringer skal brukes i hoveddeck vs muntlig pitch?
3. Hvordan dokumenterer vi ethos (uavhengighet, etikk, faglig rådgivning)?
4. Hvilke claims bør Vibeke reviewe kommersielt?
5. Hvilke claims bør fagpersoner (audiologi/klinikk) reviewe?
6. Hvilke screenshots trengs før deckoppdatering?
7. Hvordan synker vi denne filen med `Grunnpreso KlarLYD april.pptx` uten at deck blir sannhetskilde?
8. Hvilke referanser fra #77 og #78 skal limes inn som canonical tekst vs kun lenke?

---

## Vedlegg: Relaterte repo- og sporingskilder

| Kilde | Bruk |
| --- | --- |
| `docs/project/KlarLyd_MVP_IA_og_innholdsarkitektur_v1.0.md` | IA, hub, spokes, behovsmoduser, Article AI |
| GitHub #77, #78 | MVP / test readiness (oppdater med presise lenker i drift) |
| Epic #84 | Core Pack + canonical pitch deck spor |
| Drive: Grunnpreso KlarLYD april.pptx | Historisk deck — mappes via §18 |
