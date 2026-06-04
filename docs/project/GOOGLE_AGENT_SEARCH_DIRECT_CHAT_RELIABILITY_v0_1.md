# Direct backend `/api/chat` reliability v0.1

Related: [#198](https://github.com/THUNDERPLUNDER/vox-web/issues/198), [#215](https://github.com/THUNDERPLUNDER/vox-web/issues/215)

## Target

| Item | Value |
|------|--------|
| Endpoint | `POST /api/chat` |
| Env (Preview) | `VIDDEL_AI_BACKEND=google_agent_search_direct` |
| Calls | ≥20 |
| Success rate | ≥80% |
| Contract | `{ text, turnCompleted, turnIndex }` only |
| Logging | Metadata only — no prompt/answer |

## Automated run (Thomas / ops)

**Step 1 — preflight (1 call, fail-fast):** script exits before full series if ops headers, backend mode, or contract are wrong.

**Step 2 — short series (count=5):** only after preflight OK.

**Step 3 — full series (count=20):** only after count=5 passes ≥80%.

```bash
# .env.local (never commit):
# VIDDEL_OPS_TEST_TOKEN=<Preview value from Vercel — must match exactly>
# VERCEL_AUTOMATION_BYPASS_SECRET=<Vercel Protection Bypass for Automation>

# Use exact Preview URL from browser/Vercel if needed:
# --base=https://vox-web-git-main-raddum-5965s-projects.vercel.app

npm run chat:reliability -- \
  --preview \
  --count=5 \
  --delay-ms=15000 \
  --expect-backend=google_agent_search_direct \
  --env-file=.env.local \
  --label=direct-preview-api-chat-v05
```

Then `count=20` with same flags after v05 passes.

Output: `tmp/chat-reliability/run-*.json` (gitignored, metadata only).

### Prerequisites

1. Preview env: `VIDDEL_AI_BACKEND=google_agent_search_direct` + `AGENT_SEARCH_ENGINE_ID` + SA + IAM.
2. Preview env: `VIDDEL_OPS_TEST_TOKEN` (same value used in script header).
3. Vercel **Protection Bypass for Automation** if Deployment Protection blocks unauthenticated `POST /api/chat` (401 HTML).

### Ops meta headers (token required)

When `x-viddel-ops-test-token` matches, responses include safe headers (no content):

- `x-viddel-ops-meta-backend-mode`
- `x-viddel-ops-meta-error-code`
- `x-viddel-ops-meta-upstream-http-status`
- `x-viddel-ops-meta-duration-bucket`
- `x-viddel-ops-meta-retry-used`
- `x-viddel-ops-meta-attempt-count`
- `x-viddel-ops-meta-has-citations`

## Deployment Protection blocker

Unauthenticated `curl` / CI without bypass → **401** Vercel Authentication HTML (not `/api/chat`).

**Do not** disable protection globally for this test. Use bypass secret or run from authenticated operator machine.

## Pass / fail

| Pass | Fail |
|------|------|
| ≥80% `result: success` | &lt;80% success |
| All `backendMode` = `google_agent_search_direct` | Any `ces_channel` |
| All successes `responseContractOk: true` | Extra JSON fields to client |
| No prompt/answer in output file | Content leaked in logs |

## Follow-up (not reliability blocker)

Long answers with raw Markdown (`**`, bullets) → issue: **Direct backend response formatting v0.1**.
