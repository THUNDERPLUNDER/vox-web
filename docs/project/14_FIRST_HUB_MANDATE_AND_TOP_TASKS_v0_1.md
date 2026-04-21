# 14_FIRST_HUB_MANDATE_AND_TOP_TASKS_v0_1

Kort og byggbar kontrakt for første hub v0.1: **Bedre lyd i hverdagen**.

## 1) Mandat (laast i v0.1)

Huben skal hjelpe brukeren med aa finne riktig neste steg raskt, uten aa maatte forstaa hele systemet foerst.

Huben er inngangen til praktisk hjelp for hverdagslyd:
- hva som skjer i samtaler
- hva man kan gjoere akkurat naa
- hvor man gaar videre for dypere forklaring

## 2) Hvem huben er for

Primart:
- personer som selv strever med hørsel i hverdagen
- naere paaaroerende som trenger enkel, trygg retning

Sekundart:
- brukere som trenger praktisk teknisk hjelp uten tungt fagspråk

## 3) Top tasks (3-5) i vanlig norsk

1. **Forstaa hvorfor samtaler blir krevende**
2. **Faa konkrete grep jeg kan proeve med en gang**
3. **Loese vanlige tekniske tilkoblingsproblemer**
4. **Forstaa hva som er normalt, og naar jeg boer soeke mer hjelp**
5. **Faa videre hjelp hvis jeg staar fast**

### Kort begrunnelse
- Oppgavene dekker baade relasjonell hverdag (R1), praktisk/teknisk behov (R2) og faglig forklaring (R3).
- Oppgavene er valgt for aa speile faktiske brukerbehov foer full hub-utvidelse.
- Oppgavene er korte nok til aa bli konkrete innganger paa foerste hub-side.

## 4) Foerste spoke-mapping (R1-R3)

- **R1 -> Forstaa hvorfor samtaler blir krevende** + **Faa konkrete grep jeg kan proeve med en gang**
- **R2 -> Loese vanlige tekniske tilkoblingsproblemer**
- **R3 -> Forstaa hva som er normalt, og naar jeg boer soeke mer hjelp**

Dette gir en foerste komplett mini-flyt i v0.1:
**Hub -> riktig spoke -> videre hjelp**

## 5) Tydelig rollefordeling: hub vs spoke vs AI-hjelp

- **Hub skal loese:**
  - rask orientering
  - prioritering av neste steg
  - tydelig inngang til riktig spoke

- **Spoke skal loese:**
  - dypere forklaring av ett konkret tema
  - praktiske raad med rolig leseflyt
  - tydelig trygghets-/kontekstlag

- **AI-hjelp skal loese (lettvekts i v0.1):**
  - viderefoere bruker fra lest innhold til konkret neste handling
  - svare paa oppfoelgingsspoersmaal i samme tema
  - ikke erstatte hub eller spoke som hovedstruktur

## 6) Hva huben ikke skal proeve aa gjoere i v0.1

- Ikke vaere full navigasjon for hele nettstedet
- Ikke vaere komplett kunnskapsbase
- Ikke loese alle segmentbehov i foerste iterasjon
- Ikke introdusere ny IA-struktur utover foerste pilothub

## 7) Aapent foer selve hub-siden bygges

1. Hvilken rekkefolge top tasks vises i paa huben (standard prioritering)?
2. Hvor tydelig R1/R2/R3 skal framheves visuelt i foerste versjon.
3. Hvilken minimums-CTA som skal brukes for "videre hjelp" (lenke, knapp, AI-inngang).
4. Om huben skal vise en enkel "hvem er dette for"-linje over task-inngangene.

Denne kontrakten er laget for at neste task kan vaere bygging av foerste hub-side i kode.
