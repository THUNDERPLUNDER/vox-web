# Decision #130 — Viddel hub model v0.1

Status: Decision candidate / MVP direction  
Sprint: 2026-W21  
Parent: #120 MVP Design Lock v0.1  
Related work: #125C, #125D, #125E, #125F  

## Kort beslutning

Viddel bruker to primære, komplementære hubtyper i MVP-retningen:

1. **Hjelp**
2. **Lyd i hverdagen**

De er ikke alternativer. Begge trengs.

Hjelp dekker rask problemløsning.  
Lyd i hverdagen dekker redaksjonelt innhold, erfaring, mestring, lydglede og hverdagsforståelse.

En tredje type, **emnehub / topic hub**, er parkert som senere kryssflate og skal ikke bygges som primærhub nå.

---

## 1. Hjelp

**Rute:** `/no/hub/`  
**Status:** Bygget som #125D, QA-godkjent.  
**Type:** Utility / problemløsning.  

### Brukerjobb

> Noe virker ikke. Hva gjør jeg nå?

### Typiske behov

- Stoppe piping
- Koble høreapparatet til mobilen
- Appen finner ikke høreapparatet
- Bytte filter / dome
- Forstå når audiograf bør kontaktes
- Spørre Hørehjelpen direkte

### Format

- AI-spørrefelt først
- Oppgavekort
- Kompakt problemliste
- Korte guider
- Eskalering til Hørehjelpen / audiograf

### Designrolle

Hjelp skal være rask, presis og utility-preget.  
Den skal ikke føles som magasin eller redaksjonell hub.

---

## 2. Lyd i hverdagen

**Rute:** `/no/lyd-i-hverdagen/`  
**Status:** Bygget som #125F, QA-godkjent.  
**Type:** Editorial / erfaring / mestring.  

### Brukerjobb

> Hvordan lever jeg bedre med høreapparat?

### Typiske behov

- Forstå hva som er normalt
- Kjenne seg igjen i andres erfaringer
- Lære strategier for hverdagssituasjoner
- Håndtere lyttetrøtthet
- Få mer glede av små lyder, musikk, stemmer og nærvær
- Finne språk for jobb, sosialt liv og pårørende

### Format

- Situasjonsbaserte innganger
- Featured story
- Redaksjonelle artikkelkort
- AI-seeds som videre samtale etter lesing
- Lavmælt lenke til Hjelp ved praktiske problemer

### Designrolle

Lyd i hverdagen skal være redaksjonell, rolig og innholdsorientert.  
Den skal ikke føles som FAQ, support eller problemliste.

---

## 3. Emnehub / topic hub

**Status:** Parkert.  
**Type:** Senere kryssflate.  

### Rolle

En emnehub kan senere samle både Hjelp og Lyd i hverdagen rundt ett tema.

Eksempel: **På jobb**

Kan inneholde:

- Praktisk hjelp: koble høreapparat til Teams / PC
- Editorial: lyttetrøtthet i møter
- AI-seeds: hva kan jeg si til kollegaene mine?
- Guider, erfaringer og forklaringer

### Viktig avgrensning

Emnehub er ikke en tredje primærhub nå.  
Den skal ikke blandes med rotsidene før IA er mer avklart.

---

## Foreløpige emner og kandidater

Mulige temaer / seksjoner senere:

- Kom i gang / Ny med høreapparat
- På jobb
- Sosialt liv og samtaler
- Små lyder og lydglede
- Lyd og energi
- For pårørende
- Teknikk og app
- Helse og avklaring
- Ordbok

Disse er ikke nødvendigvis egne hubber. Noen kan være seksjoner, artikkelserier, emnehuber eller navigasjonsinnganger.

---

## Primære innganger i MVP-retningen

Forsiden bør rute tydelig til:

1. **Hjelp**  
   Når noe ikke virker.

2. **Lyd i hverdagen**  
   Når brukeren vil forstå, mestre og få mer ut av lyden.

3. **Hørehjelpen**  
   Når brukeren vil spørre direkte.

---

## Åpne spørsmål

- Skal `Lyd i hverdagen` være endelig navn, eller arbeidstittel?
- Skal Hjelp og Lyd i hverdagen begge inn i toppmeny?
- Når skal emnehub bygges første gang?
- Skal Ordbok være egen referanseflate eller del av Hjelp?
- Hvilke artikkeltyper må være med i første editorial MVP?

---

## Neste produktsteg

Neste produktsteg etter #125D og #125F er:

**#125G Forside/routing**

Forsiden skal forklare og rute mellom:

- Hjelp
- Lyd i hverdagen
- Hørehjelpen

Forsiden skal ikke løse full IA, toppmeny eller endelig innholdsmodell alene.

---

## Arbeidsregel

Denne beslutningen kan oppdateres etter ny research, men skal brukes som gjeldende arbeidsmodell for videre #125-slices inntil den eksplisitt endres.
