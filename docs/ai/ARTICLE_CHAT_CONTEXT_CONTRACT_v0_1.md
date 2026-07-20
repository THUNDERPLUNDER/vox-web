# Article chat context contract v0.1

Status: Verified current implementation  
Owner issue: #267  
Follow-up: #277

## Purpose

Describe what article chat actually sends to `/api/chat`, how this differs from standalone chat, and what the current behavior means for seed questions and follow-ups.

This document describes current implementation. It does not claim that the current context is sufficient for the final product.

## Sources checked

- `src/components/article/ArticleInlineChatShell.astro`
- `src/pages/no/artikkel/ingen-lyd-svak-lyd.astro`
- `src/pages/no/chat.astro`
- `src/pages/api/chat.ts`
- `src/lib/agent-search-answer.ts`
- `src/lib/ces-run-session.ts`
- `src/data/backstage-v01.ts`

## Visible input

Article chat accepts:

- a seed question
- free text from the composer

Both are displayed in the transcript exactly as the user selected or wrote them.

The UI records whether a turn came from a seed or the composer, but this source value is not included in the request.

## Actual request fields

The article shell posts two fields to `/api/chat`:

- `message`
- `sessionId`

No structured article-context object exists.

For `transition-v01`, every question is converted to:

```text
Jeg leser artikkelen «<article title>». <user question>
```

For other article layouts, the helper returns the raw question without title context.

## Context not sent

The request does not include structured fields for:

- article slug or stable id
- ingress or summary
- article body or excerpt
- hub, topic or category
- seed identifier
- seed versus composer source
- previous user messages
- previous assistant answers

The article DOM is not read into the request.

## API flow

`/api/chat` accepts and validates `message` and `sessionId`, applies request guards, selects the configured answer backend and returns normalized answer text.

Production is documented in Backstage as `google_agent_search_direct`.

### Production direct answer

The direct path forwards only `message` to the answer client. The provided `sessionId` is not forwarded in that call, and previous turns are not sent as an explicit history.

Current production behavior must therefore be treated as independent requests. On the transition article, every request receives article-title context because the title prefix is repeated.

### CES rollback path

The CES path forwards both `message` and `sessionId` to `runSession`. It therefore has a stronger mechanism for preserving conversation identity than the current direct production path.

## Standalone comparison

`/no/chat` sends the user's raw question plus its own `sessionId`. It does not add article-title context.

Under the current direct production path, standalone follow-ups also have no documented continuity from the client session field.

## Why a generic seed can work

A seed such as:

```text
Hjelp meg å finne neste ting jeg bør sjekke
```

can work on the test article because it is sent together with the specific title:

```text
Ingen lyd eller svak lyd fra høreapparatet
```

The result depends on title specificity plus retrieval and answer inference. It is not evidence that the full article or earlier conversation was supplied.

## UX rules for the current contract

Until #277 changes the request schema:

1. A transition-article seed may be shorter only when the title supplies enough meaning.
2. Every question, including a follow-up, must be understandable as:

   ```text
   Jeg leser artikkelen «<title>». <question>
   ```

3. Avoid references such as `det`, `dette`, `den andre` or `som du sa` when the title alone does not resolve them.
4. A broad article title requires a more explicit seed.
5. Seeds should point to a useful next action without becoming unclear in the visible UI.
6. Standalone questions must be self-contained.
7. Do not describe the current article chat as receiving the full article.
8. Do not promise conversation memory in the current production path.

## Current minimum context

For the transition article, current production uses:

- article title embedded in `message`
- current user question embedded in `message`

The client `sessionId` is checked by `/api/chat`, but is not used by the production direct answer call.

## Recommended v0.2 direction

#277 should define a bounded article-context schema with at least:

- context type
- stable article id or slug
- article title
- optional short summary
- seed or composer source

It must also choose explicit follow-up behavior instead of depending on assumed model memory.

Do not send the complete article body by default. Context should be bounded, testable and compatible with privacy and message-length rules.

## Future verification

For each article-chat pattern, verify:

1. one generic seed
2. one explicit free-text question
3. one follow-up that requires prior-turn meaning
4. the exact request payload
5. the configured backend used for the test
6. standalone-chat regression

A generic seed passes only when its relevance can be explained by context fields demonstrably present in the request.

## Change rule

Changes to article context fields, follow-up behavior or backend request shape must update this document, test article and standalone routes, and update Backstage when the system flow changes.
