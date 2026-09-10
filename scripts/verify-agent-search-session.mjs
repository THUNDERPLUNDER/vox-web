import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const agentSearchSession = await import("../src/lib/agent-search-session.ts");

const config = {
  projectId: "test-project",
  location: "eu",
  engineId: "test-engine",
  serviceAccountJson: "not-used-by-this-verifier",
  servingConfig: "default_serving_config",
};

const firstLocalSession = "viddel-0123456789abcdef01234567";
const secondLocalSession = "viddel-fedcba9876543210fedcba98";
const firstGoogleId = agentSearchSession.buildAgentSearchSessionId(firstLocalSession);
const repeatedGoogleId = agentSearchSession.buildAgentSearchSessionId(firstLocalSession);
const secondGoogleId = agentSearchSession.buildAgentSearchSessionId(secondLocalSession);

assert.equal(firstGoogleId, repeatedGoogleId, "same local session must map to the same Google session");
assert.notEqual(firstGoogleId, secondGoogleId, "new local session must map to a different Google session");
assert.equal(firstGoogleId, firstLocalSession, "browser-generated Viddel IDs are valid Google IDs");
assert.match(firstGoogleId, /^[a-z0-9][a-z0-9-]{0,61}[a-z0-9]$/);
assert.ok(firstGoogleId.length <= 63);

const fallbackGoogleId = agentSearchSession.buildAgentSearchSessionId("Legacy_Session");
assert.equal(fallbackGoogleId, agentSearchSession.buildAgentSearchSessionId("Legacy_Session"));
assert.match(fallbackGoogleId, /^[a-z0-9][a-z0-9-]{0,61}[a-z0-9]$/);

const expectedResource =
  `projects/test-project/locations/eu/collections/default_collection/engines/test-engine/sessions/${firstGoogleId}`;
assert.equal(
  agentSearchSession.buildAgentSearchSessionResource(config, firstLocalSession),
  expectedResource,
);
assert.equal(agentSearchSession.isAgentSearchSessionReadyStatus(200), true);
assert.equal(agentSearchSession.isAgentSearchSessionReadyStatus(409), true);
assert.equal(agentSearchSession.isAgentSearchSessionReadyStatus(400), false);
assert.equal(agentSearchSession.isAgentSearchSessionReadyStatus(404), false);
assert.equal(agentSearchSession.isAgentSearchSessionReadyStatus(503), false);

const chatSource = await readFile(new URL("../src/pages/api/chat.ts", import.meta.url), "utf8");
assert.match(chatSource, /runAgentSearchAnswer\(agentEnv\.config, \{/);
assert.match(chatSource, /message,\s+sessionId,/);

const implementationSource = await readFile(
  new URL("../src/lib/agent-search-answer.ts", import.meta.url),
  "utf8",
);
assert.doesNotMatch(implementationSource, /sessions\/\-/);
assert.match(
  implementationSource,
  /const sessionId = buildAgentSearchSessionId\(localSessionId\)/,
);
assert.match(
  implementationSource,
  /sessions\?sessionId=\$\{encodeURIComponent\(sessionId\)\}/,
);
assert.match(
  implementationSource,
  /buildCreateSessionUrl\(host, config, input\.sessionId\)/,
);
assert.match(
  implementationSource,
  /body: JSON\.stringify\(\{\s*name: buildAgentSearchSessionResource\(config, input\.sessionId\),?\s*\}\)/,
);
assert.match(implementationSource, /session: buildAgentSearchSessionResource\(config, input\.sessionId\)/);
assert.match(implementationSource, /isAgentSearchSessionReadyStatus\(sessionResponse\.status\)/);
assert.match(implementationSource, /parsed\.error\?\.message/);
assert.match(implementationSource, /msg\.replace\(\/\[\\u0000-\\u001f\\u007f\]\//);
assert.match(implementationSource, /sanitized\.slice\(0, 160\)/);
assert.match(implementationSource, /"session_create",\s*hint/);
assert.match(implementationSource, /"answer",\s*hint/);
assert.doesNotMatch(implementationSource, /console\.(?:log|info|warn|error)/);

assert.match(chatSource, /upstream_stage: agentSearchDiagnostic\.stage/);
assert.match(chatSource, /google_error_hint: agentSearchDiagnostic\.hint/);

console.log("Agent Search session continuity contract OK");
