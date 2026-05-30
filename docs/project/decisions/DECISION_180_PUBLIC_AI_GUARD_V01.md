# Decision: Public AI guard v0.1 (#180)

**Status:** Implemented — QA before CES production env activation  
**Date:** 2026-05-30  
**Issue:** #180

## Context

`/no/chat/` is live with standalone headless UI. Production AI remains blocked until CES env-vars are set. Before activating CES in production, `/api/chat` needs minimum abuse protection.

## Decision

Server-side guards on `POST /api/chat`:

| Guard | Limit |
|-------|--------|
| Max message length | 2000 characters (before CES) |
| Burst rate limit | 10 requests / 10 minutes / IP |
| Daily rate limit | 50 requests / 24 hours / IP |
| Origin check | Allowlist: vox.raddum.no, viddel.no, localhost, `*.vercel.app` |

**Storage:** Upstash Redis via `@upstash/ratelimit` (`UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN`).

**Fail-closed:** In Vercel Production, if Upstash env is missing or Redis errors, API returns 503 — not open passthrough.

**Dev/local:** Origin check skipped in Astro dev. Rate limit skipped when Upstash env missing outside production.

## Not in scope

- Login, user profiles, conversation DB
- CES production env activation (separate controlled step after QA)
- UI redesign

## Activation checklist (Thomas / ops)

1. QA Public AI guard on preview
2. Set `UPSTASH_REDIS_REST_URL` + `UPSTASH_REDIS_REST_TOKEN` in Vercel Production
3. Set CES env-vars in Vercel Production
4. Update `src/data/mvp-current-state.ts` when AI is live
5. Do **not** skip step 2 before step 3

## Implementation

- `src/lib/chat-api-guard.ts`
- `src/pages/api/chat.ts`
