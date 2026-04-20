# Task: Extract Article System v0.1 from sandbox

## Why now
Sandbox article master er stabil nok som referanse. Neste steg er å flytte landet løsning inn i delte tokens, komponenter og oppskrift slik at videre arbeid skjer systematisk.

## Scope
- Ekstrahere tokens brukt av artikkelsystemet
- Ekstrahere komponenter: PromptGroup, ArticleFigure, ArticleCallout, ArticleRail
- Flytte artikkelregler til delt stylesheet
- Rewire `/no/sandbox/article-master` til ekstrahert system
- Lage kort page recipe-dokument

## Boundary
- Extract system, do not redesign
- Ingen ny layoututforskning
- Ingen nye dark-mode eksperimenter

## Acceptance criteria
- Delte artikkel-tokens eksisterer
- Delte komponenter eksisterer og brukes i sandbox
- Delt artikkel-system stylesheet er i bruk
- Kort recipe-dokument er lagt til
- Ingen tydelig visuell regresjon i sandbox

## GitHub task-flow status
Direkte opprettelse i GitHub Projects var blokkert i denne kjøringen fordi lokal CLI-task-flow krever `GITHUB_TOKEN` i miljøet, og token var ikke tilgjengelig.
Denne filen er lagt som fallback i repoets dokumenterte task-mønster.
