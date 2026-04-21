# Cursor Prompt Contract

Bruk denne fast i Cursor-prompter.

## Før du gjør noe
```text
Før du gjør noe:
1. Les aktuell GitHub-issue.
2. Les siste kommentarer og Return Tickets i issue-tråden.
3. Bruk GitHub-issue og issue-kommentarene som source of truth for oppgaven.
4. Les repo-dokumentasjon bare der issue eller prompt eksplisitt peker til den.
```

## Når du er ferdig
```text
Når du er ferdig:
1. Legg samme oppsummering som Return Ticket-kommentar i aktuell GitHub-issue.
2. Avslutt svaret ditt med:
- kort oppsummering
- endrede filer
- beslutninger / antakelser
- commit
- push
- commit hash
- push-status
- hva som konkret skal verifiseres
- preview / deploy-lenke hvis relevant

Hvis oppgaven påvirker UI eller publisert visning:
- legg inn preview-lenke eller produksjonslenke i Return Ticket
- oppgi hvilken URL som skal QA-es
- oppgi hva som konkret skal verifiseres på siden
```

## Hvorfor
- GitHub er delt oppgavebuss og source of truth.
- @rigger skriver og oppdaterer oppgaver via bussen.
- Cursor skal lese oppgaver via bussen før arbeid starter.
- Return Ticket skal tilbake til issue-tråden.
- ChatGPT/@rigger skal kunne lese status direkte fra GitHub uten at Thomas må kopiere fra Cursor manuelt.
- URL skal være primært QA-artefakt ved UI-arbeid. Skjermdump er fallback, ikke standard.

## Arbeidsregel
Hvis oppgaven er liten nok til at full Return Ticket ikke trengs, skal Cursor eksplisitt si det.
