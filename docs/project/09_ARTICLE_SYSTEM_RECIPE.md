# 09_ARTICLE_SYSTEM_RECIPE

## Formål
Dokumentere den nåværende, landede artikkeloppskriften fra sandbox som en liten, operativ system-reference for MVP.

## Avgrensning
- Ekstraksjon av eksisterende løsning
- Ikke redesign
- Ikke ny visuell utforskning

## Article anatomy (v0.1)
1. Context line / breadcrumb
2. Kicker
3. H1 + ingress
4. Hero figure
5. Body content sections
6. Callouts / fact modules / inline figure modules
7. Prompt bridge (ghost-pill)
8. Summary block
9. Footer

## Reusable building blocks
- `PromptGroup`
- `ArticleFigure`
- `ArticleCallout`
- `ArticleRail`

## Token scope brukt i v0.1
- Page/plate surface
- Heading/body/muted text
- Prompt pill contour/fill tokens
- CTA dark tokens
- Radius + section spacing

## Implementeringsregel
Sandbox-siden (`/no/sandbox/article-master`) er visual source-of-truth i denne fasen og skal konsumere det ekstraherte systemet uten ny designendring.
