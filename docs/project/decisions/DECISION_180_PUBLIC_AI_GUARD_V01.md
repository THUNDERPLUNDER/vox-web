# Decision: Public AI guard v0.2 (#180)

**Status:** Approved for implementation — Preview QA and Vercel configuration remain
**Date:** 2026-05-30; revised 2026-08-20
**Issue:** #180

## Context

`POST /api/chat` returned 503 in production on 2026-08-19 with `rate_limit_storage_error` and `guard_unavailable`. The request never reached Google. The v0.1 Upstash counter was fail-closed, so a storage/configuration failure made the entire chat unavailable.

The simpler boundary is to let Vercel stop obvious excessive traffic before the function runs, while the application keeps only deterministic request validation. This is a lightweight interim safeguard while the MVP is public without login, not a permanent access-control architecture.

## Decision

| Layer | Responsibility |
|---|---|
| Hidden owner control | Four-digit PIN unlocks a secure owner cookie; owner bypasses the public switch |
| Vercel Flags | One global Boolean: `public-ai-enabled`; public access fails closed if it cannot be evaluated |
| Vercel Firewall | IP-based public rate limiting and PIN-attempt limiting; respond with HTTP 429 |
| Application | Owner/public check, maximum message length, origin validation and safe error handling |
| Vercel Runtime Logs | Structured application outcomes; no prompt or answer content |

The four-digit PIN is only an unlock code. It is never used directly as a Firewall bypass secret. A correct PIN sets an HttpOnly, Secure, SameSite=Strict owner cookie containing a separate long random token. Owner requests work even when public access is off or Vercel Flags is unavailable.

Required Firewall rules, in this order:

1. Owner bypass — cookie `viddel_owner_session` equals the long owner-session token, method `POST`, path is one of the two AI routes; action `bypass`.
2. PIN attempts — `/api/owner-access/unlock`, `POST`, Production, 5 requests per 600 seconds per IP, HTTP 429.
3. Public text — `/api/chat`, `POST`, Production, initially 5 requests per 600 seconds per IP, HTTP 429.
4. Public image — `/api/image-vision`, `POST`, Production, initially 2 requests per 600 seconds per IP, HTTP 429.

Do not recreate the previous 50-per-day counter or build custom limiter infrastructure. Vercel Flags is used only for the single access switch, not for request counting or session data. The switch stays in Vercel Dashboard rather than introducing a broad management token into the app. Tune the two public platform rules only if actual traffic shows a need. Reassess the whole temporary control when login replaces anonymous public access.

Upstash, its environment variables and the in-application Redis limiter are removed. The frontend treats a platform HTTP 429 as `rate_limited`, including when the Firewall response is not JSON.

## Activation checklist

1. Create the Boolean Vercel Flag `public-ai-enabled`, initially Off for Production and Preview.
2. Add the owner PIN and long session token as sensitive server variables.
3. Stage and review the four Vercel Firewall rules; publish only after the diff is checked.
4. Push the implementation branch and inspect its Preview deployment.
5. Open the hidden owner panel by clicking the introductory sentence five times; verify wrong PIN, correct PIN and logout.
6. Verify owner chat works with public access off; verify a public browser is blocked.
7. Turn `public-ai-enabled` on in Vercel and verify normal use plus controlled HTTP 429 responses.
8. Merge only after those checks pass; then verify Production and Runtime Logs.
9. Remove obsolete `UPSTASH_REDIS_REST_*` and `VIDDEL_CHAT_*` environment variables.

Raw-body hardening and client-side image resizing are separate follow-up work. They are not part of this availability hotfix.

## Implementation

- `src/lib/chat-api-guard.ts`
- `src/lib/owner-access-v01.ts`
- `src/lib/public-ai-access-v01.ts`
- `src/pages/api/owner-access/*`
- `src/pages/api/chat.ts`
- `src/pages/api/image-vision.ts`
- `src/pages/no/chat.astro`
- `src/lib/chat-usage-metrics.ts`

## Superseded behavior

Guard v0.1 used Upstash with 10 requests per 10 minutes and 50 per day, and failed closed when storage was unavailable. That remains historical context only and is superseded by this decision.
