import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const tokenModule = await import("../src/lib/conversation-state-token-v01.ts");
const policyModule = await import("../src/lib/conversation-policy-v01.ts");
const deliveryModule = await import("../src/lib/conversation-delivery-gate-v01.ts");
const browserSessionModule = await import("../src/lib/chat-browser-session-v01.ts");

const secret = "test-only-secret-that-is-longer-than-thirty-two-characters";
const sessionId = "viddel-0123456789abcdef01234567";
const now = 1_800_000_000_000;
const fixedIv = new Uint8Array(12).fill(7);

const storedSessionId = "viddel-stored0123456789abcdef01";
const freshSessionId = "viddel-fresh0123456789abcdef01";
const simulateInitialBrowserSession = ({ existingSessionId, stateToken, navigationType, occupied }) => {
  let sessionId = existingSessionId;
  let nextStateToken = stateToken;
  const rotate = () => {
    sessionId = freshSessionId;
    nextStateToken = "";
  };
  const reuse = browserSessionModule.shouldReuseStoredConversation(Boolean(sessionId), navigationType);
  if (!reuse) rotate();
  if (reuse && occupied) rotate();
  return { sessionId, stateToken: nextStateToken };
};

assert.deepEqual(
  simulateInitialBrowserSession({
    existingSessionId: storedSessionId,
    stateToken: "opaque-state-token",
    navigationType: "reload",
    occupied: false,
  }),
  { sessionId: storedSessionId, stateToken: "opaque-state-token" },
  "reload in the same tab must preserve session id and state token",
);
assert.deepEqual(
  simulateInitialBrowserSession({
    existingSessionId: "",
    stateToken: "",
    navigationType: "navigate",
    occupied: false,
  }),
  { sessionId: freshSessionId, stateToken: "" },
  "genuinely new tab must start a new empty conversation",
);
assert.deepEqual(
  simulateInitialBrowserSession({
    existingSessionId: storedSessionId,
    stateToken: "opaque-state-token",
    navigationType: "navigate",
    occupied: false,
  }),
  { sessionId: freshSessionId, stateToken: "" },
  "copied sessionStorage on a duplicated tab must rotate on fresh navigation",
);

const originalInstance = "tab-original";
const duplicatedInstance = "tab-copy";
const probe = {
  type: browserSessionModule.CHAT_SESSION_PROBE,
  sessionId: storedSessionId,
  instanceId: duplicatedInstance,
};
assert.equal(
  browserSessionModule.isMatchingPeerProbe(probe, storedSessionId, originalInstance),
  true,
);
const occupiedReply = {
  type: browserSessionModule.CHAT_SESSION_OCCUPIED,
  sessionId: storedSessionId,
  instanceId: originalInstance,
  targetInstanceId: duplicatedInstance,
};
assert.equal(
  browserSessionModule.isOccupiedReplyForInstance(occupiedReply, storedSessionId, duplicatedInstance),
  true,
);
assert.deepEqual(
  simulateInitialBrowserSession({
    existingSessionId: storedSessionId,
    stateToken: "opaque-state-token",
    navigationType: "reload",
    occupied: true,
  }),
  { sessionId: freshSessionId, stateToken: "" },
  "peer collision must rotate even if a browser reports the duplicated tab as reload",
);

const empty = tokenModule.emptyConversationState();
assert.deepEqual(
  tokenModule.openConversationStateToken("", sessionId, secret, now),
  { valid: false, reason: "missing", state: empty, turnIndex: 0 },
  "missing token must reset to empty state",
);

const carriedState = {
  ...empty,
  activeSituation: {
    summary: "Stemmer blir utydelige når flere snakker",
    provenance: { source: "user", quote: "når det er flere som snakker", turnIndex: 2 },
  },
};
const token = tokenModule.sealConversationStateToken(
  { sessionId, turnIndex: 2, state: carriedState },
  secret,
  { now, iv: fixedIv },
);
const valid = tokenModule.openConversationStateToken(token, sessionId, secret, now + 1);
assert.equal(valid.valid, true);
assert.equal(valid.turnIndex, 2);
assert.equal(valid.state.activeSituation?.summary, carriedState.activeSituation.summary);
assert.deepEqual(
  tokenModule.openConversationStateToken(token, sessionId, secret, now + 1),
  valid,
  "same session must carry state across reload",
);

const tampered = `${token.slice(0, -1)}${token.endsWith("a") ? "b" : "a"}`;
const tamperedResult = tokenModule.openConversationStateToken(tampered, sessionId, secret, now + 1);
assert.equal(tamperedResult.valid, false);
assert.equal(
  updatePolicyFromEmpty(tamperedResult.state).mode,
  "general_help",
  "tampering must never unlock product specificity",
);
assert.equal(
  tokenModule.openConversationStateToken(token, "viddel-fedcba9876543210fedcba98", secret, now + 1).reason,
  "session_mismatch",
);
assert.equal(
  tokenModule.openConversationStateToken(
    token,
    sessionId,
    secret,
    now + tokenModule.CONVERSATION_STATE_TOKEN_TTL_MS + 1,
  ).reason,
  "expired",
);
assert.deepEqual(
  tokenModule.openConversationStateToken(token, "viddel-newbrowser00000000000000", secret, now + 1).state,
  empty,
  "new session must not inherit a durable profile",
);

function updatePolicyFromEmpty(state) {
  return policyModule.validateStateUpdateCandidate(
    state,
    { requestedMode: "product_specific", productContextRelevant: true },
    "fortsett",
    1,
  ).policy;
}

const update = (previous, message, turnIndex, candidate) =>
  policyModule.validateStateUpdateCandidate(previous, candidate, message, turnIndex);

// Control conversation 1: exact demonstrated correction failure.
const correctionTurns = [
  "Høreapparatet mitt fungerer ikke helt som jeg vil.",
  "Det er mest at stemmen til folk blir utydelig, særlig når det er flere som snakker.",
  "Viddel foreslår en enhet som brukeren ikke har etablert.",
  "Hvilken enhet mener du? Jeg har bare høreapparatene mine.",
];
let correctionState = empty;
correctionState = update(correctionState, correctionTurns[0], 1, {
  activeSituation: { summary: "Høreapparatet fungerer ikke som ønsket", evidence: correctionTurns[0], certainty: "clear" },
  establishedContext: [{ kind: "general", summary: "Brukeren har høreapparat", evidence: "Høreapparatet mitt" }],
  requestedMode: "clarify",
  clarificationNeeded: true,
}).state;
correctionState = update(correctionState, correctionTurns[1], 2, {
  activeSituation: { summary: "Stemmer blir utydelige når flere snakker", evidence: correctionTurns[1], certainty: "clear" },
  establishedContext: [{ kind: "general", summary: "Flere samtidige stemmer er situasjonen", evidence: "når det er flere som snakker" }],
  requestedMode: "general_help",
}).state;
// System output must not mutate authoritative state.
assert.equal(correctionState.activeSituation?.summary, "Stemmer blir utydelige når flere snakker");
const corrected = update(correctionState, correctionTurns[3], 3, {
  activeSituation: { summary: "Uklart", evidence: "", certainty: "ambiguous" },
  corrections: [{
    summary: "En ekstra enhet er ikke etablert i denne situasjonen",
    target: "enhet",
    scope: "current_situation",
    evidence: correctionTurns[3],
  }],
  requestedMode: "general_help",
});
assert.equal(corrected.state.activeSituation?.summary, "Stemmer blir utydelige når flere snakker");
assert.equal(corrected.state.corrections.length, 1);
assert.equal(corrected.state.corrections[0].provenance.quote, correctionTurns[3]);
assert.equal(corrected.state.corrections[0].scopeTurnIndex, 2);
assert.equal(corrected.policy.mode, "general_help");

// Control conversation 2: established product can open specificity only when relevant.
const productMessage = "Jeg bruker Phonak Audéo Lumity, og vil endre programmet for støy.";
const productTurn = update(empty, productMessage, 1, {
  activeSituation: { summary: "Endre program for støy", evidence: productMessage, certainty: "clear" },
  establishedContext: [{
    kind: "product",
    summary: "Bruker Phonak Audéo Lumity",
    brand: "Phonak",
    model: "Audéo Lumity",
    evidence: productMessage,
  }],
  requestedMode: "product_specific",
  productContextRelevant: true,
});
assert.equal(productTurn.policy.mode, "product_specific_allowed");
assert.equal(productTurn.state.establishedContext[0].provenance.quote, productMessage);
const correctedProductState = update(productTurn.state, "Det er ikke Phonak-modellen jeg mener nå.", 2, {
  corrections: [{
    summary: "Phonak-modellen gjelder ikke den aktive situasjonen",
    target: "Phonak",
    scope: "current_situation",
    evidence: "Det er ikke Phonak-modellen jeg mener nå.",
  }],
  requestedMode: "product_specific",
  productContextRelevant: true,
});
assert.equal(correctedProductState.policy.mode, "general_help", "scoped correction must close stale product specificity");
assert.equal(policyModule.effectiveEstablishedContext(correctedProductState.state).length, 0);
const productGeneralControl = update(
  productTurn.state,
  "Hvordan kan jeg følge en samtale med flere rundt bordet?",
  2,
  {
    activeSituation: {
      summary: "Følge samtale med flere rundt bordet",
      evidence: "Hvordan kan jeg følge en samtale med flere rundt bordet?",
      certainty: "clear",
    },
    requestedMode: "general_help",
    productContextRelevant: false,
  },
);
assert.equal(productGeneralControl.policy.mode, "general_help");

// Control conversation 3: ambiguous object may exist but cannot be named as a product.
const ambiguousMessage = "Jeg har også den lille svarte greia jeg fikk av audiografen.";
const ambiguous = update(empty, ambiguousMessage, 1, {
  establishedContext: [
    { kind: "general", summary: "Et lite svart objekt finnes", evidence: ambiguousMessage },
    { kind: "product", summary: "Dette er Roger On", brand: "Roger", model: "On", evidence: ambiguousMessage },
  ],
  requestedMode: "product_specific",
  productContextRelevant: true,
  clarificationNeeded: false,
});
assert.equal(ambiguous.state.establishedContext.length, 1);
assert.equal(ambiguous.state.establishedContext[0].kind, "general");
assert.equal(ambiguous.policy.mode, "general_help");

const pass = () => ({
  decision: "PASS",
  activeSituationPreserved: true,
  correctionHonored: true,
  noUnsupportedProductContext: true,
  policyScopeMatched: true,
  usefulAndSafe: true,
});
const fail = (field = "noUnsupportedProductContext") => ({ ...pass(), decision: "FAIL", [field]: false });
const fixtureEvaluator = async (candidate) => {
  if (/app|mobil|remote|filter|dome|komponent/i.test(candidate)) return fail();
  if (candidate.includes("Oticon")) return fail();
  return pass();
};
for (const candidate of [
  "Åpne appen og velg restaurantprogram.",
  "Rengjør filter og dome.",
  "Bruk mobilen, remote-enheten eller en annen komponent.",
]) {
  const result = await deliveryModule.runDeliveryPipeline(candidate, fixtureEvaluator, async () => "Start med en roligere plassering rundt bordet.");
  assert.equal(result.outcome, "repaired");
  assert.doesNotMatch(result.text, /app|mobil|remote|filter|dome|komponent/i);
}
assert.equal(
  (await deliveryModule.runDeliveryPipeline(
    "Prøv å sitte slik at du ser ansiktene til dem som snakker.",
    fixtureEvaluator,
    async () => "unused",
  )).outcome,
  "candidate",
);
assert.equal(
  (await deliveryModule.runDeliveryPipeline(
    "På Phonak Audéo Lumity kan du prøve støyprogrammet.",
    fixtureEvaluator,
    async () => "unused",
  )).outcome,
  "candidate",
);
assert.equal(
  (await deliveryModule.runDeliveryPipeline(
    "På Oticon Intent kan du endre dette.",
    fixtureEvaluator,
    async () => "Hold deg til den etablerte Phonak-modellen.",
  )).outcome,
  "repaired",
);

let evaluations = 0;
let repairs = 0;
const fallbackResult = await deliveryModule.runDeliveryPipeline(
  "Ustøttet kandidat",
  async () => {
    evaluations += 1;
    return fail();
  },
  async () => {
    repairs += 1;
    return "Fortsatt ustøttet";
  },
);
assert.equal(evaluations, 2, "candidate and one repaired candidate must be checked");
assert.equal(repairs, 1, "repair must run at most once");
assert.equal(fallbackResult.outcome, "fallback");
assert.equal(fallbackResult.text, deliveryModule.CONVERSATION_SAFE_FALLBACK);
assert.equal((fallbackResult.text.match(/\?/g) ?? []).length, 1);

assert.equal(
  policyModule.parseDeliveryEvaluation,
  undefined,
  "delivery authority stays in the delivery module",
);
assert.equal(deliveryModule.parseDeliveryEvaluation({ ...pass(), decision: "uncertain" }).decision, "FAIL");
assert.equal(deliveryModule.parseDeliveryEvaluation({ ...pass(), usefulAndSafe: undefined }).decision, "FAIL");
assert.equal(policyModule.conversationRetrievalFilter(false), 'knowledge_scope: ANY("general")');
assert.equal(policyModule.conversationRetrievalFilter(true), null);

const sources = await Promise.all([
  "../src/lib/conversation-state-token-v01.ts",
  "../src/lib/conversation-vertex-json-v01.ts",
  "../src/lib/conversation-policy-v01.ts",
  "../src/lib/conversation-delivery-gate-v01.ts",
  "../src/lib/agent-search-answer.ts",
].map((path) => readFile(new URL(path, import.meta.url), "utf8")));
for (const source of sources) {
  assert.doesNotMatch(source, /console\.(?:log|info|warn|error)/, "conversation content path must not log");
}
const agentSearchSource = sources.at(-1);
assert.match(agentSearchSource, /conversationRetrievalFilter\(input\.productSpecificAllowed === true\)/);
assert.match(agentSearchSource, /filter: retrievalFilter/);
assert.match(agentSearchSource, /`\$\{VIDDEL_RESPONSE_PREAMBLE\}\\n\\n\$\{input\.authorityFrame\.trim\(\)\}`/);
const apiSource = await readFile(new URL("../src/pages/api/chat.ts", import.meta.url), "utf8");
assert.match(apiSource, /stateToken/);
assert.match(apiSource, /withLastDeliveryContext\(turn\.state, delivery\.text\)/);
const clientSource = await readFile(new URL("../src/pages/no/chat.astro", import.meta.url), "utf8");
assert.ok((clientSource.match(/stateToken: readStateToken\(\)/g) ?? []).length === 2, "text and image paths carry state token");
assert.ok((clientSource.match(/acceptStateToken\(payload\)/g) ?? []).length === 2, "text and image paths commit delivered state token");
assert.ok((clientSource.match(/await ensureSessionId\(\)/g) ?? []).length === 2, "text and image paths wait for tab identity");
assert.match(clientSource, /performance\.getEntriesByType\("navigation"\)/);
assert.match(clientSource, /sessionStorage\.removeItem\(STATE_TOKEN_KEY\)/);
assert.match(clientSource, /new BroadcastChannel\(CHAT_SESSION_PRESENCE_CHANNEL\)/);

console.log("Conversation state + policy v0.1 contract OK");
