# 08_THREAD_HANDOFF

## Formål
Gi en fast, kort og gjenbrukbar overlevering ved trådskifte i KlarLyd Lab.

Thread Handoff brukes for å:
- videreføre aktiv state til ny tråd
- redusere behovet for å gjenforklare kontekst
- holde fokus på ett tydelig hovedspor
- skille mellom fakta, tolkning og neste steg

## Når brukes den
Bruk Thread Handoff når:
- et hovedspor er lukket eller skifter retning
- en Return Ticket er levert og ny fase starter
- tråden begynner å blande for mange spor
- vi ønsker frisk kontekst før videre arbeid

Ikke bruk Thread Handoff for hver lille patch eller hver enkelt commit.

## Standard kommando
Når Thomas skriver:
`Lag handoff til ny tråd`

skal leveransen følge malen under.

## Standard mal

### 1. Aktivt hovedspor
- 

### 2. Formål med ny tråd
- 

### 3. Fakta som er landet
- 
- 
- 

### 4. Tolkning / hva dette betyr
- 
- 

### 5. Hva som pågår akkurat nå
- 
- 

### 6. Kø / neste oppgaver
- 1.
- 2.
- 3.

### 7. Source of truth
- 
- 
- 

### 8. Guardrails for ny tråd
- ikke gå inn i:
- hold fokus på:
- ikke redesign / ikke content / ikke sideoppgaver:
- hva som eksplisitt ikke er del av denne tråden:

### 9. Åpne spørsmål
- 
- 

### 10. Neste konkrete oppgave
- 

### 11. Hvis relevant: Git / artefakter
- commit:
- issue:
- track:
- task:
- VIS-fil:
- doc:

## Kortversjon
Bruk kortversjon når vi bare trenger frisk tråd i samme spor.

### Hovedspor
- 

### Landet
- 
- 

### Pågår nå
- 

### Neste
- 
- 

### Guardrails
- ikke:
- fokus:

## Arbeidsregel
Mønsteret i KlarLyd Lab er:

arbeid -> Return Ticket -> oppdatert state -> Thread Handoff -> ny tråd

Thread Handoff erstatter ikke repo-state eller Return Ticket.
Den er et lett mellomlag for trådskifte.
