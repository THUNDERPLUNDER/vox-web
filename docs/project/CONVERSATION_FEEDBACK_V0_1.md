# Conversation Feedback v0.1

Status: implemented for internal beta/conversation-design QA in issue #346. Operational retention QA remains.

## Storage and region

- Store: Neon Postgres Free, dedicated Vercel Marketplace resource `neon-apricot-coin`.
- Region: AWS Frankfurt, Germany (EU).
- Vercel project: `vox-web`, connected to Production and Preview.
- Server credential: `FEEDBACK_DATABASE_DATABASE_URL` from the Vercel integration. `FEEDBACK_DATABASE_URL` is also accepted as a local/manual alias.

## Data contract

The single `conversation_feedback` table contains:

- `feedback_reference` — random feedback-only reference created in browser memory for each page-loaded conversation, separate from the CES/chat session. Retries within the same conversation reuse the reference so they update rather than duplicate the record.
- `score` — `helpful`, `partial` or `not_helpful`.
- `selected_reasons` — bounded JSON array of approved reason enums.
- `optional_comment` — optional, maximum 500 characters.
- `submitted_at` — server/database timestamp.
- `route` — allowlisted to `/no/chat/` in v0.1.
- `environment` — server-derived `production`, `preview` or `development`.

The schema is created idempotently by the server on the first write or cleanup run. The API route is `POST /api/conversation-feedback`.

## Retention

Vercel Cron calls `GET /api/conversation-feedback-retention` once per day at 03:17 UTC. The route requires Vercel's `CRON_SECRET` bearer token and permanently deletes rows older than 90 days. This adds no queue or separate cleanup service.

The cleanup code is implemented, but retention is **Needs QA** until `CRON_SECRET` is configured, the deployment is refreshed and an authenticated cleanup test has passed.

## Privacy contract

The feedback payload and table do not contain:

- CES session ID or another chat/session reference
- user questions, assistant answers, transcript or excerpts
- name, email address or telephone number
- user profile, diagnosis, clinic or health profile

The optional comment is explicit user-initiated feedback. It is stored only in Neon. It is not sent to PostHog and is never included in application error logs. The UI asks the user not to include personal or health information in the comment.

## UI flow

After the conversation has received an assistant answer, the discreet **Gi tilbakemelding** trigger becomes available. It opens the separate end-user **Tilbakemelding** panel. Desktop uses a right-side panel; small viewports use an adaptive bottom sheet. Score comes first; reasons, optional comment and the explicit send action are revealed progressively after a score is selected. Internal Dev/Inspect tools remain separate.
