# Agent Attribution Convention

Bruk en liten, fast kilde-signatur i status som går tilbake til GitHub-bussen.

## Issue-kommentarer
Start kommentaren med én av disse:
- `Kilde: Cursor`
- `Kilde: ChatGPT / @rigger`
- `Kilde: Gemini / @navigator`
- `Kilde: Thomas manuelt`

## Commits
Behold vanlig commit-melding, men legg til agentmarkør når relevant.

Eksempler:
- `Made-with: Cursor`
- `Agent: Cursor`
- `Agent: ChatGPT-@rigger`
- `Agent: Gemini-@navigator`

## Formål
- gjøre det synlig hvem som har oppdatert bussen
- skille mellom konto-nivå og rolle-/agentnivå
- gjøre status lettere å lese for Thomas, Vibeke og @navigator

## Minimumsregel
Konto alene er ikke nok. Viktige statuskommentarer skal ha eksplisitt `Kilde:`-linje.