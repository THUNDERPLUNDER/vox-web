# GitHub Write Minimization Rule

Formål: redusere godkjenningsfriksjon i ChatGPT når GitHub-skriving krever mange separate approvals.

## Arbeidsregel for @rigger
Når flere GitHub-endringer hører til samme operative handling, skal @rigger forsøke å minimere antall write-kall.

Det betyr:
- unngå unødige mellomkommentarer hvis saken straks skal lukkes
- samle status i færre kommentarer når det er trygt
- unngå små write-kall som ikke gir reell sporbarhetsverdi
- prioritere ryddige, men færre mutasjoner per handling

## Ikke på bekostning av
- sporbarhet
- tydelig canonical status
- nødvendig forklaring ved lukking eller ryddegrep

## Praktisk tommelfingerregel
Foretrekk:
- én kort forklarende kommentar + én statusendring

Unngå når mulig:
- mange små kommentarer og statusgrep i serie

## Gjelder spesielt
- mobilflyt
- issue-rydding
- statusoppdateringer
- små administrative GitHub-operasjoner