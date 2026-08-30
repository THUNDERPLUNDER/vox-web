import assert from "node:assert/strict";

const feedback = await import("../src/lib/conversation-feedback-v01.ts");

const valid = {
  feedback_reference: `feedback-${"a".repeat(32)}`,
  score: "partial",
  selected_reasons: ["too_long", "wrong_next_step"],
  optional_comment: "Kort og eksplisitt feedback.",
  route: "/no/chat/",
};

assert.equal(feedback.validateConversationFeedback(valid).ok, true);
assert.equal(feedback.validateConversationFeedback({ ...valid, score: "great" }).ok, false);
assert.equal(feedback.validateConversationFeedback({ ...valid, selected_reasons: ["unknown"] }).ok, false);
assert.equal(feedback.validateConversationFeedback({ ...valid, optional_comment: "x".repeat(501) }).ok, false);
assert.equal(feedback.validateConversationFeedback({ ...valid, route: "/backstage/" }).ok, false);
assert.equal(feedback.validateConversationFeedback({ ...valid, transcript: "must never be accepted" }).ok, false);
assert.equal(feedback.validateConversationFeedback({ ...valid, ces_session_id: "must never be accepted" }).ok, false);

const normalized = feedback.validateConversationFeedback({ ...valid, route: "/no/chat" });
assert.equal(normalized.ok, true);
if (normalized.ok) assert.equal(normalized.value.route, "/no/chat/");

console.log("Conversation feedback contract OK");
